import {test} from 'node:test';
import assert from 'node:assert/strict';
import {routine,makeBatch,batchRows} from './workouts.js';
const form={exercise:'Hammer',date:'2026-11-15',unit:'lb',note:'Last set was tough'};

test('all workout shortcuts produce their preset weights and reps',()=>{
  for(const preset of routine){
    const batch={...makeBatch(),same:false,weights:preset.weights.map(String),reps:String(preset.reps)};
    const rows=batchRows({...form,exercise:preset.exercise},batch);
    assert.deepEqual(rows.map(row=>row.weight),preset.weights);
    assert.ok(rows.every(row=>row.reps===preset.reps&&row.exercise===preset.exercise));
  }
});
test('same weight repeats across three individually editable history records',()=>{
  const rows=batchRows(form,{...makeBatch(),weights:['40','','']});
  assert.deepEqual(rows.map(row=>row.weight),[40,40,40]);
  assert.equal(new Set(rows.map(row=>row.id)).size,3);
  assert.ok(rows.every(row=>row.note===form.note&&row.date===form.date&&row.unit==='lb'));
});
test('retry and recovered draft reuse IDs so batch upserts do not duplicate sets',()=>{
  const batch={...makeBatch(),weights:['40','35','35'],same:false};
  assert.deepEqual(batchRows(form,JSON.parse(JSON.stringify(batch))),batchRows(form,batch));
});
test('incomplete or invalid batches fail before writing any sets',()=>{
  for(const weight of ['', ' ', '-1','Infinity','abc']){
    assert.throws(()=>batchRows(form,{...makeBatch(),same:false,weights:['40','35',weight]}));
  }
  for(const reps of ['', '0','2.5','abc'])assert.throws(()=>batchRows(form,{...makeBatch(),weights:['40','',''],reps}));
  assert.deepEqual(batchRows(form,{...makeBatch(),weights:['0','','']}).map(row=>row.weight),[0,0,0]);
});

import {muscleGroups,exerciseGroup} from './workouts.js';
test('every preset is reachable in a named muscle group',()=>{
  assert.equal(routine.length,22);
  assert.equal(new Set(routine.map(preset=>preset.exercise)).size,22);
  for(const preset of routine){
    assert.ok(muscleGroups.includes(exerciseGroup(preset.exercise)));
    assert.notEqual(exerciseGroup(preset.exercise),'Other');
  }
  assert.equal(exerciseGroup('Barbell Bench'),'Chest');
  assert.equal(exerciseGroup('Pull-ups'),'Back');
  assert.equal(exerciseGroup('Cable Face Pull'),'Shoulders');
  assert.equal(exerciseGroup('Hammer'),'Arms');
  assert.equal(exerciseGroup('Lunge Squat'),'Legs');
  assert.equal(exerciseGroup('Squat'),'Legs');
  assert.equal(exerciseGroup('My custom lift'),'Other');
});
