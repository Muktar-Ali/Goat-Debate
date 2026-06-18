import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Cell,
    LabelList,
    Tooltip,
} from "recharts";

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const { name, votes, pct } = payload[0].payload;
        return (
            <div className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm">
                <p className="text-white font-semibold">{name}</p>
                <p className="text-gray-300">{votes} votes ({pct}%)</p>
            </div>
        );
    }
    return null;
};

export default function VoteChart({ votes }) {
    const total = (votes.lebron ?? 0) + (votes.jordan ?? 0);

    if (total === 0) {
        return (
            <div className="flex items-center justify-center h-32 text-gray-600 text-sm">
                No votes yet — be the first!
            </div>
        );
    }

    const lebronPct = Math.round(((votes.lebron ?? 0) / total) * 100);
    const jordanPct = 100 - lebronPct;

    const data = [
        { name: "LeBron James", votes: votes.lebron ?? 0, pct: lebronPct, color: "#eab308" },
        { name: "Michael Jordan", votes: votes.jordan ?? 0, pct: jordanPct, color: "#ef4444" },
    ];

    return (
        <div className="w-full">
            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data} margin={{ top: 24, right: 24, left: 0, bottom: 0 }} barCategoryGap="35%">
                    <XAxis
                        dataKey="name"
                        tick={{ fill: "#9ca3af", fontSize: 13 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                    <Bar dataKey="votes" radius={[6, 6, 0, 0]}>
                        {data.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                        ))}
                        <LabelList
                            dataKey="pct"
                            position="top"
                            formatter={(v) => `${v}%`}
                            style={{ fill: "#e5e7eb", fontSize: 14, fontWeight: 600 }}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            {/* Progress bar */}
            <div className="mt-2 h-2 rounded-full overflow-hidden flex">
                <div
                    className="bg-yellow-500 transition-all duration-700"
                    style={{ width: `${lebronPct}%` }}
                />
                <div
                    className="bg-red-500 transition-all duration-700 flex-1"
                />
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>LeBron {lebronPct}%</span>
                <span>Jordan {jordanPct}%</span>
            </div>
        </div>
    );
}
