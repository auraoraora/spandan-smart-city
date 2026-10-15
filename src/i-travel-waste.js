/* ====== Travel ====== */
addI({en:{
 arrive:'Arrive {t}',vsLate:'{n} min faster than leaving at {t}',otherWays:'Other ways',byBus:'Bus {no}',byAuto:'Auto or cab',byBike:'Two-wheeler',directions:'Directions',
 layers:'Map layers',lTraffic:'Traffic',lBus:'Buses',lPark:'Parking',lEv:'Charging',hourly:'{road}, hour by hour',hourlyCap:'Red bars are the slowest hours. The darker bar is now.',
 busNow:'Buses near you',seatsFree:'Seats free',someSeats:'Some seats',veryFull:'Very full',minAway:'{n} min',airWay:'Air along your way',airWayCap:'Your road passes one busy junction. Close windows there.',
 parking:'Parking',free:'{n} free of {c}',charging:'Charging points',srcBus:'City bus GPS',
},hi:{
 arrive:'{t} पहुँचें',vsLate:'{t} पर निकलने से {n} मिनट जल्दी',otherWays:'और रास्ते',byBus:'बस {no}',byAuto:'ऑटो या कैब',byBike:'दोपहिया',directions:'रास्ता देखें',
 layers:'नक्शे की परतें',lTraffic:'ट्रैफिक',lBus:'बसें',lPark:'पार्किंग',lEv:'चार्जिंग',hourly:'{road}, हर घंटे',hourlyCap:'लाल बार सबसे धीमे घंटे हैं। गहरा बार अभी का है।',
 busNow:'पास की बसें',seatsFree:'सीटें खाली',someSeats:'कुछ सीटें',veryFull:'बहुत भीड़',minAway:'{n} मिनट',airWay:'रास्ते की हवा',airWayCap:'रास्ते में एक भीड़ वाला चौराहा है। वहाँ खिड़की बंद रखें।',
 parking:'पार्किंग',free:'{c} में से {n} खाली',charging:'चार्जिंग पॉइंट',srcBus:'सिटी बस GPS',
}});
PAGES.travel=function(){
  const D=sim(),c=city(),Lv=leaveAt();
  if(!has('move'))return`<div class="card"><h1 class="h2">${t('travel')}</h1><p class="muted">${t('notThere',{f:t('traffic'),city:cname()})}</p></div>`;
  const lay=[['traffic','lTraffic'],['bus','lBus'],['park','lPark'],['ev','lEv']],cw=['','seatsFree','someSeats','veryFull'];
  const dest=c.areas[2%c.areas.length];
  return`<div class="stack">
  <section class="card brand"><div class="eyebrow">${esc(areaName(curArea()))} → ${esc(areaName(dest))}</div>
   <h1 class="h1" style="margin-top:8px">${t('leaveAt',{t:fmtT(Lv.dep)})}</h1>
   <p style="margin-top:8px;font-size:1.05rem">${t('arrive',{t:fmtT(Lv.arr)})} · <span class="muted">${t('vsLate',{n:Lv.saved,t:fmtT(520)})}</span></p>
   <div class="divider" style="background:var(--brandline);margin:14px 0"></div><div class="eyebrow">${t('otherWays')}</div>
   <div class="g4" style="margin-top:10px;gap:10px">${[['bus',t('byBus',{no:D.crowd[0].no}),Lv.mine+9],['car',t('byAuto'),Lv.mine+2],['travel',t('byBike'),Math.round(Lv.mine*.8)]].map(([i,l,m])=>`<div class="row" style="gap:10px">${ico(i).replace('<svg','<svg width="20" height="20"')}<span class="grow">${esc(l)}</span><b class="num">${m} min</b></div>`).join('')}</div>
   <a class="btn onbrand sm" style="margin-top:14px;text-decoration:none" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(curArea()+', '+c.n.en)}&destination=${encodeURIComponent(dest+', '+c.n.en)}">${t('directions')} ${ico('ext').replace('<svg','<svg width="15" height="15"')}</a></section>
  <div class="g2">
   <section class="card"><div class="row between wrap" style="margin-bottom:10px"><h2 class="h2">${t('layers')}</h2></div>
    <div class="seg" role="tablist" style="margin-bottom:12px">${lay.map(([k,l])=>`<button role="tab" aria-selected="${S.mapLayer===k}" data-act="layer" data-k="${k}" type="button">${t(l)}</button>`).join('')}</div>
    <div class="mapwrap">${cityMap({layer:S.mapLayer})}<div class="maplinks"><a href="${mapsUrl(curArea()+', '+c.n.en)}" target="_blank" rel="noopener">${t('openMaps')}</a></div></div>
    ${S.mapLayer==='traffic'?`<div class="legend"><span><i style="background:var(--leaf)"></i>${t('clear')}</span><span><i style="background:var(--sun)"></i>${t('busy')}</span><span><i style="background:var(--bad)"></i>${t('heavy')}</span></div>`:''}
    <p class="src">${t('source')}: ${t('srcTraffic')}</p></section>
   <section class="card"><h2 class="h2">${t('hourly',{road:esc(c.road)})}</h2>${chHours(D.traffic,{nowI:D.nowI,badAbove:70,unit:'%'})}<p class="cap">${t('hourlyCap')}</p><p class="src">${t('source')}: ${t('srcTraffic')}</p></section>
  </div>
  <div class="g2">
   <section class="card"><h2 class="h2" style="margin-bottom:4px">${t('busNow')}</h2><div class="list">${D.crowd.map(b=>`<div class="li"><div class="ic">${ico('bus')}</div><div class="grow"><b>${esc(b.no)} → ${esc(areaName(b.to))}</b><div class="row" style="gap:8px;margin-top:4px"><span class="meter l${b.lvl}"><i></i><i></i><i></i></span><span class="faint" style="font-size:.8rem">${t(cw[b.lvl])}</span></div></div><div class="time num">${t('minAway',{n:b.eta[0]})}</div></div>`).join('')}</div><p class="src">${t('source')}: ${t('srcBus')}</p></section>
   <section class="card"><h2 class="h2" style="margin-bottom:10px">${t('airWay')}</h2>${chHBars([curArea(),c.road,dest].map((x,i)=>{const v=D.aqi+[-8,34,-15][i];return{l:areaName(x),v,txt:'AQI '+v,cls:v>150?'bad':v>100?'sun':''}}))}<p class="cap">${t('airWayCap')}</p>
    <div class="divider" style="margin:14px 0"></div><h3 class="h3" style="margin-bottom:8px">${t('parking')}</h3>${chHBars(D.park.map(p=>({l:p.n,v:p.free,txt:t('free',{n:p.free,c:p.cap}),cls:p.free<p.cap*.2?'bad':'info'})))}
    <h3 class="h3" style="margin:14px 0 8px">${t('charging')}</h3>${D.chg.map(x=>`<div class="row between" style="font-size:.9rem;padding:4px 0"><span>${ico('bolt').replace('<svg','<svg width="16" height="16" style="color:var(--sun)"')}</span><span class="grow">${esc(x.n)}</span><b class="num">${x.free}/${x.of}</b></div>`).join('')}</section>
  </div></div>`;
};
ACT.layer=el=>{S.mapLayer=el.dataset.k;render(true)};

