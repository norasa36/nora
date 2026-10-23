(function(){
var box=document.getElementById('nassr');if(!box)return;
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
var L='ar-SA-u-nu-latn-ca-gregory',TZ='Asia/Riyadh';
function fmt(d,o){try{return new Intl.DateTimeFormat(L,Object.assign({timeZone:TZ},o)).format(d)}catch(e){return ''}}
function dt(m){return new Date(m.date)}
function when(m){var d=dt(m);if(isNaN(d))return '';var day=fmt(d,{weekday:'long',day:'numeric',month:'long'});if(m.tbd)return day+' · التوقيت لم يُحدد بعد';return day+' · '+fmt(d,{hour:'numeric',minute:'2-digit',hour12:true})+' بتوقيت الرياض'}
function whenS(m){var d=dt(m);if(isNaN(d))return '';var day=fmt(d,{weekday:'short',day:'numeric',month:'short'});return m.tbd?day+' · الوقت لاحقًا':day+' · '+fmt(d,{hour:'numeric',minute:'2-digit',hour12:true})}
function place(m){if(!m.venue)return '<span class="ns-mut">📍 الملعب لم يُعلن بعد</span>';return '📍 <bdi dir="ltr">'+esc(m.venue)+'</bdi>'+(m.city?' · '+esc(m.city):'')}
function vs(m){var h=m.home,a=m.away;return '<b'+(m.nassr_home?' class="me"':'')+'>'+esc(h)+'</b> <i>×</i> <b'+(m.nassr_home?'':' class="me"')+'>'+esc(a)+'</b>'}
function score(m){return m.hs==null?'':'<span class="ns-sc" dir="rtl">'+esc(m.hs)+' - '+esc(m.as)+'</span>'}
function chip(r){var t={W:['فوز','w'],D:['تعادل','d'],L:['خسارة','l']}[r];return t?'<span class="ns-chip ns-'+t[1]+'">'+t[0]+'</span>':''}
function ago(d){var h=Math.round((Date.now()-d)/36e5);if(h<1)return 'الحين';if(h<24)return 'قبل '+h+' ساعة';return 'قبل '+Math.round(h/24)+' يوم'}
var D=null,tab='ksa',all=false,exN=false,exR=false;
function table(){var T=D.tables&&D.tables[tab];if(!T||!T.rows||!T.rows.length)return '<div class="ns-mut">الترتيب غير متوفر الحين</div>';
 var rows=T.rows,show=rows;if(!all&&rows.length>6){show=rows.slice(0,5);var me=rows.filter(function(r){return r.me})[0];if(me&&me.rank>5)show.push(me)}
 var h='<table class="ns-tb"><thead><tr><th>#</th><th>الفريق</th><th>لعب</th><th>ف</th><th>ت</th><th>خ</th><th>فارق</th><th>نقاط</th></tr></thead><tbody>';
 show.forEach(function(r){h+='<tr'+(r.me?' class="me"':'')+'><td>'+r.rank+'</td><td>'+esc(r.team)+'</td><td>'+esc(r.p)+'</td><td>'+esc(r.w)+'</td><td>'+esc(r.d)+'</td><td>'+esc(r.l)+'</td><td dir="ltr">'+esc(r.gd)+'</td><td><b>'+esc(r.pts)+'</b></td></tr>'});
 h+='</tbody></table>';if(rows.length>6)h+='<button type="button" class="ns-more" data-a="more">'+(all?'عرض أقل':'عرض الترتيب كامل')+'</button>';return h}
function stand(){var T=D.tables&&D.tables.ksa,me=T&&T.rows&&T.rows.filter(function(r){return r.me})[0];return me?' · المركز '+me.rank+' في دوري روشن ('+esc(me.pts)+' نقطة)':''}
function draw(){
 if(!D||!D.ok){box.innerHTML='<h2>💛💙 النصر</h2><div class="ns-mut">أخبار النصر ما وصلت الحين… جرّبي بعد شوي 🩵</div>';return}
 var h='<h2>💛💙 النصر <small>Al Nassr</small></h2>';
 h+='<div class="ns-hero">⚽ نادي عالمي وجمهوره في كل مكان 🌍<br><span>مع الدون <b>كريستيانو رونالدو</b> 🐐 رقم ٧'+stand()+'</span></div>';
 if(D.live&&D.live.length){D.live.forEach(function(m){h+='<div class="ns-live"><div class="ns-k">🔴 مباشر الحين · '+esc(m.comp)+'</div><div class="ns-teams">'+vs(m)+'</div><div class="ns-big">'+score(m)+'</div><div class="ns-pl">'+place(m)+'</div></div>'})}
 var nx=D.next||[],n0=nx[0];
 if(n0){h+='<div class="ns-next"><div class="ns-k">🔜 المباراة الجاية · '+esc(n0.comp)+(n0.round?' · '+esc(n0.round):'')+'</div><div class="ns-teams">'+vs(n0)+'</div><div class="ns-when">🕒 '+when(n0)+'</div><div class="ns-pl">'+place(n0)+'</div></div>'}
 if(nx.length>1){h+='<h3>📅 المباريات القادمة</h3><ul class="ns-ls">';nx.slice(1,exN?99:4).forEach(function(m){h+='<li><div class="ns-t">'+vs(m)+'</div><div class="ns-s">'+esc(m.comp)+(m.round?' · '+esc(m.round):'')+' · '+whenS(m)+'</div><div class="ns-s">'+place(m)+'</div></li>'});h+='</ul>';if(nx.length>4)h+='<button type="button" class="ns-more" data-a="nx">'+(exN?'عرض أقل':'كل المباريات القادمة')+'</button>'}
 var rs=D.results||[];
 if(rs.length){h+='<h3>✅ آخر النتائج</h3>';if(D.form&&D.form.length)h+='<div class="ns-form">'+D.form.map(function(r){return '<span class="ns-dot ns-'+r.toLowerCase()+'">'+({W:'ف',D:'ت',L:'خ'}[r]||'')+'</span>'}).join('')+'<span class="ns-mut"> آخر ٥ مباريات</span></div>';
  h+='<ul class="ns-ls">';rs.slice(0,exR?99:4).forEach(function(m){h+='<li><div class="ns-t">'+vs(m)+' '+score(m)+' '+chip(m.res)+'</div><div class="ns-s">'+esc(m.comp)+(m.round?' · '+esc(m.round):'')+' · '+whenS(m)+'</div><div class="ns-s">'+place(m)+'</div></li>'});h+='</ul>';if(rs.length>4)h+='<button type="button" class="ns-more" data-a="rs">'+(exR?'عرض أقل':'كل النتائج')+'</button>'}
 h+='<h3>🏆 الترتيب</h3><div class="ns-tabs"><button type="button" data-t="ksa" class="'+(tab=='ksa'?'on':'')+'">دوري روشن</button><button type="button" data-t="acl" class="'+(tab=='acl'?'on':'')+'">نخبة آسيا</button></div>'+table();
 var st=D.stars||[];if(st.length)h+='<div class="ns-stars">⭐ من نجوم الفريق: '+st.map(function(s){return '<bdi dir="ltr">'+esc(s.name)+(s.no?' #'+esc(s.no):'')+'</bdi>'}).join(' · ')+'</div>';
 var u=D.updated?new Date(D.updated.replace(' ','T')+':00+03:00'):null;
 h+='<div class="ns-foot">المصدر: ESPN · يتحدّث كل ساعة من ٧ الصبح لـ ١١ الليل'+(u&&!isNaN(u)?' · آخر تحديث '+ago(u):'')+'<br>المواعيد بتوقيت الرياض، وأي موعد أو ملعب ما انُعلن بعد يظهر كذا لين يتأكد 🩵</div>';
 box.innerHTML=h}
box.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;if(b.dataset.t){tab=b.dataset.t;all=false;draw()}else if(b.dataset.a=='more'){all=!all;draw()}else if(b.dataset.a=='nx'){exN=!exN;draw()}else if(b.dataset.a=='rs'){exR=!exR;draw()}});
function go(){fetch('data/nassr.json?t='+Date.now(),{cache:'no-store'}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(j){D=j;try{localStorage.setItem('nassr',JSON.stringify(j))}catch(e){}draw()}).catch(function(){try{D=JSON.parse(localStorage.getItem('nassr'))}catch(e){}draw()})}
go();document.addEventListener('visibilitychange',function(){if(!document.hidden)go()});
})();
