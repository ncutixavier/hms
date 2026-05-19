/* ============================================
   INYAMBO HOTEL MANAGEMENT SYSTEM — app.js
   All data, logic, and interactivity
   ============================================ */

'use strict';

/* ── CONSTANTS ─────────────────────────────── */
const TODAY = '2026-05-19';

const AVA_BG = ['#1a3328','#122030','#2e1f06','#2a1840','#2e1212','#1a1f3d'];
const AVA_CO = ['#4ade90','#60a5fa','#fbbf24','#c084fc','#f87171','#818cf8'];

const CH_LBL = { direct:'Direct', airbnb:'Airbnb', booking:'Booking.com', expedia:'Expedia', walkin:'Walk-in' };
const CH_CLS = { direct:'ch-direct', airbnb:'ch-airbnb', booking:'ch-booking', expedia:'ch-expedia', walkin:'ch-walkin' };
const CH_IC  = { direct:'ti-building', airbnb:'ti-home', booking:'ti-world', expedia:'ti-plane', walkin:'ti-walk' };

const ST_BK_LBL = { confirmed:'Confirmed', pending:'Pending', checked_in:'Checked in', cancelled:'Cancelled' };
const ST_BK_CLS = { confirmed:'bg2', pending:'ba2', checked_in:'bb2', cancelled:'br2' };

const RM_PILL_CLS = { avail:'s-avail', occ:'s-occ', res:'s-res', cln:'s-cln', mnt:'s-mnt' };
const RM_LBL      = { avail:'Available', occ:'Occupied', res:'Reserved', cln:'Cleaning', mnt:'Maintenance' };

const ORD_NXT = { new:'preparing', preparing:'ready', ready:'delivered' };
const ORD_NL  = { new:'Mark preparing', preparing:'Mark ready', ready:'Mark delivered' };
const ORD_SP  = { new:'ba2', preparing:'bb2', ready:'bg2', delivered:'' };
const ORD_SL  = { new:'New', preparing:'Preparing', ready:'Ready', delivered:'Delivered' };

const PAGES = {
  dashboard: { t:'Dashboard',       s:'May 19, 2026',                  cta:'New Booking' },
  rooms:     { t:'Rooms',           s:'Manage all hotel rooms',         cta:'Add Room' },
  bookings:  { t:'Bookings',        s:'All reservations',               cta:'New Booking' },
  checkin:   { t:'Check-in/out',    s:'Guest arrivals & departures',     cta:'Check In' },
  guests:    { t:'Guests',          s:'Guest profiles & history',        cta:'Add Guest' },
  restaurant:{ t:'Restaurant POS',  s:'Dine-in & room service',          cta:'New Order' },
  bar:       { t:'Bar POS',         s:'Bar sales & tabs',                cta:'New Tab' },
  orders:    { t:'Orders',          s:'Track all orders',                cta:'New Order' },
  billing:   { t:'Billing',         s:'Invoices & payments',             cta:'New Invoice' },
  reports:   { t:'Reports',         s:'Analytics & exports',             cta:'Export All' },
  expenses:  { t:'Expenses',        s:'Cost management',                 cta:'Add Expense' },
  staff:     { t:'Staff',           s:'Team roles & permissions',         cta:'Add Staff' },
  inventory: { t:'Inventory',       s:'Stock levels & alerts',           cta:'Add Item' },
  settings:  { t:'Settings',        s:'System configuration',            cta:'' },
};

const HOTEL_ACCOUNTS = [
  {
    id: 'inyambo',
    name: 'Inyambo Hotel',
    location: 'Kigali · Nyarutarama',
    rooms: 17,
    occupancy: '85%',
    revenue: '850k',
    initials: 'IH',
  },
  {
    id: 'lakeview',
    name: 'Lakeview Suites',
    location: 'Rubavu · Lake Kivu',
    rooms: 24,
    occupancy: '72%',
    revenue: '1.1M',
    initials: 'LS',
  },
  {
    id: 'akagera',
    name: 'Akagera Lodge',
    location: 'Kayonza · Eastern Province',
    rooms: 13,
    occupancy: '61%',
    revenue: '620k',
    initials: 'AL',
  },
];

const ROLE_LABELS = {
  admin:'Admin / Manager', receptionist:'Receptionist', cashier:'Cashier',
  housekeeping:'Housekeeping', kitchen:'Kitchen / Chef', bar:'Bartender', security:'Security',
};
const ROLE_COLORS = {
  admin:'#4ade90', receptionist:'#60a5fa', cashier:'#fbbf24',
  housekeeping:'#c084fc', kitchen:'#fb923c', bar:'#f87171', security:'#94a3b8',
};
const ROLE_BG = {
  admin:'#1a3328', receptionist:'#122030', cashier:'#2e1f06',
  housekeeping:'#2a1840', kitchen:'#2e1a0a', bar:'#2e1212', security:'#1a1f2e',
};
const PERMISSIONS = {
  admin:        ['Dashboard','Manage rooms','Manage bookings','Check-in/out','Restaurant POS','Bar POS','Orders','Billing','Reports','Expenses','Staff','Inventory'],
  receptionist: ['Dashboard','Bookings','Check-in/out','View rooms','Orders'],
  cashier:      ['Dashboard','Restaurant POS','Bar POS','Billing','Orders'],
  housekeeping: ['Dashboard','View rooms','Update room status'],
  kitchen:      ['Orders','Update order status'],
  bar:          ['Bar POS','Orders','Update order status'],
  security:     ['Dashboard','View guests'],
};

const INV_CAT_LABELS = { housekeeping:'Housekeeping', kitchen:'Kitchen', bar:'Bar', laundry:'Laundry', maintenance:'Maintenance' };

const ORD_MENU = {
  restaurant: [
    {name:'Grilled Chicken',price:18000},{name:'Garden Salad',price:8000},
    {name:'Beef Brochette',price:25000},{name:'Tilapia Fillet',price:22000},
    {name:'Pasta Carbonara',price:14000},{name:'Chocolate Cake',price:7000},
  ],
  bar: [
    {name:'Mojito',price:8000},{name:'Primus Beer',price:2500},
    {name:'Red Wine',price:12000},{name:'Whisky on ice',price:10000},
    {name:'Gin & Tonic',price:9000},{name:'Fresh Juice',price:4500},
  ],
};

/* ── DATA ──────────────────────────────────── */
let rooms = [
  {id:1,num:'101',floor:1,type:'Single',status:'occ',price:45000,guests:1,guest:'John Mugisha',notes:''},
  {id:2,num:'102',floor:1,type:'Single',status:'avail',price:45000,guests:1,guest:'',notes:''},
  {id:3,num:'103',floor:1,type:'Double',status:'occ',price:80000,guests:2,guest:'Marie & Paul',notes:''},
  {id:4,num:'104',floor:1,type:'Double',status:'res',price:80000,guests:2,guest:'Check-in May 21',notes:''},
  {id:5,num:'105',floor:1,type:'Twin',status:'cln',price:65000,guests:2,guest:'',notes:'Post-checkout clean'},
  {id:6,num:'201',floor:2,type:'Deluxe',status:'occ',price:120000,guests:2,guest:'David Nkusi',notes:''},
  {id:7,num:'202',floor:2,type:'Deluxe',status:'avail',price:120000,guests:2,guest:'',notes:''},
  {id:8,num:'203',floor:2,type:'Twin',status:'occ',price:65000,guests:2,guest:'Sarah Kim',notes:''},
  {id:9,num:'204',floor:2,type:'Double',status:'occ',price:75000,guests:2,guest:'Ange Uwase',notes:''},
  {id:10,num:'205',floor:2,type:'Single',status:'avail',price:45000,guests:1,guest:'',notes:''},
  {id:11,num:'301',floor:3,type:'Suite',status:'res',price:200000,guests:3,guest:'VIP · May 22',notes:'VIP guest'},
  {id:12,num:'302',floor:3,type:'Suite',status:'occ',price:200000,guests:3,guest:'James Osei',notes:''},
  {id:13,num:'303',floor:3,type:'Double',status:'mnt',price:80000,guests:2,guest:'',notes:'Plumbing repair'},
  {id:14,num:'304',floor:3,type:'Single',status:'avail',price:45000,guests:1,guest:'',notes:''},
  {id:15,num:'305',floor:3,type:'Deluxe',status:'occ',price:110000,guests:2,guest:'Fatou Diallo',notes:''},
  {id:16,num:'401',floor:4,type:'Suite',status:'avail',price:220000,guests:4,guest:'',notes:'Penthouse'},
  {id:17,num:'402',floor:4,type:'Suite',status:'occ',price:220000,guests:4,guest:'Chen Group',notes:'Corporate'},
];

