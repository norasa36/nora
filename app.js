const TZ='Asia/Riyadh',$=id=>document.getElementById(id);
const PRAY={Fajr:'الفجر',Dhuhr:'الظهر',Asr:'العصر',Maghrib:'المغرب',Isha:'العشاء'};
const ICON={calendar:'📌',prayer:'🕌'};
const WMO=c=>c==0?['☀️','صحو']:c<=3?['⛅','غائم جزئياً']:c<=48?['🌫️','ضباب']:c<=67?['🌧️','مطر']:c<=82?['🌦️','زخات']:c<=99?['⛈️','عاصفة']:['☁️',''];
const nowR=()=>{const p=new Intl.DateTimeFormat('en-CA',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).formatToParts(new Date());const o={};p.forEach(x=>o[x.type]=x.value);return{date:`${o.year}-${o.month}-${o.day}`,min:(+o.hour%24)*60+ +o.minute,sec:+o.second}};
const toMin=t=>{const[h,m]=t.split(':').map(Number);return h*60+m};
const fmt=t=>{let[h,m]=t.split(':').map(Number);const s=h<12?'ص':'م';h=h%12||12;return `${h}:${String(m).padStart(2,'0')} ${s}`};
const dayName=d=>new Date(d+'T12:00:00+03:00').toLocaleDateString('ar-SA-u-ca-gregory',{weekday:'long',day:'numeric',month:'long',timeZone:TZ});
let APPTS=[],PT=null;
async function getJSON(url,key){try{const r=await fetch(url);if(!r.ok)throw 0;const j=await r.json();localStorage.setItem(key,JSON.stringify(j));return j}catch(e){const c=localStorage.getItem(key);return c?JSON.parse(c):null}}
function tick(){const n=nowR(),d=new Date();
 $('clock').textContent=d.toLocaleTimeString('ar-SA-u-nu-latn',{timeZone:TZ,hour:'numeric',minute:'2-digit'});
 $('date').textContent=d.toLocaleDateString('ar-SA-u-ca-islamic-umalqura',{timeZone:TZ,weekday:'long',day:'numeric',month:'long',year:'numeric'})+' • '+d.toLocaleDateString('ar-SA-u-ca-gregory-nu-latn',{timeZone:TZ,day:'numeric',month:'long'});
 const h=n.min/60;$('greet').textContent=(h<12?'صباح الخير':h<17?'مساء النور':'مساء الخير')+' يا ست الكل 🩵';
 if(PT){const next=Object.keys(PRAY).map(k=>({k,m:toMin(PT[k])})).find(p=>p.m*60>n.min*60+n.sec)||{k:'Fajr',m:toMin(PT.Fajr)+1440};
  let s=next.m*60-(n.min*60+n.sec);$('pName').textContent=PRAY[next.k];$('pCount').textContent='بعد '+[Math.floor(s/3600),Math.floor(s%3600/60),s%60].map(x=>String(x).padStart(2,'0')).join(':')}}
function render(){const n=nowR(),items=APPTS.filter(a=>a.date===n.date).map(a=>({...a,pr:0}));
 if(PT)Object.keys(PRAY).forEach(k=>items.push({start:PT[k],title:'صلاة '+PRAY[k],icon:'prayer',pr:1}));
 items.sort((a,b)=>toMin(a.start)-toMin(b.start));
 $('today').innerHTML=items.map(a=>{const s=toMin(a.start),e=a.end?toMin(a.end):s+(a.pr?20:45);const c=n.min>=e?'past':n.min>=s?'now':'';
  return `<li class="${a.pr?'pr':''} ${c}"><span class="tm">${fmt(a.start)}</span><span class="ic">${ICON[a.icon]||'📌'}</span><span>${a.title}${a.end?` <small>حتى ${fmt(a.end)}</small>`:''}</span></li>`}).join('')||'<li class="empty">يوم هادي 🩵</li>';
 const up=APPTS.filter(a=>a.date>n.date).slice(0,8);
 $('upcoming').innerHTML=up.map(a=>`<li><span class="d">${dayName(a.date)}</span><span>${ICON[a.icon]||'📌'} ${a.title} • ${fmt(a.start)}</span></li>`).join('')||'<li class="empty">لا يوجد</li>';
 const todayA=APPTS.filter(a=>a.date===n.date),nextA=todayA.find(a=>toMin(a.start)>n.min)||up[0];
 const wk=APPTS.filter(a=>a.date>=n.date&&(new Date(a.date)-new Date(n.date))/864e5<7).length,tasks=loadT().filter(t=>!t.d).length;
 $('glance').innerHTML=`<div><b>${todayA.length}</b>مواعيد اليوم</div><div><b>${wk}</b>هذا الأسبوع</div><div><b>${tasks}</b>مهام باقية</div><div><b>${nextA?fmt(nextA.start):'—'}</b>${nextA?nextA.title.split('—')[0]:'الموعد القادم'}</div>`}
const loadT=()=>JSON.parse(localStorage.getItem('tasks')||'[]'),saveT=t=>{localStorage.setItem('tasks',JSON.stringify(t));drawT();render()};
function drawT(){$('tasks').innerHTML=loadT().map((t,i)=>`<li class="${t.d?'done':''}"><input type="checkbox" ${t.d?'checked':''} data-i="${i}"><span></span><button class="x" data-x="${i}">×</button></li>`).join('');
 [...$('tasks').querySelectorAll('span')].forEach((s,i)=>s.textContent=loadT()[i].t)}
$('tasks').onclick=e=>{const t=loadT();if(e.target.dataset.i!=null){t[e.target.dataset.i].d=e.target.checked;saveT(t)}if(e.target.dataset.x!=null){t.splice(e.target.dataset.x,1);saveT(t)}};
$('taskForm').onsubmit=e=>{e.preventDefault();const v=$('taskIn').value.trim();if(v){const t=loadT();t.push({t:v,d:false});saveT(t);$('taskIn').value=''}};
async function load(){const a=await getJSON('data/appointments.json?'+Date.now(),'appts');APPTS=a?a.items:[];
 const n=nowR(),[y,m,d]=n.date.split('-');const p=await getJSON(`https://api.aladhan.com/v1/timings/${d}-${m}-${y}?latitude=24.7136&longitude=46.6753&method=4`,'pray');
 if(p&&p.data)PT=Object.fromEntries(Object.keys(PRAY).map(k=>[k,p.data.timings[k].slice(0,5)]));
 render();tick();
 const w=await getJSON('https://api.open-meteo.com/v1/forecast?latitude=24.7136&longitude=46.6753&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=Asia%2FRiyadh','wx');
 if(w&&w.current){const[i,t]=WMO(w.current.weather_code);$('wTemp').textContent=`${i} ${Math.round(w.current.temperature_2m)}°`;$('wDesc').textContent=`${t} • ${Math.round(w.daily.temperature_2m_min[0])}°–${Math.round(w.daily.temperature_2m_max[0])}°`}}
drawT();load();setInterval(tick,1000);setInterval(render,60000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)load()});

