/* ============================================================
   HIGHSPEED ENTERPRISES — SHOP MANAGER
   Offline-first: all data stored in localStorage on this device.
   Works with zero internet connection. Use Backup & Restore to
   move data between devices or keep safe copies.
   ============================================================ */

const DBKEY = "hs_v1_";
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,7);
const isoLocal = d => d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const todayISO = () => isoLocal(new Date());
const parseISO = iso => { const p=iso.split('-').map(Number); return new Date(p[0],p[1]-1,p[2]); };
const addDays = (iso,n) => { const d=parseISO(iso); d.setDate(d.getDate()+n); return isoLocal(d); };
/* Weeks run Monday -> Sunday */
const weekStartOf = iso => { const d=parseISO(iso); const back=(d.getDay()+6)%7; d.setDate(d.getDate()-back); return isoLocal(d); };
const monthStartOf = iso => iso.slice(0,8)+'01';
const DAY_NAMES = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const fmtDay = iso => parseISO(iso).toLocaleDateString(undefined,{day:'numeric',month:'short'});
const esc = v => String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const ICONS = {
  dash:'<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
  plus:'<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
  monitor:'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  wallet:'<path d="M3 7a2 2 0 0 1 2-2h13v4"/><path d="M3 7v11a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1H5a2 2 0 0 1-2-2z"/><circle cx="16.5" cy="14.5" r="1"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  check:'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 12l3 3 5-6"/>',
  tag:'<path d="M20 12l-8 8-9-9V4h7z"/><circle cx="7.5" cy="8.5" r="1"/>',
  box:'<path d="M21 8l-9-5-9 5 9 5z"/><path d="M3 8v8l9 5 9-5V8M12 13v8"/>',
  chart:'<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
  pie:'<path d="M21 12A9 9 0 1 1 12 3v9z"/><path d="M15 3.5A9 9 0 0 1 20.5 9H15z"/>',
  sync:'<path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/>',
  sliders:'<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  trend:'<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>',
  coins:'<circle cx="9" cy="9" r="6"/><path d="M15 9.5A6 6 0 1 1 9.5 15"/>',
  copy:'<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
  edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  print:'<path d="M6 9V3h12v6M6 18H4v-7h16v7h-2"/><rect x="6" y="14" width="12" height="7"/>',
  star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  unlock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.5-2"/>',
  left:'<path d="M15 6l-6 6 6 6"/>',
  right:'<path d="M9 6l6 6-6 6"/>',
  users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M17 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-3.5-5.8"/>',
  cart:'<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M3 4h2.5l2.2 11h10.5L20 7H6.5"/>',
  x:'<path d="M6 6l12 12M18 6L6 18"/>'
};
function icon(n,size){ size=size||18; return '<svg class="ico" width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+(ICONS[n]||'')+'</svg>'; }
const nowTime = () => new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});

function loadData(key, fallback){
  try{
    const raw = localStorage.getItem(DBKEY+key);
    if(raw===null) return fallback;
    return JSON.parse(raw);
  }catch(e){ return fallback; }
}
function saveData(key, val){
  localStorage.setItem(DBKEY+key, JSON.stringify(val));
}

const DEFAULT_SETTINGS = {
  shopName: "Highspeed Enterprises",
  location: "Behind Market, Federal University Dutse",
  phone: "",
  currency: "₦",
  pinEnabled: false,
  pin: "",
  lowStockDefault: 5,
  setupDone: false
};

const DEFAULT_SERVICES = [
  {id:uid(), name:"Browsing (per hour)", unit:"hour", price:150, category:"Browsing"},
  {id:uid(), name:"Printing — Black & White", unit:"page", price:50, category:"Printing"},
  {id:uid(), name:"Printing — Colour", unit:"page", price:150, category:"Printing"},
  {id:uid(), name:"Scanning", unit:"page", price:50, category:"Scanning"},
  {id:uid(), name:"Photocopy", unit:"page", price:20, category:"Photocopy"},
  {id:uid(), name:"Lamination — ID size", unit:"pc", price:100, category:"Lamination"},
  {id:uid(), name:"Lamination — A4", unit:"pc", price:300, category:"Lamination"},
  {id:uid(), name:"Typing / Word Processing", unit:"page", price:100, category:"Typing"},
  {id:uid(), name:"CV / Resume Writing", unit:"job", price:1000, category:"Typing"},
  {id:uid(), name:"Passport Photograph", unit:"set", price:300, category:"Photography"},
  {id:uid(), name:"Spiral Binding", unit:"pc", price:300, category:"Binding"},
  {id:uid(), name:"JAMB / Admission Form Processing", unit:"job", price:1500, category:"Forms"},
  {id:uid(), name:"Recharge Card / Airtime Sale", unit:"txn", price:0, category:"Recharge"},
  {id:uid(), name:"POS Withdrawal / Transfer Commission", unit:"txn", price:100, category:"POS"},
  {id:uid(), name:"CD/Flash Drive Burning or Download", unit:"job", price:200, category:"Other"}
];

const DEFAULT_STATIONS = Array.from({length:4}).map((_,i)=>({
  id: uid(), name:"PC "+(i+1), rate:150, status:"idle", startTime:null
}));

const DEFAULT_STAFF = [
  {id:uid(), name:"Owner / Admin", pin:"0000", role:"admin"},
  {id:uid(), name:"Staff 1", pin:"1111", role:"staff"},
  {id:uid(), name:"Staff 2", pin:"2222", role:"staff"}
];

const DEFAULT_INVENTORY = [
  {id:uid(), name:"A4 Paper (ream)", qty:10, unit:"ream", reorder:3},
  {id:uid(), name:"HP Printer Ink — Black", qty:2, unit:"bottle", reorder:1},
  {id:uid(), name:"HP Printer Ink — Colour", qty:2, unit:"bottle", reorder:1},
  {id:uid(), name:"Lamination Film — ID", qty:100, unit:"pcs", reorder:20},
  {id:uid(), name:"Lamination Film — A4", qty:50, unit:"pcs", reorder:10},
  {id:uid(), name:"Spiral Binding Coil", qty:30, unit:"pcs", reorder:10},
  {id:uid(), name:"Staple Pins (box)", qty:5, unit:"box", reorder:2}
];

let settings   = loadData("settings", null) || {...DEFAULT_SETTINGS};
let sales      = loadData("sales", []);
let expenses   = loadData("expenses", []);
let services   = loadData("services", null) || DEFAULT_SERVICES;
let stations   = loadData("stations", null) || DEFAULT_STATIONS;
let inventory  = loadData("inventory", null) || DEFAULT_INVENTORY;
let staff      = loadData("staff", null) || DEFAULT_STAFF;
let closings   = loadData("closings", []);
let debts      = loadData("debts", []);   // manually recorded debts (cash lent, goods, old balances…)
const DEFAULT_SHARES = () => ([
  {id:uid(), name:"Shop Maintenance Fund", kind:"fund",   pct:20},
  {id:uid(), name:"Owner",                 kind:"person", pct:40},
  {id:uid(), name:"Manager",               kind:"person", pct:15},
  {id:uid(), name:"Assistant Manager",     kind:"person", pct:10},
  {id:uid(), name:"Staff Pool",            kind:"person", pct:15}
]);
let profitShare = loadData("profitshare", null) || {shares: DEFAULT_SHARES(), history:{}};
let currentStaff = null;

function persistAll(){
  saveData("settings", settings);
  saveData("sales", sales);
  saveData("expenses", expenses);
  saveData("services", services);
  saveData("stations", stations);
  saveData("inventory", inventory);
  saveData("staff", staff);
  saveData("closings", closings);
  saveData("debts", debts);
  saveData("profitshare", profitShare);
}
persistAll();

/* ============================================================
   CLOUD SYNC (Firebase Firestore) — optional layer.
   When connected, this device reads/writes a shared online
   database instead of (in addition to) its own local copy, so
   every device signed into the same Shop Code sees the same
   sales, expenses, inventory, staff etc. in real time. Firestore
   also caches data locally, so the app keeps working offline and
   syncs automatically once the connection returns.
   ============================================================ */
let cloudApp = null, db = null, cloudMode = false, shopId = null, cloudReady = false;
const CLOUD_CFG_KEY = "hs_cloud_config";
const CLOUD_DISABLED_KEY = "hs_cloud_disabled";
const CLOUD_LISTENERS = [];

/* Built-in defaults so every device auto-connects to the shop's shared
   database on first load — no manual paste-in required. This config value
   is safe to ship in the app: it's just an address, not a secret. Access
   is actually controlled by the Firestore security rules (only signed-in
   devices may read/write), not by keeping this hidden. */
const BUILT_IN_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDQ_8xn4TKQnZwXxVgxZSyzJS3CbmUtwpU",
  authDomain: "highspeed-enterprises.firebaseapp.com",
  databaseURL: "https://highspeed-enterprises-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "highspeed-enterprises",
  storageBucket: "highspeed-enterprises.firebasestorage.app",
  messagingSenderId: "453736360737",
  appId: "1:453736360737:web:96d9d99a525ad4d8562c60"
};
const BUILT_IN_SHOP_ID = "highspeed-enterprises";

function getCloudConfig(){
  try{ return JSON.parse(localStorage.getItem(CLOUD_CFG_KEY) || "null"); }catch(e){ return null; }
}
function setCloudConfig(cfg){ localStorage.setItem(CLOUD_CFG_KEY, JSON.stringify(cfg)); }
function clearCloudConfig(){ localStorage.removeItem(CLOUD_CFG_KEY); }

function initCloudFromSaved(onDone){
  const manuallyDisabled = localStorage.getItem(CLOUD_DISABLED_KEY) === "1";
  const saved = getCloudConfig();
  if(saved){
    connectCloud(saved.firebaseConfig, saved.shopId, onDone, true);
    return;
  }
  if(manuallyDisabled){ onDone(false); return; }
  // First time this device has opened the app — auto-connect to the shop's shared database.
  connectCloud(BUILT_IN_FIREBASE_CONFIG, BUILT_IN_SHOP_ID, onDone, true);
}

function connectCloud(firebaseConfig, shopCode, onDone, silent){
  try{
    shopId = (shopCode||'default-shop').trim().toLowerCase().replace(/[^a-z0-9-]/g,'-') || 'default-shop';
    cloudApp = firebase.initializeApp(firebaseConfig, 'hs-'+Date.now());
    db = cloudApp.firestore();
    try{ db.enablePersistence({synchronizeTabs:true}).catch(()=>{}); }catch(e){}
    const auth = cloudApp.auth();
    auth.signInAnonymously().then(()=>{
      cloudMode = true;
      setCloudConfig({firebaseConfig, shopId});
      localStorage.removeItem(CLOUD_DISABLED_KEY);
      attachCloudListeners();
      cloudReady = true;
      if(onDone) onDone(true);
    }).catch(err=>{
      console.error(err);
      if(!silent) alert('Could not connect to cloud: '+err.message);
      if(onDone) onDone(false);
    });
  }catch(err){
    console.error(err);
    if(!silent) alert('Invalid Firebase configuration: '+err.message);
    if(onDone) onDone(false);
  }
}

function disconnectCloud(){
  CLOUD_LISTENERS.forEach(unsub=>{ try{unsub();}catch(e){} });
  CLOUD_LISTENERS.length = 0;
  cloudMode = false; cloudReady = false; db = null; cloudApp = null;
  clearCloudConfig();
  localStorage.setItem(CLOUD_DISABLED_KEY, "1");
}

function psDoc(){ return db.collection('shops').doc(shopId).collection('private').doc('profitShare'); }
function cloudSetProfitShare(){ saveData('profitshare', profitShare); if(cloudMode && db) psDoc().set(profitShare).catch(e=>console.error(e)); }
function fsCol(name){ return db.collection('shops').doc(shopId).collection(name); }

function attachCloudListeners(){
  CLOUD_LISTENERS.push(fsCol('sales').onSnapshot(snap=>{
    sales = snap.docs.map(d=>d.data()).sort((a,b)=> (a.date+a.time) < (b.date+b.time) ? -1:1);
    saveData('sales', sales);
    safeRerender();
  }));
  CLOUD_LISTENERS.push(fsCol('expenses').onSnapshot(snap=>{
    expenses = snap.docs.map(d=>d.data());
    saveData('expenses', expenses);
    safeRerender();
  }));
  CLOUD_LISTENERS.push(fsCol('services').onSnapshot(snap=>{
    if(!snap.empty){ services = snap.docs.map(d=>d.data()); saveData('services', services); safeRerender(); }
  }));
  CLOUD_LISTENERS.push(fsCol('stations').onSnapshot(snap=>{
    if(!snap.empty){ stations = snap.docs.map(d=>d.data()).sort((a,b)=>a.name.localeCompare(b.name,undefined,{numeric:true})); stationsLoaded=true; saveData('stations', stations); if(isAdmin()) maybeTrimStations(); safeRerender(); }
  }));
  CLOUD_LISTENERS.push(fsCol('inventory').onSnapshot(snap=>{
    if(!snap.empty){ inventory = snap.docs.map(d=>d.data()); saveData('inventory', inventory); safeRerender(); }
  }));
  CLOUD_LISTENERS.push(fsCol('staff').onSnapshot(snap=>{
    if(!snap.empty){
      staff = snap.docs.map(d=>d.data());
      saveData('staff', staff);
      if(currentStaff){ const upd = staff.find(s=>s.id===currentStaff.id); if(upd) currentStaff = upd; }
      safeRerender();
    }
  }));
  CLOUD_LISTENERS.push(db.collection('shops').doc(shopId).onSnapshot(doc=>{
    if(doc.exists){
      settings = {...settings, ...doc.data()};
      saveData('settings', settings);
      const nm=document.getElementById('sbShopName'), lc=document.getElementById('sbShopLoc');
      if(nm) nm.textContent = settings.shopName;
      if(lc) lc.textContent = settings.location;
      safeRerender();
    }
  }));
  CLOUD_LISTENERS.push(fsCol('closings').onSnapshot(snap=>{
    closings = snap.docs.map(d=>d.data());
    saveData('closings', closings);
    safeRerender();
  }));
  CLOUD_LISTENERS.push(fsCol('debts').onSnapshot(snap=>{
    debts = snap.docs.map(d=>d.data());
    saveData('debts', debts);
    safeRerender();
  }));
  CLOUD_LISTENERS.push(psDoc().onSnapshot(doc=>{
    if(doc.exists){
      const d = doc.data();
      profitShare = {shares: d.shares||profitShare.shares, history: d.history||{}};
      saveData('profitshare', profitShare);
      safeRerender();
    } else {
      psDoc().set(profitShare).catch(e=>console.error(e));
    }
  }));
  // seed cloud with local defaults if collections are empty (first device to connect)
  fsCol('services').get().then(snap=>{ if(snap.empty) services.forEach(s=>fsCol('services').doc(s.id).set(s)); });
  fsCol('stations').get().then(snap=>{ if(snap.empty) stations.forEach(s=>fsCol('stations').doc(s.id).set(s)); });
  fsCol('inventory').get().then(snap=>{ if(snap.empty) inventory.forEach(s=>fsCol('inventory').doc(s.id).set(s)); });
  fsCol('staff').get().then(snap=>{ if(snap.empty) staff.forEach(s=>fsCol('staff').doc(s.id).set(s)); });
  db.collection('shops').doc(shopId).get().then(doc=>{ if(!doc.exists) db.collection('shops').doc(shopId).set(settings); });
}

let pendingRerender = false;
function safeRerender(){
  const appEl = document.getElementById('app');
  const lockEl = document.getElementById('lockScreen');
  if(appEl && appEl.style.display!=='none'){
    renderNav();
    const ae = document.activeElement;
    const typing = ae && ae.closest && ae.closest('#content') && /^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName);
    if(typing){
      // don't wipe what someone is typing; refresh once they leave the field
      if(!pendingRerender){
        pendingRerender = true;
        ae.addEventListener('blur', ()=>{ pendingRerender=false; setTimeout(()=>{ const a=document.activeElement; if(!(a && a.closest && a.closest('#content') && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName))) renderPage(); },150); }, {once:true});
      }
      if(currentPage==='pos') renderPosTodayList();
      return;
    }
    renderPage();
  } else if(lockEl && lockEl.style.display!=='none' && document.getElementById('lockCard') && document.querySelector('.staffpicker')){
    renderStaffPicker();
  }
}

/* Write-through helpers: call alongside existing local saveData() calls */
function cloudSet(collectionName, record){ if(cloudMode && db) fsCol(collectionName).doc(record.id).set(record).catch(e=>console.error(e)); }
function cloudDelete(collectionName, id){ if(cloudMode && db) fsCol(collectionName).doc(id).delete().catch(e=>console.error(e)); }
function cloudSetSettings(){ if(cloudMode && db) db.collection('shops').doc(shopId).set(settings, {merge:true}).catch(e=>console.error(e)); }

function fmt(n){
  n = Number(n)||0;
  return settings.currency + n.toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:2});
}
function toast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg; t.classList.add('show');
  clearTimeout(window.__toastT);
  window.__toastT=setTimeout(()=>t.classList.remove('show'),2200);
}

/* ---------------- Navigation ---------------- */
const NAV = [
  {group:"Overview", items:[
    {id:"dashboard", label:"Dashboard", ic:"dash"},
  ]},
  {group:"Operations", items:[
    {id:"pos", label:"New Sale", ic:"plus"},
    {id:"stations", label:"Computer Stations", ic:"monitor"},
    {id:"sales", label:"Sales Log", ic:"list"},
    {id:"debts", label:"Customer Debts", ic:"clock"},
    {id:"expenses", label:"Expenses", ic:"wallet"},
    {id:"closing", label:"Day Closing", ic:"check"},
  ]},
  {group:"Setup", items:[
    {id:"services", label:"Services & Pricing", ic:"tag", admin:true},
    {id:"inventory", label:"Inventory", ic:"box", admin:true},
  ]},
  {group:"Insights", items:[
    {id:"reports", label:"Reports", ic:"chart"},
    {id:"profit", label:"Profit Share", ic:"pie", admin:true},
  ]},
  {group:"System", items:[
    {id:"backup", label:"Backup & Restore", ic:"sync", admin:true},
    {id:"settings", label:"Settings", ic:"sliders", admin:true},
  ]}
];
let currentPage = "dashboard";

