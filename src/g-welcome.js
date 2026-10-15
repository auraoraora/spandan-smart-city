/* ====== Welcome: 6 steps, pulse line is the progress bar ====== */
addI({en:{
 wHello:'Tap hello in your language',wFind:'Find your city',wSearch:'Search any city',wLoc:'Use my location',wConn:'{city} · {feeds} connected',wNoCity:"We don't have “{q}” yet.",wAsk:'Ask for {q}',
 wAsked:'Thanks. {q} is on the request list. You are number {n}.',wPlug:'How a city plugs in',wPlugTxt:'Any city shares its data once, in this simple shape. Spandan does the rest.',
 wArea:'Your neighbourhood',wAreaHint:'Tap the map to drop a pin, or type your area. Van and water timings will be for your street.',wAreaPh:'Type your area',wPinned:'Pinned near',
 wMatter:'What matters to you?',wMatterHint:'Pick any. These show first on Home.',wReach:'How should we reach you?',
 mOnly:'Morning summary only',mOnlyD:'One short note at 7 AM',impOnly:'Important alerts only',impOnlyD:'Water cuts, power cuts, bad air',everything:'Everything',everythingD:'Also van timings, events and report updates',
 quiet:'Quiet hours 10 PM to 6 AM',wReady:'Your {city} is ready',wOpen:'Open Spandan',wLocFail:'Location is blocked in this preview, so we picked {city}. You can change it.',wLocOk:'Found you near {city}.',
 suggestLang:'Show the app in {l}',
},hi:{
 wHello:'अपनी भाषा में नमस्ते चुनें',wFind:'अपना शहर चुनें',wSearch:'कोई भी शहर खोजें',wLoc:'मेरी लोकेशन इस्तेमाल करें',wConn:'{city} · {feeds} जुड़े हैं',wNoCity:'“{q}” अभी हमारे पास नहीं है।',wAsk:'{q} जोड़ने को कहें',
 wAsked:'धन्यवाद। {q} माँग-सूची में है। आप {n} नंबर पर हैं।',wPlug:'शहर कैसे जुड़ता है',wPlugTxt:'कोई भी शहर अपना डेटा एक बार इसी सरल रूप में देता है। बाकी काम स्पंदन करता है।',
 wArea:'आपका इलाका',wAreaHint:'नक्शे पर पिन लगाएँ या अपना इलाका लिखें। कचरा गाड़ी और पानी का समय आपकी गली का होगा।',wAreaPh:'अपना इलाका लिखें',wPinned:'पिन के पास',
 wMatter:'आपके लिए क्या ज़रूरी है?',wMatterHint:'जितने चाहें चुनें। ये होम पर पहले दिखेंगे।',wReach:'आपसे कैसे बात करें?',
 mOnly:'सिर्फ़ सुबह का सारांश',mOnlyD:'सुबह 7 बजे एक छोटा संदेश',impOnly:'सिर्फ़ ज़रूरी अलर्ट',impOnlyD:'पानी-बिजली कटौती, ख़राब हवा',everything:'सब कुछ',everythingD:'कचरा गाड़ी, कार्यक्रम और शिकायत की ख़बर भी',
 quiet:'शांत समय: रात 10 से सुबह 6',wReady:'आपका {city} तैयार है',wOpen:'स्पंदन खोलें',wLocFail:'इस प्रीव्यू में लोकेशन बंद है, इसलिए हमने {city} चुना। आप बदल सकते हैं।',wLocOk:'आप {city} के पास मिले।',
 suggestLang:'ऐप {l} में दिखाएँ',
}});
const FEEDL={move:{en:'traffic',hi:'ट्रैफिक'},garbage:{en:'garbage',hi:'कचरा'},water:{en:'water',hi:'पानी'},power:{en:'power',hi:'बिजली'},air:{en:'air',hi:'हवा'},events:{en:'events',hi:'कार्यक्रम'},safety:{en:'safety',hi:'सुरक्षा'}};
const LATLNG={bhopal:[23.26,77.41],indore:[22.72,75.86],delhi:[28.61,77.21],mumbai:[19.08,72.88],bengaluru:[12.97,77.59],chennai:[13.08,80.27],kolkata:[22.57,88.36],hyderabad:[17.39,78.49]};
const W={i:0,q:'',timer:null,pin:null,asked:null};
const PREFS=['move','garbage','water','air','power','events','safety'];
const PREFN={move:{en:'Getting around',hi:'आना-जाना'},garbage:{en:'Garbage pickup',hi:'कचरा उठान'},water:{en:'Water supply',hi:'पानी की सप्लाई'},air:{en:'Air quality',hi:'हवा की सेहत'},power:{en:'Power cuts',hi:'बिजली कटौती'},events:{en:'Events',hi:'कार्यक्रम'},safety:{en:'Safety',hi:'सुरक्षा'}};
const feedList=c=>c.feeds.map(f=>L(FEEDL[f])).join(', ');

