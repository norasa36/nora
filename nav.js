(function(){
var nav=document.getElementById('secNav'),inner=document.getElementById('secNavIn');if(!nav||!inner)return;
var links=[].slice.call(inner.querySelectorAll('a[data-s]')),secs=[],byId={};
links.forEach(function(a){var el=document.getElementById(a.dataset.s);if(el){secs.push(el);byId[el.id]=a}else a.style.display='none'});
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
// safe-area probe
var probe=document.createElement('div');probe.style.cssText='position:absolute;visibility:hidden;padding-top:env(safe-area-inset-top)';document.body.appendChild(probe);
function inset(){return parseFloat(getComputedStyle(probe).paddingTop)||0}
// stuck state (adds safe-area padding only when pinned)
var sent=document.createElement('div');sent.className='sec-nav-sentinel';nav.parentNode.insertBefore(sent,nav);
if('IntersectionObserver' in window)new IntersectionObserver(function(e){nav.classList.toggle('stuck',!e[0].isIntersecting&&e[0].boundingClientRect.top<0)}).observe(sent);
function navH(){return nav.offsetHeight+(nav.classList.contains('stuck')?0:inset())}
var cur=null,lock=0;
function atBottom(){return innerHeight+scrollY>=document.documentElement.scrollHeight-6&&scrollY>200}
function setActive(id,center){if(!id||id===cur)return;cur=id;links.forEach(function(a){var on=a.dataset.s===id;a.classList.toggle('on',on);if(on)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current')});
 var a=byId[id];if(a&&center!==false){var r=a.getBoundingClientRect(),n=inner.getBoundingClientRect();inner.scrollBy({left:(r.left+r.width/2)-(n.left+n.width/2),behavior:reduce?'auto':'smooth'})}}
// active section: the one crossing a thin line ~30% down the viewport
function band(){var top=Math.round(navH()+ (innerHeight-navH())*0.12);return '-'+top+'px 0px -'+Math.max(0,innerHeight-top-2)+'px 0px'}
var io=null;
function observe(){if(io)io.disconnect();if(!('IntersectionObserver' in window))return;
 io=new IntersectionObserver(function(es){if(Date.now()<lock||atBottom())return;es.forEach(function(e){if(e.isIntersecting)setActive(e.target.id)})},{rootMargin:band(),threshold:0});secs.forEach(function(s){io.observe(s)})}
observe();var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(observe,200)});
// edges: very top / very bottom of the page
var tk=0;addEventListener('scroll',function(){if(tk||Date.now()<lock)return;tk=requestAnimationFrame(function(){tk=0;
 var y=scrollY;if(y<40&&secs[0])setActive(secs[0].id);else if(atBottom()&&secs.length)setActive(secs[secs.length-1].id)})},{passive:true});
// click: smooth scroll with offset so the heading isn't hidden under the bar
inner.addEventListener('click',function(e){var a=e.target.closest('a[data-s]');if(!a)return;e.preventDefault();var el=document.getElementById(a.dataset.s);if(!el)return;
 lock=Date.now()+(reduce?150:1100);setActive(a.dataset.s);go(el,0)});
function go(el,n){var y=el.getBoundingClientRect().top+scrollY-(nav.offsetHeight+inset())-6;scrollTo({top:Math.max(0,y),behavior:reduce?'auto':'smooth'});
 // layout can shift while a long scroll runs (late-loaded cards): re-aim until the heading sits right under the bar
 setTimeout(function(){var d=el.getBoundingClientRect().top-(nav.offsetHeight+inset())-6;if(Math.abs(d)>8&&n<3){lock=Date.now()+1100;go(el,n+1)}},reduce?200:1100)}
setActive((secs[0]||{}).id,false);
})();
