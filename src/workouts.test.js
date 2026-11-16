import {test} from 'node:test';
import assert from 'node:assert/strict';
import {routine,makeBatch,batchRows} from './workouts.js';
const form={exercise:'Hammer',date:'2026-11-15',unit:'lb',note:'Last set was tough'};

test('all seven workout shortcuts produce the requested weights and ten reps',()=>{
  for(const preset of routine){
    const batch={...makeBatch(),same:false,weights:preset.weights.map(String)};
    const rows=batchRows({...form,exercise:preset.exercise},batch);
    assert.deepEqual(rows.map(row=>row.weight),preset.weights);
    assert.ok(rows.every(row=>row.reps===10&&row.exercise===preset.exercise));
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
