/* ====== Simulated city data (every city plugs into the same shape) ====== */
const ALLFEEDS=['move','garbage','water','power','air','events','safety'];
const CITIES=[
 {id:'bhopal',n:{en:'Bhopal',hi:'भोपाल',ta:'போபால்',bn:'ভোপাল'},st:'Madhya Pradesh',body:'Bhopal Municipal Corporation',lang:'hi',feeds:['move','garbage','water','power','air','events'],
  areas:['MP Nagar','Arera Colony','Kolar Road','Habibganj','Shahpura','Old Bhopal'],road:'Kolar Road',aqi:96,score:74,pop:'2.4M',lake:'Upper Lake'},
 {id:'indore',n:{en:'Indore',hi:'इंदौर',ta:'இந்தூர்',bn:'ইন্দোর'},st:'Madhya Pradesh',body:'Indore Municipal Corporation',lang:'hi',feeds:['move','garbage','water','power','air','events'],
  areas:['Vijay Nagar','Palasia','Rajwada','Bhawarkua','Saket'],road:'AB Road',aqi:78,score:86,pop:'3.3M',lake:'Sirpur Lake'},
 {id:'delhi',n:{en:'Delhi',hi:'दिल्ली',ta:'டெல்லி',bn:'দিল্লি'},st:'NCT of Delhi',body:'Municipal Corporation of Delhi',lang:'hi',feeds:['move','water','power','air','events','safety'],
  areas:['Dwarka','Rohini','Lajpat Nagar','Saket','Karol Bagh'],road:'Ring Road',aqi:214,score:61,pop:'32M',lake:'Yamuna'},
 {id:'mumbai',n:{en:'Mumbai',hi:'मुंबई',ta:'மும்பை',bn:'মুম্বই'},st:'Maharashtra',body:'Brihanmumbai Municipal Corporation',lang:'en',feeds:['move','water','air','events','safety'],
  areas:['Andheri','Bandra','Dadar','Powai','Borivali'],road:'Western Express Highway',aqi:118,score:68,pop:'21M',lake:'Arabian Sea'},
 {id:'bengaluru',n:{en:'Bengaluru',hi:'बेंगलुरु',ta:'பெங்களூரு',bn:'বেঙ্গালুরু'},st:'Karnataka',body:'Greater Bengaluru Authority',lang:'en',feeds:['move','garbage','power','air','events'],
  areas:['Koramangala','Indiranagar','Whitefield','HSR Layout','Jayanagar'],road:'Outer Ring Road',aqi:72,score:72,pop:'13M',lake:'Ulsoor Lake'},
 {id:'chennai',n:{en:'Chennai',hi:'चेन्नई',ta:'சென்னை',bn:'চেন্নাই'},st:'Tamil Nadu',body:'Greater Chennai Corporation',lang:'ta',feeds:['move','garbage','water','air','events'],
  areas:['T Nagar','Adyar','Anna Nagar','Velachery','Tambaram'],road:'OMR',aqi:88,score:70,pop:'11M',lake:'Adyar River'},
 {id:'kolkata',n:{en:'Kolkata',hi:'कोलकाता',ta:'கொல்கத்தா',bn:'কলকাতা'},st:'West Bengal',body:'Kolkata Municipal Corporation',lang:'bn',feeds:['move','water','power','air','events'],
  areas:['Salt Lake','Park Street','Howrah','New Town','Behala'],road:'EM Bypass',aqi:152,score:64,pop:'15M',lake:'Hooghly River'},
 {id:'hyderabad',n:{en:'Hyderabad',hi:'हैदराबाद',ta:'ஹைதராபாத்',bn:'হায়দরাবাদ'},st:'Telangana',body:'Greater Hyderabad Municipal Corporation',lang:'en',feeds:['move','garbage','water','power','air','safety'],
  areas:['Gachibowli','Madhapur','Banjara Hills','Secunderabad','Kukatpally'],road:'Outer Ring Road',aqi:102,score:71,pop:'10M',lake:'Hussain Sagar'},
];
const AREA_HI={'MP Nagar':'एमपी नगर','Arera Colony':'अरेरा कॉलोनी','Kolar Road':'कोलार रोड','Habibganj':'हबीबगंज','Shahpura':'शाहपुरा','Old Bhopal':'पुराना भोपाल','Vijay Nagar':'विजय नगर','Palasia':'पलासिया','Rajwada':'राजवाड़ा','Dwarka':'द्वारका','Rohini':'रोहिणी','Saket':'साकेत','Andheri':'अंधेरी','Bandra':'बांद्रा','Dadar':'दादर','Powai':'पवई'};
const city=()=>CITIES.find(c=>c.id===S.city)||CITIES[0];
const cname=c=>L((c||city()).n);
const areaName=a=>S.lang==='hi'&&AREA_HI[a]?AREA_HI[a]:a;
const curArea=()=>S.area||city().areas[0];
const has=f=>city().feeds.includes(f);
const mapsUrl=(q)=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q);
const wardOf=a=>'Ward '+(1+hash(a)%24);
const wardPop=a=>26000+hash('p'+a)%34000;

