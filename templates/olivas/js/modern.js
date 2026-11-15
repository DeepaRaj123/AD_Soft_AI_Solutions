(()=>{const q=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
const add=(t,c)=>{const e=document.createElement(t);e.className=c;document.body.appendChild(e);return e};
const prog=add('div','prog');add('div','aurora').innerHTML='<i></i><i></i><i></i>';
/* hero text: each word rises in */
let n=0;(function w(el){[...el.childNodes].forEach(c=>{if(c.nodeType===3){const f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(t=>{if(!t.trim()){f.append(t);return}const s=document.createElement('span');s.className='w';s.style.setProperty('--i',n++);s.textContent=t;f.append(s)});c.replaceWith(f)}else if(c.nodeName!=='BR')w(c)})})(q('.hero h1'));
/* marquee strip under hero */
const cfg=window.WEDDING_CONFIG||{},d=new Date(cfg.weddingDate||Date.now()),ds=d.toLocaleDateString('en-GB',{day:'2-digit',month:'2-digit',year:'numeric'}).replace(/\//g,' · ');
const items=['Save the date',ds,'Shiva & Parvati blessings','Together forever'],row=[...items,...items].map(t=>`<span>${t}</span><span>✦</span>`).join('');
const m=document.createElement('div');m.className='marquee';m.innerHTML=`<div>${row}${row}</div>`;q('.hero').after(m);
/* scroll progress + hero parallax */
const ph=q('.photo');let tk=0;addEventListener('scroll',()=>{if(tk)return;tk=1;requestAnimationFrame(()=>{tk=0;const h=document.documentElement;prog.style.transform=`scaleX(${scrollY/(h.scrollHeight-innerHeight||1)})`;if(!rm&&scrollY<innerHeight*1.2)ph.style.setProperty('--py',scrollY*.25+'px')})},{passive:true});
/* 3D tilt (mouse only) */
$$('.events article,.venue,.story-points article').forEach(el=>{el.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||rm)return;const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(900px) rotateX(${-y*6}deg) rotateY(${x*8}deg)`});el.addEventListener('pointerleave',()=>el.style.transform='')});
/* countdown number pop */
['days','hours','minutes','seconds'].forEach(id=>{const el=document.getElementById(id);if(!el||rm)return;new MutationObserver(()=>{el.classList.remove('tick');void el.offsetWidth;el.classList.add('tick')}).observe(el,{childList:true,characterData:true,subtree:true})});
/* cursor glow (desktop) + tap sparkles */
if(matchMedia('(hover:hover)').matches&&!rm){const g=add('div','glow');addEventListener('pointermove',e=>g.style.transform=`translate(${e.clientX}px,${e.clientY}px)`)}
if(!rm)addEventListener('pointerdown',e=>{for(let i=0;i<7;i++){const s=add('span','sp'),a=Math.PI*2*i/7+Math.random(),r=26+Math.random()*30;s.textContent='✦';s.style.left=e.clientX+'px';s.style.top=e.clientY+'px';s.style.setProperty('--dx',Math.cos(a)*r+'px');s.style.setProperty('--dy',Math.sin(a)*r+'px');setTimeout(()=>s.remove(),850)}});
})();
