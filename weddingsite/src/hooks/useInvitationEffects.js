/* eslint-disable */
// useInvitationEffects.js
// Adds the interactive layer (scroll effects, rose petals, gold dust, back-to-top ring,
// countdown flip, calendar download, schedule gold light streak) to the existing page.
// It works on the DOM your components already render, so class names and ids must match
// (see INTEGRATION_GUIDE.md section 3). Call it once, in App.
import { useEffect } from 'react'

function fxMain() {

  var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine=window.matchMedia&&matchMedia('(hover:hover) and (pointer:fine)').matches;
  var raf=window.requestAnimationFrame||function(f){return setTimeout(f,16)};
  var bar=$('.bar');
  var btt=document.createElement('button');btt.className='btt';btt.type='button';btt.setAttribute('aria-label','Back to top');btt.innerHTML='<svg viewBox="0 0 48 48" aria-hidden="true"><circle class="trk" cx="24" cy="24" r="22"/><circle class="arc" cx="24" cy="24" r="22"/></svg><span>&#8593;</span>';var arc=btt.querySelector('.arc'),CIRC=2*Math.PI*22;arc.style.strokeDasharray=CIRC;document.body.appendChild(btt);
  btt.addEventListener('click',function(){window.scrollTo({top:0,behavior:reduce?'auto':'smooth'})});
  if(!reduce)document.documentElement.classList.add('fx');

  /* button ripple */
  document.addEventListener('pointerdown',function(e){
    var b=e.target.closest&&e.target.closest('.btn');if(!b||reduce)return;
    var r=b.getBoundingClientRect(),d=Math.max(r.width,r.height)*2.2,s=document.createElement('span');
    s.className='ripple';s.style.cssText='width:'+d+'px;height:'+d+'px;left:'+(e.clientX-r.left-d/2)+'px;top:'+(e.clientY-r.top-d/2)+'px';
    b.appendChild(s);setTimeout(function(){s.remove()},700);
  });

  /* stagger delays */
  $$('#tl .ev').forEach(function(el,i){el.style.setProperty('--d',(i*.1)+'s')});
  $$('.swatches .sw').forEach(function(el,i){el.style.setProperty('--k',i)});

  /* nav highlight + swatch pop */
  if('IntersectionObserver' in window){
    var links={};$$('.bar nav a').forEach(function(a){links[a.getAttribute('href')]=a});
    var vis={};
    var so=new IntersectionObserver(function(es){es.forEach(function(e){vis['#'+e.target.id]=e.isIntersecting});
      var cur=null;Object.keys(vis).forEach(function(k){if(vis[k])cur=k});
      Object.keys(links).forEach(function(k){links[k].classList.toggle('act',k===cur)})},{rootMargin:'-40% 0px -50% 0px'});
    $$('main section[id]').forEach(function(s){so.observe(s)});
    var go=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('go');go.unobserve(e.target)}})},{threshold:.3});
    $$('.swatches').forEach(function(s){go.observe(s)});
  }else $$('.swatches').forEach(function(s){s.classList.add('go')});

  /* countdown flip */
  if(window.MutationObserver)$$('.unit b').forEach(function(b){
    new MutationObserver(function(){if(reduce)return;b.classList.remove('tick');void b.offsetWidth;b.classList.add('tick')}).observe(b,{childList:true,characterData:true,subtree:true});
  });

  /* scroll: progress, header, timeline line, poster parallax */
  var tl=$('#tl'),poster=$('.poster'),posterImg=$('.poster img'),ticking=false,lastY=scrollY,wind=0;
  function onScroll(){
    var y=scrollY,max=document.documentElement.scrollHeight-innerHeight;
    arc.style.strokeDashoffset=(CIRC*(max>0?Math.min(1,y/max):1)).toFixed(1);
    bar.classList.toggle('stuck',y>10);btt.classList.toggle('show',y>700);
    wind=Math.max(-14,Math.min(14,wind+(y-lastY)*.08));lastY=y;
    if(!reduce){
      var r=tl&&tl.getBoundingClientRect(),p=poster&&poster.getBoundingClientRect();if(tl){tl.style.setProperty('--tl',Math.max(0,Math.min(1,(innerHeight*.75-r.top)/r.height)).toFixed(3))}
      if(poster){posterImg.style.setProperty('--py',((p.top+p.height/2-innerHeight/2)*-.06).toFixed(1)+'px')}
    }
    ticking=false;
  }
  addEventListener('scroll',function(){if(!ticking){ticking=true;raf(onScroll)}},{passive:true});
  addEventListener('resize',onScroll);onScroll();

  /* pointer tilt */
  if(fine&&!reduce)$$('.unit,.qr,.photo').forEach(function(el){
    var t=el.classList.contains('photo')?$('img',el):el;
    el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      t.style.transform='perspective(700px) rotateX('+(-y*10).toFixed(1)+'deg) rotateY('+(x*12).toFixed(1)+'deg) scale(1.05)'});
    el.addEventListener('pointerleave',function(){t.style.transform=''});
  });

  /* particles: ambient petals, tap sparkles, confetti */
  if(reduce)return;
  var cv=document.createElement('canvas');cv.id='fx';document.body.appendChild(cv);
  var cx=cv.getContext('2d'),D=Math.min(devicePixelRatio||1,1.5),W,H,P=[],B=[],on=false,
      COL=['#f4a6b8','#ee8aa3','#e86f8e','#f7b9c8','#e0607f','#fbcfd9'],GOLD=['#c4994f','#e8d2a2','#f6e3bb','#fff4d6'],CONF=['#c4994f','#e8d2a2','#a8645f','#f2cfc0','#6e1a31','#fdf7f1'];
  function size(){W=innerWidth;H=innerHeight;cv.width=W*D;cv.height=H*D;cv.style.width=W+'px';cv.style.height=H+'px';cx.setTransform(D,0,0,D,0,0)}
  size();addEventListener('resize',size);
  function pick(a){return a[Math.random()*a.length|0]}
  function mk(c,back){var w=72,h=92,k=document.createElement('canvas');k.width=w*2;k.height=h*2;var g=k.getContext('2d');g.scale(2,2);
    g.beginPath();g.moveTo(36,88);g.bezierCurveTo(16,72,2,46,7,26);g.bezierCurveTo(10,10,27,3,34,11);g.quadraticCurveTo(36,7,38,11);g.bezierCurveTo(45,3,62,10,65,26);g.bezierCurveTo(70,46,56,72,36,88);g.closePath();
    var f=g.createLinearGradient(36,6,36,88);f.addColorStop(0,c[0]);f.addColorStop(.55,c[1]);f.addColorStop(1,c[2]);g.fillStyle=f;g.fill();
    g.save();g.clip();
    var sh=g.createRadialGradient(36,92,2,36,92,48);sh.addColorStop(0,'rgba(60,0,20,.6)');sh.addColorStop(1,'rgba(60,0,20,0)');g.fillStyle=sh;g.fillRect(0,0,w,h);
    var hl=g.createRadialGradient(26,28,2,26,28,28);hl.addColorStop(0,'rgba(255,255,255,.5)');hl.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=hl;g.fillRect(0,0,w,h);
    g.strokeStyle='rgba(120,20,50,.22)';g.lineWidth=.7;
    for(var i=-3;i<=3;i++){g.beginPath();g.moveTo(36,86);g.quadraticCurveTo(36+i*6,50,36+i*10,14+Math.abs(i)*4);g.stroke()}
    if(back){g.fillStyle='rgba(70,0,25,.3)';g.fillRect(0,0,w,h)}
    g.restore();g.strokeStyle='rgba(255,235,240,.45)';g.lineWidth=1;g.stroke();return k}
  var CS=[['#fbd0d8','#ee8fa6','#b8325a'],['#ffe0e6','#f4a6b8','#c94a6e'],['#f9c0cc','#e0607f','#9c2347'],['#fff0f2','#f7b9c8','#d4607f'],['#f08aa0','#c8315a','#7e1634']],
      SP=CS.map(function(c){return mk(c)}),SB=CS.map(function(c){return mk(c,1)});
  function petal(top){return{x:Math.random()*W,y:top?-30:Math.random()*H,h:16+Math.random()*16,k:Math.random()*CS.length|0,fl:Math.random()*6.28,vf:.015+Math.random()*.03,r:Math.random()*6.28,vr:(Math.random()-.5)*.035,vy:.35+Math.random()*.6,ph:Math.random()*6.28,sw:.3+Math.random()*.6,a:.8+Math.random()*.2}}
  var N=W<600?7:12;for(var i=0;i<N;i++)P.push(petal());
  function burst(x,y,n,conf){for(var i=0;i<n;i++){var a=Math.random()*6.28,v=(conf?4:2)+Math.random()*(conf?7:3.5);
    B.push({x:x,y:y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-(conf?4:1),g:conf?.18:.08,s:conf?4+Math.random()*4:1.5+Math.random()*2,r:Math.random()*6.28,vr:(Math.random()-.5)*.4,c:pick(conf?CONF:GOLD),life:1,d:(conf?.008:.02)+Math.random()*.01,sq:conf})}
    if(!on)start()}
  function frame(){
    if(!on)return;
    cx.clearRect(0,0,W,H);
    P.forEach(function(p){p.ph+=.015;p.x+=Math.sin(p.ph)*p.sw+wind*.25;p.y+=p.vy+Math.abs(wind)*.15;p.r+=p.vr;
      if(p.y>H+20||p.x<-30||p.x>W+30){Object.assign(p,petal(true))}
      p.fl+=p.vf;var sx=Math.cos(p.fl),ph=p.h,pw=ph*.78;cx.save();cx.translate(p.x,p.y);cx.rotate(p.r);cx.scale(Math.max(.18,Math.abs(sx)),1);cx.globalAlpha=p.a;cx.drawImage(sx>=0?SP[p.k]:SB[p.k],-pw/2,-ph/2,pw,ph);cx.restore()});
    wind*=.94;
    for(var i=B.length-1;i>=0;i--){var b=B[i];b.vy+=b.g;b.vx*=.985;b.x+=b.vx;b.y+=b.vy;b.r+=b.vr;b.life-=b.d;
      if(b.life<=0||b.y>H+20){B.splice(i,1);continue}
      cx.save();cx.translate(b.x,b.y);cx.rotate(b.r);cx.globalAlpha=Math.min(1,b.life*1.5);cx.fillStyle=b.c;
      if(b.sq)cx.fillRect(-b.s/2,-b.s/4,b.s,b.s/2);else{cx.beginPath();cx.arc(0,0,b.s,0,6.28);cx.fill()}cx.restore()}
    raf(frame);
  }
  function start(){if(on)return;on=true;raf(frame)}
  document.addEventListener('visibilitychange',function(){if(document.hidden)on=false;else if(document.body.classList.contains('live'))start()});
  function live(){if(document.body.classList.contains('live'))start()}
  new MutationObserver(live).observe(document.body,{attributes:true,attributeFilter:['class']});live();

  /* confetti on celebration trigger (preserved if #card exists) */
  if(window.MutationObserver)[['#card',true]].forEach(function(a){var el=$(a[0]);if(!el)return;var was=el.classList.contains('sent');
    new MutationObserver(function(){var now=el.classList.contains('sent');
      if(now&&!was){var h=$('#done-h'),happy=!a[1]||!/miss/i.test(h?h.textContent:'');
        if(happy){var r=el.getBoundingClientRect();burst(r.left+r.width/2,Math.max(80,r.top+r.height/3),90,true)}}was=now}).observe(el,{attributes:true,attributeFilter:['class']})});

}

