import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import VoteChart from "./VoteChart.jsx";
import Navbar from "./Navbar.jsx";

export default function Voting() {
    const [votes, setVotes] = useState({ lebron: 0, jordan: 0 });

    useEffect(() => {
        const summaryRef = doc(db, "votes", "summary");
        return onSnapshot(summaryRef, (snap) => {
            if (snap.exists()) setVotes(snap.data());
        });
    }, []);

    const lebron = votes.lebron ?? 0;
    const jordan = votes.jordan ?? 0;
    const total = lebron + jordan;
    const lebronPct = total > 0 ? Math.round((lebron / total) * 100) : 0;
    const jordanPct = total > 0 ? 100 - lebronPct : 0;

    const leader = lebron > jordan ? "LeBron James" : jordan > lebron ? "Michael Jordan" : null;
    const leaderPct = lebron > jordan ? lebronPct : jordanPct;

    return (
        <div
            className="min-h-screen text-white"
            style={{ background: 'radial-gradient(ellipse at 15% 50%, rgba(234,179,8,0.07) 0%, transparent 55%), radial-gradient(ellipse at 85% 50%, rgba(239,68,68,0.07) 0%, transparent 55%), #020617' }}
        >
            <Navbar />
            <div className="max-w-2xl mx-auto px-4 pt-28 pb-16">

                {/* Header */}
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-green-400 text-xs font-semibold uppercase tracking-widest">Live Results</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tight">
                        The{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">Verdict</span>
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm">
                        {total > 0 ? `${total} votes cast` : "No votes yet — be the first!"}
                    </p>
                </div>

                {/* Leader banner */}
                {leader && (
                    <div className={`mb-8 rounded-2xl px-6 py-4 text-center border ${
                        leader === "LeBron James"
                            ? "bg-yellow-500/10 border-yellow-500/30"
                            : "bg-red-500/10 border-red-500/30"
                    }`}>
                        <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Currently Leading</p>
                        <p className={`text-2xl font-black ${leader === "LeBron James" ? "text-yellow-400" : "text-red-400"}`}>
                            {leader}
                        </p>
                        <p className="text-gray-400 text-sm mt-1">{leaderPct}% of votes</p>
                    </div>
                )}

                {/* Stat cards */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="rounded-2xl p-5 text-center" style={{ background: 'linear-gradient(135deg, rgba(234,179,8,0.08), rgba(2,6,23,0.9))' }}>
                        <p className="text-yellow-400 font-bold text-lg">LeBron James</p>
                        <p className="text-4xl font-black mt-2">{lebron}</p>
                        <p className="text-gray-500 text-xs mt-1">votes</p>
                        <div className="mt-3 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div
                                className="h-full bg-yellow-500 rounded-full transition-all duration-700"
                                style={{ width: `${lebronPct}%` }}
                            />
                        </div>
                        <p className="text-yellow-400/70 text-xs mt-1 font-semibold">{lebronPct}%</p>
                    </div>

                    <div className="rounded-2xl p-5 text-center" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(2,6,23,0.9))' }}>
                        <p className="text-red-400 font-bold text-lg">Michael Jordan</p>
                        <p className="text-4xl font-black mt-2">{jordan}</p>
                        <p className="text-gray-500 text-xs mt-1">votes</p>
                        <div className="mt-3 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div
                                className="h-full bg-red-500 rounded-full transition-all duration-700"
                                style={{ width: `${jordanPct}%` }}
                            />
                        </div>
                        <p className="text-red-400/70 text-xs mt-1 font-semibold">{jordanPct}%</p>
                    </div>
                </div>

                {/* Chart */}
                <div className="rounded-2xl p-6 border border-slate-800/60" style={{ background: 'rgba(15,23,42,0.6)' }}>
                    <p className="text-xs uppercase tracking-widest text-gray-600 mb-4 text-center">Vote Breakdown</p>
                    <VoteChart votes={votes} />
                </div>
            </div>
        </div>
    );
}
