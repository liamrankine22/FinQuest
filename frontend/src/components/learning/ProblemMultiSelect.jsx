import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export default function ProblemMultiSelect({ question, onContinue }) {
  const [selected, setSelected] = useState([]);
  const [checked, setChecked] = useState(false);
  const options = [1, 2, 3, 4].map((n) => ({ n, text: question[`a${n}`] }));
  const correctSet = new Set(question.correct.map((c) => c.answer));
  const isCorrect = selected.length === correctSet.size && selected.every((n) => correctSet.has(n));
  const toggle = (n) => {
    if (checked) return;
    setSelected((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]));
  };
  return <div className="mx-auto min-h-[calc(100vh-82px)] max-w-2xl px-5 py-8">
    <p className="text-xs font-black uppercase tracking-widest text-amber-600">{`Question ${question.id}`}</p>
    <h1 className="mt-1 text-2xl font-black leading-snug text-slate-800">{question.question}</h1>
    <div className="mt-6 space-y-3">
      {options.map((o) => {
        const sel = selected.includes(o.n);
        const shouldBe = correctSet.has(o.n);
        return <button key={o.n} onClick={() => toggle(o.n)} className={`flex w-full items-center gap-3 rounded-2xl border-2 border-b-4 p-4 text-left font-bold transition ${checked ? (shouldBe ? "border-emerald-500 bg-emerald-50 text-emerald-700" : sel ? "border-rose-400 bg-rose-50 text-rose-700" : "border-slate-200 bg-white text-slate-400 opacity-60") : sel ? "border-sky-400 bg-sky-50 text-sky-700" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>
          <span className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-2 text-sm font-black ${sel ? "border-sky-400 bg-sky-500 text-white" : "border-slate-200 text-slate-400"}`}>{sel ? "✓" : o.n}</span><span>{o.text}</span>
        </button>;
      })}
    </div>
    <div className="mt-8">{checked ? <button onClick={() => onContinue(isCorrect)} className={`w-full rounded-2xl border-b-4 px-5 py-3.5 font-black uppercase tracking-wide text-white active:translate-y-1 active:border-b-0 ${isCorrect ? "border-emerald-700 bg-emerald-500" : "border-rose-700 bg-rose-500"}`}>Continue</button> : <button disabled={selected.length === 0} onClick={() => setChecked(true)} className="w-full rounded-2xl border-b-4 border-emerald-700 bg-emerald-500 px-5 py-3.5 font-black uppercase tracking-wide text-white disabled:border-slate-300 disabled:bg-slate-200 disabled:text-slate-400">Check answers</button>}</div>
    {checked && <div className={`mt-4 rounded-2xl border-2 p-4 ${isCorrect ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}>
      <div className="flex items-center gap-2 font-black text-slate-700">{isCorrect ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <XCircle className="h-5 w-5 text-rose-500" />}{isCorrect ? "All correct!" : "Review the highlighted options"}</div>
    </div>}
  </div>;
}