function fxExtras() {

  var $=function(s,r){return (r||document).querySelector(s)};
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine=window.matchMedia&&matchMedia('(hover:hover) and (pointer:fine)').matches;
  var raf=window.requestAnimationFrame||function(f){return setTimeout(f,16)};

  /* add-to-calendar (.ics) under the schedule */
  var tl=$('#tl');
  if(tl){
    var wrap=document.createElement('div');wrap.className='cal';
    wrap.innerHTML='<button type="button" class="btn ghost" id="calBtn">Add all events to my calendar</button>';
    tl.parentNode.appendChild(wrap);
    var EV=[['Engagement','20261212T130000Z','20261212T140000Z','SVK Mahal\\, Pollachi'],
            ['Wedding ceremony','20261212T230000Z','20261213T010000Z','Sri Subramaniyar Thirukkoyil\\, Pollachi'],
            ['Reception','20261215T073000Z','20261215T083000Z','SVK Mandapam\\, Sivakasi']];
    $('#calBtn').addEventListener('click',function(){
      var L=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Prakash and Agnes//Wedding//EN'];
      EV.forEach(function(e,i){L.push('BEGIN:VEVENT','UID:pa-'+i+'@wedding','DTSTAMP:20261101T000000Z','DTSTART:'+e[1],'DTEND:'+e[2],'SUMMARY:Prakash & Agnes - '+e[0],'LOCATION:'+e[3],'BEGIN:VALARM','TRIGGER:-PT3H','ACTION:DISPLAY','DESCRIPTION:Reminder','END:VALARM','END:VEVENT')});
      L.push('END:VCALENDAR');
      var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([L.join('\r\n')],{type:'text/calendar'}));a.download='Prakash-Agnes-Wedding.ics';
      document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500);
      var b=$('#calBtn');b.textContent='Saved. Open the file to add';setTimeout(function(){b.textContent='Add all events to my calendar'},3500);
    });
  }
  if(reduce)return;

  /* floating gold dust */
  var d=document.createElement('div');d.className='dust';
  for(var i=0;i<8;i++){var s=document.createElement('i'),z=3+Math.random()*6;
    s.style.cssText='left:'+(Math.random()*100)+'%;width:'+z+'px;height:'+z+'px;--t:'+(12+Math.random()*14)+'s;--dl:-'+(Math.random()*20)+'s;--x:'+((Math.random()-.5)*120)+'px';d.appendChild(s)}
  document.body.appendChild(d);

  return;
  /* pointer light + magnetic buttons disabled for smoothness */
  var sp=document.createElement('div');sp.className='spot';document.body.appendChild(sp);
  var tx=0,ty=0,x=0,y=0,run=false;
  function step(){x+=(tx-x)*.12;y+=(ty-y)*.12;sp.style.transform='translate('+x+'px,'+y+'px)';
    if(Math.abs(tx-x)+Math.abs(ty-y)>.5)raf(step);else run=false}
  addEventListener('pointermove',function(e){tx=e.clientX;ty=e.clientY;sp.classList.add('on');if(!run){run=true;raf(step)}},{passive:true});
  document.addEventListener('pointerleave',function(){sp.classList.remove('on')});

  /* magnetic buttons */
  Array.prototype.forEach.call(document.querySelectorAll('.btn'),function(b){
    b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();
      b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.18).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*.3-2).toFixed(1)+'px)'});
    b.addEventListener('pointerleave',function(){b.style.transform=''});
  });

}

function fxSchedule() {
  // Light streak is rendered directly in Schedule.jsx component JSX:
  // <span className="shine"><i /></span>
  // Fallback in case dynamic items appear without shine:
  function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}
  function whenReady(fn){if(document.readyState==='complete')setTimeout(fn,0);else addEventListener('load',function(){setTimeout(fn,0)})}
  whenReady(function(){$$('#tl .ev>div').forEach(function(d){if(d.querySelector('.shine'))return;var s=document.createElement('span');s.className='shine';s.innerHTML='<i></i>';d.appendChild(s)})});
}

export default function useInvitationEffects() {
  useEffect(() => {
    // One run per page load. React StrictMode mounts effects twice in development,
    // and the flag stops the listeners and canvas from being added twice.
    if (window.__invFxStarted) return
    window.__invFxStarted = true
    // Wait one tick so every component has rendered its markup first.
    setTimeout(() => { fxMain(); fxExtras(); fxSchedule() }, 0)
  }, [])
}
