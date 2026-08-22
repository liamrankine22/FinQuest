import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Lightbulb, TrendingDown, TrendingUp, XCircle } from "lucide-react";

const ASSUMED_RETURN = 0.07;

const parseMonthly = (text) => {
  const amounts = [];
  const re = /\$([\d,]+)\s*(?:\/|per\s*)?\s*mo(?:nth)?/gi;
  let m;
  while ((m = re.exec(text)) !== null) {
    const amount = Number(m[1].replace(/,/g, ""));
    const ctx = text.slice(Math.max(0, m.index - 18), m.index + m[0].length + 8);
    amounts.push({ amount, isInvest: /invest/i.test(ctx) });
  }
  if (amounts.length === 0) {
    const d = /\$([\d,]+)\s*(?:\/|per\s*)?\s*(?:day|daily)/i.exec(text);
    if (d) amounts.push({ amount: Number(d[1].replace(/,/g, "")) * 30, isInvest: false });
  }
  const monthlySpend = amounts.filter((a) => !a.isInvest).reduce((s, a) => s + a.amount, 0);
  const monthlyInvest = amounts.filter((a) => a.isInvest).reduce((s, a) => s + a.amount, 0);
  return { monthlySpend, monthlyInvest };
};

const parseApr = (text) => {
  const m = /([\d.]+)\s*%\s*APR/i.exec(text || "");
  return m ? Number(m[1]) / 100 : null;
};

const parseBalance = (prompt) => {
  const m = /\$([\d,]+)\s*balance/i.exec(prompt || "");
  return m ? Number(m[1].replace(/,/g, "")) : 0;
};

const yearsFromPrompt = (prompt) => {
  const m = /(\d+)\s*[- ]?\s*year/i.exec(prompt || "");
  return m ? Number(m[1]) : 1;
};

const fvOf = (pmt, months) => {
  const r = ASSUMED_RETURN / 12;
  return pmt * ((Math.pow(1 + r, months) - 1) / r);
};

const fmt = (n) => `$${Math.round(n).toLocaleString()}`;

function Bar({ pct, color, delay }) {
  return <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: "easeOut", delay }} className={`h-9 rounded-full ${color}`} />;
}

