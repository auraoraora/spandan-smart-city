/* ====== Home ====== */
addI({en:{
 scoreHow:'How the score is made',pMove:'Getting around',pClean:'Cleanliness',pUtil:'Water & power',pAir:'Air',thisWeek:'this week',scoreCap:'The score is the average of four parts. Tap a bar to see what lifts it.',
 busy:'Busy',clear:'Moving well',heavy:'Heavy',vanAt:'Van at {t}',lateOnce:'Thursday was late',onTime:'On time all week',sunNow:'from the sun',sunCap:"{p}% of {city}'s power comes from the sun today.",
 trafCap:'Roads fill up around {t}. Leave before then.',airCap:'Dial runs from 0 (clean) to 300 (very bad).',garCap:'Bars show minutes after the planned time. Red means late.',
 waterAlert:'Water at {area} tomorrow starts 40 minutes late, at {t}.',alert:'Alert',nearCap:'Numbers match the list below. Tap a pin to see it.',pNew:'New',pSeen:'Seen',pFix:'Being fixed',pDone:'Fixed',event:'Event',
 aiNote:'Made from city data. This is a demo model.',confidence:'{n}% sure',whyBtn:'Ask why',hot:'Most upvoted near you',topCap:'Cleanest areas this week',
 srcTraffic:'City traffic police, live',srcAir:'Pollution control board sensors',srcGarbage:'Municipal van GPS',srcPower:'Grid operator and rooftop meters',srcScore:'Average of the four city feeds',srcNear:'Citizen reports and city work orders',
 leaveAt:'Leave at {t}',leaveSub:'on {road}',saveMin:'saves {n} min',waterWin:'Water {a} to {b}',waterSub:'Fill tanks early',
 airIs:'Air is {s}',airSub:'AQI {n}',cutAt:'Power cut {a} to {b}',cutSub:'{why}. Charge devices before.',evSub:'near {a}',safeT:'Lights checked on your road',safeS:'All working as of last night',
 conn:'Connected feeds',notThere:'{f} is not connected for {city} yet.',
},hi:{
 scoreHow:'स्कोर कैसे बनता है',pMove:'आना-जाना',pClean:'सफ़ाई',pUtil:'पानी और बिजली',pAir:'हवा',thisWeek:'इस हफ़्ते',scoreCap:'स्कोर चार हिस्सों का औसत है। बार छूकर देखें क्या बढ़ाता है।',
 busy:'भीड़',clear:'आराम से चल रहा',heavy:'बहुत भारी',vanAt:'गाड़ी {t} पर',lateOnce:'गुरुवार को देर हुई',onTime:'पूरे हफ़्ते समय पर',sunNow:'सूरज से',sunCap:'आज {city} की {p}% बिजली सूरज से आ रही है।',
 trafCap:'सड़कें {t} के आसपास भर जाती हैं। उससे पहले निकलें।',airCap:'डायल 0 (साफ़) से 300 (बहुत ख़राब) तक है।',garCap:'बार बताते हैं तय समय के कितने मिनट बाद आई। लाल मतलब देर।',
 waterAlert:'कल {area} में पानी 40 मिनट देर से, {t} पर आएगा।',alert:'अलर्ट',nearCap:'नंबर नीचे की सूची से मिलते हैं। पिन छूकर देखें।',pNew:'नई',pSeen:'देखी गई',pFix:'ठीक हो रही',pDone:'ठीक हुई',event:'कार्यक्रम',
 aiNote:'शहर के डेटा से बना। यह डेमो मॉडल है।',confidence:'{n}% भरोसा',whyBtn:'क्यों पूछें',hot:'आपके पास सबसे ज़्यादा वोट',topCap:'इस हफ़्ते सबसे साफ़ इलाके',
 srcTraffic:'शहर ट्रैफिक पुलिस, लाइव',srcAir:'प्रदूषण बोर्ड के सेंसर',srcGarbage:'नगर निगम गाड़ी GPS',srcPower:'ग्रिड ऑपरेटर और छत के मीटर',srcScore:'शहर के चार डेटा का औसत',srcNear:'नागरिक शिकायतें और निगम के काम',
 leaveAt:'{t} पर निकलें',leaveSub:'{road} पर',saveMin:'{n} मिनट बचेंगे',waterWin:'पानी {a} से {b}',waterSub:'टंकी जल्दी भर लें',
 airIs:'हवा {s}',airSub:'AQI {n}',cutAt:'बिजली कटौती {a} से {b}',cutSub:'{why}। पहले चार्ज कर लें।',evSub:'{a} के पास',safeT:'आपकी सड़क की लाइटें जाँची गईं',safeS:'कल रात तक सब चालू',
 conn:'जुड़े हुए डेटा',notThere:'{city} के लिए {f} अभी जुड़ा नहीं है।',
}});

