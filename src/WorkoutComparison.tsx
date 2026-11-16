import {useState,useEffect,useRef} from 'react';
import Chart from 'chart.js/auto';
import {workoutComparisons} from './metrics.js';

type SetRecord={exercise:string;date:string;weight:number;unit:string;reps:number};
type WeightedSet={weight:number;reps:number};
type Workout={date:string;exercises:{exercise:string;sets:WeightedSet[];volume:number;average:number}[]};
const number=(value:number)=>Number(value.toFixed(1)).toLocaleString();
export function WorkoutComparison({entries,unit}:{entries:SetRecord[];unit:string}){
 const workouts:Workout[]=workoutComparisons(entries,unit);
 const [chosenDate,chooseDate]=useState('');
 const [chosenPrevious,choosePrevious]=useState('');
 const current=workouts.find(workout=>workout.date===chosenDate)||workouts[0];
 const earlier=workouts.filter(workout=>current&&workout.date<current.date);
 const previous=earlier.find(workout=>workout.date===chosenPrevious)||earlier[0];
 if(!current)return <p>No workouts to compare yet. Log your first three sets to get started.</p>;
 const maxWeight=Math.max(1,...current.exercises.flatMap(exercise=>exercise.sets.map(set=>set.weight)),...(previous?.exercises.flatMap(exercise=>exercise.sets.map(set=>set.weight))||[]));
 return <div className="workout-comparison"><WeightTimeline workouts={workouts} unit={unit}/><h3>Compare two dates</h3><div className="pair comparison-dates"><label>Workout<select value={current.date} onChange={event=>chooseDate(event.target.value)}>{workouts.map(workout=><option key={workout.date}>{workout.date}</option>)}</select></label><label>Compare with<select disabled={!earlier.length} value={previous?.date||''} onChange={event=>choosePrevious(event.target.value)}>{!earlier.length&&<option value="">No earlier workout</option>}{earlier.map(workout=><option key={workout.date}>{workout.date}</option>)}</select></label></div><div className="comparison-key"><span><i className="current-swatch"/>Selected workout</span><span><i className="previous-swatch"/>Earlier workout</span></div><p className="comparison-help">Weights are arranged heaviest to lightest. Each bar is one set; all bars use the same scale.</p>{current.exercises.map(exercise=>{
 const before=previous?.exercises.find(row=>row.exercise===exercise.exercise);
 const delta=before?exercise.volume-before.volume:null;
 const percent=before&&before.volume>0?100*(exercise.volume-before.volume)/before.volume:null;
 return <article className="comparison-card" key={exercise.exercise}><div className="comparison-title"><h3>{exercise.exercise}</h3>{delta!==null&&<span className="volume-change">{delta>0?'+':''}{percent!==null?`${number(percent)}%`:`${number(delta)} ${unit} × reps`} volume</span>}</div><div className="set-comparison-groups">{[{workout:current,data:exercise,kind:'current'},{workout:previous,data:before,kind:'previous'}].map(({workout,data,kind})=>workout&&<div className={`set-comparison ${kind}`} key={kind}><div className="comparison-caption"><strong>{workout.date}</strong><span>{data?`${data.sets.length} sets · ${number(data.volume)} ${unit} × reps`:'Exercise not logged'}</span></div>{data?.sets.map((set,index)=><div className="set-bar-row" key={index}><span className="set-rank">{index+1}</span><div className="set-bar-track"><div className="set-bar" style={{width:`${100*set.weight/maxWeight}%`}}/></div><span className="set-bar-value">{number(set.weight)} {unit} × {set.reps}</span></div>)}</div>)}</div>{!before&&previous&&<p>No earlier sets for this exercise on {previous.date}.</p>}</article>;
 })}{!previous&&<p>Log this exercise on another date to see your change in training volume. Volume includes both weight and reps.</p>}</div>;
}

function WeightTimeline({workouts,unit}:{workouts:Workout[];unit:string}){
 const ref=useRef<HTMLCanvasElement>(null);
 const complete=[...workouts].reverse().filter(workout=>workout.exercises[0]?.sets.length===3);
 useEffect(()=>{
  if(!ref.current||!complete.length)return;
  const colors=['#315c49','#b66b43','#657ea3'];
  const chart=new Chart(ref.current,{type:'bar',data:{labels:complete.map(workout=>workout.date),datasets:['Heaviest','Middle','Lightest'].map((label,index)=>({label,data:complete.map(workout=>workout.exercises[0].sets[index].weight),backgroundColor:colors[index],borderRadius:3}))},options:{responsive:true,maintainAspectRatio:false,animation:false,plugins:{legend:{position:'bottom',labels:{boxWidth:10,font:{size:11}}},tooltip:{callbacks:{label:context=>{const set=complete[context.dataIndex].exercises[0].sets[context.datasetIndex];return `${context.dataset.label}: ${number(set.weight)} ${unit} × ${set.reps} reps`;}}}},scales:{y:{beginAtZero:true,title:{display:true,text:unit}},x:{ticks:{maxRotation:45,minRotation:0,font:{size:10}}}}}});
  return()=>chart.destroy();
 },[workouts,unit]);
 return <><h3>Three-set weights over time</h3>{complete.length?<><div className="weight-timeline-scroll"><div className="weight-timeline" style={{minWidth:Math.max(260,complete.length*82)}}><canvas ref={ref} role="img" aria-label={`Three set weights in ${unit}, heaviest to lightest, across ${complete.length} workout dates. Exact values follow in chart data.`}/></div></div><details className="timeline-data"><summary>View weights and reps</summary>{complete.map(workout=><p key={workout.date}><strong>{workout.date}</strong>: {workout.exercises[0].sets.map(set=>`${number(set.weight)} ${unit} × ${set.reps}`).join(' · ')}</p>)}</details></>:<p>Log three sets of this exercise on a date to start its chart.</p>}<p className="comparison-help">Each date shows three weights, ranked heaviest to lightest. Tap a bar for reps.{complete.length<workouts.length?' Dates with more or fewer than three sets appear only in the comparison below.':''}</p></>;
}