export default function HigherLowerQuestion({ question, onContinue }) {
  const [selected, setSelected] = useState(null);
  const years = yearsFromPrompt(question.prompt);
  const a = parseMonthly(question.option1);
  const b = parseMonthly(question.option2);
  const hasMonthly = a.monthlySpend + a.monthlyInvest + b.monthlySpend + b.monthlyInvest > 0;
  const r1 = parseApr(question.option1);
  const r2 = parseApr(question.option2);
  const balance = parseBalance(question.prompt);

  let mode, o1Val, o2Val, o1Color, o2Color, sub1, sub2, assumption;
  const sum1 = hasMonthly ? `${a.monthlySpend > 0 ? `${fmt(a.monthlySpend)}/mo spent` : ""}${a.monthlyInvest > 0 ? ` · ${fmt(a.monthlyInvest)}/mo invested` : ""}` : (r1 != null ? `${(r1 * 100).toFixed(1)}% APR` : "");
  const sum2 = hasMonthly ? `${b.monthlySpend > 0 ? `${fmt(b.monthlySpend)}/mo spent` : ""}${b.monthlyInvest > 0 ? ` · ${fmt(b.monthlyInvest)}/mo invested` : ""}` : (r2 != null ? `${(r2 * 100).toFixed(1)}% APR` : "");

  if (hasMonthly) {
    mode = "cash";
    const months = years * 12;
    const o1Spent = (a.monthlySpend + a.monthlyInvest) * months;
    const o2Contrib = b.monthlyInvest * months;
    const o2Fv = fvOf(b.monthlyInvest, months);
    o1Val = o1Spent; o2Val = o2Fv;
    o1Color = "bg-rose-400"; o2Color = "bg-emerald-500";
    sub1 = `${fmt(o1Spent)} spent`; sub2 = `${fmt(o2Contrib)} contributed + ${fmt(Math.max(0, o2Fv - o2Contrib))} growth`;
    assumption = `Assumed annual return: ${Math.round(ASSUMED_RETURN * 100)}% · Actual investment returns vary.`;
  } else if (r1 != null && r2 != null && balance > 0) {
    mode = "interest";
    o1Val = balance * r1 * years; o2Val = balance * r2 * years;
    const lower = o1Val <= o2Val ? 1 : 2;
    o1Color = lower === 1 ? "bg-emerald-500" : "bg-rose-400";
    o2Color = lower === 2 ? "bg-emerald-500" : "bg-rose-400";
    sub1 = `${fmt(o1Val)} interest`; sub2 = `${fmt(o2Val)} interest`;
    assumption = `Simple interest on ${fmt(balance)} over ${years} year${years > 1 ? "s" : ""}. Lower interest costs you less.`;
  } else {
    mode = "plain"; o1Val = 0; o2Val = 0;
  }

  const maxBar = Math.max(o1Val, o2Val, 1);
  const isCorrect = selected === question.correct;
  const revealed = selected !== null;

  return <div className="mx-auto min-h-[calc(100vh-82px)] max-w-2xl px-5 py-8">
    <p className="text-xs font-black uppercase tracking-widest text-emerald-600">Predict the outcome</p>
    <h1 className="mt-1 text-2xl font-black leading-snug text-slate-800 sm:text-3xl">{question.heading}</h1>
    <p className="mt-2 font-semibold text-slate-500">{question.body}</p>
    <div className="mt-6 rounded-2xl border-2 border-slate-200 bg-slate-50 p-4 text-center"><p className="text-lg font-black text-slate-800">{question.prompt}</p></div>
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      {[1, 2].map((n) => {
        const text = n === 1 ? question.option1 : question.option2;
        const summary = n === 1 ? sum1 : sum2;
        const isSel = selected === n;
        const isCorrectOpt = question.correct === n;
        return <button key={n} onClick={() => setSelected(n)} className={`rounded-2xl border-2 border-b-4 p-5 text-left transition ${isSel ? (isCorrectOpt ? "border-emerald-500 bg-emerald-50" : "border-rose-400 bg-rose-50") : "border-slate-200 bg-white hover:bg-slate-50"} ${revealed && !isSel ? "opacity-50" : ""}`}>
          <div className="mb-1 text-xs font-black uppercase tracking-widest text-slate-400">Option {n}</div>
          <div className="text-lg font-black text-slate-800">{text}</div>
          {summary && <div className="mt-2 text-sm font-bold text-slate-500">{summary}</div>}
          {revealed && isSel && <div className={`mt-2 flex items-center gap-1.5 text-sm font-black ${isCorrectOpt ? "text-emerald-600" : "text-rose-500"}`}>{isCorrectOpt ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}{isCorrectOpt ? "Correct" : "Your pick"}</div>}
          {revealed && !isSel && isCorrectOpt && <div className="mt-2 flex items-center gap-1.5 text-sm font-black text-emerald-600"><CheckCircle2 className="h-4 w-4" />Correct answer</div>}
        </button>;
      })}
    </div>

    {revealed && <>
      <div className={`mt-6 rounded-2xl border-2 p-4 ${isCorrect ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}>
        <div className="flex items-center gap-2 text-xl font-black text-slate-800">{isCorrect ? <CheckCircle2 className="h-6 w-6 text-emerald-600" /> : <XCircle className="h-6 w-6 text-rose-500" />}{isCorrect ? "You got it!" : "Not quite!"}</div>
        <p className="mt-1 font-semibold text-slate-600">{isCorrect ? "Your prediction was correct." : "This is a common intuition trap."}</p>
      </div>

      {mode !== "plain" && <div className="mt-5 rounded-2xl border-2 border-slate-200 bg-white p-5">
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">{years}-year outcome</p>
        <div className="mt-4 space-y-4">
          <div>
            <div className="mb-1 flex items-center justify-between text-sm font-bold"><span className="flex items-center gap-1.5 text-slate-600"><TrendingDown className="h-4 w-4" />Option 1</span><span className="text-slate-700">{sub1}</span></div>
            <Bar pct={(o1Val / maxBar) * 100} color={o1Color} delay={0.1} />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-sm font-bold"><span className="flex items-center gap-1.5 text-slate-600"><TrendingUp className="h-4 w-4" />Option 2</span><span className="text-slate-700">{sub2}</span></div>
            <Bar pct={(o2Val / maxBar) * 100} color={o2Color} delay={0.3} />
          </div>
        </div>
        <p className="mt-4 text-xs font-semibold text-slate-400">{assumption}</p>
      </div>}

      <div className="mt-5 rounded-2xl border-2 border-amber-200 bg-amber-50 p-4">
        <div className="flex items-center gap-2 font-black text-slate-800"><Lightbulb className="h-5 w-5 text-amber-500" />Why?</div>
        <p className="mt-1.5 font-semibold text-slate-600">{question.explanation}</p>
        <div className="mt-3 rounded-xl bg-white/70 p-3">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Key concept</p>
          <p className="mt-0.5 font-black text-slate-800">Opportunity Cost</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-600">Choosing where your money goes today affects how much you can have in the future. The tradeoff is what matters.</p>
        </div>
      </div>

      <button onClick={() => onContinue(isCorrect)} className="mt-6 w-full rounded-2xl border-b-4 border-emerald-700 bg-emerald-500 px-5 py-3.5 font-black uppercase tracking-wide text-white active:translate-y-1 active:border-b-0">Continue</button>
    </>}
  </div>;
}