const CAT={
 pothole:{n:{en:'Pothole',hi:'गड्ढा'},sev:2,days:6,col:'bad'},garbage:{n:{en:'Garbage not picked',hi:'कचरा नहीं उठा'},sev:2,days:1.5,col:'sun'},
 light:{n:{en:'Street light off',hi:'स्ट्रीट लाइट बंद'},sev:1,days:3,col:'sun'},leak:{n:{en:'Water leak',hi:'पानी का रिसाव'},sev:3,days:1.8,col:'info'},
 drain:{n:{en:'Blocked drain',hi:'नाली जाम'},sev:3,days:4,col:'bad'},other:{n:{en:'Something else',hi:'कुछ और'},sev:1,days:5,col:'info'}};
const STAGES=[{en:'Sent',hi:'भेजा'},{en:'Seen by city',hi:'शहर ने देखा'},{en:'Being fixed',hi:'ठीक हो रहा है'},{en:'Fixed',hi:'ठीक हुआ'}];
const STKEYS=['new','seen','fixing','fixed'];

/* ---------- daily simulation, stable for a given city + area + day ---------- */
let _sim={k:'',v:null};
function sim(){
  const c=city(),a=curArea(),k=c.id+'|'+a+'|'+new Date().toDateString();
  if(_sim.k===k)return _sim.v;
  const r=rngOf(k),d=new Date(),H=d.getHours();
  const shift=r()*.9-.45;
  const traffic=[...Array(24)].map((_,i)=>Math.round(clamp(14+Math.exp(-((i-(9+shift))**2)/3.2)*68+Math.exp(-((i-(18+shift))**2)/4.4)*80+r()*6,6,98)));
  const aqiH=[...Array(24)].map((_,i)=>Math.round(clamp(c.aqi*(1+.2*Math.cos((i-3.5)*Math.PI/12))+traffic[i]*.22-12+r()*5,20,480)));
  const dow=d.getDay(),wk=['S','M','T','W','T','F','S'],days=[];
  for(let i=6;i>=0;i--){const dd=new Date(d.getTime()-i*864e5),w=dd.getDay();const late=(w===4&&i>0)||(i===0&&w===4&&false);days.push({l:wk[w],late:w===4&&i!==0||(i===3&&!days.some(x=>x.late)&&w!==4&&false),m:0})}
  // guarantee exactly one late day (Thursday if present in window, else day 4 of 7)
  let li=days.findIndex((x,i)=>x.late); if(li<0)li=3;
  days.forEach((x,i)=>{x.late=i===li;x.m=x.late?35:Math.round(r()*7)});
  const vanMin=560+(hash(a+c.id)%7)*10;
  const solar=[...Array(24)].map((_,i)=>i<6||i>18?0:Math.round(Math.sin((i-6)/12*Math.PI)*88+r()*6));
  const you=[...Array(7)].map(()=>+(6+r()*4).toFixed(1)),nb=you.map(v=>+(v+0.8+r()*2.2).toFixed(1));
  const parts={move:clamp(Math.round(c.score-6+r()*10),30,95),clean:clamp(Math.round(c.score+4+r()*8),30,97),util:clamp(Math.round(c.score-3+r()*9),30,95),air:clamp(Math.round(100-c.aqi/3.2+r()*6),22,96)};
  const score=Math.round((parts.move+parts.clean+parts.util+parts.air)/4);
  const wscore=[...Array(7)].map((_,i)=>clamp(score-4+Math.round(i*.6+r()*3),40,98));wscore[6]=score;
  const ranking=c.areas.map(x=>({a:x,s:clamp(Math.round(c.score+r()*22-8),48,97)})).sort((p,q)=>q.s-p.s);
  const nowI=clamp(H,0,23);
  const crowd=[1,2,3,2].map((v,i)=>({no:['12A','7','21C','M4'][i],to:c.areas[(i+2)%c.areas.length],eta:[3+i*2,11+i*3],lvl:((v+hash(k+i))%3)+1}));
  const park=c.areas.slice(0,4).map((x,i)=>{const cap=[120,80,200,60][i];return{n:x+' '+['Mall','Metro','Market','Hospital'][i],cap,free:Math.round(cap*(.1+r()*.7))}});
  const chg=c.areas.slice(1,4).map((x,i)=>({n:x+' EV hub',of:[6,4,8][i],free:Math.round(r()*[6,4,8][i])}));
  const cuts=[{s:840+(hash(a)%3)*30,e:900+(hash(a)%3)*30,why:{en:'Line maintenance',hi:'लाइन की मरम्मत'}}];
  const waterS=360+(hash(a+'w')%4)*15;
  const events=[
    {n:{en:c.n.en+' Utsav Mela',hi:(c.n.hi||c.n.en)+' उत्सव मेला'},when:{en:'Sat · 5 PM',hi:'शनि · शाम 5 बजे'},at:c.areas[0]},
    {n:{en:(c.lake||'Lake')+' clean-up drive',hi:'सफ़ाई अभियान'},when:{en:'Sun · 7 AM',hi:'रवि · सुबह 7 बजे'},at:c.areas[1%c.areas.length]},
    {n:{en:'Organic farmers haat',hi:'जैविक किसान हाट'},when:{en:'Wed · 8 AM',hi:'बुध · सुबह 8 बजे'},at:c.areas[2%c.areas.length]}];
  const fix=[['garbage',1.6],['leak',1.9],['light',3.1],['drain',4.2],['other',5.0],['pothole',6.3]].map(([k,v])=>({k,d:+(v+(r()-.5)*.6).toFixed(1)}));
  const v={traffic,aqiH,days,vanMin,solar,you,nb,parts,score,wscore,ranking,nowI,crowd,park,chg,cuts,waterS,events,fix,
    aqi:aqiH[nowI],solarNow:Math.max(solar[nowI],0)||0,solarShare:31,
    dest:[{k:'Composted',v:38},{k:'Recycled',v:22},{k:'Waste-to-energy',v:18},{k:'Landfill',v:22}],
    streak:[...Array(21)].map((_,i)=>i>=2&&r()>.12)};
  _sim={k,v};return v;
}
const aqiInfo=v=>v<=50?{k:'good',en:'Good',hi:'अच्छी',c:'good'}:v<=100?{k:'ok',en:'Fair',hi:'ठीक-ठाक',c:'good'}:v<=150?{k:'mod',en:'Poor for kids & elders',hi:'बच्चों-बुज़ुर्गों के लिए ख़राब',c:'warn'}:v<=200?{k:'bad',en:'Unhealthy',hi:'ख़राब',c:'bad'}:{k:'vbad',en:'Very unhealthy',hi:'बहुत ख़राब',c:'bad'};
function leaveAt(){
  const D=sim(),base=22,tt=m=>base*(1+(D.traffic[clamp(Math.floor(m/60),0,23)]/100)*1.15);
  let best=450;for(let m=450;m<=520;m+=5){if(m+tt(m)<=540)best=m}
  return{dep:best,arr:Math.round(best+tt(best)),base:Math.round(tt(520)),mine:Math.round(tt(best)),saved:Math.max(4,Math.round(tt(520)-tt(best)))};
}

