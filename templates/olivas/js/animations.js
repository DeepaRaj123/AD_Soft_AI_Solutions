/* reveals */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll(".reveal").forEach(el=>io.observe(el));
/* petals */
(()=>{if(matchMedia("(prefers-reduced-motion:reduce)").matches)return;const c=$("#petals"),x=c.getContext("2d");let W,H;
 const rs=()=>{W=c.width=innerWidth;H=c.height=innerHeight};rs();addEventListener("resize",rs);
 const cols=["#f4a3b5","#f8c5cf","#f6a21a","#e98a0c","#d9381e"];
 const P=Array.from({length:26},()=>({x:Math.random()*W,y:Math.random()*H,s:5+Math.random()*7,v:.4+Math.random()*.9,r:Math.random()*6,rv:(Math.random()-.5)*.03,sw:Math.random()*6,c:cols[Math.random()*5|0]}));
 (function f(){x.clearRect(0,0,W,H);for(const p of P){p.y+=p.v;p.sw+=.02;p.x+=Math.sin(p.sw)*.6;p.r+=p.rv;if(p.y>H+10){p.y=-10;p.x=Math.random()*W}
  x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;x.globalAlpha=.8;x.beginPath();x.ellipse(0,0,p.s,p.s*.55,0,0,7);x.fill();x.restore()}requestAnimationFrame(f)})()})();