function pulsePath(w,h=36){let x=0,d=`M0 ${h/2}`;const m=h/2;while(x<w){d+=`L${x+26} ${m}L${x+32} ${m-8}L${x+38} ${m+11}L${x+44} ${m-15}L${x+50} ${m+6}L${x+56} ${m}L${x+72} ${m}`;x+=72}return d}
function setPulse(frac){const sv=$('#wp-svg');if(!sv)return;const w=Math.max(120,sv.clientWidth||300),d=pulsePath(w);$('#wp-track').setAttribute('d',d);const g=$('#wp-go');g.setAttribute('d',d);const len=g.getTotalLength();g.style.strokeDasharray=len;g.style.strokeDashoffset=len*(1-frac)}

function wShow(i){
  W.i=i;clearInterval(W.timer);const b=$('#wbody');b.innerHTML=`<div class="wstep on" id="ws${i}">${wStep(i)}</div>`;
  setPulse(i===0?0.04:(i+1)/6);$('#wskip').textContent=t('skip');$('#wskip').hidden=i>=5;
  if(i===0){const sp=$$('.hello span');let k=0;sp[0].classList.add('on');W.timer=setInterval(()=>{sp[k].classList.remove('on');k=(k+1)%sp.length;sp[k].classList.add('on')},1700)}
  if(i===5)readyShow();
  const f=b.querySelector('input,button');if(f&&i>0&&i!==5&&i!==3&&i!==4)f.focus({preventScroll:true});
}
const wNav=(back,next,nextOk=true,nextLbl)=>`<div class="row" style="margin-top:6px">${back?`<button class="wbtn ghost" data-act="w-back" type="button">${t('back')}</button>`:''}<button class="wbtn grow" data-act="${next}" type="button" ${nextOk?'':'disabled'}>${nextLbl||t('next')} ${ico('arrow','')}</button></div>`.replace(/<svg/g,'<svg width="20" height="20"');
function wStep(i){
  if(i===0)return`<div class="hello" aria-hidden="true"><span>Hello</span><span>नमस्ते</span><span>வணக்கம்</span><span>নমস্কার</span></div><h1 class="wh" style="font-size:clamp(1.3rem,4.5vw,1.8rem)">${t('wHello')}</h1>
  <div class="langgrid">${Object.keys(LANGS).map(k=>`<button class="lang" data-act="w-lang" data-l="${k}" type="button" lang="${k}"><b>${LANGS[k].hello}</b><small>${LANGS[k].name}</small></button>`).join('')}</div><p class="wp" style="font-size:.9rem">English · हिन्दी · தமிழ் · বাংলা<br>${S.lang==='hi'?'और क्षेत्रीय भाषाएँ जल्द आ रही हैं।':'More regional languages are coming.'}</p>`;
  if(i===1)return`<h1 class="wh">${t('wFind')}</h1><button class="wbtn sun" data-act="w-geo" type="button">${ico('pin').replace('<svg','<svg width="22" height="22"')}${t('wLoc')}</button>
  <input class="wfield" id="wq" type="search" placeholder="${esc(t('wSearch'))}" value="${esc(W.q)}" autocomplete="off" aria-label="${esc(t('wSearch'))}"><div id="wcities">${cityListHTML()}</div>${wNav(true,'w-next',true)}`;
  if(i===2)return`<h1 class="wh">${t('wArea')}</h1><p class="wp">${t('wAreaHint')}</p><div class="wmap" id="wmap" data-act="w-pin">${areaMapSVG()}</div>
  <input class="wfield" id="warea" list="areas" placeholder="${esc(t('wAreaPh'))}" value="${esc(S.area)}" autocomplete="off"><datalist id="areas">${city().areas.map(a=>`<option value="${esc(a)}">`).join('')}</datalist>
  <div class="provides">${city().areas.map(a=>`<button class="wbtn ghost" style="min-height:40px;padding:6px 16px;font-size:.9rem" data-act="w-area" data-a="${esc(a)}" type="button">${esc(areaName(a))}</button>`).join('')}</div>${wNav(true,'w-next',true)}`;
  if(i===3)return`<h1 class="wh">${t('wMatter')}</h1><p class="wp">${t('wMatterHint')}</p><div class="wtiles">${PREFS.map(k=>`<button class="wtile" data-act="w-pref" data-k="${k}" aria-pressed="${S.prefs.includes(k)}" type="button">${ico(FEEDICON[k])}<span>${L(PREFN[k])}</span></button>`).join('')}</div>${wNav(true,'w-next',true)}`;
  if(i===4){const o=(k,a,b)=>`<button class="wopt" data-act="w-notif" data-k="${k}" aria-pressed="${S.notif===k}" type="button"><span class="rad"></span><span><b>${t(a)}</b><small>${t(b)}</small></span></button>`;
    return`<h1 class="wh">${t('wReach')}</h1><div class="stack" style="gap:10px">${o('morning','mOnly','mOnlyD')}${o('important','impOnly','impOnlyD')}${o('all','everything','everythingD')}
    <button class="wopt" data-act="w-quiet" aria-pressed="${S.quiet}" type="button"><span class="rad"></span><span><b>${t('quiet')}</b></span></button></div>${wNav(true,'w-next',true)}`}
  return`<h1 class="wh">${t('wReady',{city:cname()})}</h1><div class="wready" id="wready"><svg class="bigpulse" id="bigp" viewBox="0 0 600 80" preserveAspectRatio="none"><path id="bigpp" d=""/></svg></div>
  <div class="comfort"><b style="font-size:.9rem">${t('settings')}</b><span class="row" style="gap:6px">${[.9,1,1.2].map(z=>`<button data-act="w-size" data-z="${z}" aria-pressed="${S.textSize===z}" type="button" style="font-size:${.85*z+.1}rem" aria-label="${t('textSize')}">A</button>`).join('')}</span><span class="row" style="gap:6px">${['light','dark','system'].map(m=>`<button data-act="w-theme" data-m="${m}" aria-pressed="${S.theme===m}" type="button">${t(m==='system'?'auto':m)}</button>`).join('')}</span></div>
  <button class="wbtn sun" data-act="w-finish" type="button" id="wfin" style="opacity:0;pointer-events:none">${t('wOpen')} ${ico('arrow').replace('<svg','<svg width="22" height="22"')}</button>`;
}
function cityListHTML(){
  const q=W.q.trim().toLowerCase(),list=CITIES.filter(c=>!q||c.n.en.toLowerCase().includes(q)||(c.n.hi||'').includes(q)||c.st.toLowerCase().includes(q));
  const cur=city();let h='';
  if(!list.length){const n=store.get('requests',{})[q]||0;
    h=`<div class="readycard" style="margin-top:6px"><b>${t('wNoCity',{q:esc(W.q.trim())})}</b>${W.asked===q?`<p class="wp">${t('wAsked',{q:esc(W.q.trim()),n:W.n})}</p>`:`<button class="wbtn sun" data-act="w-req" type="button">${t('wAsk',{q:esc(W.q.trim())})}</button>`}
    <details><summary class="wp" style="cursor:pointer;margin-top:8px">${t('wPlug')}</summary><p class="wp" style="margin:8px 0">${t('wPlugTxt')}</p><pre style="margin:0;font-size:.75rem;overflow:auto;padding:12px;border-radius:12px;background:rgba(0,0,0,.28);color:#CFEFDC">{
  "city": "${esc(W.q.trim())}",
  "areas": ["Ward 1", "Ward 2"],
  "feeds": {
    "traffic": "https://…/traffic.json",
    "garbage": "https://…/vans.json",
    "water":   "https://…/supply.json"
  }
}</pre></details></div>`}
  else h=`<div class="citylist">${list.map(c=>`<button class="cityrow ${c.id===cur.id?'on':''}" data-act="w-city" data-id="${c.id}" type="button">${ico('pin').replace('<svg','<svg width="22" height="22"')}<span class="grow"><b>${L(c.n)}</b><br><small>${esc(c.st)}</small></span>${c.id===cur.id?ico('check').replace('<svg','<svg width="22" height="22"'):''}</button>`).join('')}</div>`;
  if(list.length)h+=`<div style="margin-top:12px"><p class="wp" style="margin-bottom:8px"><b style="color:var(--w-ink)">${t('wConn',{city:cname(),feeds:feedList(cur)})}</b></p><div class="provides">${ALLFEEDS.map(f=>`<span class="${cur.feeds.includes(f)?'':'no'}">${L(FEEDL[f])}</span>`).join('')}</div>${cur.lang!==S.lang?`<button class="wbtn ghost" style="margin-top:12px;min-height:44px" data-act="w-lang2" data-l="${cur.lang}" type="button">${t('suggestLang',{l:LANGS[cur.lang].name})}</button>`:''}</div>`;
  return h;
}
function areaMapSVG(){
  const svg=cityMap({you:false,pins:[]}),p=W.pin||{x:200,y:130};
  return svg.replace('</svg>',`<g><circle cx="${p.x}" cy="${p.y}" r="16" class="f-leaf pulse-ring"/><path d="M${p.x} ${p.y+2}c-9-10-12-14-12-20a12 12 0 0 1 24 0c0 6-3 10-12 20z" transform="translate(0 -2)" class="f-sun" stroke="#fff" stroke-width="2"/><circle cx="${p.x}" cy="${p.y-20}" r="4.5" fill="#2A1D00"/></g></svg>`);
}
function nearestArea(x,y){const c=city(),r=rngOf('anc'+c.id);let best=c.areas[0],bd=1e9;c.areas.forEach(a=>{const ax=50+r()*300,ay=40+r()*180,d=(ax-x)**2+(ay-y)**2;if(d<bd){bd=d;best=a}});return best}
function readyShow(){
  const bp=$('#bigpp'),rd=$('#wready');if(!bp)return;bp.setAttribute('d','M0 40L120 40L150 12L180 66L215 4L250 52L275 40L600 40');
  const len=bp.getTotalLength();bp.style.strokeDasharray=len;bp.style.strokeDashoffset=len;bp.getBoundingClientRect();bp.style.transition='stroke-dashoffset 1.3s cubic-bezier(.2,.8,.2,1)';bp.style.strokeDashoffset=0;
  setTimeout(()=>{rd.innerHTML=`<div class="readycard"><div class="eyebrow" style="color:var(--w-ink2)">${t('yourDay')} · ${esc(areaName(curArea()))}</div>${dayItems().slice(0,4).map(dayRow).join('')}</div>`;const f=$('#wfin');if(f){f.style.transition='opacity .6s';f.style.opacity=1;f.style.pointerEvents='auto'}},1250);
}
function welcomeOpen(){$('#welcome').hidden=false;document.body.style.overflow='hidden';wShow(0)}
function welcomeClose(){clearInterval(W.timer);$('#welcome').hidden=true;document.body.style.overflow='';S.onboarded=true;if(!S.area)S.area=city().areas[0];save();applyPrefs();go('home')}
function useLocation(){
  const ok=id=>{S.city=id;W.q='';const c=city();S.area='';toast(t('wLocOk',{city:cname()}));$('#wcities').innerHTML=cityListHTML();$('#wq').value=''},
   fail=()=>{S.city=city().id;toast(t('wLocFail',{city:cname()}));$('#wcities').innerHTML=cityListHTML()};
  if(!navigator.geolocation)return fail();
  let done=false;const to=setTimeout(()=>{if(!done){done=true;fail()}},3500);
  try{navigator.geolocation.getCurrentPosition(p=>{if(done)return;done=true;clearTimeout(to);let best=CITIES[0].id,bd=1e9;for(const k in LATLNG){const d=(LATLNG[k][0]-p.coords.latitude)**2+(LATLNG[k][1]-p.coords.longitude)**2;if(d<bd){bd=d;best=k}}ok(best)},()=>{if(!done){done=true;clearTimeout(to);fail()}},{timeout:3000})}catch(e){if(!done){done=true;clearTimeout(to);fail()}}
}
Object.assign(ACT,{
 'w-lang':el=>{S.lang=el.dataset.l;applyLang();wShow(1)},
 'w-lang2':el=>{S.lang=el.dataset.l;applyLang();wShow(1)},
 'w-next':()=>wShow(Math.min(5,W.i+1)),'w-back':()=>wShow(Math.max(0,W.i-1)),
 'w-geo':()=>useLocation(),
 'w-city':el=>{S.city=el.dataset.id;S.area='';W.pin=null;$('#wcities').innerHTML=cityListHTML()},
 'w-req':()=>{const q=W.q.trim().toLowerCase(),r=store.get('requests',{});r[q]=(r[q]||40+hash(q)%60)+1;store.set('requests',r);W.asked=q;W.n=r[q];$('#wcities').innerHTML=cityListHTML()},
 'w-pin':(el,ev)=>{const sv=el.querySelector('svg'),b=sv.getBoundingClientRect();const x=(ev.clientX-b.left)/b.width*400,y=(ev.clientY-b.top)/b.height*260;W.pin={x:Math.round(x),y:Math.round(y)};S.area=nearestArea(x,y);el.innerHTML=areaMapSVG();$('#warea').value=S.area},
 'w-area':el=>{S.area=el.dataset.a;const i=city().areas.indexOf(S.area),r=rngOf('anc'+S.city);const pts=city().areas.map(()=>[50+r()*300,40+r()*180]);W.pin={x:Math.round(pts[i][0]),y:Math.round(pts[i][1])};$('#wmap').innerHTML=areaMapSVG();$('#warea').value=S.area},
 'w-pref':el=>{const k=el.dataset.k,i=S.prefs.indexOf(k);if(i>=0){if(S.prefs.length>1)S.prefs.splice(i,1)}else S.prefs.push(k);el.setAttribute('aria-pressed',S.prefs.includes(k))},
 'w-notif':el=>{S.notif=el.dataset.k;$$('[data-act="w-notif"]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.k===S.notif))},
 'w-quiet':el=>{S.quiet=!S.quiet;el.setAttribute('aria-pressed',S.quiet)},
 'w-size':el=>{S.textSize=+el.dataset.z;applyPrefs();$$('[data-act="w-size"]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.z===S.textSize))},
 'w-theme':el=>{S.theme=el.dataset.m;applyPrefs();$$('[data-act="w-theme"]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.m===S.theme))},
 'w-finish':()=>welcomeClose(),
});
document.addEventListener('input',e=>{
  if(e.target.id==='wq'){W.q=e.target.value;W.asked=null;$('#wcities').innerHTML=cityListHTML()}
  if(e.target.id==='warea'){const v=e.target.value.trim();const m=city().areas.find(a=>a.toLowerCase()===v.toLowerCase());S.area=m||v;if(m)ACT['w-area']({dataset:{a:m}})}
});
window.addEventListener('resize',()=>{if(!$('#welcome').hidden)setPulse(W.i===0?0.04:(W.i+1)/6)});
