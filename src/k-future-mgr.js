/* ====== Future City ====== */
addI({en:{
 futH:'Your city in 2030',futSub:'Pick three choices. The bars show today against your plan.',fSolar:'Solar on rooftops',fBus:'Buses on main roads',fSort:'Homes sorting waste',
 o_none:'Same as now',o_some:'Some more',o_lots:'A lot more',score2030:'2030 score',rClean:'Power from clean sources',rAir:'Air quality (AQI, lower is better)',rLand:'Garbage to landfill',rTime:'Average trip to work',
 todayL:'Today',planL:'Your plan',support:'Support this plan',supported:'You and {n} others support a plan like this.',futCap:'Estimates from a simple city model. Real results depend on funding and timing.',
},hi:{
 futH:'2030 में आपका शहर',futSub:'तीन चुनाव करें। बार आज और आपकी योजना की तुलना दिखाते हैं।',fSolar:'छतों पर सोलर',fBus:'मुख्य सड़कों पर बसें',fSort:'कचरा छाँटने वाले घर',
 o_none:'अभी जैसा',o_some:'थोड़ा ज़्यादा',o_lots:'बहुत ज़्यादा',score2030:'2030 स्कोर',rClean:'साफ़ स्रोतों से बिजली',rAir:'हवा (AQI, कम बेहतर)',rLand:'लैंडफ़िल में कचरा',rTime:'काम तक औसत सफ़र',
 todayL:'आज',planL:'आपकी योजना',support:'इस योजना का समर्थन करें',supported:'आप और {n} लोग ऐसी योजना के साथ हैं।',futCap:'एक सरल शहर मॉडल का अनुमान। असली नतीजे बजट और समय पर निर्भर हैं।',
}});
S.fut=S.fut||{solar:1,bus:1,sort:1};
function futCalc(){const D=sim(),f=S.fut,c=city(),tt=leaveAt().mine;
  const rows=[{k:'rClean',a:31,b:31+f.solar*17+f.bus*2,u:'%',max:100,good:'up'},{k:'rAir',a:D.aqi,b:Math.round(D.aqi*(1-f.bus*.11-f.solar*.04-f.sort*.03)),u:'',max:Math.max(D.aqi,150),good:'down'},
   {k:'rLand',a:22,b:Math.max(4,22-f.sort*7),u:'%',max:30,good:'down'},{k:'rTime',a:tt,b:Math.round(tt*(1-f.bus*.12)),u:' min',max:Math.max(tt,40),good:'down'}];
  const sc=clamp(Math.round(D.score+f.solar*5+f.bus*5+f.sort*4),0,99);return{rows,sc}}
