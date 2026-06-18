import { useState, useEffect, useRef } from "react";
import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Send } from "lucide-react";
import { db } from "../firebase/firebase";
import { useAuth } from "../contexts/authContext";
import Navbar from "./Navbar.jsx";

const AVATAR_COLORS = [
    "bg-blue-500", "bg-purple-500", "bg-green-500",
    "bg-orange-500", "bg-pink-500", "bg-teal-500", "bg-indigo-500",
];

function getAvatarColor(email) {
    const index = (email?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length;
    return AVATAR_COLORS[index];
}

function formatTime(timestamp) {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
}

export default function Discussion() {
    const [posts, setPosts] = useState([]);
    const [text, setText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { currentUser, userLoggedIn } = useAuth();
    const bottomRef = useRef(null);

    useEffect(() => {
        const q = query(collection(db, "posts"), orderBy("timestamp", "asc"));
        return onSnapshot(q, (snap) => {
            setPosts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }, (err) => console.error("Firestore read error:", err));
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [posts]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim() || submitting) return;
        setSubmitting(true);
        try {
            await addDoc(collection(db, "posts"), {
                text: text.trim(),
                uid: currentUser.uid,
                email: currentUser.email,
                timestamp: serverTimestamp(),
            });
            setText('');
        } catch (err) {
            console.error(err);
        }
        setSubmitting(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div
            className="min-h-screen text-white flex flex-col"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.08) 0%, transparent 60%), #020617' }}
        >
            <Navbar />

            {/* Header */}
            <div className="text-center pt-24 pb-6 px-4">
                <h1 className="text-5xl font-black tracking-tight">
                    The{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">Debate</span>
                </h1>
                <p className="text-gray-500 mt-2 text-sm">
                    {posts.length > 0 ? `${posts.length} message${posts.length !== 1 ? 's' : ''}` : 'Who is the real GOAT? You decide.'}
                </p>
            </div>

            {/* Posts */}
            <div className="flex-1 max-w-2xl mx-auto w-full px-4 pb-32 space-y-3">
                {posts.length === 0 && (
                    <div className="text-center mt-16">
                        <p className="text-5xl mb-4">🏀</p>
                        <p className="text-gray-500 font-medium">No posts yet</p>
                        <p className="text-gray-700 text-sm mt-1">Be the first to make your case</p>
                    </div>
                )}

                {posts.map(post => {
                    const isOwn = post.uid === currentUser?.uid;
                    const initial = (post.email?.[0] ?? '?').toUpperCase();
                    const avatarColor = getAvatarColor(post.email);

                    return (
                        <div
                            key={post.id}
                            className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}
                        >
                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-1 ${avatarColor}`}>
                                {initial}
                            </div>

                            {/* Bubble */}
                            <div className={`max-w-[75%] ${isOwn ? "items-end" : "items-start"} flex flex-col gap-1`}>
                                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                                    isOwn
                                        ? "bg-blue-600 text-white rounded-tr-sm"
                                        : "bg-slate-800/80 text-gray-100 rounded-tl-sm border border-slate-700/50"
                                }`}>
                                    {post.text}
                                </div>
                                <div className={`flex items-center gap-2 px-1 ${isOwn ? "flex-row-reverse" : ""}`}>
                                    <span className="text-gray-600 text-xs">{post.email?.split('@')[0]}</span>
                                    <span className="text-gray-700 text-xs">·</span>
                                    <span className="text-gray-700 text-xs">{formatTime(post.timestamp)}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <div className="fixed bottom-0 w-full backdrop-blur-md border-t border-slate-800/80 px-4 py-4"
                style={{ background: 'rgba(2,6,23,0.85)' }}>
                <div className="max-w-2xl mx-auto">
                    {userLoggedIn ? (
                        <form onSubmit={handleSubmit} className="flex gap-3 items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${getAvatarColor(currentUser.email)}`}>
                                {(currentUser.email?.[0] ?? '?').toUpperCase()}
                            </div>
                            <input
                                value={text}
                                onChange={e => setText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Make your case..."
                                className="flex-1 px-4 py-2.5 bg-slate-800/80 border border-slate-700/60 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-gray-600"
                            />
                            <button
                                type="submit"
                                disabled={submitting || !text.trim()}
                                className="w-9 h-9 flex items-center justify-center bg-blue-600 hover:bg-blue-500 disabled:opacity-40 rounded-xl transition-colors shrink-0"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    ) : (
                        <p className="text-center text-gray-600 text-sm py-1">
                            <Link to="/signin" className="text-blue-400 hover:underline">Sign in</Link> to join the debate
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