let bookings = [
  {id:1,gid:1,guest:'John Mugisha',channel:'direct',extref:'',room:'101',type:'Single',gcount:1,checkin:'2026-05-17',checkout:'2026-05-20',rate:45000,status:'checked_in',notes:''},
  {id:2,gid:2,guest:'Marie & Paul Noel',channel:'airbnb',extref:'AIR-928374',room:'103',type:'Double',gcount:2,checkin:'2026-05-18',checkout:'2026-05-22',rate:80000,status:'confirmed',notes:'Honeymoon'},
  {id:3,gid:3,guest:'David Nkusi',channel:'booking',extref:'BDC-110293',room:'201',type:'Deluxe',gcount:1,checkin:'2026-05-15',checkout:'2026-05-21',rate:120000,status:'checked_in',notes:'Corporate'},
  {id:4,gid:4,guest:'Sarah Kim',channel:'direct',extref:'',room:'203',type:'Twin',gcount:2,checkin:'2026-05-19',checkout:'2026-05-22',rate:65000,status:'checked_in',notes:''},
  {id:5,gid:5,guest:'Ange Uwase',channel:'direct',extref:'',room:'204',type:'Double',gcount:1,checkin:'2026-05-19',checkout:'2026-05-23',rate:75000,status:'confirmed',notes:'Early check-in'},
  {id:6,gid:null,guest:'VIP Guest',channel:'expedia',extref:'EXP-774412',room:'301',type:'Suite',gcount:2,checkin:'2026-05-22',checkout:'2026-05-25',rate:200000,status:'confirmed',notes:'VIP'},
  {id:7,gid:6,guest:'James Osei',channel:'booking',extref:'BDC-998812',room:'302',type:'Suite',gcount:3,checkin:'2026-05-16',checkout:'2026-05-20',rate:200000,status:'checked_in',notes:''},
  {id:8,gid:7,guest:'Fatou Diallo',channel:'airbnb',extref:'AIR-112233',room:'305',type:'Deluxe',gcount:2,checkin:'2026-05-14',checkout:'2026-05-21',rate:110000,status:'checked_in',notes:'Vegetarian'},
  {id:9,gid:null,guest:'Chen Group',channel:'direct',extref:'',room:'402',type:'Suite',gcount:4,checkin:'2026-05-18',checkout:'2026-05-24',rate:220000,status:'confirmed',notes:'Corporate'},
  {id:10,gid:10,guest:'Pascal Habimana',channel:'walkin',extref:'',room:'102',type:'Single',gcount:1,checkin:'2026-05-19',checkout:'2026-05-21',rate:45000,status:'pending',notes:''},
  {id:11,gid:8,guest:'Amina Traoré',channel:'expedia',extref:'EXP-559923',room:'202',type:'Deluxe',gcount:2,checkin:'2026-05-24',checkout:'2026-05-28',rate:120000,status:'pending',notes:'Crib needed'},
  {id:12,gid:9,guest:'Lena Müller',channel:'airbnb',extref:'AIR-445566',room:'205',type:'Single',gcount:1,checkin:'2026-05-21',checkout:'2026-05-23',rate:45000,status:'confirmed',notes:''},
  {id:13,gid:null,guest:'Robert Kamanzi',channel:'direct',extref:'',room:'104',type:'Double',gcount:2,checkin:'2026-05-10',checkout:'2026-05-12',rate:80000,status:'cancelled',notes:'Flight cancelled'},
];

let guests = [
  {id:1,first:'John',last:'Mugisha',phone:'+250 788 001 001',email:'john@email.com',nat:'Rwandan',idno:'RW-001234',gender:'Male',dob:'1985-03-14',vip:'regular',prefs:'Non-smoking room',notes:'Frequent traveller',inhouse:true},
  {id:2,first:'Marie',last:'Noel',phone:'+33 6 12 34 56 78',email:'marie@email.com',nat:'French',idno:'FR-P882341',gender:'Female',dob:'1991-07-22',vip:'vip',prefs:'Champagne on arrival',notes:'Honeymoon',inhouse:true},
  {id:3,first:'David',last:'Nkusi',phone:'+250 722 003 003',email:'david@company.rw',nat:'Rwandan',idno:'RW-009876',gender:'Male',dob:'1979-11-05',vip:'corporate',prefs:'Early check-in',notes:'Corporate account',inhouse:true},
  {id:4,first:'Sarah',last:'Kim',phone:'+82 10 1234 5678',email:'sarah.kim@gmail.com',nat:'South Korean',idno:'KR-M12345678',gender:'Female',dob:'1993-04-30',vip:'regular',prefs:'Quiet floor',notes:'',inhouse:true},
  {id:5,first:'Ange',last:'Uwase',phone:'+250 733 005 005',email:'ange@email.com',nat:'Rwandan',idno:'RW-114422',gender:'Female',dob:'1998-09-12',vip:'regular',prefs:'',notes:'',inhouse:true},
  {id:6,first:'James',last:'Osei',phone:'+233 24 456 7890',email:'james@business.gh',nat:'Ghanaian',idno:'GH-P7654321',gender:'Male',dob:'1982-01-18',vip:'vip',prefs:'Suite only',notes:'Books 6x/year',inhouse:false},
  {id:7,first:'Fatou',last:'Diallo',phone:'+221 77 123 4567',email:'fatou@email.sn',nat:'Senegalese',idno:'SN-B334455',gender:'Female',dob:'1988-06-09',vip:'regular',prefs:'Vegetarian meals',notes:'',inhouse:false},
  {id:8,first:'Amina',last:'Traoré',phone:'+225 07 12 34 56',email:'amina@email.ci',nat:'Ivorian',idno:'CI-A556677',gender:'Female',dob:'1995-12-03',vip:'regular',prefs:'Crib needed',notes:'Travelling with infant',inhouse:false},
  {id:9,first:'Lena',last:'Müller',phone:'+49 151 2345 6789',email:'lena.m@email.de',nat:'German',idno:'DE-P991122',gender:'Female',dob:'1990-08-25',vip:'regular',prefs:'',notes:'First visit',inhouse:false},
  {id:10,first:'Pascal',last:'Habimana',phone:'+250 789 010 010',email:'',nat:'Rwandan',idno:'RW-228833',gender:'Male',dob:'2000-02-14',vip:'regular',prefs:'',notes:'Walk-in',inhouse:true},
];

const guestHistory = {
  1: [
    {ic:'ti-calendar',bg:'#1a3328',tc:'#4ade90',t:'Room 101 – Single',s:'May 17–20 · 3 nights · Direct',a:135000,d:'May 17'},
    {ic:'ti-tools-kitchen-2',bg:'#2e1f06',tc:'#fbbf24',t:'Restaurant order',s:'Beef Brochette, Fresh Juice',a:29500,d:'May 18'},
    {ic:'ti-beer',bg:'#122030',tc:'#60a5fa',t:'Bar tab',s:'Primus ×3, Mojito ×1',a:15500,d:'May 18'},
    {ic:'ti-calendar',bg:'#1a3328',tc:'#4ade90',t:'Room 101 – Single',s:'Apr 2–5 · 3 nights · Direct',a:135000,d:'Apr 2'},
  ],
  2: [
    {ic:'ti-calendar',bg:'#1a3328',tc:'#4ade90',t:'Room 103 – Double',s:'May 18–22 · 4 nights · Airbnb',a:320000,d:'May 18'},
    {ic:'ti-beer',bg:'#122030',tc:'#60a5fa',t:'Bar tab',s:'Champagne, Red Wine ×2',a:59000,d:'May 19'},
  ],
  3: [
    {ic:'ti-calendar',bg:'#1a3328',tc:'#4ade90',t:'Room 201 – Deluxe',s:'May 15–21 · 6 nights · Booking.com',a:720000,d:'May 15'},
    {ic:'ti-tools-kitchen-2',bg:'#2e1f06',tc:'#fbbf24',t:'Restaurant order',s:'Beef Brochette, Pasta',a:39000,d:'May 16'},
    {ic:'ti-calendar',bg:'#1a3328',tc:'#4ade90',t:'Room 201 – Deluxe',s:'Mar 10–14 · 4 nights · Direct',a:480000,d:'Mar 10'},
  ],
  6: [
    {ic:'ti-calendar',bg:'#1a3328',tc:'#4ade90',t:'Room 302 – Suite',s:'May 16–20 · 4 nights · Booking.com',a:800000,d:'May 16'},
    {ic:'ti-beer',bg:'#122030',tc:'#60a5fa',t:'Bar tab',s:'Whisky ×4, Gin & Tonic ×2',a:58000,d:'May 17'},
    {ic:'ti-calendar',bg:'#1a3328',tc:'#4ade90',t:'Room 401 – Suite',s:'Feb 20–24 · 4 nights · Direct',a:880000,d:'Feb 20'},
  ],
};