/* ---------- community reports (live in memory for this session) ---------- */
const NAMES=['Asha','Rahul','Imran','Priya','Kavita','Manoj','Sneha','Tarun','Farah','Deepak'];
const TITLES={pothole:{en:'Deep pothole near {a} market',hi:'{a} बाज़ार के पास गहरा गड्ढा'},garbage:{en:'Garbage not picked for 2 days in {a}',hi:'{a} में 2 दिन से कचरा नहीं उठा'},
 light:{en:'Street lights off on {a} main road',hi:'{a} मुख्य सड़क पर लाइटें बंद'},leak:{en:'Water pipe leaking at {a} crossing',hi:'{a} चौराहे पर पाइप लीक'},
 drain:{en:'Drain overflowing near {a} school',hi:'{a} स्कूल के पास नाली उफान पर'},other:{en:'Fallen tree blocking lane in {a}',hi:'{a} में पेड़ गिरा, गली बंद'}};
let R=[],_rcity='';
function reports(){
  if(_rcity===S.city&&R.length)return R;
  _rcity=S.city;const c=city(),r=rngOf('rep'+c.id),now=Date.now();R=[];
  const cats=Object.keys(CAT),cfg=[[23.2,'drain',3],[5,'leak',1],[12,'pothole',2],[30,'garbage',3],[2,'light',0],[44,'pothole',2],[8,'garbage',1],[19,'drain',0],[52,'leak',3],[27,'light',3],[3,'other',0]];
  cfg.forEach(([ageH,cat,st],i)=>{
    const a=c.areas[i%c.areas.length],created=now-ageH*3600e3;
    const closes=st===3?now-3600e3:created+24*3600e3;
    R.push({id:'SP-'+(2040+i),cat,area:a,title:{en:TITLES[cat].en.replace('{a}',a),hi:TITLES[cat].hi.replace('{a}',AREA_HI[a]||a)},
      x:30+Math.round(r()*340),y:28+Math.round(r()*200),votes:Math.round(18+r()*(i<4?380:120)),upv:false,st,created,closes,reposts:Math.round(r()*14),rep:false,
      by:NAMES[(i*3)%NAMES.length],mine:false,cm:[{w:NAMES[(i+2)%10],t:{en:'Same problem here since last week.',hi:'यहाँ भी पिछले हफ़्ते से यही दिक्कत है।'},ts:created+2*3600e3}],
      upd:st>0?[{en:'Complaint seen by '+c.body+'.',hi:'शिकायत '+c.body+' ने देखी।'}]:[],after:st===3,removed:false,note:''});
  });
  // two reports filed by the signed-in citizen, for the My reports tab
  [[6,'garbage',2],[70,'light',3]].forEach(([ageH,cat,st],j)=>{
    const a=curArea(),created=now-ageH*3600e3;
    R.push({id:'SP-'+(2101+j),cat,area:a,title:{en:TITLES[cat].en.replace('{a}',a),hi:TITLES[cat].hi.replace('{a}',AREA_HI[a]||a)},x:150+j*70,y:110+j*30,votes:9+j*21,upv:false,
      st,created,closes:st===3?now-3600e3:created+24*3600e3,reposts:1,rep:false,by:'You',mine:true,cm:[],
      upd:[{en:'Complaint seen by '+c.body+'.',hi:'शिकायत '+c.body+' ने देखी।'}].concat(st>1?[{en:'A crew has been assigned.',hi:'टीम भेज दी गई है।'}]:[]).concat(st>2?[{en:'Fixed. Thank you for reporting.',hi:'ठीक हो गया। बताने के लिए धन्यवाद।'}]:[]),after:st===3,removed:false,note:''});
  });
  return R;
}
const live=()=>reports().filter(r=>!r.removed);
const SEVW=k=>CAT[k].sev;
function priority(r){const per10k=r.votes/wardPop(r.area)*10000,age=(Date.now()-r.created)/864e5;return per10k*SEVW(r.cat)*(1+Math.min(age,10)*.08)}
function queue(){return live().filter(r=>r.st<3).sort((a,b)=>priority(b)-priority(a))}
const commentsOpen=r=>r.st<3&&Date.now()<r.closes;
function fmtLeft(ms){if(ms<=0)return '0m';const m=Math.floor(ms/60000),h=Math.floor(m/60);return h>0?`${h}h ${pad(m%60)}m`:`${m}m ${pad(Math.floor(ms/1000)%60)}s`}
function ago(ts){const m=Math.max(1,Math.round((Date.now()-ts)/60000));return m<60?`${m}m`:m<1440?`${Math.round(m/60)}h`:`${Math.round(m/1440)}d`}
