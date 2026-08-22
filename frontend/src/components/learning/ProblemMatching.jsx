import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export default function ProblemMatching({ question, onContinue }) {
  const lefts = [1, 2, 3].map((n) => ({ n, text: question[`l${n}`] }));
  const rights = [1, 2, 3].map((n) => ({ n, text: question[`r${n}`] }));
  const [pairs, setPairs] = useState({});
  const [activeLeft, setActiveLeft] = useState(null);
  const [checked, setChecked] = useState(false);
  const correctMap = {};
  question.pairs.forEach((p) => { correctMap[p.left] = p.right; });
  const allPaired = lefts.every((l) => pairs[l.n] != null);
  const isCorrect = lefts.every((l) => pairs[l.n] === correctMap[l.n]);
  const usedRights = new Set(Object.values(pairs));

  const clickLeft = (n) => {
    if (checked) return;
    if (pairs[n] != null) {
      setPairs((prev) => { const c = { ...prev }; delete c[n]; return c; });
      setActiveLeft(n);
    } else if (activeLeft === n) {
      setActiveLeft(null);
    } else {
      setActiveLeft(n);
    }
  };
  const clickRight = (n) => {
    if (checked || activeLeft == null) return;
    setPairs((prev) => {
      const c = { ...prev };
      for (const k of Object.keys(c)) { if (c[k] === n) delete c[k]; }
      c[activeLeft] = n;
      return c;
    });
    setActiveLeft(null);
  };

  return <div className="mx-auto min-h-[calc(100vh-82px)] max-w-2xl px-5 py-8">
    <p className="text-xs font-black uppercase tracking-widest text-amber-600">{`Question ${question.id}`}</p>
    <h1 className="mt-1 text-2xl font-black leading-snug text-slate-800">{question.question}</h1>
    <p className="mt-2 text-sm font-semibold text-slate-500">Tap a left item, then tap its matching right item.</p>
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      <div className="space-y-3">
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Items</p>
        {lefts.map((l) => {
          const paired = pairs[l.n] != null;
          const active = activeLeft === l.n;
          const ok = paired && pairs[l.n] === correctMap[l.n];
          return <button key={l.n} onClick={() => clickLeft(l.n)} className={`w-full rounded-2xl border-2 border-b-4 p-3.5 text-left font-bold transition ${checked ? (ok ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-rose-400 bg-rose-50 text-rose-700") : active ? "border-amber-400 bg-amber-50 text-amber-700" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>
            <span>{l.text}</span>
            {paired && <span className="mt-1 block text-xs font-semibold text-slate-400">→ {question[`r${pairs[l.n]}`]} <span className="underline">(tap to unpair)</span></span>}
          </button>;
        })}
      </div>
      <div className="space-y-3">
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Matches</p>
        {rights.map((r) => {
          const used = usedRights.has(r.n);
          return <button key={r.n} onClick={() => clickRight(r.n)} disabled={checked || activeLeft == null} className={`w-full rounded-2xl border-2 border-b-4 p-3.5 text-left font-bold transition ${used ? "border-slate-200 bg-slate-100 text-slate-400" : activeLeft != null ? "border-sky-300 bg-white text-slate-700 hover:border-sky-500" : "border-slate-200 bg-white text-slate-400"} disabled:cursor-default`}>{r.text}</button>;
        })}
      </div>
    </div>
    {checked && <div className={`mt-5 rounded-2xl border-2 p-4 ${isCorrect ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}>
      <div className="flex items-center gap-2 font-black text-slate-700">{isCorrect ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <XCircle className="h-5 w-5 text-rose-500" />}{isCorrect ? "All matched!" : "Some pairs are off"}</div>
    </div>}
    <div className="mt-6">{checked ? <button onClick={() => onContinue(isCorrect)} className={`w-full rounded-2xl border-b-4 px-5 py-3.5 font-black uppercase tracking-wide text-white active:translate-y-1 active:border-b-0 ${isCorrect ? "border-emerald-700 bg-emerald-500" : "border-rose-700 bg-rose-500"}`}>Continue</button> : <button disabled={!allPaired} onClick={() => setChecked(true)} className="w-full rounded-2xl border-b-4 border-emerald-700 bg-emerald-500 px-5 py-3.5 font-black uppercase tracking-wide text-white disabled:border-slate-300 disabled:bg-slate-200 disabled:text-slate-400">Check answers</button>}</div>
  </div>;
}