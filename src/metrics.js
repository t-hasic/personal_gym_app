export const pounds = s => s.unit === 'kg' ? s.weight * 2.2046226218 : s.weight;
export function summarize(sets, unit='lb') {
 const days = new Map();
 for(const s of sets){const w=pounds(s)/(unit==='kg'?2.2046226218:1); const d=days.get(s.date)||{date:s.date,max:0,volume:0};d.max=Math.max(d.max,w);d.volume+=w*s.reps;days.set(s.date,d);}
 return [...days.values()].sort((a,b)=>a.date.localeCompare(b.date));
}
