import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { doSignOut } from "../firebase/auth";

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { userLoggedIn } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await doSignOut();
        setMobileMenuOpen(false);
        navigate('/');
    };

    return (
        <nav className="fixed top-0 w-full z-50 transition-all duration-300 bg-slate-950/20 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14 sm:h-16 md:h-20">
                    <Link to="/" className="flex items-center space-x-1 group cursor-pointer">
                        <span className="text-lg sm:text-xl md:text-2xl font-medium">
                            <span className="text-white">Goat</span>
                            <span className="text-red-400">Debate</span>
                        </span>
                    </Link>
                    <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                        <Link to="/voting" className="text-gray-300 hover:text-white text-sm lg:text-base">Voting</Link>
                        <Link to="/debate" className="text-gray-300 hover:text-white text-sm lg:text-base">Debate</Link>
                        {userLoggedIn ? (
                            <button onClick={handleSignOut} className="text-gray-300 hover:text-white text-sm lg:text-base">Sign Out</button>
                        ) : (
                            <>
                                <Link to="/signin" className="text-gray-300 hover:text-white text-sm lg:text-base">Sign In</Link>
                                <Link to="/register" className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm font-medium transition-colors">Sign Up</Link>
                            </>
                        )}
                    </div>
                    <button className="md:hidden p-2 text-gray-300 hover:text-white" onClick={() => setMobileMenuOpen(prev => !prev)}>
                        {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
                    </button>
                </div>
            </div>
            {mobileMenuOpen && (
                <div className="md:hidden bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-4 py-4 space-y-4">
                    <div className="px-4 py-4 space-y-3">
                        <Link to="/voting" className="block text-gray-300 hover:text-white text-sm" onClick={() => setMobileMenuOpen(false)}>Voting</Link>
                        <Link to="/debate" className="block text-gray-300 hover:text-white text-sm" onClick={() => setMobileMenuOpen(false)}>Debate</Link>
                        {userLoggedIn ? (
                            <button onClick={handleSignOut} className="block text-gray-300 hover:text-white text-sm">Sign Out</button>
                        ) : (
                            <>
                                <Link to="/signin" className="block text-gray-300 hover:text-white text-sm" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                                <Link to="/register" className="block text-gray-300 hover:text-white text-sm" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
