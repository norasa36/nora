(()=>{const C=window.HQ_CONFIG||{},$=id=>document.getElementById(id),n=nowR(),today=n.date;
const dayIdx=Math.floor(new Date(today+'T12:00:00Z')/864e5);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// مزاج اليوم
const MOODS=[['#8fd0ff','هادئ'],['#b9a7f5','حالم'],['#7fd6c8','منعش'],['#f2b8cf','ناعم'],['#9cc9f0','سماوي'],['#e6c98a','ذهبي'],['#a8dcff','صافي']];
const wd=new Date(today+'T12:00:00Z').getUTCDay(),[acc,mn]=MOODS[wd];document.documentElement.style.setProperty('--accent',acc);
$('greet').insertAdjacentHTML('afterend',`<div class="sub">مزاج اليوم: ${mn} ✨</div>`);
// FAB
$('fab').href=`https://wa.me/${C.whatsappNumber}?text=${encodeURIComponent(C.whatsappText||'')}`;
const J=(u,k)=>getJSON(u,k);
// رسالة
// رياضتي
J('data/appointments.json','appts').then(a=>{if(!a)return;const d=new Date(today+'T12:00:00Z');d.setUTCDate(d.getUTCDate()-d.getUTCDay());const k=d.toISOString().slice(0,10);
 const c=(a.workouts_by_week||{})[k]||0,goal=4,pct=Math.min(100,c/goal*100);
 $('workout').innerHTML=`<div class="ring" style="background:conic-gradient(var(--navy) ${pct}%,var(--bg2) 0)"><span style="background:#fff;border-radius:50%;width:60px;height:60px;display:grid;place-items:center">${c}</span></div><div><b>${c} تمارين هذا الأسبوع</b><div class="sub">الهدف ${goal} — ${c>=goal?'ما شاء الله، أبدعتِ 💪':'كملي يا بطلة 🩵'}</div></div>`;
 window.__hasAppt=a.items.some(i=>i.date===today);outfit()});
// إطلالة
let OUT=null;J('data/outfits.json','outfits').then(o=>{OUT=o;outfit()});
function outfit(){if(!OUT||window.__hasAppt===undefined)return;const w=JSON.parse(localStorage.getItem('wx')||'null');const t=w&&w.daily?w.daily.temperature_2m_max[0]:28;
 const L=OUT.looks.find(l=>t>=l.min&&t<l.max&&l.appt===window.__hasAppt)||OUT.looks[0];
 $('outfit').innerHTML=`<div class="oic">${L.icon}</div><div><b>${L.name}</b><p>${L.desc}</p><div class="sub">حسب جو اليوم (${Math.round(t)}°)${window.__hasAppt?' وعندك موعد':''}</div></div>`}
setTimeout(outfit,3000);
// بيوتي
J('data/beauty.json','beauty').then(b=>{if(!b)return;const key='beauty-'+today;const st=JSON.parse(localStorage.getItem(key)||'{}');
 const draw=()=>{$('beauty').innerHTML=b.routine.map(([i,t],k)=>`<li><label><input type="checkbox" data-k="${k}" ${st[k]?'checked':''}> ${i} ${t}</label></li>`).join('');
  $('beautyP').textContent=`${Object.values(st).filter(Boolean).length} من ${b.routine.length} اليوم`};
 $('beauty').onchange=e=>{st[e.target.dataset.k]=e.target.checked;localStorage.setItem(key,JSON.stringify(st));draw()};draw()});
// رحلة أسبن
const tr=new Date((C.tripDate||'2027-03-26')+'T00:00:00+03:00');
function trip(w){const ms=tr-new Date(),d=Math.max(0,Math.floor(ms/864e5)),h=Math.max(0,Math.floor(ms%864e5/36e5));
 const wx=w&&w.current?`<div class="sub" style="text-align:center">الجو في ${C.tripCity||'أسبن'} الآن: ${WMO(w.current.weather_code)[0]} ${Math.round(w.current.temperature_2m)}° (من ${Math.round(w.daily.temperature_2m_min[0])}° إلى ${Math.round(w.daily.temperature_2m_max[0])}°)</div>`:'';
 $('trip').innerHTML=`<div class="cd"><div><b>${d}</b>يوم</div><div><b>${h}</b>ساعة</div><div><b>${Math.ceil(d/7)}</b>أسبوع</div></div>${wx}<div class="sub" style="margin-top:6px">🧳 جهّزي معك:</div><div class="pack">${['🧥 معطف شيرلنغ','🧣 شال كشمير','🧤 قفازات','👢 بوت ثلج مقاوم للماء','🕶️ نظارة للثلج','🧴 مرطب وواقي شمس','💄 مرطب شفايف','🩱 طبقات حرارية','🎿 ملابس تزلج'].map(x=>`<span>${x}</span>`).join('')}</div>`}
trip(null);J('https://api.open-meteo.com/v1/forecast?latitude=39.1911&longitude=-106.8175&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=America%2FDenver','wxAspen').then(trip);
// فاشن
J('data/fashion.json','fashion').then(f=>{if(!f)return;$('fWeek').textContent='موسم '+f.week;
 $('fashion').innerHTML=f.trends.map(t=>`<li><span class="fi">${t.icon}</span><div><b>${esc(t.title)}</b><p>${esc(t.note)}</p><a href="${esc(t.url)}" target="_blank" rel="noopener">المصدر: ${esc(t.source)} ↗</a></div></li>`).join('')});
// أمنياتي
const WK='wishlist',loadW=()=>{const v=localStorage.getItem(WK);return v?JSON.parse(v):[{name:'كعب Identità Brigitte ساتان أزرق فاتح 👠',link:'',price:''}]};
const drawW=()=>{const w=loadW();$('wish').innerHTML=w.map((x,i)=>`<li>💎 <span>${esc(x.name)}${x.link?` <a href="${esc(x.link)}" target="_blank" rel="noopener">رابط ↗</a>`:''}</span><span class="pr">${x.price?esc(x.price):''}</span><button class="x" data-w="${i}" style="border:0;background:none;color:#b88a2e;font-size:18px">×</button></li>`).join('')||'<li class="empty">أضيفي أمنيتك 🩵</li>'};
const saveW=w=>{localStorage.setItem(WK,JSON.stringify(w));drawW()};
$('wish').onclick=e=>{if(e.target.dataset.w!=null){const w=loadW();w.splice(e.target.dataset.w,1);saveW(w)}};
$('wishForm').onsubmit=e=>{e.preventDefault();const w=loadW();w.push({name:$('wName').value.trim(),link:$('wLink').value.trim(),price:$('wPrice').value.trim()});saveW(w);e.target.reset()};
drawW();})();
