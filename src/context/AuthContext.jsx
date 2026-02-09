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

const AuthContext = createContext();

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
            const result = await signInWithPopup( auth, provider );
            const googleUser = result.user;

            // SCENARIO A: Core Team Login (Selected from Grid)
            if ( selectedMemberId )
            {
                const selectedMember = members.find( m => m.id === selectedMemberId );

                // Strict Email Check for Core Team
                if ( googleUser.email === selectedMember.email )
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
                        error: `Identity Mismatch! This profile belongs to ${ selectedMember.email }.`
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
            return { success: false, error: error.message };
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
                        // we can either auto-create here or logout. 
                        // For safety, let's logout and make them click "Login" again to trigger creation.
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

    return (
        <AuthContext.Provider value={ { user, loginWithGoogle, logout, loading } }>
            { !loading && children }
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext( AuthContext );