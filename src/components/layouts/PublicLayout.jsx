// src/components/layouts/PublicLayout.jsx
import Header from "../ui/Header";
import Footer from "../ui/Footer";

export default function PublicLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
            {/* Header (Fixed) */}
            <Header />

            {/* Page Content - Full Width to allow sections to control their own backgrounds */}
            <main className="w-full">
                {children}
            </main>

            {/* Footer (Full Version) */}
            <Footer />
        </div>
    );
}