(()=>{const C=window.HQ_CONFIG||{},$=id=>document.getElementById(id),J=(u,k)=>getJSON(u,k);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const wa=t=>`https://wa.me/${C.whatsappNumber}?text=${encodeURIComponent(t)}`;
const today=new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Riyadh'});
// أذكار
J('data/adhkar.json','adhkar').then(a=>{if(!a)return;const K='dh-'+today,st=JSON.parse(localStorage.getItem(K)||'{}'),ev=a.evening||[];
 const all=[...a.morning.map((x,i)=>['m'+i,...x]),...ev.map((x,i)=>['e'+i,...x]),...a.tayseer.map((x,i)=>['t'+i,...x])];
 const item=([k,t,x,n,s])=>{const c=st[k]||0,done=c>=n;return `<li class="dk${done?' done':''}" data-k="${k}" data-n="${n}">${t?`<b>${t}</b>`:''}<p>${x}</p><span class="cnt">${done?'تم 💙':`${c} من ${n}`}</span>${s?`<small class="src">المصدر: ${s}</small>`:''}</li>`};
 const h=+new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Riyadh',hour:'2-digit',hour12:false}).format(new Date())%24;
 let tab=(h>=15||h<4)?'e':'m';if(!ev.length)tab='m';
 const draw=()=>{const L=p=>all.filter(x=>x[0][0]==p).map(item).join('');$('adhkarM').innerHTML=L('m');$('adhkarE').innerHTML=L('e');$('adhkarT').innerHTML=L('t');
  $('adhkarM').hidden=tab!='m';$('adhkarE').hidden=tab!='e';$('dkTabM').classList.toggle('on',tab=='m');$('dkTabE').classList.toggle('on',tab=='e');
  $('dkHint').textContent=tab=='m'?'🌅 من بعد الفجر إلى الضحى':'🌙 من بعد العصر إلى آخر الليل';$('dkNote').textContent=a.note||''};
 $('dkTabs').style.display=ev.length?'':'none';
 $('adhkar').onclick=e=>{const tb=e.target.closest('#dkTabs button');if(tb){tab=tb.dataset.t;draw();return}const li=e.target.closest('.dk');if(!li)return;const k=li.dataset.k,n=+li.dataset.n;st[k]=Math.min(n,(st[k]||0)+1);localStorage.setItem(K,JSON.stringify(st));draw()};draw()});
// مواقع الفاشن
J('data/fashion_sites.json','fsites').then(f=>{if(!f)return;$('fsites').innerHTML=f.sites.map(s=>`<a class="site" href="${esc(s.url)}" target="_blank" rel="noopener"><span>${s.icon}</span><b>${esc(s.name)}</b><small>${esc(s.desc)}</small></a>`).join('');$('fsNote').textContent=f.note||''});
// مهامي وراحة بالي
const ST={todo:['⏳','باقي'],doing:['🔄','قيد التنفيذ'],done:['✅','خلصت'],risk:['⚠️','تحتاج انتباه']};
$('rlBtn').href=wa('هلا فصفص 💙 أبيك ترتب معي مهامي وتحط لها حلول بديلة: ');
J('data/tasks.json?'+Date.now(),'rtasks').then(t=>{const it=(t&&t.items)||[];
 $('rlog').innerHTML=it.length?it.map(x=>{const s=ST[x.status]||ST.todo;return `<li><div class="rh"><b>${esc(x.task)}</b><span class="st">${s[0]} ${s[1]}</span></div><div class="rr">⚠️ <span>لو صار: ${esc(x.risk||'—')}</span></div><div class="rr">🛟 <span>الخطة البديلة: ${esc(x.backup||'—')}</span></div></li>`}).join(''):`<li class="empty">راحة بالك أهم شي 💙<br>قولي لفصفص وش اللي شاغل بالك، ويرتبه لك مع خطة بديلة لكل شي</li>`});
// شهر العسل
J('data/honeymoon.json','honey').then(h=>{if(!h)return;let cur=0;$('hmNote').textContent=h.note;
 const draw=()=>{$('hmTabs').innerHTML=h.cities.map((c,i)=>`<button class="${i==cur?'on':''}" data-i="${i}">${c.icon} ${c.city}</button>`).join('');
  $('hmBody').innerHTML=h.cities[cur].groups.map(([g,l])=>`<div class="hg"><div class="sub">${g}</div>${l.map(([n,d,u])=>`<a class="hp" href="${esc(u)}" target="_blank" rel="noopener"><b>${esc(n)}</b><small>${esc(d)}</small></a>`).join('')}</div>`).join('')+`<a class="cta" target="_blank" rel="noopener" href="${wa('هلا فصفص 💙 أبي أرتب شي في '+h.cities[cur].city+': ')}">💙 اطلبي من فصفص يحجز لك</a>`};
 $('hmTabs').onclick=e=>{if(e.target.dataset.i!=null){cur=+e.target.dataset.i;draw()}};draw()});
// أخبار حلوة
J('data/news.json?'+Date.now(),'news').then(n=>{if(!n)return;$('news').innerHTML=n.items.map(([i,t,s,u])=>`<li><span class="fi">${i}</span><div><b>${esc(t)}</b><a href="${esc(u)}" target="_blank" rel="noopener">المصدر: ${esc(s)} ↗</a></div></li>`).join('');$('newsNote').textContent=n.note})
})();