/* ====== Waste & Power ====== */
addI({en:{
 vanTitle:'Garbage van',vanComing:'{n} min away',vanHere:'On your street now',vanDone:'Done for today. Next: tomorrow {t}',vanDepot:'Leaves depot soon',ready:"I'll be ready",simVan:'Play the morning (demo)',vanAlert:'Garbage van in 10 minutes. Keep wet and dry waste apart.',readyOk:'Noted. The driver sees one more home ready.',
 tasks:"Today's tasks",tasksCap:'Small things that keep your street clean. Each one adds to your streak.',pts:'{n} points',
 t_seg:'Keep wet and dry waste apart',t_van:'Hand over garbage at {t}',t_water:'Fill the water tank by {t}',t_peak:'Avoid heavy appliances 6 to 10 PM',t_tree:'Water the tree outside your home',
 whichBin:'Which dustbin?',binPh:'Type a thing, like bottle or medicine',binNone:"We don't know that yet. Keep it separate and ask the van driver.",
 wet:'Green · wet',dry:'Blue · dry',haz:'Red · hazardous',ew:'Black · e-waste',goes:"Where {city}'s garbage goes",goesCap:'60% is composted or recycled. The rest goes to energy plants and the landfill.',
 compost:'Composted',recyc:'Recycled',wte:'Waste-to-energy',landfill:'Landfill',sunPower:'Clean power by hour',sunCap:'Bars are taller when there is more sun.',
 yourPower:'Your power this week',yourCap:'You used less than your neighbours on most days.',streak:'Sorting streak',streakCap:'{n} of the last 21 days sorted right. Keep the yellow dots going.',cuts:'Planned power cuts',
},hi:{
 vanTitle:'कचरा गाड़ी',vanComing:'{n} मिनट दूर',vanHere:'अभी आपकी गली में',vanDone:'आज का काम हो गया। अगली: कल {t}',vanDepot:'जल्द डिपो से निकलेगी',ready:'मैं तैयार रहूँगा',simVan:'सुबह चलाकर देखें (डेमो)',vanAlert:'कचरा गाड़ी 10 मिनट में। गीला-सूखा अलग रखें।',readyOk:'नोट हुआ। ड्राइवर को एक और घर तैयार दिखेगा।',
 tasks:'आज के काम',tasksCap:'छोटे काम जो गली साफ़ रखते हैं। हर काम से आपकी लय बढ़ती है।',pts:'{n} अंक',
 t_seg:'गीला और सूखा कचरा अलग रखें',t_van:'{t} पर कचरा गाड़ी को दें',t_water:'{t} तक पानी की टंकी भरें',t_peak:'शाम 6 से 10 भारी उपकरण न चलाएँ',t_tree:'घर के बाहर पेड़ को पानी दें',
 whichBin:'कौन सा डिब्बा?',binPh:'कोई चीज़ लिखें, जैसे बोतल या दवा',binNone:'यह हमें अभी नहीं पता। इसे अलग रखें और गाड़ी वाले से पूछें।',
 wet:'हरा · गीला',dry:'नीला · सूखा',haz:'लाल · ख़तरनाक',ew:'काला · ई-कचरा',goes:'{city} का कचरा कहाँ जाता है',goesCap:'60% खाद या रीसायकल होता है। बाकी ऊर्जा संयंत्र और लैंडफ़िल में जाता है।',
 compost:'खाद',recyc:'रीसायकल',wte:'कचरे से बिजली',landfill:'लैंडफ़िल',sunPower:'हर घंटे साफ़ बिजली',sunCap:'जब धूप ज़्यादा, तब बार ऊँचे।',
 yourPower:'इस हफ़्ते आपकी बिजली',yourCap:'ज़्यादातर दिन आपने पड़ोसियों से कम बिजली ली।',streak:'छँटाई की लय',streakCap:'पिछले 21 में से {n} दिन सही छँटाई। पीले बिंदु जारी रखें।',cuts:'तय बिजली कटौती',
}});
const BINS=[['Plastic bottle','प्लास्टिक बोतल','dry'],['Newspaper','अख़बार','dry'],['Milk packet (rinsed)','दूध की थैली (धुली)','dry'],['Glass jar','काँच का जार','dry'],['Vegetable peels','सब्ज़ी के छिलके','wet'],['Tea leaves','चाय पत्ती','wet'],['Eggshells','अंडे के छिलके','wet'],['Leftover food','बचा खाना','wet'],['Flowers from puja','पूजा के फूल','wet'],['Medicine','दवा','haz'],['Diapers','डायपर','haz'],['Sanitary pads','सैनिटरी पैड','haz'],['Batteries','बैटरी','ew'],['Bulbs and tubelights','बल्ब और ट्यूबलाइट','ew'],['Old phone or charger','पुराना फ़ोन या चार्जर','ew']];
const BINC={wet:'green',dry:'blue',haz:'red',ew:'black'};
const TK=()=>new Date().toDateString();
let VAN={p:null,sim:false,alerted:false};
function vanState(){const D=sim(),m=D.vanMin-nowMin();if(VAN.sim)return{p:VAN.p,txt:VAN.p>=1?t('vanHere'):t('vanComing',{n:Math.max(1,Math.round((1-VAN.p)*60))})};
  if(m>60)return{p:0,txt:t('vanDepot')};if(m>0)return{p:1-m/60,txt:t('vanComing',{n:m})};if(m>-30)return{p:1,txt:t('vanHere')};return{p:1,txt:t('vanDone',{t:fmtT(D.vanMin)}),done:true}}