PAGES.future=function(){
  const{rows,sc}=futCalc(),n=store.get('support',0),opts=['o_none','o_some','o_lots'];
  return`<div class="stack"><div><h1 class="h1" style="font-size:clamp(1.9rem,6vw,2.6rem)">${t('futH')}</h1><p class="muted" style="margin-top:6px">${t('futSub')}</p></div>
  <div class="g2"><section class="card stack">${[['solar','fSolar','sun'],['bus','fBus','bus'],['sort','fSort','waste']].map(([k,l,i])=>`<div><div class="row" style="margin-bottom:8px">${ico(i).replace('<svg','<svg width="20" height="20"')}<b>${t(l)}</b></div><div class="seg">${opts.map((o,j)=>`<button aria-selected="${S.fut[k]===j}" data-act="fut" data-k="${k}" data-v="${j}" type="button">${t(o)}</button>`).join('')}</div></div>`).join('')}</section>
   <section class="card brand"><div class="eyebrow">${t('score2030')} · ${esc(cname())}</div><div class="row" style="align-items:flex-end;gap:10px;margin-top:8px"><span class="big num" id="fsc" style="font-size:4rem">${sc}</span><span class="muted" style="margin-bottom:10px">/100 · ${t('todayL')} ${sim().score}</span></div>
    <div class="bar" style="margin-top:10px;height:12px"><i id="fscb" style="width:${sc}%"></i></div>
    <button class="btn sun" style="margin-top:18px" data-act="support" type="button">${ico('users').replace('<svg','<svg width="18" height="18"')}${t('support')}</button><p class="cap" style="color:var(--onbrand2)" id="supn">${n?t('supported',{n:1200+n}):''}</p></section></div>
  <section class="card"><div class="g2" id="futrows">${rows.map((r,i)=>`<div><b>${t(r.k)}</b><div class="stack" style="gap:6px;margin-top:10px">
    <div class="row"><span style="width:84px;font-size:.8rem" class="faint">${t('todayL')}</span><div class="bar grow" style="height:14px"><i style="width:${r.a/r.max*100}%;background:var(--ink3)"></i></div><b class="num" style="width:62px;text-align:right">${r.a}${r.u}</b></div>
    <div class="row"><span style="width:84px;font-size:.8rem" class="faint">${t('planL')}</span><div class="bar grow" style="height:14px"><i data-fb="${i}" style="width:${r.b/r.max*100}%"></i></div><b class="num" data-fv="${i}" style="width:62px;text-align:right;color:var(--leaf)">${r.b}${r.u}</b></div></div></div>`).join('')}</div>
   <p class="cap" style="margin-top:14px">${t('futCap')}</p></section></div>`;
};
ACT.fut=el=>{S.fut[el.dataset.k]=+el.dataset.v;$$(`[data-act="fut"][data-k="${el.dataset.k}"]`).forEach(b=>b.setAttribute('aria-selected',b===el));const{rows,sc}=futCalc();
  rows.forEach((r,i)=>{$(`[data-fb="${i}"]`).style.width=r.b/r.max*100+'%';$(`[data-fv="${i}"]`).textContent=r.b+r.u});$('#fsc').textContent=sc;$('#fscb').style.width=sc+'%';save()};
ACT.support=()=>{const n=store.get('support',0)+1;store.set('support',n);$('#supn').textContent=t('supported',{n:1200+n});toast(t('supported',{n:1200+n}))};

