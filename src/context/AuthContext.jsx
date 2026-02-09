// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import
    {
        GoogleAuthProvider,
        signInWithPopup,
        signOut,
        onAuthStateChanged
    } from "firebase/auth";
import { auth, db } from "../lib/firebase"; // Make sure this path is correct
import { members as initialMembers } from "../lib/data";
import { collection, getDocs, doc, writeBatch, updateDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ( { children } ) =>
{
    const [ user, setUser ] = useState( null );
    const [ loading, setLoading ] = useState( true );
    const [ members, setMembers ] = useState( [] ); // State to hold members from Firestore
    const [ membersLoading, setMembersLoading ] = useState( true );

    // 0. Fetch Members from Firestore (and sync if empty)
    useEffect( () => {
        const fetchMembers = async () => {
            try {
                const membersRef = collection( db, "members" );
                const snapshot = await getDocs( membersRef );

                if ( snapshot.empty ) {
                    console.log( "Seeding Firestore with initial members..." );
                    const batch = writeBatch( db );
                    initialMembers.forEach( ( member ) => {
                        const docRef = doc( db, "members", String( member.id ) );
                        batch.set( docRef, member );
                    } );
                    await batch.commit();
                    setMembers( initialMembers );
                } else {
                    let fetchedMembers = snapshot.docs.map( doc => ( { id: parseInt(doc.id), ...doc.data() } ) );
                    
                    // --- SYNC CHECK: Update Firestore if local data.js has new 'authEmail' fields ---
                    const batch = writeBatch(db);
                    let needsCommit = false;

                    fetchedMembers = fetchedMembers.map(fm => {
                        const localMember = initialMembers.find(im => im.id === fm.id);
                        if (localMember && localMember.authEmail && localMember.authEmail !== fm.authEmail) {
                            console.log(`Syncing authEmail for ${fm.name}: ${localMember.authEmail}`);
                            const docRef = doc(db, "members", String(fm.id));
                            batch.update(docRef, { authEmail: localMember.authEmail });
                            needsCommit = true;
                            return { ...fm, authEmail: localMember.authEmail }; // Update local state too
                        }
                        return fm;
                    });

                    if (needsCommit) {
                        try {
                            await batch.commit();
                            console.log("Firestore synced with local data.js changes.");
                        } catch (err) {
                            console.error("Error syncing Firestore:", err);
                        }
                    }

                    // Sort by ID to keep order
                    fetchedMembers.sort((a, b) => a.id - b.id);
                    setMembers( fetchedMembers );
                }
            } catch ( error ) {
                console.error( "Error fetching members:", error );
                // Fallback to static data if DB fails
                setMembers( initialMembers );
            } finally {
                setMembersLoading( false );
            }
        };

        fetchMembers();
    }, [] );

    // 1. The Real Login Function
    const loginWithGoogle = async ( selectedMemberId ) =>
    {
        try
        {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup( auth, provider );
            const googleUser = result.user;

            // 2. Security Check: Does the Google Email match the Selected Member?
            // Use the members from STATE (Firestore), not the static file
            const selectedMember = members.find( m => m.id === parseInt(selectedMemberId) );

            if ( !selectedMember ) {
                throw new Error("Member not found!");
            }

            
            // 2. Security / Claim Check
            
            // CASE A: Profile is NOT claimed yet (authEmail is missing/empty)
            // ACTION: Lock this profile to the current email (First Come, First Served)
            if ( !selectedMember.authEmail ) {
                console.log(`First login for ${selectedMember.name}. Linking to ${googleUser.email}...`);
                
                // Update Firestore
                const memberRef = doc(db, "members", String(selectedMember.id));
                await updateDoc(memberRef, { authEmail: googleUser.email });
                
                // Update Local State immediately so we don't need a refresh
                const updatedMember = { ...selectedMember, authEmail: googleUser.email };
                setMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
                
                // Proceed to login
                const mergedUser = {
                    ...googleUser,
                    ...updatedMember,
                    uid: googleUser.uid
                };
                setUser( mergedUser );
                return { success: true };
            }

            // CASE B: Profile IS claimed (authEmail exists)
            // ACTION: Verify email matches
            // Allow login if:
            // 1. Google Email matches the dedicated 'authEmail' (Real Gmail)
            // 2. OR Google Email matches the display 'email' (Professional/Previous) - Optional, mainly for Admin fallback
            const allowedEmail = selectedMember.authEmail; // Strict check on authEmail, usually. Fallback to basic email if needed? 
            // Let's keep the dual check for safety if they used the display email as a google login
            const isMatch = (googleUser.email.toLowerCase() === allowedEmail.toLowerCase()) || 
                            (selectedMember.email && googleUser.email.toLowerCase() === selectedMember.email.toLowerCase());

            if ( isMatch )
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
                    error: `Identity Mismatch! This profile is linked to ${allowedEmail}. You cannot access it with ${googleUser.email}.`
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
                // If they refresh, find their member data again using their email
                // Note: This relies on 'members' being loaded. If members are loading, this might need a check.
                // However, onAuthStateChanged helper usually runs after. 
                // To be safe, we might need to defer this or rely on the user object being updated when members load.
                // For now, let's fetch strictly from the loaded members or wait? 
                // Actually, inside this callback, 'members' state from closure might be stale if strict mode.
                // Better approach: Re-query the DB for this user or rely on the state update loop.
                
                // Hack: We can't easily access the latest 'members' state inside this closure without refs or dependency.
                // But since we are moving to Firestore, let's just re-fetch the single user or let the UI handle it.
                // If they refresh, find their member data again using their email
                // We trust the session for now. matching with member details happens in the useEffect below once members are loaded.
                setUser( currentUser );
            } else 
            {
                setUser( null );
            }
            setLoading( false );
        } );
        return () => unsubscribe();
    }, [] );

    // 4. Enrich User with Member Data (Effect to sync user with members list)
    useEffect(() => {
        if (user && members.length > 0 && !user.role) {
            const memberData = members.find(m => (m.authEmail || m.email) === user.email);
            if (memberData) {
                setUser(prev => ({ ...prev, ...memberData }));
            } else {
                 // If logged in user is not in the members list... potentially logout?
                 // But strictly speaking, we checked at login.
                 // If data changed REMOTELY, we might want to kick them out? 
                 // For now, safe to keep as is.
            }
        }
    }, [user, members]);

    return (
        <AuthContext.Provider value={ { user, loginWithGoogle, logout, loading, members, membersLoading } }>
            { !loading && children }
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext( AuthContext );