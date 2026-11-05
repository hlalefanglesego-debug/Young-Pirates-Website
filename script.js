const $=s=>document.querySelector(s),reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
/* menu */
$('#burger').onclick=()=>$('#nav').classList.toggle('open');
document.querySelectorAll('#nav a').forEach(a=>a.onclick=()=>$('#nav').classList.remove('open'));

/* ---------- 3D card tilt ---------- */
document.querySelectorAll('.tilt').forEach(el=>{
  if(reduce)return;
  el.addEventListener('pointermove',e=>{const b=el.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;
    el.style.transform=`rotateY(${x*14}deg) rotateX(${-y*14}deg) translateZ(10px)`;});
  el.addEventListener('pointerleave',()=>el.style.transform='');
});

const fx=[
['Sat, 26 Sep 2026','15:00','Jomo Cosmos','VUT Stadium',0],['Fri, 02 Oct 2026','16:00','Tembisa Destroyers','Sicelo Stadium',1],
['Sat, 10 Oct 2026','15:00','Doornkop Students','Isiqalo Grounds',0],['Fri, 16 Oct 2026','18:00','TUT','TUT Pretoria Stadium',0],
['Fri, 23 Oct 2026','16:00','Mike-1-Stars','Sicelo Stadium',1],['Sat, 31 Oct 2026','15:00','Leruma United','Sinaba Stadium',0],
['Fri, 06 Nov 2026','16:00','Dube Continental','Sicelo Stadium',1],['Sat, 14 Nov 2026','15:00','Spartans','Pretoria Municipal Recreation',0],
['Sat, 21 Nov 2026','15:00','Wits','Wits Marks Park',0],['Fri, 27 Nov 2026','16:00','Orlando Pirates','Sicelo Stadium',1],
['Sat, 05 Dec 2026','12:00','Mabopane JM','Giant Stadium',0],['Fri, 15 Jan 2027','16:00','Jomo Cosmos','Sicelo Stadium',1],
['Sat, 23 Jan 2027','15:00','Tembisa Destroyers','Tembisa',0],['Fri, 29 Jan 2027','16:00','Doornkop Students','Sicelo Stadium',1],
['Fri, 05 Feb 2027','16:00','TUT','Sicelo Stadium',1],['Sat, 13 Feb 2027','15:30','Mike-1-Stars','Giant Stadium',0],
['Fri, 19 Feb 2027','16:00','Leruma United','Sicelo Stadium',1],['Fri, 26 Feb 2027','14:00','Dube Continental','Nike Centre',0],
['Fri, 05 Mar 2027','16:00','Spartans','Sicelo Stadium',1],['Fri, 12 Mar 2027','16:00','Wits','Sicelo Stadium',1],
['Fri, 19 Mar 2027','12:00','Orlando Pirates','Wits Marks Park',0],['Fri, 26 Mar 2027','16:00','Mabopane JM','Sicelo Stadium',1]];

/* ---------- Calendar ---------- */
const now=new Date(),T=f=>new Date(f[0].replace(/^\w+,\s*/,'')+' '+f[1]),row=$('#calRow');
const ini=n=>n.replace(/[^A-Za-z0-9 -]/g,'').split(/[ -]+/).map(w=>w[0]).join('').slice(0,3).toUpperCase();
const us='<div class="cr"><img src="image/logo1.jpg" alt=""><span>Young Pirates</span></div>',LG={'Jomo Cosmos':'Jomo Cosmos FC.png','Tembisa Destroyers':'Tembisa Destroyers FC.png','TUT':'TUT FC.png','Mike-1-Stars':'Mike-1-Stars FC.png','Leruma United':'Leruma United.png','Dube Continental':'Dube Continental FC.png','Spartans':'Spartans FC.png','Wits':'Wits University FC.png','Orlando Pirates':'Orlando Pirates FC.png','Mabopane JM':'Mabopane Jm.png'},
them=n=>`<div class="cr">${LG[n]?`<img class="tl" src="Logo/${encodeURI(LG[n])}" alt="${n} logo">`:`<i>${ini(n)}</i>`}<span>${n}</span></div>`;
row.innerHTML=fx.map((f,i)=>{const past=T(f)<now;
  return `<article class="mc ${f[4]?'home':'away'}${past?' done':''}"><div class="mc-h">${f[4]?us:them(f[2])}<b class="vs">vs</b>${f[4]?them(f[2]):us}</div>
  <div class="mc-b"><span class="tag">${f[4]?'Home':'Away'}${past?', played':''}</span><h3>${f[0]}, ${f[1]}</h3><p>Motsepe League, Matchday ${i+1}</p><p>${f[3]}</p>${past?'':`<button data-i="${i}">Add to calendar</button>`}</div></article>`;}).join('')
  +'<a class="promo" href="#gallery"><b>Next games</b><span>See the photos from the pitch</span></a>';
