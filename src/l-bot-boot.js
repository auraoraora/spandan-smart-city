/* ====== Ask Spandan (rule-based demo assistant over live city data) ====== */
addI({en:{botHi:'Hi! I know today’s data for {city}. Ask me about garbage, water, traffic, air, power or your reports.',botNote:'Demo assistant. Answers come from the city data on this screen.',
 botUnknown:'I am not sure yet. Try asking about garbage, water, traffic, air, power, events or how to report a problem.'},
 hi:{botHi:'नमस्ते! मेरे पास {city} का आज का डेटा है। कचरा, पानी, ट्रैफिक, हवा, बिजली या अपनी शिकायतों के बारे में पूछें।',botNote:'डेमो सहायक। जवाब इसी स्क्रीन के शहर डेटा से हैं।',
 botUnknown:'अभी पक्का नहीं पता। कचरा, पानी, ट्रैफिक, हवा, बिजली, कार्यक्रम या शिकायत कैसे करें, यह पूछें।'}});
const CHIPS={en:['When is the garbage van?','Is the air OK for a walk?','When should I leave for work?','Any power cut today?','How do I report a pothole?','Which bin for batteries?'],
 hi:['कचरा गाड़ी कब आएगी?','क्या टहलने के लिए हवा ठीक है?','काम के लिए कब निकलूँ?','आज बिजली कटेगी?','गड्ढे की शिकायत कैसे करूँ?','बैटरी किस डिब्बे में?']};
