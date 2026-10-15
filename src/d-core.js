'use strict';
/* ====== Core: helpers, state, i18n, icons ====== */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const hash=s=>{let h=2166136261;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
const rngOf=seed=>{let a=typeof seed==='number'?seed:hash(seed);return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}};
const pad=n=>String(n).padStart(2,'0');
const fmtT=m=>{m=((Math.round(m)%1440)+1440)%1440;const h=Math.floor(m/60),mm=m%60;return `${h%12||12}:${pad(mm)} ${h<12?'AM':'PM'}`};
const nowMin=()=>{const d=new Date();return d.getHours()*60+d.getMinutes()};
let UID=0;const uid=p=>`${p||'u'}${++UID}`;
const store={get(k,d){try{const v=localStorage.getItem('spandan.'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem('spandan.'+k,JSON.stringify(v))}catch(e){}}};

const S=Object.assign({lang:'en',theme:'system',textSize:1,city:'bhopal',area:'',prefs:['move','garbage','water','air'],notif:'morning',quiet:true,
  onboarded:false,role:'citizen',page:'home',tab:{},mapLayer:'traffic',scoreOpen:false},store.get('state',{}));
S.role='citizen'; // officer access is always re-entered through the login sheet
const save=()=>{const{role,page,tab,...rest}=S;store.set('state',rest)};

/* ---------- i18n ---------- */
const I={en:{},hi:{},ta:{},bn:{}};
const addI=o=>{for(const l in o)Object.assign(I[l],o[l])};
const t=(k,v)=>{let s=(I[S.lang]&&I[S.lang][k])??I.en[k]??k;if(v)for(const x in v)s=s.replace(new RegExp('\\{'+x+'\\}','g'),v[x]);return s};
const L=o=>o==null?'':typeof o==='string'?o:(o[S.lang]??o.en??'');
const LANGS={en:{name:'English',hello:'Hello',greet:'English'},hi:{name:'हिन्दी',hello:'नमस्ते',greet:'Hindi'},ta:{name:'தமிழ்',hello:'வணக்கம்',greet:'Tamil'},bn:{name:'বাংলা',hello:'নমস্কার',greet:'Bengali'}};
const FULL_LANGS=['en','hi'];

addI({en:{
 home:'Home',travel:'Travel',waste:'Waste & Power',report:'Report',future:'Future City',console:'Console',queue:'Queue',mapv:'Map',insights:'Insights',citizenView:'Citizen view',
 gm:'Good morning',ga:'Good afternoon',ge:'Good evening',yourDay:'Your day',cityScore:'City score',cityNow:'City right now',nearYou:'Near you',aiIns:'AI insights',cleanest:'Cleanest areas',
 traffic:'Traffic',air:'Air',garbage:'Garbage',power:'Power',water:'Water',events:'Events',safety:'Safety',move:'Getting around',
 ask:'Ask Spandan',askHint:'Ask in Hindi or English…',send:'Send',notifs:'Notifications',settings:'Make it comfortable',close:'Close',done:'Done',back:'Back',next:'Next',skip:'Skip',
 source:'Source',notConn:'Not connected yet. Ask your city to share this data.',demo:'Demo',language:'Language',theme:'Theme',textSize:'Text size',city:'City',changeCity:'Change city',
 light:'Light',dark:'Dark',auto:'Auto',replay:'Replay welcome',officer:'City officer login',openMaps:'Open in Google Maps',
 yes:'Yes',no:'No',today:'Today',week:'This week',now:'now',viewAll:'See all',
},hi:{
 home:'होम',travel:'सफ़र',waste:'कचरा और बिजली',report:'शिकायत',future:'भविष्य का शहर',console:'कंसोल',queue:'कतार',mapv:'नक्शा',insights:'आँकड़े',citizenView:'नागरिक दृश्य',
 gm:'सुप्रभात',ga:'नमस्कार',ge:'शुभ संध्या',yourDay:'आपका दिन',cityScore:'शहर का स्कोर',cityNow:'शहर अभी',nearYou:'आपके पास',aiIns:'AI सुझाव',cleanest:'सबसे साफ़ इलाके',
 traffic:'ट्रैफिक',air:'हवा',garbage:'कचरा',power:'बिजली',water:'पानी',events:'कार्यक्रम',safety:'सुरक्षा',move:'आना-जाना',
 ask:'स्पंदन से पूछें',askHint:'हिंदी या अंग्रेज़ी में पूछें…',send:'भेजें',notifs:'सूचनाएँ',settings:'अपने हिसाब से करें',close:'बंद करें',done:'हो गया',back:'पीछे',next:'आगे',skip:'छोड़ें',
 source:'स्रोत',notConn:'अभी जुड़ा नहीं है। अपने शहर से यह जानकारी साझा करने को कहें।',demo:'डेमो',language:'भाषा',theme:'थीम',textSize:'अक्षर का आकार',city:'शहर',changeCity:'शहर बदलें',
 light:'हल्का',dark:'गहरा',auto:'अपने आप',replay:'स्वागत फिर देखें',officer:'नगर अधिकारी लॉगिन',openMaps:'गूगल मैप्स में खोलें',
 yes:'हाँ',no:'नहीं',today:'आज',week:'इस हफ़्ते',now:'अभी',viewAll:'सब देखें',
},ta:{
 home:'முகப்பு',travel:'பயணம்',waste:'குப்பை & மின்சாரம்',report:'புகார்',future:'எதிர்கால நகரம்',gm:'காலை வணக்கம்',ga:'மதிய வணக்கம்',ge:'மாலை வணக்கம்',
 yourDay:'உங்கள் நாள்',cityScore:'நகர மதிப்பெண்',cityNow:'நகரம் இப்போது',nearYou:'உங்கள் அருகில்',traffic:'போக்குவரத்து',air:'காற்று',garbage:'குப்பை',power:'மின்சாரம்',water:'தண்ணீர்',
 ask:'ஸ்பந்தனிடம் கேளுங்கள்',language:'மொழி',close:'மூடு',next:'அடுத்து',skip:'தவிர்',
},bn:{
 home:'হোম',travel:'যাতায়াত',waste:'আবর্জনা ও বিদ্যুৎ',report:'অভিযোগ',future:'ভবিষ্যতের শহর',gm:'শুভ সকাল',ga:'শুভ অপরাহ্ন',ge:'শুভ সন্ধ্যা',
 yourDay:'আপনার দিন',cityScore:'শহরের স্কোর',cityNow:'শহর এখন',nearYou:'আপনার কাছে',traffic:'ট্রাফিক',air:'বাতাস',garbage:'আবর্জনা',power:'বিদ্যুৎ',water:'জল',
 ask:'স্পন্দনকে জিজ্ঞাসা করুন',language:'ভাষা',close:'বন্ধ',next:'পরের',skip:'বাদ দিন',
}});

/* ---------- icons ---------- */
const P={
 home:'<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
 travel:'<circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="5" r="2.5"/><path d="M8.5 19H16a3.5 3.5 0 0 0 0-7H8a3.5 3.5 0 0 1 0-7h7.5"/>',
 waste:'<path d="M3 6h18"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',
 bolt:'<path d="M13 2L3 14h8l-1 8 10-12h-8z"/>',
 report:'<path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>',
 future:'<path d="M12 22V12"/><path d="M12 12C12 8 9 5 4 5c0 4 3 7 8 7z"/><path d="M12 14c0-3.5 2.5-6 8-6 0 4-3 6.5-8 6z"/>',
 bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
 sliders:'<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
 sun:'<circle cx="12" cy="12" r="4.5"/><path d="M12 1.5v2.5M12 20v2.5M4.2 4.2L6 6M18 18l1.8 1.8M1.5 12H4M20 12h2.5M4.2 19.8L6 18M18 6l1.8-1.8"/>',
 moon:'<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/>',
 mic:'<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4"/>',
 camera:'<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
 pin:'<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
 search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
 pulse:'<path d="M2 12h5l2.5-7 4.5 14 2.5-7H22"/>',
 car:'<path d="M3 17h18M4 13l2-6h12l2 6v4H4z"/><circle cx="8" cy="17" r="1.6"/><circle cx="16" cy="17" r="1.6"/>',
 drop:'<path d="M12 2.5S5 10 5 15a7 7 0 0 0 14 0c0-5-7-12.5-7-12.5z"/>',
 wind:'<path d="M3 8h11a3 3 0 1 0-3-3M3 16h14a3 3 0 1 1-3 3M3 12h17a3 3 0 1 0-3-3"/>',
 cal:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
 shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
 chat:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
 up:'<path d="M12 19V5M5 12l7-7 7 7"/>',
 repost:'<path d="M17 2l4 4-4 4"/><path d="M3 12V10a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 12v2a4 4 0 0 1-4 4H3"/>',
 share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>',
 check:'<path d="M20 6L9 17l-5-5"/>',
 x:'<path d="M18 6L6 18M6 6l12 12"/>',
 send:'<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/>',
 spark:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>',
 lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 users:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
 bus:'<rect x="4" y="3" width="16" height="15" rx="3"/><path d="M4 11h16M8 18v3M16 18v3"/>',
 park:'<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z"/>',
 flag:'<path d="M4 22V4M4 4h13l-2 4 2 4H4"/>',
 arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
 chev:'<path d="M6 9l6 6 6-6"/>',
 ext:'<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>',
 copy:'<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
 trash:'<path d="M3 6h18"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/>',
 table:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/>',
 phone:'<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>',
};
const ico=(n,c='')=>`<svg class="${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]||''}</svg>`;
const FEEDICON={move:'travel',traffic:'travel',garbage:'waste',water:'drop',air:'wind',power:'bolt',events:'cal',safety:'shield'};
