export const pounds = s => s.unit === 'kg' ? s.weight * 2.2046226218 : s.weight;
export function summarize(sets, unit='lb') {
 const days = new Map();
 for(const s of sets){const w=pounds(s)/(unit==='kg'?2.2046226218:1); const d=days.get(s.date)||{date:s.date,max:0,volume:0};d.max=Math.max(d.max,w);d.volume+=w*s.reps;days.set(s.date,d);}
 return [...days.values()].sort((a,b)=>a.date.localeCompare(b.date));
}

// Compare complete exercise totals without inferring set order from database rows.
export function workoutComparisons(sets, unit='lb') {
 const dates = new Map();
 for (const set of sets) {
  const exercises = dates.get(set.date) || new Map();
  const exercise = exercises.get(set.exercise) || {exercise:set.exercise,sets:[],volume:0};
  const weight = pounds(set)/(unit==='kg'?2.2046226218:1);
  exercise.sets.push({weight,reps:set.reps});
  exercise.volume += weight*set.reps;
  exercises.set(set.exercise,exercise);
  dates.set(set.date,exercises);
 }
 return [...dates].sort(([a],[b])=>b.localeCompare(a)).map(([date,exercises])=>({date,exercises:[...exercises.values()].map(exercise=>({...exercise,average:exercise.sets.reduce((total,set)=>total+set.weight,0)/exercise.sets.length,sets:exercise.sets.sort((a,b)=>b.weight-a.weight||b.reps-a.reps)}))}));
}
