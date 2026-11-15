/* countdown */
(()=>{const el=$("#cd");const t=()=>{let s=Math.floor((D-Date.now())/1e3);if(s<=0){el.style.display="none";const b=$("#big");b.style.display="block";b.textContent="The Big Day Is Here!";return}
 const v=[["Days",s/86400],["Hours",s%86400/3600],["Minutes",s%3600/60],["Seconds",s%60]];el.innerHTML=v.map(a=>`<div><b>${String(Math.floor(a[1])).padStart(2,"0")}</b><small>${a[0].toUpperCase()}</small></div>`).join("")};t();setInterval(t,1000)})();
