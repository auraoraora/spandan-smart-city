/* ====== Shell: router, chrome, sheets, toasts ====== */
const ACT={},PAGES={},AFTER={};
let TM=[];
const every=(fn,ms)=>{const id=setInterval(fn,ms);TM.push(id);return id};
const clearTimers=()=>{TM.forEach(clearInterval);TM=[]};
addI({en:{wasteS:'Waste/Power',greetSub:'Here is your day in {area}.',lang2:'हिं',ariaLang:'Switch language',ariaTheme:'Switch light or dark',ariaBell:'Notifications',ariaSet:'Settings',askShort:'Ask'},
      hi:{wasteS:'कचरा/बिजली',greetSub:'{area} में आपका दिन।',lang2:'EN',ariaLang:'भाषा बदलें',ariaTheme:'हल्का या गहरा बदलें',ariaBell:'सूचनाएँ',ariaSet:'सेटिंग',askShort:'पूछें'}});

document.addEventListener('click',e=>{const el=e.target.closest('[data-act]');if(!el)return;const f=ACT[el.dataset.act];if(f)f(el,e)});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){if($('#layer .sheet'))closeSheet()}
  if((e.key==='Enter'||e.key===' ')&&e.target.matches&&e.target.matches('g[data-act]')){e.preventDefault();e.target.dispatchEvent(new MouseEvent('click',{bubbles:true}))}
});

function toast(msg,label,fn){
  $$('.toast').forEach(x=>x.remove());const d=document.createElement('div');d.className='toast';d.setAttribute('role','status');
  const s=document.createElement('span');s.textContent=msg;d.append(s);
  if(label){const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=()=>{fn&&fn();d.remove()};d.append(b)}
  $('#layer').append(d);clearTimeout(toast.t);toast.t=setTimeout(()=>d.remove(),label?7000:3400);
}
let SHT=null;
function openSheet(html,after){
  closeSheet();const l=$('#layer'),sc=document.createElement('div');sc.className='scrim';sc.dataset.act='sheet-close';
  const sh=document.createElement('div');sh.className='sheet';sh.setAttribute('role','dialog');sh.setAttribute('aria-modal','true');sh.innerHTML=`<div class="grab"></div>${html}`;
  l.append(sc,sh);document.body.style.overflow='hidden';after&&after(sh);
  const f=sh.querySelector('input,textarea,button');f&&f.focus({preventScroll:true});return sh;
}
function closeSheet(){$$('#layer .scrim,#layer .sheet').forEach(x=>x.remove());clearInterval(SHT);SHT=null;if($('#welcome').hidden)document.body.style.overflow=''}
ACT['sheet-close']=closeSheet;

function applyPrefs(){
  const r=document.documentElement;if(S.theme==='system')r.removeAttribute('data-theme');else r.setAttribute('data-theme',S.theme);
  r.style.setProperty('--fs',S.textSize);r.lang=S.lang;save();
}
function applyLang(){applyPrefs();renderChrome();if($('#welcome').hidden)render(true)}
const isDark=()=>S.theme==='dark'||(S.theme==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);

const navItems=()=>S.role==='manager'
 ?[{id:'queue',ic:'report',l:t('queue')},{id:'mapv',ic:'pin',l:t('mapv')},{id:'insights',ic:'pulse',l:t('insights')},{id:'exit',ic:'home',l:t('citizenView')}]
 :[{id:'home',ic:'home',l:t('home')},{id:'travel',ic:'travel',l:t('travel')},{id:'waste',ic:'waste',l:t('waste'),s:t('wasteS')},{id:'report',ic:'report',l:t('report')},{id:'future',ic:'future',l:t('future')}];
const navCur=id=>S.role==='manager'?(S.tab.mgr||'queue')===id:S.page===id;
function renderChrome(){
  const mgr=S.role==='manager',items=navItems();
  $('#side').innerHTML=`<div class="logo">${ico('pulse').replace('<svg','<svg width="30" height="30" style="color:var(--leaf)"')}Spandan</div>`+items.map(n=>`<button class="navbtn" data-act="nav" data-p="${n.id}" ${navCur(n.id)?'aria-current="page"':''} type="button">${ico(n.ic)}<span>${esc(n.l)}</span></button>`).join('')
   +`<div class="cityfoot"><div class="eyebrow">${t('city')}</div><b>${esc(cname())}</b><div class="muted">${esc(areaName(curArea()))}</div><button class="btn sm ghost" style="margin-top:10px" data-act="settings" type="button">${t('changeCity')}</button></div>`;
  $('#tabbar').innerHTML=items.map(n=>`<button class="navbtn" data-act="nav" data-p="${n.id}" ${navCur(n.id)?'aria-current="page"':''} type="button">${ico(n.ic)}<span>${esc(n.s||n.l)}</span></button>`).join('');
  const dot=S.role==='citizen'&&!S.bellSeen?'<span class="dot"></span>':'';
  $('#top').innerHTML=`<div class="brandmark mob">${ico('pulse').replace('<svg','<svg width="26" height="26" style="color:var(--leaf)"')}Spandan</div>
   <button class="chip" data-act="settings" type="button" style="margin-left:4px">${ico('pin').replace('<svg','<svg width="15" height="15"')}${esc(cname())}${mgr?'':' · '+esc(areaName(curArea()))}</button>${mgr?`<span class="mgr-badge">${S.lang==='hi'?'नगर निगम':'NAGAR NIGAM'}</span>`:''}
   <span class="spacer"></span>
   <button class="icobtn" data-act="lang" type="button" aria-label="${esc(t('ariaLang'))}" style="font-weight:800;font-size:.85rem;font-family:var(--f-display)">${t('lang2')}</button>
   <button class="icobtn themebtn" data-act="theme" type="button" aria-label="${esc(t('ariaTheme'))}">${ico(isDark()?'sun':'moon')}</button>
   ${mgr?'':`<button class="icobtn" data-act="bell" type="button" aria-label="${esc(t('ariaBell'))}">${ico('bell')}${dot}</button>`}
   <button class="icobtn" data-act="settings" type="button" aria-label="${esc(t('ariaSet'))}">${ico('sliders')}</button>`;
  const fab=$('#fab');fab.hidden=mgr||!S.onboarded;fab.dataset.act='ask';fab.innerHTML=`${ico('spark')}<span>${t('ask')}</span>`;
}
function render(keep){
  clearTimers();const y=window.scrollY,v=$('#view'),pg=S.role==='manager'?'manager':S.page;
  v.innerHTML=`<div class="page" data-page="${pg}" ${keep?'style="animation:none"':''}>${(PAGES[pg]||PAGES.home)()}</div>`;
  renderChrome();AFTER[pg]&&AFTER[pg]();if(keep)window.scrollTo(0,y);
}
function go(p){
  if(p==='exit'){S.role='citizen';S.page='home'}
  else if(S.role==='manager'){S.tab.mgr=p}
  else S.page=p;
  render();window.scrollTo({top:0});
}
ACT.nav=el=>go(el.dataset.p);
ACT.lang=()=>{S.lang=S.lang==='en'?'hi':'en';applyLang();toast(S.lang==='hi'?'अब ऐप हिंदी में है':'App is now in English')};
ACT.theme=()=>{S.theme=isDark()?'light':'dark';applyPrefs();renderChrome()};

/* live countdowns: any element with data-until="<epoch ms>" */
setInterval(()=>{const n=Date.now();$$('[data-until]').forEach(e=>{const l=+e.dataset.until-n;e.textContent=l>0?fmtLeft(l):(S.lang==='hi'?'बंद':'closed')})},1000);