const trafLbl=v=>v>70?{c:'bad',k:'heavy'}:v>45?{c:'warn',k:'busy'}:{c:'good',k:'clear'};
function dayItems(){
  const D=sim(),Lv=leaveAt(),c=city(),out=[];
  S.prefs.forEach(k=>{
    if(!has(k))return;
    if(k==='move')out.push({k,ic:'travel',time:fmtT(Lv.dep),title:t('leaveAt',{t:fmtT(Lv.dep)}),sub:t('leaveSub',{road:c.road})+' · '+t('saveMin',{n:Lv.saved})});
    if(k==='garbage')out.push({k,ic:'waste',time:fmtT(D.vanMin),title:t('vanAt',{t:fmtT(D.vanMin)}),sub:areaName(curArea())});
    if(k==='water')out.push({k,ic:'drop',time:fmtT(D.waterS),title:t('waterWin',{a:fmtT(D.waterS),b:fmtT(D.waterS+90)}),sub:t('waterSub')});
    if(k==='air'){const a=aqiInfo(D.aqi);out.push({k,ic:'wind',time:'AQI '+D.aqi,title:t('airIs',{s:a[S.lang==='hi'?'hi':'en']}),sub:S.lang==='hi'?'टहलने का अच्छा समय: शाम 5 से 7':'Best time for a walk: 5 to 7 PM'});}
    if(k==='power')out.push({k,ic:'bolt',time:fmtT(D.cuts[0].s),title:t('cutAt',{a:fmtT(D.cuts[0].s),b:fmtT(D.cuts[0].e)}),sub:t('cutSub',{why:L(D.cuts[0].why)})});
    if(k==='events')out.push({k,ic:'cal',time:L(D.events[0].when).split(' · ')[0],title:L(D.events[0].n),sub:t('evSub',{a:areaName(D.events[0].at)})});
    if(k==='safety')out.push({k,ic:'shield',time:S.lang==='hi'?'रात':'Night',title:t('safeT'),sub:t('safeS')});
  });
  return out;
}
const dayRow=it=>`<div class="li"><div class="ic">${ico(it.ic)}</div><div class="grow"><b>${esc(it.title)}</b><div class="faint" style="font-size:.82rem">${esc(it.sub)}</div></div><div class="time num">${esc(it.time)}</div></div>`;
function applyPrefs2(){}
function insights(){
  const D=sim(),out=[],h=D.nowI;let best=Math.max(h,6),bv=1e9;for(let i=Math.max(h,6);i<=21;i++)if(D.aqiH[i]<bv){bv=D.aqiH[i];best=i}
  out.push({ic:'wind',conf:86,q:'air',t:{en:`Air will be cleanest around ${fmtT(best*60)} (AQI near ${bv}). Plan walks and cycling then.`,hi:`हवा ${fmtT(best*60)} के आसपास सबसे साफ़ होगी (AQI करीब ${bv})। टहलना या साइकिल तब रखें।`}});
  if(has('garbage'))out.push({ic:'waste',conf:78,q:'garbage',t:{en:'The van was late once in the last 7 days on your street. If it is late again, we will flag it to the ward office for you.',hi:'पिछले 7 दिन में आपकी गली में गाड़ी एक बार देर से आई। फिर देर हुई तो हम वार्ड दफ़्तर को बता देंगे।'}});
  if(has('power')){const pk=D.solar.indexOf(Math.max(...D.solar));out.push({ic:'bolt',conf:81,q:'power',t:{en:`Run the washing machine or geyser around ${fmtT(pk*60-60)} to ${fmtT(pk*60+60)}. Most of the power is from the sun then.`,hi:`वॉशिंग मशीन या गीज़र ${fmtT(pk*60-60)} से ${fmtT(pk*60+60)} के बीच चलाएँ। तब ज़्यादातर बिजली सूरज की होती है।`}})}
  const top=live().filter(r=>r.st<3).sort((a,b)=>b.votes-a.votes)[0];
  if(top)out.push({ic:'users',conf:92,q:'report',t:{en:`${top.votes} neighbours upvoted “${top.title.en}”. More upvotes move it up the city’s fix list.`,hi:`${top.votes} पड़ोसियों ने “${top.title.hi}” को वोट दिया। ज़्यादा वोट से यह निगम की सूची में ऊपर जाएगा।`}});
  return out;
}
function homeTile(k){
  const D=sim(),c=city();
  const wrap=(feed,ic,title,body,cap,src,to)=>has(feed)?`<button class="card tile" data-act="tile" data-to="${to}" type="button"><div class="row between"><span class="eyebrow">${title}</span>${ico(ic,'faint').replace('<svg','<svg width="18" height="18"')}</div>${body}<p class="cap" style="margin-top:2px">${cap}</p><p class="src">${t('source')}: ${src}</p></button>`
   :`<div class="card tile off flat"><div class="row between"><span class="eyebrow">${title}</span>${ico(ic,'faint').replace('<svg','<svg width="18" height="18"')}</div><p class="muted" style="margin-top:8px">${t('notThere',{f:title,city:cname()})}</p></div>`;
  if(k==='traffic'){const v=D.traffic[D.nowI],tl=trafLbl(v),pkh=D.traffic.indexOf(Math.max(...D.traffic.slice(14,22)));
    return wrap('move','travel',t('traffic'),`<div class="row between"><span class="tv">${t(tl.k)}</span><span class="pill ${tl.c}">${v}%</span></div>${chLine(D.traffic,{nowI:D.nowI,from:5,to:22})}`,t('trafCap',{t:fmtT(pkh*60-30)}),t('srcTraffic'),'travel')}
  if(k==='air'){const a=aqiInfo(D.aqi);return wrap('air','wind',t('air'),`<div class="row between"><span class="tv">${D.aqi}</span><span class="pill ${a.c}">${S.lang==='hi'?a.hi:a.en}</span></div>${chDial(D.aqi)}`,t('airCap'),t('srcAir'),'air')}
  if(k==='garbage'){const late=D.days.some(x=>x.late);return wrap('garbage','waste',t('garbage'),`<div class="row between"><span class="tv">${t('vanAt',{t:fmtT(D.vanMin)})}</span></div>${chBars7(D.days)}`,late?t('lateOnce'):t('onTime'),t('srcGarbage'),'waste')}
  if(k==='power')return wrap('power','bolt',t('power'),`<div class="row" style="gap:14px">${chRing(D.solarShare,{sub:t('sunNow')})}<div class="grow"><span class="tv">${D.solarShare}%</span><div class="muted" style="font-size:.85rem">${t('sunNow')}</div></div></div>`,t('sunCap',{p:D.solarShare,city:cname()}),t('srcPower'),'waste');
}
function nearPins(){
  const a=curArea(),arr=live().slice().sort((x,y)=>(y.area===a)-(x.area===a)||y.votes-x.votes).slice(0,5);
  const pins=arr.map((r,i)=>({x:r.x,y:r.y,st:r.st,n:i+1,label:L(r.title),r}));
  return pins;
}
PAGES.home=function(){
  const D=sim(),c=city(),h=new Date().getHours(),g=h<12?'gm':h<17?'ga':'ge',day=dayItems();
  const parts=[['pMove',D.parts.move],['pClean',D.parts.clean],['pUtil',D.parts.util],['pAir',D.parts.air]];
  const order=['traffic','air','garbage','power'].sort((a,b)=>{const m={traffic:'move',air:'air',garbage:'garbage',power:'power'};return (S.prefs.includes(m[b])?1:0)-(S.prefs.includes(m[a])?1:0)});
  const pins=nearPins(),ev=D.events[0];
  const evp={x:318,y:70,ev:true,n:'★',label:L(ev.n)};
  const wa=has('water')?`<div class="card sun row" style="gap:14px">${ico('drop').replace('<svg','<svg width="26" height="26" style="flex:none"')}<div class="grow"><span class="pill warn">${t('alert')}</span><div style="font-weight:700;margin-top:4px">${t('waterAlert',{area:esc(areaName(curArea())),t:fmtT(D.waterS+40)})}</div></div></div>`:'';
  return`<div class="stack">
  <section style="padding:6px 0 4px"><div class="eyebrow">${new Date().toLocaleDateString(S.lang==='hi'?'hi-IN':'en-IN',{weekday:'long',day:'numeric',month:'long'})}</div>
   <h1 class="h1" style="margin-top:6px">${t(g)}, ${esc(cname())}.</h1>
   <svg class="squiggle" viewBox="0 0 150 14" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"><path d="M3 9C14 2 22 14 34 7S54 2 65 8s22 6 32-1 24-3 33 2 14 1 18-2"/></svg>
   <p class="muted" style="margin-top:8px">${t('greetSub',{area:esc(areaName(curArea()))})}</p></section>
  ${wa}
  <div class="g2">
   <section class="card"><div class="sechead" style="margin:0 0 4px"><h2 class="h2">${t('yourDay')}</h2><span class="pill good"><i class="live"></i>&nbsp;${t('now')}</span></div><div class="list">${day.map(dayRow).join('')||`<p class="muted">${t('notThere',{f:'',city:cname()})}</p>`}</div></section>
   <section class="card brand" data-open="${S.scoreOpen}"><div class="row between"><span class="eyebrow">${t('cityScore')} · ${esc(cname())}</span>${chSpark(D.wscore,{col:'var(--sun)'})}</div>
    <div class="row" style="align-items:flex-end;gap:10px;margin-top:6px"><span class="big num" id="scoreN" data-n="${D.score}">${D.score}</span><span class="muted" style="margin-bottom:6px">/100 · +${D.wscore[6]-D.wscore[0]>0?D.wscore[6]-D.wscore[0]:1} ${t('thisWeek')}</span></div>
    <div class="stack" style="gap:12px;margin-top:14px">${parts.map(([k,v],i)=>`<div><div class="row between" style="font-size:.85rem"><span>${t(k)}</span><b class="num">${v}</b></div><div class="bar" style="margin-top:5px"><i style="width:${v}%"></i></div></div>`).join('')}</div>
    <p class="cap" style="color:var(--onbrand2)">${t('scoreCap')}</p><p class="src" style="color:var(--onbrand2)">${t('source')}: ${t('srcScore')}</p></section>
  </div>
  <div class="sechead"><h2 class="h2">${t('cityNow')}</h2><span class="faint" style="font-size:.8rem">${new Date().toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})}</span></div>
  <div class="g4">${order.map(homeTile).join('')}</div>
  <div class="g2">
   <section class="card"><div class="sechead" style="margin:0 0 10px"><h2 class="h2">${t('nearYou')}</h2></div>
    <div class="mapwrap" id="nearmap">${cityMap({pins:[...pins,evp]})}<div class="maplinks"><a href="${mapsUrl(areaName(curArea())+', '+cname())}" target="_blank" rel="noopener">${t('openMaps')}</a></div></div>
    <div class="legend"><span><i class="f-bad" style="background:var(--bad)"></i>${t('pNew')}</span><span><i style="background:var(--sun)"></i>${t('pFix')}</span><span><i style="background:var(--leaf)"></i>${t('pDone')}</span><span><i style="background:var(--info)"></i>${t('event')}</span></div>
    <p class="cap">${t('nearCap')}</p>
    <div class="list" id="nearlist" style="margin-top:6px">${pins.map((p,i)=>`<div class="li" data-i="${i}"><span class="numpin ${['nb-new','nb-new','nb-doing','nb-fix'][p.st]}">${i+1}</span><div class="grow"><b style="font-size:.92rem">${esc(p.label)}</b><div class="faint" style="font-size:.78rem">${esc(areaName(p.r.area))} · ${p.r.votes} ▲</div></div><span class="pill ${['bad','bad','warn','good'][p.st]}">${t(['pNew','pSeen','pFix','pDone'][p.st])}</span></div>`).join('')}
     <div class="li"><span class="numpin nb-event">★</span><div class="grow"><b style="font-size:.92rem">${esc(L(ev.n))}</b><div class="faint" style="font-size:.78rem">${esc(L(ev.when))} · ${esc(areaName(ev.at))}</div></div><span class="pill info">${t('event')}</span></div></div>
    <p class="src">${t('source')}: ${t('srcNear')}</p></section>
   <section class="card"><div class="sechead" style="margin:0 0 10px"><h2 class="h2">${ico('spark').replace('<svg','<svg width="20" height="20" style="vertical-align:-3px;color:var(--sun)"')} ${t('aiIns')}</h2></div>
    <div class="stack" style="gap:12px">${insights().map(i=>`<div class="cmt" style="padding:12px 14px"><div class="row" style="align-items:flex-start;gap:12px"><div class="ic" style="width:36px;height:36px;border-radius:11px;background:var(--surface);display:grid;place-items:center;flex:none">${ico(i.ic).replace('<svg','<svg width="19" height="19"')}</div><div class="grow"><p>${esc(L(i.t))}</p><div class="row wrap" style="margin-top:8px"><span class="pill mute">${t('confidence',{n:i.conf})}</span><button class="btn sm ghost" data-act="ask-q" data-q="${i.q}" type="button">${t('whyBtn')}</button></div></div></div></div>`).join('')}</div>
    <p class="src">${t('aiNote')}</p></section>
  </div>
  <div class="g2">
   <section class="card"><h2 class="h2" style="margin-bottom:10px">${t('topCap')}</h2><div class="list">${D.ranking.map((r,i)=>`<div class="li"><span class="rank" style="width:30px;height:30px;font-size:.9rem;${i>2?'background:var(--surface2);color:var(--ink2)':''}">${i+1}</span><div class="grow"><b>${esc(areaName(r.a))}</b><div class="bar ${i>2?'sun':''}" style="margin-top:6px"><i style="width:${r.s}%"></i></div></div><b class="num">${r.s}</b></div>`).join('')}</div></section>
   <section class="stack"><h2 class="h2">${t('hot')}</h2>${live().filter(r=>r.st<3).sort((a,b)=>b.votes-a.votes).slice(0,2).map(r=>postCard(r,{compact:true})).join('')}</section>
  </div></div>`;
};
AFTER.home=function(){
  const n=$('#scoreN');if(n){const to=+n.dataset.n,t0=performance.now();const f=now=>{const p=clamp((now-t0)/900,0,1);n.textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)}
};
ACT.tile=el=>{const to=el.dataset.to;if(to==='air')askOpen(S.lang==='hi'?'आज हवा कैसी है?':'How is the air today?');else go(to)};
ACT.pin=el=>{const i=+el.dataset.i;$$('#nearlist .li').forEach(x=>x.style.background='');const row=$(`#nearlist .li[data-i="${i}"]`);if(row){row.style.background='var(--leafsoft)';row.style.borderRadius='12px';row.scrollIntoView({block:'nearest',behavior:'smooth'})}};
