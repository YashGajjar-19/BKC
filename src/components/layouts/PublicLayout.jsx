import Header from "../ui/Header";

export default function PublicLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-purple-500 selection:text-white">
            {/* New Premium Header */}
            <Header />

            {/* Page Content */}
            <main className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
                {children}
            </main>

            {/* Footer (Simple Version for now) */}
            <footer className="py-12 text-center text-slate-400 text-sm">
                <p>&copy; 2026 Bakchodi International. All wrongs reserved.</p>
            </footer>
        </div>
    );
}