let orders = [
  {id:1,room:'203',guest:'Sarah Kim',type:'room',source:'restaurant',status:'new',time:'2m',items:[{name:'Grilled Chicken',qty:1,price:18000},{name:'Garden Salad',qty:2,price:16000}],total:34000},
  {id:2,room:'302',guest:'James Osei',type:'room',source:'bar',status:'new',time:'5m',items:[{name:'Mojito',qty:2,price:16000},{name:'Primus Beer',qty:3,price:7500}],total:23500},
  {id:3,room:'',guest:'Walk-in · Table 3',type:'walkin',source:'restaurant',status:'new',time:'8m',items:[{name:'Beef Brochette',qty:2,price:50000}],total:50000},
  {id:4,room:'101',guest:'John Mugisha',type:'room',source:'restaurant',status:'preparing',time:'14m',items:[{name:'Tilapia Fillet',qty:1,price:22000}],total:22000},
  {id:5,room:'',guest:'Walk-in · Bar',type:'walkin',source:'bar',status:'preparing',time:'19m',items:[{name:'Red Wine',qty:2,price:24000}],total:24000},
  {id:6,room:'305',guest:'Fatou Diallo',type:'room',source:'restaurant',status:'ready',time:'26m',items:[{name:'Pasta Carbonara',qty:1,price:14000}],total:14000},
  {id:7,room:'',guest:'Walk-in · Table 7',type:'walkin',source:'restaurant',status:'ready',time:'33m',items:[{name:'Garden Salad',qty:3,price:24000}],total:24000},
  {id:8,room:'201',guest:'David Nkusi',type:'room',source:'bar',status:'delivered',time:'45m',items:[{name:'Whisky on ice',qty:2,price:20000}],total:20000},
];

let staff = [
  {id:1,first:'Alice',last:'Uwimana',phone:'+250 788 100 001',email:'alice@inyambo.rw',role:'admin',shift:'Full day',start:'2023-01-15',salary:800000},
  {id:2,first:'Bruno',last:'Nzabahimana',phone:'+250 788 100 002',email:'bruno@inyambo.rw',role:'receptionist',shift:'Day (6am–2pm)',start:'2024-03-01',salary:350000},
  {id:3,first:'Clarisse',last:'Mukamana',phone:'+250 788 100 003',email:'clarisse@inyambo.rw',role:'cashier',shift:'Afternoon (2pm–10pm)',start:'2024-05-10',salary:300000},
  {id:4,first:'Denis',last:'Habimana',phone:'+250 788 100 004',email:'denis@inyambo.rw',role:'housekeeping',shift:'Day (6am–2pm)',start:'2023-08-01',salary:250000},
  {id:5,first:'Esperance',last:'Iribagiza',phone:'+250 788 100 005',email:'espe@inyambo.rw',role:'kitchen',shift:'Day (6am–2pm)',start:'2023-11-20',salary:320000},
  {id:6,first:'Frank',last:'Nkurunziza',phone:'+250 788 100 006',email:'frank@inyambo.rw',role:'bar',shift:'Afternoon (2pm–10pm)',start:'2024-01-08',salary:300000},
];

let inventory = [
  {id:1,name:'Toilet paper rolls',cat:'housekeeping',unit:'rolls',qty:8,min:30,supplier:'Kigali Supplies',cost:500},
  {id:2,name:'Hand soap (500ml)',cat:'housekeeping',unit:'bottles',qty:18,min:40,supplier:'CleanPro RW',cost:2500},
  {id:3,name:'Shampoo sachets',cat:'housekeeping',unit:'sachets',qty:120,min:80,supplier:'CleanPro RW',cost:300},
  {id:4,name:'Towels (bath)',cat:'housekeeping',unit:'pieces',qty:60,min:30,supplier:'Textile House',cost:8000},
  {id:5,name:'Bedsheets (sets)',cat:'housekeeping',unit:'sets',qty:45,min:25,supplier:'Textile House',cost:12000},
  {id:6,name:'Primus Beer (crate)',cat:'bar',unit:'crates',qty:3,min:10,supplier:'Bralirwa',cost:25000},
  {id:7,name:'Red Wine (bottle)',cat:'bar',unit:'bottles',qty:24,min:20,supplier:'Vintages RW',cost:18000},
  {id:8,name:'Whisky (bottle)',cat:'bar',unit:'bottles',qty:8,min:6,supplier:'Spirits Ltd',cost:45000},
  {id:9,name:'Soda (crate)',cat:'bar',unit:'crates',qty:12,min:8,supplier:'Bralirwa',cost:12000},
  {id:10,name:'Beef (kg)',cat:'kitchen',unit:'kg',qty:12,min:20,supplier:'Nyabugogo Market',cost:8000},
  {id:11,name:'Tilapia (kg)',cat:'kitchen',unit:'kg',qty:8,min:15,supplier:'Lake Fish RW',cost:6000},
  {id:12,name:'Cooking oil (5L)',cat:'kitchen',unit:'cans',qty:6,min:5,supplier:'Kigali Supplies',cost:12000},
  {id:13,name:'Rice (50kg bag)',cat:'kitchen',unit:'bags',qty:4,min:3,supplier:'Nyabugogo Market',cost:45000},
  {id:14,name:'Laundry detergent',cat:'laundry',unit:'kg',qty:24,min:10,supplier:'CleanPro RW',cost:3000},
  {id:15,name:'Fabric softener',cat:'laundry',unit:'liters',qty:15,min:8,supplier:'CleanPro RW',cost:4500},
  {id:16,name:'Light bulbs (LED)',cat:'maintenance',unit:'pieces',qty:30,min:20,supplier:'Electro RW',cost:2000},
  {id:17,name:'Paint (white, 4L)',cat:'maintenance',unit:'cans',qty:6,min:4,supplier:'Buildrite RW',cost:18000},
];

/* ── COUNTERS ─────────────────────────────── */
let nextRmId = 18, nextBkId = 14, nextGId = 11;
let nextOrdId = 9, nextStaffId = 7, nextInvId = 18;

/* ── STATE ────────────────────────────────── */
let curScreen = 'dashboard';
let editRmId = null, editBkId = null, editGId = null, editStaffId = null;
let delTarget = { type: '', id: null };
let floorView = true, rmFilter = 'all';
let bkStatusF = 'all', bkChF = 'all', bkView = 'list';
let calY = 2026, calM = 4;
let selGId = null, gFlt2 = 'all';
let ordFlt = 'all', ordSrc = 'all';
let selOrdItems = [];
let invCatF = 'all';
let posCart = { restaurant: {}, bar: {} };
let selectedHotel = HOTEL_ACCOUNTS[0];

/* ── HELPERS ──────────────────────────────── */
function ava(i) { return `background:${AVA_BG[i%6]};color:${AVA_CO[i%6]}`; }
function ini(n) { return n.split(' ').filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase(); }
function fmt(n) { return Math.round(n).toLocaleString(); }
function fmtD(d) {
  if (!d) return '—';
  const [y,m,dy] = d.split('-');
  return `${+dy} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+m-1]}`;
}
function nights(a, b) { return Math.max(0, Math.round((new Date(b) - new Date(a)) / 86400000)); }
function qni(id) { return document.querySelector(`.ni[onclick*="${id}"]`); }
function el(id) { return document.getElementById(id); }
function CM(id) { el(id).classList.remove('open'); }
function OM(id) { el(id).classList.add('open'); }

/* ── THEME ────────────────────────────────── */
function savedTheme() {
  try { return localStorage.getItem('hms-theme'); }
  catch (_) { return null; }
}

function persistTheme(theme) {
  try { localStorage.setItem('hms-theme', theme); }
  catch (_) {}
}

function setTheme(theme) {
  const nextTheme = theme === 'light' ? 'light' : 'dark';
  document.body.dataset.theme = nextTheme;
  persistTheme(nextTheme);

  const btn = el('theme-toggle');
  if (!btn) return;

  const isLight = nextTheme === 'light';
  btn.innerHTML = `<i class="ti ${isLight ? 'ti-moon' : 'ti-sun'}"></i>`;
  btn.title = isLight ? 'Switch to dark mode' : 'Switch to light mode';
  btn.setAttribute('aria-label', btn.title);
}

function initTheme() {
  const systemPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  setTheme(savedTheme() || (systemPrefersLight ? 'light' : 'dark'));
}

function toggleTheme() {
  setTheme(document.body.dataset.theme === 'light' ? 'dark' : 'light');
}

/* ── AUTH FLOW ────────────────────────────── */
function normalizePhone(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (digits.startsWith('250')) return `+${digits}`;
  return `+250${digits}`;
}

function setAuthStep(step) {
  document.querySelectorAll('.auth-card').forEach(card => card.classList.remove('active'));
  const target = el(step === 'hotels' ? 'auth-hotels' : 'auth-login');
  if (target) target.classList.add('active');
}