function isAdmin(){ return currentStaff && currentStaff.role==='admin'; }

function renderNav(){
  const el = document.getElementById('navList');
  el.innerHTML = NAV.map(g=>{
    const items = g.items.filter(it=> !it.admin || isAdmin());
    if(!items.length) return '';
    return `
    <div class="navgroup-label">${g.group}</div>
    ${items.map(it=>{
      let badge='';
      if(it.id==='inventory' && lowStockCount()>0) badge=`<span class="badge">${lowStockCount()}</span>`;
      if(it.id==='debts'){ const od=openDebts(); if(od.length>0) badge=`<span class="badge">${od.length}</span>`; }
      return `
      <button class="navitem ${currentPage===it.id?'active':''}" onclick="go('${it.id}')">
        <span class="ic">${icon(it.ic,17)}</span><span>${it.label}</span>${badge}
      </button>`;
    }).join('')}
  `;}).join('');
  renderUserChip();
}

function renderUserChip(){
  const el = document.getElementById('userChip');
  if(!el || !currentStaff) return;
  const initials = currentStaff.name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
  el.innerHTML = `
    <div class="av">${esc(initials)}</div>
    <div><div class="un">${esc(currentStaff.name)}</div><div class="ur">${esc(currentStaff.role)}</div></div>
    <button onclick="logoutStaff()">Switch</button>
  `;
  const bb=document.getElementById('topBackupBtn'); if(bb) bb.style.display = isAdmin()?'':'none';
}

const PAGE_META = {
  dashboard:["Dashboard","Overview of today's activity"],
  pos:["New Sale","Record a service sold at the counter"],
  stations:["Computer Stations","Start and stop browsing sessions"],
  sales:["Sales Log","All recorded transactions"],
  expenses:["Expenses","Track shop running costs"],
  services:["Services & Pricing","Manage what you sell and how much it costs"],
  inventory:["Inventory","Stock of consumables like paper and ink"],
  reports:["Reports","Performance over a date range"],
  backup:["Backup & Restore","Protect your data — this shop runs offline"],
  settings:["Settings","Shop details and preferences"],
  debts:["Customer Debts","Who owes the shop money"],
  closing:["Day Closing","Count the till at the end of your shift"],
  profit:["Profit Share","Private weekly profit sharing (Monday to Sunday)"]
};

function go(page){
  const navItem = NAV.flatMap(g=>g.items).find(it=>it.id===page);
  if(navItem && navItem.admin && !isAdmin()){
    toast("Admin access only");
    page = 'dashboard';
  }
  currentPage = page;
  const meta = PAGE_META[page];
  document.getElementById('pageTitle').textContent = meta[0];
  document.getElementById('pageSub').textContent = meta[1];
  renderNav();
  renderPage();
  document.getElementById('sidebar').classList.remove('open');
  window.scrollTo(0,0);
}
function toggleSidebar(){ document.getElementById('sidebar').classList.toggle('open'); }

function renderPage(){
  const c = document.getElementById('content');
  const pages = {dashboard:pageDashboard, pos:pagePOS, stations:pageStations, sales:pageSales, debts:pageDebts,
    expenses:pageExpenses, closing:pageClosing, services:pageServices, inventory:pageInventory,
    reports:pageReports, profit:pageProfit, backup:pageBackup, settings:pageSettings};
  const fn = pages[currentPage] || pageDashboard;
  c.innerHTML = '<div class="page-in">'+fn()+'</div>';
  if(currentPage==='pos') initPOSForm();
  if(currentPage==='reports') initReports();
  if(currentPage==='sales') filterSalesLog();
  if(currentPage==='debts') debtBind();
  if(currentPage==='closing'){ const f=closingFigures(isAdmin()?(closeDate||todayISO()):todayISO(), currentStaff?currentStaff.name:''); initClosingLive(f.expected); }
  if(currentPage==='stations') renderStationGrid();
  if(currentPage==='settings'){ renderStaffList(); renderCloudPanel(); }
}

/* ---------------- Helpers on data ---------------- */
const DEBT_CATEGORIES = ['Browsing','Printing / Copying','Typing & Documents','Forms & Registration','Recharge / POS','Cash lent','Goods / items','Other'];
function guessDebtCategory(sale){
  const svc = services.find(x=>x.name===sale.service);
  const c = ((svc && svc.category)||'').toLowerCase(), n=(sale.service||'').toLowerCase();
  if(n.startsWith('browsing') || c==='browsing') return 'Browsing';
  if(['printing','photocopy','scanning','lamination','binding'].includes(c)) return 'Printing / Copying';
  if(c==='typing') return 'Typing & Documents';
  if(c==='forms') return 'Forms & Registration';
  if(c==='recharge' || c==='pos') return 'Recharge / POS';
  return 'Other';
}
function isCredit(x){ return x.payment==='credit'; }
/* payments received against a credit sale (older records used paid/paidDate) */
function payListOf(x){
  if(!isCredit(x)) return [];
  if(Array.isArray(x.payments)) return x.payments;
  if(x.paid) return [{id:'legacy', date:x.paidDate||x.date, amount:Number(x.amount), method:x.paidMethod||'cash', by:x.paidBy||'', ts:0, note:''}];
  return [];
}
function paidOf(x){ return sum(payListOf(x),'amount'); }
function outstandingOf(x){ if(!isCredit(x) || x.writtenOff) return 0; return Math.max(0, Number(x.amount)-paidOf(x)); }
function receivedOf(x){ return isCredit(x) ? paidOf(x) : Number(x.amount); }

/* Revenue view: money actually received (credit sales count once they are paid) */
/* Revenue view (cash basis): normal sales on their date, and every payment on a credit sale on the day it was received */
function revenueRecords(){
  const out=[];
  sales.forEach(x=>{
    if(!isCredit(x)) out.push(x);
    else payListOf(x).forEach(p=>out.push({...x, amount:Number(p.amount), date:p.date, paidMethod:p.method}));
  });
  return out;
}
function salesBetween(startISO, endISO){
  return revenueRecords().filter(x=> x.date>=startISO && x.date<=endISO);
}
/* Log view: every sale by the day it was made */
function allSalesBetween(startISO, endISO){
  return sales.filter(s=> s.date>=startISO && s.date<=endISO);
}
/* One list of everything owed to the shop: credit sales + manually recorded debts */
function debtItems(){
  const items=[];
  sales.filter(isCredit).forEach(x=>items.push({
    kind:'sale', id:x.id, customer:x.customer||'Unknown', phone:x.phone||'', category:x.debtCategory||guessDebtCategory(x),
    desc:x.service+(x.qty>1?' ×'+x.qty:''), total:Number(x.amount), date:x.date, ts:x.ts||0, due:x.dueDate||'',
    payments:payListOf(x), writtenOff:!!x.writtenOff, staff:x.staff||'', receipt:x.receipt||'', note:x.note||'', src:x }));
  debts.forEach(d=>items.push({
    kind:'manual', id:d.id, customer:d.customer||'Unknown', phone:d.phone||'', category:d.category||'Other',
    desc:d.description||d.category||'Debt', total:Number(d.amount), date:d.date, ts:d.ts||0, due:d.dueDate||'',
    payments:Array.isArray(d.payments)?d.payments:[], writtenOff:!!d.writtenOff, staff:d.staff||'', receipt:'', note:d.note||'', src:d }));
  const today=todayISO();
  items.forEach(it=>{
    it.paid=sum(it.payments,'amount');
    it.balance=it.writtenOff?0:Math.max(0,Math.round((it.total-it.paid)*100)/100);
    it.status=it.writtenOff?'writtenoff':(it.balance<=0?'cleared':(it.paid>0?'part':'unpaid'));
    it.overdue=it.balance>0 && !!it.due && it.due<today;
  });
  return items;
}
function openDebts(){ return debtItems().filter(i=>i.balance>0); }
function hourOf(s){
  if(s.hour!=null) return Number(s.hour);
  const m = /(\d{1,2}):(\d{2})\s*(AM|PM)?/i.exec(s.time||'');
  if(!m) return null;
  let h = Number(m[1]); const ap=(m[3]||'').toUpperCase();
  if(ap==='PM' && h<12) h+=12; if(ap==='AM' && h===12) h=0;
  return h;
}
/* How often each service name has been sold — drives favorites ordering */
function serviceUsage(){
  const u={}; sales.forEach(x=>{ u[x.service]=(u[x.service]||0)+1; }); return u;
}
function rankedServices(){
  const u=serviceUsage();
  return services.slice().sort((a,b)=> (u[b.name]||0)-(u[a.name]||0) || a.name.localeCompare(b.name));
}
function revenueOn(a,b){ return sum(salesBetween(a,b),'amount'); }
function expensesBetween(startISO, endISO){
  return expenses.filter(e=> e.date>=startISO && e.date<=endISO);
}
function sum(arr, key){ return arr.reduce((a,b)=>a+(Number(b[key])||0),0); }
function lowStockCount(){ return inventory.filter(i=>Number(i.qty) <= Number(i.reorder)).length; }

/* ================= DASHBOARD ================= */
function statCard(cls, ic, label, value, foot, vstyle){
  return `<div class="card stat-card ${cls}"><div class="stat-ico">${icon(ic,20)}</div><div class="stat-label">${label}</div><div class="stat-value" ${vstyle?'style="'+vstyle+'"':''}>${value}</div><div class="stat-foot">${foot}</div></div>`;
}
function trendRow(label, sub, cur, prev){
  const d = prev>0 ? ((cur-prev)/prev*100) : null;
  const cls = d==null ? '' : (d>=0 ? 'up' : 'down');
  return `<div class="trend"><div class="trend-l"><b>${label}</b><small>${sub}</small></div><div class="trend-v">${fmt(cur)}</div><div class="trend-d ${cls}">${d==null?'—':(d>=0?'▲ ':'▼ ')+Math.abs(d).toFixed(0)+'%'}</div><div class="trend-p">before: ${fmt(prev)}</div></div>`;
}
function trendsHTML(){
  const t=todayISO(); const ws=weekStartOf(t);
  const elapsed=Math.round((parseISO(t)-parseISO(ws))/86400000);
  const lws=addDays(ws,-7), lwe=addDays(lws,elapsed);
  const d=parseISO(t);
  const lms=isoLocal(new Date(d.getFullYear(),d.getMonth()-1,1));
  const dim=new Date(d.getFullYear(),d.getMonth(),0).getDate();
  const lme=addDays(lms, Math.min(d.getDate(),dim)-1);
  return `<div class="card"><div class="card-title">${icon('trend',16)} Growth check</div>
    ${trendRow('This week vs last week','Monday to today, same days compared',revenueOn(ws,t),revenueOn(lws,lwe))}
    ${trendRow('This month vs last month','1st to today, same days compared',revenueOn(monthStartOf(t),t),revenueOn(lms,lme))}
  </div>`;
}
function pageDashboard(){
  const t = todayISO();
  const todaySales = salesBetween(t,t);
  const todayExp = expensesBetween(t,t);
  const revenue = sum(todaySales,'amount');
  const exp = sum(todayExp,'amount');
  const profit = revenue - exp;
  const activeStations = stations.filter(s=>s.status==='active').length;
  const owing = openDebts();
  const tsOf = x => x.ts || parseISO(x.date).getTime();
  const recent = [...sales].sort((a,b)=> tsOf(b)-tsOf(a)).slice(0,8);
  const usage = serviceUsage();
  const ranked = rankedServices().slice(0,8);

  // top services, last 30 days
  const from30 = addDays(t,-29);
  const by = {};
  salesBetween(from30,t).forEach(x=>{ by[x.service]=(by[x.service]||0)+Number(x.amount); });
  const top = Object.entries(by).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const topMax = Math.max(1,...top.map(e=>e[1]));

  // busy hours, last 30 days
  const hrs = {};
  allSalesBetween(from30,t).forEach(x=>{ const h=hourOf(x); if(h!=null) hrs[h]=(hrs[h]||0)+1; });
  const hours=[]; for(let h=6;h<=22;h++) hours.push(h);
  const maxH = Math.max(0,...hours.map(h=>hrs[h]||0));
  const peakH = maxH>0 ? hours.find(h=>(hrs[h]||0)===maxH) : null;
  const hl = h => (h%12||12)+(h<12?'a':'p');
  const hFull = h => (h%12||12)+(h<12?' AM':' PM');

  return `
  <div class="hello">
    <div><div class="hello-t">Hello, ${esc(currentStaff?currentStaff.name:'')} 👋</div><div class="hello-s">${new Date().toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</div></div>
    <div class="btn-row"><button class="btn btn-cyan" onclick="go('pos')">${icon('plus',16)} New sale</button><button class="btn" onclick="copyDailySummary()">${icon('copy',16)} Copy daily summary</button></div>
  </div>

  <div class="grid grid-4">
    ${statCard('accent-cyan','trend',"Today's Revenue",fmt(revenue),`${todaySales.length} payment${todaySales.length===1?'':'s'} received`)}
    ${statCard('accent-red','wallet',"Today's Expenses",fmt(exp),`${todayExp.length} entr${todayExp.length===1?'y':'ies'}`)}
    ${statCard('accent-green','coins','Net Profit Today',fmt(profit),'Revenue minus expenses',`color:${profit>=0?'#1B8A5A':'#B23336'}`)}
    ${statCard('accent-amber','monitor','Active Stations',`${activeStations}<span class="of"> / ${stations.length}</span>`, owing.length ? `<span class="lowstock">${fmt(sum(owing,'balance'))} owed by customers</span>` : (lowStockCount()>0 ? `<span class="lowstock">${lowStockCount()} item(s) low on stock</span>` : 'All clear'))}
  </div>

  ${isAdmin() ? `<div class="section-title">Growth</div>${trendsHTML()}` : ''}

  <div class="section-title">Quick Sale <span class="hint">Your most-used services come first</span></div>
  <div class="card">
    <div class="quickgrid">
      ${ranked.map(sv=>`
        <button class="quickbtn" onclick="quickSale('${sv.id}')">
          <div class="qn">${(usage[sv.name]||0)>=3?'<span class="qstar">'+icon('star',13)+'</span>':''}${esc(sv.name)}</div>
          <div class="qp">${sv.price? fmt(sv.price)+' / '+esc(sv.unit) : 'set price'}</div>
        </button>`).join('')}
    </div>
  </div>

  <div class="section-title">Insights <span class="hint">Last 30 days</span></div>
  <div class="grid grid-2">
    <div class="card"><div class="card-title">${icon('star',16)} Top services</div>
      ${top.length ? top.map(([n,a])=>`<div class="barwrap"><div class="barlabel">${esc(n)}</div><div class="bartrack"><div class="barfill" style="width:${a/topMax*100}%"></div></div><div class="barval">${fmt(a)}</div></div>`).join('') : '<div class="muted">Sales will show up here.</div>'}
    </div>
    <div class="card"><div class="card-title">${icon('clock',16)} Busy hours ${peakH!=null?`<span class="peak-note">Busiest around ${hFull(peakH)}</span>`:''}</div>
      <div class="hours">${hours.map(h=>{const c=hrs[h]||0; return `<div class="hbar ${c&&c===maxH?'peak':''}" title="${hFull(h)}: ${c} sale${c===1?'':'s'}"><div class="hfill" style="height:${maxH?Math.max(c/maxH*100,c?6:0):0}%"></div><span>${hl(h)}</span></div>`;}).join('')}</div>
    </div>
  </div>

  <div class="section-title">Recent Transactions <span class="hint">Last 8 entries</span></div>
  <div class="card table-wrap">
    <table>
      <thead><tr><th>When</th><th>Service</th><th>Customer</th><th>Pay</th><th style="text-align:right;">Amount</th></tr></thead>
      <tbody>
        ${recent.length? recent.map(x=>`
          <tr>
            <td class="muted">${x.date===t? esc(x.time) : esc(x.date)+' '+esc(x.time)}</td>
            <td>${esc(x.service)}${x.qty>1?` ×${esc(x.qty)}`:''}</td>
            <td class="muted">${esc(x.customer||'—')}</td>
            <td>${payTag(x)}</td>
            <td style="text-align:right;" class="amt ${outstandingOf(x)>0?'owing':'pos'}">${fmt(x.amount)}</td>
          </tr>`).join('') : `<tr class="empty-row"><td colspan="5">No sales recorded yet. Start with New Sale or Quick Sale above.</td></tr>`}
      </tbody>
    </table>
  </div>`;
}
function payTag(x){
  if(isCredit(x)){
    if(x.writtenOff) return '<span class="tag tag-wo">written off</span>';
    const p=paidOf(x);
    if(p>=Number(x.amount)) return '<span class="tag tag-paidlater">paid later</span>';
    if(p>0) return '<span class="tag tag-part">part paid</span>';
    return '<span class="tag tag-credit">owing</span>';
  }
  return `<span class="tag tag-${esc(x.payment)}">${esc(x.payment)}</span>`;
}
function payOptions(sel){
  return [['cash','Cash'],['transfer','Transfer'],['pos','POS'],['credit','Owing (pay later)']]
    .map(([v,l])=>`<option value="${v}" ${v===sel?'selected':''}>${l}</option>`).join('');
}
function copyDailySummary(){
  const t=todayISO(); const ts=salesBetween(t,t); const ex=expensesBetween(t,t);
  const rev=sum(ts,'amount'), exp=sum(ex,'amount');
  const pay={}; ts.forEach(x=>{ const m = x.payment==='credit' ? (x.paidMethod||'cash') : x.payment; pay[m]=(pay[m]||0)+Number(x.amount); });
  const bySvc={}; ts.forEach(x=>{ bySvc[x.service]=(bySvc[x.service]||0)+Number(x.amount); });
  const top=Object.entries(bySvc).sort((a,b)=>b[1]-a[1]).slice(0,3);
  const owed=sum(openDebts(),'balance');
  const lines=[
    `*${settings.shopName}* — daily summary`,
    new Date().toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'long',year:'numeric'}),
    '',
    `Revenue: ${fmt(rev)} (${ts.length} payments)`,
    `Expenses: ${fmt(exp)}`,
    `Profit: ${fmt(rev-exp)}`,
    ''
  ];
  if(Object.keys(pay).length) lines.push('Received by: '+Object.entries(pay).map(([k,v])=>`${k} ${fmt(v)}`).join(', '));
  if(top.length) lines.push('Top today: '+top.map(([n,a])=>`${n} ${fmt(a)}`).join(', '));
  if(owed>0) lines.push(`Customers owing: ${fmt(owed)}`);
  if(lowStockCount()>0) lines.push(`Low stock items: ${lowStockCount()}`);
  const text=lines.join('\n');
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(()=>toast('Summary copied — paste it into WhatsApp')).catch(()=>prompt('Copy this summary:',text));
  } else prompt('Copy this summary:',text);
}

