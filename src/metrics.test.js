import {test} from 'node:test';import assert from 'node:assert/strict';import {summarize} from './metrics.js';
test('groups days and converts mixed units before volume calculation',()=>{const r=summarize([{date:'2026-01-02',weight:100,unit:'lb',reps:5},{date:'2026-01-02',weight:100,unit:'kg',reps:2},{date:'2026-01-01',weight:10,unit:'lb',reps:1}]);assert.equal(r[0].date,'2026-01-01');assert.ok(Math.abs(r[1].max-220.46226218)<1e-6);assert.ok(Math.abs(r[1].volume-940.92452436)<1e-6);});

import {workoutComparisons} from './metrics.js';
test('workout comparison keeps exercises separate and dates newest first',()=>{
 const rows=workoutComparisons([
  {date:'2026-11-14',exercise:'Hammer',weight:30,unit:'lb',reps:10},
  ...[40,35,35].map(weight=>({date:'2026-11-15',exercise:'Hammer',weight,unit:'lb',reps:10})),
  {date:'2026-11-15',exercise:'Shrugs',weight:70,unit:'lb',reps:10},
 ]);
 assert.deepEqual(rows.map(row=>row.date),['2026-11-15','2026-11-14']);
 const hammer=rows[0].exercises.find(row=>row.exercise==='Hammer');
 assert.equal(hammer.volume,1100);
 assert.equal(hammer.average,110/3);
 assert.deepEqual(hammer.sets.map(set=>set.weight),[40,35,35]);
 assert.equal(rows[0].exercises.length,2);
});
test('comparison converts mixed units, preserves reps and supports empty or zero-weight records',()=>{
 assert.deepEqual(workoutComparisons([]),[]);
 const rows=workoutComparisons([
  {date:'2026-11-15',exercise:'Press',weight:10,unit:'kg',reps:8},
  {date:'2026-11-15',exercise:'Press',weight:22.046226218,unit:'lb',reps:10},
  {date:'2026-11-15',exercise:'Press',weight:0,unit:'kg',reps:12},
 ],'kg');
 const press=rows[0].exercises[0];
 assert.ok(Math.abs(press.volume-180)<1e-8);
 assert.equal(press.sets.length,3);
 assert.deepEqual(press.sets.map(set=>set.reps).sort((a,b)=>a-b),[8,10,12]);
});
test('comparison retains extra sets and does not change original record order',()=>{
 const sets=[20,18,22,16].map(weight=>({date:'2026-11-15',exercise:'Press',weight,unit:'lb',reps:10}));
 const original=structuredClone(sets);
 const result=workoutComparisons(sets);
 assert.deepEqual(sets,original);
 assert.deepEqual(result[0].exercises[0].sets.map(set=>set.weight),[22,20,18,16]);
 assert.equal(result[0].exercises[0].volume,760);
});
