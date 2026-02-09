// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import
{
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { members } from "../lib/data";

const AuthContext = createContext({
    user: null,
    loading: true,
    loginWithGoogle: async () => ({ success: false, error: "Auth check not ready." }),
    logout: async () => {},
});

export const AuthProvider = ( { children } ) =>
{
    const [ user, setUser ] = useState( null );
    const [ loading, setLoading ] = useState( true );

    // 1. Unified Login & Auto-Signup Function
    const loginWithGoogle = async ( selectedMemberId = null ) =>
    {
        try
        {
            const provider = new GoogleAuthProvider();
            // Force account selection to avoid auto-picking wrong account
            provider.setCustomParameters({ prompt: 'select_account' });
            
            const result = await signInWithPopup( auth, provider );
            const googleUser = result.user;

            // SCENARIO A: Core Team Login (Selected from Grid)
            if ( selectedMemberId )
            {
                const selectedMember = members.find( m => m.id === selectedMemberId );
                
                // Allow login if:
                // 1. Email matches standard 'email' field
                // 2. Email matches secret 'authEmail' field
                // 3. The config has a placeholder/empty email (Dev Bypass)
                const isAuthorized = 
                    googleUser.email === selectedMember.email || 
                    googleUser.email === selectedMember.authEmail ||
                    selectedMember.email === "" ||
                    selectedMember.email === "[EMAIL_ADDRESS]";

                // Strict Email Check for Core Team
                if ( isAuthorized )
                {
                    const mergedUser = {
                        ...googleUser,
                        ...selectedMember,
                        uid: googleUser.uid,
                        isCoreTeam: true
                    };
                    setUser( mergedUser );
                    return { success: true };
                } else
                {
                    await signOut( auth );
                    return {
                        success: false,
                        error: `Identity Mismatch! This profile is linked to ${selectedMember.authEmail || selectedMember.email || "a different account"}. Your email: ${googleUser.email}`
                    };
                }
            }

            // SCENARIO B: General Agent Login (Auto-Signup)
            else
            {
                const userDocRef = doc( db, "users", googleUser.uid );
                const userDoc = await getDoc( userDocRef );

                if ( userDoc.exists() )
                {
                    // User exists -> Log them in
                    setUser( { ...googleUser, ...userDoc.data() } );
                } else
                {
                    // New User -> AUTO-REGISTER (No Code Needed)
                    const newAgentData = {
                        name: googleUser.displayName,
                        email: googleUser.email,
                        image: googleUser.photoURL,
                        role: "Field Agent",
                        title: "Operative",
                        createdAt: new Date().toISOString()
                    };

                    await setDoc( userDocRef, newAgentData );
                    setUser( { ...googleUser, ...newAgentData } );
                }

                return { success: true };
            }

        } catch ( error )
        {
            console.error( "Login Error:", error );
            // Helper to return cleaner error messages
            let errorMessage = error.message;
            if (error.code === 'auth/popup-closed-by-user') {
                errorMessage = "Login cancelled. You closed the popup.";
            } else if (error.code === 'auth/popup-blocked') {
                errorMessage = "Login popup blocked. Please allow popups.";
            }

            return { success: false, error: errorMessage };
        }
    };

    const logout = async () =>
    {
        await signOut( auth );
        setUser( null );
    };

    // 2. Persistent Session
    useEffect( () =>
    {
        const unsubscribe = onAuthStateChanged( auth, async ( currentUser ) =>
        {
            if ( currentUser )
            {
                // Check Data.js first (Core Team)
                const staticMember = members.find( m => m.email === currentUser.email );

                if ( staticMember )
                {
                    setUser( { ...currentUser, ...staticMember, isCoreTeam: true } );
                } else
                {
                    // Check Firestore (General Agents)
                    const userDoc = await getDoc( doc( db, "users", currentUser.uid ) );
                    if ( userDoc.exists() )
                    {
                        setUser( { ...currentUser, ...userDoc.data() } );
                    } else
                    {
                        // If valid Google session but no Firestore data (rare edge case),
                        signOut( auth );
                        setUser( null );
                    }
                }
            } else
            {
                setUser( null );
            }
            setLoading( false );
        } );
        return () => unsubscribe();
    }, [] );

    // Keep Provider mounted but show loader if checking auth status
    if (loading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-900 text-white gap-4">
               <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
               <p className="text-sm font-bold uppercase tracking-widest text-indigo-400">Initializing System...</p>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={ { user, loginWithGoogle, logout, loading } }>
            { children }
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};