const nxi=Math.max(0,fx.findIndex(f=>T(f)>=now));
const first=row.children[nxi];if(first)row.scrollLeft=Math.max(0,first.offsetLeft-4);
$('#cprev').onclick=()=>row.scrollBy({left:-360,behavior:'smooth'});$('#cnext').onclick=()=>row.scrollBy({left:360,behavior:'smooth'});
const pad=n=>String(n).padStart(2,'0'),fmt=d=>`${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
function ics(list){const ev=list.map(f=>{const s=T(f);return `BEGIN:VEVENT\nUID:yp-${fmt(s)}@youngpirates\nDTSTAMP:${fmt(new Date())}\nDTSTART:${fmt(s)}\nDTEND:${fmt(new Date(+s+72e5))}\nSUMMARY:${f[4]?'Young Pirates vs '+f[2]:f[2]+' vs Young Pirates'}\nLOCATION:${f[3]}\nEND:VEVENT`;}).join('\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([('BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Young Pirates FC//EN\n'+ev+'\nEND:VCALENDAR').replace(/\n/g,'\r\n')],{type:'text/calendar'}));a.download='young-pirates-fixtures.ics';a.click();}
row.addEventListener('click',e=>{const b=e.target.closest('button[data-i]');if(b)ics([fx[+b.dataset.i]]);});
$('#sync').onclick=()=>ics(fx.filter(f=>T(f)>=now));
(function(){const nx=fx.find(f=>T(f)>=now);const set=(a,b,c,d)=>{$('#cD').textContent=pad(a);$('#cH').textContent=pad(b);$('#cM').textContent=pad(c);$('#cS').textContent=pad(d);};
  const tick=()=>{if(!nx)return set(0,0,0,0);const d=Math.max(0,T(nx)-new Date());set(Math.floor(d/864e5),Math.floor(d/36e5)%24,Math.floor(d/6e4)%60,Math.floor(d/1e3)%60);};tick();setInterval(tick,1000);})();

/* ---------- Gallery + lightbox ---------- */
const pics=['image/p1.jpeg','image/p2.jpeg','image/p3.jpeg','image/p4.jpeg','image/p5.jpeg','image/p6.jpeg','image/17.jpeg','image/p8.jpeg','image/p9.jpeg','image/p10.jpeg','image/p11.jpeg','image/p12.jpeg','image/p14.jpeg','image/p15.jpeg','image/p16.jpeg','image/p17.jpeg','image/p18.jpeg','image/p19.jpeg','image/p21.jpeg','image/758750871_1045766787960383_9178267795877809241_n.jpg','image/big1.jpeg','image/cel1.jpeg','image/tropy.jpeg','image/kit1.jpeg','image/kit2.jpeg','image/p22.jpg','image/581837692_842051491665248_279599584020375867_n.jpg','image/589304982_849165707620493_6835218660441111031_n.jpg','image/649804175_929833816220348_6383544948829636077_n.jpg','image/chair.jpg','image/staff9.jpg','image/cel.jpg','image/team2.jpg','image/staff6.jpg','image/pal.jpeg','image/new3.jpeg','image/ddcSK.jpeg','image/ddcSK2.jpeg','image/ddc1St.jpeg','image/ow.jpeg'];
let li=0;
const ringEl=$('#ring'),n=pics.length,step=360/n;let ang=0,vel=0,drag=false,lx=0,moved=0,tgt=null;
const items=pics.map((src,i)=>{const d=document.createElement('button');d.className='ri';d.setAttribute('aria-label','Photo '+(i+1));
  d.innerHTML=`<img src="${src}" alt="Gallery photo ${i+1}" loading="lazy" draggable="false">`;ringEl.appendChild(d);
  d.onclick=()=>{if(moved>6)return;if(i===front())open(i);else goto(i);};return d;});
const front=()=>((Math.round(-ang/step)%n)+n)%n;
function goto(i){tgt=-i*step;tgt+=360*Math.round((ang-tgt)/360);}
function layout(){const w=items[0].offsetWidth,R=w/2/Math.tan(Math.PI/n)+24;
  items.forEach((d,i)=>d.style.transform=`rotateY(${i*step}deg) translateZ(${R}px)`);ringEl.dataset.r=R;}
layout();addEventListener('resize',layout);addEventListener('load',layout);
const rz=$('#ring3d');
rz.addEventListener('pointerdown',e=>{drag=true;lx=e.clientX;moved=0;tgt=null;});
addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-lx;lx=e.clientX;ang+=dx*.3;vel=dx*.3;moved+=Math.abs(dx);});
addEventListener('pointerup',()=>{drag=false;setTimeout(()=>moved=0,0);});
$('#rprev').onclick=()=>goto(front()-1);$('#rnext').onclick=()=>goto(front()+1);
let hover=false;rz.addEventListener('pointerenter',()=>hover=true);rz.addEventListener('pointerleave',()=>hover=false);
(function spinLoop(){
  if(!drag){if(tgt!==null){ang+=(tgt-ang)*.12;if(Math.abs(tgt-ang)<.05)tgt=null;}
    else{ang+=vel;vel*=.95;if(Math.abs(vel)<.03&&!reduce&&!hover)ang+=.12;}}
  const R=+ringEl.dataset.r||600;
  ringEl.style.transform=`translateZ(${-R}px) rotateY(${ang}deg)`;
  items.forEach((d,i)=>{const f=Math.cos((i*step+ang)*Math.PI/180);d.style.filter=`brightness(${.3+.7*(f+1)/2})`;d.style.zIndex=Math.round(f*10);});
  $('#ringCap').textContent=`Photo ${front()+1} of ${n}. Drag to spin, tap the front photo to enlarge.`;
  requestAnimationFrame(spinLoop);
})();
const lb=$('#lb'),lbi=lb.querySelector('img');
function open(i){li=(i+pics.length)%pics.length;lbi.src=pics[li];lb.classList.add('on');}
$('#lbx').onclick=()=>lb.classList.remove('on');$('#lbp').onclick=()=>open(li-1);$('#lbn').onclick=()=>open(li+1);
lb.onclick=e=>{if(e.target===lb)lb.classList.remove('on');};
addEventListener('keydown',e=>{if(!lb.classList.contains('on'))return;if(e.key==='Escape')lb.classList.remove('on');if(e.key==='ArrowRight')open(li+1);if(e.key==='ArrowLeft')open(li-1);});

/* ---------- Staff cards ---------- */
const staff=[['Head Coach','Issac Mphasane','Leads the Pirates with tactical vision and discipline, building a legacy of champions on and off the pitch.','image/ngamla.jpeg'],
['Assistant Coach','Sipho Ndlovu','Works on set pieces, defensive structure and fitness, sharpening every Pirate into a match-winner.','image/staff6.jpg'],
['Team Manager','Thabo Mokoena','Runs logistics, travel, registrations and player welfare so the squad is always ready.','image/ow.jpeg'],
['Head Physio','Palesa Zwane','Looks after injury prevention and match-day treatment to keep every Pirate fit and sharp.','image/pal.jpeg']];
$('#staffGrid').innerHTML=staff.map((s,i)=>`<article class="person tilt"><img src="${s[3]}" alt="${s[0]} ${s[1]}" loading="lazy"><b class="no">${i+1}</b><div><span>${s[0]}</span><h3>${s[1]}</h3><p>${s[2]}</p></div></article>`).join('');
document.querySelectorAll('.person').forEach(el=>{if(reduce)return;el.addEventListener('pointermove',e=>{const b=el.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;el.style.transform=`rotateY(${x*14}deg) rotateX(${-y*14}deg) translateZ(10px)`;});el.addEventListener('pointerleave',()=>el.style.transform='');});

/* ---------- Count-up stats ---------- */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;io.unobserve(e.target);
  const n=+e.target.dataset.n,s=e.target.dataset.s||'';let k=0;const id=setInterval(()=>{k+=Math.max(1,n/30);if(k>=n){k=n;clearInterval(id);}e.target.textContent=Math.round(k)+s;},30);}),{threshold:.6});
document.querySelectorAll('[data-n]').forEach(el=>io.observe(el));


/* ---------- Trophy cabinet ---------- */
(function(){const cab=$('#cabinet');if(!cab)return;
  const G='fill="url(#gd)" stroke="#5c4410" stroke-width="1.5"';
  const base=`<rect x="26" y="114" width="48" height="12" rx="3" ${G}/><rect x="32" y="108" width="36" height="8" rx="2" ${G}/><rect x="44" y="84" width="12" height="26" ${G}/>`;
  const shapes={
   cup:n=>`<path d="M22 12H78V40C78 66 64 84 50 84C36 84 22 66 22 40Z" ${G}/><path d="M22 20H10C6 20 6 46 25 54M78 20H90C94 20 94 46 75 54" fill="none" stroke="url(#gd)" stroke-width="6" stroke-linecap="round"/>${n?`<text x="50" y="58" text-anchor="middle" font-size="34" font-weight="900" font-family="Big Shoulders Display,sans-serif" fill="#1a1300">x${n}</text>`:'<path d="M50 24l5 11 12 1-9 8 3 12-11-6-11 6 3-12-9-8 12-1z" fill="#1a1300" opacity=".55"/>'}${base}`,
   ball:()=>`<circle cx="50" cy="46" r="32" ${G}/><path d="M50 30l14 10-5 16H41l-5-16z" fill="#1a1300" opacity=".7"/><path d="M50 14v16M64 40l16-5M59 56l8 14M41 56l-8 14M36 40l-16-5" stroke="#1a1300" stroke-width="2" opacity=".6"/>${base.replace('y="84" width="12" height="26"','y="78" width="12" height="32"')}`,
   shield:()=>`<path d="M22 12H78V50C78 72 62 84 50 92C38 84 22 72 22 50Z" ${G}/><path d="M50 26l6 12 13 2-10 9 3 13-12-7-12 7 3-13-10-9 13-2z" fill="#1a1300" opacity=".6"/>${base.replace('y="84"','y="90"').replace('height="26"','height="20"')}`};
  const list=[['2025','Shushabino Top 32','2025 Champions (in association)','cup'],['2025','Maberete Champs','2025 Champions','cup'],
   ['2024','African Pride','2024 Champions','ball'],['24/25','SAFA GP Hollywoodbets MRL','2024/25 Champions','shield'],
   ['22\u201325','Sedibeng Stream B MRL','Champions 22/23, 23/24, 24/25','cup',3],['2022','MLFA Champs','2022 Champions','cup'],
   ['Next','MLFA team campaigning','Gauteng ABC Motsepe League','cup',0,1]];
  cab.innerHTML='<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="gd" x1="0" x2="1"><stop offset="0" stop-color="#8a6212"/><stop offset=".35" stop-color="#ffe08a"/><stop offset=".62" stop-color="#f5c542"/><stop offset="1" stop-color="#7a5410"/></linearGradient></defs></svg>'+
   list.map((t,i)=>`<div class="slot${t[5]?' next':''}"><div class="shelf"><div class="beam"></div><div class="tro" style="--d:${i*.14}s"><svg viewBox="0 0 100 130" class="${t[5]?'ghost':''}" role="img" aria-label="${t[1]}">${shapes[t[3]](t[4])}</svg></div></div><div class="plate"><b>${t[0]}</b><h3>${t[1]}</h3><p>${t[2]}</p></div></div>`).join('');
  new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){cab.classList.add('in');o.disconnect();}}),{threshold:.25}).observe(cab);
})();

/* ---------- Team video theater ---------- */
(function(){const tv=$('#tVid'),reel=$('#reel');if(!tv||!reel)return;
  const clips=[['teamVd/TeamVid1.mp4','image/teamvid1-poster.jpg','Ball work','0:53'],['teamVd/TeamVid2.mp4','image/teamvid2-poster.jpg','Squad line-up','0:25'],['teamVd/TeamVid3.mp4','image/teamvid3-poster.jpg','Training drills','1:20']];
  let ci=0;
  reel.innerHTML=clips.map((c,i)=>`<button class="clip${i?'':' on'}" data-i="${i}"><img src="${c[1]}" alt="" loading="lazy"><span><b>${c[2]}</b><small>Clip ${i+1}, ${c[3]}</small></span></button>`).join('');
  const blur=$('#tBlur');blur.style.backgroundImage=`url(${clips[0][1]})`;
  function go(i,auto){ci=i;tv.src=clips[i][0];tv.poster=clips[i][1];blur.style.backgroundImage=`url(${clips[i][1]})`;
    [...reel.children].forEach((b,k)=>b.classList.toggle('on',k===i));$('#tNow').textContent=`Clip ${i+1} of ${clips.length}`;if(auto)tv.play().catch(()=>{});}
  reel.addEventListener('click',e=>{const b=e.target.closest('.clip');if(b)go(+b.dataset.i,true);});
  tv.addEventListener('ended',()=>go((ci+1)%clips.length,true));
  new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){if(!reduce)tv.play().catch(()=>{});}else tv.pause();}),{threshold:.5}).observe(tv);
})();

/* ---------- Achievements reveal ---------- */
(function(){const a=$('#achs');if(!a)return;
  new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){a.classList.add('in');o.disconnect();}}),{threshold:.2}).observe(a);})();
