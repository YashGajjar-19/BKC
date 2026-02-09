
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Make sure to import AnimatePresence
import
    {
        Settings as SettingsIcon, Bell, Moon, Sun, Monitor,
        Shield, Key, User, Save, LogOut, Laptop, Smartphone,
        Volume2, VolumeX, Eye, EyeOff, Globe, Zap, ToggleLeft, ToggleRight
    } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { doc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

// --- Components ---

const Section = ( { title, description, children, delay = 0 } ) => (
    <motion.div
        initial={ { opacity: 0, y: 20 } }
        animate={ { opacity: 1, y: 0 } }
        transition={ { delay, type: "spring", stiffness: 100, damping: 20 } }
        className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 mb-8"
    >
        <div className="mb-8 border-b border-slate-100 pb-6">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">{ title }</h3>
            <p className="text-slate-500 font-medium">{ description }</p>
        </div>
        { children }
    </motion.div>
);

const Toggle = ( { label, description, active, onChange } ) => (
    <div className="flex items-center justify-between py-4 group">
        <div>
            <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{ label }</h4>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{ description }</p>
        </div>
        <button
            onClick={ () => onChange( !active ) }
            className={ `relative w-14 h-8 rounded-full transition-colors duration-300 ${ active ? "bg-indigo-600" : "bg-slate-200"
                }` }
        >
            <motion.div
                initial={ false }
                animate={ { x: active ? 26 : 4 } }
                className="w-6 h-6 bg-white rounded-full shadow-md"
            />
        </button>
    </div>
);

const InputGroup = ( { label, type = "text", value, onChange, icon: Icon, disabled = false } ) => (
    <div className="space-y-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{ label }</label>
        <div className="relative">
            <input
                type={ type }
                value={ value }
                onChange={ ( e ) => onChange( e.target.value ) }
                disabled={ disabled }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 font-bold text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Icon size={ 20 } />
            </div>
        </div>
    </div>
);

export default function Settings ()
{
    const { user, logout } = useAuth();
    const [ loading, setLoading ] = useState( false );
    const [ successMsg, setSuccessMsg ] = useState( "" );

    // State
    const [ profile, setProfile ] = useState( {
        name: user?.name || "",
        title: user?.title || "",
        email: user?.email || "",
    } );

    const [ settings, setSettings ] = useState( {
        notifications: true,
        sound: false,
        theme: "system",
        publicVis: true,
        twoFactor: true
    } );

    // Handlers
    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            await setDoc(doc(db, "users", user.uid), {
                name: profile.name,
                title: profile.title,
                email: profile.email, // Ensure email is in the doc for Team.jsx merging/matching
            }, { merge: true });
            
            setSuccessMsg("Profile Updated Successfully");
            setTimeout(() => setSuccessMsg(""), 3000);
        } catch (error) {
            console.error("Save Error:", error);
            setSuccessMsg("Error saving changes.");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-24">

            {/* Header */}
            <div className="flex flex-col md:flex-row items-end justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-widest mb-4">
                        <SettingsIcon size={12} />
                        Configuration
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none mb-4">
                        Global Settings.
                    </h1>
                    <p className="text-slate-500 font-medium text-lg max-w-2xl leading-relaxed">
                        Customize your command center interface, manage account security, and configure system preferences.
                    </p>
                </div>
            </div>

            {/* Profile Settings */}
            <Section title="Agent Profile" description="Update your public identity and credentials." delay={0.1}>
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Avatar */}
                    <div className="shrink-0 flex flex-col items-center gap-4">
                        <div className="w-32 h-32 rounded-[2rem] overflow-hidden border-4 border-slate-50 shadow-2xl relative group">
                            <img src={user?.image || `https://ui-avatars.com/api/?name=${user?.name || 'Agent'}`} alt="Profile" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <span className="text-white text-xs font-bold uppercase tracking-widest">Change</span>
                            </div>
                        </div>
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-indigo-100">
                            {user?.role || "Agent"}
                        </span>
                    </div>

                    {/* Form */ }
                    <div className="flex-1 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputGroup
                                label="Codename / Name"
                                value={ profile.name }
                                onChange={ ( v ) => setProfile( { ...profile, name: v } ) }
                                icon={ User }
                            />
                            <InputGroup
                                label="Official Title"
                                value={ profile.title }
                                onChange={ ( v ) => setProfile( { ...profile, title: v } ) }
                                icon={ Shield }
                            />
                        </div>
                        <InputGroup
                            label="Comms Address"
                            value={ profile.email }
                            onChange={ () => { } }
                            icon={ Monitor }
                            disabled={ true }
                        />

                        <div className="flex items-center justify-between pt-4">
                            <AnimatePresence>
                                { successMsg && (
                                    <motion.span
                                        initial={ { opacity: 0, x: -10 } }
                                        animate={ { opacity: 1, x: 0 } }
                                        exit={ { opacity: 0 } }
                                        className="text-emerald-600 text-xs font-bold uppercase tracking-widest flex items-center gap-2"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        { successMsg }
                                    </motion.span>
                                ) }
                            </AnimatePresence>

                            <button
                                onClick={ handleSaveProfile }
                                disabled={ loading }
                                className="ml-auto px-8 py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-900/10 transition-all text-sm flex items-center gap-2 active:scale-95"
                            >
                                { loading ? "Saving..." : <><Save size={ 18 } /> Save Changes</> }
                            </button>
                        </div>
                    </div>
                </div>
            </Section>

            {/* System Preferences */ }
            <Section title="System Preferences" description="Adjust your interface and notification alerts." delay={ 0.2 }>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                    <Toggle
                        label="Mission Alerts"
                        description="Receive updates on new directives"
                        active={ settings.notifications }
                        onChange={ ( v ) => setSettings( { ...settings, notifications: v } ) }
                    />
                    <Toggle
                        label="Interface Sounds"
                        description="Haptic feedback and UI sounds"
                        active={ settings.sound }
                        onChange={ ( v ) => setSettings( { ...settings, sound: v } ) }
                    />
                    <Toggle
                        label="Public Visibility"
                        description="Show profile on public roster"
                        active={ settings.publicVis }
                        onChange={ ( v ) => setSettings( { ...settings, publicVis: v } ) }
                    />
                    <Toggle
                        label="2-Factor Auth"
                        description="Require hardware key for login"
                        active={ settings.twoFactor }
                        onChange={ ( v ) => setSettings( { ...settings, twoFactor: v } ) }
                    />
                </div>
            </Section>

            {/* Danger Zone */ }
            <Section title="Session Control" description="Manage active sessions and security." delay={ 0.3 }>
                <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm">
                                <Laptop size={ 20 } />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm">Windows PC - Chrome</h4>
                                <p className="text-xs font-medium text-slate-400">Mumbai, India • Current Session</p>
                            </div>
                        </div>
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
                            Active
                        </span>
                    </div>

                    <div className="pt-6 flex justify-start">
                        <button
                            onClick={ () => logout() }
                            className="px-6 py-3 rounded-xl font-bold text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100 transition-colors text-sm flex items-center gap-2"
                        >
                            <LogOut size={ 18 } />
                            Terminate Session
                        </button>
                    </div>
                </div>
            </Section>

        </div>
    );
}
