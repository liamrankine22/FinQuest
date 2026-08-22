import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TrendingUp } from "lucide-react";

const interp = (milestones, year, key) => {
  if (year <= milestones[0].year) return milestones[0].year === 0 ? milestones[0][key] : Math.round((year / milestones[0].year) * milestones[0][key]);
  for (let i = 1; i < milestones.length; i++) {
    if (year <= milestones[i].year) {
      const a = milestones[i - 1], b = milestones[i];
      const t = (year - a.year) / (b.year - a.year);
      return Math.round(a[key] + t * (b[key] - a[key]));
    }
  }
  return milestones[milestones.length - 1][key];
};

export default function SimulatorQuestion({ question, onContinue }) {
  const [year, setYear] = useState(0);
  const ms = question.milestones;
  const finalYear = ms[ms.length - 1].year;
  const chartData = Array.from({ length: finalYear + 1 }, (_, y) => ({ year: y, v1: interp(ms, y, "value1"), v2: interp(ms, y, "value2") }));
  const point = chartData[year];
  const interest = point.v2 - point.v1;
  const activeMilestone = [...ms].reverse().find((m) => year >= m.year);
  const reachedEnd = year >= finalYear;

  return <div className="mx-auto min-h-[calc(100vh-82px)] max-w-3xl px-5 py-8">
    <p className="mb-2 text-sm font-black uppercase tracking-widest text-emerald-600">Interactive simulator</p>
    <h1 className="mb-2 text-2xl font-black leading-snug text-slate-800 sm:text-3xl">{question.heading}</h1>
    <p className="mb-6 font-semibold text-slate-500">{question.body}</p>
    <div className="rounded-2xl border-2 border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-center gap-6 text-sm font-bold">
        <span className="flex items-center gap-1.5 text-indigo-500"><span className="h-3 w-3 rounded-full bg-indigo-500" />{question.line1}</span>
        <span className="flex items-center gap-1.5 text-emerald-500"><span className="h-3 w-3 rounded-full bg-emerald-500" />{question.line2}</span>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <defs><linearGradient id="gradV2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.35} /><stop offset="100%" stopColor="#10b981" stopOpacity={0.02} /></linearGradient></defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="year" tick={{ fontSize: 11, fontWeight: 700 }} tickFormatter={(y) => `Y${y}`} stroke="#94a3b8" />
          <YAxis tick={{ fontSize: 11, fontWeight: 700 }} tickFormatter={(v) => `$${Math.round(v / 1000)}k`} stroke="#94a3b8" width={48} />
          <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}`} labelFormatter={(y) => `Year ${y}`} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontWeight: 700 }} />
          <ReferenceLine x={year} stroke="#0f766e" strokeWidth={2} strokeDasharray="5 4" />
          <Area type="monotone" dataKey="v2" name={question.line2} stroke="#10b981" fill="url(#gradV2)" strokeWidth={2.5} />
          <Area type="monotone" dataKey="v1" name={question.line1} stroke="#6366f1" fill="none" strokeWidth={2} strokeDasharray="5 4" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
    <div className="mt-4 grid grid-cols-3 gap-3">
      <div className="rounded-xl border-2 border-slate-200 bg-white p-3 text-center"><p className="text-xs font-black uppercase text-slate-400">Year</p><p className="mt-1 text-xl font-black text-slate-700">{year}</p></div>
      <div className="rounded-xl border-2 border-indigo-200 bg-indigo-50 p-3 text-center"><p className="text-xs font-black uppercase text-indigo-400">{question.line1}</p><p className="mt-1 text-xl font-black text-indigo-600">${point.v1.toLocaleString()}</p></div>
      <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-3 text-center"><p className="text-xs font-black uppercase text-emerald-400">{question.line2}</p><p className="mt-1 text-xl font-black text-emerald-600">${point.v2.toLocaleString()}</p></div>
    </div>
    <div className="mt-4 flex items-center gap-2 rounded-xl border-2 border-sky-200 bg-sky-50 p-4 font-black text-sky-700"><TrendingUp className="h-5 w-5 shrink-0" />{`Difference: ${interest >= 0 ? "+" : "−"}$${Math.abs(interest).toLocaleString()}`}</div>
    <div className="mt-5">
      <label className="mb-2 block text-sm font-black uppercase tracking-widest text-slate-400">Drag the timeline</label>
      <input type="range" min={0} max={finalYear} step={1} value={year} onChange={(e) => setYear(Number(e.target.value))} className="w-full accent-emerald-500" />
      <div className="mt-1 flex justify-between text-xs font-bold text-slate-400"><span>Year 0</span><span>Year {finalYear}</span></div>
    </div>
    <div className={`mt-5 rounded-2xl border-2 p-4 ${activeMilestone ? "border-sky-200 bg-sky-50" : "border-slate-200 bg-slate-50"}`}>{activeMilestone ? <p className="font-semibold text-slate-600">{activeMilestone.text}</p> : <p className="font-semibold text-slate-400">Drag the slider to start fast-forwarding your wealth.</p>}</div>
    <button onClick={() => onContinue(true)} disabled={!reachedEnd} className="mt-6 w-full rounded-2xl border-b-4 border-emerald-700 bg-emerald-500 px-5 py-3.5 font-black uppercase tracking-wide text-white disabled:border-slate-300 disabled:bg-slate-200 disabled:text-slate-400">{reachedEnd ? "Complete lesson" : `Drag to Year ${finalYear} to continue`}</button>
  </div>;
}