function vanSVG(p){const pts=[[20,70],[90,70],[120,30],[220,30],[250,70],[340,70]];const d=pts.map((q,i)=>(i?'L':'M')+q.join(' ')).join('');
  return`<svg class="chart" viewBox="0 0 360 100" id="vansvg"><path d="${d}" fill="none" stroke="var(--brandline)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><path id="vanpath" d="${d}" fill="none" stroke="var(--sun)" stroke-width="4" stroke-dasharray="2 9" stroke-linecap="round"/>
  ${pts.slice(1,-1).map(q=>`<circle cx="${q[0]}" cy="${q[1]}" r="5" fill="var(--onbrand2)"/>`).join('')}<circle cx="340" cy="70" r="13" fill="var(--sun)" class="pulse-ring" opacity=".5"/><circle cx="340" cy="70" r="9" fill="var(--sun)"/><text x="340" y="95" text-anchor="middle" class="t-on" style="font-weight:700">${S.lang==='hi'?'आपका घर':'Your home'}</text><text x="20" y="95" text-anchor="middle" class="t-on2">${S.lang==='hi'?'डिपो':'Depot'}</text>
  <g id="van"><rect x="-15" y="-11" width="30" height="20" rx="5" fill="var(--onbrand)"/><rect x="5" y="-8" width="8" height="7" rx="2" fill="var(--brand)"/><circle cx="-8" cy="10" r="4" fill="var(--brand)"/><circle cx="8" cy="10" r="4" fill="var(--brand)"/></g></svg>`}
