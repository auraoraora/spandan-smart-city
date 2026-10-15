/* ====== Report + community ====== */
addI({en:{
 newRep:'New report',myRep:'My reports',hood:'Neighbourhood',startHow:'Start the way you like',speak:'Speak',speakD:'Any language',photo:'Photo',photoD:'We guess the problem',typeIt:'Type',typeD:'Write it out',
 listening:'Listening… say what is wrong and where.',voiceDemo:'Voice is simulated in this demo.',heard:'We heard',aiGuess:'Looks like: {c} ({n}% sure)',what:'What is the problem?',where:'Where?',details:'A few words',detailsPh:'e.g. Drain overflowing since morning near the school gate',
 commentRule:'Neighbours can comment for 24 hours, or until it is fixed. Up to 200 characters, 2 comments each.',sendRep:'Send report',sent:'Sent',sentSub:'Report {id} is with {body}. You will get an update when it is seen.',trackIt:'Track it',another:'Report something else',
 sentN:'Sent',workN:'Being worked on',fixedN:'Fixed',all:'All',active:'Active',fixedF:'Fixed',searchRep:'Search by number or words',noRep:'No reports match.',
 upvote:'Upvote',comments:'Comments',repost:'Repost',share:'Share',closeIn:'Comments close in',closed:'Comments are closed.',addCmt:'Add a comment',post:'Post',limitHit:'You have used your 2 comments here.',
 nextStep:'Next step (demo)',showMap:'Show on map',updates:'Updates from the city',repostTitle:'Repost to your neighbourhood',repostPh:'Add a note (optional)',repostBtn:'Repost',reposted:'Reposted to {area}.',repostedBy:'Reposted by you',
 shareTitle:'Share this',copy:'Copy text',copied:'Copied.',copyFail:'Copy is blocked here. Select the text above.',wa:'WhatsApp',x:'X',fixFast:'How fast things get fixed',fixCap:'Average days from report to fixed, last 90 days.',days:'{n} days',
 probMap:'Problems near you',top:'Top',latest:'Latest',sumOpen:'Open now',sumWeek:'Fixed this week',sumAvg:'Avg. days to fix',sumYou:'Your upvotes',upvoted:'Upvoted. It moves up the city’s list.',by:'by {n}',you:'You',
},hi:{
 newRep:'नई शिकायत',myRep:'मेरी शिकायतें',hood:'मोहल्ला',startHow:'जैसे चाहें शुरू करें',speak:'बोलें',speakD:'किसी भी भाषा में',photo:'फ़ोटो',photoD:'हम समस्या पहचानेंगे',typeIt:'लिखें',typeD:'लिखकर बताएँ',
 listening:'सुन रहे हैं… बताइए क्या ख़राब है और कहाँ।',voiceDemo:'इस डेमो में आवाज़ नकली है।',heard:'हमने सुना',aiGuess:'लगता है: {c} ({n}% भरोसा)',what:'समस्या क्या है?',where:'कहाँ?',details:'कुछ शब्द',detailsPh:'जैसे: स्कूल गेट के पास सुबह से नाली उफान पर',
 commentRule:'पड़ोसी 24 घंटे तक या ठीक होने तक टिप्पणी कर सकते हैं। 200 अक्षर तक, हर व्यक्ति 2 टिप्पणी।',sendRep:'शिकायत भेजें',sent:'भेज दी',sentSub:'शिकायत {id} {body} के पास है। देखे जाने पर आपको ख़बर मिलेगी।',trackIt:'ट्रैक करें',another:'कुछ और बताएँ',
 sentN:'भेजी',workN:'काम चल रहा',fixedN:'ठीक हुई',all:'सभी',active:'चालू',fixedF:'ठीक हुई',searchRep:'नंबर या शब्द से खोजें',noRep:'कोई शिकायत नहीं मिली।',
 upvote:'वोट',comments:'टिप्पणी',repost:'रीपोस्ट',share:'शेयर',closeIn:'टिप्पणी बंद होगी',closed:'टिप्पणियाँ बंद हैं।',addCmt:'टिप्पणी लिखें',post:'भेजें',limitHit:'आपकी 2 टिप्पणियाँ हो चुकी हैं।',
 nextStep:'अगला कदम (डेमो)',showMap:'नक्शे पर देखें',updates:'शहर से ख़बर',repostTitle:'अपने मोहल्ले में रीपोस्ट करें',repostPh:'नोट जोड़ें (चाहें तो)',repostBtn:'रीपोस्ट',reposted:'{area} में रीपोस्ट हुआ।',repostedBy:'आपने रीपोस्ट किया',
 shareTitle:'शेयर करें',copy:'टेक्स्ट कॉपी करें',copied:'कॉपी हो गया।',copyFail:'यहाँ कॉपी बंद है। ऊपर का टेक्स्ट चुनें।',wa:'व्हाट्सऐप',x:'X',fixFast:'काम कितनी जल्दी होता है',fixCap:'शिकायत से ठीक होने तक औसत दिन, पिछले 90 दिन।',days:'{n} दिन',
 probMap:'आपके पास की समस्याएँ',top:'सबसे ज़्यादा वोट',latest:'नई',sumOpen:'अभी खुली',sumWeek:'इस हफ़्ते ठीक',sumAvg:'ठीक होने में औसत दिन',sumYou:'आपके वोट',upvoted:'वोट हुआ। यह निगम की सूची में ऊपर गया।',by:'{n} द्वारा',you:'आप',
}});
const NR={step:'pick',cat:'drain',area:'',text:'',img:null,how:'',ai:0,last:null};
const stPill=s=>`<span class="pill ${['bad','bad','warn','good'][s]}">${t(['pNew','pSeen','pFix','pDone'][s])}</span>`;
const tracker=r=>`<div class="track">${STAGES.map((s,i)=>`<div class="st ${i<=r.st?'done':''} ${i===r.st?'now':''}"><i></i>${esc(L(s))}</div>`).join('')}</div>`;
function postCard(r,o={}){
  const open=commentsOpen(r),mineC=r.cm.filter(c=>c.me).length,ex=S.openC===r.id;
  return`<article class="card post" id="post-${r.id}">${r.rep?`<div class="eyebrow">${ico('repost').replace('<svg','<svg width="13" height="13" style="vertical-align:-2px"')} ${t('repostedBy')}${r.repNote?': “'+esc(r.repNote)+'”':''}</div>`:''}
   <div class="row between wrap"><span class="pill mute">${esc(L(CAT[r.cat].n))}</span><span class="row" style="gap:6px">${stPill(r.st)}<span class="faint num" style="font-size:.75rem">${r.id}</span></span></div>
   <h3 class="h3">${esc(L(r.title))}</h3>
   <div class="faint" style="font-size:.8rem">${esc(areaName(r.area))} · ${wardOf(r.area)} · ${ago(r.created)} · ${r.mine?t('you'):t('by',{n:r.by})}</div>
   ${r.img?`<img src="${r.img}" alt="" style="border-radius:14px;max-height:180px;object-fit:cover;width:100%">`:''}
   ${o.mine?tracker(r):''}
   ${o.mine&&r.upd.length?`<details ${o.open?'open':''}><summary style="cursor:pointer;font-weight:700;font-size:.9rem">${t('updates')} (${r.upd.length})</summary><div class="stack" style="gap:6px;margin-top:8px">${r.upd.map(u=>`<div class="cmt city">${esc(L(u))}</div>`).join('')}</div></details>`:''}
   <div class="acts"><button class="act ${r.upv?'on':''}" data-act="upv" data-id="${r.id}" type="button" aria-pressed="${r.upv}">${ico('up')}<span class="num">${r.votes}</span></button>
    <button class="act" data-act="cmts" data-id="${r.id}" type="button" aria-expanded="${ex}">${ico('chat')}<span class="num">${r.cm.length}</span></button>
    <button class="act ${r.rep?'on':''}" data-act="repost" data-id="${r.id}" type="button">${ico('repost')}<span class="num">${r.reposts}</span></button>
    <button class="act" data-act="share" data-id="${r.id}" type="button" aria-label="${t('share')}">${ico('share')}</button>
    ${o.mine&&r.st<3?`<button class="act" data-act="nextstep" data-id="${r.id}" type="button">${t('nextStep')}</button>`:''}
    ${o.mine?`<button class="act" data-act="showmap" data-id="${r.id}" type="button">${ico('pin')}${t('showMap')}</button>`:''}</div>
   <div class="faint" style="font-size:.78rem">${open?`${ico('clock').replace('<svg','<svg width="13" height="13" style="display:inline;vertical-align:-2px"')} ${t('closeIn')} <b class="timer" data-until="${r.closes}">${fmtLeft(r.closes-Date.now())}</b>`:t('closed')}</div>
   ${ex?`<div class="stack" style="gap:8px">${r.cm.map(c=>`<div class="cmt ${c.city?'city':''}"><b>${esc(c.me?t('you'):c.w)}</b> <span class="faint" style="font-size:.75rem">${ago(c.ts)}</span><div>${esc(L(c.t))}</div></div>`).join('')}
    ${open?(mineC<2?`<form class="row" data-form="cmt" data-id="${r.id}"><input class="field" name="c" maxlength="200" placeholder="${esc(t('addCmt'))}" aria-label="${esc(t('addCmt'))}" required><button class="btn primary" type="submit">${t('post')}</button></form>`:`<p class="faint">${t('limitHit')}</p>`):''}</div>`:''}
  </article>`;
}
function fixChart(){const D=sim();return chHBars(D.fix.map(f=>({l:L(CAT[f.k].n),v:f.d,txt:t('days',{n:f.d}),cls:f.d>4.5?'bad':f.d>2.5?'sun':''})))}
PAGES.report=function(){
  const tab=S.tab.report||'new',tabs=[['new','newRep'],['mine','myRep'],['feed','hood']];
  let body='';
  if(tab==='new')body=newReportHTML();
  if(tab==='mine'){
    const mine=live().filter(r=>r.mine),f=S.rf||'all',q=(S.rq||'').toLowerCase();
    const list=mine.filter(r=>(f==='all'||(f==='active'?r.st<3:r.st===3))&&(!q||r.id.toLowerCase().includes(q)||L(r.title).toLowerCase().includes(q)));
    body=`<div class="g2"><section class="card brand"><div class="eyebrow">${t('myRep')}</div><div class="g4" style="grid-template-columns:repeat(3,1fr);margin-top:12px">${[['sentN',mine.length],['workN',mine.filter(r=>r.st>0&&r.st<3).length],['fixedN',mine.filter(r=>r.st===3).length]].map(([k,v])=>`<div class="kpi"><b>${v}</b><span class="muted" style="font-size:.8rem">${t(k)}</span></div>`).join('')}</div></section>
     <section class="card"><h2 class="h2" style="margin-bottom:10px">${t('fixFast')}</h2>${fixChart()}<p class="cap">${t('fixCap')}</p></section></div>
     <div class="row wrap"><div class="seg">${[['all','all'],['active','active'],['fixed','fixedF']].map(([k,l])=>`<button aria-selected="${f===k}" data-act="rf" data-k="${k}" type="button">${t(l)}</button>`).join('')}</div><input class="field grow" id="rq" type="search" style="min-width:180px" value="${esc(S.rq||'')}" placeholder="${esc(t('searchRep'))}" aria-label="${esc(t('searchRep'))}"></div>
     <div class="g2" id="minelist">${list.map(r=>postCard(r,{mine:true,open:r.id===NR.last})).join('')||`<p class="muted">${t('noRep')}</p>`}</div>`;
  }
  if(tab==='feed'){
    const sort=S.fs||'top',all=live().slice().sort((a,b)=>(b.rep-a.rep)||(sort==='top'?b.votes-a.votes:b.created-a.created));
    const D=sim(),open=live().filter(r=>r.st<3).length,wk=live().filter(r=>r.st===3).length+11;
    body=`<div class="g4">${[['sumOpen',open],['sumWeek',wk],['sumAvg',(D.fix.reduce((a,f)=>a+f.d,0)/D.fix.length).toFixed(1)],['sumYou',live().filter(r=>r.upv).length]].map(([k,v])=>`<div class="card kpi"><b class="num">${v}</b><span class="muted" style="font-size:.85rem">${t(k)}</span></div>`).join('')}</div>
     <div class="g2"><section class="card"><h2 class="h2" style="margin-bottom:10px">${t('probMap')}</h2><div class="mapwrap" id="feedmap">${cityMap({pins:all.slice(0,8).map((r,i)=>({x:r.x,y:r.y,st:r.st,n:i+1,label:L(r.title),id:r.id}))})}</div>
      <div class="legend"><span><i style="background:var(--bad)"></i>${t('pNew')}</span><span><i style="background:var(--sun)"></i>${t('pFix')}</span><span><i style="background:var(--leaf)"></i>${t('pDone')}</span></div></section>
      <section class="card"><h2 class="h2" style="margin-bottom:10px">${t('fixFast')}</h2>${fixChart()}<p class="cap">${t('fixCap')}</p><p class="cap">${t('commentRule')}</p></section></div>
     <div class="seg" style="max-width:320px">${[['top','top'],['new','latest']].map(([k,l])=>`<button aria-selected="${sort===k}" data-act="fs" data-k="${k}" type="button">${t(l)}</button>`).join('')}</div>
     <div class="g2">${all.map(r=>postCard(r)).join('')}</div>`;
  }
  return`<div class="stack"><h1 class="h1" style="font-size:clamp(1.9rem,6vw,2.6rem)">${t('report')}</h1><div class="seg" role="tablist" style="max-width:520px">${tabs.map(([k,l])=>`<button role="tab" aria-selected="${tab===k}" data-act="rtab" data-k="${k}" type="button">${t(l)}</button>`).join('')}</div>${body}</div>`;
};
function newReportHTML(){
  const c=city();
  if(NR.step==='pick')return`<div class="g2"><section class="card"><h2 class="h2">${t('startHow')}</h2><div class="stack" style="gap:10px;margin-top:14px">
   ${[['speak','mic','speak','speakD'],['photo','camera','photo','photoD'],['type','report','typeIt','typeD']].map(([k,i,a,b])=>`<button class="li card flat" style="width:100%;text-align:left;padding:14px" data-act="nr-how" data-k="${k}" type="button"><span class="ic" style="background:${k==='speak'?'var(--badsoft);color:var(--bad)':k==='photo'?'var(--infosoft);color:var(--info)':'var(--leafsoft);color:var(--leaf)'}">${ico(i)}</span><span class="grow"><b style="font-size:1.05rem">${t(a)}</b><br><span class="faint">${t(b)}</span></span>${ico('arrow').replace('<svg','<svg width="20" height="20"')}</button>`).join('')}
   <input type="file" id="nrfile" accept="image/*" capture="environment" hidden></div></section>
   <section class="card"><h2 class="h2" style="margin-bottom:10px">${t('fixFast')}</h2>${fixChart()}<p class="cap">${t('fixCap')}</p></section></div>`;
  if(NR.step==='listen')return`<section class="card" style="text-align:center;padding:40px 18px"><div class="wave" style="justify-content:center">${[...Array(14)].map((_,i)=>`<i style="animation-delay:${i*60}ms"></i>`).join('')}</div><p class="h3" style="margin-top:16px">${t('listening')}</p><p class="faint" style="margin-top:6px">${t('voiceDemo')}</p></section>`;
  if(NR.step==='sent'){const r=live().find(x=>x.id===NR.last);return`<section class="card brand" style="text-align:center;padding:34px 20px"><div style="width:64px;height:64px;border-radius:50%;background:var(--sun);color:#2A1D00;display:grid;place-items:center;margin:0 auto">${ico('check').replace('<svg','<svg width="32" height="32"')}</div><h2 class="h1" style="margin-top:14px;font-size:2.2rem">${t('sent')}</h2><p style="margin-top:8px">${t('sentSub',{id:NR.last,body:esc(c.body)})}</p>${r?`<div style="background:var(--surface);color:var(--ink);border-radius:16px;padding:12px;margin-top:16px">${tracker(r)}</div>`:''}<div class="row wrap" style="justify-content:center;margin-top:16px"><button class="btn sun" data-act="nr-track" type="button">${t('trackIt')}</button><button class="btn onbrand" data-act="nr-reset" type="button">${t('another')}</button></div></section>`}
  return`<form class="card stack" data-form="report"><div class="row between"><h2 class="h2">${t('newRep')}</h2><button class="btn sm ghost" type="button" data-act="nr-reset">${t('back')}</button></div>
   ${NR.how==='speak'?`<div class="cmt"><b>${t('heard')}</b><div>“${esc(NR.text)}”</div></div>`:''}
   ${NR.img?`<img src="${NR.img}" alt="" style="border-radius:14px;max-height:220px;object-fit:cover;width:100%">`:''}
   ${NR.ai?`<span class="pill info">${ico('spark').replace('<svg','<svg width="13" height="13"')} ${t('aiGuess',{c:esc(L(CAT[NR.cat].n)),n:NR.ai})}</span>`:''}
   <div><div class="eyebrow" style="margin-bottom:8px">${t('what')}</div><div class="row wrap" style="gap:8px">${Object.keys(CAT).map(k=>`<button class="chip" aria-pressed="${NR.cat===k}" data-act="nr-cat" data-k="${k}" type="button">${esc(L(CAT[k].n))}</button>`).join('')}</div></div>
   <label><div class="eyebrow" style="margin-bottom:8px">${t('where')}</div><select class="field" name="area" id="nrarea">${c.areas.map(a=>`<option ${a===(NR.area||curArea())?'selected':''} value="${esc(a)}">${esc(areaName(a))}</option>`).join('')}</select></label>
   <label><div class="eyebrow" style="margin-bottom:8px">${t('details')}</div><textarea class="field" name="text" id="nrtext" maxlength="300" placeholder="${esc(t('detailsPh'))}">${esc(NR.how==='speak'?'':NR.text)}</textarea></label>
   <p class="cap">${t('commentRule')}</p><button class="btn primary full" type="submit">${ico('send').replace('<svg','<svg width="18" height="18"')}${t('sendRep')}</button></form>`;
}
AFTER.report=()=>{};
const findR=id=>reports().find(r=>r.id===id);
Object.assign(ACT,{
 rtab:el=>{S.tab.report=el.dataset.k;render(true)},rf:el=>{S.rf=el.dataset.k;render(true)},fs:el=>{S.fs=el.dataset.k;render(true)},
 'nr-how':el=>{NR.how=el.dataset.k;NR.img=null;NR.ai=0;
   if(NR.how==='photo'){const f=$('#nrfile');f.onchange=()=>{const file=f.files[0];if(!file)return;const rd=new FileReader();rd.onload=()=>{NR.img=rd.result;NR.cat='pothole';NR.ai=92;NR.step='form';render(true)};rd.readAsDataURL(file)};f.click();return}
   if(NR.how==='speak'){NR.step='listen';render(true);setTimeout(()=>{NR.text=S.lang==='hi'?`${areaName(curArea())} में स्कूल के पास नाली सुबह से उफान पर है, बदबू आ रही है।`:`The drain near the school in ${curArea()} has been overflowing since morning and it smells.`;NR.cat='drain';NR.ai=88;NR.step='form';if(S.page==='report')render(true)},2600);return}
   NR.step='form';render(true)},
 'nr-cat':el=>{NR.cat=el.dataset.k;$$('[data-act="nr-cat"]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.k===NR.cat))},
 'nr-reset':()=>{Object.assign(NR,{step:'pick',img:null,ai:0,text:'',how:''});render(true)},
 'nr-track':()=>{S.tab.report='mine';NR.step='pick';render();window.scrollTo({top:0})},
 upv:el=>{const r=findR(el.dataset.id);r.upv=!r.upv;r.votes+=r.upv?1:-1;if(r.upv)toast(t('upvoted'));render(true)},
 cmts:el=>{S.openC=S.openC===el.dataset.id?null:el.dataset.id;render(true)},
 nextstep:el=>{const r=findR(el.dataset.id);if(r.st<3){r.st++;r.upd.push([{en:'Complaint seen by '+city().body+'.',hi:'शिकायत '+city().body+' ने देखी।'},{en:'A crew has been assigned.',hi:'टीम भेज दी गई है।'},{en:'Fixed. Thank you for reporting.',hi:'ठीक हो गया। बताने के लिए धन्यवाद।'}][r.st-1]);if(r.st===3)r.after=true}NR.last=r.id;render(true)},
 showmap:el=>{const r=findR(el.dataset.id);openSheet(`<h2 class="h2" style="margin-bottom:10px">${esc(L(r.title))}</h2><div class="mapwrap">${cityMap({pins:[{x:r.x,y:r.y,st:r.st,n:1,label:L(r.title)}]})}</div><a class="btn ghost full" style="margin-top:12px;text-decoration:none" target="_blank" rel="noopener" href="${mapsUrl(r.area+', '+city().n.en)}">${t('openMaps')}</a><button class="btn primary full" style="margin-top:8px" data-act="sheet-close" type="button">${t('close')}</button>`)},
 repost:el=>{const r=findR(el.dataset.id);openSheet(`<h2 class="h2">${t('repostTitle')}</h2><p class="muted" style="margin:6px 0 12px">${esc(L(r.title))}</p><form data-form="repost" data-id="${r.id}" class="stack" style="gap:10px"><input class="field" name="n" maxlength="120" placeholder="${esc(t('repostPh'))}"><button class="btn primary full" type="submit">${ico('repost').replace('<svg','<svg width="18" height="18"')}${t('repostBtn')}</button></form>`)},
 share:el=>{const r=findR(el.dataset.id),msg=`${L(r.title)} (${r.id}) · ${r.votes} ▲ — ${S.lang==='hi'?'स्पंदन पर वोट करें':'Upvote it on Spandan'}, ${cname()}`;
   openSheet(`<h2 class="h2" style="margin-bottom:10px">${t('shareTitle')}</h2><div class="cmt" id="sharetxt" style="user-select:all">${esc(msg)}</div><div class="g4" style="margin-top:12px;grid-template-columns:repeat(3,1fr)">
   <a class="btn" style="text-decoration:none" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(msg)}">${t('wa')}</a><a class="btn" style="text-decoration:none" target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}">${t('x')}</a>
   <button class="btn primary" data-act="copy" type="button">${ico('copy').replace('<svg','<svg width="16" height="16"')}${t('copy')}</button></div>`)},
 copy:()=>{const txt=$('#sharetxt').textContent;try{navigator.clipboard.writeText(txt).then(()=>toast(t('copied')),()=>{selTxt();toast(t('copyFail'))})}catch(e){selTxt();toast(t('copyFail'))}},
});
function selTxt(){const r=document.createRange();r.selectNodeContents($('#sharetxt'));const s=getSelection();s.removeAllRanges();s.addRange(r)}
document.addEventListener('input',e=>{if(e.target.id==='rq'){S.rq=e.target.value;const p=e.target.selectionStart;render(true);const n=$('#rq');n.focus();n.setSelectionRange(p,p)}});
document.addEventListener('submit',e=>{
  const f=e.target,k=f.dataset.form;if(!k)return;e.preventDefault();
  if(k==='cmt'){const r=findR(f.dataset.id),v=f.c.value.trim();if(!v||!commentsOpen(r))return;r.cm.push({w:'You',me:true,t:v.slice(0,200),ts:Date.now()});render(true)}
  if(k==='repost'){const r=findR(f.dataset.id);r.rep=true;r.repNote=f.n.value.trim();r.reposts++;closeSheet();toast(t('reposted',{area:areaName(curArea())}));render(true)}
  if(k==='report'){const c=city(),now=Date.now(),a=$('#nrarea').value,txt=($('#nrtext').value.trim()||NR.text||'').slice(0,300),id='SP-'+(2200+reports().length);
    const title=txt?{en:txt.length>70?txt.slice(0,68)+'…':txt}:{en:TITLES[NR.cat].en.replace('{a}',a),hi:TITLES[NR.cat].hi.replace('{a}',AREA_HI[a]||a)};
    reports().unshift({id,cat:NR.cat,area:a,title,x:120+Math.round(Math.random()*160),y:70+Math.round(Math.random()*120),votes:1,upv:true,st:0,created:now,closes:now+24*3600e3,reposts:0,rep:false,by:'You',mine:true,cm:[],upd:[],img:NR.img,after:false,removed:false,note:''});
    NR.last=id;NR.step='sent';render(true);window.scrollTo({top:0,behavior:'smooth'})}
});
