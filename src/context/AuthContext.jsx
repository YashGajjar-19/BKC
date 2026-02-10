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

            let finalUserData = null;

            // SCENARIO A: Core Team Login (Selected from Grid)
            if ( selectedMemberId )
            {
                const selectedMember = members.find( m => m.id === selectedMemberId );
                
                if (!selectedMember) throw new Error("Member profile not found.");

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
                    finalUserData = {
                        uid: googleUser.uid,
                        email: googleUser.email,
                        name: selectedMember.name, // Corrected to match app schema
                        image: selectedMember.image, // Corrected to match app schema
                        role: selectedMember.role,
                        title: selectedMember.title,
                        memberId: selectedMember.id,
                        isCoreTeam: true,
                        isAdmin: selectedMember.isAdmin,
                        lastLogin: new Date().toISOString()
                    };

                    // CRITICAL FIX: Persist Core Team identity to Firestore
                    // This ensures onAuthStateChanged finds them on reload
                    await setDoc(doc(db, "users", googleUser.uid), finalUserData, { merge: true });
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
                    const userData = userDoc.data();
                    // Self-healing: Ensure name/image exist if created with wrong schema
                    if (!userData.name && userData.displayName) userData.name = userData.displayName;
                    if (!userData.image && userData.photoURL) userData.image = userData.photoURL;
                    
                    // User exists -> Log them in
                    finalUserData = { ...googleUser, ...userData };
                } else
                {
                    // New User -> AUTO-REGISTER (No Code Needed)
                    finalUserData = {
                        uid: googleUser.uid,
                        email: googleUser.email,
                        name: googleUser.displayName, // Corrected from displayName
                        image: googleUser.photoURL,   // Corrected from photoURL
                        role: "Field Agent",
                        title: "Operative",
                        createdAt: new Date().toISOString(),
                        lastLogin: new Date().toISOString()
                    };

                    await setDoc( userDocRef, finalUserData );
                }
            }
            
            setUser( finalUserData );
            return { success: true };

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

    // 2. Persistent Session Restoration
    useEffect( () =>
    {
        const unsubscribe = onAuthStateChanged( auth, async ( currentUser ) =>
        {
            if ( currentUser )
            {
                // ALWAYS check Firestore First (Unified Source of Truth)
                const userDocRef = doc( db, "users", currentUser.uid );
                
                try {
                    const userSnap = await getDoc( userDocRef );
                    
                    if ( userSnap.exists() )
                    {
                        const userData = userSnap.data();
                        
                        // Self-healing: Restore sessions created with broken schema
                        if (!userData.name && userData.displayName) userData.name = userData.displayName;
                        if (!userData.image && userData.photoURL) userData.image = userData.photoURL;

                        // Restore session with full profile data
                        setUser( { ...currentUser, ...userData } );
                    } 
                    else 
                    {
                        // Fallback: Check Data.js for hardcoded emails (Legacy Support)
                        const staticMember = members.find( m => m.email === currentUser.email && m.email !== "" );

                        if (staticMember) {
                            const restoredUser = {
                                ...currentUser,
                                ...staticMember,
                                isCoreTeam: true,
                                memberId: staticMember.id
                            };
                            setUser(restoredUser);
                            // Auto-heal: Create missing Firestore doc
                            setDoc(userDocRef, restoredUser, { merge: true }).catch(console.error);
                        } else {
                            // User authenticated with Google but has no profile data (Registration pending)
                            // DO NOT SIGN OUT HERE. 
                            // Why? Because loginWithGoogle() might be running right now and about to write the doc.
                            // If we sign out, we kill the login flow.
                            // Just leave user as null or partial state until login flow completes.
                            console.warn("User has auth session but no profile. Waiting for registration...");
                            setUser(null); 
                        }
                    }
                } catch (err) {
                    console.error("Session restore error:", err);
                    setUser(null);
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