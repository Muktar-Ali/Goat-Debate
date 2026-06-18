import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { doCreateUserWithEmailAndPassword } from '../firebase/auth';
import { useAuth } from '../contexts/authContext';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { userLoggedIn } = useAuth();

    if (userLoggedIn) {
        navigate('/');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setError('');
        setLoading(true);
        try {
            await doCreateUserWithEmailAndPassword(email, password);
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
            <h1 className="text-4xl font-bold text-center pt-20">Sign Up to GOAT Debate</h1>
            <span className="block text-center text-gray-400">Join to cast your vote!</span>
            <div className="flex justify-center mt-12">
                <form onSubmit={handleSubmit} className="bg-slate-900/70 backdrop-blur-md p-8 rounded-lg w-full max-w-md space-y-6">
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                        <input
                            type="email" id="email" required
                            value={email} onChange={e => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                        <input
                            type="password" id="password" required
                            value={password} onChange={e => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">Confirm Password</label>
                        <input
                            type="password" id="confirmPassword" required
                            value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Confirm your password"
                        />
                    </div>
                    <button
                        type="submit" disabled={loading}
                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-md text-white font-semibold transition-colors duration-300"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                    <p className="text-center text-gray-400 text-sm">
                        Already have an account?{' '}
                        <Link to="/signin" className="text-blue-400 hover:underline">Sign In</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