function botReply(q){
  const D=sim(),hi=S.lang==='hi',s=q.toLowerCase(),Lv=leaveAt(),a=aqiInfo(D.aqi),ar=areaName(curArea());
  const m=(...w)=>w.some(x=>s.includes(x));
  if(m('bin','डिब्बा','battery','बैटरी','medicine','दवा','bottle','बोतल')){const b=BINS.find(x=>s.includes(x[0].toLowerCase().split(' ')[0].replace(/s$/,''))||s.includes(x[1].split(' ')[0]));
    return b?(hi?`${b[1]}: ${t({wet:'wet',dry:'dry',haz:'haz',ew:'ew'}[b[2]])} डिब्बा।`:`${b[0]}: ${t({wet:'wet',dry:'dry',haz:'haz',ew:'ew'}[b[2]])} bin.`):(hi?'वह चीज़ लिखें, जैसे “बैटरी” या “बोतल”। कचरा और बिजली पेज पर पूरी सूची है।':'Name the item, like “battery” or “bottle”. The full list is on the Waste & Power page.')}
  if(m('garbage','van','trash','waste','कचरा','गाड़ी'))return has('garbage')?(hi?`${ar} में कचरा गाड़ी आज ${fmtT(D.vanMin)} पर आएगी। पिछले हफ़्ते एक दिन (गुरुवार) 35 मिनट देर हुई थी। आने से 10 मिनट पहले हम सूचना देंगे।`:`The van reaches ${ar} at ${fmtT(D.vanMin)} today. Last week it was 35 minutes late once (Thursday). We will ping you 10 minutes before it arrives.`):t('notThere',{f:t('garbage'),city:cname()});
  if(m('water','पानी','tank','टंकी'))return has('water')?(hi?`${ar} में पानी ${fmtT(D.waterS)} से ${fmtT(D.waterS+90)} तक। कल 40 मिनट देरी है, इसलिए आज रात टंकी भर लें।`:`Water in ${ar} runs ${fmtT(D.waterS)} to ${fmtT(D.waterS+90)}. Tomorrow starts 40 minutes late, so fill your tank tonight.`):t('notThere',{f:t('water'),city:cname()});
  if(/\bair\b/.test(s)||m('aqi','walk','हवा','टहल','pollution','प्रदूषण')){let b=Math.max(D.nowI,6),bv=1e9;for(let i=b;i<=21;i++)if(D.aqiH[i]<bv){bv=D.aqiH[i];b=i}
    return hi?`अभी AQI ${D.aqi} है (${a.hi})। सबसे साफ़ हवा ${fmtT(b*60)} के आसपास होगी, AQI करीब ${bv}। ${D.aqi>150?'बाहर मास्क पहनें।':''}`:`AQI is ${D.aqi} right now (${a.en}). Air is cleanest around ${fmtT(b*60)}, near ${bv}. ${D.aqi>150?'Wear a mask outside.':'A walk is fine then.'}`}
  if(m('leave','work','traffic','office','निकल','ट्रैफिक','ऑफ़िस','काम के'))return hi?`${fmtT(Lv.dep)} पर निकलें, ${fmtT(Lv.arr)} तक पहुँचेंगे। 8:40 पर निकलने से ${Lv.saved} मिनट बचेंगे। ${city().road} पर शाम 6 बजे सबसे ज़्यादा भीड़ होती है।`:`Leave at ${fmtT(Lv.dep)} and you arrive by ${fmtT(Lv.arr)}. That is ${Lv.saved} minutes faster than leaving at 8:40. ${city().road} is busiest around 6 PM.`;
  if(m('power','cut','बिजली','light','solar','सोलर'))return has('power')?(hi?`आज ${ar} में ${fmtT(D.cuts[0].s)} से ${fmtT(D.cuts[0].e)} तक बिजली कटेगी (${L(D.cuts[0].why)})। शहर की ${D.solarShare}% बिजली आज सूरज से है।`:`Power is off in ${ar} from ${fmtT(D.cuts[0].s)} to ${fmtT(D.cuts[0].e)} today (${L(D.cuts[0].why)}). ${D.solarShare}% of the city’s power is from the sun today.`):t('notThere',{f:t('power'),city:cname()});
  if(m('report','complain','pothole','शिकायत','गड्ढ','drain','नाली'))return hi?'शिकायत टैब खोलें और बोलें, फ़ोटो लें या लिखें। पड़ोसी 24 घंटे वोट और टिप्पणी कर सकते हैं। ज़्यादा वोट (वार्ड की आबादी के हिसाब से) शिकायत को निगम की सूची में ऊपर ले जाते हैं।':'Open the Report tab and speak, take a photo or type. Neighbours can upvote and comment for 24 hours. More upvotes, counted against the ward’s population, move it up the city’s fix list.';
  if(m('event','कार्यक्रम','weekend','मेला'))return D.events.map(e=>`${L(e.n)} · ${L(e.when)} · ${areaName(e.at)}`).join('\n');
  if(m('score','स्कोर'))return hi?`${cname()} का स्कोर ${D.score}/100 है: आना-जाना ${D.parts.move}, सफ़ाई ${D.parts.clean}, पानी-बिजली ${D.parts.util}, हवा ${D.parts.air}।`:`${cname()} scores ${D.score}/100: getting around ${D.parts.move}, cleanliness ${D.parts.clean}, water & power ${D.parts.util}, air ${D.parts.air}.`;
  if(/\b(hello|hi|hey|namaste)\b/.test(s)||s.includes('नमस्ते'))return t('botHi',{city:cname()});
  return t('botUnknown');
}
const QMAP={air:{en:'Is the air OK for a walk?',hi:'क्या टहलने के लिए हवा ठीक है?'},garbage:{en:'When is the garbage van?',hi:'कचरा गाड़ी कब आएगी?'},power:{en:'Any power cut today?',hi:'आज बिजली कटेगी?'},report:{en:'How do I report a pothole?',hi:'गड्ढे की शिकायत कैसे करूँ?'}};
let CHAT=[];
function chatHTML(){return CHAT.map(c=>`<div class="bub ${c.me?'me':'bot'}">${c.typing?'<span class="typing"><i></i><i></i><i></i></span>':esc(c.t)}</div>`).join('')}
function askOpen(q){
  if(!CHAT.length)CHAT.push({t:t('botHi',{city:cname()})});
  openSheet(`<div class="row between"><h2 class="h2">${ico('spark').replace('<svg','<svg width="22" height="22" style="display:inline;vertical-align:-4px;color:var(--sun)"')} ${t('ask')}</h2><button class="icobtn" data-act="sheet-close" type="button" aria-label="${t('close')}">${ico('x')}</button></div>
   <div class="chatlog" id="chatlog" aria-live="polite" style="margin-top:10px">${chatHTML()}</div>
   <div class="chips" style="margin-top:10px">${CHIPS[S.lang==='hi'?'hi':'en'].map(c=>`<button class="chip" data-act="chip" type="button">${esc(c)}</button>`).join('')}</div>
   <form data-form="chat" class="row" style="margin-top:8px"><input class="field" id="chatq" name="q" autocomplete="off" placeholder="${esc(t('askHint'))}" aria-label="${esc(t('askHint'))}"><button class="btn primary" type="submit" aria-label="${t('send')}">${ico('send').replace('<svg','<svg width="18" height="18"')}</button></form><p class="src">${t('botNote')}</p>`,
   ()=>{const l=$('#chatlog');l.scrollTop=l.scrollHeight});
  if(q)botAsk(q);
}
function botAsk(q){CHAT.push({me:true,t:q},{typing:true});drawChat();setTimeout(()=>{CHAT.pop();CHAT.push({t:botReply(q)});drawChat()},700+Math.random()*500)}
function drawChat(){const l=$('#chatlog');if(!l)return;l.innerHTML=chatHTML();l.scrollTop=l.scrollHeight}
ACT.ask=()=>askOpen();ACT.chip=el=>botAsk(el.textContent);ACT['ask-q']=el=>askOpen(L(QMAP[el.dataset.q]));
document.addEventListener('submit',e=>{if(e.target.dataset.form==='chat'){e.preventDefault();const v=e.target.q.value.trim();if(v){e.target.q.value='';botAsk(v)}}});

