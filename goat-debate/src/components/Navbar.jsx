import { Menu, X } from "lucide-react";
import { useState } from "react";
export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    return( 
    <nav className="fixed top-0 w-full z-50 transition-all duration-300 bg-slate-950/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-14 sm:h-16 md:h-20">
                <div className="flex items-center space-x-1 group cursor-pointer">
                <span className="text-lg sm:text-xl md:text-2xl font-medium">
                    <span className="text-white">Goat</span>
                    <span className="text-red-400">Debate</span>
                </span>
                </div>
                {/*Nav links */}
                <div className=" hidden md:flex items-center space-x-6 lg:space-x-8">
                    <a 
                    href="#features" 
                    className="text-gray-300 hover:text-white text-sm lg:text-base">Voting</a>
                     <a 
                    href="#pricing" 
                    className="text-gray-300 hover:text-white text-sm lg:text-base">Sign Up</a>
                     <a 
                    href="#testimonials" 
                    className="text-gray-300 hover:text-white text-sm lg:text-base">Debate</a>
                </div>
                <button className="md:hidden p-2 text-gray-300 hover:text-white" onClick={() => setMobileMenuOpen((prev) => !prev)}>
                    {mobileMenuOpen ? (
                        <X className="w-5 h-5 sm:w-6 sm:h-6" />) : (
                    <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                        )}
                </button>
            </div>
        </div>
        {mobileMenuOpen && (
            <div className="md:hidden bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 animate-in slideInFromTop duration-300 px-4 py-4 space-y-4">
                <div className="px-4 py-4 sm:py-6 space-y-3 sm:space-y">
                    <a href="#features" className="block text-gray-300 hover:text-white text-sm lg:text-base" onClick={() => setMobileMenuOpen(false)}>Voting</a>
                    <a href="#pricing" className="block text-gray-300 hover:text-white text-sm lg:text-base" onClick={() => setMobileMenuOpen(false)}>Sign Up</a>
                    <a href="#testimonials" className="block text-gray-300 hover:text-white text-sm lg:text-base" onClick={() => setMobileMenuOpen(false)}>Debate</a>
                </div>
            </div>
        )}
    </nav>

    );
}