/* ====== City officer console (Nagar Nigam) ====== */
addI({en:{
 offLogin:'City officer login',offId:'Officer ID',offPin:'PIN',offDemo:'Demo: officer id “nigam”, PIN 1234.',signIn:'Sign in',badPin:'That ID or PIN is wrong. Try nigam and 1234.',
 howRank:'How the list is ranked',howRankTxt:'Rank = upvotes per 10,000 people in that ward × how urgent the problem is × days waiting. A small ward with many upvotes is not drowned out by a big one.',
 per10k:'{n} per 10k residents',sla:'Due in',overdue:'Overdue',markSeen:'Mark seen',startWork:'Start work',resolve:'Resolve',remove:'Remove',
 resolveT:'Resolve {id}',resolveNote:'What was done?',resolvePh:'e.g. Drain cleared, silt removed, area washed.',afterPhoto:'After photo attached (demo)',confirmRes:'Mark as fixed',resolved:'{id} marked fixed. The citizen has been told.',
 removeT:'Remove {id}?',removeWhy:'Pick a reason. The citizen sees it.',rDup:'Duplicate of another report',rNot:'Not a city matter',rDone:'Already fixed',rAbuse:'Abusive or fake',removed:'{id} removed.',undo:'Undo',
 kOpen:'Open',kAvg:'Avg. days to fix',kSla:'Within time',kWeek:'Fixed this week',byCat:'Open reports by type',aiCluster:'AI grouping',wards:'Wards by upvotes per 10k',
 st_new:'New',noneLeft:'Nothing waiting. Good work.',cityReply:'City reply',
},hi:{
 offLogin:'नगर अधिकारी लॉगिन',offId:'अधिकारी ID',offPin:'पिन',offDemo:'डेमो: ID “nigam”, पिन 1234।',signIn:'लॉगिन करें',badPin:'ID या पिन ग़लत है। nigam और 1234 आज़माएँ।',
 howRank:'सूची कैसे बनती है',howRankTxt:'रैंक = वार्ड के हर 10,000 लोगों पर वोट × समस्या कितनी ज़रूरी × कितने दिन से रुकी। छोटे वार्ड की आवाज़ बड़े वार्ड में नहीं दबती।',
 per10k:'हर 10 हज़ार पर {n}',sla:'बाकी समय',overdue:'समय निकल गया',markSeen:'देख लिया',startWork:'काम शुरू',resolve:'ठीक हुआ',remove:'हटाएँ',
 resolveT:'{id} ठीक करें',resolveNote:'क्या किया गया?',resolvePh:'जैसे: नाली साफ़ की, गाद हटाई।',afterPhoto:'बाद की फ़ोटो लगी (डेमो)',confirmRes:'ठीक हुआ मार्क करें',resolved:'{id} ठीक हुआ। नागरिक को बता दिया गया।',
 removeT:'{id} हटाएँ?',removeWhy:'कारण चुनें। नागरिक को दिखेगा।',rDup:'दूसरी शिकायत जैसी',rNot:'निगम का मामला नहीं',rDone:'पहले से ठीक',rAbuse:'अपमानजनक या झूठी',removed:'{id} हटाई गई।',undo:'वापस लें',
 kOpen:'खुली',kAvg:'ठीक होने में औसत दिन',kSla:'समय पर',kWeek:'इस हफ़्ते ठीक',byCat:'प्रकार के हिसाब से खुली शिकायतें',aiCluster:'AI समूह',wards:'हर 10 हज़ार पर वोट, वार्ड अनुसार',
 st_new:'नई',noneLeft:'कुछ बाकी नहीं। बढ़िया।',cityReply:'निगम का जवाब',
}});
function slaLeft(r){return r.created+CAT[r.cat].days*864e5-Date.now()}
PAGES.manager=function(){
  const tab=S.tab.mgr||'queue',q=queue(),D=sim();
  if(tab==='queue'){const f=S.mf||'all',list=q.filter(r=>f==='all'||STKEYS[r.st]===f);
    return`<div class="stack"><div><h1 class="h1" style="font-size:clamp(1.8rem,6vw,2.5rem)">${t('queue')} · ${esc(city().body)}</h1></div>
    <section class="card sun"><b>${t('howRank')}</b><p style="margin-top:4px;font-size:.92rem">${t('howRankTxt')}</p></section>
    <div class="chips">${['all','new','seen','fixing'].map(k=>`<button class="chip" aria-pressed="${f===k}" data-act="mf" data-k="${k}" type="button">${k==='all'?t('all'):t(['pNew','pSeen','pFix'][STKEYS.indexOf(k)])} · ${k==='all'?q.length:q.filter(r=>STKEYS[r.st]===k).length}</button>`).join('')}</div>
    <div class="stack" style="gap:12px">${list.map(r=>{const rank=q.indexOf(r)+1,p=Math.round(r.votes/wardPop(r.area)*1e4),sl=slaLeft(r),pr=priority(r),mx=priority(q[0]);
      return`<article class="card"><div class="row" style="align-items:flex-start;gap:12px"><span class="rank">${rank}</span><div class="grow"><div class="row between wrap"><b>${esc(L(r.title))}</b>${stPill(r.st)}</div>
       <div class="faint" style="font-size:.8rem;margin-top:2px">${r.id} · ${esc(L(CAT[r.cat].n))} · ${esc(areaName(r.area))}, ${wardOf(r.area)} · ${ago(r.created)}</div>
       <div class="row wrap" style="gap:14px;margin-top:10px;font-size:.85rem"><span><b class="num">${r.votes}</b> ▲</span><span class="pill info">${t('per10k',{n:p})}</span><span class="pill ${sl<0?'bad':'mute'}">${sl<0?t('overdue'):t('sla')+' '+fmtLeft(sl)}</span></div>
       <div class="bar" style="margin-top:10px"><i style="width:${pr/mx*100}%"></i></div>
       <div class="row wrap" style="margin-top:12px;gap:8px">${r.st===0?`<button class="btn sm" data-act="m-st" data-id="${r.id}" data-v="1" type="button">${t('markSeen')}</button>`:''}${r.st<2?`<button class="btn sm" data-act="m-st" data-id="${r.id}" data-v="2" type="button">${t('startWork')}</button>`:''}
        <button class="btn sm primary" data-act="m-res" data-id="${r.id}" type="button">${ico('check').replace('<svg','<svg width="16" height="16"')}${t('resolve')}</button><button class="btn sm danger" data-act="m-rem" data-id="${r.id}" type="button">${ico('trash').replace('<svg','<svg width="16" height="16"')}${t('remove')}</button></div></div></div></article>`}).join('')||`<p class="muted">${t('noneLeft')}</p>`}</div></div>`}
  if(tab==='mapv'){const all=live();return`<div class="stack"><h1 class="h1" style="font-size:clamp(1.8rem,6vw,2.5rem)">${t('mapv')}</h1><section class="card"><div class="mapwrap">${cityMap({you:false,pins:all.map((r,i)=>({x:r.x,y:r.y,st:r.st,n:i+1,label:L(r.title)}))})}</div><div class="legend"><span><i style="background:var(--bad)"></i>${t('pNew')}</span><span><i style="background:var(--sun)"></i>${t('pFix')}</span><span><i style="background:var(--leaf)"></i>${t('pDone')}</span></div>
    <div class="list" style="margin-top:8px">${all.map((r,i)=>`<div class="li"><span class="numpin ${['nb-new','nb-new','nb-doing','nb-fix'][r.st]}">${i+1}</span><span class="grow">${esc(L(r.title))}</span><span class="faint num" style="font-size:.8rem">${r.votes} ▲</span></div>`).join('')}</div></section></div>`}
  const open=q.length,cats=Object.keys(CAT).map(k=>({l:L(CAT[k].n),v:q.filter(r=>r.cat===k).length})).filter(x=>x.v);
  const wards={};live().forEach(r=>{const w=wardOf(r.area);wards[w]=wards[w]||{v:0,pop:wardPop(r.area),a:r.area};wards[w].v+=r.votes});
  const drains=q.filter(r=>r.cat==='drain'||r.cat==='leak');
  return`<div class="stack"><h1 class="h1" style="font-size:clamp(1.8rem,6vw,2.5rem)">${t('insights')}</h1>
   <div class="g4">${[['kOpen',open],['kAvg',(D.fix.reduce((a,f)=>a+f.d,0)/D.fix.length).toFixed(1)],['kSla',Math.round(q.filter(r=>slaLeft(r)>0).length/Math.max(1,open)*100)+'%'],['kWeek',live().filter(r=>r.st===3).length+11]].map(([k,v])=>`<div class="card kpi"><b class="num">${v}</b><span class="muted" style="font-size:.85rem">${t(k)}</span></div>`).join('')}</div>
   <div class="g2"><section class="card"><h2 class="h2" style="margin-bottom:10px">${t('byCat')}</h2>${chHBars(cats.map(c=>({l:c.l,v:c.v,txt:String(c.v)})))}</section>
    <section class="card brand"><div class="eyebrow">${ico('spark').replace('<svg','<svg width="14" height="14" style="display:inline;vertical-align:-2px"')} ${t('aiCluster')}</div><p style="margin-top:8px;font-size:1.05rem">${S.lang==='hi'?`${drains.length} पानी/नाली शिकायतें ${esc(areaName(drains[0]?drains[0].area:curArea()))} के आसपास हैं। शायद एक ही रुकावट है। एक टीम भेजें और सब एक साथ बंद करें।`:`${drains.length} water and drain reports sit close together near ${esc(drains[0]?drains[0].area:curArea())}. It is likely one blockage. Send one crew and close them together.`}</p><p class="cap" style="color:var(--onbrand2)">${t('aiNote')}</p></section></div>
   <section class="card"><h2 class="h2" style="margin-bottom:10px">${t('wards')}</h2>${chHBars(Object.entries(wards).map(([w,o])=>({l:w+' · '+areaName(o.a),v:Math.round(o.v/o.pop*1e4),txt:String(Math.round(o.v/o.pop*1e4))})).sort((a,b)=>b.v-a.v))}</section></div>`;
};
let lastRemoved=null;
Object.assign(ACT,{
 officer:()=>openSheet(`<h2 class="h2">${t('offLogin')}</h2><p class="cap">${t('offDemo')}</p><form data-form="login" class="stack" style="gap:10px;margin-top:12px"><input class="field" id="offid" name="id" value="nigam" autocomplete="username" aria-label="${t('offId')}" placeholder="${t('offId')}"><input class="field" id="offpin" name="pin" type="password" inputmode="numeric" value="1234" autocomplete="current-password" aria-label="${t('offPin')}" placeholder="${t('offPin')}"><p class="cap" id="loginerr" style="color:var(--bad)"></p><button class="btn primary full" type="submit">${ico('lock').replace('<svg','<svg width="18" height="18"')}${t('signIn')}</button></form>`),
 mf:el=>{S.mf=el.dataset.k;render(true)},
 'm-st':el=>{const r=findR(el.dataset.id);r.st=+el.dataset.v;r.upd.push(r.st===1?{en:'Complaint seen by '+city().body+'.',hi:'शिकायत '+city().body+' ने देखी।'}:{en:'A crew has been assigned.',hi:'टीम भेज दी गई है।'});render(true)},
 'm-res':el=>{const r=findR(el.dataset.id);openSheet(`<h2 class="h2">${t('resolveT',{id:r.id})}</h2><p class="muted" style="margin:4px 0 12px">${esc(L(r.title))}</p><form data-form="resolve" data-id="${r.id}" class="stack" style="gap:10px"><label><div class="eyebrow" style="margin-bottom:6px">${t('resolveNote')}</div><textarea class="field" name="note" required placeholder="${esc(t('resolvePh'))}"></textarea></label><label class="row"><input type="checkbox" name="ph" checked> ${t('afterPhoto')}</label><button class="btn primary full" type="submit">${t('confirmRes')}</button></form>`)},
 'm-rem':el=>{const r=findR(el.dataset.id);openSheet(`<h2 class="h2">${t('removeT',{id:r.id})}</h2><p class="cap">${t('removeWhy')}</p><div class="stack" style="gap:8px;margin-top:12px">${['rDup','rNot','rDone','rAbuse'].map(k=>`<button class="btn ghost full" style="justify-content:flex-start" data-act="m-remgo" data-id="${r.id}" data-k="${k}" type="button">${t(k)}</button>`).join('')}</div>`)},
 'm-remgo':el=>{const r=findR(el.dataset.id);r.removed=true;r.note=t(el.dataset.k);lastRemoved=r;closeSheet();render(true);toast(t('removed',{id:r.id}),t('undo'),()=>{lastRemoved.removed=false;render(true)})},
});
document.addEventListener('submit',e=>{const f=e.target,k=f.dataset.form;
  if(k==='login'){e.preventDefault();if($('#offid').value.trim().toLowerCase()==='nigam'&&$('#offpin').value==='1234'){closeSheet();S.role='manager';S.tab.mgr='queue';render();window.scrollTo({top:0})}else $('#loginerr').textContent=t('badPin')}
  if(k==='resolve'){e.preventDefault();const r=findR(f.dataset.id),note=f.note.value.trim();r.st=3;r.after=f.ph.checked;r.closes=Date.now();r.upd.push({en:'Fixed: '+note,hi:'ठीक हुआ: '+note});r.cm.push({w:city().body,city:true,t:note,ts:Date.now()});closeSheet();toast(t('resolved',{id:r.id}));render(true)}
});