function quickSale(serviceId){
  const svc = services.find(x=>x.id===serviceId);
  if(!svc) return;
  openModal(`
    <h2>${esc(svc.name)}</h2>
    <div class="sub">Quick record at ${fmt(svc.price)} / ${esc(svc.unit)}</div>
    <div class="field"><label>Quantity (${esc(svc.unit)}s)</label><input type="number" id="qsQty" value="1" min="0" step="any"></div>
    <div class="field"><label>Amount ${svc.price?'':'<span class="lab-hint">(enter it)</span>'}</label><input type="number" id="qsAmount" value="${svc.price||''}" min="0" step="any"></div>
    <div class="field"><label>Customer name <span class="lab-hint">(required if owing)</span></label><input type="text" id="qsCustomer" placeholder="Walk-in"></div>
    <div class="field"><label>Payment method</label><select id="qsPay">${payOptions('cash')}</select></div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn btn-cyan btn-block" onclick="confirmQuickSale('${svc.id}')">Record Sale</button>
    </div>
  `);
  const q=document.getElementById('qsQty'), a=document.getElementById('qsAmount');
  if(svc.price) q.addEventListener('input',()=>{ a.value = Math.round((Number(q.value)||0)*svc.price*100)/100; });
}
function confirmQuickSale(serviceId){
  const svc = services.find(x=>x.id===serviceId);
  const qty = Number(document.getElementById('qsQty').value)||0;
  const amount = Number(document.getElementById('qsAmount').value)||0;
  const customer = document.getElementById('qsCustomer').value.trim();
  const payment = document.getElementById('qsPay').value;
  if(qty<=0 || amount<=0){ toast('Enter quantity and amount'); return; }
  if(payment==='credit' && !customer){ toast("Enter the customer's name for an owing sale"); return; }
  addSale({serviceId:svc.id, service:svc.name, qty, unitPrice: qty? amount/qty : 0, amount, customer, payment});
  closeModal();
  toast('Sale recorded: '+fmt(amount));
  renderPage();
}

/* ================= NEW SALE (POS) ================= */
let posSel = localStorage.getItem('hs_posSel') || null;
let posCart = [];
let posForm = {qty:1, price:0, amount:0, customer:'', payment:'cash', note:'', phone:'', dcat:'', due:'', deposit:'', depMethod:'cash'};
let posHi = -1, posList = [];

function pagePOS(){
  return `
  <div class="pos-grid">
    <div class="card pos-card">
      <label>Service <span class="lab-hint">— type to search, or tap the box to browse</span></label>
      <div class="combo" id="svcCombo">
        <span class="combo-ic">${icon('search',17)}</span>
        <input type="text" id="posSearch" autocomplete="off" spellcheck="false" placeholder="Type a service e.g. print, scan, CV, lamination…">
        <button type="button" class="combo-toggle" id="posToggle" tabindex="-1" aria-label="Show all services">▾</button>
        <div class="combo-list" id="posSuggest"></div>
      </div>
      <div id="posChosen" class="chosen"></div>
      <div class="row3">
        <div class="field"><label>Quantity</label><input type="number" id="posQty" min="0" step="any"></div>
        <div class="field"><label>Unit price</label><input type="number" id="posPrice" min="0" step="any"></div>
        <div class="field"><label>Amount</label><input type="number" id="posAmount" min="0" step="any"></div>
      </div>
      <button class="btn btn-primary btn-block" id="posAddBtn">${icon('plus',16)} Add to this sale</button>
      <div class="cart" id="posCartBox"></div>
      <div class="row">
        <div class="field"><label>Customer name <span class="lab-hint">(required if owing)</span></label><input type="text" id="posCustomer" placeholder="Walk-in"></div>
        <div class="field"><label>Payment</label><select id="posPayment">${payOptions('cash')}</select></div>
      </div>
      <div class="credit-box" id="posCreditBox" style="display:none;">
        <div class="cb-title">${icon('clock',15)} Owing details</div>
        <div class="row">
          <div class="field"><label>Customer phone <span class="lab-hint">(optional)</span></label><input type="tel" id="posPhone" placeholder="0803…"></div>
          <div class="field"><label>Category</label><select id="posDcat"><option value="">Auto (from the service)</option>${DEBT_CATEGORIES.map(c=>`<option>${c}</option>`).join('')}</select></div>
        </div>
        <div class="row3">
          <div class="field"><label>Pay-by date</label><input type="date" id="posDue"></div>
          <div class="field"><label>Paid now (deposit)</label><input type="number" id="posDeposit" min="0" step="any" placeholder="0"></div>
          <div class="field"><label>Deposit via</label><select id="posDepMethod"><option value="cash">Cash</option><option value="transfer">Transfer</option><option value="pos">POS</option></select></div>
        </div>
      </div>
      <div class="field"><label>Note (optional)</label><input type="text" id="posNote" placeholder="e.g. 2-page CV, blue folder"></div>
      <div class="btn-row"><button class="btn btn-primary" id="posSaveBtn">Save sale</button><button class="btn btn-cyan" id="posSavePrintBtn">${icon('print',16)} Save &amp; print receipt</button></div>
    </div>
    <div class="card"><div class="card-title">${icon('list',16)} Today so far</div><div id="posTodayList"></div></div>
  </div>`;
}
function posMatches(q){
  q=(q||'').trim().toLowerCase();
  const ranked=rankedServices();
  if(!q) return ranked;
  const toks=q.split(/\s+/);
  return ranked.filter(sv=>{ const hay=(sv.name+' '+(sv.category||'')+' '+sv.unit).toLowerCase(); return toks.every(t=>hay.includes(t)); })
    .sort((a,b)=>(b.name.toLowerCase().startsWith(q)?1:0)-(a.name.toLowerCase().startsWith(q)?1:0));
}
function posShowList(q){
  const box=document.getElementById('posSuggest'); if(!box) return;
  posList=posMatches(q); posHi = posList.length ? 0 : -1;
  const usage=serviceUsage();
  box.innerHTML = posList.length ? posList.map((sv,i)=>`
    <div class="combo-item ${i===posHi?'hi':''} ${sv.id===posSel?'cur':''}" data-i="${i}" onmousedown="event.preventDefault();posPick('${sv.id}')">
      <span class="ci-name">${(usage[sv.name]||0)>=3?'<span class="qstar">'+icon('star',12)+'</span>':''}${esc(sv.name)}</span>
      <span class="ci-price">${sv.price?fmt(sv.price)+' / '+esc(sv.unit):'enter price'}</span>
    </div>`).join('') : '<div class="combo-none">No service matches — add it under Services &amp; Pricing</div>';
  box.classList.add('open');
}
function posHideList(){ const b=document.getElementById('posSuggest'); if(b) b.classList.remove('open'); }
function posMoveHi(d){
  if(!posList.length) return;
  posHi=(posHi+d+posList.length)%posList.length;
  document.querySelectorAll('#posSuggest .combo-item').forEach((el,i)=>{ el.classList.toggle('hi',i===posHi); if(i===posHi) el.scrollIntoView({block:'nearest'}); });
}
function posPick(id){
  const sv=services.find(x=>x.id===id); if(!sv) return;
  posSel=id; localStorage.setItem('hs_posSel',id);
  posForm.qty=1; posForm.price=sv.price; posForm.amount=sv.price;
  const $=x=>document.getElementById(x);
  $('posSearch').value=sv.name; $('posQty').value=1; $('posPrice').value=sv.price; $('posAmount').value=sv.price;
  posHideList(); posRefreshChosen();
  const q=$('posQty'); q.focus(); q.select();
}
function posRefreshChosen(){
  const el=document.getElementById('posChosen'); if(!el) return;
  const sv=services.find(x=>x.id===posSel);
  el.innerHTML = sv ? `<span class="chip-sel">${icon('check',14)} <b>${esc(sv.name)}</b> · ${sv.price?fmt(sv.price)+' / '+esc(sv.unit):'price not set'}</span>` : '<span class="chip-none">No service picked yet — start typing above</span>';
}
function posRecalc(){
  const q=Number(posForm.qty)||0, p=Number(posForm.price)||0;
  posForm.amount = Math.round(q*p*100)/100;
  const a=document.getElementById('posAmount'); if(a) a.value=posForm.amount;
}
function posAddLine(){
  const sv=services.find(x=>x.id===posSel);
  if(!sv){ toast('Pick a service first'); const s=document.getElementById('posSearch'); if(s) s.focus(); return false; }
  const qty=Number(posForm.qty)||0, price=Number(posForm.price)||0, amount=Number(posForm.amount)||0;
  if(qty<=0){ toast('Enter a quantity'); return false; }
  if(amount<=0){ toast('Enter an amount'); return false; }
  posCart.push({serviceId:sv.id, name:sv.name, unit:sv.unit, qty, unitPrice:price, amount});
  posForm.qty=1; posForm.amount=price;
  const $=x=>document.getElementById(x);
  $('posQty').value=1; $('posAmount').value=price;
  renderCart();
  const s=$('posSearch'); s.focus(); s.select();
  return true;
}
function posRemoveLine(i){ posCart.splice(i,1); renderCart(); }
function renderCart(){
  const el=document.getElementById('posCartBox'); if(!el) return;
  if(!posCart.length){ el.innerHTML=''; return; }
  el.innerHTML = `<div class="cart-head">${icon('cart',15)} This customer's items</div>`+
    posCart.map((l,i)=>`<div class="cart-line"><div class="cl-n">${esc(l.name)}<small>${esc(l.qty)} × ${fmt(l.unitPrice)}</small></div><div class="cl-a">${fmt(l.amount)}</div><button class="icon-btn" title="Remove" onclick="posRemoveLine(${i})">${icon('x',14)}</button></div>`).join('')+
    `<div class="cart-total"><span>Total</span><b>${fmt(sum(posCart,'amount'))}</b></div>`;
}
function initPOSForm(){
  const $=id=>document.getElementById(id);
  if(!services.find(x=>x.id===posSel)) posSel=null;
  const sv=services.find(x=>x.id===posSel);
  const search=$('posSearch');
  search.value = sv ? sv.name : '';
  $('posQty').value=posForm.qty; $('posPrice').value=posForm.price; $('posAmount').value=posForm.amount;
  $('posCustomer').value=posForm.customer; $('posPayment').value=posForm.payment; $('posNote').value=posForm.note;
  posRefreshChosen(); renderCart(); renderPosTodayList();

  search.addEventListener('focus',()=>{ search.select(); posShowList(''); });
  search.addEventListener('input',()=>posShowList(search.value));
  search.addEventListener('blur',()=>setTimeout(posHideList,120));
  search.addEventListener('keydown',e=>{
    if(e.key==='ArrowDown'){ e.preventDefault(); if(!$('posSuggest').classList.contains('open')) posShowList(search.value); else posMoveHi(1); }
    else if(e.key==='ArrowUp'){ e.preventDefault(); posMoveHi(-1); }
    else if(e.key==='Enter'){ e.preventDefault(); const sv=posList[posHi>=0?posHi:0]; if($('posSuggest').classList.contains('open') && sv) posPick(sv.id); }
    else if(e.key==='Escape'){ posHideList(); }
  });
  $('posToggle').addEventListener('mousedown',e=>{ e.preventDefault(); if($('posSuggest').classList.contains('open')) posHideList(); else { search.focus(); posShowList(''); } });

  $('posQty').addEventListener('input',e=>{ posForm.qty=e.target.value; posRecalc(); });
  $('posPrice').addEventListener('input',e=>{ posForm.price=e.target.value; posRecalc(); });
  $('posAmount').addEventListener('input',e=>{ posForm.amount=e.target.value; });
  [$('posQty'),$('posPrice'),$('posAmount')].forEach(el=>el.addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); posAddLine(); } }));
  $('posCustomer').addEventListener('input',e=>{ posForm.customer=e.target.value; });
  $('posPayment').addEventListener('change',e=>{ posForm.payment=e.target.value; posToggleCredit(); });
  [['posPhone','phone'],['posDcat','dcat'],['posDue','due'],['posDeposit','deposit'],['posDepMethod','depMethod']].forEach(([id,k])=>{
    const el=$(id); el.value=posForm[k]; el.addEventListener(id==='posDcat'||id==='posDepMethod'?'change':'input',e=>{ posForm[k]=e.target.value; });
  });
  posToggleCredit();
  $('posNote').addEventListener('input',e=>{ posForm.note=e.target.value; });
  $('posAddBtn').addEventListener('click',posAddLine);
  $('posSaveBtn').addEventListener('click',()=>posSave(false));
  $('posSavePrintBtn').addEventListener('click',()=>posSave(true));
}

function renderPosTodayList(){
  const t=todayISO();
  const tsOf = x => x.ts || 0;
  const list = allSalesBetween(t,t).slice().sort((a,b)=>tsOf(b)-tsOf(a));
  const el=document.getElementById('posTodayList'); if(!el) return;
  el.innerHTML = list.length ? `
    <table><thead><tr><th>Time</th><th>Service</th><th style="text-align:right;">Amt</th></tr></thead>
    <tbody>${list.map(x=>`<tr><td class="muted">${esc(x.time)}</td><td>${esc(x.service)}${x.qty>1?' ×'+esc(x.qty):''} ${isCredit(x)?payTag(x):''}</td><td style="text-align:right;" class="amt ${outstandingOf(x)>0?'owing':'pos'}">${fmt(x.amount)}</td></tr>`).join('')}</tbody></table>
    <div class="today-total">Received today: ${fmt(sum(salesBetween(t,t),'amount'))}</div>
  ` : `<div class="muted" style="font-size:13px;">No sales yet today.</div>`;
}
function posToggleCredit(){ const b=document.getElementById('posCreditBox'); if(b) b.style.display = posForm.payment==='credit' ? 'block' : 'none'; }
function posSave(print){
  if(!posCart.length){ if(!posAddLine()) return; }
  const customer=(posForm.customer||'').trim(), payment=posForm.payment, note=(posForm.note||'').trim();
  if(payment==='credit' && !customer){ toast("Enter the customer's name for an owing sale"); const c=document.getElementById('posCustomer'); if(c) c.focus(); return; }
  const totalDue=sum(posCart,'amount');
  let deposit=Number(posForm.deposit)||0;
  if(deposit<0) deposit=0;
  if(payment==='credit' && deposit>totalDue){ toast('Deposit is more than the total'); return; }
  const receipt='R'+uid().slice(-6).toUpperCase();
  const dcat = posForm.dcat || (payment==='credit' ? guessDebtCategory({service:posCart[0].name}) : '');
  let remaining=deposit;
  const recs=posCart.map(l=>{
    let dep=0; if(payment==='credit' && remaining>0){ dep=Math.min(remaining,l.amount); remaining-=dep; }
    return addSale({serviceId:l.serviceId, service:l.name, qty:l.qty, unitPrice:l.unitPrice, amount:l.amount, customer, payment, note, receipt,
      phone:posForm.phone, debtCategory:dcat, dueDate:posForm.due, deposit:dep, depositMethod:posForm.depMethod});
  });
  const total=sum(recs,'amount');
  posCart=[]; posForm.customer=''; posForm.note=''; posForm.payment='cash'; posForm.phone=''; posForm.dcat=''; posForm.due=''; posForm.deposit=''; posForm.depMethod='cash';
  const $=x=>document.getElementById(x);
  ['posCustomer','posNote','posPhone','posDue','posDeposit'].forEach(i=>{ if($(i)) $(i).value=''; });
  $('posPayment').value='cash'; $('posDcat').value=''; $('posDepMethod').value='cash'; posToggleCredit();
  renderCart(); renderPosTodayList();
  toast(payment==='credit' ? `Owing sale saved: ${fmt(total)}${deposit>0?' · '+fmt(deposit)+' paid now':''}` : 'Sale saved: '+fmt(total));
  if(print) printReceipt(recs);
}
function addSale(data){
  const now=new Date();
  const rec = {
    id: uid(), ts: now.getTime(), date: todayISO(), time: nowTime(), hour: now.getHours(),
    service: data.service, qty: data.qty||1, unitPrice: data.unitPrice||0,
    amount: data.amount||0, customer: data.customer||'', payment: data.payment||'cash',
    note: data.note||'', station: data.station||'',
    staff: currentStaff ? currentStaff.name : '',
    receipt: data.receipt || ('R'+uid().slice(-6).toUpperCase())
  };
  if(rec.payment==='credit'){
    rec.payments=[]; rec.phone=data.phone||''; rec.debtCategory=data.debtCategory||''; rec.dueDate=data.dueDate||'';
    if(Number(data.deposit)>0) rec.payments.push({id:uid(), date:todayISO(), amount:Math.min(Number(data.deposit),Number(rec.amount)), method:data.depositMethod||'cash', by:rec.staff, ts:rec.ts, note:'Paid at time of sale'});
  }
  const svc = data.serviceId ? services.find(x=>x.id===data.serviceId) : null;
  if(svc && svc.stockItemId && Number(svc.stockPer)>0){
    const item = inventory.find(i=>i.id===svc.stockItemId);
    if(item){
      const used = Math.round(Number(rec.qty)*Number(svc.stockPer)*1000)/1000;
      item.qty = Math.round((Number(item.qty)-used)*1000)/1000;
      rec.stock = {itemId:item.id, qty:used};
      saveData('inventory', inventory); cloudSet('inventory', item);
      if(Number(item.qty)<=Number(item.reorder)) setTimeout(()=>toast(item.name+' is running low'),2300);
    }
  }
  sales.push(rec);
  saveData('sales', sales);
  cloudSet('sales', rec);
  renderNav();
  return rec;
}

