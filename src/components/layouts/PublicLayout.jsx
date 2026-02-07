// src/components/layouts/PublicLayout.jsx
import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

export default function PublicLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-purple-500 selection:text-white">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white">
                            <ShieldAlert size={20} className="group-hover:rotate-12 transition-transform" />
                        </div>
                        <span className="font-bold text-slate-900 tracking-tight">BAKCHODI <span className="text-slate-400 font-light">INTL.</span></span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <Link to="/login" className="px-5 py-2 text-sm font-bold text-slate-600 hover:text-purple-600 transition-colors">
                            Login
                        </Link>
                        <Link to="/join" className="px-5 py-2 text-sm font-bold bg-slate-900 text-white rounded-full hover:bg-purple-600 transition-all">
                            Join the Chaos
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Page Content */}
            <main className="pt-16">
                {children}
            </main>

            {/* Footer (Simple Version for now) */}
            <footer className="py-12 text-center text-slate-400 text-sm">
                <p>&copy; 2026 Bakchodi International. All wrongs reserved.</p>
            </footer>
        </div>
    );
}