/* ====== Notifications preview ====== */
addI({en:{nTitle:'What you get every morning',nCap:'This is how Spandan reaches you without opening the app.',morning:'Morning summary',widget:'Home screen widget',imReady:"I'm ready",skipToday:'Skip today',
 nPref:'You chose: {p}. Quiet hours {q}.',on:'on',off:'off',preview:'Preview tomorrow’s 7 AM note'},
 hi:{nTitle:'हर सुबह आपको क्या मिलेगा',nCap:'ऐसे स्पंदन ऐप खोले बिना आप तक पहुँचता है।',morning:'सुबह का सारांश',widget:'होम स्क्रीन विजेट',imReady:'मैं तैयार हूँ',skipToday:'आज नहीं',
 nPref:'आपने चुना: {p}। शांत समय {q}।',on:'चालू',off:'बंद',preview:'कल सुबह 7 बजे का संदेश देखें'}});
ACT.bell=()=>{S.bellSeen=true;renderChrome();const D=sim(),it=dayItems().slice(0,3),d=new Date();
  openSheet(`<div class="row between"><h2 class="h2">${t('nTitle')}</h2><button class="icobtn" data-act="sheet-close" type="button" aria-label="${t('close')}">${ico('x')}</button></div><p class="cap" style="margin-bottom:12px">${t('nCap')}</p>
   <div class="lock"><div class="clock num">7:00</div><div class="date">${d.toLocaleDateString(S.lang==='hi'?'hi-IN':'en-IN',{weekday:'long',day:'numeric',month:'long'})}</div>
    <div class="notif"><b>SPANDAN · ${t('morning')}</b>${esc(t(new Date().getHours()<12?'gm':'ga'))}, ${esc(cname())}. ${it.map(x=>esc(x.title)).join(' · ')}</div>
    ${has('garbage')?`<div class="notif"><b>SPANDAN · ${t('vanTitle')}</b>${esc(t('vanAlert'))}<br><button class="nbtn" data-act="van-ready" type="button">${t('imReady')}</button><button class="nbtn" data-act="sheet-close" type="button">${t('skipToday')}</button></div>`:''}
    <div class="widget"><div><div style="font-size:.75rem;opacity:.8">${t('cityScore')}</div><div style="font-family:var(--f-display);font-weight:800;font-size:1.8rem">${D.score}</div></div><div><div style="font-size:.75rem;opacity:.8">AQI</div><div style="font-family:var(--f-display);font-weight:800;font-size:1.8rem">${D.aqi}</div></div><div><div style="font-size:.75rem;opacity:.8">${t('garbage')}</div><div style="font-family:var(--f-display);font-weight:800;font-size:1.3rem;margin-top:6px">${fmtT(D.vanMin)}</div></div></div></div>
   <p class="cap">${t('nPref',{p:t({morning:'mOnly',important:'impOnly',all:'everything'}[S.notif]),q:S.quiet?t('on'):t('off')})}</p>
   <button class="btn primary full" style="margin-top:10px" data-act="previewnote" type="button">${t('preview')}</button>`)};