/* ================= COMPUTER STATIONS ================= */
function pageStations(){
  return `
  <div class="card" style="margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;">
    <div>
      <div style="font-weight:800;font-size:14px;">${stations.length} Stations Configured</div>
      <div class="muted" style="font-size:12.5px;">Start a session when a customer sits down. Stop it to auto-record the sale.</div>
    </div>
    <button class="btn btn-sm" onclick="openStationConfig()">Manage Stations</button>
  </div>
  <div class="station-grid" id="stationGrid"></div>
  `;
}
function renderStationGrid(){
  const el = document.getElementById('stationGrid');
  if(!el) return;
  el.innerHTML = stations.map(st=>{
    const active = st.status==='active';
    let elapsedStr = '00:00:00';
    if(active){
      const ms = Date.now()-st.startTime;
      elapsedStr = msToHMS(ms);
    }
    return `
    <div class="station ${active?'active':''}">
      <div class="station-head">
        <div class="station-name">${st.name}</div>
        <div class="st-dot"></div>
      </div>
      <div class="station-timer" data-station="${st.id}">${elapsedStr}</div>
      <div class="station-rate">${fmt(st.rate)}/hour</div>
      ${active
        ? `<button class="btn btn-danger btn-sm btn-block" onclick="stopStation('${st.id}')">Stop & Charge</button>`
        : `<button class="btn btn-cyan btn-sm btn-block" onclick="startStation('${st.id}')">Start Session</button>`
      }
    </div>`;
  }).join('');
}
function msToHMS(ms){
  const s = Math.max(0,Math.floor(ms/1000));
  const h = String(Math.floor(s/3600)).padStart(2,'0');
  const m = String(Math.floor((s%3600)/60)).padStart(2,'0');
  const sec = String(s%60).padStart(2,'0');
  return `${h}:${m}:${sec}`;
}
function startStation(id){
  const st = stations.find(s=>s.id===id);
  st.status='active'; st.startTime=Date.now();
  saveData('stations', stations);
  cloudSet('stations', st);
  renderStationGrid();
  toast(st.name+" session started");
}
function stopStation(id){
  const st = stations.find(x=>x.id===id);
  const ms = Date.now()-st.startTime;
  const hours = ms/3600000;
  const amount = Math.max(0, Math.round(st.rate*hours));
  openModal(`
    <h2>Stop ${esc(st.name)}</h2>
    <div class="sub">Session duration: ${msToHMS(ms)}</div>
    <div class="field"><label>Amount to charge</label><input type="number" id="stAmount" value="${amount}"></div>
    <div class="field"><label>Customer name <span class="lab-hint">(required if owing)</span></label><input type="text" id="stCustomer" placeholder="Walk-in"></div>
    <div class="field"><label>Payment method</label><select id="stPayment">${payOptions('cash')}</select></div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn btn-cyan btn-block" onclick="confirmStopStation('${id}', ${ms})">Charge &amp; Free Station</button>
    </div>
  `);
}
function confirmStopStation(id, ms){
  const st = stations.find(x=>x.id===id);
  const amount = Number(document.getElementById('stAmount').value)||0;
  const customer = document.getElementById('stCustomer').value.trim();
  const payment = document.getElementById('stPayment').value;
  if(payment==='credit' && !customer){ toast("Enter the customer's name for an owing sale"); return; }
  addSale({service:'Browsing — '+st.name, qty: (ms/3600000).toFixed(2), unitPrice: st.rate, amount, customer, payment, station: st.id});
  st.status='idle'; st.startTime=null;
  saveData('stations', stations);
  cloudSet('stations', st);
  closeModal();
  toast(st.name+" freed — "+fmt(amount)+" recorded");
  renderStationGrid();
}
function openStationConfig(){
  openModal(`
    <h2>Manage Stations</h2>
    <div class="sub">Add, rename, or remove computer stations and set hourly rates.</div>
    <div id="stConfigList" style="max-height:280px;overflow-y:auto;margin-bottom:12px;"></div>
    <div class="row">
      <input type="text" id="newStName" placeholder="Station name e.g. PC 9">
      <input type="number" id="newStRate" placeholder="Rate/hr" value="150" style="max-width:110px;">
    </div>
    <button class="btn btn-cyan btn-block" style="margin-top:10px;" onclick="addStation()">Add Station</button>
    <div class="modal-actions"><button class="btn btn-ghost btn-block" onclick="closeModal()">Done</button></div>
  `);
  renderStConfigList();
}
function renderStConfigList(){
  const el = document.getElementById('stConfigList');
  el.innerHTML = stations.map(st=>`
    <div style="display:flex;gap:8px;align-items:center;padding:6px 0;border-bottom:1px solid var(--border);">
      <input type="text" value="${st.name}" style="flex:1;" onchange="renameStation('${st.id}', this.value)">
      <input type="number" value="${st.rate}" style="width:80px;" onchange="rerateStation('${st.id}', this.value)">
      <button class="btn btn-danger btn-sm" onclick="removeStation('${st.id}')">✕</button>
    </div>
  `).join('');
}
function addStation(){
  const name = document.getElementById('newStName').value.trim() || ('PC '+(stations.length+1));
  const rate = Number(document.getElementById('newStRate').value)||150;
  const newSt = {id:uid(), name, rate, status:'idle', startTime:null};
  stations.push(newSt);
  saveData('stations', stations);
  cloudSet('stations', newSt);
  renderStConfigList(); renderStationGrid(); renderNav();
}
function renameStation(id,val){ const st=stations.find(s=>s.id===id); st.name=val; saveData('stations',stations); cloudSet('stations', st); renderStationGrid(); }
function rerateStation(id,val){ const st=stations.find(s=>s.id===id); st.rate=Number(val)||0; saveData('stations',stations); cloudSet('stations', st); renderStationGrid(); }
function removeStation(id){
  if(!confirm('Remove this station?')) return;
  stations = stations.filter(s=>s.id!==id);
  saveData('stations', stations);
  cloudDelete('stations', id);
  renderStConfigList(); renderStationGrid();
}

/* live station timers */
setInterval(()=>{
  if(currentPage==='stations'){
    document.querySelectorAll('[data-station]').forEach(elm=>{
      const st = stations.find(s=>s.id===elm.dataset.station);
      if(st && st.status==='active') elm.textContent = msToHMS(Date.now()-st.startTime);
    });
  }
}, 1000);

/* ================= SALES LOG ================= */
let slState = {from:null,to:null,q:'',status:'all'};
function pageSales(){
  if(!slState.from){ slState.from=todayISO(); slState.to=todayISO(); }
  return `
  <div class="card filters">
    <div class="field"><label>From</label><input type="date" id="slFrom" value="${slState.from}"></div>
    <div class="field"><label>To</label><input type="date" id="slTo" value="${slState.to}"></div>
    <div class="field grow"><label>Search</label><input type="text" id="slSearch" value="${esc(slState.q)}" placeholder="service, customer, staff, note, receipt…"></div>
    <div class="field"><label>Show</label><select id="slStatus"><option value="all">All sales</option><option value="owing">Owing only</option><option value="paid">Paid only</option></select></div>
    <div class="field"><button class="btn btn-sm" onclick="slAll()">All time</button></div>
    <div class="field"><button class="btn btn-sm" onclick="exportSalesCSV()">Export CSV</button></div>
  </div>
  <div class="card table-wrap"><table id="salesLogTable"></table></div>`;
}

function slFiltered(){
  const q=slState.q.trim().toLowerCase();
  const tsOf=x=>x.ts||0;
  return allSalesBetween(slState.from,slState.to)
    .filter(x=> slState.status==='all' || (slState.status==='owing' ? outstandingOf(x)>0 : !(outstandingOf(x)>0)))
    .filter(x=> !q || [x.service,x.customer,x.staff,x.note,x.receipt,x.payment].join(' ').toLowerCase().includes(q))
    .sort((a,b)=> tsOf(b)-tsOf(a) || (b.date+b.time<a.date+a.time?-1:1));
}


function slAll(){ slState.from='2000-01-01'; slState.to=todayISO(); document.getElementById('slFrom').value=slState.from; document.getElementById('slTo').value=slState.to; filterSalesLog(); }
function filterSalesLog(){
  const $=id=>document.getElementById(id);
  if($('slFrom')){ slState.from=$('slFrom').value||slState.from; slState.to=$('slTo').value||slState.to; slState.q=$('slSearch').value; slState.status=$('slStatus').value; }
  const rows=slFiltered();
  const received=sum(rows.map(x=>({v:receivedOf(x)})),'v');
  const owingAmt=sum(rows.map(x=>({v:outstandingOf(x)})),'v');
  const el=$('salesLogTable'); if(!el) return;
  el.innerHTML = `
    <thead><tr><th>Date</th><th>Time</th><th>Service</th><th>Customer</th><th>Staff</th><th>Pay</th><th style="text-align:right;">Amount</th><th></th></tr></thead>
    <tbody>
    ${rows.length? rows.map(x=>`
      <tr>
        <td>${esc(x.date)}</td><td class="muted">${esc(x.time)}</td>
        <td>${esc(x.service)}${x.qty && x.qty!=1 ? ` ×${esc(x.qty)}`:''}<div class="muted sub-line">${x.receipt?'#'+esc(x.receipt):''}${x.note?' · '+esc(x.note):''}</div></td>
        <td>${esc(x.customer||'—')}</td>
        <td class="muted">${esc(x.staff||'—')}</td>
        <td>${payTag(x)}</td>
        <td style="text-align:right;" class="amt ${outstandingOf(x)>0?'owing':'pos'}">${fmt(x.amount)}</td>
        <td class="actions">${isAdmin() ? `<button class="icon-btn" title="Edit" onclick="editSale('${x.id}')">${icon('edit',15)}</button><button class="icon-btn danger" title="Delete" onclick="deleteSale('${x.id}')">${icon('trash',15)}</button>` : ''}</td>
      </tr>`).join('') : `<tr class="empty-row"><td colspan="8">No sales match.</td></tr>`}
    </tbody>
    <tfoot><tr><td colspan="6" style="text-align:right;font-weight:800;">Received ${owingAmt>0?`<span class="muted" style="font-weight:600;"> · still owing ${fmt(owingAmt)}</span>`:''}</td><td style="text-align:right;font-weight:800;" class="amt pos">${fmt(received)}</td><td></td></tr></tfoot>`;
  ['slFrom','slTo','slSearch','slStatus'].forEach(id=>{ const e=$(id); if(e && !e._b){ e._b=1; e.addEventListener(id==='slSearch'?'input':'change',filterSalesLog); } });
  if($('slStatus')) $('slStatus').value=slState.status;
}
function restoreStockFor(rec){
  if(rec.stock){
    const item=inventory.find(i=>i.id===rec.stock.itemId);
    if(item){ item.qty=Math.round((Number(item.qty)+Number(rec.stock.qty))*1000)/1000; saveData('inventory',inventory); cloudSet('inventory',item); }
  }
}
function editSale(id){
  const x=sales.find(r=>r.id===id); if(!x) return;
  openModal(`
    <h2>Edit sale</h2><div class="sub">#${esc(x.receipt||'')} · ${esc(x.date)} ${esc(x.time)} · by ${esc(x.staff||'—')}</div>
    <div class="field"><label>Service</label><input type="text" id="esService" value="${esc(x.service)}"></div>
    <div class="row3">
      <div class="field"><label>Qty</label><input type="number" id="esQty" value="${esc(x.qty)}" step="any"></div>
      <div class="field"><label>Unit price</label><input type="number" id="esPrice" value="${esc(x.unitPrice)}" step="any"></div>
      <div class="field"><label>Amount</label><input type="number" id="esAmount" value="${esc(x.amount)}" step="any"></div>
    </div>
    <div class="field"><label>Customer</label><input type="text" id="esCustomer" value="${esc(x.customer)}"></div>
    <div class="field"><label>Payment</label><select id="esPay">${payOptions(x.payment)}</select></div>
    <div class="field"><label>Note</label><input type="text" id="esNote" value="${esc(x.note)}"></div>
    <div class="modal-actions"><button class="btn btn-ghost" onclick="closeModal()">Cancel</button><button class="btn btn-cyan btn-block" onclick="saveSaleEdit('${id}')">Save changes</button></div>
  `);
}
function saveSaleEdit(id){
  const x=sales.find(r=>r.id===id); if(!x) return;
  const $=i=>document.getElementById(i);
  const newQty=Number($('esQty').value)||0, newAmt=Number($('esAmount').value)||0;
  const pay=$('esPay').value, cust=$('esCustomer').value.trim();
  if(newAmt<=0){ toast('Enter a valid amount'); return; }
  if(pay==='credit' && !cust){ toast("Owing sales need a customer name"); return; }
  if(x.stock && Number(x.qty)>0 && newQty!==Number(x.qty)){
    const item=inventory.find(i=>i.id===x.stock.itemId);
    const newUsed=Math.round(x.stock.qty*newQty/Number(x.qty)*1000)/1000;
    if(item){ item.qty=Math.round((Number(item.qty)+x.stock.qty-newUsed)*1000)/1000; saveData('inventory',inventory); cloudSet('inventory',item); }
    x.stock.qty=newUsed;
  }
  x.service=$('esService').value.trim()||x.service; x.qty=newQty||x.qty; x.unitPrice=Number($('esPrice').value)||0; x.amount=newAmt;
  x.customer=cust; x.note=$('esNote').value.trim();
  if(pay==='credit'){ if(x.payment!=='credit'){ x.payments=[]; x.phone=x.phone||''; x.debtCategory=''; x.dueDate=''; delete x.paid; } }
  else { delete x.paid; delete x.paidDate; delete x.paidMethod; delete x.paidBy; delete x.payments; delete x.phone; delete x.debtCategory; delete x.dueDate; delete x.writtenOff; }
  x.payment=pay;
  saveData('sales',sales); cloudSet('sales',x);
  closeModal(); toast('Sale updated'); renderPage();
}
function deleteSale(id){
  if(!confirm('Delete this sale record?')) return;
  const rec=sales.find(r=>r.id===id);
  if(rec) restoreStockFor(rec);
  sales = sales.filter(r=>r.id!==id);
  saveData('sales', sales);
  cloudDelete('sales', id);
  filterSalesLog(); renderNav();
  toast('Sale deleted');
}


