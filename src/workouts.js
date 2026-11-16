export const routine = [
  {exercise:'Shoulder Press (bar)', weights:[20,20,20]},
  {exercise:'Shoulder Press (DB)', weights:[25,25,25]},
  {exercise:'Triceps Ext', weights:[24,24,24]},
  {exercise:'Bicep Curl (dumbbells)', weights:[40,40,40]},
  {exercise:'Shrugs', weights:[70,70,70]},
  {exercise:'Tricep Ext (upper)', weights:[20,20,18]},
  {exercise:'Hammer', weights:[40,35,35]},
  {exercise:'Pull-ups', weights:[0,0,0], reps:9},
  {exercise:'Incline Press (DB)', weights:[50,45,45]},
  {exercise:'Rows (DB)', weights:[50,50,50]},
  {exercise:'Barbell Bench', weights:[35,35,35]},
  {exercise:'Barbell Bent Over Row', weights:[35,35,35]},
  {exercise:'Chest Fly (Flat)', weights:[25,25,25]},
  {exercise:'Lat Pull-down', weights:[20,20,20]},
  {exercise:'Cable Crossover', weights:[25,25,25]},
  {exercise:'Cable Face Pull', weights:[40,40,40]},
  {exercise:'Squats', weights:[50,55,55]},
  {exercise:'RDL', weights:[45,45,45]},
  {exercise:'Calf Raises', weights:[45,45,55]},
  {exercise:'Leg Ext', weights:[100,100,100]},
  {exercise:'Leg Curl', weights:[100,100,100]},
  {exercise:'Lunge Squat', weights:[30,30,30]},
].map(preset=>({reps:10,...preset}));

export function makeBatch(){return {ids:Array.from({length:3},()=>crypto.randomUUID()),weights:['','',''],reps:'10',same:true};}

export function batchRows(form,batch){
  const weights=batch.same?batch.weights.map(()=>batch.weights[0]):batch.weights;
  if(!form.exercise.trim()||!form.date||!['lb','kg'].includes(form.unit)||String(batch.reps).trim()===''||!Number.isInteger(Number(batch.reps))||Number(batch.reps)<1||weights.some(w=>String(w).trim()===''||!Number.isFinite(Number(w))||Number(w)<0))throw Error('Enter a weight for every set and positive whole reps.');
  return weights.map((weight,index)=>({id:batch.ids[index],exercise:form.exercise.trim(),date:form.date,weight:Number(weight),reps:Number(batch.reps),unit:form.unit,note:form.note}));
}
