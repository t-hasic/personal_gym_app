export const routine = [
  {exercise:'Shoulder Press (bar)', weights:[20,20,20]},
  {exercise:'Shoulder Press (DB)', weights:[25,25,25]},
  {exercise:'Triceps Ext', weights:[24,24,24]},
  {exercise:'Bicep Curl (dumbbells)', weights:[40,40,40]},
  {exercise:'Shrugs', weights:[70,70,70]},
  {exercise:'Tricep Ext (upper)', weights:[20,20,18]},
  {exercise:'Hammer', weights:[40,35,35]},
];

export function makeBatch(){return {ids:Array.from({length:3},()=>crypto.randomUUID()),weights:['','',''],reps:'10',same:true};}

export function batchRows(form,batch){
  const weights=batch.same?batch.weights.map(()=>batch.weights[0]):batch.weights;
  if(!form.exercise.trim()||!form.date||!['lb','kg'].includes(form.unit)||String(batch.reps).trim()===''||!Number.isInteger(Number(batch.reps))||Number(batch.reps)<1||weights.some(w=>String(w).trim()===''||!Number.isFinite(Number(w))||Number(w)<0))throw Error('Enter a weight for every set and positive whole reps.');
  return weights.map((weight,index)=>({id:batch.ids[index],exercise:form.exercise.trim(),date:form.date,weight:Number(weight),reps:Number(batch.reps),unit:form.unit,note:form.note}));
}