function exportSalesCSV(){
  const rows=slFiltered().map(x=>({...x, received:receivedOf(x), balance:outstandingOf(x), status: isCredit(x) ? (x.writtenOff?'written off':(paidOf(x)>=Number(x.amount)?'paid later':(paidOf(x)>0?'part paid':'owing'))) : 'paid'}));
  downloadCSV(rows, ['date','time','receipt','service','qty','unitPrice','amount','received','balance','customer','staff','payment','status','note'], 'highspeed-sales-'+slState.from+'_to_'+slState.to+'.csv');
}
function downloadCSV(rows, cols, filename){
  const header = cols.join(',');
  const body = rows.map(r=>cols.map(c=>`"${String(r[c]??'').replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([header+'\n'+body], {type:'text/csv'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
}

document.addEventListener('DOMContentLoaded', ()=>{});

/* ================= CUSTOMER DEBTS ================= */




/* ================= CUSTOMER DEBTS (ledger) ================= */
let dbState = {q:'', status:'active', cat:'all'};
const DEBT_STATUS_LABEL = {unpaid:['owing','tag-credit'], part:['part paid','tag-part'], cleared:['cleared','tag-paidlater'], writtenoff:['written off','tag-wo']};
function debtKey(it){ return (it.customer||'unknown').trim().toLowerCase(); }
function debtSrc(kind,id){ return kind==='sale' ? sales.find(x=>x.id===id) : debts.find(x=>x.id===id); }
function debtSave(kind,src){ if(kind==='sale'){ saveData('sales',sales); cloudSet('sales',src); } else { saveData('debts',debts); cloudSet('debts',src); } }
function debtEnsurePayments(kind,src){
  if(kind==='sale' && !Array.isArray(src.payments)){
    src.payments = payListOf(src).map(p=>({...p}));
    delete src.paid; delete src.paidDate; delete src.paidMethod; delete src.paidBy;
  }
  if(kind==='manual' && !Array.isArray(src.payments)) src.payments=[];
}
function debtAddPayment(kind,id,amount,method,note){
  const src=debtSrc(kind,id); if(!src) return false;
  debtEnsurePayments(kind,src);
  src.payments.push({id:uid(), date:todayISO(), amount:Math.round(amount*100)/100, method, by:currentStaff?currentStaff.name:'', ts:Date.now(), note:note||''});
  debtSave(kind,src); return true;
}
function debtFiltered(){
  const q=dbState.q.trim().toLowerCase();
  return debtItems().filter(it=>{
    if(dbState.status==='active' && !(it.balance>0)) return false;
    if(dbState.status==='overdue' && !it.overdue) return false;
    if(dbState.status==='part' && it.status!=='part') return false;
    if(dbState.status==='cleared' && it.status!=='cleared') return false;
    if(dbState.status==='writtenoff' && it.status!=='writtenoff') return false;
    if(dbState.cat!=='all' && it.category!==dbState.cat) return false;
    if(q && ![it.customer,it.phone,it.desc,it.category,it.note,it.receipt,it.staff].join(' ').toLowerCase().includes(q)) return false;
    return true;
  });
}
function debtStatusTag(it){
  if(it.overdue) return '<span class="tag tag-overdue">overdue</span>';
  const [l,c]=DEBT_STATUS_LABEL[it.status]; return `<span class="tag ${c}">${l}</span>`;
}
function pageDebts(){
  const all=debtItems(), active=all.filter(i=>i.balance>0), over=active.filter(i=>i.overdue);
  const wk=weekStartOf(todayISO());
  const collectedWeek=sum(all.flatMap(i=>i.payments).filter(p=>p.date>=wk),'amount');
  const customers=new Set(active.map(debtKey)).size;
  return `
  <div class="grid grid-4">
    ${statCard('accent-amber','clock','Total still owed',fmt(sum(active,'balance')),`${customers} customer${customers===1?'':'s'} · ${active.length} item${active.length===1?'':'s'}`)}
    ${statCard('accent-red','wallet','Overdue',fmt(sum(over,'balance')),`${over.length} item${over.length===1?'':'s'} past the pay-by date`)}
    ${statCard('accent-green','check','Collected this week',fmt(collectedWeek),'Payments received since Monday')}
    ${statCard('accent-cyan','coins','Collected so far',fmt(sum(all,'paid')),'On all debts, all time')}
  </div>

  <div class="card filters" style="margin-top:16px;">
    <div class="field grow"><label>Search</label><input type="text" id="dbSearch" value="${esc(dbState.q)}" placeholder="name, phone, what for, note…"></div>
    <div class="field"><label>Show</label><select id="dbStatus">
      ${[['active','Still owing'],['overdue','Overdue'],['part','Part paid'],['cleared','Cleared'],['writtenoff','Written off'],['all','Everything']].map(([v,l])=>`<option value="${v}" ${dbState.status===v?'selected':''}>${l}</option>`).join('')}</select></div>
    <div class="field"><label>Category</label><select id="dbCat"><option value="all">All categories</option>${DEBT_CATEGORIES.map(c=>`<option ${dbState.cat===c?'selected':''}>${c}</option>`).join('')}</select></div>
    <div class="field"><button class="btn btn-cyan" onclick="addDebtModal()">${icon('plus',15)} Record a debt</button></div>
    <div class="field"><button class="btn btn-sm" onclick="exportDebtsCSV()">Export CSV</button></div>
  </div>
  <div id="debtList"></div>`;
}
function renderDebtList(){
  const el=document.getElementById('debtList'); if(!el) return;
  const items=debtFiltered();
  if(!items.length){ el.innerHTML='<div class="card empty-card">Nothing matches. When someone owes the shop, it shows up here. 🎉</div>'; return; }
  const groups={};
  items.forEach(it=>{ (groups[debtKey(it)]=groups[debtKey(it)]||{name:it.customer,phone:'',items:[]}).items.push(it); if(it.phone) groups[debtKey(it)].phone=it.phone; });
  const list=Object.entries(groups).sort((a,b)=>sum(b[1].items,'balance')-sum(a[1].items,'balance'));
  el.innerHTML=list.map(([key,g])=>{
    const total=sum(g.items,'total'), paid=sum(g.items,'paid'), bal=sum(g.items,'balance');
    const pctPaid=total>0?Math.min(100,Math.round(paid/total*100)):0;
    const anyOver=g.items.some(i=>i.overdue);
    const sorted=g.items.slice().sort((a,b)=>(a.date+String(a.ts)).localeCompare(b.date+String(b.ts)));
    return `
    <div class="card debt-card ${anyOver?'is-overdue':''}">
      <div class="debt-head">
        <div class="dh-main"><div class="debt-name">${esc(g.name)} ${g.phone?`<a class="dh-phone" href="tel:${esc(g.phone)}">${esc(g.phone)}</a>`:''}</div>
          <div class="muted">${g.items.length} item${g.items.length===1?'':'s'} · since ${esc(sorted[0].date)}</div></div>
        <div class="dh-fig"><small>Total</small><b>${fmt(total)}</b></div>
        <div class="dh-fig"><small>Paid</small><b class="pos">${fmt(paid)}</b></div>
        <div class="dh-fig"><small>Balance</small><b class="owing">${fmt(bal)}</b></div>
        <div class="btn-row">
          ${bal>0?`<button class="btn btn-cyan btn-sm" onclick="custPayModal('${encodeURIComponent(key)}')">Receive payment</button><button class="btn btn-sm" onclick="remindCustomer('${encodeURIComponent(key)}')">${icon('copy',13)} Reminder</button>`:''}
        </div>
      </div>
      <div class="dbar"><div class="dbar-fill" style="width:${pctPaid}%"></div></div>
      <div class="table-wrap"><table class="debt-table">
        <thead><tr><th>Date</th><th>What for</th><th>Pay by</th><th style="text-align:right;">Total</th><th style="text-align:right;">Paid</th><th style="text-align:right;">Balance</th><th>Status</th><th></th></tr></thead>
        <tbody>${sorted.map(it=>`
          <tr class="${it.overdue?'row-over':''}">
            <td>${esc(it.date)}</td>
            <td><b>${esc(it.desc)}</b><div class="sub-line"><span class="tag tag-cat">${esc(it.category)}</span>${it.kind==='manual'?' <span class="muted">manual entry</span>':''}${it.receipt?' <span class="muted">#'+esc(it.receipt)+'</span>':''}${it.note?' <span class="muted">· '+esc(it.note)+'</span>':''}</div></td>
            <td>${it.due?esc(it.due):'<span class="muted">—</span>'}</td>
            <td style="text-align:right;" class="amt">${fmt(it.total)}</td>
            <td style="text-align:right;" class="amt pos">${fmt(it.paid)}</td>
            <td style="text-align:right;" class="amt ${it.balance>0?'owing':''}">${fmt(it.balance)}</td>
            <td>${debtStatusTag(it)}</td>
            <td class="actions">
              ${it.balance>0?`<button class="btn btn-sm" onclick="debtPayModal('${it.kind}','${it.id}')">Pay</button>`:''}
              <button class="icon-btn" title="Payment history" onclick="debtHistoryModal('${it.kind}','${it.id}')">${icon('list',15)}</button>
              ${isAdmin()?`<button class="icon-btn" title="Edit" onclick="debtEditModal('${it.kind}','${it.id}')">${icon('edit',15)}</button>`:''}
            </td>
          </tr>`).join('')}</tbody></table></div>
    </div>`;
  }).join('');
}
function debtBind(){
  const $=id=>document.getElementById(id);
  const upd=()=>{ dbState.q=$('dbSearch').value; dbState.status=$('dbStatus').value; dbState.cat=$('dbCat').value; renderDebtList(); };
  ['dbSearch'].forEach(id=>$(id).addEventListener('input',upd));
  ['dbStatus','dbCat'].forEach(id=>$(id).addEventListener('change',upd));
  renderDebtList();
}
function debtMethodOptions(){ return '<option value="cash">Cash</option><option value="transfer">Transfer</option><option value="pos">POS</option>'; }
function debtPayModal(kind,id){
  const it=debtItems().find(i=>i.kind===kind && i.id===id); if(!it) return;
  openModal(`
    <h2>Receive payment</h2>
    <div class="sub">${esc(it.customer)} · ${esc(it.desc)}</div>
    <div class="cl-row"><span>Total</span><b>${fmt(it.total)}</b></div>
    <div class="cl-row"><span>Already paid</span><b>${fmt(it.paid)}</b></div>
    <div class="cl-row total"><span>Balance</span><b>${fmt(it.balance)}</b></div>
    <div class="row3" style="margin-top:14px;">
      <div class="field"><label>Amount received</label><input type="number" id="dpAmount" value="${it.balance}" min="0" step="any"></div>
      <div class="field"><label>Paid by</label><select id="dpMethod">${debtMethodOptions()}</select></div>
      <div class="field"><label>Note</label><input type="text" id="dpNote" placeholder="optional"></div>
    </div>
    <div class="modal-actions"><button class="btn btn-ghost" onclick="closeModal()">Cancel</button><button class="btn btn-cyan btn-block" onclick="confirmDebtPay('${kind}','${id}')">Save payment</button></div>`);
}
function confirmDebtPay(kind,id){
  const it=debtItems().find(i=>i.kind===kind && i.id===id); if(!it) return;
  const amt=Number(document.getElementById('dpAmount').value)||0;
  if(amt<=0){ toast('Enter the amount received'); return; }
  if(amt>it.balance+0.001){ toast('That is more than the balance ('+fmt(it.balance)+')'); return; }
  debtAddPayment(kind,id,amt,document.getElementById('dpMethod').value,document.getElementById('dpNote').value.trim());
  closeModal(); toast(amt>=it.balance-0.001?'Debt cleared 🎉':'Payment saved — balance '+fmt(it.balance-amt)); renderNav(); renderPage();
}
function custPayModal(keyEnc){
  const key=decodeURIComponent(keyEnc);
  const its=debtItems().filter(i=>debtKey(i)===key && i.balance>0); if(!its.length) return;
  const bal=sum(its,'balance');
  openModal(`
    <h2>Receive payment</h2>
    <div class="sub">${esc(its[0].customer)} · ${its.length} item${its.length===1?'':'s'} · balance <b>${fmt(bal)}</b></div>
    <div class="row3">
      <div class="field"><label>Amount received</label><input type="number" id="cpAmount" value="${bal}" min="0" step="any"></div>
      <div class="field"><label>Paid by</label><select id="cpMethod">${debtMethodOptions()}</select></div>
      <div class="field"><label>Note</label><input type="text" id="cpNote" placeholder="optional"></div>
    </div>
    <div class="muted" style="font-size:12px;">The payment clears the oldest items first.</div>
    <div class="modal-actions"><button class="btn btn-ghost" onclick="closeModal()">Cancel</button><button class="btn btn-cyan btn-block" onclick="confirmCustPay('${keyEnc}')">Save payment</button></div>`);
}
function confirmCustPay(keyEnc){
  const key=decodeURIComponent(keyEnc);
  const its=debtItems().filter(i=>debtKey(i)===key && i.balance>0).sort((a,b)=>(a.date+String(a.ts)).localeCompare(b.date+String(b.ts)));
  const bal=sum(its,'balance');
  let amt=Number(document.getElementById('cpAmount').value)||0;
  if(amt<=0){ toast('Enter the amount received'); return; }
  if(amt>bal+0.001){ toast('That is more than the total balance ('+fmt(bal)+')'); return; }
  const method=document.getElementById('cpMethod').value, note=document.getElementById('cpNote').value.trim();
  const left0=amt;
  for(const it of its){ if(amt<=0.0001) break; const pay=Math.min(amt,it.balance); debtAddPayment(it.kind,it.id,pay,method,note); amt-=pay; }
  closeModal(); toast(left0>=bal-0.001?'All cleared 🎉':'Payment saved — balance '+fmt(bal-left0)); renderNav(); renderPage();
}
function debtHistoryModal(kind,id){
  const it=debtItems().find(i=>i.kind===kind && i.id===id); if(!it) return;
  const pays=it.payments.slice().sort((a,b)=>(a.date+String(a.ts)).localeCompare(b.date+String(b.ts)));
  openModal(`
    <h2>${esc(it.customer)}</h2>
    <div class="sub">${esc(it.desc)} · ${esc(it.category)}${it.phone?' · '+esc(it.phone):''}</div>
    <div class="cl-row"><span>Recorded</span><b>${esc(it.date)}${it.staff?' by '+esc(it.staff):''}</b></div>
    <div class="cl-row"><span>Total</span><b>${fmt(it.total)}</b></div>
    <div class="cl-row"><span>Paid</span><b class="pos">${fmt(it.paid)}</b></div>
    <div class="cl-row total"><span>Balance</span><b>${fmt(it.balance)}</b></div>
    ${it.due?`<div class="cl-note muted">Pay-by date: ${esc(it.due)}${it.overdue?' — <b style="color:#B23336">overdue</b>':''}</div>`:''}
    ${it.writtenOff?`<div class="warn-box">This debt was written off${it.src.writeOffDate?' on '+esc(it.src.writeOffDate):''}.</div>`:''}
    <div class="card-title" style="margin-top:16px;">Payments</div>
    ${pays.length?`<table><thead><tr><th>Date</th><th>By</th><th>Via</th><th style="text-align:right;">Amount</th></tr></thead><tbody>${pays.map(p=>`<tr><td>${esc(p.date)}</td><td class="muted">${esc(p.by||'—')}${p.note?' · '+esc(p.note):''}</td><td>${esc(p.method)}</td><td style="text-align:right;" class="amt pos">${fmt(p.amount)}</td></tr>`).join('')}</tbody></table>`:'<div class="muted">No payments yet.</div>'}
    <div class="modal-actions"><button class="btn btn-block" onclick="closeModal()">Close</button></div>`);
}
function addDebtModal(){
  openModal(`
    <h2>Record a debt</h2>
    <div class="sub">For money or things owed that are not a normal sale (cash lent, goods taken, an old balance…). For services sold on credit, use New Sale → Owing.</div>
    <div class="row"><div class="field"><label>Customer name</label><input type="text" id="adName"></div><div class="field"><label>Phone <span class="lab-hint">(optional)</span></label><input type="tel" id="adPhone"></div></div>
    <div class="row"><div class="field"><label>Category</label><select id="adCat">${DEBT_CATEGORIES.map(c=>`<option ${c==='Cash lent'?'selected':''}>${c}</option>`).join('')}</select></div><div class="field"><label>Amount owed</label><input type="number" id="adAmount" min="0" step="any"></div></div>
    <div class="field"><label>What is it for?</label><input type="text" id="adDesc" placeholder="e.g. Borrowed ₦2,000 for transport"></div>
    <div class="row3"><div class="field"><label>Pay-by date</label><input type="date" id="adDue"></div><div class="field"><label>Paid already</label><input type="number" id="adPaid" min="0" step="any" placeholder="0"></div><div class="field"><label>Paid via</label><select id="adMethod">${debtMethodOptions()}</select></div></div>
    <div class="field"><label>Note</label><input type="text" id="adNote" placeholder="optional"></div>
    <div class="muted" style="font-size:12px;">Manual debts are tracked here only. They don't change your sales or profit.</div>
    <div class="modal-actions"><button class="btn btn-ghost" onclick="closeModal()">Cancel</button><button class="btn btn-cyan btn-block" onclick="confirmAddDebt()">Save debt</button></div>`);
}
function confirmAddDebt(){
  const $=id=>document.getElementById(id);
  const name=$('adName').value.trim(), amount=Number($('adAmount').value)||0, paid=Number($('adPaid').value)||0;
  if(!name){ toast("Enter the customer's name"); return; }
  if(amount<=0){ toast('Enter the amount owed'); return; }
  if(paid>amount){ toast('Paid already is more than the amount'); return; }
  const me=currentStaff?currentStaff.name:'';
  const d={id:uid(), ts:Date.now(), date:todayISO(), customer:name, phone:$('adPhone').value.trim(), category:$('adCat').value, description:$('adDesc').value.trim(), amount, dueDate:$('adDue').value||'', note:$('adNote').value.trim(), staff:me, payments:[]};
  if(paid>0) d.payments.push({id:uid(), date:todayISO(), amount:paid, method:$('adMethod').value, by:me, ts:Date.now(), note:'Paid when recorded'});
  debts.push(d); saveData('debts',debts); cloudSet('debts',d);
  closeModal(); toast('Debt recorded'); renderNav(); renderPage();
}
function debtEditModal(kind,id){
  if(!isAdmin()) return;
  const it=debtItems().find(i=>i.kind===kind && i.id===id); if(!it) return;
  openModal(`
    <h2>Edit debt</h2><div class="sub">${esc(it.customer)} · ${esc(it.desc)}</div>
    <div class="row"><div class="field"><label>Customer name</label><input type="text" id="edName" value="${esc(it.customer)}"></div><div class="field"><label>Phone</label><input type="tel" id="edPhone" value="${esc(it.phone)}"></div></div>
    <div class="row"><div class="field"><label>Category</label><select id="edCat">${DEBT_CATEGORIES.map(c=>`<option ${c===it.category?'selected':''}>${c}</option>`).join('')}</select></div><div class="field"><label>Pay-by date</label><input type="date" id="edDue" value="${esc(it.due)}"></div></div>
    ${kind==='manual'?`<div class="row"><div class="field"><label>What is it for?</label><input type="text" id="edDesc" value="${esc(it.src.description||'')}"></div><div class="field"><label>Amount owed</label><input type="number" id="edAmount" value="${it.total}" step="any"></div></div>`:'<div class="muted" style="font-size:12px;margin-bottom:10px;">To change the amount of a credit sale, edit it in the Sales Log.</div>'}
    <div class="field"><label>Note</label><input type="text" id="edNote" value="${esc(it.note)}"></div>
    <div class="modal-actions" style="flex-wrap:wrap;">
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      ${it.balance>0?`<button class="btn btn-danger" onclick="debtWriteOff('${kind}','${id}')">Write off ${fmt(it.balance)}</button>`:''}
      ${it.writtenOff?`<button class="btn" onclick="debtUndoWriteOff('${kind}','${id}')">Undo write-off</button>`:''}
      ${kind==='manual'?`<button class="btn btn-danger" onclick="debtDelete('${id}')">Delete</button>`:''}
      <button class="btn btn-cyan btn-block" onclick="confirmDebtEdit('${kind}','${id}')">Save changes</button>
    </div>`);
}
function confirmDebtEdit(kind,id){
  const src=debtSrc(kind,id); if(!src) return; const $=i=>document.getElementById(i);
  const name=$('edName').value.trim(); if(!name){ toast('Enter a name'); return; }
  src.customer=name; src.phone=$('edPhone').value.trim(); src.dueDate=$('edDue').value||''; src.note=$('edNote').value.trim();
  if(kind==='sale') src.debtCategory=$('edCat').value; else { src.category=$('edCat').value; src.description=$('edDesc').value.trim(); const a=Number($('edAmount').value)||0; if(a>0) src.amount=a; }
  debtSave(kind,src); closeModal(); toast('Debt updated'); renderNav(); renderPage();
}
function debtWriteOff(kind,id){
  if(!confirm('Write off the remaining balance? It will stop counting as owed and will not be counted as income.')) return;
  const src=debtSrc(kind,id); if(!src) return; debtEnsurePayments(kind,src);
  src.writtenOff=true; src.writeOffDate=todayISO(); debtSave(kind,src); closeModal(); toast('Written off'); renderNav(); renderPage();
}
function debtUndoWriteOff(kind,id){
  const src=debtSrc(kind,id); if(!src) return; delete src.writtenOff; delete src.writeOffDate; debtSave(kind,src); closeModal(); toast('Write-off undone'); renderNav(); renderPage();
}
function debtDelete(id){
  if(!confirm('Delete this debt record completely?')) return;
  debts=debts.filter(d=>d.id!==id); saveData('debts',debts); cloudDelete('debts',id); closeModal(); toast('Debt deleted'); renderNav(); renderPage();
}
function remindCustomer(keyEnc){
  const key=decodeURIComponent(keyEnc);
  const its=debtItems().filter(i=>debtKey(i)===key && i.balance>0); if(!its.length) return;
  const bal=sum(its,'balance'), paid=sum(its,'paid'), total=sum(its,'total');
  const due=its.map(i=>i.due).filter(Boolean).sort()[0];
  const lines=[`Hello ${its[0].customer},`,`This is a friendly reminder from ${settings.shopName}.`,
    `You currently owe ${fmt(bal)}${paid>0?` (total ${fmt(total)}, paid so far ${fmt(paid)})`:''} for: ${its.map(i=>i.desc).slice(0,4).join(', ')}${its.length>4?'…':''}.`];
  if(due) lines.push(`Pay-by date: ${due}.`);
  lines.push('Kindly settle when you can. Thank you!');
  const text=lines.join('\n');
  if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(()=>toast('Reminder copied — paste it into WhatsApp or SMS')).catch(()=>prompt('Copy this reminder:',text));
  else prompt('Copy this reminder:',text);
}
function exportDebtsCSV(){
  const rows=debtFiltered().map(i=>({date:i.date, customer:i.customer, phone:i.phone, category:i.category, description:i.desc, total:i.total, paid:i.paid, balance:i.balance, payBy:i.due, status:i.overdue?'overdue':i.status, recordedBy:i.staff, note:i.note}));
  downloadCSV(rows,['date','customer','phone','category','description','total','paid','balance','payBy','status','recordedBy','note'],'highspeed-debts-'+todayISO()+'.csv');
}

/* ================= DAY CLOSING ================= */
let closeDate = null;
function closingFigures(date, who){
  const mine = x => x.staff===who;
  const cashSales = sales.filter(x=>x.payment==='cash' && x.date===date && mine(x));
  const cashDebts=[];
  sales.filter(isCredit).forEach(x=>payListOf(x).forEach(p=>{ if(p.method==='cash' && p.date===date && p.by===who) cashDebts.push(p); }));
  debts.forEach(d=>(d.payments||[]).forEach(p=>{ if(p.method==='cash' && p.date===date && p.by===who) cashDebts.push(p); }));
  const lent = debts.filter(d=>d.category==='Cash lent' && d.date===date && d.staff===who);
  const other = sales.filter(x=>(x.payment==='transfer'||x.payment==='pos') && x.date===date && mine(x));
  const owedNew = sales.filter(x=>x.payment==='credit' && x.date===date && mine(x));
  const exps = expenses.filter(e=>e.date===date && e.staff===who);
  const expected = sum(cashSales,'amount')+sum(cashDebts,'amount')-sum(exps,'amount')-sum(lent,'amount');
  return {cashSales,cashDebts,lent,other,owedNew,exps,expected};
}
function pageClosing(){
  const admin=isAdmin();
  const date = admin ? (closeDate||todayISO()) : todayISO();
  const who = currentStaff ? currentStaff.name : '';
  const f = closingFigures(date, who);
  const dayClosings = closings.filter(c=>c.date===date && (admin || c.staff===who)).sort((a,b)=>(b.ts||0)-(a.ts||0));
  return `
  ${admin?`<div class="card filters"><div class="field"><label>Date</label><input type="date" id="clDate" value="${date}" onchange="closeDate=this.value;renderPage()"></div><div class="field grow"><div class="muted" style="padding-top:22px;">Showing your own figures below, and everyone's closings for this date.</div></div></div>`:''}
  <div class="grid grid-2">
    <div class="card">
      <div class="card-title">${icon('wallet',16)} Your till — ${esc(who)}</div>
      <div class="cl-row"><span>Cash sales</span><b>${fmt(sum(f.cashSales,'amount'))}</b></div>
      <div class="cl-row"><span>Debts collected in cash</span><b>${fmt(sum(f.cashDebts,'amount'))}</b></div>
      <div class="cl-row neg"><span>Expenses you paid out</span><b>− ${fmt(sum(f.exps,'amount'))}</b></div>
      ${f.lent.length?`<div class="cl-row neg"><span>Cash lent out (debts)</span><b>− ${fmt(sum(f.lent,'amount'))}</b></div>`:''}
      <div class="cl-row total"><span>Cash that should be in the till</span><b>${fmt(f.expected)}</b></div>
      <div class="cl-note muted">Also made: ${fmt(sum(f.other,'amount'))} by transfer/POS${f.owedNew.length?` · ${fmt(sum(f.owedNew,'amount'))} left owing`:''} (not counted as cash).</div>
    </div>
    <div class="card">
      <div class="card-title">${icon('check',16)} Close your shift</div>
      <div class="field"><label>Cash you counted</label><input type="number" id="clCounted" step="any" placeholder="0"></div>
      <div class="field"><label>Note (optional)</label><input type="text" id="clNote" placeholder="e.g. 500 given to the generator guy"></div>
      <div id="clDiff" class="cl-diff muted">Enter the cash count to see any difference.</div>
      <button class="btn btn-primary btn-block" style="margin-top:12px;" onclick="submitClosing(${f.expected})" ${admin&&date!==todayISO()?'disabled':''}>Submit closing</button>
    </div>
  </div>
  <div class="section-title">Closings for ${esc(fmtDay(date))}</div>
  <div class="card table-wrap"><table><thead><tr><th>Time</th><th>Staff</th><th style="text-align:right;">Expected</th><th style="text-align:right;">Counted</th><th style="text-align:right;">Difference</th><th>Note</th></tr></thead><tbody>
  ${dayClosings.length? dayClosings.map(c=>`<tr><td class="muted">${esc(c.time)}</td><td>${esc(c.staff)}</td><td style="text-align:right;" class="amt">${fmt(c.expected)}</td><td style="text-align:right;" class="amt">${fmt(c.counted)}</td><td style="text-align:right;" class="amt ${c.diff===0?'pos':(c.diff<0?'neg':'owing')}">${c.diff>0?'+':''}${fmt(c.diff)}</td><td class="muted">${esc(c.note||'')}</td></tr>`).join('') : '<tr class="empty-row"><td colspan="6">No closings yet for this day.</td></tr>'}
  </tbody></table></div>`;
}
function initClosingLive(expected){
  const inp=document.getElementById('clCounted'); if(!inp) return;
  inp.addEventListener('input',()=>{
    const v=Number(inp.value); const out=document.getElementById('clDiff');
    if(inp.value===''){ out.className='cl-diff muted'; out.textContent='Enter the cash count to see any difference.'; return; }
    const d=Math.round((v-expected)*100)/100;
    out.className='cl-diff '+(d===0?'ok':(d<0?'short':'over'));
    out.textContent = d===0 ? 'Perfect — the till matches.' : (d<0 ? `Short by ${fmt(Math.abs(d))}` : `Over by ${fmt(d)}`);
  });
}
function submitClosing(expected){
  const raw=document.getElementById('clCounted').value;
  if(raw===''){ toast('Enter the cash you counted'); return; }
  const counted=Number(raw), diff=Math.round((counted-expected)*100)/100;
  if(!confirm(`Submit closing?\nExpected ${fmt(expected)} · Counted ${fmt(counted)} · Difference ${fmt(diff)}`)) return;
  const rec={id:uid(), ts:Date.now(), date:todayISO(), time:nowTime(), staff:currentStaff?currentStaff.name:'', expected, counted, diff, note:document.getElementById('clNote').value.trim()};
  closings.push(rec); saveData('closings',closings); cloudSet('closings',rec);
  toast('Shift closed'); renderPage();
}

/* ================= EXPENSES ================= */
function pageExpenses(){
  return `
  <div class="card" style="margin-bottom:16px;">
    <div class="row">
      <div class="field"><label>Category</label>
        <select id="expCategory">
          <option>Electricity / Generator Fuel</option>
          <option>Internet Subscription (Data/Router)</option>
          <option>Maintenance & Repairs</option>
          <option>Stationery / Consumables</option>
          <option>Rent</option>
          <option>Staff Wages</option>
          <option>Transport</option>
          <option>Other</option>
        </select>
      </div>
      <div class="field"><label>Amount</label><input type="number" id="expAmount" placeholder="0"></div>
    </div>
    <div class="field"><label>Description (optional)</label><input type="text" id="expDesc" placeholder="e.g. Fuel for generator"></div>
    <button class="btn btn-primary" onclick="addExpense()">Add Expense</button>
  </div>
  <div class="card table-wrap">
    <table>
      <thead><tr><th>Date</th><th>Category</th><th>Description</th><th>Staff</th><th style="text-align:right;">Amount</th><th></th></tr></thead>
      <tbody>
      ${expenses.length? expenses.slice().sort((a,b)=>b.date<a.date?-1:1).map(e=>`
        <tr>
          <td>${e.date}</td><td>${e.category}</td><td class="muted">${e.description||'—'}</td>
          <td class="muted">${e.staff||'—'}</td>
          <td style="text-align:right;" class="amt neg">${fmt(e.amount)}</td>
          <td>${isAdmin() ? `<button class="btn btn-ghost btn-sm" onclick="deleteExpense('${e.id}')">✕</button>` : ''}</td>
        </tr>
      `).join('') : `<tr class="empty-row"><td colspan="6">No expenses recorded yet.</td></tr>`}
      </tbody>
    </table>
  </div>
  `;
}
function addExpense(){
  const category = document.getElementById('expCategory').value;
  const amount = Number(document.getElementById('expAmount').value)||0;
  const description = document.getElementById('expDesc').value.trim();
  if(amount<=0){ toast('Enter a valid amount'); return; }
  const newExp = {id:uid(), date:todayISO(), category, amount, description, staff: currentStaff ? currentStaff.name : ''};
  expenses.push(newExp);
  saveData('expenses', expenses);
  cloudSet('expenses', newExp);
  toast('Expense added');
  renderPage();
}
function deleteExpense(id){
  if(!confirm('Delete this expense?')) return;
  expenses = expenses.filter(e=>e.id!==id);
  saveData('expenses', expenses);
  cloudDelete('expenses', id);
  renderPage();
}

/* ================= SERVICES & PRICING ================= */
function pageServices(){
  const stockOpts = sel => '<option value="">— none —</option>'+inventory.map(i=>`<option value="${i.id}" ${i.id===sel?'selected':''}>${esc(i.name)}</option>`).join('');
  return `
  <div class="card" style="margin-bottom:16px;">
    <div class="card-title">${icon('plus',16)} Add a service</div>
    <div class="row">
      <div class="field"><label>Service name</label><input type="text" id="svcName" placeholder="e.g. Passport Photo"></div>
      <div class="field"><label>Unit</label><input type="text" id="svcUnit" placeholder="page / hour / job" value="job"></div>
      <div class="field"><label>Price</label><input type="number" id="svcPrice" placeholder="0"></div>
    </div>
    <button class="btn btn-primary" onclick="addService()">Add Service</button>
  </div>
  <div class="card table-wrap">
    <div class="muted" style="font-size:12.5px;margin-bottom:10px;">Link a service to a stock item and the stock goes down by itself with every sale (e.g. Printing → A4 paper, 0.002 ream per page).</div>
    <table>
      <thead><tr><th>Service</th><th>Unit</th><th>Price</th><th>Uses stock item</th><th>Amount used per unit</th><th></th></tr></thead>
      <tbody>
      ${services.map(sv=>`
        <tr>
          <td><input class="cell-in" type="text" value="${esc(sv.name)}" onchange="updateService('${sv.id}','name',this.value)" style="font-weight:600;"></td>
          <td><input class="cell-in" type="text" value="${esc(sv.unit)}" onchange="updateService('${sv.id}','unit',this.value)" style="width:70px;"></td>
          <td><input class="cell-in" type="number" value="${sv.price}" onchange="updateService('${sv.id}','price',this.value)" style="width:90px;font-family:var(--mono);"></td>
          <td><select class="cell-in" onchange="updateService('${sv.id}','stockItemId',this.value)">${stockOpts(sv.stockItemId)}</select></td>
          <td><input class="cell-in" type="number" step="any" value="${sv.stockPer||''}" placeholder="0" onchange="updateService('${sv.id}','stockPer',this.value)" style="width:90px;"></td>
          <td><button class="icon-btn danger" onclick="removeService('${sv.id}')">${icon('trash',15)}</button></td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`;
}
function addService(){
  const name = document.getElementById('svcName').value.trim();
  const unit = document.getElementById('svcUnit').value.trim()||'job';
  const price = Number(document.getElementById('svcPrice').value)||0;
  if(!name){ toast('Enter a service name'); return; }
  const newSvc = {id:uid(), name, unit, price, category:'Other'};
  services.push(newSvc);
  saveData('services', services);
  cloudSet('services', newSvc);
  renderPage();
  toast('Service added');
}
function updateService(id, field, val){
  const sv = services.find(x=>x.id===id);
  if(field==='price' || field==='stockPer') sv[field] = Number(val)||0;
  else sv[field] = val;
  if(field==='stockItemId' && !val){ sv.stockItemId=''; sv.stockPer=0; }
  saveData('services', services);
  cloudSet('services', sv);
  renderNav();
}
function removeService(id){
  if(!confirm('Remove this service?')) return;
  services = services.filter(s=>s.id!==id);
  saveData('services', services);
  cloudDelete('services', id);
  renderPage();
}

/* ================= INVENTORY ================= */
function pageInventory(){
  return `
  <div class="card" style="margin-bottom:16px;">
    <div class="row">
      <div class="field"><label>Item name</label><input type="text" id="invName" placeholder="e.g. A4 Paper (ream)"></div>
      <div class="field"><label>Quantity</label><input type="number" id="invQty" placeholder="0"></div>
      <div class="field"><label>Unit</label><input type="text" id="invUnit" placeholder="ream / pcs / box" value="pcs"></div>
      <div class="field"><label>Reorder level</label><input type="number" id="invReorder" value="${settings.lowStockDefault}"></div>
    </div>
    <button class="btn btn-primary" onclick="addInventory()">Add Item</button>
  </div>
  <div class="card table-wrap">
    <table>
      <thead><tr><th>Item</th><th>Quantity</th><th>Unit</th><th>Reorder Level</th><th>Status</th><th></th></tr></thead>
      <tbody>
      ${inventory.length? inventory.map(i=>{
        const low = Number(i.qty)<=Number(i.reorder);
        return `
        <tr>
          <td>${i.name}</td>
          <td><input type="number" value="${i.qty}" onchange="updateInventory('${i.id}','qty',this.value)" style="width:70px;"></td>
          <td class="muted">${i.unit}</td>
          <td><input type="number" value="${i.reorder}" onchange="updateInventory('${i.id}','reorder',this.value)" style="width:70px;"></td>
          <td>${low? '<span class="lowstock">Low Stock</span>' : '<span style="color:#1B8A5A;font-weight:700;">OK</span>'}</td>
          <td><button class="btn btn-ghost btn-sm" onclick="removeInventory('${i.id}')">✕</button></td>
        </tr>`;
      }).join('') : `<tr class="empty-row"><td colspan="6">No inventory items yet.</td></tr>`}
      </tbody>
    </table>
  </div>
  `;
}
function addInventory(){
  const name = document.getElementById('invName').value.trim();
  const qty = Number(document.getElementById('invQty').value)||0;
  const unit = document.getElementById('invUnit').value.trim()||'pcs';
  const reorder = Number(document.getElementById('invReorder').value)||settings.lowStockDefault;
  if(!name){ toast('Enter item name'); return; }
  const newInv = {id:uid(), name, qty, unit, reorder};
  inventory.push(newInv);
  saveData('inventory', inventory);
  cloudSet('inventory', newInv);
  renderPage(); renderNav();
  toast('Item added');
}
function updateInventory(id, field, val){
  const i = inventory.find(x=>x.id===id);
  i[field] = Number(val)||0;
  saveData('inventory', inventory);
  cloudSet('inventory', i);
  renderPage(); renderNav();
}
function removeInventory(id){
  if(!confirm('Remove this item?')) return;
  inventory = inventory.filter(i=>i.id!==id);
  saveData('inventory', inventory);
  cloudDelete('inventory', id);
  renderPage(); renderNav();
}

/* ================= REPORTS ================= */
function pageReports(){
  return `
  <div class="card" style="margin-bottom:16px;display:flex;gap:12px;flex-wrap:wrap;align-items:flex-end;">
    <div class="field" style="margin:0;"><label>From</label><input type="date" id="repFrom"></div>
    <div class="field" style="margin:0;"><label>To</label><input type="date" id="repTo"></div>
    <button class="btn btn-sm" onclick="quickRange('today')">Today</button>
    <button class="btn btn-sm" onclick="quickRange('week')">This Week (Mon–Sun)</button>
    <button class="btn btn-sm" onclick="quickRange('month')">This Month</button>
    <button class="btn btn-cyan btn-sm" onclick="runReport()">Run Report</button>
  </div>
  ${isAdmin()?trendsHTML()+'<div style="height:16px"></div>':''}<div class="grid grid-3" id="repStats"></div>
  <div class="grid grid-2" style="margin-top:16px;align-items:flex-start;">
    <div class="card"><div class="section-title" style="margin-top:0;">Revenue by Service</div><div id="repByService"></div></div>
    <div class="card"><div class="section-title" style="margin-top:0;">Expenses by Category</div><div id="repByCategory"></div></div>
  </div>
  ${isAdmin() ? `
  <div class="card" style="margin-top:16px;"><div class="section-title" style="margin-top:0;">Revenue by Staff</div><div id="repByStaff"></div></div>
  ` : ''}
  `;
}
function initReports(){
  document.getElementById('repFrom').value = todayISO();
  document.getElementById('repTo').value = todayISO();
  runReport();
}
function quickRange(kind){
  const t=todayISO(); let from=t;
  if(kind==='week') from=weekStartOf(t);
  else if(kind==='month') from=monthStartOf(t);
  document.getElementById('repFrom').value=from;
  document.getElementById('repTo').value=t;
  runReport();
}
function runReport(){
  const from = document.getElementById('repFrom').value;
  const to = document.getElementById('repTo').value;
  const rSales = salesBetween(from,to);
  const rExp = expensesBetween(from,to);
  const revenue = sum(rSales,'amount');
  const exp = sum(rExp,'amount');
  document.getElementById('repStats').innerHTML = `
    <div class="card stat-card accent-cyan"><div class="stat-label">Revenue</div><div class="stat-value">${fmt(revenue)}</div><div class="stat-foot">${rSales.length} sales</div></div>
    <div class="card stat-card accent-red"><div class="stat-label">Expenses</div><div class="stat-value">${fmt(exp)}</div><div class="stat-foot">${rExp.length} entries</div></div>
    <div class="card stat-card accent-green"><div class="stat-label">Net Profit</div><div class="stat-value" style="color:${(revenue-exp)>=0?'#1B8A5A':'#B23336'}">${fmt(revenue-exp)}</div><div class="stat-foot">${from} → ${to}</div></div>
  `;
  const byService = {};
  rSales.forEach(s=>{ byService[s.service]=(byService[s.service]||0)+Number(s.amount); });
  const svcEntries = Object.entries(byService).sort((a,b)=>b[1]-a[1]);
  const maxSvc = Math.max(1, ...svcEntries.map(e=>e[1]));
  document.getElementById('repByService').innerHTML = svcEntries.length ? svcEntries.map(([name,amt])=>`
    <div class="barwrap"><div class="barlabel">${name}</div><div class="bartrack"><div class="barfill" style="width:${(amt/maxSvc*100)}%;"></div></div><div class="barval">${fmt(amt)}</div></div>
  `).join('') : `<div class="muted" style="font-size:13px;">No sales in this range.</div>`;

  const byCat = {};
  rExp.forEach(e=>{ byCat[e.category]=(byCat[e.category]||0)+Number(e.amount); });
  const catEntries = Object.entries(byCat).sort((a,b)=>b[1]-a[1]);
  const maxCat = Math.max(1, ...catEntries.map(e=>e[1]));
  document.getElementById('repByCategory').innerHTML = catEntries.length ? catEntries.map(([name,amt])=>`
    <div class="barwrap"><div class="barlabel">${name}</div><div class="bartrack"><div class="barfill" style="width:${(amt/maxCat*100)}%;background:var(--red-500);"></div></div><div class="barval">${fmt(amt)}</div></div>
  `).join('') : `<div class="muted" style="font-size:13px;">No expenses in this range.</div>`;

  const staffEl = document.getElementById('repByStaff');
  if(staffEl){
    const byStaff = {};
    rSales.forEach(s=>{ const n=s.staff||'Unassigned'; byStaff[n]=(byStaff[n]||0)+Number(s.amount); });
    const stEntries = Object.entries(byStaff).sort((a,b)=>b[1]-a[1]);
    const maxSt = Math.max(1, ...stEntries.map(e=>e[1]));
    staffEl.innerHTML = stEntries.length ? stEntries.map(([name,amt])=>`
      <div class="barwrap"><div class="barlabel">${name}</div><div class="bartrack"><div class="barfill" style="width:${(amt/maxSt*100)}%;background:var(--amber-500);"></div></div><div class="barval">${fmt(amt)}</div></div>
    `).join('') : `<div class="muted" style="font-size:13px;">No sales in this range.</div>`;
  }
}

/* ================= PROFIT SHARE (admin only, weeks run Monday–Sunday) ================= */
let psWeek = null;
function psNum(n){ return Math.round(n*100)/100; }
function pageProfit(){
  if(!isAdmin()) return '<div class="card">This page is for admins only.</div>';
  const t=todayISO(), cur=weekStartOf(t), wk=psWeek||cur, end=addDays(wk,6);
  const snap=profitShare.history[wk];
  const days=[];
  for(let i=0;i<7;i++){
    const d=addDays(wk,i), rev=revenueOn(d,d), ex=sum(expensesBetween(d,d),'amount');
    days.push({d, name:DAY_NAMES[i], rev, ex, profit:rev-ex, future:d>t});
  }
  const liveRev=sum(days,'rev'), liveEx=sum(days,'ex');
  const locked=!!snap;
  const rev=locked?snap.revenue:liveRev, ex=locked?snap.expenses:liveEx, profit=locked?snap.profit:(liveRev-liveEx);
  const shares=locked?snap.shares:profitShare.shares;
  const pool=Math.max(0,profit);
  const totalPct=psNum(sum(shares,'pct'));
  const unassigned=psNum(100-totalPct);
  const amtOf=x=> locked ? x.amount : psNum(pool*Number(x.pct)/100);
  const label=`${fmtDay(wk)} – ${fmtDay(end)} ${parseISO(end).getFullYear()}`;
  return `
  <div class="week-nav card">
    <button class="icon-btn" onclick="psPrev()" title="Previous week">${icon('left',18)}</button>
    <div class="wn-mid"><div class="wn-label">${label}</div><div class="wn-sub">Monday to Sunday ${wk===cur?'· <b>this week</b>':''} ${locked?'· <span class="tag tag-locked">locked</span>':''}</div></div>
    <button class="icon-btn" onclick="psNext()" title="Next week" ${wk>=cur?'disabled':''}>${icon('right',18)}</button>
    ${wk!==cur?`<button class="btn btn-sm" onclick="psThis()">This week</button>`:''}
  </div>

  <div class="grid grid-3">
    ${statCard('accent-cyan','trend','Revenue',fmt(rev),'Money received this week')}
    ${statCard('accent-red','wallet','Expenses',fmt(ex),'Paid out this week')}
    ${statCard('accent-green','coins','Profit to share',fmt(profit),profit<0?'Loss week — nothing to share':'Revenue minus expenses',`color:${profit>=0?'#1B8A5A':'#B23336'}`)}
  </div>

  <div class="section-title">Who gets what <span class="hint">${locked?'Locked snapshot':'So far this week'}</span></div>
  <div class="grid grid-2" style="align-items:flex-start;">
    <div class="card">
      ${shares.map(x=>`
        <div class="share-line">
          <div class="sl-ic ${x.kind==='fund'?'fund':''}">${icon(x.kind==='fund'?'box':'users',16)}</div>
          <div class="sl-n"><b>${esc(x.name)}</b><small>${esc(x.pct)}% ${x.kind==='fund'?'· shop fund':''}</small></div>
          <div class="sl-a">${fmt(amtOf(x))}</div>
        </div>`).join('')}
      ${unassigned>0?`<div class="share-line dim"><div class="sl-ic">${icon('clock',16)}</div><div class="sl-n"><b>Not assigned</b><small>${unassigned}%</small></div><div class="sl-a">${fmt(psNum(pool*unassigned/100))}</div></div>`:''}
      ${unassigned<0?`<div class="warn-box">Percentages add up to ${totalPct}% — more than 100%. Fix them below.</div>`:''}
      <div class="share-total"><span>Total shared</span><b>${fmt(psNum(pool*Math.min(totalPct,100)/100))}</b></div>
      <div class="btn-row" style="margin-top:12px;">
        <button class="btn btn-sm" onclick="psCopy()">${icon('copy',14)} Copy summary</button>
        ${locked?`<button class="btn btn-sm" onclick="psUnlock()">${icon('unlock',14)} Unlock week</button>`:`<button class="btn btn-sm btn-cyan" onclick="psLock()">${icon('lock',14)} Lock this week's shares</button>`}
      </div>
      <div class="muted" style="font-size:12px;margin-top:8px;">${locked?`Locked ${esc(new Date(snap.lockedAt).toLocaleString())} by ${esc(snap.by||'—')}. Later changes to percentages won't change this week.`:'Lock a week once you have paid out, so changing percentages later never alters it.'}</div>
    </div>

    <div class="card">
      <div class="card-title">${icon('sliders',16)} Set the percentages</div>
      ${locked?'<div class="muted">This week is locked. Unlock it to change the shares, or move to an open week.</div>':`
      ${profitShare.shares.map(x=>`
        <div class="share-edit">
          <input type="text" value="${esc(x.name)}" onchange="psSet('${x.id}','name',this.value)">
          <select onchange="psSet('${x.id}','kind',this.value)"><option value="person" ${x.kind!=='fund'?'selected':''}>Person</option><option value="fund" ${x.kind==='fund'?'selected':''}>Shop fund</option></select>
          <div class="pct-in"><input type="number" min="0" max="100" step="any" value="${esc(x.pct)}" onchange="psSet('${x.id}','pct',this.value)"><span>%</span></div>
          <button class="icon-btn danger" onclick="psRemove('${x.id}')">${icon('trash',15)}</button>
        </div>`).join('')}
      <div class="pct-sum ${totalPct===100?'ok':'bad'}">Total: ${totalPct}% ${totalPct===100?'✓':(totalPct<100?`— ${unassigned}% still unassigned`:`— ${psNum(-unassigned)}% too much`)}</div>
      <button class="btn btn-block" onclick="psAdd()">${icon('plus',15)} Add a share (e.g. new staff, savings)</button>`}
    </div>
  </div>

  <div class="section-title">Day by day <span class="hint">Earned so far this week</span></div>
  <div class="card table-wrap">
    <table class="ps-table">
      <thead><tr><th>Day</th><th style="text-align:right;">Revenue</th><th style="text-align:right;">Expenses</th><th style="text-align:right;">Profit</th>${profitShare.shares.map(x=>`<th style="text-align:right;">${esc(x.name)}</th>`).join('')}</tr></thead>
      <tbody>
      ${days.map(x=>`<tr class="${x.future?'future':''}"><td><b>${x.name}</b> <span class="muted">${esc(fmtDay(x.d))}</span></td>
        <td style="text-align:right;" class="amt">${x.future?'—':fmt(x.rev)}</td><td style="text-align:right;" class="amt">${x.future?'—':fmt(x.ex)}</td>
        <td style="text-align:right;" class="amt ${x.profit>=0?'pos':'neg'}">${x.future?'—':fmt(x.profit)}</td>
        ${profitShare.shares.map(sh=>`<td style="text-align:right;" class="amt">${x.future?'—':fmt(psNum(x.profit*Number(sh.pct)/100))}</td>`).join('')}</tr>`).join('')}
      </tbody>
      <tfoot><tr><td><b>Week total</b></td><td style="text-align:right;" class="amt">${fmt(liveRev)}</td><td style="text-align:right;" class="amt">${fmt(liveEx)}</td><td style="text-align:right;" class="amt ${liveRev-liveEx>=0?'pos':'neg'}">${fmt(liveRev-liveEx)}</td>${profitShare.shares.map(sh=>`<td style="text-align:right;" class="amt">${fmt(psNum((liveRev-liveEx)*Number(sh.pct)/100))}</td>`).join('')}</tr></tfoot>
    </table>
  </div>
  <div class="footprint">Only admin accounts can open this page. Staff accounts never see it.</div>`;
}
function psPrev(){ psWeek=addDays(psWeek||weekStartOf(todayISO()),-7); renderPage(); }
function psNext(){ const cur=weekStartOf(todayISO()); const n=addDays(psWeek||cur,7); psWeek = n>=cur ? null : n; renderPage(); }
function psThis(){ psWeek=null; renderPage(); }
function psSet(id,field,val){
  const x=profitShare.shares.find(r=>r.id===id); if(!x) return;
  if(field==='pct'){ let n=Number(val); if(!(n>=0)) n=0; if(n>100) n=100; x.pct=n; }
  else if(field==='name'){ x.name=val.trim()||x.name; }
  else x[field]=val;
  cloudSetProfitShare(); renderPage();
}
function psAdd(){ profitShare.shares.push({id:uid(), name:'New share', kind:'person', pct:0}); cloudSetProfitShare(); renderPage(); }
function psRemove(id){
  if(profitShare.shares.length<=1){ toast('Keep at least one share'); return; }
  if(!confirm('Remove this share?')) return;
  profitShare.shares=profitShare.shares.filter(r=>r.id!==id); cloudSetProfitShare(); renderPage();
}
function psLock(){
  const t=todayISO(), cur=weekStartOf(t), wk=psWeek||cur;
  const total=psNum(sum(profitShare.shares,'pct'));
  if(total!==100 && !confirm(`The percentages add up to ${total}%, not 100%. Lock anyway?`)) return;
  if(wk===cur && !confirm('This week is not finished yet. Lock it anyway? (Sales after locking will not be included.)')) return;
  let rev=0, ex=0;
  for(let i=0;i<7;i++){ const d=addDays(wk,i); rev+=revenueOn(d,d); ex+=sum(expensesBetween(d,d),'amount'); }
  const profit=rev-ex, pool=Math.max(0,profit);
  profitShare.history[wk]={weekStart:wk, revenue:rev, expenses:ex, profit, lockedAt:new Date().toISOString(), by:currentStaff?currentStaff.name:'',
    shares:profitShare.shares.map(x=>({name:x.name, kind:x.kind, pct:Number(x.pct), amount:psNum(pool*Number(x.pct)/100)}))};
  cloudSetProfitShare(); toast('Week locked'); renderPage();
}
function psUnlock(){
  const wk=psWeek||weekStartOf(todayISO());
  if(!confirm('Unlock this week? Figures will follow live sales and the current percentages again.')) return;
  delete profitShare.history[wk]; cloudSetProfitShare(); toast('Week unlocked'); renderPage();
}
function psCopy(){
  const t=todayISO(), cur=weekStartOf(t), wk=psWeek||cur, end=addDays(wk,6), snap=profitShare.history[wk];
  let rev=0, ex=0; for(let i=0;i<7;i++){ const d=addDays(wk,i); rev+=revenueOn(d,d); ex+=sum(expensesBetween(d,d),'amount'); }
  const profit=snap?snap.profit:rev-ex, pool=Math.max(0,profit), shares=snap?snap.shares:profitShare.shares;
  const lines=[`*${settings.shopName}* — profit share`,`Week: ${fmtDay(wk)} – ${fmtDay(end)}`,'',`Revenue ${fmt(snap?snap.revenue:rev)} · Expenses ${fmt(snap?snap.expenses:ex)}`,`Profit: ${fmt(profit)}`,''];
  shares.forEach(x=>lines.push(`${x.name} (${x.pct}%): ${fmt(snap?x.amount:psNum(pool*Number(x.pct)/100))}`));
  const text=lines.join('\n');
  if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(()=>toast('Summary copied')).catch(()=>prompt('Copy:',text));
  else prompt('Copy:',text);
}

/* ================= BACKUP & RESTORE ================= */
function pageBackup(){
  return `
  <div class="card" style="margin-bottom:16px;">
    <div class="section-title" style="margin-top:0;">Why this matters</div>
    <p style="font-size:13.5px;color:var(--text-600);line-height:1.6;">
      ${cloudMode
        ? `Cloud Sync is on, so this device shares live data with every other device signed into Shop Code <b>${shopId}</b>. It's still worth keeping periodic backup files as an extra safety net.`
        : `This device is in local-only mode — data stays on this browser and does not appear on other computers. Turn on Cloud Sync in Settings to share data across devices, or export a backup file regularly and keep a copy somewhere safe (flash drive, email, Google Drive).`}
    </p>
  </div>
  <div class="grid grid-2">
    <div class="card">
      <div class="section-title" style="margin-top:0;">Export Backup</div>
      <p class="muted" style="font-size:13px;">Downloads a single JSON file with all sales, expenses, inventory, services and settings.</p>
      <button class="btn btn-cyan btn-block" onclick="exportBackup()">Download Backup File</button>
    </div>
    <div class="card">
      <div class="section-title" style="margin-top:0;">Restore Backup</div>
      <p class="muted" style="font-size:13px;">Choose a previously exported .json file. ${cloudMode ? 'This will overwrite the shared cloud data for everyone on this Shop Code.' : 'This will replace current data on this device.'}</p>
      <input type="file" id="restoreFile" accept="application/json" style="margin-bottom:10px;">
      <button class="btn btn-danger btn-block" onclick="restoreBackup()">Restore From File</button>
    </div>
  </div>
  <div class="card" style="margin-top:16px;">
    <div class="section-title" style="margin-top:0;">Danger Zone</div>
    <p class="muted" style="font-size:13px;">Permanently erase all data ${cloudMode? 'on this device\'s local cache (cloud data is untouched — manage that from the Firebase console)':'on this device'} and start fresh.</p>
    <button class="btn btn-danger" onclick="wipeData()">Erase All Data</button>
  </div>
  `;
}
function exportBackup(){
  const payload = {exportedAt:new Date().toISOString(), settings, sales, expenses, services, stations, inventory, staff, closings, profitShare, debts};
  const blob = new Blob([JSON.stringify(payload,null,2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'highspeed-backup-'+todayISO()+'.json';
  document.body.appendChild(a); a.click(); a.remove();
  toast('Backup downloaded');
}
function restoreBackup(){
  const file = document.getElementById('restoreFile').files[0];
  if(!file){ toast('Choose a backup file first'); return; }
  const warnMsg = cloudMode ? 'This will overwrite the shared CLOUD data for every connected device. Continue?' : 'This will replace all current data on this device. Continue?';
  if(!confirm(warnMsg)) return;
  const reader = new FileReader();
  reader.onload = (e)=>{
    try{
      const data = JSON.parse(e.target.result);
      settings = data.settings || settings;
      sales = data.sales || [];
      expenses = data.expenses || [];
      services = data.services || services;
      stations = data.stations || stations;
      inventory = data.inventory || inventory;
      staff = data.staff || staff;
      closings = data.closings || closings;
      debts = data.debts || debts;
      profitShare = data.profitShare || profitShare;
      persistAll();
      if(cloudMode){
        sales.forEach(r=>cloudSet('sales', r));
        expenses.forEach(r=>cloudSet('expenses', r));
        services.forEach(r=>cloudSet('services', r));
        stations.forEach(r=>cloudSet('stations', r));
        inventory.forEach(r=>cloudSet('inventory', r));
        staff.forEach(r=>cloudSet('staff', r));
        closings.forEach(r=>cloudSet('closings', r));
        debts.forEach(r=>cloudSet('debts', r));
        cloudSetProfitShare();
        cloudSetSettings();
      }
      toast('Backup restored');
      boot();
    }catch(err){
      alert('Could not read this file. Make sure it is a valid Highspeed backup JSON.');
    }
  };
  reader.readAsText(file);
}
function wipeData(){
  if(!confirm('This will permanently delete ALL local data on this device. This cannot be undone. Continue?')) return;
  if(!confirm('Are you absolutely sure? Type OK to confirm.')) return;
  Object.keys(localStorage).filter(k=>k.startsWith(DBKEY)).forEach(k=>localStorage.removeItem(k));
  location.reload();
}

/* ================= SETTINGS ================= */
function pageSettings(){
  return `
  <div class="grid grid-2">
    <div class="card">
      <div class="section-title" style="margin-top:0;">Shop Details</div>
      <div class="field"><label>Shop name</label><input type="text" id="stgName" value="${settings.shopName}"></div>
      <div class="field"><label>Location</label><input type="text" id="stgLoc" value="${settings.location}"></div>
      <div class="field"><label>Phone (optional)</label><input type="text" id="stgPhone" value="${settings.phone||''}"></div>
      <div class="field"><label>Currency symbol</label><input type="text" id="stgCurrency" value="${settings.currency}" style="max-width:80px;"></div>
      <button class="btn btn-primary" onclick="saveSettings()">Save Details</button>
      <div class="section-title">Defaults</div>
      <div class="field"><label>Default low-stock reorder level</label><input type="number" id="stgLowStock" value="${settings.lowStockDefault}"></div>
      <button class="btn btn-primary" onclick="saveDefaults()">Save Defaults</button>
    </div>
    <div class="card">
      <div class="section-title" style="margin-top:0;">Staff Accounts</div>
      <p class="muted" style="font-size:12.5px;margin-top:-6px;">Each staff member gets their own login and PIN. Sales and expenses are tagged with whoever is signed in. Admins can see Reports, Inventory, Backup and Settings — staff accounts see day-to-day operations only.</p>
      <div id="staffList" style="margin-bottom:14px;"></div>
      <div class="row">
        <input type="text" id="newStaffName" placeholder="Staff name">
        <input type="text" id="newStaffPin" placeholder="PIN (optional)" style="max-width:110px;">
        <select id="newStaffRole" style="max-width:110px;"><option value="staff">Staff</option><option value="admin">Admin</option></select>
      </div>
      <button class="btn btn-cyan btn-block" style="margin-top:10px;" onclick="addStaff()">Add Staff Account</button>
    </div>
  </div>
  <div class="section-title">Cloud Sync</div>
  <div class="card" id="cloudPanel"></div>
  <div class="footprint">Highspeed Enterprises Shop Manager · Offline-first, online when connected · Data lives on this device unless Cloud Sync is on</div>
  `;
}
function renderCloudPanel(){
  const el = document.getElementById('cloudPanel');
  if(!el) return;
  if(cloudMode){
    el.innerHTML = `
      <div class="pill" style="margin-bottom:12px;"><span class="dot"></span>Connected — Shop Code: <b style="margin-left:4px;">${shopId}</b></div>
      <p class="muted" style="font-size:13px;">This device is syncing live with every other device using the same Shop Code and Firebase project. To add another computer, open this same file there and use the button below to copy the connection details, then paste them in on that device.</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <button class="btn btn-cyan" onclick="copyConnectionInfo()">Copy Connection Info for Other Devices</button>
        <button class="btn btn-danger" onclick="onDisconnectCloud()">Disconnect This Device</button>
      </div>
    `;
  } else {
    el.innerHTML = `
      <p class="muted" style="font-size:13px;">This device is running in local-only mode — either you disconnected it, or something went wrong connecting automatically. Reconnect it to the shop's shared database below, or paste a different Firebase config if you're pointing this install at a different project.</p>
      <button class="btn btn-cyan btn-block" style="margin-bottom:14px;" onclick="onConnectCloud(true)">Reconnect to Highspeed Enterprises Cloud</button>
      <div class="section-title" style="margin-top:0;">Connect to a different Firebase project</div>
      <div class="field"><label>Firebase config (paste it exactly as Firebase shows it — including "const firebaseConfig = ..." is fine)</label>
        <textarea id="cloudConfigInput" rows="6" placeholder='const firebaseConfig = {&#10;  apiKey: "...",&#10;  authDomain: "...",&#10;  projectId: "...",&#10;  ...&#10;};'></textarea>
      </div>
      <div class="field"><label>Shop Code (same on every device you want synced)</label>
        <input type="text" id="cloudShopIdInput" value="highspeed-enterprises">
      </div>
      <button class="btn btn-cyan btn-block" onclick="onConnectCloud()">Connect Cloud Sync</button>
      <div id="cloudConnectStatus" class="muted" style="font-size:12px;margin-top:8px;"></div>
    `;
  }
}
function parseFlexibleConfig(raw){
  let cleaned = raw.trim();
  // strip a leading variable declaration e.g. "const firebaseConfig =" / "var config="
  cleaned = cleaned.replace(/^\s*(export\s+default\s+|module\.exports\s*=\s*|const|let|var)\s*[\w$]*\s*=?\s*/,'');
  // strip trailing semicolon
  cleaned = cleaned.replace(/;\s*$/,'');
  cleaned = cleaned.trim();
  // 1) try as strict JSON first (covers correctly-quoted JSON and our own "copy connection info" blob)
  try{ return JSON.parse(cleaned); }catch(e){}
  // 2) fall back to treating it as a real JS object literal (handles unquoted keys, trailing commas, single quotes) —
  //    safe here because this is the admin pasting their own config into their own local tool, not external input.
  try{ return (new Function('"use strict"; return (' + cleaned + ')'))(); }catch(e){}
  return null;
}
function onConnectCloud(useBuiltIn){
  const statusEl = document.getElementById('cloudConnectStatus');
  if(useBuiltIn===true){
    connectCloud(BUILT_IN_FIREBASE_CONFIG, BUILT_IN_SHOP_ID, (ok)=>{
      if(ok){ toast('Cloud Sync connected'); renderPage(); }
      else if(statusEl) statusEl.textContent = 'Could not connect — check your internet connection and try again.';
    }, false);
    return;
  }
  const raw = document.getElementById('cloudConfigInput').value.trim();
  const shopCode = document.getElementById('cloudShopIdInput').value.trim() || 'default-shop';
  const parsed = parseFlexibleConfig(raw);
  if(!parsed){ statusEl.textContent = 'Could not read that config. Paste the whole firebaseConfig block Firebase gave you (it\'s fine to include "const firebaseConfig = ...;").'; return; }
  const cfg = parsed.firebaseConfig ? parsed.firebaseConfig : parsed;
  if(!cfg.apiKey || !cfg.projectId){ statusEl.textContent = 'That config is missing apiKey/projectId — make sure you copied the full block from Firebase.'; return; }
  const finalShopId = parsed.shopId || shopCode;
  statusEl.textContent = 'Connecting…';
  connectCloud(cfg, finalShopId, (ok)=>{
    if(ok){ toast('Cloud Sync connected'); renderPage(); }
    else statusEl.textContent = 'Could not connect — check the config and try again.';
  }, false);
}
function onDisconnectCloud(){
  if(!confirm('Disconnect this device from Cloud Sync? It will go back to using only local data on this device.')) return;
  disconnectCloud();
  toast('Disconnected — back to local-only mode');
  renderPage();
}
function copyConnectionInfo(){
  const saved = getCloudConfig();
  if(!saved){ toast('Not connected'); return; }
  const text = JSON.stringify({firebaseConfig: saved.firebaseConfig, shopId: saved.shopId});
  navigator.clipboard.writeText(text).then(()=>{
    toast('Copied — paste this into the Firebase config box on the other device');
  }).catch(()=>{
    prompt('Copy this text and paste it into the Firebase config box on the other device:', text);
  });
}
function saveSettings(){
  settings.shopName = document.getElementById('stgName').value.trim() || settings.shopName;
  settings.location = document.getElementById('stgLoc').value.trim();
  settings.phone = document.getElementById('stgPhone').value.trim();
  settings.currency = document.getElementById('stgCurrency').value.trim() || '₦';
  saveData('settings', settings);
  cloudSetSettings();
  document.getElementById('sbShopName').textContent = settings.shopName;
  document.getElementById('sbShopLoc').textContent = settings.location;
  toast('Shop details saved');
  renderPage();
}
function saveDefaults(){
  settings.lowStockDefault = Number(document.getElementById('stgLowStock').value)||5;
  saveData('settings', settings);
  cloudSetSettings();
  toast('Defaults saved');
}

/* ---- Staff account management ---- */
function renderStaffList(){
  const el = document.getElementById('staffList');
  if(!el) return;
  el.innerHTML = staff.map(s=>`
    <div style="display:flex;gap:8px;align-items:center;padding:7px 0;border-bottom:1px solid var(--border);">
      <input type="text" value="${s.name}" style="flex:1;" onchange="updateStaff('${s.id}','name',this.value)">
      <input type="text" value="${s.pin||''}" placeholder="PIN" style="width:80px;" onchange="updateStaff('${s.id}','pin',this.value)">
      <select style="width:90px;" onchange="updateStaff('${s.id}','role',this.value)">
        <option value="staff" ${s.role==='staff'?'selected':''}>Staff</option>
        <option value="admin" ${s.role==='admin'?'selected':''}>Admin</option>
      </select>
      <button class="btn btn-danger btn-sm" onclick="removeStaff('${s.id}')">✕</button>
    </div>
  `).join('');
}
function addStaff(){
  const name = document.getElementById('newStaffName').value.trim();
  const pin = document.getElementById('newStaffPin').value.trim();
  const role = document.getElementById('newStaffRole').value;
  if(!name){ toast('Enter a staff name'); return; }
  const newStaff = {id:uid(), name, pin, role};
  staff.push(newStaff);
  saveData('staff', staff);
  cloudSet('staff', newStaff);
  document.getElementById('newStaffName').value='';
  document.getElementById('newStaffPin').value='';
  renderStaffList();
  toast('Staff account added');
}
function updateStaff(id, field, val){
  const s = staff.find(x=>x.id===id);
  s[field] = val;
  saveData('staff', staff);
  cloudSet('staff', s);
  if(currentStaff && currentStaff.id===id) currentStaff = s;
  renderStaffList(); renderUserChip();
}
function removeStaff(id){
  if(staff.length<=1){ toast('You need at least one staff account'); return; }
  if(!confirm('Remove this staff account?')) return;
  staff = staff.filter(s=>s.id!==id);
  saveData('staff', staff);
  cloudDelete('staff', id);
  renderStaffList();
}

/* ================= RECEIPT PRINTING ================= */
function printReceipt(recs){
  if(!Array.isArray(recs)) recs=[recs];
  const f=recs[0]; const total=sum(recs,'amount');
  const el=document.getElementById('printableReceipt');
  el.innerHTML = `
    <h3>${esc(settings.shopName)}</h3>
    <div class="c">${esc(settings.location)}</div>
    ${settings.phone? `<div class="c">${esc(settings.phone)}</div>`:''}
    <hr>
    <div>Receipt: #${esc(f.receipt||'')}</div>
    <div>Date: ${esc(f.date)} ${esc(f.time)}</div>
    ${f.customer? `<div>Customer: ${esc(f.customer)}</div>`:''}
    ${f.staff? `<div>Served by: ${esc(f.staff)}</div>`:''}
    <hr>
    <table style="width:100%;">
      ${recs.map(r=>`<tr><td>${esc(r.service)}${r.qty && r.qty!=1 ? '<br><small>'+esc(r.qty)+' × '+fmt(r.unitPrice)+'</small>':''}</td><td style="text-align:right;vertical-align:top;">${fmt(r.amount)}</td></tr>`).join('')}
    </table>
    <hr>
    <table style="width:100%;font-weight:bold;"><tr><td>TOTAL</td><td style="text-align:right;">${fmt(total)}</td></tr></table>
    ${f.payment==='credit'?`<table style="width:100%;"><tr><td>Paid now</td><td style="text-align:right;">${fmt(sum(recs.map(r=>({v:paidOf(r)})),'v'))}</td></tr><tr><td><b>Balance owing</b></td><td style="text-align:right;"><b>${fmt(sum(recs.map(r=>({v:outstandingOf(r)})),'v'))}</b></td></tr>${f.dueDate?`<tr><td>Pay by</td><td style="text-align:right;">${esc(f.dueDate)}</td></tr>`:''}</table>`:''}
    <div style="margin-top:4px;">Payment: ${f.payment==='credit'?'OWING (to be paid later)':esc(f.payment.toUpperCase())}</div>
    <hr>
    <div class="c">Thank you for choosing Highspeed!</div>`;
  setTimeout(()=>window.print(), 100);
}

/* ================= MODAL ================= */
function openModal(html){
  document.getElementById('modalBox').innerHTML = html;
  document.getElementById('modalBackdrop').classList.add('open');
}
function closeModal(){ document.getElementById('modalBackdrop').classList.remove('open'); }
document.getElementById('modalBackdrop').addEventListener('click', (e)=>{
  if(e.target.id==='modalBackdrop') closeModal();
});

/* ================= CLOCK & NETWORK STATUS ================= */
function tickClock(){
  const d = new Date();
  document.getElementById('clockTime').textContent = d.toLocaleTimeString();
  document.getElementById('clockDate').textContent = d.toLocaleDateString(undefined,{weekday:'short', day:'numeric', month:'short', year:'numeric'});
}
setInterval(tickClock, 1000);

function updateNetPill(){
  const pill = document.getElementById('netPill');
  const text = document.getElementById('netPillText');
  if(navigator.onLine){ pill.classList.remove('offline'); text.textContent='Online'; }
  else{ pill.classList.add('offline'); text.textContent='Offline — saving locally'; }
}
window.addEventListener('online', updateNetPill);
window.addEventListener('offline', updateNetPill);

/* ================= LOGIN SCREEN (multi-staff) ================= */
function showLockScreen(){
  document.getElementById('lockScreen').style.display='flex';
  document.getElementById('app').style.display='none';
  renderStaffPicker();
}
function renderStaffPicker(){
  const card = document.getElementById('lockCard');
  card.innerHTML = `
    <div class="bars"><span></span><span></span><span></span></div>
    <h2 style="margin:6px 0 2px;">${settings.shopName}</h2>
    <div class="sub" style="color:#8B96A5;font-size:12px;margin-bottom:6px;">Who's signing in?</div>
    <div class="staffpicker">
      ${staff.map(s=>{
        const initials = s.name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
        return `
        <button class="staffbtn" onclick="selectStaff('${s.id}')">
          <div class="av">${initials}</div>
          <div><div class="sn">${s.name}</div><div class="sr">${s.role}</div></div>
        </button>`;
      }).join('')}
    </div>
  `;
}
function selectStaff(id){
  const s = staff.find(x=>x.id===id);
  if(!s) return;
  if(!s.pin){
    currentStaff = s;
    enterApp();
    return;
  }
  const card = document.getElementById('lockCard');
  card.innerHTML = `
    <div class="bars"><span></span><span></span><span></span></div>
    <h2 style="margin:6px 0 2px;">${s.name}</h2>
    <div class="sub" style="color:#8B96A5;font-size:12px;margin-bottom:16px;">Enter PIN to continue</div>
    <input type="password" id="lockPin" inputmode="numeric" placeholder="••••" style="text-align:center;font-size:20px;letter-spacing:6px;" autofocus>
    <div id="lockError" style="color:#EA5B5E;font-size:12px;margin-top:8px;height:14px;"></div>
    <button class="btn btn-cyan btn-block" style="margin-top:6px;" onclick="tryStaffPin('${s.id}')">Unlock</button>
    <button class="btn btn-ghost btn-block" style="margin-top:6px;" onclick="renderStaffPicker()">Back</button>
  `;
  document.getElementById('lockPin').focus();
}
function tryStaffPin(id){
  const s = staff.find(x=>x.id===id);
  const val = document.getElementById('lockPin').value;
  if(val === s.pin){
    currentStaff = s;
    enterApp();
  } else {
    document.getElementById('lockError').textContent = 'Incorrect PIN';
  }
}
document.addEventListener('keydown', (e)=>{
  if(e.key==='Enter' && document.getElementById('lockScreen').style.display!=='none' && document.getElementById('lockPin')) {
    const btn = document.querySelector('#lockCard .btn-cyan');
    if(btn) btn.click();
  }
});
function enterApp(){
  document.getElementById('lockScreen').style.display='none';
  document.getElementById('app').style.display='flex';
  if(isAdmin() && (!cloudMode || stationsLoaded)) maybeTrimStations();
  renderNav();
  go('dashboard');
}
let stationsLoaded = false;
/* One-time: reduce the shop to 4 stations (admin only). Active sessions are never removed. */
function maybeTrimStations(){
  if(settings.stationsTrimmed) return;
  if(stations.length>4){
    const sorted = stations.slice().sort((a,b)=>a.name.localeCompare(b.name,undefined,{numeric:true}));
    const keep = sorted.filter((x,i)=> i<4 || x.status==='active');
    const drop = sorted.filter(x=>!keep.includes(x));
    stations = keep; saveData('stations',stations);
    drop.forEach(x=>cloudDelete('stations',x.id));
    toast('Stations reduced to '+keep.length);
  }
  settings.stationsTrimmed = true; saveData('settings',settings); cloudSetSettings();
}
function logoutStaff(){
  currentStaff = null;
  showLockScreen();
}

/* ================= BOOT ================= */
function boot(){
  updateNetPill();
  tickClock();
  document.getElementById('sbShopName').textContent = settings.shopName;
  document.getElementById('sbShopLoc').textContent = settings.location;
  initCloudFromSaved(()=>{
    // re-apply shop name/location in case cloud settings differ from local cache
    document.getElementById('sbShopName').textContent = settings.shopName;
    document.getElementById('sbShopLoc').textContent = settings.location;
    showLockScreen();
  });
}
boot();