function placeVan(p){const pa=$('#vanpath'),v=$('#van');if(!pa||!v)return;const L0=pa.getTotalLength(),pt=pa.getPointAtLength(L0*clamp(p,0,1));v.setAttribute('transform',`translate(${pt.x} ${pt.y-6})`)}
PAGES.waste=function(){
  const D=sim(),done=store.get('tasks',{})[TK()]||[],vs=vanState(),q=(S.binQ||'').trim().toLowerCase();
  const tasks=[['seg','t_seg'],['van','t_van',{t:fmtT(D.vanMin)}],['water','t_water',{t:fmtT(D.waterS+60)}],['peak','t_peak'],['tree','t_tree']].filter(x=>(x[0]!=='van'||has('garbage'))&&(x[0]!=='water'||has('water')));
  const bins=BINS.filter(b=>!q||b[0].toLowerCase().includes(q)||b[1].includes(q));
  const streakN=D.streak.filter(Boolean).length+(done.includes('seg')?1:0);
  const gar=has('garbage'),pow=has('power');
  return`<div class="stack">
  <div class="g2">
   ${gar?`<section class="card brand"><div class="row between"><span class="eyebrow">${t('vanTitle')} · ${esc(areaName(curArea()))}</span><span class="pill" style="background:var(--brandline);color:var(--onbrand)"><i class="live"></i>&nbsp;GPS</span></div>
    <h1 class="h1" style="margin-top:8px">${t('vanAt',{t:fmtT(D.vanMin)})}</h1><p id="vantxt" style="font-size:1.05rem;margin-top:6px">${esc(vs.txt)}</p>
    <div style="margin:10px 0 6px">${vanSVG(vs.p)}</div>
    <div class="row wrap"><button class="btn onbrand" data-act="van-ready" type="button">${ico('check').replace('<svg','<svg width="18" height="18"')}${t('ready')}</button><button class="btn sm" style="background:var(--brandline);color:var(--onbrand)" data-act="van-sim" type="button">${ico('clock').replace('<svg','<svg width="16" height="16"')}${t('simVan')}</button></div>
    <p class="src" style="color:var(--onbrand2)">${t('source')}: ${t('srcGarbage')}</p></section>`:`<section class="card"><h2 class="h2">${t('vanTitle')}</h2><p class="muted" style="margin-top:6px">${t('notThere',{f:t('garbage'),city:cname()})}</p></section>`}
   <section class="card"><div class="row between"><h2 class="h2">${t('tasks')}</h2><span class="pill good">${t('pts',{n:done.length*10})}</span></div><p class="cap" style="margin-bottom:6px">${t('tasksCap')}</p>
    <div class="list">${tasks.map(([k,l,v])=>`<button class="li" style="width:100%;text-align:left" data-act="task" data-k="${k}" type="button" aria-pressed="${done.includes(k)}"><span class="check ${done.includes(k)?'on':''}">${ico('check')}</span><span class="grow" style="${done.includes(k)?'text-decoration:line-through;color:var(--ink3)':''}">${esc(t(l,v))}</span><span class="faint" style="font-size:.8rem">+10</span></button>`).join('')}</div></section>
  </div>
  <div class="g2">
   <section class="card"><h2 class="h2">${t('whichBin')}</h2><div class="row" style="margin:12px 0;position:relative"><input class="field" id="binq" type="search" value="${esc(S.binQ||'')}" placeholder="${esc(t('binPh'))}" aria-label="${esc(t('whichBin'))}" autocomplete="off"></div>
    <div class="list" id="binlist">${binList(bins)}</div></section>
   <section class="card"><h2 class="h2">${t('goes',{city:esc(cname())})}</h2><div style="margin-top:12px">${chStack(D.dest.map((d,i)=>({v:d.v,l:t(['compost','recyc','wte','landfill'][i])})))}</div><p class="cap">${t('goesCap')}</p>
    <div class="divider" style="margin:16px 0"></div>
    <div class="card brand" style="box-shadow:none"><div class="row between"><h3 class="h3">${t('streak')}</h3><b class="big" style="font-size:1.8rem">${streakN}</b></div>
     <div class="cal" style="margin-top:12px">${D.streak.map((ok,i)=>`<i class="${ok||(i===20&&done.includes('seg'))?'ok':''} ${i===20?'today':''}"></i>`).join('')}</div><p class="cap" style="color:var(--onbrand2)">${t('streakCap',{n:streakN})}</p></div></section>
  </div>
  ${pow?`<div class="g2">
   <section class="card"><h2 class="h2">${t('sunPower')}</h2>${chHours(D.solar,{nowI:D.nowI,from:5,to:20,cls:'sun'})}<p class="cap">${t('sunCap')}</p><p class="src">${t('source')}: ${t('srcPower')}</p></section>
   <section class="card"><h2 class="h2">${t('yourPower')}</h2>${chCompare(D.you,D.nb)}<p class="cap">${t('yourCap')}</p>
    <h3 class="h3" style="margin:14px 0 6px">${t('cuts')}</h3>${D.cuts.map(c=>`<div class="li"><div class="ic">${ico('bolt')}</div><div class="grow"><b>${fmtT(c.s)} – ${fmtT(c.e)}</b><div class="faint" style="font-size:.82rem">${esc(L(c.why))} · ${esc(areaName(curArea()))}</div></div><span class="pill warn">${t('today')}</span></div>`).join('')}</section>
  </div>`:`<section class="card"><h2 class="h2">${t('power')}</h2><p class="muted">${t('notThere',{f:t('power'),city:cname()})}</p></section>`}
  </div>`;
};
function binList(bins){return bins.length?bins.map(b=>`<div class="li"><span class="grow"><b>${esc(S.lang==='hi'?b[1]:b[0])}</b></span><span class="bin ${BINC[b[2]]}">${t({wet:'wet',dry:'dry',haz:'haz',ew:'ew'}[b[2]])}</span></div>`).join(''):`<p class="muted" style="padding:10px 0">${t('binNone')}</p>`}
AFTER.waste=function(){
  placeVan(vanState().p);
  every(()=>{if(VAN.sim){VAN.p=Math.min(1,VAN.p+.006);placeVan(VAN.p);const vs=vanState(),el=$('#vantxt');if(el)el.textContent=vs.txt;
    if(!VAN.alerted&&VAN.p>=.83){VAN.alerted=true;toast(t('vanAlert'),t('ready'),()=>ACT['van-ready']())}if(VAN.p>=1)VAN.sim=false}},80);
};
document.addEventListener('input',e=>{if(e.target.id==='binq'){S.binQ=e.target.value;const q=S.binQ.trim().toLowerCase();$('#binlist').innerHTML=binList(BINS.filter(b=>!q||b[0].toLowerCase().includes(q)||b[1].includes(q)))}});
ACT['van-sim']=()=>{VAN={p:.35,sim:true,alerted:false};placeVan(VAN.p)};
ACT['van-ready']=()=>{const s=store.get('tasks',{}),k=TK();s[k]=s[k]||[];if(!s[k].includes('van'))s[k].push('van');store.set('tasks',s);toast(t('readyOk'));if(S.page==='waste'&&!VAN.sim)render(true)};
ACT.task=el=>{const s=store.get('tasks',{}),k=TK(),a=s[k]=s[k]||[],i=a.indexOf(el.dataset.k);if(i>=0)a.splice(i,1);else a.push(el.dataset.k);store.set('tasks',s);render(true)};