function renderHotelList() {
  const list = el('hotel-list');
  if (!list) return;
  list.innerHTML = HOTEL_ACCOUNTS.map(hotel => `
    <button class="hotel-option" onclick="selectHotel('${hotel.id}')">
      <div class="hotel-mark">${hotel.initials}</div>
      <div>
        <div class="hotel-name">${hotel.name}</div>
        <div class="hotel-meta">${hotel.location} · ${hotel.rooms} rooms</div>
        <div class="hotel-stats">
          <span class="bp bg2">${hotel.occupancy} occupied</span>
          <span class="bp bb2">${hotel.revenue} today</span>
        </div>
      </div>
    </button>
  `).join('');
}

function loginWithPhone(event) {
  event.preventDefault();
  const phone = normalizePhone(el('login-phone').value);
  if (phone.length < 13) {
    alert('Enter a valid phone number');
    return;
  }

  renderHotelList();
  if (HOTEL_ACCOUNTS.length > 1) {
    setAuthStep('hotels');
  } else {
    selectHotel(HOTEL_ACCOUNTS[0].id);
  }
}

function showLogin() {
  setAuthStep('login');
  const phone = el('login-phone');
  if (phone) phone.focus();
}

function selectHotel(id) {
  selectedHotel = HOTEL_ACCOUNTS.find(hotel => hotel.id === id) || HOTEL_ACCOUNTS[0];
  applySelectedHotel();
  document.body.classList.remove('auth-active');
  S('dashboard', qni('dashboard') || document.querySelector('.ni.active'));
}

function applySelectedHotel() {
  document.querySelectorAll('.sb-name, .auth-brand-name').forEach(node => {
    node.textContent = selectedHotel.name;
  });
  const footName = document.querySelector('.foot-name');
  if (footName) footName.textContent = 'Admin';
  const footRole = document.querySelector('.foot-role');
  if (footRole) footRole.textContent = selectedHotel.name;
}

/* ── NAVIGATION ──────────────────────────── */
function S(id, navEl) {
  curScreen = id;
  document.querySelectorAll('.screen, .flex-screen, .pos-screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.ni').forEach(n => n.classList.remove('active'));

  const sc = el('screen-' + id);
  if (sc) sc.classList.add('active');
  if (navEl) navEl.classList.add('active');

  const p = PAGES[id] || { t: id, s: '', cta: 'New' };
  el('pg-title').textContent = p.t;
  el('pg-sub').textContent = p.s;
  el('cta-lbl').textContent = p.cta;
  el('main-cta').style.display = p.cta ? 'flex' : 'none';

  if (id === 'rooms')     renderRooms();
  if (id === 'bookings')  { renderBookings(); renderCal(); }
  if (id === 'guests')    renderGuests();
  if (id === 'orders')    renderOrders();
  if (id === 'staff')     renderStaff();
  if (id === 'inventory') renderInventory();
}

function ctaClick() {
  const actions = {
    rooms:      openCreateRoom,
    bookings:   openCreateBk,
    guests:     openCreateGuest,
    orders:     () => OM('ovl-order'),
    staff:      openCreateStaff,
    inventory:  () => OM('ovl-inv'),
  };
  (actions[curScreen] || openCreateBk)();
}

