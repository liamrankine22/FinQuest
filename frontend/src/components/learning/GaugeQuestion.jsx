import { useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";


function Gauge({ value, min, max }) {
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const rot = (t - 0.5) * 180;
  const arc = "M 20 100 A 80 80 0 0 1 180 100";
  let tier = "Poor", tierColor = "text-rose-500";
  if (t >= 0.67) { tier = "Excellent"; tierColor = "text-emerald-500"; }
  else if (t >= 0.34) { tier = "Fair"; tierColor = "text-amber-500"; }
  return (
    <svg viewBox="0 0 200 124" className="w-full max-w-xs">
      <defs>
        <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
      </defs>
      <path d={arc} fill="none" stroke="#e2e8f0" strokeWidth={18} strokeLinecap="round" />
      <path d={arc} fill="none" stroke="url(#gaugeGrad)" strokeWidth={18} strokeLinecap="round" />
      <g style={{ transform: `rotate(${rot}deg)`, transformBox: "fill-box", transformOrigin: "50% 100%", transition: "transform 0.7s cubic-bezier(0.34,1.56,0.64,1)" }}>
        <line x1={100} y1={100} x2={100} y2={32} stroke="#0f172a" strokeWidth={3} strokeLinecap="round" />
      </g>
      <circle cx={100} cy={100} r={6} fill="#0f172a" />
      <text x={20} y={116} fontSize={9} fontWeight={700} fill="#94a3b8">{min}</text>
      <text x={180} y={116} fontSize={9} fontWeight={700} fill="#94a3b8" textAnchor="end">{max}</text>
    </svg>
  );
}

export default function GaugeQuestion({ question, onContinue }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [selected, setSelected] = useState({});
  const gauges = question.gauge;
  const g = gauges[stepIdx];
  const isLast = stepIdx === gauges.length - 1;
  const sel = selected[stepIdx];
  const options = [1, 2, 3].map((n) => ({ n, option: g[`option${n}`], result: g[`result${n}`], text: g[`text${n}`] }));
  const optimalN = options.reduce((best, o) => (o.result > best.result ? o : best)).n;
  const currentValue = sel ? g[`result${sel}`] : g.min;
  const currentText = sel ? g[`text${sel}`] : null;
  const allOptimal = gauges.every((gg, i) => { const opt = [1, 2, 3].map((n) => ({ n, result: gg[`result${n}`] })).reduce((b, o) => (o.result > b.result ? o : b)).n; return selected[i] === opt; });
  const pick = (n) => setSelected((prev) => ({ ...prev, [stepIdx]: n }));
  const next = () => { if (isLast) onContinue(allOptimal); else setStepIdx(stepIdx + 1); };

  return <div className="mx-auto min-h-[calc(100vh-82px)] max-w-2xl px-5 py-8">
    <div className="mb-5 flex items-center gap-1.5">{gauges.map((_, i) => <div key={i} className={`h-2.5 flex-1 rounded-full ${i <= stepIdx ? "bg-amber-500" : "bg-slate-200"}`} />)}</div>
    <p className="text-xs font-black uppercase tracking-widest text-emerald-600">Dial simulator</p>
    <h1 className="mt-1 text-2xl font-black leading-snug text-slate-800 sm:text-3xl">{question.heading}</h1>
    <p className="mt-2 font-semibold text-slate-500">{question.body}</p>
    <div className="mt-6 rounded-2xl border-2 border-slate-200 bg-white p-5">
      <h2 className="text-center text-lg font-black text-slate-700">{g.title}</h2>
      <div className="mt-3 flex flex-col items-center">
        <Gauge value={currentValue} min={g.min} max={g.max} />
        <div className="-mt-1 text-center">
          <p className="text-4xl font-black text-slate-800">{currentValue}</p>
        </div>
      </div>
    </div>
    <div className="mt-6 space-y-3">{options.map((o) => { const isSel = sel === o.n; const isOptimal = o.n === optimalN; return <button key={o.n} onClick={() => pick(o.n)} className={`w-full rounded-2xl border-2 border-b-4 p-4 text-left font-bold transition ${isSel ? (isOptimal ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-amber-400 bg-amber-50 text-amber-700") : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"} disabled:cursor-default`}>{o.option}</button>; })}</div>
    {currentText && <div className={`mt-5 rounded-2xl border-2 p-4 ${sel === optimalN ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}><div className="flex items-center gap-2 font-black text-slate-700">{sel === optimalN ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <AlertCircle className="h-5 w-5 text-amber-500" />}{sel === optimalN ? "Prime move" : "Costly move"}</div><p className="mt-1.5 font-semibold text-slate-600">{currentText}</p></div>}
    {sel && <button onClick={next} className="mt-6 w-full rounded-2xl border-b-4 border-emerald-700 bg-emerald-500 px-5 py-3.5 font-black uppercase tracking-wide text-white active:translate-y-1 active:border-b-0">{isLast ? "Finish simulator" : "Continue"}</button>}
  </div>;
}