/* ====== Charts: plain SVG, labels written on the chart, no legends ====== */
const arcPt=(cx,cy,r,v,max)=>{const th=Math.PI-Math.PI*clamp(v,0,max)/max;return[cx+r*Math.cos(th),cy-r*Math.sin(th)]};
const arcPath=(cx,cy,r,v1,v2,max)=>{const a=arcPt(cx,cy,r,v1,max),b=arcPt(cx,cy,r,v2,max);return`M${a[0].toFixed(1)} ${a[1].toFixed(1)}A${r} ${r} 0 0 1 ${b[0].toFixed(1)} ${b[1].toFixed(1)}`};

function chLine(vals,{nowI=-1,w=220,h=96,from=6,to=22,peak=true,cls='leaf',hi=null}={}){
  const id=uid('g'),n=vals.length,sl=vals.slice(from,to+1),mx=Math.max(...sl,1),L0=14,R0=8,T0=18,B0=20;
  const X=i=>L0+(i-from)/(to-from)*(w-L0-R0),Y=v=>T0+(1-v/Math.max(mx*1.1,1))*(h-T0-B0);
  let d='';for(let i=from;i<=to;i++)d+=(i===from?'M':'L')+X(i).toFixed(1)+' '+Y(vals[i]).toFixed(1);
  const area=d+`L${X(to)} ${h-B0}L${X(from)} ${h-B0}Z`;
  const pk=sl.indexOf(mx)+from;
  let s=`<svg class="chart" viewBox="0 0 ${w} ${h}" role="img"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--${cls});stop-opacity:.35"/><stop offset="1" style="stop-color:var(--${cls});stop-opacity:0"/></linearGradient></defs>`;
  s+=`<line class="grid" x1="${L0}" x2="${w-R0}" y1="${h-B0}" y2="${h-B0}"/>`;
  s+=`<path d="${area}" fill="url(#${id})"/><path class="draw s-${cls}" style="--len:${w*2}" d="${d}" fill="none" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`;
  [6,12,18].filter(x=>x>=from&&x<=to).forEach(hh=>s+=`<text x="${X(hh)}" y="${h-6}" text-anchor="middle">${hh===12?'12 PM':(hh%12)+(hh<12?' AM':' PM')}</text>`);
  if(peak)s+=`<text x="${clamp(X(pk),30,w-30)}" y="${Y(mx)-6}" text-anchor="middle" class="t-strong">${S.lang==='hi'?'भीड़ सबसे ज़्यादा':'Busiest'}</text>`;
  if(nowI>=from&&nowI<=to){const x=X(nowI),y=Y(vals[nowI]);s+=`<line x1="${x}" x2="${x}" y1="${T0-4}" y2="${h-B0}" class="s-ink3" stroke-dasharray="3 3"/><circle cx="${x}" cy="${y}" r="5" class="f-ink"/><circle cx="${x}" cy="${y}" r="9" fill="none" class="s-ink pulse-ring" stroke-width="1.5"/><text x="${clamp(x,14,w-14)}" y="${T0-6}" text-anchor="middle" class="t-strong">${t('now')}</text>`}
  return s+'</svg>';
}
function chDial(v,{max=300,w=200,h=118}={}){
  const bands=[[0,50,'leaf',1],[50,100,'leaf',.5],[100,150,'sun',1],[150,200,'bad',.55],[200,300,'bad',1]],cx=100,cy=100,r=76;
  let s=`<svg class="chart" viewBox="0 0 ${w} ${h}" role="img">`;
  bands.forEach(([a,b,c,o])=>s+=`<path d="${arcPath(cx,cy,r,a+.8,b-.8,max)}" fill="none" class="s-${c}" stroke-opacity="${o}" stroke-width="13" stroke-linecap="butt"/>`);
  const p=arcPt(cx,cy,r-18,v,max);
  s+=`<line x1="${cx}" y1="${cy}" x2="${p[0].toFixed(1)}" y2="${p[1].toFixed(1)}" class="s-ink" stroke-width="3.5" stroke-linecap="round" style="transition:all .8s"/><circle cx="${cx}" cy="${cy}" r="6" class="f-ink"/>`;
  s+=`<text x="${cx-r}" y="${cy+14}" text-anchor="middle">0</text><text x="${cx+r}" y="${cy+14}" text-anchor="middle">300</text>`;
  s+=`<text x="${cx-r+10}" y="${cy-r+36}" font-size="9">${S.lang==='hi'?'अच्छी':'Good'}</text><text x="${cx+r-8}" y="${cy-r+36}" font-size="9" text-anchor="end">${S.lang==='hi'?'ख़राब':'Bad'}</text>`;
  return s+'</svg>';
}
function chBars7(days,{w=220,h=96}={}){
  const mx=45,bw=20,gap=(w-14-7*bw)/6;let s=`<svg class="chart" viewBox="0 0 ${w} ${h}" role="img"><line class="grid" x1="4" x2="${w-4}" y1="${h-18}" y2="${h-18}"/>`;
  days.forEach((d,i)=>{const x=7+i*(bw+gap),bh=Math.max(6,d.m/mx*(h-46)),y=h-18-bh;
    s+=`<rect class="grow-y ${d.late?'f-bad':'f-leaf'}" style="animation-delay:${i*70}ms" x="${x}" y="${y}" width="${bw}" height="${bh}" rx="5"/><text x="${x+bw/2}" y="${h-5}" text-anchor="middle">${d.l}</text>`;
    if(d.late)s+=`<text x="${x+bw/2}" y="${y-5}" text-anchor="middle" class="t-strong" style="fill:var(--bad)">${S.lang==='hi'?'देर '+d.m+' मि.':'Late '+d.m+'m'}</text>`});
  return s+'</svg>';
}
function chRing(pct,{size=96,label='',sub=''}={}){
  const r=38,C=2*Math.PI*r;
  return`<svg class="chart" viewBox="0 0 100 100" width="${size}" height="${size}" role="img"><circle cx="50" cy="50" r="${r}" fill="none" class="s-line" stroke-width="11"/><circle cx="50" cy="50" r="${r}" fill="none" class="s-sun" stroke-width="11" stroke-linecap="round" stroke-dasharray="${(C*pct/100).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 50 50)" style="animation:ringIn 1.2s var(--ease) both"/><text x="50" y="52" text-anchor="middle" class="t-strong" style="font-size:19px;font-family:var(--f-display);font-weight:800">${pct}%</text><text x="50" y="65" text-anchor="middle" style="font-size:8px">${esc(sub)}</text></svg>`;
}
function chStack(parts,{onBrand=false}={}){
  const cols=['leaf','info','sun','bad'],tot=parts.reduce((a,p)=>a+p.v,0);let x=0,s='<div style="display:flex;height:34px;border-radius:12px;overflow:hidden;gap:2px">';
  parts.forEach((p,i)=>{s+=`<div style="width:${p.v/tot*100}%;background:var(--${cols[i]});display:grid;place-items:center;font-weight:800;font-size:.8rem;color:${i===2?'#2A1D00':'#fff'};animation:growX .9s var(--ease) both">${p.v}%</div>`});
  s+='</div><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:4px 12px;margin-top:10px;font-size:.82rem">';
  parts.forEach((p,i)=>s+=`<div><i style="display:inline-block;width:10px;height:10px;border-radius:3px;background:var(--${cols[i]});margin-right:6px"></i>${esc(p.l||p.k)}</div>`);
  return s+'</div>';
}
function chHours(vals,{nowI=-1,from=6,to=22,w=300,h=120,cls='leaf',badAbove=null,unit=''}={}){
  const n=to-from+1,bw=(w-16)/n-3,mx=Math.max(...vals.slice(from,to+1),1);let s=`<svg class="chart" viewBox="0 0 ${w} ${h}" role="img"><line class="grid" x1="4" x2="${w-4}" y1="${h-20}" y2="${h-20}"/>`;
  for(let i=from;i<=to;i++){const x=8+(i-from)*(bw+3),bh=Math.max(2,vals[i]/mx*(h-46)),y=h-20-bh,isNow=i===nowI;
    const c=badAbove!=null?(vals[i]>badAbove?'bad':vals[i]>badAbove*.7?'sun':'leaf'):cls;
    s+=`<rect class="grow-y f-${c}" style="animation-delay:${(i-from)*30}ms${isNow?'':';opacity:.78'}" x="${x}" y="${y}" width="${bw}" height="${bh}" rx="3"/>`;
    if(isNow)s+=`<text x="${x+bw/2}" y="${y-5}" text-anchor="middle" class="t-strong">${t('now')}</text>`;
    if((i-from)%4===0||i===to)s+=`<text x="${x+bw/2}" y="${h-6}" text-anchor="middle">${i===12?'12p':(i%12||12)+(i<12?'a':'p')}</text>`}
  return s+'</svg>';
}
function chCompare(you,nb,{w=300,h=130}={}){
  const mx=Math.max(...you,...nb)*1.15,L0=10,R0=62,T0=14,B0=20,X=i=>L0+i/6*(w-L0-R0),Y=v=>T0+(1-v/mx)*(h-T0-B0);
  const pth=a=>a.map((v,i)=>(i?'L':'M')+X(i).toFixed(1)+' '+Y(v).toFixed(1)).join('');
  const days=[...Array(7)].map((_,i)=>['S','M','T','W','T','F','S'][(new Date().getDay()-6+i+7)%7]);
  let s=`<svg class="chart" viewBox="0 0 ${w} ${h}" role="img"><line class="grid" x1="${L0}" x2="${w-R0}" y1="${h-B0}" y2="${h-B0}"/>`;
  s+=`<path d="${pth(nb)}" fill="none" class="s-sun" stroke-width="2.4" stroke-dasharray="2 6" stroke-linecap="round"/><path class="draw s-leaf" style="--len:${w*2}" d="${pth(you)}" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
  days.forEach((d,i)=>s+=`<text x="${X(i)}" y="${h-6}" text-anchor="middle">${d}</text>`);
  s+=`<text x="${w-R0+8}" y="${Y(you[6])+3}" class="t-strong" style="fill:var(--leaf)">${S.lang==='hi'?'आप':'You'} ${you[6]}</text><text x="${w-R0+8}" y="${Y(nb[6])+3}" class="t-strong" style="fill:var(--sun)">${S.lang==='hi'?'पड़ोसी':'Neighbours'} ${nb[6]}</text>`;
  return s+'</svg>';
}
function chHBars(rows){ // rows: {l,v,max,cls,txt}
  const mx=Math.max(...rows.map(r=>r.v));
  return'<div style="display:flex;flex-direction:column;gap:9px">'+rows.map(r=>`<div style="display:grid;grid-template-columns:minmax(80px,1.1fr) 3fr auto;gap:10px;align-items:center;font-size:.85rem"><span>${esc(r.l)}</span><div class="bar ${r.cls||''}"><i style="width:${r.v/mx*100}%"></i></div><b class="num">${esc(r.txt)}</b></div>`).join('')+'</div>';
}
function chSpark(vals,{w=120,h=36,col='var(--sun)'}={}){
  const mn=Math.min(...vals)-2,mx=Math.max(...vals)+2,X=i=>4+i/(vals.length-1)*(w-8),Y=v=>h-4-(v-mn)/(mx-mn)*(h-8);
  return`<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><path d="${vals.map((v,i)=>(i?'L':'M')+X(i)+' '+Y(v)).join('')}" fill="none" stroke="${col}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${X(vals.length-1)}" cy="${Y(vals[vals.length-1])}" r="3.5" fill="${col}"/></svg>`;
}

/* ---------- stylised map: same renderer for every city ---------- */
function cityMap({pins=[],layer='none',you=true,w=400,h=260,hot=-1,id=S.city,small=false}={}){
  const r=rngOf('map'+id),c=CITIES.find(x=>x.id===id)||city();
  let s=`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Map"><rect width="${w}" height="${h}" class="f-surface2"/>`;
  const lx=60+r()*80,ly=70+r()*120;
  s+=`<ellipse cx="${lx}" cy="${ly}" rx="${48+r()*26}" ry="${24+r()*18}" fill="var(--info)" opacity=".28" transform="rotate(${Math.round(r()*40-20)} ${lx} ${ly})"/>`;
  s+=`<rect x="${230+r()*80}" y="${20+r()*20}" width="70" height="46" rx="14" fill="var(--leaf)" opacity=".22"/><rect x="${200+r()*60}" y="${170+r()*30}" width="84" height="52" rx="16" fill="var(--leaf)" opacity=".2"/>`;
  for(let i=1;i<9;i++){const y=i*h/9+(r()-.5)*10;s+=`<path d="M0 ${y}Q${w/2} ${y+(r()-.5)*24} ${w} ${y+(r()-.5)*14}" stroke="var(--surface)" stroke-width="3" fill="none"/>`}
  for(let i=1;i<12;i++){const x=i*w/12+(r()-.5)*10;s+=`<path d="M${x} 0Q${x+(r()-.5)*20} ${h/2} ${x+(r()-.5)*12} ${h}" stroke="var(--surface)" stroke-width="3" fill="none"/>`}
  const roads=[[[0,150+r()*20],[130,120+r()*30],[260,140+r()*20],[w,100+r()*30]],[[90+r()*40,0],[150+r()*30,90],[210+r()*30,170],[230+r()*40,h]],[[0,40+r()*30],[120,70],[250,50+r()*20],[w,70+r()*20]]];
  const pl=a=>a.map((p,i)=>(i?'L':'M')+p[0].toFixed(0)+' '+p[1].toFixed(0)).join('');
  roads.forEach(a=>s+=`<path d="${pl(a)}" stroke="var(--surface)" stroke-width="9" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`);
  if(layer==='traffic')roads.forEach((a,i)=>{const lv=[['bad','sun'],['sun','leaf'],['leaf','leaf']][i];s+=`<path d="${pl(a.slice(0,2))}" class="s-${lv[0]}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="${pl(a.slice(1))}" class="s-${lv[1]}" stroke-width="5" fill="none" stroke-linecap="round"/>`});
  if(layer==='bus'){[roads[0],roads[1]].forEach(a=>{s+=`<path d="${pl(a)}" class="s-info" stroke-width="3.5" fill="none" stroke-dasharray="7 5" stroke-linecap="round"/>`;a.forEach(p=>s+=`<circle cx="${p[0]}" cy="${p[1]}" r="6" class="f-info"/><circle cx="${p[0]}" cy="${p[1]}" r="2.4" fill="#fff"/>`)})}
  if(layer==='park'){[[120,115],[255,138],[190,60],[300,190]].forEach(p=>s+=`<rect x="${p[0]-11}" y="${p[1]-11}" width="22" height="22" rx="6" class="f-info"/><text x="${p[0]}" y="${p[1]+5}" text-anchor="middle" style="fill:#fff;font-weight:800;font-size:13px">P</text>`)}
  if(layer==='ev'){[[150,100],[240,150],[320,80]].forEach(p=>s+=`<circle cx="${p[0]}" cy="${p[1]}" r="12" class="f-sun"/><path d="M${p[0]+2} ${p[1]-7}l-6 8h5l-2 6 6-8h-5z" fill="#2A1D00"/>`)}
  if(you){const yx=w*.46,yy=h*.5;s+=`<circle cx="${yx}" cy="${yy}" r="9" class="f-leaf pulse-ring"/><circle cx="${yx}" cy="${yy}" r="7" class="f-leaf" stroke="#fff" stroke-width="2.5"/>`;if(!small)s+=`<text x="${yx}" y="${yy+22}" text-anchor="middle" class="t-strong" style="font-size:11px">${S.lang==='hi'?'आप':'You'}</text>`}
  pins.forEach((p,i)=>{const col=p.ev?'info':['bad','bad','sun','leaf'][p.st??0],tc=col==='sun'?'#2A1D00':'#fff';
    s+=`<g class="pin${i===hot?' hot':''}" data-act="pin" data-i="${i}" tabindex="0" role="button" aria-label="${esc(p.label||'Pin '+(i+1))}">${p.st===0?`<circle cx="${p.x}" cy="${p.y}" r="12" class="f-bad pulse-ring" opacity=".5"/>`:''}<circle cx="${p.x}" cy="${p.y}" r="12" class="f-${col}" stroke="#fff" stroke-width="2.5"/><text x="${p.x}" y="${p.y+4}" text-anchor="middle" style="fill:${tc};font-weight:800;font-size:12px">${p.n??i+1}</text></g>`});
  return s+'</svg>';
}
