import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { doc, onSnapshot, runTransaction, increment, serverTimestamp } from "firebase/firestore";
import Navbar from "./components/Navbar.jsx";
import Register from "./components/Register.jsx";
import Signin from "./components/Signin.jsx";
import Voting from "./components/Voting.jsx";
import Discussion from "./components/Discussion.jsx";
import { AuthProvider, useAuth } from "./contexts/authContext";
import { db } from "./firebase/firebase";

function Home() {
    const navigate = useNavigate();
    const { currentUser, userLoggedIn } = useAuth();
    const [votes, setVotes] = useState({ lebron: 0, jordan: 0 });
    const [userVote, setUserVote] = useState(null);
    const [voting, setVoting] = useState(false);
    const [voteError, setVoteError] = useState('');

    useEffect(() => {
        const summaryRef = doc(db, "votes", "summary");
        return onSnapshot(summaryRef, (snap) => {
            if (snap.exists()) setVotes(snap.data());
        }, (err) => console.error("Firestore read error:", err));
    }, []);

    useEffect(() => {
        if (!currentUser) { setUserVote(null); return; }
        const userVoteRef = doc(db, "userVotes", currentUser.uid);
        return onSnapshot(userVoteRef, (snap) => {
            setUserVote(snap.exists() ? snap.data().player : null);
        });
    }, [currentUser]);

    const handleVote = async (player) => {
        if (!userLoggedIn) { navigate("/signin"); return; }
        if (userVote || voting) return;
        setVoting(true);
        setVoteError('');
        const summaryRef = doc(db, "votes", "summary");
        const userVoteRef = doc(db, "userVotes", currentUser.uid);
        try {
            await runTransaction(db, async (transaction) => {
                const snap = await transaction.get(userVoteRef);
                if (snap.exists()) throw new Error("Already voted");
                transaction.set(userVoteRef, { player, timestamp: serverTimestamp() });
                transaction.set(summaryRef, { [player]: increment(1) }, { merge: true });
            });
        } catch (err) {
            if (err.message !== "Already voted") {
                console.error(err);
                setVoteError("Vote failed — check Firestore security rules in Firebase console.");
            }
        }
        setVoting(false);
    };

    const totalVotes = (votes.lebron ?? 0) + (votes.jordan ?? 0);

    return (
        <div
            className="min-h-screen text-white overflow-hidden"
            style={{ background: 'radial-gradient(ellipse at 15% 60%, rgba(234,179,8,0.1) 0%, transparent 55%), radial-gradient(ellipse at 85% 60%, rgba(239,68,68,0.1) 0%, transparent 55%), #020617' }}
        >
            <Navbar />

            {/* Header */}
            <div className="text-center pt-24 pb-8 px-4">
                <h1 className="text-5xl sm:text-6xl font-black tracking-tight">
                    Who is the{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">GOAT?</span>
                </h1>
                <p className="text-gray-400 mt-3 text-lg">The debate ends here. Cast your vote.</p>

                {totalVotes > 0 && (
                    <div className="flex items-center justify-center gap-2 mt-3">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-green-400 text-sm font-medium">{totalVotes} votes cast live</span>
                    </div>
                )}
            </div>

            {voteError && (
                <p className="text-center text-red-400 text-sm mb-4">{voteError}</p>
            )}

            {/* Cards */}
            <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 gap-4 sm:gap-8">

                {/* LeBron */}
                <div
                    className={`w-[42%] max-w-sm rounded-2xl flex flex-col transition-all duration-300
                        ${userVote === "lebron"
                            ? "ring-2 ring-yellow-400 shadow-[0_0_40px_rgba(234,179,8,0.25)]"
                            : "hover:shadow-[0_0_25px_rgba(234,179,8,0.12)]"
                        }`}
                    style={{ background: 'linear-gradient(160deg, rgba(234,179,8,0.07) 0%, rgba(2,6,23,0.95) 60%)' }}
                >
                    <div className="flex flex-col items-center p-6 pt-8">
                        <img src="lebron.jpg" alt="LeBron James" className="w-36 h-36 sm:w-44 sm:h-44 object-cover rounded-full border-2 border-yellow-400/30" />
                        <h2 className="text-xl sm:text-2xl font-bold mt-4">LeBron James</h2>
                        <p className="text-yellow-400/70 text-xs mt-1 text-center">4× Champion · 4× Finals MVP · 4× League MVP</p>
                        <p className="text-gray-500 text-sm mt-4 font-medium">{votes.lebron ?? 0} votes</p>
                    </div>
                    <div className="px-5 pb-6">
                        {userVote ? (
                            userVote === "lebron" && (
                                <div className="w-full py-2.5 text-center text-yellow-400 border border-yellow-400/50 rounded-xl text-sm font-semibold bg-yellow-400/5">
                                    Your Vote ✓
                                </div>
                            )
                        ) : (
                            <button
                                onClick={() => handleVote("lebron")}
                                disabled={voting}
                                className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black font-bold rounded-xl transition-all duration-200 hover:shadow-[0_0_20px_rgba(234,179,8,0.5)] text-sm uppercase tracking-wider"
                            >
                                {userLoggedIn ? "Vote LeBron" : "Sign In to Vote"}
                            </button>
                        )}
                    </div>
                </div>

                {/* VS */}
                <div className="shrink-0 flex flex-col items-center">
                    <span className="text-5xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-gray-400 to-gray-700 select-none">
                        VS
                    </span>
                </div>

                {/* Jordan */}
                <div
                    className={`w-[42%] max-w-sm rounded-2xl flex flex-col transition-all duration-300
                        ${userVote === "jordan"
                            ? "ring-2 ring-red-400 shadow-[0_0_40px_rgba(239,68,68,0.25)]"
                            : "hover:shadow-[0_0_25px_rgba(239,68,68,0.12)]"
                        }`}
                    style={{ background: 'linear-gradient(160deg, rgba(239,68,68,0.07) 0%, rgba(2,6,23,0.95) 60%)' }}
                >
                    <div className="flex flex-col items-center p-6 pt-8">
                        <img src="jordan_image.jpg" alt="Michael Jordan" className="w-36 h-36 sm:w-44 sm:h-44 object-cover rounded-full border-2 border-red-400/30" />
                        <h2 className="text-xl sm:text-2xl font-bold mt-4">Michael Jordan</h2>
                        <p className="text-red-400/70 text-xs mt-1 text-center">6× Champion · 6× Finals MVP · 5× League MVP</p>
                        <p className="text-gray-500 text-sm mt-4 font-medium">{votes.jordan ?? 0} votes</p>
                    </div>
                    <div className="px-5 pb-6">
                        {userVote ? (
                            userVote === "jordan" && (
                                <div className="w-full py-2.5 text-center text-red-400 border border-red-400/50 rounded-xl text-sm font-semibold bg-red-400/5">
                                    Your Vote ✓
                                </div>
                            )
                        ) : (
                            <button
                                onClick={() => handleVote("jordan")}
                                disabled={voting}
                                className="w-full py-3 bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white font-bold rounded-xl transition-all duration-200 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] text-sm uppercase tracking-wider"
                            >
                                {userLoggedIn ? "Vote Jordan" : "Sign In to Vote"}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Guest nudge */}
            {!userLoggedIn && (
                <p className="text-center text-gray-600 text-sm mt-8 pb-12">
                    Don't have an account?{' '}
                    <a href="/register" className="text-blue-400 hover:underline">Sign up free</a> to cast your vote
                </p>
            )}
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/signin" element={<Signin />} />
                    <Route path="/voting" element={<Voting />} />
                    <Route path="/debate" element={<Discussion />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