ACT.previewnote=()=>{closeSheet();toast(`7:00 · ${dayItems().slice(0,3).map(x=>x.title).join(' · ')}`)};

/* ====== Settings ====== */
ACT.settings=()=>{const c=city();
  openSheet(`<div class="row between"><h2 class="h2">${t('settings')}</h2><button class="icobtn" data-act="sheet-close" type="button" aria-label="${t('close')}">${ico('x')}</button></div>
  <div class="stack" style="margin-top:14px">
   <div><div class="eyebrow" style="margin-bottom:8px">${t('language')}</div><div class="row wrap" style="gap:8px">${Object.keys(LANGS).map(k=>`<button class="chip" aria-pressed="${S.lang===k}" data-act="setlang" data-l="${k}" type="button" lang="${k}">${LANGS[k].name}</button>`).join('')}</div>${FULL_LANGS.includes(S.lang)?'':`<p class="cap">${S.lang==='ta'?'தமிழ்: முக்கிய பகுதிகள் மட்டும். மீதி ஆங்கிலத்தில்.':'বাংলা: মূল অংশগুলি। বাকিটা ইংরেজিতে।'}</p>`}</div>
   <div><div class="eyebrow" style="margin-bottom:8px">${t('theme')}</div><div class="seg">${['light','dark','system'].map(m=>`<button aria-selected="${S.theme===m}" data-act="settheme" data-m="${m}" type="button">${t(m==='system'?'auto':m)}</button>`).join('')}</div></div>
   <div><div class="eyebrow" style="margin-bottom:8px">${t('textSize')}</div><div class="seg">${[.9,1,1.2].map(z=>`<button aria-selected="${S.textSize===z}" data-act="setsize" data-z="${z}" type="button" style="font-size:${z}rem">A</button>`).join('')}</div></div>
   <label><div class="eyebrow" style="margin-bottom:8px">${t('city')}</div><select class="field" id="setcity">${CITIES.map(x=>`<option value="${x.id}" ${x.id===c.id?'selected':''}>${esc(L(x.n))} · ${esc(x.st)}</option>`).join('')}</select></label>
   <label><div class="eyebrow" style="margin-bottom:8px">${t('wArea')}</div><select class="field" id="setarea">${c.areas.map(a=>`<option ${a===curArea()?'selected':''} value="${esc(a)}">${esc(areaName(a))}</option>`).join('')}</select></label>
   <div class="row wrap"><button class="btn ghost" data-act="replay" type="button">${ico('pulse').replace('<svg','<svg width="18" height="18"')}${t('replay')}</button>${S.role==='manager'?`<button class="btn sun" data-act="nav" data-p="exit" type="button">${t('citizenView')}</button>`:`<button class="btn sun" data-act="officer" type="button">${ico('lock').replace('<svg','<svg width="18" height="18"')}${t('officer')}</button>`}</div></div>`)};
Object.assign(ACT,{
 setlang:el=>{S.lang=el.dataset.l;applyLang();ACT.settings()},settheme:el=>{S.theme=el.dataset.m;applyPrefs();renderChrome();$$('[data-act="settheme"]').forEach(b=>b.setAttribute('aria-selected',b===el))},
 setsize:el=>{S.textSize=+el.dataset.z;applyPrefs();$$('[data-act="setsize"]').forEach(b=>b.setAttribute('aria-selected',b===el))},
 replay:()=>{closeSheet();welcomeOpen()},
});
document.addEventListener('change',e=>{
  if(e.target.id==='setcity'){S.city=e.target.value;S.area=city().areas[0];VAN={p:null,sim:false,alerted:false};CHAT=[];save();render(true);ACT.settings();toast(cname()+' · '+feedList(city()))}
  if(e.target.id==='setarea'){S.area=e.target.value;save();render(true)}
});

/* ====== Boot ====== */
(function boot(){
  applyPrefs();
  if(!CITIES.some(c=>c.id===S.city))S.city='bhopal';
  render();
  if(!S.onboarded)welcomeOpen();
  if(location.hash==='#officer')ACT.officer();
})();