function setCat(el) {
  el.closest('.cat-tabs').querySelectorAll('.ct2').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

/* ── ROOMS ────────────────────────────────── */
function renderRooms() {
  const c = el('rooms-container');
  const list = rmFilter === 'all' ? rooms : rooms.filter(r => r.status === rmFilter);
  if (!list.length) {
    c.innerHTML = '<div class="placeholder"><i class="ti ti-search"></i><span>No rooms match this filter</span></div>';
    return;
  }
  if (floorView) {
    const floors = [...new Set(list.map(r => r.floor))].sort();
    c.innerHTML = floors.map(f => {
      const fr = list.filter(r => r.floor === f);
      const av = fr.filter(r => r.status === 'avail').length;
      const oc = fr.filter(r => r.status === 'occ').length;
      return `<div class="floor-sec">
        <div class="floor-hdr">
          <div class="floor-chk"></div>
          <span class="floor-ttl">Floor ${f}</span>
          <span class="floor-cnt">${fr.length} room${fr.length !== 1 ? 's' : ''}</span>
          <div class="floor-stats-r">
            <span class="fstat"><div class="fsd" style="background:#4ade90"></div>${av} free</span>
            <span class="fstat"><div class="fsd" style="background:#f87171"></div>${oc} occ.</span>
          </div>
        </div>
        <div class="room-grid">${fr.map(rmCard).join('')}</div>
      </div>`;
    }).join('');
  } else {
    c.innerHTML = `<div class="room-grid">${list.map(rmCard).join('')}</div>`;
  }
}

function rmCard(r) {
  const showGuest = r.guest && (r.status === 'occ' || r.status === 'res');
  const showPrice = r.status !== 'mnt' && r.status !== 'cln';
  const showNote  = r.notes && (r.status === 'mnt' || r.status === 'cln');
  return `<div class="rc ${r.status}">
    <div class="rc-acts">
      <button class="ra-b" onclick="event.stopPropagation();openEditRoom(${r.id})" title="Edit room ${r.num}"><i class="ti ti-edit"></i></button>
      <button class="ra-b del" onclick="event.stopPropagation();openDel('room',${r.id},'Delete Room ${r.num}?','Room data will be permanently removed.')" title="Delete"><i class="ti ti-trash"></i></button>
    </div>
    <div class="rc-num">${r.num}</div>
    <div class="rc-type">${r.type.toUpperCase()}</div>
    <span class="s-pill ${RM_PILL_CLS[r.status]}">${RM_LBL[r.status]}</span>
    ${showGuest ? `<div class="rc-guest">${r.guest}</div>` : ''}
    ${showPrice ? `<div class="rc-price">${Math.round(r.price / 1000)}k RWF</div>` : ''}
    ${showNote  ? `<div class="rc-note">${r.notes}</div>` : ''}
  </div>`;
}

function fRoom(f, el) {
  rmFilter = f;
  document.querySelectorAll('.fp-large:not(#floor-tog)').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  renderRooms();
}

function togFloor(el) {
  floorView = !floorView;
  el.classList.toggle('active', floorView);
  renderRooms();
}

function openCreateRoom() {
  editRmId = null;
  el('rm-modal-title').textContent = 'Add room';
  el('rm-save-btn').innerHTML = '<i class="ti ti-plus"></i> Add room';
  ['rm-num','rm-guest','rm-notes'].forEach(id => el(id).value = '');
  el('rm-floor').value = '1'; el('rm-type').value = 'Single';
  el('rm-status').value = 'avail'; el('rm-price').value = ''; el('rm-guests').value = '';
  OM('ovl-room');
}

function openEditRoom(id) {
  const r = rooms.find(x => x.id === id);
  if (!r) return;
  editRmId = id;
  el('rm-modal-title').textContent = `Edit Room ${r.num}`;
  el('rm-save-btn').innerHTML = '<i class="ti ti-check"></i> Save changes';
  el('rm-num').value = r.num; el('rm-floor').value = r.floor; el('rm-type').value = r.type;
  el('rm-status').value = r.status; el('rm-price').value = r.price; el('rm-guests').value = r.guests;
  el('rm-guest').value = r.guest; el('rm-notes').value = r.notes;
  OM('ovl-room');
}

function saveRoom() {
  const num = el('rm-num').value.trim();
  if (!num) { alert('Room number required'); return; }
  const d = {
    num, floor: +el('rm-floor').value, type: el('rm-type').value,
    status: el('rm-status').value, price: +el('rm-price').value || 0,
    guests: +el('rm-guests').value || 1, guest: el('rm-guest').value.trim(),
    notes: el('rm-notes').value.trim(),
  };
  if (editRmId) {
    const i = rooms.findIndex(x => x.id === editRmId);
    rooms[i] = { ...rooms[i], ...d };
  } else {
    rooms.push({ id: nextRmId++, ...d });
  }
  rooms.sort((a, b) => a.floor - b.floor || a.num.localeCompare(b.num));
  CM('ovl-room');
  renderRooms();
}

/* ── BOOKINGS ─────────────────────────────── */
function renderBookings() {
  const q = (el('bk-search') || {}).value || '';
  const list = bookings.filter(b =>
    (bkStatusF === 'all' || b.status === bkStatusF) &&
    (bkChF === 'all' || b.channel === bkChF) &&
    (!q || b.guest.toLowerCase().includes(q.toLowerCase()) || b.room.includes(q))
  );
  const tbody = el('bk-tbody');
  if (!tbody) return;
  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="9" style="padding:24px;text-align:center;color:var(--txt3)">No bookings found</td></tr>`;
    return;
  }
  tbody.innerHTML = list.map((b, i) => {
    const n = nights(b.checkin, b.checkout);
    return `<tr>
      <td><div class="booking-guest-cell">
        <div class="bg-avatar" style="${ava(i)}">${ini(b.guest)}</div>
        <div><div style="font-size:12px;font-weight:600">${b.guest}</div></div>
      </div></td>
      <td>${b.room}<div style="font-size:9px;color:var(--txt3)">${b.type}</div></td>
      <td>${fmtD(b.checkin)}</td>
      <td>${fmtD(b.checkout)}</td>
      <td style="text-align:center">${n}</td>
      <td><span class="${CH_CLS[b.channel]} ch-badge"><i class="ti ${CH_IC[b.channel]}"></i>${CH_LBL[b.channel]}</span>
      ${b.extref ? `<div style="font-size:9px;color:var(--txt3)">${b.extref}</div>` : ''}</td>
      <td><span class="bp ${ST_BK_CLS[b.status]}">${ST_BK_LBL[b.status]}</span></td>
      <td style="font-weight:700;white-space:nowrap">${fmt(n * b.rate)} RWF</td>
      <td><div class="row-acts">
        <button class="rac" onclick="openEditBk(${b.id})" title="Edit"><i class="ti ti-edit"></i></button>
        <button class="rac del" onclick="openDel('booking',${b.id},'Delete booking for ${b.guest}?','Record will be removed.')" title="Delete"><i class="ti ti-trash"></i></button>
      </div></td>
    </tr>`;
  }).join('');
}

function fBk(s, el) {
  bkStatusF = s;
  document.querySelectorAll('#screen-bookings .fp-sm:not([onclick*="fBkCh"])').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  renderBookings();
}

function fBkCh(c, el) {
  bkChF = c;
  document.querySelectorAll('#screen-bookings .fp-sm[onclick*="fBkCh"]').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  renderBookings();
}

function setBkView(v) {
  bkView = v;
  el('bk-list-view').style.display = v === 'list' ? 'block' : 'none';
  el('bk-cal-view').style.display  = v === 'cal'  ? 'block' : 'none';
  el('vt-lst').classList.toggle('active', v === 'list');
  el('vt-cal').classList.toggle('active', v === 'cal');
  if (v === 'cal') renderCal();
}

function renderCal() {
  const MN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const lbl = el('cal-lbl');
  if (!lbl) return;
  lbl.textContent = `${MN[calM]} ${calY}`;
  const fd = new Date(calY, calM, 1).getDay();
  const dm = new Date(calY, calM + 1, 0).getDate();
  const dp = new Date(calY, calM, 0).getDate();
  const tot = Math.ceil((fd + dm) / 7) * 7;
  let h = '';
  for (let i = 0; i < tot; i++) {
    let d, cls = 'cal-day', ds = '';
    if (i < fd) { d = dp - (fd - 1 - i); cls += ' om'; }
    else if (i >= fd + dm) { d = i - (fd + dm) + 1; cls += ' om'; }
    else {
      d = i - fd + 1;
      ds = `${calY}-${String(calM + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      if (ds === TODAY) cls += ' today';
    }
    const evs = ds ? bookings.filter(b => b.status !== 'cancelled' && b.checkin <= ds && b.checkout > ds).slice(0, 2) : [];
    h += `<div class="${cls}"><div class="cd">${d}</div>${evs.map(e => `<div class="ce ${CH_CLS[e.channel]}">${e.room}·${e.guest.split(' ')[0]}</div>`).join('')}</div>`;
  }
  el('cal-days').innerHTML = h;
}

function calPrev() { calM--; if (calM < 0) { calM = 11; calY--; } renderCal(); }
function calNext() { calM++; if (calM > 11) { calM = 0; calY++; } renderCal(); }

function togExtRef() {
  const ch = el('bk-channel').value;
  el('bk-extref-row').style.display = ['airbnb','booking','expedia'].includes(ch) ? 'flex' : 'none';
}

function calcTotal() {
  const ci = el('bk-cin').value, co = el('bk-cout').value;
  const r = +el('bk-rate').value || 0, n = nights(ci, co);
  const p = el('bk-total-preview');
  if (n > 0 && r > 0) {
    p.style.display = 'block';
    el('bk-total-val').textContent = `${fmt(n * r)} RWF (${n} night${n !== 1 ? 's' : ''})`;
  } else {
    p.style.display = 'none';
  }
}

function populateGuestDD() {
  const sel = el('bk-guest');
  if (!sel) return;
  sel.innerHTML = '<option value="">— select guest —</option>' +
    guests.map(g => `<option value="${g.id}">${g.first} ${g.last}${g.vip !== 'regular' ? ' ★' : ''}</option>`).join('');
}

function openCreateBk() {
  editBkId = null;
  el('bk-modal-title').textContent = 'New booking';
  el('bk-save-btn').innerHTML = '<i class="ti ti-check"></i> Save booking';
  populateGuestDD();
  ['bk-extref','bk-notes'].forEach(id => el(id).value = '');
  el('bk-channel').value = 'direct'; el('bk-status').value = 'confirmed';
  el('bk-cin').value = TODAY; el('bk-cout').value = '2026-05-22';
  el('bk-rate').value = ''; el('bk-gcount').value = '1';
  el('bk-total-preview').style.display = 'none';
  togExtRef();
  OM('ovl-bk');
}

function openEditBk(id) {
  const b = bookings.find(x => x.id === id);
  if (!b) return;
  editBkId = id;
  el('bk-modal-title').textContent = `Edit booking — ${b.guest}`;
  el('bk-save-btn').innerHTML = '<i class="ti ti-check"></i> Save changes';
  populateGuestDD();
  el('bk-guest').value = b.gid || '';
  el('bk-channel').value = b.channel; el('bk-extref').value = b.extref;
  el('bk-status').value = b.status; el('bk-cin').value = b.checkin;
  el('bk-cout').value = b.checkout; el('bk-rate').value = b.rate;
  el('bk-gcount').value = b.gcount; el('bk-notes').value = b.notes;
  togExtRef(); calcTotal();
  OM('ovl-bk');
}

function saveBk() {
  const gid = +el('bk-guest').value || null;
  const gobj = gid ? guests.find(x => x.id === gid) : null;
  const gname = gobj ? `${gobj.first} ${gobj.last}` :
    (editBkId ? bookings.find(x => x.id === editBkId)?.guest : 'Unknown Guest');
  const rv = el('bk-room').value;
  const rm = rv.split('—')[0].trim(), tp = (rv.split('—')[1] || '').trim();
  const d = {
    gid, guest: gname, channel: el('bk-channel').value,
    extref: el('bk-extref').value.trim(), room: rm, type: tp,
    gcount: +el('bk-gcount').value || 1,
    checkin: el('bk-cin').value, checkout: el('bk-cout').value,
    rate: +el('bk-rate').value || 0, status: el('bk-status').value,
    notes: el('bk-notes').value.trim(),
  };
  if (editBkId) {
    const i = bookings.findIndex(x => x.id === editBkId);
    bookings[i] = { ...bookings[i], ...d };
  } else {
    bookings.push({ id: nextBkId++, ...d });
  }
  CM('ovl-bk'); renderBookings();
}

/* ── GUESTS ───────────────────────────────── */
function renderGuests() {
  const q = (el('g-search') || {}).value || '';
  const list = guests.filter(g => {
    const nm = `${g.first} ${g.last}`.toLowerCase();
    const qok = !q || nm.includes(q) || g.phone.includes(q) || g.email.toLowerCase().includes(q);
    const hist = guestHistory[g.id] || [];
    const fok = gFlt2 === 'all' ||
      (gFlt2 === 'vip' && g.vip !== 'regular') ||
      (gFlt2 === 'inhouse' && g.inhouse) ||
      (gFlt2 === 'returning' && hist.filter(h => h.ic === 'ti-calendar').length > 1);
    return qok && fok;
  });
  const container = el('g-list');
  if (!container) return;
  if (!list.length) {
    container.innerHTML = '<div style="padding:20px;text-align:center;font-size:12px;color:var(--txt3)">No guests found</div>';
    return;
  }
  container.innerHTML = list.map((g, i) => {
    const hist = guestHistory[g.id] || [];
    const bc = hist.filter(h => h.ic === 'ti-calendar').length;
    const ts = hist.reduce((s, h) => s + h.a, 0);
    return `<div class="g-row${g.id === selGId ? ' sel' : ''}" onclick="selGuest(${g.id})">
      <div class="g-ava" style="${ava(i)}">${ini(g.first + ' ' + g.last)}</div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap">
          <span class="g-nm">${g.first} ${g.last}</span>
          ${g.vip === 'vip'       ? '<span class="bp bv2" style="font-size:8px">VIP</span>' : ''}
          ${g.vip === 'corporate' ? '<span class="bp bb2" style="font-size:8px">Corp</span>' : ''}
          ${g.inhouse             ? '<span class="bp bg2" style="font-size:8px">In</span>' : ''}
        </div>
        <div class="g-mt">${g.phone || g.email || 'No contact'}</div>
        <div class="g-mt">${bc} stay${bc !== 1 ? 's' : ''} · ${ts ? fmt(Math.round(ts / 1000)) + 'k RWF' : ''}</div>
      </div>
    </div>`;
  }).join('');
}

function selGuest(id) {
  selGId = id;
  renderGuests();
  const g = guests.find(x => x.id === id);
  if (!g) return;
  const gi = guests.indexOf(g);
  const hist = guestHistory[id] || [];
  const bks = hist.filter(h => h.ic === 'ti-calendar');
  const ts = hist.reduce((s, h) => s + h.a, 0);

  el('g-empty').style.display = 'none';
  const det = el('g-det');
  det.style.display = 'block';

  const pt = g.prefs
    ? g.prefs.split(',').map(p => `<span class="pref-t"><i class="ti ti-check"></i>${p.trim()}</span>`).join('')
    : '<span style="font-size:11px;color:var(--txt3)">None recorded</span>';

  det.innerHTML = `
    <div class="g-ph">
      <div class="g-ava-lg" style="${ava(gi)}">${ini(g.first + ' ' + g.last)}</div>
      <div class="g-info">
        <div class="g-fullname">
          ${g.first} ${g.last}
          ${g.vip === 'vip'       ? '<span class="bp bv2">VIP</span>' : ''}
          ${g.vip === 'corporate' ? '<span class="bp bb2">Corporate</span>' : ''}
          ${g.inhouse             ? '<span class="bp bg2">In-house</span>' : ''}
        </div>
        <div class="g-ir"><i class="ti ti-phone"></i>${g.phone || '—'}</div>
        <div class="g-ir"><i class="ti ti-mail"></i>${g.email || '—'}</div>
        <div class="g-ir"><i class="ti ti-world"></i>${g.nat || '—'} &nbsp;·&nbsp; <i class="ti ti-id-badge"></i>${g.idno || '—'}</div>
      </div>
      <div class="g-ph-actions">
        <button class="tbb" onclick="openEditGuest(${g.id})" style="font-size:11px;padding:5px 11px"><i class="ti ti-edit"></i> Edit</button>
        <button class="tbb p" onclick="openCreateBk()" style="font-size:11px;padding:5px 11px"><i class="ti ti-calendar"></i> Book</button>
        <button class="tbb" onclick="openDel('guest',${g.id},'Delete ${g.first} ${g.last}?','Profile removed. Booking history is preserved.')" style="font-size:11px;padding:5px 11px;color:var(--red)"><i class="ti ti-trash"></i></button>
      </div>
    </div>
    <div class="stm">
      <div class="stm-c"><div class="stm-v">${bks.length}</div><div class="stm-l">Stays</div></div>
      <div class="stm-c"><div class="stm-v">${fmt(Math.round(ts / 1000))}k</div><div class="stm-l">Total RWF</div></div>
      <div class="stm-c"><div class="stm-v">${bks.length * 3}</div><div class="stm-l">Nights</div></div>
    </div>
    <div style="margin-bottom:14px">
      <div class="sec-t">Preferences</div>
      <div>${pt}</div>
      ${g.notes ? `<div style="font-size:12px;color:var(--txt2);margin-top:7px;padding:7px 10px;background:var(--bg3);border-radius:7px">${g.notes}</div>` : ''}
    </div>
    <div>
      <div class="sec-t">Service history</div>
      ${hist.length
        ? hist.map(h => `<div class="hi">
            <div class="h-ic" style="background:${h.bg}"><i class="ti ${h.ic}" style="color:${h.tc}"></i></div>
            <div class="h-b"><div class="h-t">${h.t}</div><div class="h-s">${h.s}</div></div>
            <div class="h-r"><div class="h-a">${fmt(h.a)} RWF</div><div class="h-d">${h.d}</div></div>
          </div>`).join('')
        : '<div style="padding:14px;text-align:center;font-size:12px;color:var(--txt3)">No history yet</div>'
      }
    </div>`;
}

function gFlt(f, el) {
  gFlt2 = f;
  document.querySelectorAll('.g-list-pnl .fp-sm').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  renderGuests();
}

function openCreateGuest() {
  editGId = null;
  el('g-modal-title').textContent = 'Add guest';
  el('g-save-btn').innerHTML = '<i class="ti ti-check"></i> Save guest';
  ['gf-first','gf-last','gf-phone','gf-email','gf-nat','gf-id','gf-prefs','gf-notes'].forEach(id => {
    const e = el(id); if (e) e.value = '';
  });
  el('gf-gender').value = ''; el('gf-vip').value = 'regular'; el('gf-dob').value = '';
  OM('ovl-guest');
}

function openEditGuest(id) {
  const g = guests.find(x => x.id === id);
  if (!g) return;
  editGId = id;
  el('g-modal-title').textContent = `Edit — ${g.first} ${g.last}`;
  el('g-save-btn').innerHTML = '<i class="ti ti-check"></i> Save changes';
  el('gf-first').value = g.first; el('gf-last').value = g.last;
  el('gf-phone').value = g.phone; el('gf-email').value = g.email;
  el('gf-nat').value = g.nat; el('gf-id').value = g.idno;
  el('gf-gender').value = g.gender; el('gf-dob').value = g.dob;
  el('gf-vip').value = g.vip; el('gf-prefs').value = g.prefs; el('gf-notes').value = g.notes;
  OM('ovl-guest');
}

function saveGuest() {
  const first = el('gf-first').value.trim(), last = el('gf-last').value.trim();
  if (!first || !last) { alert('First and last name are required'); return; }
  const d = {
    first, last, phone: el('gf-phone').value.trim(), email: el('gf-email').value.trim(),
    nat: el('gf-nat').value.trim(), idno: el('gf-id').value.trim(),
    gender: el('gf-gender').value, dob: el('gf-dob').value,
    vip: el('gf-vip').value, prefs: el('gf-prefs').value.trim(),
    notes: el('gf-notes').value.trim(), inhouse: false,
  };
  if (editGId) {
    const i = guests.findIndex(x => x.id === editGId);
    guests[i] = { ...guests[i], ...d };
  } else {
    const ng = { id: nextGId++, ...d };
    guests.push(ng);
    selGId = ng.id;
  }
  CM('ovl-guest');
  renderGuests();
  if (selGId) selGuest(selGId);
}

function openGPicker() {
  el('picker-q').value = '';
  renderPicker();
  OM('ovl-picker');
}

function renderPicker() {
  const q = el('picker-q').value.toLowerCase();
  const list = guests.filter(g => {
    const nm = `${g.first} ${g.last}`.toLowerCase();
    return !q || nm.includes(q) || g.phone.includes(q) || g.email.toLowerCase().includes(q);
  });
  const container = el('picker-list');
  if (!list.length) {
    container.innerHTML = '<div style="padding:16px;text-align:center;font-size:12px;color:var(--txt3)">No guests found</div>';
    return;
  }
  container.innerHTML = list.map((g, i) => {
    const hist = guestHistory[g.id] || [];
    const bc = hist.filter(h => h.ic === 'ti-calendar').length;
    return `<div class="picker-row" onclick="pickGuest(${g.id})">
      <div style="width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0;${ava(i)}">${ini(g.first + ' ' + g.last)}</div>
      <div style="flex:1">
        <div style="font-size:12px;font-weight:600;color:var(--txt)">
          ${g.first} ${g.last}
          ${g.vip !== 'regular' ? `<span class="bp ${g.vip === 'vip' ? 'bv2' : 'bb2'}" style="font-size:8px">${g.vip === 'vip' ? 'VIP' : 'Corp'}</span>` : ''}
        </div>
        <div style="font-size:10px;color:var(--txt3)">${g.phone || g.email || 'No contact'} · ${bc} stay${bc !== 1 ? 's' : ''}</div>
      </div>
      <span class="picker-select">Select →</span>
    </div>`;
  }).join('');
}

function pickGuest(id) {
  CM('ovl-picker');
  const sel = el('bk-guest');
  if (sel) { populateGuestDD(); sel.value = id; }
}

/* ── ORDERS ───────────────────────────────── */
function renderOrders() {
  const list = orders.filter(o =>
    (ordFlt === 'all' || o.status === ordFlt) &&
    (ordSrc === 'all' || o.source === ordSrc || (ordSrc === 'walkin' && o.type === 'walkin'))
  );
  const g = el('orders-grid');
  if (!g) return;

  const active = orders.filter(o => o.status !== 'delivered').length;
  const ready  = orders.filter(o => o.status === 'ready').length;
  const walkin = orders.filter(o => o.type === 'walkin').length;
  const newCnt = orders.filter(o => o.status === 'new').length;

  el('ord-active').textContent = active;
  el('ord-ready').textContent  = ready;
  el('ord-walkin').textContent = walkin;
  el('ord-nb').textContent     = newCnt;
  el('nb-ord').textContent     = newCnt;

  if (!list.length) {
    g.innerHTML = '<div style="grid-column:1/-1;padding:28px;text-align:center;font-size:12px;color:var(--txt3)">No orders match this filter</div>';
    return;
  }

  g.innerHTML = list.map(o => {
    const srcBadge = o.source === 'restaurant'
      ? '<span class="src-badge src-rest">Restaurant</span>'
      : '<span class="src-badge src-bar">Bar</span>';
    const wiBadge = o.type === 'walkin' ? '<span class="src-badge src-wi" style="margin-left:4px">Walk-in</span>' : '';
    const statusPill = ORD_SP[o.status]
      ? `<span class="bp ${ORD_SP[o.status]}">${ORD_SL[o.status]}</span>`
      : `<span class="bp" style="background:var(--bg4);color:var(--gray)">${ORD_SL[o.status]}</span>`;

    const advBtn = o.status !== 'delivered'
      ? `<button class="obt adv" onclick="advOrd(${o.id})">${ORD_NL[o.status]}</button>`
      : `<button class="obt dl" onclick="showInvoice(${o.id})"><i class="ti ti-download"></i> Invoice</button>`;
    const billBtn = o.type === 'room' && o.status !== 'delivered'
      ? `<button class="obt" onclick="alert('Added ${Math.round(o.total/1000)}k RWF to Room ${o.room} invoice.')">+Bill</button>`
      : '';

    return `<div class="oc ${o.status}">
      <div class="och">
        <div>
          <div class="oc-room">${o.type === 'walkin' ? 'Walk-in' : 'Room ' + o.room}</div>
          <div class="oc-guest">${o.guest}</div>
        </div>
        <div style="text-align:right">
          ${statusPill}
          <div class="oc-id">#ORD-${String(o.id).padStart(3,'0')}</div>
        </div>
      </div>
      <div class="ocs">${srcBadge}${wiBadge}</div>
      <div class="oi">${o.items.map(it =>
        `<div class="oir"><span>${it.name} <span style="color:var(--txt3)">×${it.qty}</span></span><span class="oir-price">${Math.round(it.price/1000)}k</span></div>`
      ).join('')}</div>
      <div class="ocf">
        <span class="oc-total">${Math.round(o.total/1000)}k RWF</span>
        <div class="oc-meta">
          <span class="oc-time">${o.time} ago</span>
          <div class="oc-btns">${advBtn}${billBtn}</div>
        </div>
      </div>
    </div>`;
  }).join('');
}

function fOrd(s, el) {
  ordFlt = s;
  document.querySelectorAll('#screen-orders .fp-sm:not([onclick*="fOrdSrc"])').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  renderOrders();
}

function fOrdSrc(s, el) {
  ordSrc = ordSrc === s ? 'all' : s;
  document.querySelectorAll('#screen-orders .fp-sm[onclick*="fOrdSrc"]').forEach(p => p.classList.remove('active'));
  if (ordSrc !== 'all') el.classList.add('active');
  renderOrders();
}

function advOrd(id) {
  const o = orders.find(x => x.id === id);
  if (o && ORD_NXT[o.status]) o.status = ORD_NXT[o.status];
  renderOrders();
}

function showInvoice(id) {
  const o = orders.find(x => x.id === id);
  if (!o) return;
  el('invoice-content').innerHTML = `
    <div style="border:1px solid var(--brd);border-radius:9px;padding:14px">
      <div class="inv-modal-header">
        <div><div class="inv-hotel-name">Inyambo Hotel</div><div class="inv-hotel-sub">Order Invoice</div></div>
        <div><div class="inv-ref">#ORD-${String(o.id).padStart(3,'0')}</div><div class="inv-date">${TODAY}</div></div>
      </div>
      <div class="inv-modal-items">
        <div class="inv-modal-customer">${o.type === 'room' ? 'Room ' + o.room + ' · ' : ''}${o.guest}</div>
        ${o.items.map(it => `<div class="inv-modal-line"><span>${it.name} ×${it.qty}</span><span style="font-weight:700">${fmt(it.price)} RWF</span></div>`).join('')}
      </div>
      <div class="inv-modal-total"><span>Total</span><span>${fmt(o.total)} RWF</span></div>
    </div>`;
  OM('ovl-invoice');
}

function togWalkin() {
  const t = el('ord-type').value;
  el('ord-room-row').style.display = t === 'room'   ? 'flex' : 'none';
  el('ord-wi-row').style.display   = t === 'walkin' ? 'flex' : 'none';
}

function renderOrdPicks() {
  selOrdItems = [];
  const src = el('ord-src').value;
  el('ord-picks').innerHTML = ORD_MENU[src].map((it, i) =>
    `<div class="mi" id="op${i}" onclick="togOrdItem(${i},'${it.name}',${it.price})">
      <div class="mi-n">${it.name}</div>
      <div class="mi-p">${Math.round(it.price/1000)}k</div>
    </div>`
  ).join('');
  el('ord-sel-display').textContent = 'No items selected';
}

function togOrdItem(i, name, price) {
  const e = el('op' + i);
  const idx = selOrdItems.findIndex(x => x.name === name);
  if (idx >= 0) { selOrdItems.splice(idx, 1); e.classList.remove('sel'); }
  else { selOrdItems.push({ name, price, qty: 1 }); e.classList.add('sel'); }
  el('ord-sel-display').innerHTML = selOrdItems.length
    ? selOrdItems.map(x => `<div class="ord-pick-line"><span>${x.name}</span><span>${Math.round(x.price/1000)}k</span></div>`).join('')
    : 'No items selected';
}

function saveOrder() {
  if (!selOrdItems.length) { alert('Select at least one item'); return; }
  const t   = el('ord-type').value;
  const src = el('ord-src').value;
  const room  = t === 'room' ? el('ord-room').value.split('—')[0].trim() : '';
  const guest = t === 'room' ? (el('ord-room').value.split('—')[1] || '').trim() : el('ord-wi-name').value || 'Walk-in guest';
  const total = selOrdItems.reduce((s, x) => s + x.price, 0);
  orders.unshift({ id: nextOrdId++, room, guest, type: t, source: src, status: 'new', time: 'just now', items: [...selOrdItems], total });
  CM('ovl-order');
  ordFlt = 'all'; ordSrc = 'all';
  document.querySelectorAll('#screen-orders .fp-sm:not([onclick*="fOrdSrc"])').forEach((p, i) => p.classList.toggle('active', i === 0));
  renderOrders();
}

/* ── POS ──────────────────────────────────── */
function addPos(el, name, price, src) {
  if (!posCart[src][name]) posCart[src][name] = { price, qty: 0 };
  posCart[src][name].qty++;
  el.classList.add('sel');
  renderPosCart(src);
}

function renderPosCart(src) {
  const iEl = el(src === 'restaurant' ? 'pos-items-r' : 'pos-items-b');
  const tEl = el(src === 'restaurant' ? 'pos-total-r' : 'pos-total-b');
  const cart = posCart[src];
  const keys = Object.keys(cart).filter(k => cart[k].qty > 0);
  if (!keys.length) {
    if (iEl) iEl.innerHTML = '<div style="padding:9px 0;font-size:12px;color:var(--txt3)">No items selected</div>';
    if (tEl) tEl.textContent = '0 RWF';
    return;
  }
  let tot = 0;
  if (iEl) iEl.innerHTML = keys.map(k => {
    tot += cart[k].price * cart[k].qty;
    return `<div class="poi"><span>${k} <span style="color:var(--txt3)">×${cart[k].qty}</span></span><span>${Math.round(cart[k].price * cart[k].qty / 1000)}k</span></div>`;
  }).join('');
  if (tEl) tEl.textContent = Math.round(tot / 1000) + 'k RWF';
}

function posPay(src) {
  alert(`Payment processed: ${el(src === 'restaurant' ? 'pos-total-r' : 'pos-total-b').textContent}`);
  posCart[src] = {};
  document.querySelectorAll('#screen-' + src + ' .mi.sel').forEach(e => e.classList.remove('sel'));
  renderPosCart(src);
}
function posRoom(src) {
  const rm = el(src === 'restaurant' ? 'pos-room' : 'bar-room').value;
  if (!rm) { alert('Select a room first'); return; }
  alert(`Added to Room ${rm} invoice.`);
  posCart[src] = {};
  document.querySelectorAll('#screen-' + src + ' .mi.sel').forEach(e => e.classList.remove('sel'));
  renderPosCart(src);
}
function posWalk(src) {
  alert('Walk-in bill generated. Cash or card payment.');
  posCart[src] = {};
  document.querySelectorAll('#screen-' + src + ' .mi.sel').forEach(e => e.classList.remove('sel'));
  renderPosCart(src);
}

/* ── STAFF ────────────────────────────────── */
function renderStaff() {
  const g = el('staff-grid');
  if (!g) return;
  g.innerHTML = staff.map(s => {
    const perms = PERMISSIONS[s.role] || [];
    return `<div class="staff-card">
      <div class="s-card-actions">
        <button class="ra-b" onclick="openEditStaff(${s.id})" title="Edit"><i class="ti ti-edit"></i></button>
        <button class="ra-b del" onclick="openDel('staff',${s.id},'Remove ${s.first} ${s.last}?','Staff member will be removed from the system.')" title="Delete"><i class="ti ti-trash"></i></button>
      </div>
      <div class="s-header">
        <div class="s-ava" style="background:${ROLE_BG[s.role]};color:${ROLE_COLORS[s.role]}">${ini(s.first + ' ' + s.last)}</div>
        <div>
          <div class="s-name">${s.first} ${s.last}</div>
          <span class="s-role-badge" style="background:${ROLE_BG[s.role]};color:${ROLE_COLORS[s.role]}">${ROLE_LABELS[s.role]}</span>
        </div>
      </div>
      <div class="s-meta">
        <div class="s-meta-item"><i class="ti ti-phone"></i>${s.phone}</div>
        <div class="s-meta-item"><i class="ti ti-clock"></i>${s.shift}</div>
        <div class="s-meta-item"><i class="ti ti-calendar"></i>Since ${fmtD(s.start)}</div>
        <div class="s-meta-item"><i class="ti ti-cash"></i>${fmt(s.salary)} RWF/mo</div>
      </div>
      <div class="perm-title">Permissions</div>
      <div class="perm-grid">
        ${perms.slice(0, 6).map(p => `<div class="perm-item"><div class="perm-dot" style="background:${ROLE_COLORS[s.role]}"></div>${p}</div>`).join('')}
        ${perms.length > 6 ? `<div class="perm-item" style="color:var(--txt3)">+${perms.length - 6} more</div>` : ''}
      </div>
    </div>`;
  }).join('');
}

function openCreateStaff() {
  editStaffId = null;
  el('staff-modal-title').textContent = 'Add staff member';
  ['sf-first','sf-last','sf-phone','sf-email','sf-salary'].forEach(id => el(id).value = '');
  el('sf-role').value = 'receptionist'; el('sf-shift').value = 'Day (6am–2pm)'; el('sf-start').value = '';
  updatePermPreview();
  OM('ovl-staff');
}

function openEditStaff(id) {
  const s = staff.find(x => x.id === id);
  if (!s) return;
  editStaffId = id;
  el('staff-modal-title').textContent = `Edit — ${s.first} ${s.last}`;
  el('sf-first').value = s.first; el('sf-last').value = s.last;
  el('sf-phone').value = s.phone; el('sf-email').value = s.email;
  el('sf-role').value = s.role; el('sf-shift').value = s.shift;
  el('sf-start').value = s.start; el('sf-salary').value = s.salary;
  updatePermPreview();
  OM('ovl-staff');
}

function updatePermPreview() {
  const role = el('sf-role').value;
  const perms = PERMISSIONS[role] || [];
  el('perm-list').innerHTML = perms.map(p =>
    `<div class="perm-item"><div class="perm-dot" style="background:${ROLE_COLORS[role]}"></div>${p}</div>`
  ).join('');
}

function saveStaff() {
  const first = el('sf-first').value.trim(), last = el('sf-last').value.trim();
  if (!first || !last) { alert('Name required'); return; }
  const d = {
    first, last, phone: el('sf-phone').value.trim(), email: el('sf-email').value.trim(),
    role: el('sf-role').value, shift: el('sf-shift').value,
    start: el('sf-start').value, salary: +el('sf-salary').value || 0,
  };
  if (editStaffId) {
    const i = staff.findIndex(x => x.id === editStaffId);
    staff[i] = { ...staff[i], ...d };
  } else {
    staff.push({ id: nextStaffId++, ...d });
  }
  CM('ovl-staff'); renderStaff();
}

/* ── INVENTORY ────────────────────────────── */
function renderInventory() {
  const c = el('inv-container');
  if (!c) return;
  const list = invCatF === 'all'  ? inventory :
               invCatF === 'low'  ? inventory.filter(i => i.qty <= i.min) :
               inventory.filter(i => i.cat === invCatF);

  if (!list.length) {
    c.innerHTML = '<div class="placeholder"><i class="ti ti-search"></i><span>No items found</span></div>';
    return;
  }

  const cats = invCatF === 'all'  ? Object.keys(INV_CAT_LABELS) :
               invCatF === 'low'  ? [...new Set(list.map(i => i.cat))] :
               [invCatF];

  c.innerHTML = cats.map(cat => {
    const items = list.filter(i => i.cat === cat);
    if (!items.length) return '';
    return `<div class="inv-section">
      <div class="inv-cat-hdr">
        <i class="ti ti-tag" style="color:var(--txt3)"></i>
        <span class="inv-cat-title">${INV_CAT_LABELS[cat]}</span>
        <span class="inv-cat-count">${items.length} item${items.length !== 1 ? 's' : ''}</span>
        <button class="tbb" style="margin-left:auto;font-size:11px;padding:4px 10px" onclick="OM('ovl-inv')"><i class="ti ti-plus"></i> Add</button>
      </div>
      ${items.map(it => {
        const pct    = Math.min(100, Math.round(it.qty / Math.max(it.min * 2, 1) * 100));
        const status = it.qty <= it.min ? 'low' : it.qty <= it.min * 1.5 ? 'mid' : 'ok';
        const color  = status === 'low' ? '#f87171' : status === 'mid' ? '#fbbf24' : '#4ade90';
        const alertCls = `alert-${status}`;
        const alertLbl = status === 'low' ? 'Low' : status === 'mid' ? 'Mid' : 'OK';
        return `<div class="inv-item-row">
          <div class="inv-item-info">
            <div class="inv-item-name">${it.name}</div>
            <div class="inv-item-sub">${it.supplier} · ${it.cost.toLocaleString()} RWF/${it.unit}</div>
          </div>
          <div class="inv-stock-bar"><div class="inv-stock-fill" style="width:${pct}%;background:${color}"></div></div>
          <span class="inv-qty-lbl" style="color:${color}">${it.qty} ${it.unit}</span>
          <span class="inv-alert ${alertCls}">${alertLbl}</span>
          <button class="ra-b" onclick="alert('Restock: ${it.name} — Order from ${it.supplier}')" title="Restock"><i class="ti ti-refresh"></i></button>
        </div>`;
      }).join('')}
    </div>`;
  }).join('');
}

function fInv(f, el) {
  invCatF = f;
  document.querySelectorAll('#screen-inventory .fp-sm').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  renderInventory();
}

function saveInv() {
  const name = el('inv-name-f').value.trim();
  if (!name) { alert('Item name required'); return; }
  const d = {
    name, cat: el('inv-cat-f').value, unit: el('inv-unit-f').value.trim() || 'units',
    qty: +el('inv-qty-f').value || 0, min: +el('inv-min-f').value || 10,
    supplier: el('inv-sup-f').value.trim(), cost: +el('inv-cost-f').value || 0,
  };
  inventory.push({ id: nextInvId++, ...d });
  ['inv-name-f','inv-unit-f','inv-qty-f','inv-min-f','inv-sup-f','inv-cost-f'].forEach(id => el(id).value = '');
  CM('ovl-inv'); renderInventory();
}

/* ── DELETE ───────────────────────────────── */
function openDel(type, id, msg, sub) {
  delTarget = { type, id };
  el('del-msg').textContent = msg;
  el('del-sub').textContent = sub;
  OM('ovl-del');
}

function confirmDel() {
  const { type, id } = delTarget;
  if (type === 'room') {
    rooms = rooms.filter(x => x.id !== id);
    CM('ovl-del'); renderRooms();
  } else if (type === 'booking') {
    bookings = bookings.filter(x => x.id !== id);
    CM('ovl-del'); renderBookings();
  } else if (type === 'guest') {
    if (selGId === id) {
      selGId = null;
      el('g-empty').style.display = 'flex';
      el('g-det').style.display   = 'none';
    }
    guests = guests.filter(x => x.id !== id);
    CM('ovl-del'); renderGuests();
  } else if (type === 'staff') {
    staff = staff.filter(x => x.id !== id);
    CM('ovl-del'); renderStaff();
  }
}

/* ── INIT ─────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderHotelList();
  setAuthStep('login');
  const phoneInput = el('login-phone');
  if (phoneInput) phoneInput.focus();
  S('dashboard', document.querySelector('.ni.active'));
  renderOrdPicks();
  updatePermPreview();

  // Close modal on overlay click
  document.querySelectorAll('.ovl').forEach(ovl => {
    ovl.addEventListener('click', e => {
      if (e.target === ovl) ovl.classList.remove('open');
    });
  });

  // Keyboard shortcut: Escape closes modals
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.ovl.open').forEach(o => o.classList.remove('open'));
    }
  });
});
