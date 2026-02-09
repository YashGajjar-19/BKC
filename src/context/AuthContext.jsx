// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import
    {
        GoogleAuthProvider,
        signInWithPopup,
        signOut,
        onAuthStateChanged
    } from "firebase/auth";
import { auth } from "../lib/firebase"; // Make sure this path is correct
import { members } from "../lib/data";

const AuthContext = createContext();

export const AuthProvider = ( { children } ) =>
{
    const [ user, setUser ] = useState( null );
    const [ loading, setLoading ] = useState( true );

    // 1. The Real Login Function
    const loginWithGoogle = async ( selectedMemberId ) =>
    {
        try
        {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup( auth, provider );
            const googleUser = result.user;

            // 2. Security Check: Does the Google Email match the Selected Member?
            const selectedMember = members.find( m => m.id === selectedMemberId );

            if ( googleUser.email === selectedMember.email )
            {
                // SUCCESS: Merge Firebase user with your local member data
                const mergedUser = {
                    ...googleUser,
                    ...selectedMember, // Adds role, image, title to the user object
                    uid: googleUser.uid // Keep Firebase UID for database/chat
                };
                setUser( mergedUser );
                return { success: true };
            } else
            {
                // FAILURE: Wrong email for this profile
                await signOut( auth ); // Kick them out immediately
                return {
                    success: false,
                    error: `Identity Mismatch! You logged in as ${ googleUser.email }, but this profile belongs to ${ selectedMember.email }.`
                };
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

    // 3. Persistent Session
    useEffect( () =>
    {
        const unsubscribe = onAuthStateChanged( auth, ( currentUser ) =>
        {
            if ( currentUser )
            {
                // If they refresh, find their member data again using their email
                const memberData = members.find( m => m.email === currentUser.email );
                if ( memberData )
                {
                    setUser( { ...currentUser, ...memberData } );
                } else
                {
                    // If email is not in your list, force logout
                    signOut( auth );
                    setUser( null );
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