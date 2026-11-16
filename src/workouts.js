export const routine = [
  {exercise:'Shoulder Press (bar)', group:'Shoulders', weights:[20,20,20]},
  {exercise:'Shoulder Press (DB)', group:'Shoulders', weights:[25,25,25]},
  {exercise:'Triceps Ext', group:'Arms', weights:[24,24,24]},
  {exercise:'Bicep Curl (dumbbells)', group:'Arms', weights:[40,40,40]},
  {exercise:'Shrugs', group:'Shoulders', weights:[70,70,70]},
  {exercise:'Tricep Ext (upper)', group:'Arms', weights:[20,20,18]},
  {exercise:'Hammer', group:'Arms', weights:[40,35,35]},
  {exercise:'Pull-ups', group:'Back', weights:[0,0,0], reps:9},
  {exercise:'Incline Press (DB)', group:'Chest', weights:[50,45,45]},
  {exercise:'Rows (DB)', group:'Back', weights:[50,50,50]},
  {exercise:'Barbell Bench', group:'Chest', weights:[35,35,35]},
  {exercise:'Barbell Bent Over Row', group:'Back', weights:[35,35,35]},
  {exercise:'Chest Fly (Flat)', group:'Chest', weights:[25,25,25]},
  {exercise:'Lat Pull-down', group:'Back', weights:[20,20,20]},
  {exercise:'Cable Crossover', group:'Chest', weights:[25,25,25]},
  {exercise:'Cable Face Pull', group:'Shoulders', weights:[40,40,40]},
  {exercise:'Squats', group:'Legs', weights:[50,55,55]},
  {exercise:'RDL', group:'Legs', weights:[45,45,45]},
  {exercise:'Calf Raises', group:'Legs', weights:[45,45,55]},
  {exercise:'Leg Ext', group:'Legs', weights:[100,100,100]},
  {exercise:'Leg Curl', group:'Legs', weights:[100,100,100]},
  {exercise:'Lunge Squat', group:'Legs', weights:[30,30,30]},
].map(preset=>({reps:10,...preset}));

export function makeBatch(){return {ids:Array.from({length:3},()=>crypto.randomUUID()),weights:['','',''],reps:'10',same:true};}

export function batchRows(form,batch){
  const weights=batch.same?batch.weights.map(()=>batch.weights[0]):batch.weights;
  if(!form.exercise.trim()||!form.date||!['lb','kg'].includes(form.unit)||String(batch.reps).trim()===''||!Number.isInteger(Number(batch.reps))||Number(batch.reps)<1||weights.some(w=>String(w).trim()===''||!Number.isFinite(Number(w))||Number(w)<0))throw Error('Enter a weight for every set and positive whole reps.');
  return weights.map((weight,index)=>({id:batch.ids[index],exercise:form.exercise.trim(),date:form.date,weight:Number(weight),reps:Number(batch.reps),unit:form.unit,note:form.note}));
}

export const muscleGroups=['Chest','Back','Shoulders','Arms','Legs','Other'];
export function exerciseGroup(exercise){
 return routine.find(preset=>preset.exercise===exercise)?.group||({'Squat':'Legs','Bench press':'Chest','Deadlift':'Legs','Overhead press':'Shoulders','Row':'Back'}[exercise])||'Other';
}
