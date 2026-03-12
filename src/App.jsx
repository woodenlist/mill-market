import { useState, useRef, useCallback, useEffect, useMemo, createContext, useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { isDemo, useMills, useTickets, useJobSites, useHauls, useCrew, useAlerts, useAllUsers, usePendingMills, usePendingRates } from "./lib/data.js";
import SCRAPED_MILLS from "./data/mills-scraped.js";

const UserIdContext = createContext(null);
const useUserId = () => useContext(UserIdContext);
const AppDataContext = createContext(null);
const useAppData = () => useContext(AppDataContext);

function useMobile(){
  const [m,setM]=useState(typeof window!=="undefined"&&window.innerWidth<768);
  useEffect(()=>{
    const h=()=>setM(window.innerWidth<768);
    window.addEventListener("resize",h);
    return()=>window.removeEventListener("resize",h);
  },[]);
  return m;
}

// ═══════════════════════════════════════════════════════════════════════════
// TOKENS
// ═══════════════════════════════════════════════════════════════════════════
const C = {
  ink:"#0E0904", bark:"#1A1008", timber:"#2C1A08",
  sawdust:"#E8D5B0", fog:"#F0E8D8",
  gold:"#C8952A",   goldDim:"rgba(200,149,42,0.11)",  goldBorder:"rgba(200,149,42,0.28)",
  fresh:"#5A8A2A",  freshDim:"rgba(90,138,42,0.11)",  freshBorder:"rgba(90,138,42,0.28)",
  rust:"#A63A1A",   rustDim:"rgba(166,58,26,0.11)",   rustBorder:"rgba(166,58,26,0.28)",
  blue:"#2A6B8A",   blueDim:"rgba(42,107,138,0.11)",  blueBorder:"rgba(42,107,138,0.28)",
  purple:"#6B3A8A", purpleDim:"rgba(107,58,138,0.11)",purpleBorder:"rgba(107,58,138,0.28)",
  steel:"#7A8A96",  steelDim:"rgba(122,138,150,0.11)",steelBorder:"rgba(122,138,150,0.28)",
  muted:"rgba(232,213,176,0.42)", faint:"rgba(232,213,176,0.12)",
  border:"rgba(200,149,42,0.12)", borderHi:"rgba(200,149,42,0.36)",
  panel:"rgba(20,12,5,0.94)",
};

const ROLES = {
  owner:   {label:"Owner",      icon:"📊", color:C.purple},
  logger:  {label:"Logger",     icon:"🪵", color:C.fresh },
  trucker: {label:"Trucker",    icon:"🚛", color:C.blue  },
  mill:    {label:"Mill Op",    icon:"🏭", color:C.gold  },
  contract:{label:"Contractor", icon:"📋", color:C.steel },
  admin:   {label:"Admin",      icon:"⚙️", color:C.rust  },
};

function haversineDistance(lat1,lng1,lat2,lng2){
  const R=3959;
  const dLat=(lat2-lat1)*Math.PI/180;
  const dLng=(lng2-lng1)*Math.PI/180;
  const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

const OP_TYPES = {
  tree_length:    {label:"Tree-Length",    icon:"🌲", rateUnit:"ton",      species:["Pine Sawtimber","Spruce Sawtimber","Fir Sawtimber","Oak Hardwood","Maple Hardwood","Aspen","Birch","Softwood Pulp","Hardwood Pulp","Chip-n-Saw","Pine Pulp"]},
  cut_to_length:  {label:"Cut-to-Length",  icon:"✂️", rateUnit:"MBF",      species:["Pine Sawtimber (8ft)","Pine Sawtimber (16ft)","Pulpwood (8ft)","Hardwood (8ft)","Hardwood (12ft)","Pallet Wood"]},
  whole_tree_chip:{label:"Whole-Tree Chip",icon:"🌀", rateUnit:"green ton", species:["Mixed Hardwood Chips","Softwood Chips","Biomass/Fuel","Urban Wood Waste"]},
  biomass:        {label:"Biomass",        icon:"♻️", rateUnit:"green ton", species:["Logging Residue","Slash/Tops","Low-Grade Hardwood","Bark"]},
};

const NAV = {
  owner:[
    {id:"dashboard",   icon:"⬡",  label:"Dashboard"},
    {id:"map",         icon:"🗺",  label:"Rate Map & Sites"},
    {id:"pl",          icon:"💰", label:"P&L — All Entities"},
    {id:"tickets",     icon:"🎫", label:"Load Tickets"},
    {id:"crew",        icon:"👥", label:"Team & Drivers"},
    {id:"reports",     icon:"📊", label:"Reports"},
    {id:"equipment",   icon:"🔧", label:"Equipment Finance"},
    {id:"service",     icon:"✅", label:"Machine Checklists"},
    {id:"export",      icon:"📤", label:"Export / QB"},
    {id:"company",     icon:"🏢", label:"Company & Team"},
    {id:"integration", icon:"🔗", label:"API & Integrations"},
    {id:"settings",    icon:"⚙️", label:"Settings"},
  ],
  logger:[
    {id:"dashboard",   icon:"⬡",  label:"Dashboard"},
    {id:"map",         icon:"🗺",  label:"Rate Map & Sites"},
    {id:"tickets",     icon:"🎫", label:"Load Tickets"},
    {id:"crew",        icon:"👥", label:"Crew"},
    {id:"haul",        icon:"🚛", label:"Haul Calculator"},
    {id:"reports",     icon:"📊", label:"Reports"},
    {id:"submit",      icon:"📝", label:"Submit Rates", badge:"+"},
    {id:"alerts",      icon:"🔔", label:"Alerts", badge:"3"},
    {id:"settings",    icon:"⚙️", label:"Settings"},
  ],
  trucker:[
    {id:"dashboard",   icon:"⬡",  label:"Dashboard"},
    {id:"map",         icon:"🗺",  label:"Rate Map"},
    {id:"tickets",     icon:"🎫", label:"Load Tickets"},
    {id:"haul",        icon:"🚛", label:"Haul Calculator"},
    {id:"cashflow",    icon:"💵", label:"Cash Flow Planner"},
    {id:"fuellog",     icon:"⛽", label:"Fuel Log"},
    {id:"alerts",      icon:"🔔", label:"Alerts"},
    {id:"settings",    icon:"⚙️", label:"Settings"},
  ],
  mill:[
    {id:"dashboard",   icon:"⬡",  label:"Dashboard"},
    {id:"rates",       icon:"💲", label:"Manage Rates"},
    {id:"quotas",      icon:"📦", label:"Quotas & Loads"},
    {id:"mill_tickets",icon:"🎫", label:"Verify Tickets"},
    {id:"mill_reports",icon:"📊", label:"Volume Reports"},
    {id:"settings",    icon:"⚙️", label:"Settings"},
  ],
  contract:[
    {id:"tickets",     icon:"🎫", label:"My Tickets"},
  ],
  admin:[
    {id:"dashboard",   icon:"⬡",  label:"Dashboard"},
    {id:"users",       icon:"👤", label:"Users"},
    {id:"mills_verify",icon:"🏭", label:"Mill Verification", badge:"2"},
    {id:"rates_mod",   icon:"📝", label:"Rate Moderation", badge:"3"},
    {id:"tickets",     icon:"🎫", label:"Ticket Review"},
    {id:"integration", icon:"🔗", label:"Integrations"},
    {id:"settings",    icon:"⚙️", label:"Settings"},
  ],
};

// ── MOCK / SEED DATA ──────────────────────────────────────────────────────
// Full US mill database (225 mills) — imported from scraped data, with rates object added
const MILLS_DATA = SCRAPED_MILLS.map(m=>({...m, quotaUsed:0, quotaMax:0, rates:Object.fromEntries((m.species||[]).map(s=>[s,0]))}));

const JOB_SITES = [
  {id:"j1",name:"Rhinelander NW Block",lat:45.64,lng:-89.41,county:"Oneida Co.",state:"WI",acres:240,species:["Pine Sawtimber","Chip-n-Saw"],estimatedTons:1800,completedTons:1240,status:"active",  color:C.fresh,x:"63%",y:"30%",nearestMill:"Weyerhaeuser — Marshfield",distToMill:47,sharedWith:["Dale Schultz","Roy Ingram"]},
  {id:"j2",name:"Ashland Co. Plot",    lat:46.38,lng:-90.89,county:"Ashland Co.",state:"WI",acres:160,species:["Hardwood Pulp","Maple Hardwood"],estimatedTons:900,completedTons:320, status:"active",  color:C.blue, x:"56%",y:"26%",nearestMill:"Stora Enso — Duluth",   distToMill:82,sharedWith:["Roy Ingram","Bob Kravitz"]},
  {id:"j3",name:"Lincoln Co. Tract A", lat:45.20,lng:-89.72,county:"Lincoln Co.",state:"WI",acres:80, species:["Chip-n-Saw"],                    estimatedTons:600, completedTons:600, status:"complete",color:C.steel,x:"61%",y:"33%",nearestMill:"Weyerhaeuser — Marshfield",distToMill:47,sharedWith:[]},
];

const HAULS = [
  {id:"h1",date:"2025-03-10",mill:"Weyerhaeuser — Marshfield",opType:"tree_length",    species:"Pine Sawtimber",      tons:21.9,mbf:null,rate:32.50,gross:711.75, fuel:118,labor:54, mileage:94, net:539.75, jobSite:"Rhinelander NW Block"},
  {id:"h2",date:"2025-03-09",mill:"Stora Enso — Duluth",      opType:"tree_length",    species:"Hardwood Pulp",       tons:19.8,mbf:null,rate:19.50,gross:386.10, fuel:196,labor:92, mileage:164,net:98.10,  jobSite:"Ashland Co. Plot"},
  {id:"h3",date:"2025-03-08",mill:"Weyerhaeuser — Marshfield",opType:"cut_to_length",  species:"Pine Sawtimber (16ft)",tons:null,mbf:8.4, rate:410,  gross:3444,   fuel:118,labor:54, mileage:94, net:3272,   jobSite:"Lincoln Co. Tract A"},
  {id:"h4",date:"2025-03-07",mill:"Stora Enso — Duluth",      opType:"whole_tree_chip",species:"Mixed HW Chips",      tons:28.6,mbf:null,rate:28.00,gross:800.80, fuel:196,labor:80, mileage:164,net:524.80, jobSite:"Ashland Co. Plot"},
  {id:"h5",date:"2025-03-06",mill:"Weyerhaeuser — Marshfield",opType:"tree_length",    species:"Pine Sawtimber",      tons:22.1,mbf:null,rate:32.50,gross:718.25, fuel:118,labor:54, mileage:94, net:546.25, jobSite:"Rhinelander NW Block"},
  {id:"h6",date:"2025-03-05",mill:"Potlatch — Lewiston",      opType:"tree_length",    species:"Pine Sawtimber",      tons:21.4,mbf:null,rate:28.50,gross:609.90, fuel:502,labor:210,mileage:420,net:-102.10,jobSite:"Lincoln Co. Tract A"},
];

const MOCK_TICKETS = [
  {id:"t1",no:"W-29471", date:"2025-03-10",opType:"tree_length",    mill:"Weyerhaeuser — Marshfield",species:"Pine Sawtimber",       scaleTons:21.9,mbf:null,rate:32.50,gross:711.75,status:"verified",     photo:true, millVerified:true, jobSite:"Rhinelander NW Block",submittedBy:"Jake Harmon"},
  {id:"t2",no:"SE-18822",date:"2025-03-09",opType:"tree_length",    mill:"Stora Enso — Duluth",      species:"Hardwood Pulp",        scaleTons:19.8,mbf:null,rate:19.50,gross:386.10,status:"pending_photo", photo:false,millVerified:false,jobSite:"Ashland Co. Plot",    submittedBy:"Dale Schultz"},
  {id:"t3",no:"CTL-412", date:"2025-03-08",opType:"cut_to_length",  mill:"Weyerhaeuser — Marshfield",species:"Pine Sawtimber (16ft)",scaleTons:null,mbf:8.4, rate:410,  gross:3444,  status:"verified",     photo:true, millVerified:true, jobSite:"Lincoln Co. Tract A",  submittedBy:"Jake Harmon"},
  {id:"t4",no:"CHIP-091",date:"2025-03-07",opType:"whole_tree_chip",mill:"Green Bay Packaging",      species:"Mixed Hardwood Chips", scaleTons:28.6,mbf:null,rate:28.00,gross:800.80,status:"photo_uploaded",photo:true, millVerified:false,jobSite:"Ashland Co. Plot",    submittedBy:"Carlos Diaz"},
  {id:"t5",no:"W-29482", date:"2025-03-06",opType:"tree_length",    mill:"Weyerhaeuser — Marshfield",species:"Pine Sawtimber",       scaleTons:22.1,mbf:null,rate:32.50,gross:718.25,status:"verified",     photo:true, millVerified:true, jobSite:"Rhinelander NW Block",submittedBy:"Jake Harmon"},
];

const CREW = [
  {id:"c1",name:"Dale Schultz", role:"Feller Operator", hourly:32,hours:44,status:"active",machine:"Tigercat 822D",entity:"Harmon Logging LLC"},
  {id:"c2",name:"Roy Ingram",   role:"Skidder Operator",hourly:30,hours:40,status:"active",machine:"Deere 648L",   entity:"Harmon Logging LLC"},
  {id:"c3",name:"Mike Sorensen",role:"Loader Operator", hourly:34,hours:38,status:"active",machine:"Komatsu PC228",entity:"Harmon Logging LLC"},
  {id:"c4",name:"Carlos Diaz",  role:"Truck Driver",    hourly:28,hours:40,status:"active",machine:"Peterbilt 389",entity:"Harmon Hauling LLC"},
  {id:"c5",name:"Lisa Park",    role:"Truck Driver",    hourly:28,hours:0, status:"leave", machine:"—",            entity:"Harmon Hauling LLC"},
  {id:"c6",name:"Bob Kravitz",  role:"Contractor",      hourly:null,hours:0,status:"active",machine:"—",           entity:"Contract"},
];

const ALERTS_DATA = [
  {id:"a1",type:"rate",   severity:"high",  title:"Pine Sawtimber rate dropped at Stora Enso",   body:"Rate fell from $36.00 to $34.00/ton — down 5.6%.",    time:"2h ago", read:false},
  {id:"a2",type:"quota",  severity:"medium",title:"Sappi NA — Cloquet approaching quota",         body:"88% of weekly quota filled. May close Thursday.",      time:"4h ago", read:false},
  {id:"a3",type:"ticket", severity:"low",   title:"Ticket SE-18822 still needs photo",            body:"Upload or email photo to tickets@millmarket.com.",     time:"1d ago", read:false},
  {id:"a4",type:"crew",   severity:"medium",title:"Dale Schultz approaching OT threshold",        body:"44 hrs this week. OT rate kicks in at 40.",            time:"1d ago", read:true },
  {id:"a5",type:"market", severity:"high",  title:"Hardwood Pulp market down statewide",          body:"3 mills reporting price decreases. Avg drop: 8%.",     time:"3d ago", read:true },
];

const PENDING_MILLS = [
  {id:"pm1",name:"Northern Forest Products",state:"MN",city:"Grand Rapids",contactName:"Gary Eklund",contactEmail:"gary@northernforest.com",contactPhone:"218-555-0192",submittedDate:"2025-03-08",species:["Pine Sawtimber","Aspen","Softwood Pulp"],capacity:"450 tons/wk",docStatus:"EIN Provided, Insurance Pending",plan:"Logger"},
  {id:"pm2",name:"Lakeland Timber LLC",      state:"WI",city:"Rhinelander", contactName:"Pam Schultz", contactEmail:"pam@lakelandtimber.com", contactPhone:"715-555-0344",submittedDate:"2025-03-10",species:["Oak Hardwood","Maple Hardwood","Hardwood Pulp"],capacity:"200 tons/wk",docStatus:"All docs received",plan:"Contractor"},
];

const PENDING_RATES = [
  {id:"r1",mill:"Northern Forest Products",species:"Pine Sawtimber",rate:33.50,submittedBy:"Jake Harmon",date:"2025-03-10",source:"personal",    confidence:62,opType:"tree_length",    lastVerified:"2025-02-14",delta:+1.00},
  {id:"r2",mill:"Stora Enso — Duluth",     species:"Aspen Pulp",    rate:24.50,submittedBy:"Maria Voss", date:"2025-03-09",source:"word_of_mouth",confidence:58,opType:"tree_length",    lastVerified:"2025-02-28",delta:+0.50},
  {id:"r3",mill:"Sappi NA — Cloquet",      species:"Softwood Chips", rate:21.00,submittedBy:"Roy Ingram", date:"2025-03-08",source:"ticket_photo", confidence:78,opType:"whole_tree_chip",lastVerified:"2025-02-20",delta:-2.00},
];

const ALL_USERS = [
  {id:"u1",name:"Jake Harmon",   email:"jake@harmonlogging.com",  roles:["owner","logger"],plan:"Logger",  company:"Harmon Logging LLC",joined:"2024-06-01",lastActive:"Today",    tickets:47,status:"active"},
  {id:"u2",name:"Dale Schultz",  email:"dale@harmonlogging.com",  roles:["logger"],         plan:"Logger",  company:"Harmon Logging LLC",joined:"2024-06-15",lastActive:"Today",    tickets:18,status:"active"},
  {id:"u3",name:"Roy Ingram",    email:"roy@harmonlogging.com",   roles:["logger"],         plan:"Logger",  company:"Harmon Logging LLC",joined:"2024-07-01",lastActive:"Yesterday",tickets:12,status:"active"},
  {id:"u4",name:"Carlos Diaz",   email:"carlos@harmonhauling.com",roles:["trucker"],        plan:"Logger",  company:"Harmon Hauling LLC", joined:"2024-08-01",lastActive:"Today",    tickets:22,status:"active"},
  {id:"u5",name:"Todd Brennan",  email:"todd@weyerhaeuser.com",   roles:["mill"],           plan:"Contractor",company:"Weyerhaeuser",     joined:"2024-09-12",lastActive:"3d ago",   tickets:0, status:"active"},
  {id:"u6",name:"Bob Kravitz",   email:"bob@kravitz.com",         roles:["contract"],       plan:"Scout",   company:"—",                 joined:"2025-01-10",lastActive:"3d ago",   tickets:8, status:"active"},
  {id:"u7",name:"Maria Voss",    email:"maria@vosslogging.com",   roles:["logger"],         plan:"Logger",  company:"Voss Logging",      joined:"2025-02-01",lastActive:"1w ago",   tickets:6, status:"active"},
  {id:"u8",name:"Demo User",     email:"demo@example.com",        roles:["logger"],         plan:"Scout",   company:"—",                 joined:"2025-03-01",lastActive:"1w ago",   tickets:0, status:"inactive"},
];

const RATE_TRENDS = {
  "Pine Sawtimber":[28,29,30,30,31,31,32,33,32,34,33,32],
  "Hardwood Pulp": [20,20,21,21,22,21,20,19,20,20,19,18],
  "Softwood Pulp": [18,18,19,19,20,20,21,21,22,22,21,22],
  "Chip-n-Saw":    [24,24,25,25,26,26,27,27,26,26,25,26],
};

const fmt$=(n,d=0)=>n==null?"—":n<0?`-$${Math.abs(n).toLocaleString("en",{minimumFractionDigits:d,maximumFractionDigits:d})}`:`$${n.toLocaleString("en",{minimumFractionDigits:d,maximumFractionDigits:d})}`;
const confColor=c=>c>=80?C.fresh:c>=55?C.gold:C.rust;
const statusColor={verified:C.fresh,photo_uploaded:C.blue,pending_photo:C.gold,rejected:C.rust};
const statusLabel={verified:"✓ Verified",photo_uploaded:"📸 Under Review",pending_photo:"⏳ Needs Photo",rejected:"✗ Rejected"};

// ═══════════════════════════════════════════════════════════════════════════
// PRIMITIVES
// ═══════════════════════════════════════════════════════════════════════════
const Lbl=({children,color,style})=>(
  <div style={{fontSize:10,letterSpacing:"2.5px",textTransform:"uppercase",color:color||C.gold,fontFamily:"'DM Mono',monospace",fontWeight:500,...style}}>{children}</div>
);
const H1=({children,size=36,color})=>(
  <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:size,letterSpacing:"1.5px",lineHeight:1,color:color||C.sawdust}}>{children}</div>
);
const Mono=({children,style})=>(
  <span style={{fontFamily:"'DM Mono',monospace",...style}}>{children}</span>
);

function Card({children,style,hi,hover,onClick}){
  const [hov,setHov]=useState(false);
  return(
    <div onClick={onClick} onMouseEnter={()=>hover&&setHov(true)} onMouseLeave={()=>hover&&setHov(false)}
      style={{background:C.panel,border:`1px solid ${hi||hov?C.borderHi:C.border}`,borderRadius:8,padding:20,transition:"border-color 0.15s",...style,cursor:onClick?"pointer":"default"}}>
      {children}
    </div>
  );
}

function Badge({children,color=C.gold,dot}){
  return(
    <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 8px",borderRadius:10,fontSize:10,fontFamily:"'DM Mono',monospace",background:`${color}20`,color,border:`1px solid ${color}40`}}>
      {dot&&<span style={{width:5,height:5,borderRadius:"50%",background:color,flexShrink:0}}/>}
      {children}
    </span>
  );
}

function Btn({children,onClick,v="gold",disabled,full,size="md",style}){
  const pads={sm:"5px 10px",md:"9px 16px",lg:"12px 22px"};
  const fss={sm:11,md:13,lg:14};
  const vs={
    gold:   {background:C.gold,   color:C.ink,     border:"none"},
    outline:{background:"transparent",color:C.sawdust,border:`1px solid rgba(232,213,176,0.2)`},
    ghost:  {background:"transparent",color:C.muted, border:"none"},
    danger: {background:C.rustDim, color:C.rust,    border:`1px solid ${C.rustBorder}`},
    green:  {background:C.freshDim,color:C.fresh,   border:`1px solid ${C.freshBorder}`},
    blue:   {background:C.blueDim, color:C.blue,    border:`1px solid ${C.blueBorder}`},
    purple: {background:C.purpleDim,color:C.purple, border:`1px solid ${C.purpleBorder}`},
    steel:  {background:C.steelDim,color:C.steel,   border:`1px solid ${C.steelBorder}`},
  };
  return(
    <button onClick={onClick} disabled={disabled}
      style={{...vs[v],borderRadius:4,padding:pads[size],fontSize:fss[size],fontWeight:700,cursor:disabled?"not-allowed":"pointer",fontFamily:"'DM Sans',sans-serif",opacity:disabled?0.5:1,transition:"opacity 0.12s",width:full?"100%":"auto",...style}}>
      {children}
    </button>
  );
}

function Inp({label,value,onChange,type="text",placeholder,prefix,suffix,style,readOnly,autofilled,note}){
  return(
    <div style={style}>
      {label&&<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
        <Lbl>{label}</Lbl>
        {autofilled&&<span style={{fontSize:9,color:C.gold,fontFamily:"'DM Mono',monospace",letterSpacing:1}}>↩ AUTO</span>}
      </div>}
      <div style={{display:"flex",alignItems:"stretch",background:"rgba(14,9,4,0.8)",border:`1px solid ${autofilled?"rgba(200,149,42,0.28)":"rgba(255,255,255,0.09)"}`,borderRadius:4,overflow:"hidden"}}>
        {prefix&&<span style={{padding:"10px 10px",fontSize:12,color:C.muted,borderRight:`1px solid rgba(255,255,255,0.06)`,display:"flex",alignItems:"center"}}>{prefix}</span>}
        <input value={value} onChange={onChange} type={type} placeholder={placeholder} readOnly={readOnly}
          style={{flex:1,background:"transparent",border:"none",padding:"10px 12px",color:autofilled?C.gold:C.sawdust,fontSize:13,fontFamily:"'DM Mono',monospace",outline:"none",minWidth:0}}/>
        {suffix&&<span style={{padding:"10px 10px",fontSize:11,color:C.muted,borderLeft:`1px solid rgba(255,255,255,0.06)`,display:"flex",alignItems:"center"}}>{suffix}</span>}
      </div>
      {note&&<div style={{fontSize:10,color:C.muted,marginTop:4}}>{note}</div>}
    </div>
  );
}

function Sel({label,value,onChange,children,style}){
  return(
    <div style={style}>
      {label&&<Lbl style={{marginBottom:7}}>{label}</Lbl>}
      <select value={value} onChange={onChange}
        style={{width:"100%",background:"rgba(14,9,4,0.8)",border:`1px solid rgba(255,255,255,0.09)`,borderRadius:4,padding:"10px 12px",color:C.sawdust,fontSize:13,fontFamily:"'DM Sans',sans-serif",outline:"none",appearance:"none",boxSizing:"border-box"}}>
        {children}
      </select>
    </div>
  );
}

function Toggle({checked,onChange,color=C.fresh}){
  return(
    <div onClick={()=>onChange(!checked)}
      style={{width:38,height:21,borderRadius:11,background:checked?color:"rgba(255,255,255,0.12)",position:"relative",cursor:"pointer",flexShrink:0,transition:"background 0.18s"}}>
      <div style={{width:17,height:17,borderRadius:"50%",background:"white",position:"absolute",top:2,left:checked?19:2,transition:"left 0.18s",boxShadow:"0 1px 4px rgba(0,0,0,0.3)"}}/>
    </div>
  );
}

function ConfBar({score,h=5,color}){
  const col=color||(score>=80?C.fresh:score>=55?C.gold:C.rust);
  return(
    <div style={{height:h,background:"rgba(255,255,255,0.07)",borderRadius:h,overflow:"hidden"}}>
      <div style={{height:"100%",width:`${Math.max(0,Math.min(100,score))}%`,background:col,borderRadius:h,transition:"width 0.6s"}}/>
    </div>
  );
}

function QuotaBar({used,max,h=8}){
  const pct=max>0?Math.round((used/max)*100):0;
  const col=pct>=90?C.rust:pct>=70?C.gold:C.fresh;
  return(
    <div>
      <div style={{height:h,background:"rgba(255,255,255,0.07)",borderRadius:h,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${pct}%`,background:col,borderRadius:h,transition:"width 0.6s"}}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:C.muted,marginTop:3,fontFamily:"'DM Mono',monospace"}}>
        <span style={{color:col}}>{used}t used</span><span>{max}t cap · {pct}%</span>
      </div>
    </div>
  );
}

function StatCard({label,value,sub,color=C.gold,icon,style,delta,onClick}){
  return(
    <Card style={{flex:1,minWidth:120,...style}} onClick={onClick} hover={!!onClick}>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <Lbl>{label}</Lbl>
        {icon&&<span style={{fontSize:16,opacity:0.5}}>{icon}</span>}
      </div>
      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:30,color,letterSpacing:1,lineHeight:1.2,margin:"4px 0 2px"}}>{value}</div>
      <div style={{display:"flex",alignItems:"center",gap:6}}>
        {sub&&<div style={{fontSize:11,color:C.muted}}>{sub}</div>}
        {delta!=null&&<div style={{fontSize:10,color:delta>0?C.fresh:C.rust,fontFamily:"'DM Mono',monospace"}}>{delta>0?"▲":"▼"}{Math.abs(delta)}%</div>}
      </div>
    </Card>
  );
}

function Tabs({tabs,active,onChange}){
  return(
    <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,marginBottom:20,overflowX:"auto",flexShrink:0}}>
      {tabs.map(t=>(
        <button key={t.id} onClick={()=>onChange(t.id)}
          style={{padding:"8px 16px",border:"none",background:"transparent",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:13,color:active===t.id?C.gold:C.muted,borderBottom:`2px solid ${active===t.id?C.gold:"transparent"}`,marginBottom:-1,transition:"all 0.12s",whiteSpace:"nowrap"}}>
          {t.icon&&`${t.icon} `}{t.label}
        </button>
      ))}
    </div>
  );
}

function Modal({children,onClose,title,width=520}){
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(8,4,1,0.92)",backdropFilter:"blur(8px)",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={onClose}>
      <div style={{background:C.bark,border:`1px solid ${C.borderHi}`,borderRadius:10,width:"100%",maxWidth:width,maxHeight:"92vh",overflowY:"auto",padding:24}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <H1 size={20}>{title}</H1>
          <Btn v="ghost" onClick={onClose} style={{fontSize:17,padding:"3px 8px"}}>✕</Btn>
        </div>
        {children}
      </div>
    </div>
  );
}

function Sparkline({data,color=C.gold,h=44,label}){
  if(!data||data.length<2) return null;
  const mn=Math.min(...data),mx=Math.max(...data),rng=mx-mn||1;
  const W=260,H=h;
  const pts=data.map((v,i)=>`${(i/(data.length-1))*W},${H-((v-mn)/rng)*H*0.82-H*0.09}`).join(" ");
  const area=`${pts} ${W},${H} 0,${H}`;
  const gid=`sg${Math.random().toString(36).slice(2,7)}`;
  return(
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:H}} preserveAspectRatio="none">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity=".22"/>
            <stop offset="100%" stopColor={color} stopOpacity=".01"/>
          </linearGradient>
        </defs>
        <polygon points={area} fill={`url(#${gid})`}/>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        {/* last point dot */}
        <circle cx={`${W}`} cy={`${H-((data[data.length-1]-mn)/rng)*H*0.82-H*0.09}`} r="3" fill={color}/>
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════════════════════════════════
function Sidebar({user,activeRole,view,setView}){
  const items=NAV[activeRole]||[];
  const rc=ROLES[activeRole]?.color||C.gold;
  const mobile=useMobile();
  const [drawerOpen,setDrawerOpen]=useState(false);

  // Mobile bottom nav — show top 4 most important items + "More"
  const bottomItems=items.slice(0,4);

  if(mobile) return(
    <>
      {/* MOBILE DRAWER (full nav) */}
      {drawerOpen&&(
        <div style={{position:"fixed",inset:0,zIndex:200}} onClick={()=>setDrawerOpen(false)}>
          <div style={{position:"absolute",bottom:64,left:0,right:0,background:C.bark,borderTop:`1px solid ${C.borderHi}`,borderRadius:"16px 16px 0 0",padding:"8px 0 12px",maxHeight:"70vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:36,height:4,borderRadius:2,background:"rgba(255,255,255,0.15)",margin:"0 auto 14px"}}/>
            <div style={{padding:"0 8px 8px",borderBottom:`1px solid ${C.border}`,marginBottom:6}}>
              <div style={{display:"flex",alignItems:"center",gap:10,padding:"6px 8px"}}>
                <div style={{width:32,height:32,borderRadius:"50%",background:`${rc}20`,border:`1.5px solid ${rc}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>{user.name?.charAt(0)}</div>
                <div><div style={{fontSize:13,fontWeight:700}}>{user.name}</div><div style={{fontSize:10,color:rc,textTransform:"uppercase",letterSpacing:1}}>{ROLES[activeRole]?.label}</div></div>
              </div>
            </div>
            {items.map(item=>(
              <button key={item.id} onClick={()=>{setView(item.id);setDrawerOpen(false);}}
                style={{display:"flex",alignItems:"center",gap:12,width:"100%",padding:"13px 20px",border:"none",cursor:"pointer",textAlign:"left",background:view===item.id?"rgba(200,149,42,0.08)":"transparent",borderLeft:`3px solid ${view===item.id?rc:"transparent"}`,color:view===item.id?C.sawdust:C.muted,fontSize:15,fontWeight:view===item.id?700:400,fontFamily:"'DM Sans',sans-serif"}}>
                <span style={{fontSize:20,width:28,textAlign:"center"}}>{item.icon}</span>
                <span style={{flex:1}}>{item.label}</span>
                {item.badge&&<span style={{background:rc,color:C.ink,fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:10}}>{item.badge}</span>}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* BOTTOM NAV BAR */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,height:64,background:"rgba(10,6,2,0.98)",backdropFilter:"blur(16px)",borderTop:`1px solid ${C.border}`,display:"flex",alignItems:"stretch",zIndex:100,paddingBottom:"env(safe-area-inset-bottom)"}}>
        {bottomItems.map(item=>{
          const active=view===item.id;
          return(
            <button key={item.id} onClick={()=>setView(item.id)}
              style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,border:"none",background:"transparent",cursor:"pointer",color:active?rc:C.muted,padding:"8px 4px",position:"relative"}}>
              {active&&<div style={{position:"absolute",top:0,left:"20%",right:"20%",height:2,background:rc,borderRadius:"0 0 2px 2px"}}/>}
              <span style={{fontSize:22}}>{item.icon}</span>
              <span style={{fontSize:9,fontFamily:"'DM Sans',sans-serif",fontWeight:active?700:400,letterSpacing:0.5}}>{item.label.split(" ")[0]}</span>
              {item.badge&&<span style={{position:"absolute",top:6,right:"22%",background:rc,color:C.ink,fontSize:8,fontWeight:700,padding:"1px 4px",borderRadius:8,minWidth:14,textAlign:"center"}}>{item.badge}</span>}
            </button>
          );
        })}
        <button onClick={()=>setDrawerOpen(o=>!o)}
          style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,border:"none",background:"transparent",cursor:"pointer",color:drawerOpen?rc:C.muted,padding:"8px 4px"}}>
          <span style={{fontSize:22}}>☰</span>
          <span style={{fontSize:9,fontFamily:"'DM Sans',sans-serif",fontWeight:400,letterSpacing:0.5}}>More</span>
        </button>
      </div>
    </>
  );

  // DESKTOP SIDEBAR
  return(
    <div style={{width:218,minWidth:218,background:C.bark,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",height:"100vh",position:"fixed",left:0,top:0,zIndex:50,overflowY:"auto"}}>
      <div style={{padding:"14px 16px 10px",borderBottom:`1px solid ${C.border}`}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,letterSpacing:3,color:C.gold}}>MILL<span style={{color:C.sawdust}}>MARKET</span></div>
        <div style={{fontSize:9,color:C.muted,fontFamily:"'DM Mono',monospace",letterSpacing:1,marginTop:2}}>{user.company||"MillMarket"}</div>
      </div>
      <div style={{flex:1,padding:"6px 0"}}>
        {items.map(item=>(
          <button key={item.id} onClick={()=>setView(item.id)}
            style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"8px 14px",border:"none",cursor:"pointer",textAlign:"left",background:view===item.id?"rgba(200,149,42,0.08)":"transparent",borderLeft:`2px solid ${view===item.id?rc:"transparent"}`,color:view===item.id?C.sawdust:C.muted,fontSize:13,fontWeight:view===item.id?600:400,fontFamily:"'DM Sans',sans-serif",transition:"all 0.1s"}}>
            <span style={{flexShrink:0}}>{item.icon}</span>
            <span style={{flex:1}}>{item.label}</span>
            {item.badge&&<span style={{background:rc,color:C.ink,fontSize:9,fontWeight:700,padding:"1px 5px",borderRadius:8}}>{item.badge}</span>}
          </button>
        ))}
      </div>
      <div style={{padding:"10px 12px",borderTop:`1px solid ${C.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:28,height:28,borderRadius:"50%",background:`${rc}20`,border:`1.5px solid ${rc}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,flexShrink:0}}>{user.name?.charAt(0)}</div>
          <div style={{minWidth:0}}>
            <div style={{fontSize:12,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.name}</div>
            <div style={{fontSize:9,color:rc,textTransform:"uppercase",letterSpacing:1,fontFamily:"'DM Mono',monospace"}}>{ROLES[activeRole]?.label}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// OWNER P&L
// ═══════════════════════════════════════════════════════════════════════════
function OwnerPL({user}){
  const {hauls,crew,jobSites}=useAppData();
  const mobile=useMobile();
  const [period,setPeriod]=useState("week");
  const [entity,setEntity]=useState("all");

  const entities=[
    {id:"logging",name:user?.company||"My Company",  EIN:"",color:C.fresh},
    {id:"hauling",name:"Hauling Division",   EIN:"",color:C.blue},
  ];

  const totalGross=hauls.reduce((s,h)=>s+h.gross,0);
  const totalFuel=hauls.reduce((s,h)=>s+h.fuel,0);
  const totalLabor=hauls.reduce((s,h)=>s+h.labor,0);
  const totalMileage=hauls.reduce((s,h)=>s+(h.mileage||0),0);
  const crewCost=crew.filter(c=>c.hourly).reduce((s,c)=>s+(Math.min(c.hours,40)*c.hourly)+(Math.max(0,c.hours-40)*c.hourly*1.5),0);
  const totalNet=hauls.reduce((s,h)=>s+h.net,0);

  const bySite=jobSites.map(s=>{
    const sh=hauls.filter(h=>h.jobSite===s.name);
    const gross=sh.reduce((a,h)=>a+h.gross,0);
    const fuel=sh.reduce((a,h)=>a+h.fuel,0);
    const labor=sh.reduce((a,h)=>a+h.labor,0);
    const net=sh.reduce((a,h)=>a+h.net,0);
    return{...s,gross,fuel,labor,net,loads:sh.length};
  }).filter(s=>s.loads>0);

  const entityData=[
    {id:"logging",name:user?.company||"Logging LLC",color:C.fresh,gross:totalGross*0.65,fuel:totalFuel*0.55,crew:crewCost*0.6,maint:840,net:0},
    {id:"hauling",name:"Hauling Division", color:C.blue, gross:totalGross*0.35,fuel:totalFuel*0.45,crew:crewCost*0.4,maint:320,net:0},
  ].map(e=>({...e,net:e.gross-e.fuel-e.crew-e.maint}));

  const pad=mobile?14:26;

  return(
    <div style={{padding:pad,maxWidth:1020,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:10,marginBottom:18}}>
        <div>
          <Lbl>// Owner · P&amp;L</Lbl>
          <H1 size={mobile?28:34} style={{marginTop:5}}>PROFIT <span style={{color:C.purple}}>&amp; LOSS</span></H1>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {["week","month","ytd"].map(p=>(
            <button key={p} onClick={()=>setPeriod(p)} style={{padding:"5px 13px",border:`1px solid ${period===p?C.borderHi:C.border}`,borderRadius:14,background:period===p?C.goldDim:"transparent",color:period===p?C.gold:C.muted,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:600,textTransform:"uppercase"}}>
              {p==="ytd"?"YTD":p}
            </button>
          ))}
        </div>
      </div>

      {/* Top KPIs */}
      <div style={{display:"grid",gridTemplateColumns:mobile?"1fr 1fr":"repeat(4,1fr)",gap:12,marginBottom:20}}>
        <StatCard label="Gross Revenue" value={fmt$(totalGross)}                color={C.sawdust} icon="🪵"/>
        <StatCard label="Net Income"    value={fmt$(totalNet)}                  color={totalNet>0?C.fresh:C.rust} icon="💰"/>
        <StatCard label="Margin"        value={`${totalGross>0?Math.round((totalNet/totalGross)*100):0}%`} color={C.gold} icon="📊"/>
        <StatCard label="Total Loads"   value={hauls.length}                    color={C.steel}   icon="🚛"/>
      </div>

      {/* Consolidated waterfall */}
      <Card style={{marginBottom:16}}>
        <Lbl style={{marginBottom:16}}>Consolidated P&amp;L — Both Entities</Lbl>
        {[
          ["Gross Revenue",  totalGross,         C.fresh,   true],
          ["Fuel Costs",     -totalFuel,          C.rust,    false],
          ["Labor / Payroll",-crewCost,           C.gold,    false],
          ["Mileage / Misc", -(totalMileage*0.18),C.steel,   false],
          ["Net Operating",  totalNet,            totalNet>0?C.fresh:C.rust,true],
        ].map(([label,val,col,bold])=>(
          <div key={label} style={{display:"flex",alignItems:"center",gap:mobile?10:14,padding:"10px 0",borderBottom:`1px solid rgba(255,255,255,0.04)`}}>
            <div style={{flex:1,fontSize:mobile?12:13,fontWeight:bold?700:400,color:bold?C.sawdust:C.muted}}>{label}</div>
            {!mobile&&<div style={{width:140,marginRight:10}}>
              <div style={{height:5,background:"rgba(255,255,255,0.06)",borderRadius:3,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${Math.abs(val)/totalGross*100}%`,background:col,borderRadius:3,transition:"width 0.5s"}}/>
              </div>
            </div>}
            <Mono style={{color:col,fontSize:bold?20:14,fontFamily:bold?"'Bebas Neue',sans-serif":"'DM Mono',monospace",minWidth:80,textAlign:"right"}}>{fmt$(val)}</Mono>
          </div>
        ))}
      </Card>

      {/* By entity */}
      <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:14,marginBottom:16}}>
        {entityData.map(e=>(
          <Card key={e.id} style={{border:`1px solid ${e.color}28`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
              <div>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,letterSpacing:1,color:e.color}}>{e.name}</div>
                <div style={{fontSize:10,color:C.muted}}>EIN: {entities.find(x=>x.id===e.id)?.EIN}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:e.net>0?C.fresh:C.rust,lineHeight:1}}>{fmt$(e.net)}</div>
                <div style={{fontSize:10,color:C.muted}}>net</div>
              </div>
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {[["Gross",e.gross,C.sawdust],["Fuel",-e.fuel,C.rust],["Crew",-e.crew,C.gold],["Maint",-e.maint,C.steel]].map(([l,v,col])=>(
                <div key={l} style={{flex:1,minWidth:60,padding:"6px 8px",background:"rgba(14,9,4,0.5)",borderRadius:4,textAlign:"center"}}>
                  <div style={{fontSize:9,color:C.muted,marginBottom:2}}>{l}</div>
                  <Mono style={{fontSize:11,color:col}}>{fmt$(v)}</Mono>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Revenue by job site */}
      <Card style={{marginBottom:16}}>
        <Lbl style={{marginBottom:14}}>Revenue by Job Site</Lbl>
        {bySite.length===0?(
          <div style={{textAlign:"center",padding:"20px 0",color:C.muted,fontSize:13}}>No haul data for this period.</div>
        ):bySite.map(s=>(
          <div key={s.id} style={{padding:"11px 0",borderBottom:`1px solid rgba(255,255,255,0.04)`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
              <div>
                <div style={{fontWeight:700,fontSize:13}}>{s.name}</div>
                <div style={{fontSize:11,color:C.muted}}>{s.county} · {s.loads} load{s.loads!==1?"s":""} · {s.nearestMill?.split("—")[0]?.trim()}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:s.net>0?C.fresh:C.rust,lineHeight:1}}>{fmt$(s.net)}</div>
                <div style={{fontSize:10,color:C.muted}}>net · {s.gross>0?Math.round((s.net/s.gross)*100):0}% margin</div>
              </div>
            </div>
            <div style={{display:"flex",gap:8}}>
              {[["Gross",s.gross,C.sawdust],["Fuel",-s.fuel,C.rust],["Labor",-s.labor,C.gold]].map(([l,v,col])=>(
                <div key={l} style={{fontSize:11,color:C.muted}}>{l}: <Mono style={{color:col}}>{fmt$(v)}</Mono></div>
              ))}
            </div>
          </div>
        ))}
      </Card>

      {/* Cost breakdown */}
      <Card>
        <Lbl style={{marginBottom:14}}>Cost Breakdown</Lbl>
        {[
          {label:"Fuel",           amount:totalFuel,   pct:Math.round(totalFuel/(totalFuel+crewCost+totalMileage*0.18)*100), color:C.rust,  icon:"⛽"},
          {label:"Crew / Payroll", amount:crewCost,    pct:Math.round(crewCost/(totalFuel+crewCost+totalMileage*0.18)*100),  color:C.gold,  icon:"👥"},
          {label:"Mileage / Misc", amount:totalMileage*0.18, pct:Math.round(totalMileage*0.18/(totalFuel+crewCost+totalMileage*0.18)*100), color:C.steel, icon:"🛣"},
        ].map(c=>(
          <div key={c.label} style={{display:"flex",alignItems:"center",gap:12,padding:"9px 0",borderBottom:`1px solid rgba(255,255,255,0.04)`}}>
            <span style={{fontSize:16}}>{c.icon}</span>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:13}}>
                <span style={{color:C.muted}}>{c.label}</span>
                <div style={{display:"flex",gap:10}}>
                  <Mono style={{color:c.color}}>{c.pct}%</Mono>
                  <Mono style={{color:C.sawdust}}>{fmt$(c.amount)}</Mono>
                </div>
              </div>
              <ConfBar score={c.pct} h={5} color={c.color}/>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}


function OwnerDashboard({setView,user}){
  const {hauls,crew,jobSites,mills,alerts,tickets}=useAppData();
  const mobile=useMobile();
  const loggingGross=hauls.filter(h=>["Rhinelander NW Block","Lincoln Co. Tract A"].includes(h.jobSite)).reduce((s,h)=>s+h.gross,0);
  const haulingGross=hauls.filter(h=>h.jobSite==="Ashland Co. Plot").reduce((s,h)=>s+h.gross,0);
  const totalCrewCost=crew.filter(c=>c.hourly).reduce((s,c)=>s+(Math.min(c.hours,40)*c.hourly)+(Math.max(0,c.hours-40)*c.hourly*1.5),0);
  const weekNet=hauls.reduce((s,h)=>s+h.net,0);
  const unreadAlerts=alerts.filter(a=>!a.read).length;
  const pendingTickets=tickets.filter(t=>t.status==="pending_photo").length;
  const entities=[
    {name:user?.company||"My Company",   gross:loggingGross, crew:totalCrewCost*0.6, fuel:hauls.filter(h=>h.jobSite!=="Ashland Co. Plot").reduce((s,h)=>s+h.fuel,0), net:loggingGross-totalCrewCost*0.6-532, color:C.fresh,  EIN:""},
    {name:"Hauling Division",   gross:haulingGross, crew:totalCrewCost*0.4, fuel:hauls.filter(h=>h.jobSite==="Ashland Co. Plot").reduce((s,h)=>s+h.fuel,0),  net:haulingGross-totalCrewCost*0.4-392, color:C.blue,   EIN:""},
  ];

  return(
    <div style={{padding:mobile?14:26,maxWidth:1040,margin:"0 auto"}}>
      <Lbl>// Owner Dashboard</Lbl>
      <H1 size={mobile?28:36} style={{marginTop:5,marginBottom:4}}>{(()=>{const h=new Date().getHours();return h<12?"GOOD MORNING":h<17?"GOOD AFTERNOON":"GOOD EVENING";})()}, <span style={{color:C.purple}}>{(user?.name||"").split(" ")[0].toUpperCase()}</span></H1>
      <div style={{fontSize:12,color:C.muted,marginBottom:22}}>Week of {new Date().toLocaleDateString("en",{month:"short",day:"numeric"})} · {hauls.length} hauls this period</div>

      {/* Alert bar */}
      {(unreadAlerts>0||pendingTickets>0)&&(
        <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"}}>
          {unreadAlerts>0&&(
            <div onClick={()=>setView("alerts")} style={{flex:1,minWidth:200,padding:"10px 14px",background:C.rustDim,border:`1px solid ${C.rustBorder}`,borderRadius:6,display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
              <span style={{fontSize:18}}>🔔</span>
              <div style={{flex:1}}><span style={{color:C.rust,fontWeight:700}}>{unreadAlerts} unread alerts</span><span style={{color:C.muted,fontSize:12}}> — including high-priority market changes</span></div>
              <span style={{color:C.rust,fontSize:12}}>View →</span>
            </div>
          )}
          {pendingTickets>0&&(
            <div onClick={()=>setView("tickets")} style={{flex:1,minWidth:200,padding:"10px 14px",background:C.goldDim,border:`1px solid ${C.goldBorder}`,borderRadius:6,display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
              <span style={{fontSize:18}}>🎫</span>
              <div style={{flex:1}}><span style={{color:C.gold,fontWeight:700}}>{pendingTickets} ticket{pendingTickets>1?"s":""} need photo</span><span style={{color:C.muted,fontSize:12}}> — reduced confidence without verification</span></div>
              <span style={{color:C.gold,fontSize:12}}>View →</span>
            </div>
          )}
        </div>
      )}

      {/* Entity summary cards */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20}}>
        {entities.map(e=>(
          <Card key={e.name} style={{border:`1px solid ${e.color}30`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,letterSpacing:1,color:e.color}}>{e.name.split(" ")[1]?.toUpperCase()}</div>
                <div style={{fontSize:11,color:C.muted}}>{e.name} · EIN {e.EIN}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:30,color:e.net>0?C.fresh:C.rust,lineHeight:1}}>{fmt$(e.net)}</div>
                <div style={{fontSize:10,color:C.muted}}>net this period</div>
              </div>
            </div>
            <div style={{display:"flex",gap:12}}>
              {[["Gross",e.gross,C.sawdust],["Crew",-e.crew,C.rust],["Fuel",-e.fuel,C.gold]].map(([l,v,col])=>(
                <div key={l} style={{flex:1,padding:"6px 8px",background:"rgba(14,9,4,0.5)",borderRadius:4,textAlign:"center"}}>
                  <div style={{fontSize:9,color:C.muted,marginBottom:2}}>{l}</div>
                  <Mono style={{fontSize:12,color:col}}>{fmt$(v)}</Mono>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:20}}>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {/* Revenue trend */}
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <Lbl>Combined Revenue — 12 Months</Lbl>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:C.gold}}>{fmt$(weekNet)} <span style={{fontSize:12,color:C.muted,fontFamily:"'DM Sans',sans-serif"}}>this week</span></div>
            </div>
            <Sparkline data={[14200,15800,13400,16200,17800,14900,18200,19400,16800,20100,18400,weekNet]} color={C.gold} h={72}/>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:C.muted,marginTop:4,fontFamily:"'DM Mono',monospace"}}><span>Mar '24</span><span>Now</span></div>
          </Card>

          {/* Job site progress */}
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <Lbl>Job Site Progress</Lbl>
              <Btn v="outline" size="sm" onClick={()=>setView("map")}>Map View →</Btn>
            </div>
            {jobSites.map(s=>{
              const pct=s.estimatedTons>0?Math.round((s.completedTons/s.estimatedTons)*100):0;
              return(
                <div key={s.id} style={{marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:5}}>
                    <div>
                      <div style={{fontWeight:600,fontSize:13}}>{s.name}</div>
                      <div style={{fontSize:11,color:C.muted}}>{s.county} · {s.acres} ac · {s.nearestMill.split("—")[0].trim()} ({s.distToMill}mi)</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <Badge color={s.status==="active"?C.fresh:C.steel}>{s.status}</Badge>
                      <div style={{fontSize:10,color:C.muted,marginTop:2}}>{s.completedTons}/{s.estimatedTons}t</div>
                    </div>
                  </div>
                  <ConfBar score={pct} h={7} color={pct===100?C.steel:s.color}/>
                  <div style={{fontSize:9,color:C.muted,marginTop:2,fontFamily:"'DM Mono',monospace"}}>{pct}%</div>
                </div>
              );
            })}
          </Card>

          {/* Recent tickets */}
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <Lbl>Recent Tickets</Lbl>
              <Btn v="ghost" size="sm" onClick={()=>setView("tickets")}>All Tickets →</Btn>
            </div>
            {tickets.slice(0,4).map(t=>(
              <div key={t.id} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:`1px solid rgba(255,255,255,0.04)`}}>
                <span style={{fontSize:18,flexShrink:0}}>{OP_TYPES[t.opType]?.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600}}><Mono style={{color:C.gold}}>{t.no}</Mono> · {t.submittedBy}</div>
                  <div style={{fontSize:11,color:C.muted}}>{t.date} · {t.species} · {t.jobSite}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:C.fresh}}>{fmt$(t.gross,2)}</div>
                  <Badge color={statusColor[t.status]||C.muted}>{statusLabel[t.status]||t.status}</Badge>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Right column */}
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {/* Crew status */}
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <Lbl>Team Status</Lbl>
              <Btn v="ghost" size="sm" onClick={()=>setView("crew")}>Manage →</Btn>
            </div>
            {crew.map(c=>{
              const ot=Math.max(0,c.hours-40);
              return(
                <div key={c.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:`1px solid rgba(255,255,255,0.04)`}}>
                  <span style={{width:7,height:7,borderRadius:"50%",background:c.status==="active"?C.fresh:C.gold,flexShrink:0}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</div>
                    <div style={{fontSize:10,color:C.muted}}>{c.entity.split(" ")[1]}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <Mono style={{fontSize:11,color:ot>0?C.gold:C.muted}}>{c.hours}h</Mono>
                    {ot>0&&<div style={{fontSize:9,color:C.gold}}>+{ot}h OT</div>}
                  </div>
                </div>
              );
            })}
          </Card>

          {/* Quick actions */}
          <Card>
            <Lbl style={{marginBottom:12}}>Quick Actions</Lbl>
            {[
              ["💰","View P&L","pl"],
              ["📊","Reports","reports"],
              ["📤","QB Export","export"],
              ["🏢","Team Mgmt","company"],
              ["🔗","Integrations","integration"],
            ].map(([icon,label,target])=>(
              <button key={target} onClick={()=>setView(target)}
                style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"9px 0",background:"transparent",border:"none",cursor:"pointer",borderBottom:`1px solid rgba(255,255,255,0.04)`,color:C.muted,fontSize:13,fontFamily:"'DM Sans',sans-serif",textAlign:"left",transition:"color 0.12s"}}
                onMouseEnter={e=>e.currentTarget.style.color=C.sawdust}
                onMouseLeave={e=>e.currentTarget.style.color=C.muted}>
                <span style={{fontSize:16}}>{icon}</span><span style={{flex:1}}>{label}</span><span style={{color:C.gold}}>→</span>
              </button>
            ))}
          </Card>

          {/* Mill status */}
          <Card>
            <Lbl style={{marginBottom:12}}>Mill Status</Lbl>
            {mills.slice(0,3).map(m=>(
              <div key={m.id} style={{padding:"7px 0",borderBottom:`1px solid rgba(255,255,255,0.04)`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <div style={{fontSize:12,fontWeight:600}}>{m.name.split("—")[0].trim()}</div>
                  {m.accepting?<Badge color={C.fresh} dot>Open</Badge>:<Badge color={C.rust}>Closed</Badge>}
                </div>
                <QuotaBar used={m.quotaUsed} max={m.quotaMax} h={4}/>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TRUCKER CASH FLOW PLANNER
// ═══════════════════════════════════════════════════════════════════════════
function CashFlowPlanner(){
  const mobile=useMobile();
  const [loadsPerMonth,setLoadsPerMonth]=useState(48);
  const [avgMiles,setAvgMiles]=useState(94);
  const [avgRate,setAvgRate]=useState(32.50);
  const [avgTons,setAvgTons]=useState(22);
  const [fuelPrice,setFuelPrice]=useState(3.87);
  const [mpg,setMpg]=useState(6.2);
  const [driverPay,setDriverPay]=useState(28);
  const [insurance,setInsurance]=useState(420);
  const [truckPayment,setTruckPayment]=useState(2100);
  const [maintenance,setMaintenance]=useState(600);
  const [savingsPct,setSavingsPct]=useState(10);
  const [downtime,setDowntime]=useState(3);

  const grossPerLoad=avgTons*avgRate;
  const fuelPerLoad=(avgMiles*2)/mpg*fuelPrice;
  const laborPerLoad=(avgMiles*2/55)*driverPay;
  const varCostPerLoad=fuelPerLoad+laborPerLoad;
  const netPerLoad=grossPerLoad-varCostPerLoad;
  const grossMonth=grossPerLoad*loadsPerMonth;
  const varMonth=varCostPerLoad*loadsPerMonth;
  const fixedMonth=insurance+truckPayment+maintenance;
  const netMonth=grossMonth-varMonth-fixedMonth;
  const savingsMonth=netMonth*(savingsPct/100);
  const takeHome=netMonth-savingsMonth;
  const breakEven=fixedMonth>0?Math.ceil(fixedMonth/netPerLoad):0;
  const downtimeLoss=(downtime/22)*netMonth;

  const [tab,setTab]=useState("monthly");
  const tabs=[{id:"monthly",icon:"📅",label:"Monthly P&L"},{id:"perload",icon:"🚛",label:"Per-Load"},  {id:"reserves",icon:"🔧",label:"Reserves"}];

  return(
    <div style={{padding:mobile?14:26,maxWidth:960,margin:"0 auto"}}>
      <Lbl>// Trucker</Lbl>
      <H1 size={mobile?26:34} style={{marginTop:5,marginBottom:4}}>CASH FLOW <span style={{color:C.blue}}>PLANNER</span></H1>
      <div style={{fontSize:12,color:C.muted,marginBottom:20}}>Model your monthly haul economics — adjust any input to see live results.</div>

      <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"300px 1fr",gap:20}}>
        {/* Inputs */}
        <div style={{display:"flex",flexDirection:"column",gap:0}}>
          <Card style={{padding:16}}>
            <Lbl style={{marginBottom:14}}>Load Inputs</Lbl>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <Inp label="Loads / Month"     suffix="loads" value={loadsPerMonth} onChange={e=>setLoadsPerMonth(+e.target.value)} type="number"/>
              <Inp label="Avg Miles (1-way)" suffix="mi"    value={avgMiles}      onChange={e=>setAvgMiles(+e.target.value)}       type="number"/>
              <Inp label="Avg Rate"          prefix="$" suffix="/ton" value={avgRate} onChange={e=>setAvgRate(+e.target.value)}    type="number"/>
              <Inp label="Avg Load Size"     suffix="tons"  value={avgTons}       onChange={e=>setAvgTons(+e.target.value)}        type="number"/>
              <div style={{borderTop:`1px solid ${C.border}`,paddingTop:10,marginTop:2}}>
                <Lbl style={{marginBottom:10}}>Variable Costs</Lbl>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  <Inp label="Fuel Price" prefix="$" suffix="/gal" value={fuelPrice} onChange={e=>setFuelPrice(+e.target.value)} type="number"/>
                  <Inp label="Truck MPG"  suffix="mpg" value={mpg}        onChange={e=>setMpg(+e.target.value)}        type="number"/>
                  <Inp label="Driver Pay" prefix="$" suffix="/hr" value={driverPay} onChange={e=>setDriverPay(+e.target.value)}  type="number"/>
                </div>
              </div>
              <div style={{borderTop:`1px solid ${C.border}`,paddingTop:10,marginTop:2}}>
                <Lbl style={{marginBottom:10}}>Fixed Monthly</Lbl>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  <Inp label="Insurance"      prefix="$" suffix="/mo" value={insurance}    onChange={e=>setInsurance(+e.target.value)}    type="number"/>
                  <Inp label="Truck Payment"  prefix="$" suffix="/mo" value={truckPayment} onChange={e=>setTruckPayment(+e.target.value)} type="number"/>
                  <Inp label="Maintenance"    prefix="$" suffix="/mo" value={maintenance}  onChange={e=>setMaintenance(+e.target.value)}   type="number"/>
                </div>
              </div>
              <div style={{borderTop:`1px solid ${C.border}`,paddingTop:10,marginTop:2}}>
                <Lbl style={{marginBottom:10}}>Planning</Lbl>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  <Inp label="Savings Target" suffix="%" value={savingsPct} onChange={e=>setSavingsPct(+e.target.value)} type="number"/>
                  <Inp label="Downtime Days / Mo" suffix="days" value={downtime} onChange={e=>setDowntime(+e.target.value)} type="number"/>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Results */}
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {/* Top KPIs */}
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <StatCard label="Monthly Gross"  value={fmt$(grossMonth)}  color={C.sawdust} icon="🪵"/>
            <StatCard label="Monthly Net"    value={fmt$(netMonth)}    color={netMonth>0?C.fresh:C.rust} icon="💰"/>
            <StatCard label="Take-Home"      value={fmt$(takeHome)}    color={C.gold}    icon="🏠"/>
            <StatCard label="Break-Even"     value={`${breakEven} loads`} color={C.blue} icon="📊" sub="to cover fixed costs"/>
          </div>

          <Tabs tabs={tabs} active={tab} onChange={setTab}/>

          {tab==="monthly"&&(
            <Card>
              <Lbl style={{marginBottom:16}}>Monthly P&L Waterfall</Lbl>
              {[
                ["Gross Revenue",    grossMonth,         C.fresh,  true ],
                ["Variable Costs",   -varMonth,          C.rust,   false],
                ["Fixed Costs",      -fixedMonth,        C.gold,   false],
                ["Net Operating",    netMonth,           netMonth>0?C.fresh:C.rust, false],
                ["Savings Reserve",  -savingsMonth,      C.purple, false],
                ["Take-Home",        takeHome,           C.sawdust,true ],
              ].map(([label,val,col,bold])=>(
                <div key={label} style={{display:"flex",alignItems:"center",gap:14,padding:"10px 0",borderBottom:`1px solid rgba(255,255,255,0.04)`}}>
                  <div style={{flex:1,fontSize:13,fontWeight:bold?700:400,color:bold?C.sawdust:C.muted}}>{label}</div>
                  <div style={{width:mobile?80:160,marginRight:12,flexShrink:0}}>
                    <div style={{height:6,background:"rgba(255,255,255,0.06)",borderRadius:3,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${Math.abs(val)/grossMonth*100}%`,background:col,borderRadius:3,transition:"width 0.5s"}}/>
                    </div>
                  </div>
                  <Mono style={{color:col,fontSize:bold?18:14,fontFamily:bold?"'Bebas Neue',sans-serif":"'DM Mono',monospace",minWidth:90,textAlign:"right"}}>{fmt$(val)}</Mono>
                </div>
              ))}
              {downtime>0&&(
                <div style={{marginTop:14,padding:12,background:C.rustDim,border:`1px solid ${C.rustBorder}`,borderRadius:5,fontSize:12}}>
                  <span style={{color:C.rust,fontWeight:700}}>⚠ Downtime scenario: </span>
                  <span style={{color:C.muted}}>{downtime} days off = estimated <Mono style={{color:C.rust}}>{fmt$(downtimeLoss)}</Mono> lost net income this month.</span>
                </div>
              )}
            </Card>
          )}

          {tab==="perload"&&(
            <Card>
              <Lbl style={{marginBottom:16}}>Per-Load Economics</Lbl>
              {[
                ["Gross Revenue",   grossPerLoad,          C.fresh],
                ["Fuel Cost",       -fuelPerLoad,          C.rust],
                ["Labor Cost",      -laborPerLoad,         C.gold],
                ["Net Per Load",    netPerLoad,            netPerLoad>0?C.fresh:C.rust],
              ].map(([l,v,col])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:`1px solid rgba(255,255,255,0.04)`}}>
                  <span style={{fontSize:13,color:C.muted}}>{l}</span>
                  <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:col}}>{fmt$(v,2)}</span>
                </div>
              ))}
              <div style={{marginTop:14,display:"flex",gap:10}}>
                <div style={{flex:1,padding:12,background:C.freshDim,border:`1px solid ${C.freshBorder}`,borderRadius:5,textAlign:"center"}}>
                  <div style={{fontSize:10,color:C.muted,marginBottom:4}}>MARGIN</div>
                  <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:32,color:C.fresh}}>{grossPerLoad>0?Math.round((netPerLoad/grossPerLoad)*100):0}%</div>
                </div>
                <div style={{flex:1,padding:12,background:C.blueDim,border:`1px solid ${C.blueBorder}`,borderRadius:5,textAlign:"center"}}>
                  <div style={{fontSize:10,color:C.muted,marginBottom:4}}>BREAK-EVEN</div>
                  <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:32,color:C.blue}}>{breakEven}</div>
                  <div style={{fontSize:10,color:C.muted}}>loads / month</div>
                </div>
              </div>
            </Card>
          )}

          {tab==="reserves"&&(
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div style={{padding:14,background:C.purpleDim,border:`1px solid ${C.purpleBorder}`,borderRadius:7}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <Lbl color={C.purple}>Savings Reserve</Lbl>
                  <Mono style={{color:C.purple}}>{savingsPct}% of net</Mono>
                </div>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:36,color:C.purple,marginBottom:4}}>{fmt$(savingsMonth)}<span style={{fontSize:14,color:C.muted,fontFamily:"'DM Sans',sans-serif"}}>/mo</span></div>
                <div style={{fontSize:12,color:C.muted}}>Annual reserve: <Mono style={{color:C.purple}}>{fmt$(savingsMonth*12)}</Mono></div>
              </div>
              {[
                {label:"Engine Reserve",target:8000, monthly:Math.round(savingsMonth*0.4),icon:"🔩",color:C.rust},
                {label:"Tires Fund",    target:3200, monthly:Math.round(savingsMonth*0.3),icon:"🔄",color:C.gold},
                {label:"Trailer Fund",  target:5000, monthly:Math.round(savingsMonth*0.3),icon:"🚢",color:C.blue},
              ].map(r=>{
                const months=r.monthly>0?Math.ceil(r.target/r.monthly):99;
                const pct=Math.min(100,Math.round((r.monthly*3/r.target)*100));
                return(
                  <Card key={r.label} style={{padding:14}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:18}}>{r.icon}</span>
                        <div>
                          <div style={{fontWeight:600,fontSize:13}}>{r.label}</div>
                          <div style={{fontSize:11,color:C.muted}}>Target: <Mono>{fmt$(r.target)}</Mono></div>
                        </div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <Mono style={{color:r.color}}>{fmt$(r.monthly)}/mo</Mono>
                        <div style={{fontSize:10,color:C.muted}}>{months}mo to target</div>
                      </div>
                    </div>
                    <ConfBar score={pct} h={5} color={r.color}/>
                    <div style={{fontSize:9,color:C.muted,marginTop:3}}>After 3 months: {pct}% of target</div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MILL — TICKET VERIFY VIEW
// ═══════════════════════════════════════════════════════════════════════════
function MillTicketVerify(){
  const {tickets,setTickets}=useAppData();
  const mobile=useMobile();
  const [filter,setFilter]=useState("all");
  const [selected,setSelected]=useState(null);

  const filtered=filter==="all"?tickets:filter==="unverified"?tickets.filter(t=>!t.millVerified):tickets.filter(t=>t.millVerified);
  const verify=id=>{
    setTickets(ts=>ts.map(t=>t.id===id?{...t,millVerified:true,status:"verified"}:t));
    setSelected(s=>s?{...s,millVerified:true,status:"verified"}:s);
  };

  return(
    <div style={{padding:mobile?14:26,maxWidth:1020,margin:"0 auto"}}>
      <Lbl>// Mill · Ticket Verification</Lbl>
      <H1 size={mobile?26:34} style={{marginTop:5,marginBottom:4}}>VERIFY <span style={{color:C.gold}}>LOAD TICKETS</span></H1>
      <div style={{fontSize:12,color:C.muted,marginBottom:18}}>Counter-verify incoming tickets. Verified tickets receive full confidence weight on the platform.</div>

      <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:18}}>
        <StatCard label="Pending Verify" value={tickets.filter(t=>!t.millVerified).length} color={C.gold} icon="⏳"/>
        <StatCard label="Verified"       value={tickets.filter(t=>t.millVerified).length}  color={C.fresh} icon="✓"/>
        <StatCard label="Gross Value"    value={fmt$(tickets.reduce((s,t)=>s+(t.gross||0),0))} color={C.sawdust} icon="💰"/>
      </div>

      <div style={{display:"flex",gap:6,marginBottom:16}}>
        {[["all","All"],["unverified","Needs Verify"],["verified","Verified"]].map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v)}
            style={{padding:"5px 14px",border:`1px solid ${filter===v?C.borderHi:C.border}`,borderRadius:14,background:filter===v?C.goldDim:"transparent",color:filter===v?C.gold:C.muted,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:600}}>
            {l}
          </button>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 340px",gap:16,alignItems:"start"}}>
        {mobile?(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {filtered.map(t=>(
              <Card key={t.id} style={{cursor:"pointer",padding:14,border:selected?.id===t.id?`1px solid ${C.goldBorder}`:undefined}} onClick={()=>setSelected(selected?.id===t.id?null:t)}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <Mono style={{color:C.gold,fontSize:14}}>{t.no}</Mono>
                  {t.millVerified?<Badge color={C.fresh}>✓ Verified</Badge>:<Badge color={C.gold}>⏳ Pending</Badge>}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,fontSize:12,marginBottom:8}}>
                  <div><span style={{color:C.muted,fontSize:10}}>Date</span><div style={{color:C.sawdust}}>{t.date}</div></div>
                  <div><span style={{color:C.muted,fontSize:10}}>Company</span><div style={{color:C.sawdust}}>{t.submittedBy}</div></div>
                  <div><span style={{color:C.muted,fontSize:10}}>Species</span><div style={{color:C.sawdust}}>{t.species}</div></div>
                  <div><span style={{color:C.muted,fontSize:10}}>Gross</span><div><Mono style={{color:C.fresh}}>{fmt$(t.gross,2)}</Mono></div></div>
                </div>
                {!t.millVerified&&<button onClick={e=>{e.stopPropagation();verify(t.id);}} style={{width:"100%",fontSize:12,color:C.fresh,background:C.freshDim,border:`1px solid ${C.freshBorder}`,borderRadius:4,padding:"8px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:700}}>Verify ✓</button>}
                {selected?.id===t.id&&(
                  <div style={{marginTop:10,paddingTop:10,borderTop:`1px solid ${C.border}`}}>
                    {[["Job Site",t.jobSite],["Op Type",OP_TYPES[t.opType]?.label],["Qty",t.scaleTons?`${t.scaleTons}t`:t.mbf?`${t.mbf} MBF`:"—"],["Rate",`${fmt$(t.rate,2)} / ${OP_TYPES[t.opType]?.rateUnit}`]].map(([l,v])=>(
                      <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",fontSize:12}}><span style={{color:C.muted}}>{l}</span><span style={{color:C.sawdust}}>{v}</span></div>
                    ))}
                    <div style={{marginTop:8,padding:8,background:t.photo?C.freshDim:C.rustDim,border:`1px solid ${t.photo?C.freshBorder:C.rustBorder}`,borderRadius:4,fontSize:11,color:t.photo?C.fresh:C.rust}}>{t.photo?"📸 Photo on file":"⚠ No photo"}</div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        ):(
        <Card style={{padding:0,overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead>
              <tr style={{borderBottom:`1px solid ${C.border}`,background:"rgba(14,9,4,0.5)"}}>
                {["Ticket #","Date","Company","Species","Qty","Gross","Status"].map(h=>(
                  <th key={h} style={{padding:"8px 12px",textAlign:["Qty","Gross"].includes(h)?"right":"left",color:C.muted,fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:1,fontWeight:500,whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(t=>(
                <tr key={t.id} style={{borderBottom:`1px solid rgba(255,255,255,0.04)`,cursor:"pointer",background:selected?.id===t.id?"rgba(200,149,42,0.06)":"transparent",transition:"background 0.1s"}}
                  onClick={()=>setSelected(t)}
                  onMouseEnter={e=>e.currentTarget.style.background=selected?.id===t.id?"rgba(200,149,42,0.06)":"rgba(255,255,255,0.015)"}
                  onMouseLeave={e=>e.currentTarget.style.background=selected?.id===t.id?"rgba(200,149,42,0.06)":"transparent"}>
                  <td style={{padding:"10px 12px"}}><Mono style={{color:C.gold}}>{t.no}</Mono></td>
                  <td style={{padding:"10px 12px",color:C.muted}}>{t.date}</td>
                  <td style={{padding:"10px 12px",fontWeight:600}}>{t.submittedBy}</td>
                  <td style={{padding:"10px 12px",color:C.muted}}>{t.species}</td>
                  <td style={{padding:"10px 12px",textAlign:"right"}}><Mono>{t.scaleTons?`${t.scaleTons}t`:t.mbf?`${t.mbf} MBF`:""}</Mono></td>
                  <td style={{padding:"10px 12px",textAlign:"right"}}><Mono style={{color:C.fresh}}>{fmt$(t.gross,2)}</Mono></td>
                  <td style={{padding:"10px 12px"}}>
                    {t.millVerified
                      ?<Badge color={C.fresh}>✓ Mill Verified</Badge>
                      :<div style={{display:"flex",gap:5,alignItems:"center"}}>
                        <Badge color={C.gold}>⏳ Pending</Badge>
                        <button onClick={e=>{e.stopPropagation();verify(t.id);}}
                          style={{fontSize:10,color:C.fresh,background:C.freshDim,border:`1px solid ${C.freshBorder}`,borderRadius:3,padding:"2px 7px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:700}}>
                          Verify ✓
                        </button>
                      </div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        )}

        {!mobile&&(selected?(
          <Card hi style={{position:"sticky",top:20}}>
            <H1 size={18} style={{marginBottom:4}}>TICKET {selected.no}</H1>
            <div style={{fontSize:11,color:C.muted,marginBottom:14}}>{selected.date} · {selected.submittedBy}</div>
            {[["Job Site",selected.jobSite],["Species",selected.species],["Op Type",OP_TYPES[selected.opType]?.label],["Quantity",selected.scaleTons?`${selected.scaleTons}t`:selected.mbf?`${selected.mbf} MBF`:"—"],["Rate",`${fmt$(selected.rate,2)} / ${OP_TYPES[selected.opType]?.rateUnit}`],["Gross",fmt$(selected.gross,2)]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid rgba(255,255,255,0.04)`,fontSize:12}}>
                <span style={{color:C.muted}}>{l}</span><span style={{color:C.sawdust}}>{v}</span>
              </div>
            ))}
            <div style={{marginTop:14,display:"flex",flexDirection:"column",gap:8}}>
              <div style={{padding:10,background:selected.photo?C.freshDim:C.rustDim,border:`1px solid ${selected.photo?C.freshBorder:C.rustBorder}`,borderRadius:5,fontSize:12,color:selected.photo?C.fresh:C.rust}}>
                {selected.photo?"📸 Photo on file":"⚠ No photo — verify with caution"}
              </div>
              {selected.millVerified
                ?<div style={{padding:10,background:C.freshDim,border:`1px solid ${C.freshBorder}`,borderRadius:5,fontSize:12,color:C.fresh}}>✓ You have verified this ticket</div>
                :<Btn full v="green" onClick={()=>verify(selected.id)}>✓ Counter-Verify This Ticket</Btn>}
              <Btn full v="danger" size="sm">✗ Flag Discrepancy</Btn>
            </div>
          </Card>
        ):(
          <div style={{textAlign:"center",padding:"40px 20px",color:C.muted}}>
            <div style={{fontSize:36,marginBottom:12,opacity:0.4}}>🎫</div>
            <div style={{fontSize:13}}>Select a ticket to review and verify</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MILL — VOLUME REPORTS
// ═══════════════════════════════════════════════════════════════════════════
function MillReports(){
  const mobile=useMobile();
  const weeklyVol=[210,240,195,280,310,260,340];
  const bySpecies=[
    {species:"Pine Sawtimber",tons:1840,pct:44,color:C.fresh},
    {species:"Chip-n-Saw",    tons:980, pct:24,color:C.gold},
    {species:"Softwood Pulp", tons:620, pct:15,color:C.blue},
    {species:"Hardwood Pulp", tons:440, pct:11,color:C.purple},
    {species:"Other",         tons:240, pct:6, color:C.steel},
  ];
  const topSuppliers=[
    {name:"Harmon Logging LLC",tons:1240,loads:22,avgLoad:56.4,pct:30},
    {name:"Voss Logging",       tons:820, loads:15,avgLoad:54.7,pct:20},
    {name:"Clearwater Timber",  tons:680, loads:13,avgLoad:52.3,pct:16},
    {name:"Northwoods Logging", tons:540, loads:10,avgLoad:54.0,pct:13},
    {name:"Contract / Spot",    tons:840, loads:18,avgLoad:46.7,pct:20},
  ];

  return(
    <div style={{padding:mobile?14:26,maxWidth:1000,margin:"0 auto"}}>
      <Lbl>// Mill · Volume Reports</Lbl>
      <H1 size={mobile?26:34} style={{marginTop:5,marginBottom:20}}>VOLUME <span style={{color:C.gold}}>REPORTS</span></H1>

      <div style={{display:"grid",gridTemplateColumns:mobile?"1fr 1fr":"repeat(4,1fr)",gap:12,marginBottom:22}}>
        <StatCard label="YTD Volume"    value="4,120t"  color={C.sawdust} icon="🪵"/>
        <StatCard label="This Week"     value="340t"    color={C.fresh}   icon="📦" delta={7}/>
        <StatCard label="Avg Load Size" value="52.6t"   color={C.gold}    icon="🚛"/>
        <StatCard label="Quota Used"    value="68%"     color={C.gold}    icon="📊" sub="340/500t cap"/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:16,marginBottom:16}}>
        {/* Weekly volume bar chart */}
        <Card>
          <Lbl style={{marginBottom:14}}>Weekly Inbound Volume — Past 7 Weeks</Lbl>
          <div style={{display:"flex",gap:6,alignItems:"flex-end",height:120,marginBottom:8}}>
            {weeklyVol.map((v,i)=>{
              const maxV=Math.max(...weeklyVol);
              const h=Math.round((v/maxV)*108);
              const isThis=i===weeklyVol.length-1;
              return(
                <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <Mono style={{fontSize:9,color:isThis?C.gold:C.muted}}>{v}</Mono>
                  <div style={{width:"100%",background:isThis?C.gold:C.fresh,borderRadius:"3px 3px 0 0",height:`${h}px`,transition:"height 0.5s",opacity:isThis?1:0.55}}/>
                  <div style={{fontSize:9,color:C.muted,fontFamily:"'DM Mono',monospace"}}>W{i+1}</div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Species breakdown */}
        <Card>
          <Lbl style={{marginBottom:14}}>Volume by Species — YTD</Lbl>
          {bySpecies.map(s=>(
            <div key={s.species} style={{marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}>
                <span style={{color:C.muted}}>{s.species}</span>
                <div style={{display:"flex",gap:8}}>
                  <Mono style={{color:C.muted}}>{s.tons.toLocaleString()}t</Mono>
                  <Mono style={{color:s.color}}>{s.pct}%</Mono>
                </div>
              </div>
              <ConfBar score={s.pct} h={6} color={s.color}/>
            </div>
          ))}
        </Card>
      </div>

      {/* Top suppliers */}
      <Card>
        <Lbl style={{marginBottom:14}}>Top Suppliers — YTD</Lbl>
        {mobile?(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {topSuppliers.map(s=>(
              <div key={s.name} style={{padding:"10px 0",borderBottom:`1px solid rgba(255,255,255,0.04)`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <div style={{fontWeight:600,fontSize:13}}>{s.name}</div>
                  <Mono style={{color:C.gold}}>{s.pct}%</Mono>
                </div>
                <div style={{display:"flex",gap:12,fontSize:11,color:C.muted,marginBottom:6}}>
                  <span>{s.loads} loads</span><span>{s.tons.toLocaleString()}t</span><span>avg {s.avgLoad}t</span>
                </div>
                <ConfBar score={s.pct} h={4} color={C.gold}/>
              </div>
            ))}
          </div>
        ):(
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead>
            <tr style={{borderBottom:`1px solid ${C.border}`}}>
              {["Supplier","Loads","Total Tons","Avg Load","Share",""].map(h=>(
                <th key={h} style={{padding:"5px 10px",textAlign:["Loads","Total Tons","Avg Load","Share"].includes(h)?"right":"left",color:C.muted,fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:1,fontWeight:500}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topSuppliers.map(s=>(
              <tr key={s.name} style={{borderBottom:`1px solid rgba(255,255,255,0.04)`}}>
                <td style={{padding:"10px 10px",fontWeight:600}}>{s.name}</td>
                <td style={{padding:"10px 10px",textAlign:"right"}}><Mono>{s.loads}</Mono></td>
                <td style={{padding:"10px 10px",textAlign:"right"}}><Mono>{s.tons.toLocaleString()}t</Mono></td>
                <td style={{padding:"10px 10px",textAlign:"right"}}><Mono>{s.avgLoad}t</Mono></td>
                <td style={{padding:"10px 10px",textAlign:"right",minWidth:120}}>
                  <div style={{display:"flex",alignItems:"center",gap:7,justifyContent:"flex-end"}}>
                    <div style={{width:50,height:4,background:"rgba(255,255,255,0.07)",borderRadius:2}}><div style={{height:"100%",width:`${s.pct}%`,background:C.gold,borderRadius:2}}/></div>
                    <Mono style={{color:C.gold}}>{s.pct}%</Mono>
                  </div>
                </td>
                <td style={{padding:"10px 10px"}}><Btn v="ghost" size="sm">View →</Btn></td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN — USERS
// ═══════════════════════════════════════════════════════════════════════════
function AdminUsers(){
  const {users,setUsers}=useAppData();
  const mobile=useMobile();
  const [search,setSearch]=useState("");
  const [planFilter,setPlanFilter]=useState("all");
  const [selected,setSelected]=useState(null);
  const [suspendId,setSuspendId]=useState(null);

  const filtered=users.filter(u=>{
    const matchSearch=!search||u.name.toLowerCase().includes(search.toLowerCase())||u.email.toLowerCase().includes(search.toLowerCase())||u.company.toLowerCase().includes(search.toLowerCase());
    const matchPlan=planFilter==="all"||u.plan===planFilter;
    return matchSearch&&matchPlan;
  });

  const planColor={Scout:C.steel,Logger:C.fresh,Contractor:C.blue};

  return(
    <div style={{padding:mobile?14:26,maxWidth:1040,margin:"0 auto"}}>
      <Lbl>// Admin · Users</Lbl>
      <H1 size={mobile?26:34} style={{marginTop:5,marginBottom:20}}>USER <span style={{color:C.rust}}>MANAGEMENT</span></H1>

      <div style={{display:"grid",gridTemplateColumns:mobile?"1fr 1fr":"repeat(4,1fr)",gap:12,marginBottom:20}}>
        <StatCard label="Total Users"  value={users.length}                            color={C.sawdust} icon="👤"/>
        <StatCard label="Active"       value={users.filter(u=>u.status==="active").length}  color={C.fresh}   icon="●"/>
        <StatCard label="Logger Plan"  value={users.filter(u=>u.plan==="Logger").length}    color={C.gold}    icon="🪵"/>
        <StatCard label="Scout / Free" value={users.filter(u=>u.plan==="Scout").length}     color={C.steel}   icon="👁"/>
      </div>

      {/* Search & filter */}
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:mobile?0:200,display:"flex",alignItems:"center",background:"rgba(14,9,4,0.8)",border:`1px solid rgba(255,255,255,0.09)`,borderRadius:4,padding:"0 12px"}}>
          <span style={{color:C.muted,marginRight:8,fontSize:13}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search users, email, company…"
            style={{flex:1,background:"transparent",border:"none",padding:"9px 0",color:C.sawdust,fontSize:13,fontFamily:"'DM Sans',sans-serif",outline:"none"}}/>
          {search&&<button onClick={()=>setSearch("")} style={{background:"transparent",border:"none",color:C.muted,cursor:"pointer",fontSize:14}}>✕</button>}
        </div>
        <div style={{display:"flex",gap:5}}>
          {["all","Scout","Logger","Contractor"].map(p=>(
            <button key={p} onClick={()=>setPlanFilter(p)}
              style={{padding:"5px 12px",border:`1px solid ${planFilter===p?C.borderHi:C.border}`,borderRadius:14,background:planFilter===p?C.goldDim:"transparent",color:planFilter===p?C.gold:C.muted,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:600}}>
              {p==="all"?"All Plans":p}
            </button>
          ))}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 320px",gap:16,alignItems:"start"}}>
        {mobile?(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {filtered.map(u=>(
              <Card key={u.id} style={{cursor:"pointer",padding:14,opacity:u.status==="suspended"?0.5:1,border:selected?.id===u.id?`1px solid ${C.goldBorder}`:undefined}} onClick={()=>setSelected(selected?.id===u.id?null:u)}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:32,height:32,borderRadius:"50%",background:C.goldDim,border:`1px solid ${C.goldBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>{u.name.charAt(0)}</div>
                    <div><div style={{fontWeight:600,fontSize:13}}>{u.name}</div><div style={{fontSize:10,color:C.muted}}>{u.email}</div></div>
                  </div>
                  <Badge color={u.status==="active"?C.fresh:C.rust} dot>{u.status}</Badge>
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                  <span style={{fontSize:11,color:C.muted}}>{u.company}</span>
                  <Badge color={planColor[u.plan]||C.steel}>{u.plan}</Badge>
                  <div style={{display:"flex",gap:2}}>{u.roles.map(r=><span key={r} style={{fontSize:13}}>{ROLES[r]?.icon}</span>)}</div>
                </div>
                {selected?.id===u.id&&(
                  <div style={{marginTop:10,paddingTop:10,borderTop:`1px solid ${C.border}`}}>
                    {[["Joined",u.joined],["Tickets",u.tickets],["Last Active",u.lastActive]].map(([l,v])=>(
                      <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",fontSize:12}}><span style={{color:C.muted}}>{l}</span><span style={{color:C.sawdust}}>{v}</span></div>
                    ))}
                    <div style={{marginTop:10,display:"flex",gap:7,flexWrap:"wrap"}}>
                      <Btn size="sm" v="outline">✉ Message</Btn>
                      <Btn size="sm" v="outline">📋 Plan</Btn>
                      <Btn size="sm" v="danger">⛔ {u.status==="active"?"Suspend":"Restore"}</Btn>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        ):(
        <Card style={{padding:0,overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead>
              <tr style={{borderBottom:`1px solid ${C.border}`,background:"rgba(14,9,4,0.5)"}}>
                {["User","Company","Roles","Plan","Tickets","Last Active","Status",""].map(h=>(
                  <th key={h} style={{padding:"8px 12px",textAlign:"left",color:C.muted,fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:1,fontWeight:500,whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u=>(
                <tr key={u.id}
                  style={{borderBottom:`1px solid rgba(255,255,255,0.04)`,cursor:"pointer",background:selected?.id===u.id?"rgba(200,149,42,0.06)":"transparent",opacity:u.status==="suspended"?0.5:1}}
                  onClick={()=>setSelected(u)}
                  onMouseEnter={e=>e.currentTarget.style.background=selected?.id===u.id?"rgba(200,149,42,0.06)":"rgba(255,255,255,0.015)"}
                  onMouseLeave={e=>e.currentTarget.style.background=selected?.id===u.id?"rgba(200,149,42,0.06)":"transparent"}>
                  <td style={{padding:"10px 12px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:26,height:26,borderRadius:"50%",background:C.goldDim,border:`1px solid ${C.goldBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,flexShrink:0}}>{u.name.charAt(0)}</div>
                      <div>
                        <div style={{fontWeight:600,fontSize:12}}>{u.name}</div>
                        <div style={{fontSize:10,color:C.muted}}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{padding:"10px 12px",color:C.muted,fontSize:11}}>{u.company}</td>
                  <td style={{padding:"10px 12px"}}>
                    <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                      {u.roles.map(r=><span key={r} style={{fontSize:13}}>{ROLES[r]?.icon}</span>)}
                    </div>
                  </td>
                  <td style={{padding:"10px 12px"}}><Badge color={planColor[u.plan]||C.steel}>{u.plan}</Badge></td>
                  <td style={{padding:"10px 12px"}}><Mono>{u.tickets}</Mono></td>
                  <td style={{padding:"10px 12px",color:C.muted,fontSize:11}}>{u.lastActive}</td>
                  <td style={{padding:"10px 12px"}}><Badge color={u.status==="active"?C.fresh:C.rust} dot>{u.status}</Badge></td>
                  <td style={{padding:"10px 12px"}}>
                    <div style={{display:"flex",gap:4}}>
                      <button onClick={e=>{e.stopPropagation();setSuspendId(u.id);}}
                        style={{fontSize:10,color:C.rust,background:C.rustDim,border:`1px solid ${C.rustBorder}`,borderRadius:3,padding:"2px 7px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                        {u.status==="active"?"Suspend":"Restore"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        )}

        {!mobile&&(selected?(
          <Card hi style={{position:"sticky",top:20}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <div style={{width:40,height:40,borderRadius:"50%",background:C.goldDim,border:`1.5px solid ${C.goldBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{selected.name.charAt(0)}</div>
              <div>
                <div style={{fontWeight:700,fontSize:15}}>{selected.name}</div>
                <div style={{fontSize:11,color:C.muted}}>{selected.email}</div>
              </div>
            </div>
            {[["Company",selected.company],["Plan",selected.plan],["Joined",selected.joined],["Tickets",selected.tickets],["Last Active",selected.lastActive],["Status",selected.status]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid rgba(255,255,255,0.04)`,fontSize:12}}>
                <span style={{color:C.muted}}>{l}</span><span style={{color:C.sawdust}}>{v}</span>
              </div>
            ))}
            <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:7}}>
              <Btn full size="sm" v="outline">✉ Send Message</Btn>
              <Btn full size="sm" v="outline">🔄 Reset Password</Btn>
              <Btn full size="sm" v="outline">📋 Change Plan</Btn>
              <Btn full size="sm" v="danger">⛔ {selected.status==="active"?"Suspend Account":"Restore Account"}</Btn>
            </div>
          </Card>
        ):(
          <div style={{textAlign:"center",padding:"40px 20px",color:C.muted}}>
            <div style={{fontSize:36,marginBottom:12,opacity:0.4}}>👤</div>
            <div style={{fontSize:13}}>Select a user to view details</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN — INTEGRATIONS
// ═══════════════════════════════════════════════════════════════════════════
function AdminIntegrations(){
  const mobile=useMobile();
  const [webhooks,setWebhooks]=useState([
    {id:"w1",name:"Equipment Sales CRM",endpoint:"https://crm.yourequip.com/hooks/millmarket",events:["user.signup","user.ticket_verified","rate.updated"],active:true, deliveries:1284,failures:2},
    {id:"w2",name:"BI Dashboard",        endpoint:"https://metabase.internal/api/push",         events:["rate.updated","ticket.verified"],               active:true, deliveries:892, failures:0},
    {id:"w3",name:"SMS Gateway",         endpoint:"https://api.twilio.com/v1/messages",          events:["alert.high","quota.closing"],                   active:false,deliveries:340, failures:14},
  ]);
  const [modal,setModal]=useState(false);
  const [apikeyVisible,setApikeyVisible]=useState(false);
  const apikey="mm_live_8f4c2a9e7b3d1f6e5c8a2b4d9f1e7c3a";

  return(
    <div style={{padding:mobile?14:26,maxWidth:900,margin:"0 auto"}}>
      <Lbl>// Admin · Integrations</Lbl>
      <H1 size={mobile?26:34} style={{marginTop:5,marginBottom:20}}>PLATFORM <span style={{color:C.rust}}>INTEGRATIONS</span></H1>

      {/* API Key */}
      <Card style={{marginBottom:20,border:`1px solid ${C.purpleBorder}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div><Lbl color={C.purple}>Platform API Key</Lbl><div style={{fontSize:12,color:C.muted,marginTop:4}}>Use this key for direct API access. Keep it secret.</div></div>
          <div style={{display:"flex",gap:8}}>
            <Btn v="purple" size="sm" onClick={()=>setApikeyVisible(v=>!v)}>{apikeyVisible?"Hide":"Reveal"}</Btn>
            <Btn v="outline" size="sm">Rotate Key</Btn>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"rgba(14,9,4,0.7)",borderRadius:5,border:`1px solid ${C.border}`}}>
          <Mono style={{flex:1,fontSize:12,color:C.gold,letterSpacing:apikeyVisible?1:2}}>{apikeyVisible?apikey:"•".repeat(apikey.length)}</Mono>
          <button onClick={()=>navigator.clipboard?.writeText(apikey)} style={{fontSize:11,color:C.muted,background:"transparent",border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Copy</button>
        </div>
        <div style={{marginTop:10,fontSize:11,color:C.muted}}>Docs: <Mono style={{color:C.gold}}>https://docs.millmarket.com/api</Mono></div>
      </Card>

      {/* Webhooks */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <Lbl>Webhooks ({webhooks.length})</Lbl>
        <Btn size="sm" onClick={()=>setModal(true)}>+ Add Webhook</Btn>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:24}}>
        {webhooks.map(w=>(
          <Card key={w.id}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
              <div>
                <div style={{fontWeight:700,fontSize:14,marginBottom:3}}>{w.name}</div>
                <Mono style={{fontSize:10,color:C.blue,wordBreak:"break-all"}}>{w.endpoint}</Mono>
              </div>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <Toggle checked={w.active} onChange={v=>setWebhooks(ws=>ws.map(x=>x.id===w.id?{...x,active:v}:x))}/>
                <span style={{fontSize:11,color:w.active?C.fresh:C.muted}}>{w.active?"Active":"Paused"}</span>
              </div>
            </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
              {w.events.map(ev=><Badge key={ev} color={C.steel}>{ev}</Badge>)}
            </div>
            <div style={{display:"flex",gap:14,fontSize:11}}>
              <span style={{color:C.muted}}>Deliveries: <Mono style={{color:C.fresh}}>{w.deliveries.toLocaleString()}</Mono></span>
              <span style={{color:C.muted}}>Failures: <Mono style={{color:w.failures>0?C.rust:C.muted}}>{w.failures}</Mono></span>
            </div>
          </Card>
        ))}
      </div>

      {/* Available Integrations */}
      <Lbl style={{marginBottom:14}}>Available Integrations</Lbl>
      <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:12}}>
        {[
          {icon:"🤝",name:"Equipment Sales Bridge",desc:"Sync enriched logger & operator profiles to your equipment CRM with purchase-signal scoring.",badge:"Beta",  color:C.purple,active:true},
          {icon:"📊",name:"QuickBooks Online",      desc:"Direct sync of revenue, payroll and expense transactions per entity.",                          badge:"Active",color:C.fresh, active:true},
          {icon:"📱",name:"Twilio SMS",              desc:"Push rate alerts, quota warnings, and load confirmations to any phone number.",                 badge:"Active",color:C.blue,  active:true},
          {icon:"🗂",name:"Google Sheets",           desc:"Auto-export haul logs, payroll summaries, and rate snapshots to a connected spreadsheet.",       badge:"Soon",  color:C.steel, active:false},
          {icon:"🔔",name:"Slack Notifications",    desc:"Send alerts and ticket status updates to any Slack channel or workspace.",                        badge:"Soon",  color:C.gold,  active:false},
          {icon:"🌐",name:"Zapier",                  desc:"Connect MillMarket events to 5,000+ apps with no-code automations.",                             badge:"Soon",  color:C.rust,  active:false},
        ].map(int=>(
          <Card key={int.name} hover style={{opacity:int.active?1:0.6}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{fontSize:24}}>{int.icon}</span>
              <Badge color={int.badge==="Active"?C.fresh:int.badge==="Beta"?C.purple:C.steel}>{int.badge}</Badge>
            </div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:16,letterSpacing:1,marginBottom:5}}>{int.name}</div>
            <div style={{fontSize:12,color:C.muted,lineHeight:1.6,marginBottom:10}}>{int.desc}</div>
            <Btn v={int.active?"outline":"steel"} size="sm">{int.active?"Configure →":"Coming Soon"}</Btn>
          </Card>
        ))}
      </div>

      {modal&&(
        <Modal title="+ ADD WEBHOOK" onClose={()=>setModal(false)}>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <Inp label="Webhook Name"    placeholder="Equipment Sales CRM" value="" onChange={()=>{}}/>
            <Inp label="Endpoint URL"    placeholder="https://your-server.com/hook" value="" onChange={()=>{}}/>
            <div>
              <Lbl style={{marginBottom:8}}>Events to Send</Lbl>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {["user.signup","user.ticket_verified","rate.updated","ticket.verified","quota.closing","alert.high","mill.verified"].map(ev=>(
                  <label key={ev} style={{display:"flex",alignItems:"center",gap:5,padding:"4px 9px",border:`1px solid ${C.border}`,borderRadius:4,cursor:"pointer",fontSize:11}}>
                    <input type="checkbox" style={{accentColor:C.gold}}/><span style={{color:C.muted}}>{ev}</span>
                  </label>
                ))}
              </div>
            </div>
            <Sel label="Auth Type" value="bearer" onChange={()=>{}}>
              <option value="bearer">Bearer Token</option>
              <option value="hmac">HMAC Signature</option>
              <option value="none">None</option>
            </Sel>
            <div style={{display:"flex",gap:8}}>
              <Btn v="outline" full onClick={()=>setModal(false)}>Cancel</Btn>
              <Btn full onClick={()=>setModal(false)}>Save Webhook</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════════════════════════════
function Settings({user,activeRole}){
  const mobile=useMobile();
  const [notifs,setNotifs]=useState({
    rateAlerts:true, quotaAlerts:true, ticketReminders:true,
    crewAlerts:true, marketUpdates:false, weeklyDigest:true,
  });
  const [channels,setChannels]=useState({push:true,sms:true,email:false});
  const [profile,setProfile]=useState({name:user.name,email:user.email||"",phone:user.phone||"",company:user.company||""});
  const [saved,setSaved]=useState(false);
  const [tab,setTab]=useState("notifications");
  const rc=ROLES[activeRole]?.color||C.gold;

  const save=()=>{setSaved(true);setTimeout(()=>setSaved(false),1600);};

  const tabs=[
    {id:"notifications",icon:"🔔",label:"Notifications"},
    {id:"profile",      icon:"👤",label:"Profile"},
    {id:"display",      icon:"🎨",label:"Display"},
    {id:"account",      icon:"🔐",label:"Account & Security"},
  ];

  return(
    <div style={{padding:mobile?14:26,maxWidth:700,margin:"0 auto"}}>
      <Lbl>// Settings</Lbl>
      <H1 size={mobile?26:34} style={{marginTop:5,marginBottom:20}}>ACCOUNT <span style={{color:rc}}>SETTINGS</span></H1>
      <Tabs tabs={tabs} active={tab} onChange={setTab}/>

      {tab==="notifications"&&(
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card>
            <Lbl style={{marginBottom:14}}>Notification Channels</Lbl>
            {[["push","📱 Push Notifications","In-app and mobile push"],["sms","💬 SMS Text","Direct text to your phone"],["email","📧 Email","Summary emails"]].map(([key,label,sub])=>(
              <div key={key} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid rgba(255,255,255,0.04)`}}>
                <div>
                  <div style={{fontSize:13,fontWeight:600}}>{label}</div>
                  <div style={{fontSize:11,color:C.muted}}>{sub}</div>
                </div>
                <Toggle checked={channels[key]} onChange={v=>setChannels(c=>({...c,[key]:v}))}/>
              </div>
            ))}
          </Card>
          <Card>
            <Lbl style={{marginBottom:14}}>Alert Types</Lbl>
            {[
              ["rateAlerts",   "Rate Changes",    "When mills update rates for species you haul"],
              ["quotaAlerts",  "Quota Warnings",  "When a mill is approaching full capacity"],
              ["ticketReminders","Ticket Reminders","When a submitted ticket still needs a photo"],
              ["crewAlerts",   "Crew Alerts",     "OT thresholds, inactivity, and schedule changes"],
              ["marketUpdates","Market Updates",  "Weekly species price trend summaries"],
              ["weeklyDigest", "Weekly Digest",   "Summary of hauls, revenue, and top rates every Monday"],
            ].map(([key,label,sub])=>(
              <div key={key} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid rgba(255,255,255,0.04)`}}>
                <div>
                  <div style={{fontSize:13,fontWeight:600}}>{label}</div>
                  <div style={{fontSize:11,color:C.muted}}>{sub}</div>
                </div>
                <Toggle checked={notifs[key]} onChange={v=>setNotifs(n=>({...n,[key]:v}))}/>
              </div>
            ))}
          </Card>
          <Btn onClick={save}>{saved?"✓ Saved!":"Save Notification Preferences"}</Btn>
        </div>
      )}

      {tab==="profile"&&(
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card>
            <Lbl style={{marginBottom:14}}>Personal Info</Lbl>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <Inp label="Full Name"    value={profile.name}    onChange={e=>setProfile(p=>({...p,name:e.target.value}))}/>
              <Inp label="Email"        value={profile.email}   onChange={e=>setProfile(p=>({...p,email:e.target.value}))}   type="email"/>
              <Inp label="Phone"        value={profile.phone}   onChange={e=>setProfile(p=>({...p,phone:e.target.value}))}   note="Used for SMS alerts and crew notifications"/>
              <Inp label="Company Name" value={profile.company} onChange={e=>setProfile(p=>({...p,company:e.target.value}))} readOnly/>
            </div>
          </Card>
          <Card>
            <Lbl style={{marginBottom:14}}>Roles on This Account</Lbl>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {user.roles.map(r=>{
                const rm=ROLES[r];
                return(
                  <div key={r} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 12px",background:`${rm.color}15`,border:`1px solid ${rm.color}44`,borderRadius:5}}>
                    <span style={{fontSize:16}}>{rm.icon}</span>
                    <span style={{fontSize:12,color:rm.color,fontWeight:700}}>{rm.label}</span>
                  </div>
                );
              })}
            </div>
            <div style={{fontSize:11,color:C.muted,marginTop:8}}>Contact your company owner to change role assignments.</div>
          </Card>
          <Btn onClick={save}>{saved?"✓ Saved!":"Save Profile"}</Btn>
        </div>
      )}

      {tab==="display"&&(
        <Card>
          <Lbl style={{marginBottom:14}}>Display Preferences</Lbl>
          {[
            {label:"Default Rate Unit",   options:["Tons","MBF","Green Tons"],  val:"Tons"},
            {label:"Distance Units",      options:["Miles","Kilometers"],        val:"Miles"},
            {label:"Currency Format",     options:["$1,234.56","$1234","1,234"], val:"$1,234.56"},
            {label:"Date Format",         options:["MM/DD/YYYY","YYYY-MM-DD","DD/MM/YYYY"],val:"MM/DD/YYYY"},
          ].map(({label,options,val})=>(
            <div key={label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid rgba(255,255,255,0.04)`}}>
              <span style={{fontSize:13,color:C.muted}}>{label}</span>
              <select defaultValue={val} style={{background:"rgba(14,9,4,0.8)",border:`1px solid rgba(255,255,255,0.09)`,borderRadius:4,padding:"5px 10px",color:C.sawdust,fontSize:12,fontFamily:"'DM Sans',sans-serif",outline:"none",cursor:"pointer"}}>
                {options.map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <Btn style={{marginTop:14}} onClick={save}>{saved?"✓ Saved!":"Save Display Settings"}</Btn>
        </Card>
      )}

      {tab==="account"&&(
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card>
            <Lbl style={{marginBottom:14}}>Change Password</Lbl>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <Inp label="Current Password" type="password" placeholder="••••••••" value="" onChange={()=>{}}/>
              <Inp label="New Password"     type="password" placeholder="••••••••" value="" onChange={()=>{}}/>
              <Inp label="Confirm Password" type="password" placeholder="••••••••" value="" onChange={()=>{}}/>
              <Btn size="sm">Update Password</Btn>
            </div>
          </Card>
          <Card>
            <Lbl style={{marginBottom:10}}>Two-Factor Authentication</Lbl>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:13,color:C.muted}}>Protect your account with an authenticator app or SMS code.</div>
              <Btn v="blue" size="sm">Enable 2FA</Btn>
            </div>
          </Card>
          <Card style={{border:`1px solid ${C.rustBorder}`}}>
            <Lbl color={C.rust} style={{marginBottom:10}}>Danger Zone</Lbl>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid rgba(255,255,255,0.04)`}}>
                <div><div style={{fontSize:13}}>Delete all my data</div><div style={{fontSize:11,color:C.muted}}>Permanently remove all tickets, hauls, and preferences</div></div>
                <Btn v="danger" size="sm">Delete Data</Btn>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0"}}>
                <div><div style={{fontSize:13}}>Close account</div><div style={{fontSize:11,color:C.muted}}>This cannot be undone</div></div>
                <Btn v="danger" size="sm">Close Account</Btn>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ONBOARDING — new company setup flow
// ═══════════════════════════════════════════════════════════════════════════
function Onboarding({onComplete}){
  const {mills}=useAppData();
  const [step,setStep]=useState(0);
  const [form,setForm]=useState({
    companyName:"",ein:"",state:"WI",primaryRole:"logger",
    opTypes:[],species:[],
    firstSite:"",firstSiteAcres:"",firstMill:"",
    inviteEmails:[""],
  });
  const [userLoc,setUserLoc]=useState(null);
  const [locRequested,setLocRequested]=useState(false);
  const h=f=>e=>setForm(p=>({...p,[f]:e.target.value}));
  const requestLocation=()=>{
    setLocRequested(true);
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(
        (pos)=>setUserLoc({lat:pos.coords.latitude,lng:pos.coords.longitude}),
        ()=>{},
        {enableHighAccuracy:false,timeout:10000}
      );
    }
  };

  const steps=[
    {title:"Company Setup",    icon:"🏢", desc:"Tell us about your operation"},
    {title:"What You Log",     icon:"🌲", desc:"Operation types and species"},
    {title:"First Job Site",   icon:"📍", desc:"Set up your first pin — optional"},
    {title:"Invite Your Crew", icon:"👥", desc:"Add team members — skip anytime"},
    {title:"You're Ready",     icon:"🎉", desc:"Your platform is configured"},
  ];

  const stateOptions=[["AL","Alabama"],["AK","Alaska"],["AZ","Arizona"],["AR","Arkansas"],["CA","California"],["CO","Colorado"],["CT","Connecticut"],["DE","Delaware"],["FL","Florida"],["GA","Georgia"],["HI","Hawaii"],["ID","Idaho"],["IL","Illinois"],["IN","Indiana"],["IA","Iowa"],["KS","Kansas"],["KY","Kentucky"],["LA","Louisiana"],["ME","Maine"],["MD","Maryland"],["MA","Massachusetts"],["MI","Michigan"],["MN","Minnesota"],["MS","Mississippi"],["MO","Missouri"],["MT","Montana"],["NE","Nebraska"],["NV","Nevada"],["NH","New Hampshire"],["NJ","New Jersey"],["NM","New Mexico"],["NY","New York"],["NC","North Carolina"],["ND","North Dakota"],["OH","Ohio"],["OK","Oklahoma"],["OR","Oregon"],["PA","Pennsylvania"],["RI","Rhode Island"],["SC","South Carolina"],["SD","South Dakota"],["TN","Tennessee"],["TX","Texas"],["UT","Utah"],["VT","Vermont"],["VA","Virginia"],["WA","Washington"],["WV","West Virginia"],["WI","Wisconsin"],["WY","Wyoming"]].sort((a,b)=>a[1].localeCompare(b[1]));

  return(
    <div style={{minHeight:"100vh",background:C.ink,display:"flex",alignItems:"center",justifyContent:"center",padding:20,backgroundImage:`radial-gradient(ellipse 55% 50% at 62% 28%,rgba(45,80,22,0.13) 0%,transparent 55%)`}}>
      <div style={{width:"100%",maxWidth:580}}>
        {/* Logo */}
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:36,letterSpacing:4,color:C.gold}}>MILL<span style={{color:C.sawdust}}>MARKET</span></div>
          <div style={{fontSize:10,color:C.muted,letterSpacing:2,marginTop:2}}>LET'S GET YOUR OPERATION SET UP</div>
        </div>

        {/* Step dots */}
        <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:24}}>
          {steps.map((_,i)=>(
            <div key={i} style={{width:i===step?28:8,height:8,borderRadius:4,background:i<step?C.fresh:i===step?C.gold:C.faint,transition:"all 0.25s"}}/>
          ))}
        </div>

        <Card>
          <div style={{marginBottom:18}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
              <span style={{fontSize:24}}>{steps[step].icon}</span>
              <div>
                <H1 size={22}>{steps[step].title}</H1>
                <div style={{fontSize:12,color:C.muted}}>{steps[step].desc}</div>
              </div>
            </div>
          </div>

          {/* Step 0 — Company */}
          {step===0&&(
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <Inp label="Company Legal Name" placeholder="Harmon Logging LLC" value={form.companyName} onChange={h("companyName")}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <Inp label="EIN" placeholder="82-1234567" value={form.ein} onChange={h("ein")} note="Used for QB export — you can add later"/>
                <Sel label="Primary State" value={form.state} onChange={h("state")}>
                  {stateOptions.map(([abbr,name])=><option key={abbr} value={abbr}>{name}</option>)}
                </Sel>
              </div>
              <div>
                <Lbl style={{marginBottom:10}}>I am primarily a…</Lbl>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {[["logger","🪵","Logger / Operator"],["trucker","🚛","Trucker"],["owner","📊","Owner / Manager"],["mill","🏭","Mill Operator"]].map(([role,icon,label])=>(
                    <button key={role} onClick={()=>setForm(p=>({...p,primaryRole:role}))}
                      style={{padding:"10px 12px",border:`1px solid ${form.primaryRole===role?C.borderHi:C.border}`,borderRadius:6,background:form.primaryRole===role?C.goldDim:"rgba(14,9,4,0.4)",cursor:"pointer",display:"flex",alignItems:"center",gap:8,transition:"all 0.12s"}}>
                      <span style={{fontSize:20}}>{icon}</span>
                      <span style={{fontSize:13,fontWeight:600,color:form.primaryRole===role?C.gold:C.muted}}>{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 1 — Op types & species */}
          {step===1&&(
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div>
                <Lbl style={{marginBottom:10}}>Operation Types</Lbl>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {Object.entries(OP_TYPES).map(([key,op])=>{
                    const on=form.opTypes.includes(key);
                    return(
                      <button key={key} onClick={()=>setForm(p=>({...p,opTypes:on?p.opTypes.filter(k=>k!==key):[...p.opTypes,key]}))}
                        style={{padding:"9px 12px",border:`1px solid ${on?C.borderHi:C.border}`,borderRadius:6,background:on?C.goldDim:"rgba(14,9,4,0.4)",cursor:"pointer",display:"flex",alignItems:"center",gap:8,transition:"all 0.12s"}}>
                        <span style={{fontSize:20}}>{op.icon}</span>
                        <span style={{fontSize:12,fontWeight:600,color:on?C.gold:C.muted}}>{op.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <Lbl style={{marginBottom:10}}>Primary Species</Lbl>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {["Pine Sawtimber","Chip-n-Saw","Softwood Pulp","Hardwood Pulp","Maple Hardwood","Oak Hardwood","Aspen","Mixed Chips","Fir Sawtimber","Biomass"].map(sp=>{
                    const on=form.species.includes(sp);
                    return(
                      <button key={sp} onClick={()=>setForm(p=>({...p,species:on?p.species.filter(s=>s!==sp):[...p.species,sp]}))}
                        style={{padding:"4px 10px",borderRadius:12,border:`1px solid ${on?C.goldBorder:C.border}`,background:on?C.goldDim:"rgba(14,9,4,0.5)",color:on?C.gold:C.muted,fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:600,transition:"all 0.12s"}}>
                        {sp}
                      </button>
                    );
                  })}
                </div>
                <div style={{fontSize:11,color:C.muted,marginTop:8}}>This helps tailor your rate alerts and reports.</div>
              </div>
            </div>
          )}

          {/* Step 2 — First job site */}
          {step===2&&(
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div style={{padding:12,background:C.goldDim,border:`1px solid ${C.goldBorder}`,borderRadius:5,fontSize:12,color:C.gold}}>
                📍 You can drop pins on the map anytime. This just gets your first site ready to go.
              </div>
              {!locRequested?(
                <Btn v="outline" full onClick={requestLocation}>📍 Use My Current Location</Btn>
              ):userLoc?(
                <div style={{padding:10,background:"rgba(42,107,138,0.15)",border:`1px solid rgba(42,107,138,0.3)`,borderRadius:5,fontSize:12,color:C.blue,display:"flex",alignItems:"center",gap:8}}>
                  <span>📍</span><span>Location set: {userLoc.lat.toFixed(4)}°N, {Math.abs(userLoc.lng).toFixed(4)}°W</span>
                </div>
              ):(
                <div style={{padding:10,background:"rgba(14,9,4,0.4)",borderRadius:5,fontSize:12,color:C.muted,display:"flex",alignItems:"center",gap:8}}>
                  <span>📍</span><span>Requesting location access...</span>
                </div>
              )}
              <Inp label="Site Name (optional)" placeholder="Rhinelander NW Block" value={form.firstSite} onChange={h("firstSite")}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <Inp label="Acres (optional)" suffix="ac" type="number" value={form.firstSiteAcres} onChange={h("firstSiteAcres")}/>
                <Sel label="Nearest Mill" value={form.firstMill} onChange={h("firstMill")}>
                  <option value="">Select mill…</option>
                  {(userLoc?mills.filter(m=>m.lat&&m.lng).map(m=>({...m,_dist:haversineDistance(userLoc.lat,userLoc.lng,m.lat,m.lng)})).sort((a,b)=>a._dist-b._dist).slice(0,25):mills.slice(0,25)).map(m=><option key={m.id} value={m.name}>{m.name.split("—")[0].trim()}{m._dist?` (${Math.round(m._dist)} mi)`:""}</option>)}
                </Sel>
              </div>
              <div style={{fontSize:12,color:C.muted}}>You can skip this and add sites from the Rate Map → Job Sites tab at any time.</div>
            </div>
          )}

          {/* Step 3 — Invite crew */}
          {step===3&&(
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div style={{fontSize:13,color:C.muted,lineHeight:1.65}}>Invite your team by email. They'll receive a link with your company join code. You can always do this from Company & Team settings.</div>
              {form.inviteEmails.map((email,i)=>(
                <div key={i} style={{display:"flex",gap:8}}>
                  <Inp placeholder="crew@email.com" value={email} onChange={e=>setForm(p=>{const arr=[...p.inviteEmails];arr[i]=e.target.value;return{...p,inviteEmails:arr};})} style={{flex:1}} type="email"/>
                  {i>0&&<Btn v="ghost" size="sm" onClick={()=>setForm(p=>({...p,inviteEmails:p.inviteEmails.filter((_,j)=>j!==i)}))}>✕</Btn>}
                </div>
              ))}
              {form.inviteEmails.length<5&&(
                <Btn v="outline" size="sm" style={{alignSelf:"flex-start"}} onClick={()=>setForm(p=>({...p,inviteEmails:[...p.inviteEmails,""]}))}>+ Add Another</Btn>
              )}
            </div>
          )}

          {/* Step 4 — Done */}
          {step===4&&(
            <div style={{textAlign:"center",padding:"10px 0 6px"}}>
              <div style={{fontSize:56,marginBottom:14}}>🎉</div>
              <H1 size={26} color={C.fresh} style={{marginBottom:8}}>YOU'RE READY TO LOG</H1>
              <div style={{fontSize:13,color:C.muted,lineHeight:1.75,marginBottom:16}}>Your account is set up{form.companyName?` for ${form.companyName}`:""}. Head to the Rate Map to find mill prices near you, or submit your first load ticket.</div>
              <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
                <Badge color={C.fresh}>🗺 Rate Map Ready</Badge>
                <Badge color={C.gold}>🎫 Ticket Autofill Ready</Badge>
                {form.inviteEmails.filter(Boolean).length>0&&<Badge color={C.blue}>📧 {form.inviteEmails.filter(Boolean).length} invite{form.inviteEmails.filter(Boolean).length>1?"s":""} sent</Badge>}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{display:"flex",gap:9,marginTop:20}}>
            {step>0&&step<4&&<Btn v="outline" onClick={()=>setStep(s=>s-1)}>← Back</Btn>}
            {step<3&&<Btn full onClick={()=>setStep(s=>s+1)}>
              {step===0&&!form.companyName?"Skip Setup →":"Next →"}
            </Btn>}
            {step===3&&<Btn full onClick={()=>setStep(4)}>
              {form.inviteEmails.filter(Boolean).length>0?"Send Invites & Finish":"Skip & Finish"}
            </Btn>}
            {step===4&&<Btn full size="lg" onClick={()=>onComplete(form)}>Enter MillMarket →</Btn>}
          </div>
        </Card>

        {step<4&&(
          <div style={{textAlign:"center",marginTop:14}}>
            <button onClick={()=>onComplete(form)} style={{fontSize:12,color:C.muted,background:"transparent",border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
              Skip setup — I'll configure later
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════════════════════
const DEMO_USERS=[
  {id:"owner1",   name:"Sandra Harmon",  roles:["owner"],            primaryRole:"owner",   isNew:false},
  {id:"logger1",  name:"Jake Harmon",    roles:["logger","trucker"], primaryRole:"logger",  isNew:false},
  {id:"trucker1", name:"Carlos Diaz",    roles:["trucker"],          primaryRole:"trucker", isNew:false},
  {id:"mill1",    name:"Todd Brennan",   roles:["mill"],             primaryRole:"mill",    isNew:false},
  {id:"admin1",   name:"Admin",          roles:["admin"],            primaryRole:"admin",   isNew:false},
  {id:"contract1",name:"Bob Kravitz",    roles:["contract"],         primaryRole:"contract",isNew:false},
  {id:"new1",     name:"New User",       roles:["logger"],           primaryRole:"logger",  isNew:true},
];

function AuthScreen({onLogin}){
  const [loading,setLoading]=useState(false);
  const [mode,setMode]=useState("login"); // login | signup | demo
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [name,setName]=useState("");
  const [error,setError]=useState("");
  const [signupSuccess,setSignupSuccess]=useState(false);

  const quick=u=>{setLoading(true);setTimeout(()=>onLogin(u),380);};

  const handleAuth=async()=>{
    setError("");setLoading(true);
    try{
      if(mode==="signup"){
        const {signUp}=await import("./lib/auth.js");
        const {data,error:e}=await signUp(email,password,{name});
        if(e)throw e;
        setSignupSuccess(true);setLoading(false);return;
      }
      const {signIn}=await import("./lib/auth.js");
      const {data,error:e}=await signIn(email,password);
      if(e)throw e;
      if(data?.user){
        const {supabase}=await import("./lib/supabase.js");
        const {data:profile}=await supabase.from("profiles").select("*").eq("id",data.user.id).single();
        onLogin({
          id:data.user.id,
          name:profile?.name||data.user.user_metadata?.name||email.split("@")[0],
          email:data.user.email,
          roles:profile?.roles||["logger"],
          primaryRole:profile?.roles?.[0]||"logger",
          company:profile?.company||"",
          plan:profile?.plan||"free",
          isNew:!profile?.roles?.length,
        });
      }
    }catch(err){
      setError(err.message||"Authentication failed");
    }
    setLoading(false);
  };

  return(
    <div style={{minHeight:"100vh",background:C.ink,display:"flex",alignItems:"center",justifyContent:"center",padding:20,backgroundImage:`radial-gradient(ellipse 55% 50% at 62% 28%,rgba(45,80,22,0.13) 0%,transparent 55%)`}}>
      <div style={{width:"100%",maxWidth:440}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:48,letterSpacing:5,color:C.gold}}>MILL<span style={{color:C.sawdust}}>MARKET</span></div>
          <div style={{fontSize:11,color:C.muted,letterSpacing:2,marginTop:2}}>TIMBER INTELLIGENCE PLATFORM</div>
        </div>
        <Card>
          {signupSuccess?(
            <div style={{textAlign:"center",padding:"20px 0"}}>
              <div style={{fontSize:48,marginBottom:12}}>📧</div>
              <H1 size={22} color={C.fresh} style={{marginBottom:8}}>CHECK YOUR EMAIL</H1>
              <div style={{color:C.muted,fontSize:13,lineHeight:1.6,marginBottom:16}}>We sent a confirmation link to <Mono style={{color:C.gold}}>{email}</Mono>. Click the link to activate your account.</div>
              <Btn v="outline" onClick={()=>{setSignupSuccess(false);setMode("login");}}>Back to Sign In</Btn>
            </div>
          ):(
            <>
              <div style={{display:"flex",marginBottom:16,borderRadius:5,overflow:"hidden",border:`1px solid ${C.border}`}}>
                {[["login","Sign In"],["signup","Sign Up"]].map(([k,l])=>(
                  <button key={k} onClick={()=>{setMode(k);setError("");}} style={{flex:1,padding:"8px 0",background:mode===k?C.goldDim:"transparent",color:mode===k?C.gold:C.muted,border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:mode===k?700:400,borderBottom:mode===k?`2px solid ${C.gold}`:"2px solid transparent"}}>{l}</button>
                ))}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:11,marginBottom:16}}>
                {mode==="signup"&&<Inp label="Full Name" placeholder="Jake Harmon" value={name} onChange={e=>setName(e.target.value)}/>}
                <Inp label="Email" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/>
                <Inp label="Password" type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)}/>
                {error&&<div style={{padding:"8px 12px",background:C.rustDim,border:`1px solid ${C.rustBorder}`,borderRadius:5,fontSize:12,color:C.rust}}>{error}</div>}
                <Btn full size="lg" onClick={handleAuth} disabled={loading||!email||!password}>{loading?"Loading…":mode==="signup"?"Create Account":"Sign In"}</Btn>
              </div>
            </>
          )}
          <div style={{padding:12,background:C.goldDim,borderRadius:6,border:`1px solid ${C.goldBorder}`}}>
            <Lbl style={{marginBottom:10}}>Quick Demo — All Portals</Lbl>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {DEMO_USERS.map(u=>{
                const rm=ROLES[u.primaryRole];
                return(
                  <button key={u.id} onClick={()=>quick(u)}
                    style={{padding:"5px 11px",background:`${rm.color}18`,border:`1px solid ${rm.color}44`,borderRadius:4,color:rm.color,fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:700}}>
                    {rm.icon} {u.name.split(" ")[0]} {u.isNew&&"🆕"}
                  </button>
                );
              })}
            </div>
            <div style={{fontSize:10,color:C.muted,marginTop:8}}>🆕 = triggers new user onboarding flow</div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════
export default function MillMarket(){
  const [user,setUser]=useState(null);
  const [activeRole,setActiveRole]=useState(null);
  const [view,setView]=useState("dashboard");
  const [onboarding,setOnboarding]=useState(false);
  const [authLoading,setAuthLoading]=useState(true);
  const mobile=useMobile(); // ← must be before any conditional returns

  // App-level data hooks — called unconditionally (before any early returns)
  const {data:appMills,setData:setAppMills}=useMills(user?.id||null,MILLS_DATA);
  const {data:appTickets,setData:setAppTickets}=useTickets(user?.id||null,MOCK_TICKETS);
  const {data:appJobSites,setData:setAppJobSites}=useJobSites(user?.id||null,JOB_SITES);
  const {data:appHauls,setData:setAppHauls}=useHauls(user?.id||null,HAULS);
  const {data:appCrew,setData:setAppCrew}=useCrew(user?.id||null,CREW);
  const {data:appAlerts,setData:setAppAlerts}=useAlerts(user?.id||null,ALERTS_DATA);
  const {data:appUsers,setData:setAppUsers}=useAllUsers(user?.id||null,ALL_USERS);
  const {data:appPendingMills,setData:setAppPendingMills}=usePendingMills(user?.id||null,PENDING_MILLS);
  const {data:appPendingRates,setData:setAppPendingRates}=usePendingRates(user?.id||null,PENDING_RATES);

  const appData=useMemo(()=>({
    mills:appMills, setMills:setAppMills,
    tickets:appTickets, setTickets:setAppTickets,
    jobSites:appJobSites, setJobSites:setAppJobSites,
    hauls:appHauls, setHauls:setAppHauls,
    crew:appCrew, setCrew:setAppCrew,
    alerts:appAlerts, setAlerts:setAppAlerts,
    users:appUsers, setUsers:setAppUsers,
    pendingMills:appPendingMills, setPendingMills:setAppPendingMills,
    pendingRates:appPendingRates, setPendingRates:setAppPendingRates,
  }),[appMills,setAppMills,appTickets,setAppTickets,appJobSites,setAppJobSites,appHauls,setAppHauls,appCrew,setAppCrew,appAlerts,setAppAlerts,appUsers,setAppUsers,appPendingMills,setAppPendingMills,appPendingRates,setAppPendingRates]);

  // Check for existing Supabase session on mount
  useEffect(()=>{
    let cancelled=false;
    (async()=>{
      try{
        const {getSession}=await import("./lib/supabase.js").then(m=>import("./lib/auth.js"));
        const session=await getSession();
        if(session?.user&&!cancelled){
          const {supabase}=await import("./lib/supabase.js");
          const {data:profile}=await supabase.from("profiles").select("*").eq("id",session.user.id).single();
          login({
            id:session.user.id,
            name:profile?.name||session.user.user_metadata?.name||session.user.email?.split("@")[0],
            email:session.user.email,
            roles:profile?.roles||["logger"],
            primaryRole:profile?.roles?.[0]||"logger",
            company:profile?.company||"",
            plan:profile?.plan||"free",
            isNew:!profile?.roles?.length,
          });
        }
      }catch(e){/* no session or Supabase not configured — fall through to login screen */}
      if(!cancelled)setAuthLoading(false);
    })();
    return()=>{cancelled=true;};
  },[]);

  const login=u=>{
    setUser(u);
    setActiveRole(u.primaryRole||u.roles?.[0]);
    setAuthLoading(false);
    if(u.isNew){setOnboarding(true);return;}
    setView(u.primaryRole==="contract"?"tickets":"dashboard");
  };

  const finishOnboarding=async(formData)=>{
    setOnboarding(false);
    setView("dashboard");
    // Persist onboarding data to Supabase so it doesn't re-trigger
    if(user?.id&&!isDemo(user.id)){
      try{
        const {supabase}=await import("./lib/supabase.js");
        const updates={
          roles:[formData?.primaryRole||"logger"],
          company:formData?.companyName||"",
          name:user.name,
        };
        await supabase.from("profiles").upsert({id:user.id,...updates});
        setUser(u=>({...u,...updates,primaryRole:updates.roles[0],isNew:false}));
        setActiveRole(updates.roles[0]);
      }catch(e){console.error("Failed to save onboarding:",e);}
    }
  };

  const switchRole=r=>{setActiveRole(r);setView("dashboard");};

  if(authLoading) return(
    <div style={{minHeight:"100vh",background:C.ink,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:48,letterSpacing:5,color:C.gold,marginBottom:12}}>MILL<span style={{color:C.sawdust}}>MARKET</span></div>
        <div style={{fontSize:12,color:C.muted}}>Loading...</div>
      </div>
    </div>
  );
  if(!user) return <AuthScreen onLogin={login}/>;
  if(onboarding) return <AppDataContext.Provider value={appData}><Onboarding onComplete={finishOnboarding}/></AppDataContext.Provider>;

  const rc=ROLES[activeRole]?.color||C.gold;
  const isPrivileged=user.roles?.includes("owner")||user.roles?.includes("admin");

  const renderView=()=>{
    if(view==="settings")    return <Settings user={user} activeRole={activeRole}/>;

    if(activeRole==="owner"){
      if(view==="dashboard")   return <OwnerDashboard setView={setView} user={user}/>;
      if(view==="pl")          return <OwnerPL user={user}/>;
      if(view==="cashflow")    return <CashFlowPlanner/>;
    }
    if(activeRole==="logger"||activeRole==="trucker"){
      if(view==="cashflow")    return <CashFlowPlanner/>;
    }
    if(activeRole==="trucker"){
      if(view==="dashboard")   return <TruckerDashboard setView={setView}/>;
      if(view==="cashflow")    return <CashFlowPlanner/>;
    }
    if(activeRole==="mill"){
      if(view==="dashboard")   return <MillDashboard setView={setView} user={user}/>;
      if(view==="rates")       return <MillRates/>;
      if(view==="quotas")      return <MillQuotas/>;
      if(view==="mill_tickets")return <MillTicketVerify/>;
      if(view==="mill_reports")return <MillReports/>;
    }
    if(activeRole==="admin"){
      if(view==="dashboard")   return <AdminDashboard/>;
      if(view==="users")       return <AdminUsers/>;
      if(view==="mills_verify")return <MillVerification/>;
      if(view==="rates_mod")   return <RateModeration/>;
      if(view==="integration") return <AdminIntegrations/>;
    }

    // Shared views
    if(view==="dashboard")   return <LoggerOwnerDashboard setView={setView} user={user}/>;
    if(view==="haul")        return <HaulCalculator/>;
    if(view==="reports")     return <Reports/>;
    if(view==="submit")      return <RateSubmit/>;
    if(view==="alerts")      return <Alerts/>;
    if(view==="fuellog")     return <FuelLog/>;
    if(view==="crew")        return <CrewManagement user={user}/>;
    if(view==="tickets")     return <LoadTicketsWithAutofill user={user} activeRole={activeRole}/>;
    if(view==="cashflow")    return <CashFlowPlanner/>;
    if(view==="map")         return <MapView user={user} activeRole={activeRole}/>;

    if(view==="integration"&&!isPrivileged) return(
      <div style={{padding:60,maxWidth:480,margin:"0 auto",textAlign:"center"}}>
        <div style={{fontSize:52,marginBottom:16}}>🔒</div>
        <H1 size={28} color={C.muted} style={{marginBottom:12}}>OWNER ACCESS ONLY</H1>
        <div style={{color:C.muted,fontSize:13,lineHeight:1.7}}>API and integrations are restricted to Owner and Admin accounts.</div>
      </div>
    );

    return(
      <div style={{padding:40,maxWidth:640,margin:"0 auto"}}>
        <Lbl>{activeRole} · {view}</Lbl>
        <H1 size={32} color={C.muted} style={{marginTop:8,marginBottom:14}}>{view.replace(/_/g," ").toUpperCase()}</H1>
        <div style={{color:C.muted,fontSize:14,lineHeight:1.75,marginBottom:22}}>Navigate to a completed view using the sidebar.</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {(NAV[activeRole]||[]).slice(0,5).map(n=><Btn key={n.id} v="outline" onClick={()=>setView(n.id)}>{n.icon} {n.label}</Btn>)}
        </div>
      </div>
    );
  };

  return(
    <UserIdContext.Provider value={user?.id}>
    <AppDataContext.Provider value={appData}>
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#0E0904}
        ::-webkit-scrollbar{width:5px;background:#1A1008}
        ::-webkit-scrollbar-thumb{background:rgba(200,149,42,0.2);border-radius:3px}
        input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}
        select option{background:#1A1008;color:#E8D5B0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulseRing{0%{transform:scale(1);opacity:0.5}70%{transform:scale(2.2);opacity:0}100%{transform:scale(2.2);opacity:0}}
        .mobile-table{overflow-x:auto;-webkit-overflow-scrolling:touch}
        .mobile-table table{min-width:600px}
        @media(max-width:767px){
          .hide-mobile{display:none!important}
          .stack-mobile{flex-direction:column!important}
          .full-mobile{width:100%!important;min-width:0!important}
          .pad-mobile{padding:14px!important}
          .grid-1-mobile{grid-template-columns:1fr!important}
        }
      `}</style>
      <div style={{minHeight:"100vh",background:C.ink,color:C.sawdust,fontFamily:"'DM Sans',system-ui,sans-serif"}}>
        <Sidebar user={user} activeRole={activeRole} view={view} setView={setView}/>
        <div style={{marginLeft:mobile?0:218,height:view==="map"?"100vh":undefined,minHeight:view==="map"?undefined:"100vh",display:"flex",flexDirection:"column",paddingBottom:mobile&&view!=="map"?64:0,overflow:view==="map"?"hidden":undefined}}>
          {/* TOPBAR */}
          <div style={{height:mobile?48:50,flexShrink:0,background:"rgba(8,5,2,0.97)",backdropFilter:"blur(12px)",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",padding:`0 ${mobile?14:20}px`,gap:mobile?8:12,position:view==="map"?"relative":"sticky",top:0,zIndex:40}}>
            {mobile?(
              <>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,letterSpacing:3,color:C.gold}}>MILL<span style={{color:C.sawdust}}>MARKET</span></div>
                <div style={{flex:1}}/>
                {user.roles?.length>1&&(
                  <div style={{display:"flex",gap:2,padding:"2px",background:"rgba(14,9,4,0.7)",borderRadius:16,border:`1px solid ${C.border}`}}>
                    {user.roles.map(r=>{const rm=ROLES[r];const act=activeRole===r;return(
                      <button key={r} onClick={()=>switchRole(r)} style={{padding:"3px 8px",borderRadius:12,border:"none",background:act?`${rm.color}22`:"transparent",color:act?rm.color:C.muted,fontSize:10,fontWeight:act?700:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{rm.icon}</button>
                    );})}
                  </div>
                )}
                <select value={user.id} onChange={e=>{const u=DEMO_USERS.find(x=>x.id===e.target.value);if(u)login(u);}}
                  style={{fontSize:11,color:C.muted,background:"rgba(14,9,4,0.8)",border:`1px solid ${C.border}`,borderRadius:4,padding:"3px 6px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",outline:"none",maxWidth:80}}>
                  {!isDemo(user.id)&&<option value={user.id}>{user.name||user.email?.split("@")[0]}</option>}
                  {!isDemo(user.id)&&<option disabled>── Demo Accounts ──</option>}
                  {DEMO_USERS.map(u=><option key={u.id} value={u.id}>{ROLES[u.primaryRole]?.icon} {u.name.split(" ")[0]}{u.isNew?" 🆕":""}</option>)}
                </select>
                <button onClick={async()=>{try{const {signOut}=await import("./lib/auth.js");await signOut();}catch(e){}setUser(null);setActiveRole(null);setView("dashboard");}} style={{fontSize:18,color:C.muted,background:"transparent",border:"none",cursor:"pointer",padding:"2px 4px"}}>⏻</button>
              </>
            ):(
              <>
                <div style={{flex:1,fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:2,color:C.muted}}>{ROLES[activeRole]?.icon} {activeRole?.toUpperCase()} PORTAL</div>
                {user.roles?.length>1&&(
                  <div style={{display:"flex",gap:3,padding:"3px",background:"rgba(14,9,4,0.7)",borderRadius:20,border:`1px solid ${C.border}`}}>
                    {user.roles.map(r=>{const rm=ROLES[r];const act=activeRole===r;return(
                      <button key={r} onClick={()=>switchRole(r)} style={{display:"flex",alignItems:"center",gap:4,padding:"4px 11px",borderRadius:16,border:"none",background:act?`${rm.color}22`:"transparent",color:act?rm.color:C.muted,fontSize:11,fontWeight:act?700:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.12s"}}>{rm.icon} {rm.label}</button>
                    );})}
                  </div>
                )}
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:4,padding:"3px 9px",background:C.freshDim,border:`1px solid ${C.freshBorder}`,borderRadius:14}}>
                    <span style={{width:5,height:5,borderRadius:"50%",background:C.fresh}}/>
                    <span style={{fontSize:10,color:C.fresh,fontFamily:"'DM Mono',monospace"}}>LIVE</span>
                  </div>
                  <select value={user.id} onChange={e=>{const u=DEMO_USERS.find(x=>x.id===e.target.value);if(u)login(u);}}
                    style={{fontSize:11,color:C.muted,background:"rgba(14,9,4,0.8)",border:`1px solid ${C.border}`,borderRadius:4,padding:"3px 8px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",outline:"none"}}>
                    {!isDemo(user.id)&&<option value={user.id}>👤 {user.name||user.email?.split("@")[0]}</option>}
                    {!isDemo(user.id)&&<option disabled>── Demo Accounts ──</option>}
                    {DEMO_USERS.map(u=><option key={u.id} value={u.id}>{ROLES[u.primaryRole]?.icon} {u.name}{u.isNew?" 🆕":""}</option>)}
                  </select>
                  <button onClick={async()=>{try{const {signOut}=await import("./lib/auth.js");await signOut();}catch(e){}setUser(null);setActiveRole(null);setView("dashboard");}} style={{fontSize:11,color:C.muted,background:"transparent",border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Sign Out</button>
                </div>
              </>
            )}
          </div>
          <div style={{flex:1,overflowY:"auto",animation:"fadeUp 0.18s ease"}} key={`${activeRole}-${view}`}>
            {renderView()}
          </div>
        </div>
      </div>
    </>
    </AppDataContext.Provider>
    </UserIdContext.Provider>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAP WITH JOB SITE PIN-DROP & SHARE
// ═══════════════════════════════════════════════════════════════════════════
function MapView({user,activeRole}){
  const {mills,jobSites,setJobSites,crew:crewData}=useAppData();
  const mobile=useMobile();
  const [selectedMill,setSelectedMill]=useState(null);
  const [selectedSite,setSelectedSite]=useState(null);
  const [tab,setTab]=useState("mills");
  const [pinMode,setPinMode]=useState(false);
  const [newPin,setNewPin]=useState(null);
  const [pinModal,setPinModal]=useState(false);
  const [shareModal,setShareModal]=useState(null);
  const [pinForm,setPinForm]=useState({name:"",acres:"",species:[],notes:""});
  const [pinSaved,setPinSaved]=useState(false);
  const [shareSent,setShareSent]=useState(false);
  const [filterConf,setFilterConf]=useState("all");
  const [userLoc,setUserLoc]=useState(null);
  const [locError,setLocError]=useState(null);
  const [radius,setRadius]=useState(500);
  const isOwnerOrLogger=["owner","logger"].includes(activeRole);

  useEffect(()=>{
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(
        (pos)=>setUserLoc({lat:pos.coords.latitude,lng:pos.coords.longitude}),
        (err)=>setLocError(err.message),
        {enableHighAccuracy:false,timeout:10000}
      );
    }
  },[]);

  const savePin=()=>{
    const site={id:`j${Date.now()}`,name:pinForm.name||"New Job Site",lat:newPin.lat,lng:newPin.lng,x:newPin.x,y:newPin.y,county:"—",state:"WI",acres:parseInt(pinForm.acres)||0,species:pinForm.species,estimatedTons:0,completedTons:0,status:"active",color:C.gold,nearestMill:"—",distToMill:0,sharedWith:[],notes:pinForm.notes};
    setJobSites(p=>[...p,site]);
    setPinMode(false);setPinModal(false);setPinSaved(true);
    setPinForm({name:"",acres:"",species:[],notes:""});
    setTimeout(()=>setPinSaved(false),2200);
  };
  const shareLink=site=>`https://millmarket.com/site/${site?.id}?lat=${site?.lat}&lng=${site?.lng}&name=${encodeURIComponent(site?.name||"")}`;
  const sendShare=()=>{setShareSent(true);setTimeout(()=>setShareModal(null),1400);};

  const filteredMills=mills.filter(m=>{
    if(filterConf==="high") return m.confidence>=80;
    if(filterConf==="accepting") return m.accepting;
    if(filterConf==="low") return m.confidence<70;
    return true;
  }).filter(m=>{
    if(!userLoc||!m.lat||!m.lng) return true;
    return haversineDistance(userLoc.lat,userLoc.lng,m.lat,m.lng)<=radius;
  });

  const makeIcon=(color,size=12,selected=false)=>L.divIcon({className:"",iconSize:[size,size],iconAnchor:[size/2,size/2],html:`<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color}cc;border:2px solid ${color};box-shadow:0 0 ${selected?14:7}px ${color}60;"></div>`});
  const makePinIcon=(color,size=22,selected=false)=>L.divIcon({className:"",iconSize:[size,size+8],iconAnchor:[size/2,size+8],html:`<div style="display:flex;flex-direction:column;align-items:center"><div style="width:${size}px;height:${size}px;border-radius:50% 50% 50% 0;background:${color};border:2px solid ${color};transform:rotate(-45deg);box-shadow:0 2px 10px ${color}60;display:flex;align-items:center;justify-content:center"><span style="transform:rotate(45deg);font-size:${selected?12:9}px">📍</span></div><div style="width:2px;height:8px;background:${color};margin-top:-1px;border-radius:1px"></div></div>`});

  function MapClickHandler(){
    useMapEvents({click(e){if(!pinMode)return;const{lat,lng}=e.latlng;setNewPin({lat,lng,x:"50%",y:"50%"});setPinModal(true);}});
    return null;
  }

  function MapAutoCenter({userLoc:loc}){
    const map=useMapEvents({});
    useEffect(()=>{
      if(loc){map.setView([loc.lat,loc.lng],7);}
    },[loc,map]);
    return null;
  }

  function MapResizeHandler(){
    const map=useMapEvents({});
    useEffect(()=>{
      // Invalidate on mount after layout settles
      const t1=setTimeout(()=>map.invalidateSize(),50);
      const t2=setTimeout(()=>map.invalidateSize(),300);
      // Also observe container resize
      const container=map.getContainer();
      let ro;
      if(window.ResizeObserver&&container){
        ro=new ResizeObserver(()=>map.invalidateSize());
        ro.observe(container);
      }
      return()=>{clearTimeout(t1);clearTimeout(t2);if(ro)ro.disconnect();};
    },[map]);
    return null;
  }

  return(
    <div style={{display:"flex",flexDirection:mobile?"column":"row",flex:1,overflow:"hidden",position:"relative"}}>
      <div style={{flex:"1 1 0%",position:"relative",overflow:"hidden",minWidth:0,minHeight:0,width:"100%",height:"100%"}}>
        <MapContainer center={[44.5,-90]} zoom={5} style={{position:"absolute",top:0,left:0,right:0,bottom:0,cursor:pinMode?"crosshair":"grab"}} zoomControl={false} attributionControl={false}>
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution="Esri Satellite"/>
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}" opacity={0.5}/>
          <MapClickHandler/>
          <MapAutoCenter userLoc={userLoc}/>
          <MapResizeHandler/>
          {userLoc&&<Marker position={[userLoc.lat,userLoc.lng]} icon={L.divIcon({className:"",iconSize:[16,16],iconAnchor:[8,8],html:`<div style="width:16px;height:16px;border-radius:50%;background:#2A6B8A;border:3px solid #fff;box-shadow:0 0 10px rgba(42,107,138,0.6)"></div>`})}><Popup>Your Location</Popup></Marker>}
          {tab==="mills"&&filteredMills.map(m=>{
            const cc=confColor(m.confidence);const isSel=selectedMill?.id===m.id;
            return <Marker key={m.id} position={[m.lat,m.lng]} icon={makeIcon(cc,isSel?20:14,isSel)} eventHandlers={{click:()=>{if(!pinMode){setSelectedMill(m);setSelectedSite(null);}}}}>
              <Popup><div style={{fontWeight:600,fontSize:13,marginBottom:2}}>{m.name}</div><div style={{fontSize:10,color:"#666",marginBottom:4}}>{m.state} · {m.verified?"✓ Verified":"Unverified"}</div><div style={{fontSize:11}}>Confidence: {m.confidence}% · {m.accepting?"Open":"Closed"}</div></Popup>
            </Marker>;
          })}
          {tab==="sites"&&jobSites.map(site=>{
            const isSel=selectedSite?.id===site.id;
            return <Marker key={site.id} position={[site.lat,site.lng]} icon={makePinIcon(site.status==="complete"?C.steel:site.color,isSel?28:22,isSel)} eventHandlers={{click:()=>{if(!pinMode){setSelectedSite(site);setSelectedMill(null);}}}}>
              <Popup><div style={{fontWeight:600,fontSize:13,marginBottom:2}}>{site.name}</div><div style={{fontSize:10,color:"#666"}}>{site.county} · {site.acres}ac</div></Popup>
            </Marker>;
          })}
          {newPin&&pinMode&&<Marker position={[newPin.lat,newPin.lng]} icon={makePinIcon(C.gold,28,true)}/>}
        </MapContainer>

        {pinMode&&<div style={{position:"absolute",top:14,left:"50%",transform:"translateX(-50%)",background:"rgba(200,149,42,0.97)",borderRadius:24,padding:"10px 24px",display:"flex",alignItems:"center",gap:12,zIndex:1000,boxShadow:"0 4px 24px rgba(0,0,0,0.6)",border:"2px solid rgba(255,255,255,0.3)",animation:"fadeUp 0.18s ease"}}><span style={{fontSize:20}}>📍</span><div><span style={{fontSize:14,fontWeight:700,color:C.ink}}>PIN DROP MODE</span><br/><span style={{fontSize:12,color:"rgba(14,9,4,0.7)"}}>Click anywhere on the map to place your job site pin</span></div><Btn v="ghost" size="sm" onClick={()=>setPinMode(false)} style={{color:C.ink,border:`1px solid rgba(14,9,4,0.3)`,borderRadius:14}}>✕ Cancel</Btn></div>}
        {pinSaved&&<div style={{position:"absolute",top:14,left:"50%",transform:"translateX(-50%)",background:"rgba(90,138,42,0.95)",borderRadius:20,padding:"7px 18px",display:"flex",alignItems:"center",gap:8,zIndex:1000}}><span>✅</span><span style={{fontSize:13,fontWeight:700,color:"#fff"}}>Job site pinned and saved</span></div>}

        <div style={{position:"absolute",top:14,left:14,display:"flex",gap:8,zIndex:1000,flexWrap:"wrap"}}>
          <div style={{display:"flex",background:"rgba(14,9,4,0.92)",border:`1px solid ${C.border}`,borderRadius:6,overflow:"hidden"}}>
            {[["mills","🏭 Mills"],["sites","📍 Job Sites"]].map(([t,l])=>(
              <button key={t} onClick={()=>{setTab(t);setSelectedMill(null);setSelectedSite(null);}} style={{padding:"6px 13px",border:"none",background:tab===t?C.goldDim:"transparent",color:tab===t?C.gold:C.muted,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:600}}>{l}</button>
            ))}
          </div>
          {tab==="mills"&&<div style={{display:"flex",gap:5}}>{[["all","All"],["high","High Conf"],["accepting","Accepting"],["low","Stale"]].map(([v,l])=>(
            <button key={v} onClick={()=>setFilterConf(v)} style={{padding:"5px 10px",border:`1px solid ${filterConf===v?C.borderHi:C.border}`,borderRadius:14,background:filterConf===v?C.goldDim:"rgba(14,9,4,0.85)",color:filterConf===v?C.gold:C.muted,fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:600}}>{l}</button>
          ))}</div>}
          <div style={{display:"flex",alignItems:"center",gap:8,background:"rgba(14,9,4,0.92)",border:`1px solid ${C.border}`,borderRadius:6,padding:"6px 13px",marginTop:8}}>
            <span style={{fontSize:10,color:C.muted,whiteSpace:"nowrap"}}>📍 Radius</span>
            <input type="range" min={25} max={500} step={25} value={radius} onChange={e=>setRadius(Number(e.target.value))} style={{flex:1,accentColor:C.gold,height:4}}/>
            <span style={{fontSize:11,color:C.gold,fontFamily:"'DM Mono',monospace",minWidth:50,textAlign:"right"}}>{radius} mi</span>
          </div>
          {locError&&<div style={{background:"rgba(166,58,26,0.9)",borderRadius:6,padding:"4px 10px",fontSize:10,color:"#fff",marginTop:6}}>📍 Location access denied — showing all mills</div>}
          {userLoc&&!locError&&<div style={{background:"rgba(42,107,138,0.9)",borderRadius:6,padding:"4px 10px",fontSize:10,color:"#fff",marginTop:6}}>📍 Showing mills within {radius} mi</div>}
        </div>

        {tab==="sites"&&isOwnerOrLogger&&<div style={{position:"absolute",bottom:20,left:"50%",transform:"translateX(-50%)",zIndex:1000}}><Btn onClick={()=>{setPinMode(!pinMode);setSelectedSite(null);}} v={pinMode?"danger":"gold"} size="lg" style={{borderRadius:24,boxShadow:"0 4px 20px rgba(0,0,0,0.6)"}}>{pinMode?"✕ Cancel":"📍 Drop Job Site Pin"}</Btn></div>}

        <div style={{position:"absolute",bottom:20,right:14,background:"rgba(14,9,4,0.92)",border:`1px solid ${C.border}`,borderRadius:6,padding:"8px 13px",display:"flex",gap:14,zIndex:1000}}>
          {(tab==="mills"?[[C.fresh,"Mill-Verified"],[C.gold,"User-Reported"],[C.rust,"Stale/Closed"]]:[[C.fresh,"Active"],[C.blue,"Shared"],[C.steel,"Complete"],[C.gold,"New"]]).map(([c,l])=>(
            <div key={l} style={{display:"flex",alignItems:"center",gap:5,fontSize:10,color:C.muted}}><div style={{width:7,height:7,borderRadius:"50%",background:c}}/>{l}</div>
          ))}
        </div>

      {/* SIDE PANEL — desktop: absolute inside map wrapper; mobile: rendered outside below */}
      {!mobile&&(selectedMill||selectedSite)?<div style={{position:"absolute",right:0,top:0,bottom:0,width:340,background:C.bark,borderLeft:`1px solid ${C.border}`,overflowY:"auto",zIndex:1000,boxShadow:"-4px 0 20px rgba(0,0,0,0.4)"}}>
        {selectedMill&&tab==="mills"&&(
          <div>
            <div style={{padding:"16px 16px 12px",borderBottom:`1px solid ${C.border}`,background:"rgba(45,26,12,0.4)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,letterSpacing:1,lineHeight:1.1,flex:1}}>{selectedMill.name}</div>
                <button onClick={()=>setSelectedMill(null)} style={{background:"transparent",border:"none",color:C.muted,fontSize:18,cursor:"pointer",padding:"0 4px",lineHeight:1}}>✕</button>
                {selectedMill.verified?<Badge color={C.fresh}>✓ VERIFIED</Badge>:<Badge color={C.rust}>UNVERIFIED</Badge>}
              </div>
              <div style={{fontSize:11,color:C.muted,marginBottom:8}}>📍 {selectedMill.state}{userLoc&&selectedMill.lat?` · ${Math.round(haversineDistance(userLoc.lat,userLoc.lng,selectedMill.lat,selectedMill.lng))} mi away`:""}</div>
              <div style={{marginBottom:8}}>{selectedMill.accepting?<Badge color={C.fresh} dot>Accepting Loads</Badge>:<Badge color={C.rust}>🚫 Closed</Badge>}</div>
              <ConfBar score={selectedMill.confidence}/>
              <div style={{fontSize:9,color:C.muted,marginTop:4}}>Confidence {selectedMill.confidence}%</div>
            </div>
            <div style={{padding:14}}>
              <Lbl style={{marginBottom:10}}>Current Rates</Lbl>
              {Object.entries(selectedMill.rates).map(([sp,price])=>(
                <div key={sp} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid rgba(255,255,255,0.04)`,fontSize:12}}>
                  <span style={{color:C.muted}}>{sp}</span><Mono style={{color:C.sawdust}}>${price.toFixed(2)}<span style={{fontSize:10,color:C.muted}}>/ton</span></Mono>
                </div>
              ))}
              <div style={{marginTop:14,display:"flex",flexDirection:"column",gap:7}}>
                <Btn full size="sm">🚛 Plan Haul to This Mill</Btn>
                <Btn v="outline" full size="sm">📝 Submit Rate Update</Btn>
              </div>
            </div>
          </div>
        )}

        {selectedSite&&tab==="sites"&&(
          <div>
            <div style={{padding:"16px 16px 12px",borderBottom:`1px solid ${C.border}`,background:"rgba(45,26,12,0.4)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,letterSpacing:1,lineHeight:1.1,flex:1}}>{selectedSite.name}</div>
                <button onClick={()=>setSelectedSite(null)} style={{background:"transparent",border:"none",color:C.muted,fontSize:18,cursor:"pointer",padding:"0 4px",lineHeight:1}}>✕</button>
                <Badge color={selectedSite.status==="active"?C.fresh:C.steel}>{selectedSite.status}</Badge>
              </div>
              <div style={{fontSize:11,color:C.muted,marginBottom:6}}>📍 {selectedSite.county} · {selectedSite.acres} acres</div>
              <Mono style={{fontSize:10,color:C.gold,display:"block",marginBottom:8}}>{selectedSite.lat?.toFixed(4)}°N, {Math.abs(selectedSite.lng||0).toFixed(4)}°W</Mono>
              {selectedSite.estimatedTons>0&&(
                <>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:5}}><span style={{color:C.muted}}>Volume Progress</span><Mono style={{color:C.sawdust}}>{selectedSite.completedTons}/{selectedSite.estimatedTons}t</Mono></div>
                  <ConfBar score={Math.round((selectedSite.completedTons/selectedSite.estimatedTons)*100)} h={6} color={selectedSite.color}/>
                </>
              )}
            </div>
            <div style={{padding:14}}>
              <Lbl style={{marginBottom:10}}>Site Details</Lbl>
              {[["Nearest Mill",selectedSite.nearestMill?.split("—")[0]?.trim()||"—"],["Distance",selectedSite.distToMill?`${selectedSite.distToMill} mi`:"—"],["Shared With",selectedSite.sharedWith?.length>0?selectedSite.sharedWith.join(", "):"Not shared"]].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:12,padding:"6px 0",borderBottom:`1px solid rgba(255,255,255,0.04)`}}><span style={{color:C.muted}}>{l}</span><span style={{color:C.sawdust,textAlign:"right",maxWidth:160,wordBreak:"break-word"}}>{v}</span></div>
              ))}
              {selectedSite.species?.length>0&&<div style={{marginTop:10}}><Lbl style={{marginBottom:6}}>Species</Lbl><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{selectedSite.species.map(s=><Badge key={s} color={C.steel}>{s}</Badge>)}</div></div>}
              <div style={{marginTop:14,padding:12,background:C.blueDim,border:`1px solid ${C.blueBorder}`,borderRadius:6,marginBottom:10}}>
                <Lbl color={C.blue} style={{marginBottom:6}}>Share This Pin</Lbl>
                <Btn v="blue" size="sm" full onClick={()=>{setShareModal(selectedSite);setShareSent(false);}}>📤 Share with Team</Btn>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:C.blue,wordBreak:"break-all",lineHeight:1.5,background:"rgba(14,9,4,0.4)",padding:"6px 8px",borderRadius:4,marginTop:8}}>{shareLink(selectedSite)}</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:7}}>
                {isOwnerOrLogger&&<Btn full size="sm">+ Log Haul from This Site</Btn>}
                <Btn v="outline" full size="sm">🎫 View Tickets for Site</Btn>
                <Btn v="danger" full size="sm">🗑 Remove Pin</Btn>
              </div>
            </div>
          </div>
        )}

      </div>:null}
      </div>{/* end map wrapper */}

      {/* Mobile side panel — outside map wrapper as flex sibling */}
      {mobile&&(selectedMill||selectedSite)?<div style={{maxHeight:"40vh",background:C.bark,borderTop:`1px solid ${C.border}`,overflowY:"auto",flexShrink:0}}>
        {selectedMill&&tab==="mills"&&(<div>
          <div style={{padding:"16px 16px 12px",borderBottom:`1px solid ${C.border}`,background:"rgba(45,26,12,0.4)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,letterSpacing:1,lineHeight:1.1,flex:1}}>{selectedMill.name}</div>
              <button onClick={()=>setSelectedMill(null)} style={{background:"transparent",border:"none",color:C.muted,fontSize:18,cursor:"pointer",padding:"0 4px",lineHeight:1}}>✕</button>
            </div>
            <div style={{fontSize:11,color:C.muted,marginBottom:8}}>📍 {selectedMill.state}{userLoc&&selectedMill.lat?` · ${Math.round(haversineDistance(userLoc.lat,userLoc.lng,selectedMill.lat,selectedMill.lng))} mi away`:""}</div>
            <div style={{marginBottom:8}}>{selectedMill.accepting?<Badge color={C.fresh} dot>Accepting Loads</Badge>:<Badge color={C.rust}>🚫 Closed</Badge>}</div>
          </div>
          <div style={{padding:14}}>
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              <Btn full size="sm">🚛 Plan Haul to This Mill</Btn>
              <Btn v="outline" full size="sm">📝 Submit Rate Update</Btn>
            </div>
          </div>
        </div>)}
        {selectedSite&&tab==="sites"&&(<div>
          <div style={{padding:"16px 16px 12px",borderBottom:`1px solid ${C.border}`,background:"rgba(45,26,12,0.4)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,letterSpacing:1,lineHeight:1.1,flex:1}}>{selectedSite.name}</div>
              <button onClick={()=>setSelectedSite(null)} style={{background:"transparent",border:"none",color:C.muted,fontSize:18,cursor:"pointer",padding:"0 4px",lineHeight:1}}>✕</button>
            </div>
            <div style={{fontSize:11,color:C.muted,marginBottom:6}}>📍 {selectedSite.county} · {selectedSite.acres} acres</div>
          </div>
          <div style={{padding:14}}>
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              {isOwnerOrLogger&&<Btn full size="sm">+ Log Haul from This Site</Btn>}
              <Btn v="outline" full size="sm">🎫 View Tickets for Site</Btn>
            </div>
          </div>
        </div>)}
      </div>:null}

      {pinModal&&(
        <Modal title="📍 NEW JOB SITE PIN" onClose={()=>{setPinModal(false);setPinMode(false);setNewPin(null);}}>
          <div style={{display:"flex",flexDirection:"column",gap:13}}>
            <div style={{padding:"8px 12px",background:C.goldDim,border:`1px solid ${C.goldBorder}`,borderRadius:5,fontSize:11,color:C.gold,fontFamily:"'DM Mono',monospace"}}>📍 {newPin?.lat?.toFixed(4)}°N, {Math.abs(newPin?.lng||0).toFixed(4)}°W</div>
            <Inp label="Site Name" placeholder="Rhinelander NW Block" value={pinForm.name} onChange={e=>setPinForm(p=>({...p,name:e.target.value}))}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <Inp label="Acres" suffix="ac" value={pinForm.acres} onChange={e=>setPinForm(p=>({...p,acres:e.target.value}))} type="number"/>
              <Sel label="Status" value="active" onChange={()=>{}}><option>active</option><option>scouting</option><option>permitted</option></Sel>
            </div>
            <div>
              <Lbl style={{marginBottom:8}}>Species on Site</Lbl>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {["Pine Sawtimber","Chip-n-Saw","Hardwood Pulp","Maple Hardwood","Aspen","Softwood Pulp","Mixed Chips"].map(sp=>{
                  const on=pinForm.species.includes(sp);
                  return <button key={sp} onClick={()=>setPinForm(p=>({...p,species:on?p.species.filter(s=>s!==sp):[...p.species,sp]}))} style={{padding:"4px 10px",borderRadius:12,border:`1px solid ${on?C.goldBorder:C.border}`,background:on?C.goldDim:"rgba(14,9,4,0.5)",color:on?C.gold:C.muted,fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:600,transition:"all 0.12s"}}>{sp}</button>;
                })}
              </div>
            </div>
            <div>
              <Lbl style={{marginBottom:7}}>Share Immediately With</Lbl>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{crewData.filter(c=>c.status==="active"&&c.hourly).map(m=><Badge key={m.id} color={C.blue}>{m.name.split(" ")[0]}</Badge>)}</div>
              <div style={{fontSize:10,color:C.muted,marginTop:6}}>Active team members will receive a push notification with the pin link.</div>
            </div>
            <Inp label="Notes (optional)" placeholder="Access via County Rd B, gate code 4412…" value={pinForm.notes} onChange={e=>setPinForm(p=>({...p,notes:e.target.value}))}/>
            <div style={{display:"flex",gap:9}}>
              <Btn v="outline" full onClick={()=>{setPinModal(false);setPinMode(false);setNewPin(null);}}>Cancel</Btn>
              <Btn full disabled={!pinForm.name} onClick={savePin}>Save Pin & Notify Team</Btn>
            </div>
          </div>
        </Modal>
      )}

      {shareModal&&(
        <Modal title="📤 SHARE JOB SITE PIN" onClose={()=>setShareModal(null)} width={460}>
          {shareSent?(
            <div style={{textAlign:"center",padding:"20px 0"}}><div style={{fontSize:44,marginBottom:12}}>✅</div><H1 size={24} color={C.fresh}>PIN SHARED</H1><div style={{fontSize:12,color:C.muted,marginTop:8}}>Team members have been notified with a link to the site pin.</div></div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:13}}>
              <div style={{fontWeight:600,fontSize:15}}>{shareModal.name}</div>
              <div style={{padding:10,background:C.goldDim,border:`1px solid ${C.goldBorder}`,borderRadius:5}}>
                <Lbl style={{marginBottom:6}}>Share Link</Lbl>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:C.gold,wordBreak:"break-all",lineHeight:1.6}}>{shareLink(shareModal)}</div>
              </div>
              <div>
                <Lbl style={{marginBottom:8}}>Send To</Lbl>
                <div style={{display:"flex",flexDirection:"column",gap:5}}>
                  {crewData.filter(c=>c.status==="active"&&c.hourly).map(m=>(
                    <label key={m.id} style={{display:"flex",alignItems:"center",gap:9,padding:"7px 10px",borderRadius:4,background:"rgba(14,9,4,0.4)",cursor:"pointer"}}>
                      <input type="checkbox" defaultChecked style={{accentColor:C.gold}}/>
                      <span style={{fontSize:13}}>{m.name}</span><span style={{fontSize:10,color:C.muted,marginLeft:"auto"}}>{m.entity}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Sel label="Send Via"><option>In-App Push Notification</option><option>SMS Text Message</option><option>Email</option><option>All of the above</option></Sel>
              <div style={{display:"flex",gap:9}}><Btn v="outline" full onClick={()=>setShareModal(null)}>Cancel</Btn><Btn v="blue" full onClick={sendShare}>Send Pin to Team</Btn></div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LOAD TICKETS WITH AUTOFILL
// ═══════════════════════════════════════════════════════════════════════════
function LoadTicketsWithAutofill({user,activeRole}){
  const {tickets,setTickets,mills,jobSites}=useAppData();
  const [userLoc,setUserLoc]=useState(null);
  useEffect(()=>{
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(
        (pos)=>setUserLoc({lat:pos.coords.latitude,lng:pos.coords.longitude}),
        ()=>{},{enableHighAccuracy:false,timeout:10000}
      );
    }
  },[]);
  const nearestMills=useMemo(()=>{
    const ref=userLoc||(jobSites.length>0?{lat:jobSites[0].lat,lng:jobSites[0].lng}:null);
    if(!ref) return mills.slice(0,25);
    return mills.filter(m=>m.lat&&m.lng).map(m=>({...m,_dist:haversineDistance(ref.lat,ref.lng,m.lat,m.lng)})).sort((a,b)=>a._dist-b._dist).slice(0,25);
  },[mills,userLoc,jobSites]);
  const [newModal,setNewModal]=useState(false);
  const [viewTicket,setViewTicket]=useState(null);
  const [photoFile,setPhotoFile]=useState(null);
  const [photoPreview,setPhotoPreview]=useState(null);
  const fileInputRef=useRef(null);
  const cameraInputRef=useRef(null);
  const viewFileInputRef=useRef(null);
  const handlePhotoSelect=(e)=>{const f=e.target.files?.[0];if(f){setPhotoFile(f);setPhotoPreview(URL.createObjectURL(f));}};
  const clearPhoto=()=>{setPhotoFile(null);if(photoPreview)URL.revokeObjectURL(photoPreview);setPhotoPreview(null);};
  const photoSim=!!photoFile;
  const [submitted,setSubmitted]=useState(false);
  const lastTicket=tickets[0];
  const [opType,setOpType]=useState(lastTicket?.opType||"tree_length");
  const [form,setForm]=useState({no:"",date:new Date().toISOString().split("T")[0],mill:lastTicket?.mill||"",species:lastTicket?.species||"",jobSite:lastTicket?.jobSite||"",rate:lastTicket?.rate?.toString()||"",scaleTons:"",mbf:"",grossTons:"",moisture:"",notes:""});
  const [autofilled]=useState({mill:!!lastTicket?.mill,species:!!lastTicket?.species,jobSite:!!lastTicket?.jobSite,rate:!!lastTicket?.rate,opType:!!lastTicket?.opType});
  const h=f=>e=>setForm(p=>({...p,[f]:e.target.value}));
  const handleOpTypeChange=(k)=>{setOpType(k);if(k!==lastTicket?.opType)setForm(p=>({...p,species:""}));else setForm(p=>({...p,species:lastTicket?.species||""}));};
  const submitTicket=()=>{
    const qty=opType==="cut_to_length"?parseFloat(form.mbf)||0:parseFloat(form.scaleTons||form.grossTons)||0;
    const gross=qty*(parseFloat(form.rate)||0);
    const t={id:`t${Date.now()}`,no:form.no||`W-${Math.floor(Math.random()*90000+10000)}`,date:form.date,opType,mill:form.mill,species:form.species,scaleTons:opType==="cut_to_length"?null:qty,mbf:opType==="cut_to_length"?qty:null,rate:parseFloat(form.rate)||0,gross,status:photoSim?"photo_uploaded":"pending_photo",photo:photoSim,millVerified:false,jobSite:form.jobSite,submittedBy:user?.name||"You"};
    setTickets(p=>[t,...p]);setSubmitted(true);setTimeout(()=>{setNewModal(false);setSubmitted(false);clearPhoto();},1300);
  };
  const [ticketTab,setTicketTab]=useState("today");
  const statusColor={verified:C.fresh,photo_uploaded:C.blue,pending_photo:C.gold,under_review:C.purple,rejected:C.rust};
  const statusLabel={verified:"✓ Verified",photo_uploaded:"📸 Photo Uploaded",pending_photo:"⏳ Needs Photo",under_review:"🔍 Under Review",rejected:"✗ Rejected"};
  const isMill=activeRole==="mill";
  const mobile=useMobile();
  const today=new Date().toISOString().split("T")[0];
  const todayTickets=tickets.filter(t=>t.date===today);
  const previousTickets=tickets.filter(t=>t.date!==today);
  const displayTickets=ticketTab==="today"?todayTickets:previousTickets;

  return(
    <div style={{padding:mobile?14:26,maxWidth:1040,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:20,flexWrap:"wrap",gap:12}}>
        <div><Lbl>// Load Tickets</Lbl><H1 size={mobile?26:34} style={{marginTop:5}}>LOAD TICKET <span style={{color:C.gold}}>VERIFICATION</span></H1></div>
        {!isMill&&<Btn onClick={()=>setNewModal(true)}>+ New Ticket</Btn>}
      </div>
      <div style={{display:"grid",gridTemplateColumns:mobile?"1fr 1fr":"repeat(4,1fr)",gap:12,marginBottom:18}}>
        <StatCard label="Total" value={tickets.length} icon="🎫"/>
        <StatCard label="Verified" value={tickets.filter(t=>t.status==="verified").length} color={C.fresh} icon="✅"/>
        <StatCard label="Needs Photo" value={tickets.filter(t=>t.status==="pending_photo").length} color={C.gold} icon="📸"/>
        <StatCard label="Gross Revenue" value={fmt$(tickets.reduce((s,t)=>s+(t.gross||0),0))} color={C.sawdust} icon="💰"/>
      </div>
      <div style={{display:"flex",gap:0,marginBottom:14}}>
        {[["today",`Today (${todayTickets.length})`],["previous",`Previous (${previousTickets.length})`]].map(([k,label])=>(
          <button key={k} onClick={()=>setTicketTab(k)} style={{padding:"8px 18px",border:`1px solid ${C.border}`,borderBottom:ticketTab===k?`2px solid ${C.gold}`:`1px solid ${C.border}`,background:ticketTab===k?C.goldDim:"transparent",color:ticketTab===k?C.gold:C.muted,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{label}</button>
        ))}
      </div>
      <div style={{marginBottom:14,padding:"9px 14px",background:C.blueDim,border:`1px solid ${C.blueBorder}`,borderRadius:6,display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:16}}>📧</span>
        <div><span style={{fontSize:13,color:C.blue,fontWeight:600}}>Email ticket photos to </span><Mono style={{color:C.gold,fontSize:13}}>tickets@millmarket.com</Mono><span style={{fontSize:12,color:C.muted}}> — subject: ticket number. Auto-attaches to your account.</span></div>
      </div>
      {displayTickets.length===0?(
        <Card><div style={{textAlign:"center",padding:"30px 0"}}><div style={{fontSize:36,marginBottom:10}}>{ticketTab==="today"?"🎫":"📦"}</div><div style={{fontSize:14,color:C.muted}}>{ticketTab==="today"?"No tickets submitted today":"No previous tickets"}</div>{ticketTab==="today"&&!isMill&&<Btn style={{marginTop:14}} onClick={()=>setNewModal(true)}>+ Submit Your First Ticket</Btn>}</div></Card>
      ):mobile?(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {displayTickets.map(t=>{
            const op=OP_TYPES[t.opType];const qty=t.opType==="cut_to_length"?`${t.mbf} MBF`:`${(t.scaleTons||t.grossTons||0)}t`;
            return(
              <Card key={t.id} style={{cursor:"pointer",padding:14}} onClick={()=>setViewTicket(t)}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <Mono style={{color:C.gold,fontSize:14}}>{t.no}</Mono>
                  <Badge color={statusColor[t.status]||C.muted}>{statusLabel[t.status]||t.status}</Badge>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,fontSize:12,marginBottom:8}}>
                  <div><span style={{color:C.muted,fontSize:10}}>Date</span><div style={{color:C.sawdust}}>{t.date}</div></div>
                  <div><span style={{color:C.muted,fontSize:10}}>Mill</span><div style={{color:C.sawdust}}>{t.mill?.split("—")[0]?.trim()}</div></div>
                  <div><span style={{color:C.muted,fontSize:10}}>Site</span><div style={{color:C.sawdust,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.jobSite}</div></div>
                  <div><span style={{color:C.muted,fontSize:10}}>Species</span><div style={{color:C.sawdust}}>{t.species}</div></div>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:8,borderTop:`1px solid ${C.border}`}}>
                  <div style={{display:"flex",gap:14,alignItems:"center"}}>
                    <span style={{fontSize:12}}>{op?.icon} {op?.label}</span>
                    <Mono style={{fontSize:12}}>{qty}</Mono>
                  </div>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <Mono style={{color:C.fresh,fontSize:13}}>{fmt$(t.gross,2)}</Mono>
                    {t.photo&&<span style={{color:C.fresh}}>📸</span>}
                    {t.millVerified?<span style={{color:C.fresh}}>✓</span>:isMill?<button onClick={e=>{e.stopPropagation();setTickets(p=>p.map(x=>x.id===t.id?{...x,millVerified:true,status:"verified"}:x));}} style={{fontSize:10,color:C.blue,background:"transparent",border:`1px solid ${C.blueBorder}`,borderRadius:3,padding:"2px 6px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Verify</button>:null}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ):(
        <Card>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr style={{borderBottom:`1px solid ${C.border}`}}>{["Ticket #","Date","Site","Mill","Op Type","Species","Qty","Rate","Gross","Status","📸","Mill ✓"].map(h=><th key={h} style={{padding:"5px 9px",textAlign:"left",color:C.muted,fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:1,fontWeight:500,whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
            <tbody>
              {displayTickets.map(t=>{
                const op=OP_TYPES[t.opType];const qty=t.opType==="cut_to_length"?`${t.mbf} MBF`:`${(t.scaleTons||t.grossTons||0)}t`;
                return(
                  <tr key={t.id} style={{borderBottom:`1px solid rgba(255,255,255,0.03)`,cursor:"pointer",transition:"background 0.1s"}} onClick={()=>setViewTicket(t)} onMouseEnter={e=>e.currentTarget.style.background="rgba(200,149,42,0.04)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{padding:"9px 9px"}}><Mono style={{color:C.gold,fontSize:12}}>{t.no}</Mono></td>
                    <td style={{padding:"9px 9px",color:C.muted,fontSize:11}}>{t.date}</td>
                    <td style={{padding:"9px 9px",color:C.sawdust,maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.jobSite}</td>
                    <td style={{padding:"9px 9px",color:C.muted,whiteSpace:"nowrap"}}>{t.mill?.split("—")[0]?.trim()}</td>
                    <td style={{padding:"9px 9px"}}><span style={{fontSize:12}}>{op?.icon} {op?.label}</span></td>
                    <td style={{padding:"9px 9px",color:C.sawdust}}>{t.species}</td>
                    <td style={{padding:"9px 9px"}}><Mono>{qty}</Mono></td>
                    <td style={{padding:"9px 9px"}}><Mono>{fmt$(t.rate,2)}</Mono></td>
                    <td style={{padding:"9px 9px"}}><Mono style={{color:C.fresh}}>{fmt$(t.gross,2)}</Mono></td>
                    <td style={{padding:"9px 9px"}}><Badge color={statusColor[t.status]||C.muted}>{statusLabel[t.status]||t.status}</Badge></td>
                    <td style={{padding:"9px 9px",textAlign:"center"}}>{t.photo?<span style={{color:C.fresh}}>📸</span>:<span style={{color:C.rust,fontSize:11}}>—</span>}</td>
                    <td style={{padding:"9px 9px",textAlign:"center"}}>
                      {t.millVerified?<span style={{color:C.fresh}}>✓</span>:isMill?<button onClick={e=>{e.stopPropagation();setTickets(p=>p.map(x=>x.id===t.id?{...x,millVerified:true,status:"verified"}:x));}} style={{fontSize:10,color:C.blue,background:"transparent",border:`1px solid ${C.blueBorder}`,borderRadius:3,padding:"2px 6px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Verify</button>:<span style={{color:C.muted,fontSize:11}}>—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {viewTicket&&(
        <Modal title={`TICKET ${viewTicket.no}`} onClose={()=>setViewTicket(null)} width={600}>
          <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:10,marginBottom:14}}>
            {[["Date",viewTicket.date],["Mill",viewTicket.mill],["Job Site",viewTicket.jobSite],["Species",viewTicket.species],["Operation",OP_TYPES[viewTicket.opType]?.label],["Rate",`${fmt$(viewTicket.rate,2)} / ${OP_TYPES[viewTicket.opType]?.rateUnit}`]].map(([l,v])=>(
              <div key={l} style={{background:"rgba(14,9,4,0.5)",borderRadius:5,padding:"8px 11px"}}><div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:2}}>{l}</div><div style={{fontSize:13,color:C.sawdust}}>{v}</div></div>
            ))}
          </div>
          <div style={{display:"flex",gap:10,marginBottom:14}}>
            {viewTicket.scaleTons&&<div style={{flex:1,background:"rgba(14,9,4,0.5)",borderRadius:5,padding:"10px 12px",textAlign:"center"}}><div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:2}}>Scale Tons</div><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:C.gold}}>{viewTicket.scaleTons}</div></div>}
            {viewTicket.mbf&&<div style={{flex:1,background:"rgba(14,9,4,0.5)",borderRadius:5,padding:"10px 12px",textAlign:"center"}}><div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:2}}>MBF</div><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:C.gold}}>{viewTicket.mbf}</div></div>}
            <div style={{flex:1,background:C.freshDim,border:`1px solid ${C.freshBorder}`,borderRadius:5,padding:"10px 12px",textAlign:"center"}}><div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:2}}>Gross Revenue</div><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:C.fresh}}>{fmt$(viewTicket.gross,2)}</div></div>
          </div>
          <div style={{marginBottom:12,padding:12,background:"rgba(14,9,4,0.5)",borderRadius:5,border:`1px solid ${C.border}`}}>
            <Lbl style={{marginBottom:8}}>Photo Verification</Lbl>
            <input ref={viewFileInputRef} type="file" accept="image/*" capture="environment" onChange={(e)=>{const f=e.target.files?.[0];if(f){setViewTicket(p=>({...p,photo:true,status:"photo_uploaded",_photoFile:f,_photoPreview:URL.createObjectURL(f)}));setTickets(ts=>ts.map(t=>t.id===viewTicket.id?{...t,photo:true,status:"photo_uploaded"}:t));}}} style={{display:"none"}}/>
            {viewTicket.photo?(
              <div>
                {viewTicket._photoPreview&&<div style={{marginBottom:10}}><img src={viewTicket._photoPreview} alt="Ticket photo" style={{width:"100%",maxHeight:240,objectFit:"contain",borderRadius:8,border:`2px solid ${C.fresh}`,background:"rgba(0,0,0,0.3)"}}/></div>}
                <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                  {!viewTicket._photoPreview&&<span style={{fontSize:24}}>📸</span>}
                  <Badge color={statusColor[viewTicket.status]||C.blue}>{statusLabel[viewTicket.status]||"Photo attached"}</Badge>
                  <span style={{color:C.fresh,fontSize:12}}>Photo on record</span>
                </div>
              </div>
            ):(
              <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                <span style={{color:C.rust,fontSize:12}}>⚠ No photo — confidence reduced</span>
                <Btn v="blue" size="sm" onClick={()=>viewFileInputRef.current?.click()}>📸 Upload Photo</Btn>
                <span style={{fontSize:11,color:C.muted}}>or email to tickets@millmarket.com</span>
              </div>
            )}
          </div>
          <div style={{marginBottom:12,padding:12,background:"rgba(14,9,4,0.5)",borderRadius:5,border:`1px solid ${C.border}`}}>
            <Lbl style={{marginBottom:8}}>Verification Status</Lbl>
            <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
              {["pending_photo","photo_uploaded","under_review","verified","rejected"].map(s=>(
                <div key={s} style={{padding:"4px 10px",borderRadius:12,fontSize:10,fontWeight:600,background:viewTicket.status===s?(statusColor[s]||C.steel)+"22":"rgba(14,9,4,0.4)",color:viewTicket.status===s?(statusColor[s]||C.steel):C.muted,border:`1px solid ${viewTicket.status===s?(statusColor[s]||C.steel)+"55":C.border}`}}>{s==="pending_photo"?"⏳ Needs Photo":s==="photo_uploaded"?"📸 Photo Uploaded":s==="under_review"?"🔍 Under Review":s==="verified"?"✓ Verified":s==="rejected"?"✗ Rejected":s}</div>
              ))}
            </div>
            {isMill&&!viewTicket.millVerified&&viewTicket.photo&&(
              <div style={{display:"flex",gap:8,marginTop:8}}>
                <Btn v="gold" size="sm" onClick={()=>{setViewTicket(p=>({...p,millVerified:true,status:"verified"}));setTickets(ts=>ts.map(t=>t.id===viewTicket.id?{...t,millVerified:true,status:"verified"}:t));}}>✓ Verify Ticket</Btn>
                <Btn v="danger" size="sm" onClick={()=>{setViewTicket(p=>({...p,status:"rejected"}));setTickets(ts=>ts.map(t=>t.id===viewTicket.id?{...t,status:"rejected"}:t));}}>✗ Reject</Btn>
              </div>
            )}
          </div>
          <div style={{padding:12,background:"rgba(14,9,4,0.5)",borderRadius:5,border:`1px solid ${C.border}`}}>
            <Lbl style={{marginBottom:8}}>Mill Counter-Verification</Lbl>
            {viewTicket.millVerified?<span style={{color:C.fresh,fontSize:13}}>✓ Verified by mill — full confidence weight</span>:viewTicket.status==="rejected"?<span style={{color:C.rust,fontSize:13}}>✗ Rejected by mill</span>:<span style={{color:C.muted,fontSize:12}}>Awaiting mill confirmation</span>}
          </div>
        </Modal>
      )}

      {newModal&&(
        <Modal title="+ NEW LOAD TICKET" onClose={()=>setNewModal(false)} width={660}>
          {submitted?(
            <div style={{textAlign:"center",padding:"20px 0"}}><div style={{fontSize:48,marginBottom:12}}>✅</div><H1 size={26} color={C.fresh}>TICKET SUBMITTED</H1></div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:13}}>
              {lastTicket&&(
                <div style={{padding:"8px 12px",background:C.goldDim,border:`1px solid ${C.goldBorder}`,borderRadius:5,display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:14}}>↩</span>
                  <div style={{flex:1,fontSize:12,color:C.gold}}>Fields pre-filled from your last ticket <Mono style={{color:C.sawdust}}>#{lastTicket.no}</Mono>. Just update what's different.</div>
                  <Btn v="ghost" size="sm" style={{color:C.muted,fontSize:11}} onClick={()=>setForm({no:"",date:new Date().toISOString().split("T")[0],mill:"",species:"",jobSite:"",rate:"",scaleTons:"",mbf:"",grossTons:"",moisture:"",notes:""})}>Clear All</Btn>
                </div>
              )}
              <div>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}><Lbl>Operation Type</Lbl>{autofilled.opType&&<span style={{fontSize:9,color:C.gold,fontFamily:"'DM Mono',monospace",letterSpacing:1}}>↩ AUTOFILLED</span>}</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:6}}>
                  {Object.entries(OP_TYPES).map(([key,op])=>(
                    <button key={key} onClick={()=>handleOpTypeChange(key)} style={{padding:"8px 10px",border:`1px solid ${opType===key?C.borderHi:C.border}`,borderRadius:5,background:opType===key?C.goldDim:"rgba(14,9,4,0.4)",cursor:"pointer",textAlign:"left",transition:"all 0.12s",display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:18}}>{op.icon}</span><div><div style={{fontSize:12,fontWeight:600,color:opType===key?C.gold:C.sawdust}}>{op.label}</div><div style={{fontSize:9,color:C.muted}}>{op.rateUnit}</div></div>
                    </button>
                  ))}
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:10}}>
                <Inp label="Ticket #" placeholder="Auto-generated if blank" value={form.no} onChange={h("no")}/>
                <Inp label="Date" type="date" value={form.date} onChange={h("date")}/>
                <Inp label="Job Site" placeholder="Rhinelander NW Block" value={form.jobSite} onChange={h("jobSite")} autofilled={autofilled.jobSite&&!!form.jobSite}/>
                <Sel label="Mill (nearest 25)" value={form.mill} onChange={h("mill")} autofilled={autofilled.mill&&!!form.mill}>
                  <option value="">Select mill…</option>
                  {nearestMills.map(m=><option key={m.id} value={m.name}>{m.name}{m._dist?` (${Math.round(m._dist)} mi)`:""}</option>)}
                </Sel>
                <Sel label="Species" value={form.species} onChange={h("species")} autofilled={autofilled.species&&!!form.species}>
                  <option value="">Select species…</option>
                  {OP_TYPES[opType].species.map(s=><option key={s}>{s}</option>)}
                </Sel>
                <Inp label={`Rate ($ / ${OP_TYPES[opType].rateUnit})`} prefix="$" value={form.rate} onChange={h("rate")} type="number" autofilled={autofilled.rate&&!!form.rate}/>
              </div>
              {opType==="tree_length"&&<div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:10}}><Inp label="Gross Tons" suffix="tons" value={form.grossTons} onChange={h("grossTons")} type="number"/><Inp label="Scale Tons" suffix="tons" value={form.scaleTons} onChange={h("scaleTons")} type="number"/></div>}
              {opType==="cut_to_length"&&<div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr 1fr",gap:10}}><Inp label="MBF" suffix="MBF" value={form.mbf} onChange={h("mbf")} type="number"/><Sel label="Log Length"><option>8ft</option><option>12ft</option><option>16ft</option><option>Random</option></Sel><Sel label="Grade"><option>Grade 1</option><option>Grade 2</option><option>Pulp</option></Sel></div>}
              {(opType==="whole_tree_chip"||opType==="biomass")&&<div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:10}}><Inp label="Green Tons" suffix="tons" value={form.grossTons} onChange={h("grossTons")} type="number"/><Inp label="Moisture %" suffix="%" value={form.moisture} onChange={h("moisture")} type="number"/></div>}
              <div style={{padding:12,background:"rgba(14,9,4,0.5)",borderRadius:5,border:`1px solid ${C.border}`}}>
                <Lbl style={{marginBottom:8}}>Ticket Photo</Lbl>
                <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handlePhotoSelect} style={{display:"none"}}/>
                <input ref={fileInputRef} type="file" accept="image/*,.pdf" onChange={handlePhotoSelect} style={{display:"none"}}/>
                {photoPreview?(
                  <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                    <img src={photoPreview} alt="Ticket" style={{width:80,height:80,objectFit:"cover",borderRadius:6,border:`2px solid ${C.fresh}`}}/>
                    <div style={{flex:1}}>
                      <Badge color={C.fresh} dot>Photo attached</Badge>
                      <div style={{fontSize:11,color:C.muted,marginTop:4}}>{photoFile?.name} ({(photoFile?.size/1024).toFixed(0)} KB)</div>
                    </div>
                    <Btn v="ghost" size="sm" style={{color:C.rust}} onClick={clearPhoto}>✕ Remove</Btn>
                  </div>
                ):(
                  <div style={{display:"flex",gap:7,flexWrap:"wrap",alignItems:"center"}}>
                    <Btn v="blue" size="sm" onClick={()=>cameraInputRef.current?.click()}>📸 Take Photo</Btn>
                    <Btn v="outline" size="sm" onClick={()=>fileInputRef.current?.click()}>📁 Choose File</Btn>
                  </div>
                )}
                <div style={{fontSize:10,color:C.muted,marginTop:6}}>Or email photo to <Mono style={{color:C.gold}}>tickets@millmarket.com</Mono></div>
              </div>
              <div style={{display:"flex",gap:9}}><Btn v="outline" full onClick={()=>setNewModal(false)}>Cancel</Btn><Btn full onClick={submitTicket}>Submit Ticket</Btn></div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

// ─── Shared view stubs ───
function LoggerOwnerDashboard({setView,user}){
  return <OwnerDashboard setView={setView} user={user}/>;
}
function TruckerDashboard({setView}){
  const {hauls}=useAppData();
  const mobile=useMobile();
  const weekNet=hauls.slice(0,5).reduce((s,h)=>s+h.net,0);
  return(
    <div style={{padding:mobile?14:26,maxWidth:960,margin:"0 auto"}}>
      <Lbl>// Trucker Dashboard</Lbl>
      <H1 size={mobile?28:36} style={{marginTop:5,marginBottom:20}}>TODAY'S <span style={{color:C.blue}}>HAULS</span></H1>
      <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:20}}>
        <StatCard label="Week Net"    value={fmt$(weekNet)} color={C.fresh} icon="💰"/>
        <StatCard label="Today Loads" value="2"           color={C.blue}  icon="🚛"/>
        <StatCard label="Miles Today" value="94"          color={C.sawdust}icon="🛣"/>
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {[["🎫","Tickets","tickets"],["🚛","Haul Calc","haul"],["💵","Cash Flow","cashflow"],["⛽","Fuel Log","fuellog"]].map(([icon,label,target])=>(
          <Btn key={target} v="outline" onClick={()=>setView(target)}>{icon} {label}</Btn>
        ))}
      </div>
    </div>
  );
}
function MillDashboard({setView,user}){
  const {mills}=useAppData();
  const mobile=useMobile();
  const mill=mills[0];
  return(
    <div style={{padding:mobile?14:26,maxWidth:960,margin:"0 auto"}}>
      <Lbl>// Mill Dashboard</Lbl>
      <H1 size={mobile?24:36} style={{marginTop:5,marginBottom:20}}>{mill?.name?.split("—")[0]?.trim()||"MILL"} — <span style={{color:C.gold}}>{mill?.name?.split("—")[1]?.trim()||"DASHBOARD"}</span></H1>
      <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:20}}>
        <StatCard label="Quota Used"  value={`${mill.quotaUsed}t`}       color={C.gold}   icon="📦" sub={`of ${mill.quotaMax}t`}/>
        <StatCard label="Confidence"  value={`${mill.confidence}%`}      color={C.fresh}  icon="📊"/>
        <StatCard label="Status"      value={mill.accepting?"Open":"Closed"} color={mill.accepting?C.fresh:C.rust} icon="🚛"/>
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {[["💲","Rates","rates"],["📦","Quotas","quotas"],["🎫","Verify","mill_tickets"],["📊","Reports","mill_reports"]].map(([icon,label,target])=>(
          <Btn key={target} v="outline" onClick={()=>setView(target)}>{icon} {label}</Btn>
        ))}
      </div>
    </div>
  );
}
function AdminDashboard(){
  const mobile=useMobile();
  return(
    <div style={{padding:mobile?14:26,maxWidth:1000,margin:"0 auto"}}>
      <Lbl>// Admin Dashboard</Lbl>
      <H1 size={mobile?28:36} style={{marginTop:5,marginBottom:20}}>PLATFORM <span style={{color:C.rust}}>OVERVIEW</span></H1>
      <div style={{display:"grid",gridTemplateColumns:mobile?"1fr 1fr":"repeat(3,1fr)",gap:12,marginBottom:22}}>
        <StatCard label="Total Users"    value="1,842" color={C.sawdust} icon="👤" delta={12}/>
        <StatCard label="Active Mills"   value="48"    color={C.gold}    icon="🏭" delta={4}/>
        <StatCard label="Tickets / Week" value="2,341" color={C.fresh}   icon="🎫" delta={8}/>
        <StatCard label="MRR"            value="$31.4K" color={C.purple} icon="💰" delta={6}/>
        <StatCard label="Pending Verify" value="2"     color={C.rust}    icon="⚠️" sub="mills"/>
        <StatCard label="Rate Queue"     value="3"     color={C.gold}    icon="📝" sub="pending"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:16}}>
        <Card><Lbl style={{marginBottom:12}}>User Growth (12mo)</Lbl><Sparkline data={[820,880,920,980,1040,1120,1200,1300,1420,1580,1720,1842]} color={C.fresh} h={60}/><div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:C.muted,marginTop:4,fontFamily:"'DM Mono',monospace"}}><span>Mar '24</span><span>Now</span></div></Card>
        <Card><Lbl style={{marginBottom:12}}>Revenue (12mo)</Lbl><Sparkline data={[18200,19400,20100,21500,22800,24100,25600,27100,28400,29800,30900,31400]} color={C.gold} h={60}/><div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:C.muted,marginTop:4,fontFamily:"'DM Mono',monospace"}}><span>Mar '24</span><span>Now</span></div></Card>
      </div>
    </div>
  );
}
function MillVerification(){
  const {pendingMills:mills,setPendingMills:setMills}=useAppData();
  const mobile=useMobile();
  const [sel,setSel]=useState(null);
  return(
    <div style={{padding:mobile?14:26,maxWidth:1000,margin:"0 auto"}}>
      <Lbl>// Admin · Mill Verification</Lbl>
      <H1 size={mobile?26:34} style={{marginTop:5,marginBottom:20}}>MILL <span style={{color:C.rust}}>VERIFICATION</span></H1>
      {mills.length===0?(<div style={{textAlign:"center",padding:"60px 0",color:C.muted}}><div style={{fontSize:48,marginBottom:14}}>✅</div><H1 size={26} color={C.fresh}>QUEUE CLEAR</H1></div>):(
        <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 360px",gap:20,alignItems:"start"}}>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {mills.map(m=>(
              <Card key={m.id} hover onClick={()=>setSel(m)} hi={sel?.id===m.id}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><div><div style={{fontWeight:700,fontSize:15}}>{m.name}</div><div style={{fontSize:12,color:C.muted}}>{m.city}, {m.state} · {m.submittedDate}</div></div><Badge color={C.gold}>⏳ Pending</Badge></div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{m.species.map(s=><Badge key={s} color={C.steel}>{s}</Badge>)}</div>
                <div style={{marginTop:8,padding:"6px 10px",background:m.docStatus.includes("Pending")?C.goldDim:C.freshDim,borderRadius:4,fontSize:11,color:m.docStatus.includes("Pending")?C.gold:C.fresh}}>📋 {m.docStatus}</div>
              </Card>
            ))}
          </div>
          {sel&&(
            <Card hi style={{position:"sticky",top:20}}>
              <H1 size={18} style={{marginBottom:4}}>{sel.name}</H1>
              {[["Contact",sel.contactName],["Email",sel.contactEmail],["Phone",sel.contactPhone],["Capacity",sel.capacity],["Plan",sel.plan],["Docs",sel.docStatus]].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid rgba(255,255,255,0.04)`,fontSize:12}}><span style={{color:C.muted}}>{l}</span><span style={{color:C.sawdust}}>{v}</span></div>
              ))}
              <div style={{marginTop:14,display:"flex",gap:8}}>
                <Btn v="danger" full onClick={()=>{setMills(m=>m.filter(x=>x.id!==sel.id));setSel(null);}}>✗ Reject</Btn>
                <Btn v="green"  full onClick={()=>{setMills(m=>m.filter(x=>x.id!==sel.id));setSel(null);}}>✓ Approve</Btn>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
function RateModeration(){
  const {pendingRates:rates,setPendingRates:setRates}=useAppData();
  const mobile=useMobile();
  return(
    <div style={{padding:mobile?14:26,maxWidth:900,margin:"0 auto"}}>
      <Lbl>// Admin · Rate Moderation</Lbl>
      <H1 size={mobile?26:34} style={{marginTop:5,marginBottom:20}}>RATE <span style={{color:C.rust}}>MODERATION</span></H1>
      {rates.length===0?(<div style={{textAlign:"center",padding:"60px 0",color:C.muted}}><div style={{fontSize:48,marginBottom:14}}>✅</div><H1 size={26} color={C.fresh}>QUEUE CLEAR</H1></div>):(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {rates.map(r=>(
            <Card key={r.id}>
              <div style={{display:"flex",gap:16,alignItems:"center",flexWrap:"wrap"}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:5,flexWrap:"wrap"}}>
                    <div style={{fontWeight:700,fontSize:14}}>{r.mill}</div>
                    <Badge color={C.gold}>{r.source}</Badge>
                    <Badge color={C.steel}>{OP_TYPES[r.opType]?.icon} {OP_TYPES[r.opType]?.label}</Badge>
                  </div>
                  <div style={{fontSize:13,marginBottom:5}}>
                    <span style={{color:C.muted}}>{r.species} · </span>
                    <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20}}>${r.rate.toFixed(2)}</span>
                    <span style={{color:C.muted}}>/ton · </span>
                    <span style={{color:r.delta>0?C.fresh:C.rust,fontSize:12}}>{r.delta>0?"▲":"▼"}${Math.abs(r.delta).toFixed(2)}</span>
                  </div>
                  <ConfBar score={r.confidence} h={4}/>
                </div>
                <div style={{display:"flex",gap:7}}>
                  <Btn v="danger" size="sm" onClick={()=>setRates(rs=>rs.filter(x=>x.id!==r.id))}>✗ Reject</Btn>
                  <Btn v="green"  size="sm" onClick={()=>setRates(rs=>rs.filter(x=>x.id!==r.id))}>✓ Approve</Btn>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
function MillRates(){
  const {mills:millsData}=useAppData();
  const mobile=useMobile();
  const [tab,setTab]=useState("current");
  const [rates,setRates]=useState({...millsData[0].rates});
  const [saved,setSaved]=useState(false);
  const [history]=useState([
    {date:"2025-03-01",rates:{"Pine Sawtimber":32.50,"Chip-n-Saw":26.75,"Softwood Pulp":21.00,"Hardwood Pulp":18.00}},
    {date:"2025-02-15",rates:{"Pine Sawtimber":31.00,"Chip-n-Saw":26.00,"Softwood Pulp":20.50,"Hardwood Pulp":17.50}},
    {date:"2025-02-01",rates:{"Pine Sawtimber":31.00,"Chip-n-Saw":25.50,"Softwood Pulp":20.00,"Hardwood Pulp":17.00}},
    {date:"2025-01-15",rates:{"Pine Sawtimber":30.00,"Chip-n-Saw":25.00,"Softwood Pulp":19.50,"Hardwood Pulp":16.50}},
    {date:"2025-01-01",rates:{"Pine Sawtimber":29.50,"Chip-n-Saw":24.50,"Softwood Pulp":19.00,"Hardwood Pulp":16.00}},
  ]);
  const [supplierRates,setSupplierRates]=useState([
    {id:"sr1",supplier:"Harmon Logging LLC",species:"Pine Sawtimber",rate:33.75,note:"Volume commitment 150t/wk"},
    {id:"sr2",supplier:"Harmon Logging LLC",species:"Chip-n-Saw",    rate:27.50,note:"Long-term contract"},
    {id:"sr3",supplier:"Voss Logging",      species:"Pine Sawtimber",rate:33.00,note:"Trial rate through Q2"},
  ]);
  const [addPrivate,setAddPrivate]=useState(false);
  const [privateForm,setPrivateForm]=useState({supplier:"",species:"",rate:"",note:""});

  const publish=()=>{setSaved(true);setTimeout(()=>setSaved(false),1800);};
  const addSupplierRate=()=>{
    if(!privateForm.supplier||!privateForm.species||!privateForm.rate) return;
    setSupplierRates(sr=>[...sr,{id:`sr${Date.now()}`,supplier:privateForm.supplier,species:privateForm.species,rate:parseFloat(privateForm.rate),note:privateForm.note}]);
    setAddPrivate(false);setPrivateForm({supplier:"",species:"",rate:"",note:""});
  };

  return(
    <div style={{padding:mobile?14:26,maxWidth:800,margin:"0 auto"}}>
      <Lbl>// Mill · Rates</Lbl><H1 size={mobile?26:34} style={{marginTop:5,marginBottom:20}}>MANAGE <span style={{color:C.gold}}>RATES</span></H1>
      <Tabs tabs={[{id:"current",icon:"💲",label:"Published Rates"},{id:"history",icon:"📜",label:"Rate History"},{id:"private",icon:"🤝",label:"Supplier Rates"}]} active={tab} onChange={setTab}/>

      {tab==="current"&&(
        <Card>
          <Lbl style={{marginBottom:14}}>Published Rates <span style={{fontSize:10,color:C.muted,fontWeight:400}}> — visible to all platform users</span></Lbl>
          {Object.entries(rates).map(([sp,pr])=>{
            const prev=history[0]?.rates[sp];const delta=prev!=null?pr-prev:0;
            return(
              <div key={sp} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid rgba(255,255,255,0.04)`}}>
                <div style={{flex:1,fontSize:13,fontWeight:600}}>{sp}
                  {delta!==0&&<span style={{fontSize:10,color:delta>0?C.fresh:C.rust,marginLeft:8}}>{delta>0?"▲":"▼"}${Math.abs(delta).toFixed(2)}</span>}
                </div>
                <Inp prefix="$" suffix="/ton" value={pr.toFixed(2)} onChange={e=>setRates(r=>({...r,[sp]:parseFloat(e.target.value)||0}))} type="number" style={{width:mobile?120:160}}/>
              </div>
            );
          })}
          <div style={{display:"flex",gap:9,marginTop:16}}>
            <Btn v="outline" full>+ Add Species</Btn>
            <Btn full onClick={publish}>{saved?"✓ Published!":"Publish Rates"}</Btn>
          </div>
        </Card>
      )}

      {tab==="history"&&(
        <Card>
          <Lbl style={{marginBottom:14}}>Published Rate History</Lbl>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,minWidth:400}}>
              <thead><tr style={{borderBottom:`1px solid ${C.border}`}}>
                <th style={{padding:"6px 10px",textAlign:"left",color:C.muted,fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:1}}>DATE</th>
                {Object.keys(rates).map(sp=><th key={sp} style={{padding:"6px 10px",textAlign:"right",color:C.muted,fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:1}}>{sp.split(" ")[0]}</th>)}
              </tr></thead>
              <tbody>
                <tr style={{borderBottom:`1px solid rgba(255,255,255,0.04)`,background:C.goldDim}}>
                  <td style={{padding:"8px 10px",fontWeight:700,color:C.gold}}>Current</td>
                  {Object.entries(rates).map(([sp,pr])=><td key={sp} style={{padding:"8px 10px",textAlign:"right"}}><Mono style={{color:C.gold}}>${pr.toFixed(2)}</Mono></td>)}
                </tr>
                {history.map((h,i)=>(
                  <tr key={h.date} style={{borderBottom:`1px solid rgba(255,255,255,0.04)`}}>
                    <td style={{padding:"8px 10px",color:C.muted}}>{h.date}</td>
                    {Object.keys(rates).map(sp=>{
                      const val=h.rates[sp];const prev=history[i+1]?.rates[sp];const d=prev!=null&&val!=null?val-prev:0;
                      return<td key={sp} style={{padding:"8px 10px",textAlign:"right"}}>
                        {val!=null?<><Mono>${val.toFixed(2)}</Mono>{d!==0&&<span style={{fontSize:9,color:d>0?C.fresh:C.rust,marginLeft:4}}>{d>0?"+":""}${d.toFixed(2)}</span>}</>:<span style={{color:C.muted}}>—</span>}
                      </td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab==="private"&&(
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{padding:"10px 14px",background:C.blueDim,border:`1px solid ${C.blueBorder}`,borderRadius:6,fontSize:12,color:C.blue}}>
            🔒 Supplier-specific rates are <strong>private</strong>. Suppliers see only their own rate and its delta vs. the published rate — never other suppliers' rates.
          </div>
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <Lbl>Negotiated Supplier Rates</Lbl>
              <Btn size="sm" onClick={()=>setAddPrivate(true)}>+ Add Rate</Btn>
            </div>
            {supplierRates.map(sr=>{
              const pub=rates[sr.species]||0;const delta=sr.rate-pub;
              return(
                <div key={sr.id} style={{padding:"12px 0",borderBottom:`1px solid rgba(255,255,255,0.04)`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4,flexWrap:"wrap",gap:6}}>
                    <div><span style={{fontWeight:600,fontSize:13}}>{sr.supplier}</span><span style={{color:C.muted,fontSize:12,marginLeft:8}}>· {sr.species}</span></div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:C.gold}}>${sr.rate.toFixed(2)}</span>
                      <Badge color={delta>0?C.fresh:delta<0?C.rust:C.steel}>{delta>0?"+":""}${delta.toFixed(2)} vs published</Badge>
                      <button onClick={()=>setSupplierRates(srs=>srs.filter(x=>x.id!==sr.id))} style={{fontSize:10,color:C.rust,background:"transparent",border:`1px solid ${C.rustBorder}`,borderRadius:3,padding:"2px 6px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>✕</button>
                    </div>
                  </div>
                  {sr.note&&<div style={{fontSize:11,color:C.muted,fontStyle:"italic"}}>{sr.note}</div>}
                  <div style={{fontSize:10,color:C.muted,marginTop:4}}>Supplier sees: <Mono style={{color:C.gold}}>${sr.rate.toFixed(2)}/ton</Mono> <span style={{color:delta>0?C.fresh:C.rust}}>({delta>0?"+":""}${delta.toFixed(2)} your advantage)</span></div>
                </div>
              );
            })}
          </Card>

          {addPrivate&&(
            <Modal title="🤝 ADD SUPPLIER RATE" onClose={()=>setAddPrivate(false)}>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <Sel label="Supplier" value={privateForm.supplier} onChange={e=>setPrivateForm(p=>({...p,supplier:e.target.value}))}>
                  <option value="">Select supplier…</option>
                  <option>Harmon Logging LLC</option><option>Voss Logging</option><option>Clearwater Timber</option><option>Northwoods Logging</option>
                </Sel>
                <Sel label="Species" value={privateForm.species} onChange={e=>setPrivateForm(p=>({...p,species:e.target.value}))}>
                  <option value="">Select species…</option>
                  {Object.keys(rates).map(sp=><option key={sp}>{sp}</option>)}
                </Sel>
                <Inp label="Negotiated Rate" prefix="$" suffix="/ton" type="number" value={privateForm.rate} onChange={e=>setPrivateForm(p=>({...p,rate:e.target.value}))}/>
                {privateForm.species&&privateForm.rate&&(
                  <div style={{padding:"8px 12px",background:C.goldDim,border:`1px solid ${C.goldBorder}`,borderRadius:5,fontSize:12}}>
                    Published rate: <Mono style={{color:C.sawdust}}>${(rates[privateForm.species]||0).toFixed(2)}</Mono> → Supplier rate: <Mono style={{color:C.gold}}>${parseFloat(privateForm.rate||0).toFixed(2)}</Mono>
                    <span style={{marginLeft:8,color:(parseFloat(privateForm.rate||0)-(rates[privateForm.species]||0))>0?C.fresh:C.rust}}>
                      ({(parseFloat(privateForm.rate||0)-(rates[privateForm.species]||0))>0?"+":""}${(parseFloat(privateForm.rate||0)-(rates[privateForm.species]||0)).toFixed(2)} delta)
                    </span>
                  </div>
                )}
                <Inp label="Note (optional)" placeholder="Volume commitment, contract terms…" value={privateForm.note} onChange={e=>setPrivateForm(p=>({...p,note:e.target.value}))}/>
                <div style={{display:"flex",gap:9}}><Btn v="outline" full onClick={()=>setAddPrivate(false)}>Cancel</Btn><Btn full onClick={addSupplierRate} disabled={!privateForm.supplier||!privateForm.species||!privateForm.rate}>Save Rate</Btn></div>
              </div>
            </Modal>
          )}
        </div>
      )}
    </div>
  );
}
function MillQuotas(){
  const mobile=useMobile();
  const [accepting,setAccepting]=useState(true);
  const [max,setMax]=useState(500);
  const [suppliers,setSuppliers]=useState([
    {id:"s1",name:"Harmon Logging LLC", allocated:180,used:156,status:"active"},
    {id:"s2",name:"Voss Logging",       allocated:120,used:88, status:"active"},
    {id:"s3",name:"Clearwater Timber",  allocated:100,used:72, status:"active"},
    {id:"s4",name:"Spot / Walk-in",     allocated:100,used:24, status:"active"},
  ]);
  const totalAllocated=suppliers.reduce((s,x)=>s+x.allocated,0);
  const totalUsed=suppliers.reduce((s,x)=>s+x.used,0);
  const unallocated=max-totalAllocated;
  const editAlloc=(id,val)=>setSuppliers(ss=>ss.map(s=>s.id===id?{...s,allocated:Math.max(0,val)}:s));
  return(
    <div style={{padding:mobile?14:26,maxWidth:800,margin:"0 auto"}}>
      <Lbl>// Mill · Quotas</Lbl><H1 size={mobile?26:34} style={{marginTop:5,marginBottom:20}}>QUOTA <span style={{color:C.gold}}>MANAGEMENT</span></H1>
      <div style={{display:"grid",gridTemplateColumns:mobile?"1fr 1fr":"repeat(4,1fr)",gap:12,marginBottom:16}}>
        <StatCard label="Total Cap" value={`${max}t`} color={C.sawdust} icon="📦"/>
        <StatCard label="Used" value={`${totalUsed}t`} color={C.gold} icon="🚛"/>
        <StatCard label="Remaining" value={`${max-totalUsed}t`} color={max-totalUsed<100?C.rust:C.fresh} icon="📊"/>
        <StatCard label="Unallocated" value={`${Math.max(0,unallocated)}t`} color={unallocated<0?C.rust:C.steel} icon="⚖️"/>
      </div>
      <Card style={{marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <Lbl>Weekly Capacity</Lbl>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <Inp suffix="tons" type="number" value={max} onChange={e=>setMax(+e.target.value)} style={{width:120}}/>
          </div>
        </div>
        <QuotaBar used={totalUsed} max={max} h={10}/>
      </Card>

      <Card style={{marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <Lbl>Supplier Allocations</Lbl>
          {unallocated<0&&<Badge color={C.rust}>⚠ Over-allocated by {Math.abs(unallocated)}t</Badge>}
        </div>
        {suppliers.map(s=>{
          const pct=s.allocated>0?Math.round((s.used/s.allocated)*100):0;
          return(
            <div key={s.id} style={{padding:"12px 0",borderBottom:`1px solid rgba(255,255,255,0.04)`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6,flexWrap:"wrap",gap:8}}>
                <div style={{fontWeight:600,fontSize:13}}>{s.name}</div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <Mono style={{color:pct>=90?C.rust:pct>=70?C.gold:C.fresh,fontSize:12}}>{s.used}t / </Mono>
                  <Inp suffix="t" type="number" value={s.allocated} onChange={e=>editAlloc(s.id,+e.target.value)} style={{width:80}}/>
                </div>
              </div>
              <QuotaBar used={s.used} max={s.allocated} h={6}/>
            </div>
          );
        })}
        <div style={{marginTop:12}}>
          <Btn v="outline" size="sm" onClick={()=>setSuppliers(ss=>[...ss,{id:`s${Date.now()}`,name:"New Supplier",allocated:0,used:0,status:"active"}])}>+ Add Supplier Allocation</Btn>
        </div>
      </Card>

      <Card><Lbl style={{marginBottom:10}}>Load Acceptance</Lbl><div style={{fontSize:12,color:C.muted,marginBottom:10}}>When closed, no new loads will be accepted from any supplier.</div><Btn v={accepting?"danger":"green"} onClick={()=>setAccepting(!accepting)}>{accepting?"🚫 Close to New Loads":"✅ Open to Loads"}</Btn></Card>
    </div>
  );
}
// ═══════════════════════════════════════════════════════════════════════════
// MAP VIEW — mill pins, job site pin-drop, share-to-crew

function HaulCalculator(){
  const {mills:allMills,jobSites}=useAppData();
  const mobile=useMobile();
  const [load,setLoad]=useState(22);const [fuel,setFuel]=useState(3.87);const [mpg,setMpg]=useState(6.2);const [pay,setPay]=useState(28);
  const [userLoc,setUserLoc]=useState(null);
  useEffect(()=>{
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(
        (pos)=>setUserLoc({lat:pos.coords.latitude,lng:pos.coords.longitude}),
        ()=>{},{enableHighAccuracy:false,timeout:10000}
      );
    }
  },[]);
  const nearest5=useMemo(()=>{
    const ref=userLoc||(jobSites.length>0?{lat:jobSites[0].lat,lng:jobSites[0].lng}:null);
    if(!ref) return allMills.slice(0,5).map(m=>({name:m.name,miles:50,rate:Object.values(m.rates||{})[0]||30,accepting:m.accepting}));
    return allMills.filter(m=>m.lat&&m.lng).map(m=>({name:m.name,miles:Math.round(haversineDistance(ref.lat,ref.lng,m.lat,m.lng)),rate:Object.values(m.rates||{})[0]||30,accepting:m.accepting,closed:!m.accepting})).sort((a,b)=>a.miles-b.miles).slice(0,5);
  },[allMills,userLoc,jobSites]);
  const calc=m=>{const gross=load*m.rate;const ft=(m.miles*2)/mpg*fuel;const lb=(m.miles*2/55)*pay;return{...m,gross,fuel:Math.round(ft),labor:Math.round(lb),net:Math.round(gross-ft-lb)};};
  const res=nearest5.map(calc).sort((a,b)=>b.net-a.net);
  return(
    <div style={{padding:mobile?14:26,maxWidth:900,margin:"0 auto"}}>
      <Lbl>// Haul Calculator</Lbl><H1 size={mobile?26:34} style={{marginTop:5,marginBottom:20}}>HAUL <span style={{color:C.gold}}>PROFITABILITY</span></H1>
      <Card style={{marginBottom:20}}>
        <div style={{display:"grid",gridTemplateColumns:mobile?"1fr 1fr":"repeat(4,1fr)",gap:12}}>
          <Inp label="Load (tons)" suffix="t"   value={load} onChange={e=>setLoad(+e.target.value)} type="number"/>
          <Inp label="Fuel"        prefix="$" suffix="/gal" value={fuel} onChange={e=>setFuel(+e.target.value)} type="number"/>
          <Inp label="MPG"         suffix="mpg" value={mpg}  onChange={e=>setMpg(+e.target.value)}  type="number"/>
          <Inp label="Driver Rate" prefix="$" suffix="/hr" value={pay}  onChange={e=>setPay(+e.target.value)}  type="number"/>
        </div>
      </Card>
      <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:14}}>
        {res.map((m,i)=>(
          <Card key={m.name} style={{flex:1,minWidth:180,border:`1px solid ${i===0?C.freshBorder:C.border}`,opacity:m.closed?0.4:1}}>
            {i===0&&<div style={{fontSize:9,color:C.fresh,fontFamily:"'DM Mono',monospace",marginBottom:4}}>🏆 BEST</div>}
            <div style={{fontWeight:700,fontSize:14,marginBottom:8}}>{m.name}</div>
            {[["Gross",m.gross,C.sawdust],["Fuel",-m.fuel,C.rust],["Labor",-m.labor,C.gold],["NET",m.net,m.net>0?C.fresh:C.rust]].map(([l,v,c])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:11,padding:"4px 0",borderBottom:`1px solid rgba(255,255,255,0.04)`}}>
                <span style={{color:C.muted}}>{l}</span><Mono style={{color:c,fontWeight:l==="NET"?700:400}}>{fmt$(v)}</Mono>
              </div>
            ))}
          </Card>
        ))}
      </div>
    </div>
  );
}
function Reports(){
  const {hauls,mills}=useAppData();
  const mobile=useMobile();
  const [tab,setTab]=useState("profitability");
  const tabs=[{id:"profitability",icon:"💰",label:"Profitability"},{id:"trends",icon:"📈",label:"Rate Trends"},{id:"mill_compare",icon:"🏭",label:"Mill Compare"}];
  return(
    <div style={{padding:mobile?14:26,maxWidth:1020,margin:"0 auto"}}>
      <Lbl>// Reports</Lbl><H1 size={mobile?26:34} style={{marginTop:5,marginBottom:20}}>RATES & <span style={{color:C.gold}}>REPORTS</span></H1>
      <Tabs tabs={tabs} active={tab} onChange={setTab}/>
      {tab==="profitability"&&(mobile?(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <Lbl>All Hauls — This Period</Lbl>
          {hauls.map(h=>{const marg=h.gross>0?Math.round((h.net/h.gross)*100):0;return(
            <Card key={h.id} style={{padding:14,background:h.net<0?"rgba(166,58,26,0.04)":undefined}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <div style={{fontWeight:600,fontSize:13}}>{h.jobSite}</div>
                <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:h.net>0?C.fresh:C.rust}}>{fmt$(h.net)}</span>
              </div>
              <div style={{display:"flex",gap:8,fontSize:11,color:C.muted,flexWrap:"wrap",marginBottom:6}}>
                <span>{h.date}</span><span>{h.mill.split("—")[0].trim()}</span><span>{h.species}</span>
              </div>
              <div style={{display:"flex",gap:12,fontSize:11}}>
                <span>Gross <Mono>{fmt$(h.gross)}</Mono></span>
                <span style={{color:C.rust}}>Fuel <Mono>{fmt$(-h.fuel)}</Mono></span>
                <span><Mono style={{color:marg>30?C.fresh:marg>10?C.gold:C.rust}}>{marg}%</Mono></span>
              </div>
            </Card>
          );})}
        </div>
      ):(
        <Card>
          <Lbl style={{marginBottom:14}}>All Hauls — This Period</Lbl>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr style={{borderBottom:`1px solid ${C.border}`}}>{["Date","Site","Mill","Species","Gross","Fuel","Labor","NET","Margin"].map(h=><th key={h} style={{padding:"5px 9px",textAlign:["Gross","Fuel","Labor","NET","Margin"].includes(h)?"right":"left",color:C.muted,fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:1,fontWeight:500}}>{h}</th>)}</tr></thead>
            <tbody>{hauls.map(h=>{const marg=h.gross>0?Math.round((h.net/h.gross)*100):0;return(
              <tr key={h.id} style={{borderBottom:`1px solid rgba(255,255,255,0.04)`,background:h.net<0?"rgba(166,58,26,0.04)":"transparent"}}>
                <td style={{padding:"9px 9px",color:C.muted}}>{h.date}</td>
                <td style={{padding:"9px 9px",fontWeight:600}}>{h.jobSite}</td>
                <td style={{padding:"9px 9px",color:C.muted}}>{h.mill.split("—")[0].trim()}</td>
                <td style={{padding:"9px 9px",color:C.muted}}>{h.species}</td>
                <td style={{padding:"9px 9px",textAlign:"right"}}><Mono>{fmt$(h.gross)}</Mono></td>
                <td style={{padding:"9px 9px",textAlign:"right"}}><Mono style={{color:C.rust}}>{fmt$(-h.fuel)}</Mono></td>
                <td style={{padding:"9px 9px",textAlign:"right"}}><Mono style={{color:C.rust}}>{fmt$(-h.labor)}</Mono></td>
                <td style={{padding:"9px 9px",textAlign:"right"}}><span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:h.net>0?C.fresh:C.rust}}>{fmt$(h.net)}</span></td>
                <td style={{padding:"9px 9px",textAlign:"right"}}><Mono style={{color:marg>30?C.fresh:marg>10?C.gold:C.rust,fontSize:11}}>{marg}%</Mono></td>
              </tr>
            );})}</tbody>
          </table>
        </Card>
      ))}
      {tab==="trends"&&(
        <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:16}}>
          {Object.entries(RATE_TRENDS).map(([sp,data])=>{
            const curr=data[data.length-1],prev=data[data.length-2],delta=curr-prev;
            return(
              <Card key={sp}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <div><Lbl style={{marginBottom:3}}>{sp}</Lbl><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:C.sawdust}}>${curr.toFixed(2)}<span style={{fontSize:12,color:C.muted}}>/ton</span></div></div>
                  <div style={{textAlign:"right"}}><div style={{fontSize:12,color:delta>0?C.fresh:C.rust,fontFamily:"'DM Mono',monospace",fontWeight:700}}>{delta>0?"▲":"▼"}${Math.abs(delta).toFixed(2)}</div><div style={{fontSize:10,color:C.muted}}>vs last month</div></div>
                </div>
                <Sparkline data={data} color={delta>=0?C.fresh:C.rust} h={50}/>
              </Card>
            );
          })}
        </div>
      )}
      {tab==="mill_compare"&&(
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          {mills.slice(0,3).map(m=>{
            const mh=hauls.filter(h=>h.mill===m.name);const mnet=mh.reduce((s,h)=>s+h.net,0);const mgross=mh.reduce((s,h)=>s+h.gross,0);
            return<StatCard key={m.id} label={m.name.split("—")[0].trim()} value={fmt$(mnet)} sub={`${mh.length} hauls · ${mgross>0?Math.round((mnet/mgross)*100):0}% margin`} color={mnet>0?C.fresh:C.rust}/>;
          })}
        </div>
      )}
    </div>
  );
}
function RateSubmit(){
  const {mills}=useAppData();
  const mobile=useMobile();
  const [step,setStep]=useState(1);const [done,setDone]=useState(false);
  const [form,setForm]=useState({mill:"",species:"",rate:"",opType:"tree_length",source:"personal"});
  const h=f=>e=>setForm(p=>({...p,[f]:e.target.value}));
  if(done) return(<div style={{padding:mobile?30:60,maxWidth:500,margin:"0 auto",textAlign:"center"}}><div style={{fontSize:56,marginBottom:16}}>✅</div><H1 size={32} color={C.fresh}>RATE SUBMITTED</H1><Btn style={{marginTop:22}} onClick={()=>{setDone(false);setStep(1);}}>Submit Another</Btn></div>);
  return(
    <div style={{padding:mobile?14:26,maxWidth:600,margin:"0 auto"}}>
      <Lbl>// Submit Rates</Lbl><H1 size={34} style={{marginTop:5,marginBottom:20}}>SUBMIT A <span style={{color:C.gold}}>RATE</span></H1>
      <Card>
        {step===1&&<div style={{display:"flex",flexDirection:"column",gap:12}}><Sel label="Mill" value={form.mill} onChange={h("mill")}><option value="">Select mill…</option>{mills.map(m=><option key={m.id} value={m.name}>{m.name}</option>)}</Sel><Sel label="Operation Type" value={form.opType} onChange={h("opType")}>{Object.entries(OP_TYPES).map(([k,v])=><option key={k} value={k}>{v.icon} {v.label}</option>)}</Sel><div style={{display:"flex",gap:9}}><Btn v="outline" full disabled>← Back</Btn><Btn full disabled={!form.mill} onClick={()=>setStep(2)}>Next →</Btn></div></div>}
        {step===2&&<div style={{display:"flex",flexDirection:"column",gap:12}}><Sel label="Species" value={form.species} onChange={h("species")}><option value="">Select species…</option>{["Pine Sawtimber","Chip-n-Saw","Hardwood Pulp","Softwood Pulp","Aspen","Mixed Chips"].map(s=><option key={s}>{s}</option>)}</Sel><Inp label="Rate" prefix="$" value={form.rate} onChange={h("rate")} type="number"/><div style={{display:"flex",gap:9}}><Btn v="outline" full onClick={()=>setStep(1)}>← Back</Btn><Btn full disabled={!form.species||!form.rate} onClick={()=>setStep(3)}>Next →</Btn></div></div>}
        {step===3&&<div style={{display:"flex",flexDirection:"column",gap:12}}><Sel label="Source" value={form.source} onChange={h("source")}><option value="personal">Personally hauled this load</option><option value="ticket_photo">Have scale ticket / photo</option><option value="word_of_mouth">Heard from another logger</option></Sel><div style={{display:"flex",gap:9}}><Btn v="outline" full onClick={()=>setStep(2)}>← Back</Btn><Btn full onClick={()=>setDone(true)}>Submit Rate</Btn></div></div>}
      </Card>
    </div>
  );
}
function Alerts(){
  const {alerts,setAlerts}=useAppData();
  const mobile=useMobile();
  const typeColor={rate:C.gold,quota:C.blue,ticket:C.steel,crew:C.fresh,market:C.rust};
  const typeIcon={rate:"💲",quota:"📦",ticket:"🎫",crew:"👥",market:"📉"};
  const actionLabel={rate:"View Rates",quota:"Check Quota",ticket:"View Ticket",crew:"View Crew",market:"View Report"};
  const active=alerts.filter(a=>!a.resolved);
  const resolved=alerts.filter(a=>a.resolved);
  const unread=active.filter(a=>!a.read).length;
  const markRead=id=>setAlerts(as=>as.map(x=>x.id===id?{...x,read:true}:x));
  const resolve=id=>setAlerts(as=>as.map(x=>x.id===id?{...x,read:true,resolved:true}:x));
  const unresolve=id=>setAlerts(as=>as.map(x=>x.id===id?{...x,resolved:false}:x));
  return(
    <div style={{padding:mobile?14:26,maxWidth:800,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:20,flexWrap:"wrap",gap:10}}>
        <div><Lbl>// Alerts</Lbl><H1 size={mobile?26:34} style={{marginTop:5}}>ALERTS <span style={{color:C.gold}}>&</span> NOTIFICATIONS</H1></div>
        <div style={{display:"flex",gap:8}}>
          {unread>0&&<Btn v="outline" size="sm" onClick={()=>setAlerts(a=>a.map(x=>x.resolved?x:{...x,read:true}))}>Mark All Read</Btn>}
          {active.length>0&&<Btn v="outline" size="sm" onClick={()=>setAlerts(a=>a.map(x=>({...x,read:true,resolved:true})))}>Resolve All</Btn>}
        </div>
      </div>

      {active.length===0&&<div style={{textAlign:"center",padding:"50px 0",color:C.muted}}><div style={{fontSize:48,marginBottom:14}}>✅</div><H1 size={24} color={C.fresh}>ALL CLEAR</H1><div style={{fontSize:13,color:C.muted,marginTop:8}}>No active alerts. You're up to date.</div></div>}

      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {active.map(a=>(
          <div key={a.id}
            style={{display:"flex",gap:mobile?10:14,padding:mobile?12:16,background:a.read?"rgba(14,9,4,0.5)":C.panel,border:`1px solid ${a.read?C.border:a.severity==="high"?C.rustBorder:a.severity==="medium"?C.goldBorder:C.border}`,borderRadius:7,opacity:a.read?0.7:1}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:`${typeColor[a.type]||C.gold}20`,border:`1.5px solid ${typeColor[a.type]||C.gold}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{typeIcon[a.type]||"🔔"}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                <div style={{fontWeight:600,fontSize:13,color:a.read?C.muted:C.sawdust}}>{a.title}</div>
                {!a.read&&<div style={{width:7,height:7,borderRadius:"50%",background:a.severity==="high"?C.rust:a.severity==="medium"?C.gold:C.blue,flexShrink:0}}/>}
              </div>
              <div style={{fontSize:12,color:C.muted,lineHeight:1.6,marginBottom:8}}>{a.body}</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {!a.read&&<Btn v="outline" size="sm" onClick={()=>markRead(a.id)}>Mark Read</Btn>}
                <Btn v="outline" size="sm" onClick={()=>markRead(a.id)}>{actionLabel[a.type]||"View"} →</Btn>
                <Btn v="green" size="sm" onClick={()=>resolve(a.id)}>✓ Resolve</Btn>
              </div>
            </div>
            <div style={{fontSize:10,color:C.muted,whiteSpace:"nowrap",fontFamily:"'DM Mono',monospace"}}>{a.time}</div>
          </div>
        ))}
      </div>

      {resolved.length>0&&(
        <div style={{marginTop:24}}>
          <Lbl style={{marginBottom:10}}>Resolved ({resolved.length})</Lbl>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {resolved.map(a=>(
              <div key={a.id} style={{display:"flex",gap:mobile?10:14,padding:mobile?10:12,background:"rgba(14,9,4,0.3)",border:`1px solid ${C.border}`,borderRadius:7,opacity:0.5,alignItems:"center"}}>
                <span style={{fontSize:14,flexShrink:0}}>{typeIcon[a.type]||"🔔"}</span>
                <div style={{flex:1,fontSize:12,color:C.muted}}><span style={{color:C.fresh,marginRight:6}}>✓</span>{a.title}</div>
                <button onClick={()=>unresolve(a.id)} style={{fontSize:10,color:C.muted,background:"transparent",border:`1px solid ${C.border}`,borderRadius:3,padding:"2px 7px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Reopen</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
function FuelLog(){
  const mobile=useMobile();
  const [entries]=useState([
    {id:"f1",date:"2025-03-10",vehicle:"Peterbilt 389",gallons:48.2,price:3.87,station:"Kwik Trip — Wausau",trip:"Rhinelander NW → Weyer"},
    {id:"f2",date:"2025-03-08",vehicle:"Peterbilt 389",gallons:52.6,price:3.91,station:"Flying J — Duluth",trip:"Ashland Co. → Stora Enso"},
    {id:"f3",date:"2025-03-06",vehicle:"Peterbilt 389",gallons:44.8,price:3.84,station:"Kwik Trip — Wausau",trip:"Lincoln Tract → Weyer"},
  ]);
  return(
    <div style={{padding:mobile?14:26,maxWidth:860,margin:"0 auto"}}>
      <Lbl>// Fuel Log</Lbl><H1 size={mobile?26:34} style={{marginTop:5,marginBottom:20}}>FUEL <span style={{color:C.blue}}>LOG</span></H1>
      {mobile?(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {entries.map(e=>(
            <Card key={e.id} style={{padding:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <div style={{fontWeight:600,fontSize:13}}>{e.vehicle}</div>
                <Mono style={{color:C.rust,fontSize:14}}>{fmt$(e.gallons*e.price,2)}</Mono>
              </div>
              <div style={{fontSize:11,color:C.muted,marginBottom:4}}>{e.date} · {e.station}</div>
              <div style={{fontSize:11,color:C.muted,marginBottom:4}}>{e.trip}</div>
              <div style={{display:"flex",gap:12,fontSize:11}}>
                <span><Mono>{e.gallons.toFixed(1)}</Mono> gal</span>
                <span>@ <Mono>${e.price.toFixed(2)}</Mono>/gal</span>
              </div>
            </Card>
          ))}
        </div>
      ):(
      <Card>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:`1px solid ${C.border}`}}>{["Date","Vehicle","Station","Trip","Gallons","$/gal","Total"].map(h=><th key={h} style={{padding:"5px 9px",textAlign:["Gallons","$/gal","Total"].includes(h)?"right":"left",color:C.muted,fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:1,fontWeight:500}}>{h}</th>)}</tr></thead>
          <tbody>{entries.map(e=>(
            <tr key={e.id} style={{borderBottom:`1px solid rgba(255,255,255,0.04)`}}>
              <td style={{padding:"9px 9px",color:C.muted}}>{e.date}</td><td style={{padding:"9px 9px",fontWeight:600}}>{e.vehicle}</td><td style={{padding:"9px 9px",color:C.muted,fontSize:12}}>{e.station}</td><td style={{padding:"9px 9px",color:C.muted,fontSize:11}}>{e.trip}</td>
              <td style={{padding:"9px 9px",textAlign:"right"}}><Mono>{e.gallons.toFixed(1)}</Mono></td><td style={{padding:"9px 9px",textAlign:"right"}}><Mono>${e.price.toFixed(2)}</Mono></td><td style={{padding:"9px 9px",textAlign:"right"}}><Mono style={{color:C.rust}}>{fmt$(e.gallons*e.price,2)}</Mono></td>
            </tr>
          ))}</tbody>
        </table>
      </Card>
      )}
    </div>
  );
}
const MACHINE_TYPES=["Feller Buncher","Skidder","Processor","Loader","Forwarder","Log Truck","Service Truck","Chipper","Excavator","Other"];
const MACHINE_MAKES=["John Deere","Tigercat","Komatsu","Ponsse","Caterpillar","Volvo","Peterbilt","Kenworth","Mack","International","Other"];

const DEMO_MACHINES=[
  {id:"m1",name:"Tigercat 822D",  type:"Feller Buncher",make:"Tigercat",  year:2021,assignedTo:"Dale Schultz", hours:4820,nextService:5000,status:"active"},
  {id:"m2",name:"Deere 648L",     type:"Skidder",       make:"John Deere",year:2020,assignedTo:"Roy Ingram",    hours:6140,nextService:6500,status:"active"},
  {id:"m3",name:"Komatsu PC228",  type:"Loader",        make:"Komatsu",   year:2019,assignedTo:"Mike Sorensen", hours:8320,nextService:8500,status:"active"},
  {id:"m4",name:"Peterbilt 389",  type:"Log Truck",     make:"Peterbilt", year:2022,assignedTo:"Carlos Diaz",   hours:2100,nextService:2500,status:"active"},
  {id:"m5",name:"Peterbilt 389-2",type:"Log Truck",     make:"Peterbilt", year:2018,assignedTo:"Lisa Park",     hours:5680,nextService:6000,status:"leave"},
];
function CrewManagement({user}){
  const {crew,setCrew}=useAppData();
  const mobile=useMobile();
  const [machines,setMachines]=useState(isDemo(user?.id)?DEMO_MACHINES:[]);

  const [tab,setTab]=useState("crew");
  const [addCrewModal,setAddCrewModal]=useState(false);
  const [addMachineModal,setAddMachineModal]=useState(false);
  const [editCrew,setEditCrew]=useState(null);
  const [editMachine,setEditMachine]=useState(null);
  const [notifyModal,setNotifyModal]=useState(false);
  const [saved,setSaved]=useState(false);

  const [crewForm,setCrewForm]=useState({name:"",role:"Feller Operator",hourly:"",entity:user?.company||"",machine:"",phone:"",email:"",isContractor:false});
  const [machineForm,setMachineForm]=useState({name:"",type:"Feller Buncher",make:"John Deere",year:new Date().getFullYear(),assignedTo:"",hours:"",nextService:""});

  const hc=f=>e=>setCrewForm(p=>({...p,[f]:e.target.type==="checkbox"?e.target.checked:e.target.value}));
  const hm=f=>e=>setMachineForm(p=>({...p,[f]:e.target.value}));

  const saveCrewMember=()=>{
    if(editCrew){
      setCrew(cs=>cs.map(c=>c.id===editCrew.id?{...c,...crewForm,hourly:crewForm.isContractor?null:parseFloat(crewForm.hourly)||0}:c));
    } else {
      setCrew(cs=>[...cs,{id:`c${Date.now()}`,hours:0,status:"active",...crewForm,hourly:crewForm.isContractor?null:parseFloat(crewForm.hourly)||0}]);
    }
    setAddCrewModal(false);setEditCrew(null);
    setCrewForm({name:"",role:"Feller Operator",hourly:"",entity:user?.company||"",machine:"",phone:"",email:"",isContractor:false});
    setSaved(true);setTimeout(()=>setSaved(false),1500);
  };

  const saveMachine=()=>{
    if(editMachine){
      setMachines(ms=>ms.map(m=>m.id===editMachine.id?{...m,...machineForm,hours:parseInt(machineForm.hours)||0,nextService:parseInt(machineForm.nextService)||0,year:parseInt(machineForm.year)||2024}:m));
    } else {
      setMachines(ms=>[...ms,{id:`m${Date.now()}`,status:"active",...machineForm,hours:parseInt(machineForm.hours)||0,nextService:parseInt(machineForm.nextService)||0,year:parseInt(machineForm.year)||2024}]);
    }
    setAddMachineModal(false);setEditMachine(null);
    setMachineForm({name:"",type:"Feller Buncher",make:"John Deere",year:new Date().getFullYear(),assignedTo:"",hours:"",nextService:""});
    setSaved(true);setTimeout(()=>setSaved(false),1500);
  };

  const openEditCrew=(c)=>{
    setCrewForm({name:c.name,role:c.role||"",hourly:c.hourly?.toString()||"",entity:c.entity||user?.company||"",machine:c.machine||"",phone:c.phone||"",email:c.email||"",isContractor:!c.hourly});
    setEditCrew(c);setAddCrewModal(true);
  };
  const openEditMachine=(m)=>{
    setMachineForm({name:m.name,type:m.type,make:m.make,year:m.year,assignedTo:m.assignedTo,hours:m.hours.toString(),nextService:m.nextService.toString()});
    setEditMachine(m);setAddMachineModal(true);
  };

  const totalPayroll=crew.filter(c=>c.hourly).reduce((s,c)=>s+(Math.min(c.hours,40)*c.hourly)+(Math.max(0,c.hours-40)*c.hourly*1.5),0);
  const serviceDue=machines.filter(m=>m.hours>=m.nextService-100);

  return(
    <div style={{padding:mobile?14:26,maxWidth:980,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div><Lbl>// Crew & Equipment</Lbl><H1 size={mobile?28:34} style={{marginTop:5}}>CREW <span style={{color:C.fresh}}>&</span> MACHINES</H1></div>
        <div style={{display:"flex",gap:8}}>
          {saved&&<Badge color={C.fresh}>✓ Saved</Badge>}
          <Btn size="sm" v="outline" onClick={()=>setNotifyModal(true)}>📣 Notify All</Btn>
          <Btn size="sm" onClick={()=>tab==="crew"?setAddCrewModal(true):setAddMachineModal(true)}>
            + Add {tab==="crew"?"Person":"Machine"}
          </Btn>
        </div>
      </div>

      <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:16}}>
        <StatCard label="Active Crew"   value={crew.filter(c=>c.status==="active").length} color={C.fresh} icon="👥" style={{flex:1,minWidth:100}}/>
        <StatCard label="Week Payroll"  value={fmt$(totalPayroll)} color={C.gold} icon="💵" style={{flex:1,minWidth:100}}/>
        <StatCard label="Machines"      value={machines.length} color={C.steel} icon="🔧" style={{flex:1,minWidth:100}}/>
        {serviceDue.length>0&&<StatCard label="Service Due" value={serviceDue.length} color={C.rust} icon="⚠️" style={{flex:1,minWidth:100}} sub="within 100hrs"/>}
      </div>

      <Tabs tabs={[{id:"crew",icon:"👥",label:"Crew"},{id:"machines",icon:"🔧",label:"Machines"}]} active={tab} onChange={setTab}/>

      {tab==="crew"&&(
        mobile?(
          // MOBILE crew cards
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {crew.map(c=>{
              const reg=Math.min(c.hours,40)*(c.hourly||0);
              const ot=Math.max(0,c.hours-40)*(c.hourly||0)*1.5;
              return(
                <Card key={c.id} style={{opacity:c.status==="leave"?0.6:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:38,height:38,borderRadius:"50%",background:`${C.fresh}18`,border:`1.5px solid ${C.fresh}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{c.name.charAt(0)}</div>
                      <div>
                        <div style={{fontWeight:700,fontSize:15}}>{c.name}</div>
                        <div style={{fontSize:12,color:C.muted}}>{c.role}</div>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:6,alignItems:"center"}}>
                      <Badge color={c.status==="active"?C.fresh:C.gold}>{c.status}</Badge>
                      <Btn size="sm" v="ghost" onClick={()=>openEditCrew(c)}>✏️</Btn>
                    </div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                    {[["Hours",`${c.hours}h`,C.sawdust],["OT",`${Math.max(0,c.hours-40)}h`,Math.max(0,c.hours-40)>0?C.gold:C.muted],["Pay",c.hourly?fmt$(reg+ot):"Contract",C.fresh]].map(([l,v,col])=>(
                      <div key={l} style={{textAlign:"center",padding:"7px 4px",background:"rgba(14,9,4,0.5)",borderRadius:5}}>
                        <div style={{fontSize:9,color:C.muted,marginBottom:3}}>{l}</div>
                        <Mono style={{fontSize:13,color:col,fontWeight:700}}>{v}</Mono>
                      </div>
                    ))}
                  </div>
                  {c.machine&&c.machine!=="—"&&<div style={{marginTop:8,fontSize:11,color:C.steel}}>🔧 {c.machine}</div>}
                </Card>
              );
            })}
            <button onClick={()=>setAddCrewModal(true)} style={{border:`2px dashed ${C.border}`,borderRadius:8,padding:18,background:"transparent",color:C.muted,fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",textAlign:"center"}}>+ Add Crew Member</button>
          </div>
        ):(
          // DESKTOP table
          <Card style={{padding:0,overflow:"hidden"}}>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                <thead><tr style={{borderBottom:`1px solid ${C.border}`,background:"rgba(14,9,4,0.5)"}}>{["Name","Role","Machine","Entity","Status","Hrs","OT","Pay",""].map(h=><th key={h} style={{padding:"8px 10px",textAlign:["Hrs","OT","Pay"].includes(h)?"right":"left",color:C.muted,fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:1,fontWeight:500,whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
                <tbody>{crew.map(c=>{const reg=Math.min(c.hours,40)*(c.hourly||0);const ot=Math.max(0,c.hours-40)*(c.hourly||0)*1.5;return(
                  <tr key={c.id} style={{borderBottom:`1px solid rgba(255,255,255,0.04)`,opacity:c.status==="leave"?0.5:1}}>
                    <td style={{padding:"10px 10px",fontWeight:600}}>{c.name}</td>
                    <td style={{padding:"10px 10px",color:C.muted,fontSize:12}}>{c.role}</td>
                    <td style={{padding:"10px 10px"}}><Mono style={{color:C.steel,fontSize:11}}>{c.machine}</Mono></td>
                    <td style={{padding:"10px 10px",fontSize:11,color:C.muted}}>{c.entity?.split(" ")[1]}</td>
                    <td style={{padding:"10px 10px"}}><Badge color={c.status==="active"?C.fresh:C.gold}>{c.status}</Badge></td>
                    <td style={{padding:"10px 10px",textAlign:"right"}}><Mono>{c.hours}h</Mono></td>
                    <td style={{padding:"10px 10px",textAlign:"right"}}><Mono style={{color:ot>0?C.gold:C.muted}}>{Math.max(0,c.hours-40)}h</Mono></td>
                    <td style={{padding:"10px 10px",textAlign:"right"}}><Mono style={{color:C.sawdust}}>{c.hourly?fmt$(reg+ot):"Contract"}</Mono></td>
                    <td style={{padding:"10px 10px"}}><Btn size="sm" v="ghost" onClick={()=>openEditCrew(c)}>Edit</Btn></td>
                  </tr>
                );})}
                </tbody>
              </table>
            </div>
            <div style={{padding:"12px 14px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:12,color:C.muted}}>{crew.length} members</span>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <span style={{fontSize:12,color:C.muted}}>Week total:</span>
                <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:C.gold}}>{fmt$(totalPayroll)}</span>
              </div>
            </div>
          </Card>
        )
      )}

      {tab==="machines"&&(
        mobile?(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {machines.map(m=>{
              const serviceAlert=m.hours>=m.nextService-100;
              return(
                <Card key={m.id} style={{border:`1px solid ${serviceAlert?C.rustBorder:C.border}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                    <div>
                      <div style={{fontWeight:700,fontSize:15}}>{m.name}</div>
                      <div style={{fontSize:12,color:C.muted}}>{m.type} · {m.make} · {m.year}</div>
                    </div>
                    <div style={{display:"flex",gap:6,alignItems:"center"}}>
                      {serviceAlert&&<Badge color={C.rust}>⚠ Service</Badge>}
                      <Btn size="sm" v="ghost" onClick={()=>openEditMachine(m)}>✏️</Btn>
                    </div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                    {[["Hrs",`${m.hours.toLocaleString()}h`,C.sawdust],["Next Svc",`${m.nextService.toLocaleString()}h`,serviceAlert?C.rust:C.gold]].map(([l,v,col])=>(
                      <div key={l} style={{padding:"7px 10px",background:"rgba(14,9,4,0.5)",borderRadius:5}}>
                        <div style={{fontSize:9,color:C.muted,marginBottom:2}}>{l}</div>
                        <Mono style={{color:col,fontSize:13,fontWeight:700}}>{v}</Mono>
                      </div>
                    ))}
                  </div>
                  <ConfBar score={Math.min(100,Math.round((m.hours/m.nextService)*100))} h={5} color={serviceAlert?C.rust:C.gold}/>
                  <div style={{fontSize:11,color:C.muted,marginTop:5}}>👤 {m.assignedTo||"Unassigned"}</div>
                </Card>
              );
            })}
            <button onClick={()=>setAddMachineModal(true)} style={{border:`2px dashed ${C.border}`,borderRadius:8,padding:18,background:"transparent",color:C.muted,fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",textAlign:"center"}}>+ Add Machine</button>
          </div>
        ):(
          <Card style={{padding:0,overflow:"hidden"}}>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                <thead><tr style={{borderBottom:`1px solid ${C.border}`,background:"rgba(14,9,4,0.5)"}}>{["Machine","Type","Make/Year","Assigned To","Hours","Next Service","Status",""].map(h=><th key={h} style={{padding:"8px 10px",textAlign:"left",color:C.muted,fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:1,fontWeight:500,whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
                <tbody>{machines.map(m=>{
                  const serviceAlert=m.hours>=m.nextService-100;
                  const pct=Math.min(100,Math.round((m.hours/m.nextService)*100));
                  return(
                    <tr key={m.id} style={{borderBottom:`1px solid rgba(255,255,255,0.04)`,background:serviceAlert?"rgba(166,58,26,0.03)":"transparent"}}>
                      <td style={{padding:"10px 10px",fontWeight:600}}>{m.name}</td>
                      <td style={{padding:"10px 10px",color:C.muted,fontSize:12}}>{m.type}</td>
                      <td style={{padding:"10px 10px",color:C.muted,fontSize:12}}>{m.make} · {m.year}</td>
                      <td style={{padding:"10px 10px",fontSize:12}}>{m.assignedTo||<span style={{color:C.muted}}>Unassigned</span>}</td>
                      <td style={{padding:"10px 10px"}}><Mono>{m.hours.toLocaleString()}h</Mono></td>
                      <td style={{padding:"10px 10px",minWidth:140}}>
                        <div style={{marginBottom:4}}><ConfBar score={pct} h={4} color={serviceAlert?C.rust:C.gold}/></div>
                        <Mono style={{fontSize:10,color:serviceAlert?C.rust:C.muted}}>{m.nextService.toLocaleString()}h · {pct}%</Mono>
                      </td>
                      <td style={{padding:"10px 10px"}}>{serviceAlert?<Badge color={C.rust}>⚠ Due Soon</Badge>:<Badge color={C.fresh}>✓ OK</Badge>}</td>
                      <td style={{padding:"10px 10px"}}><Btn size="sm" v="ghost" onClick={()=>openEditMachine(m)}>Edit</Btn></td>
                    </tr>
                  );
                })}</tbody>
              </table>
            </div>
          </Card>
        )
      )}

      {/* ADD / EDIT CREW MODAL */}
      {addCrewModal&&(
        <Modal title={editCrew?"EDIT CREW MEMBER":"+ ADD CREW MEMBER"} onClose={()=>{setAddCrewModal(false);setEditCrew(null);}}>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <Inp label="Full Name" placeholder="Dale Schultz" value={crewForm.name} onChange={hc("name")}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <Sel label="Role" value={crewForm.role} onChange={hc("role")}>
                {["Feller Operator","Skidder Operator","Loader Operator","Processor Operator","Forwarder Operator","Truck Driver","Equipment Mechanic","Site Supervisor","Laborer","Other"].map(r=><option key={r}>{r}</option>)}
              </Sel>
              <Sel label="Entity" value={crewForm.entity} onChange={hc("entity")}>
                {user?.company&&<option>{user.company}</option>}
                <option>Hauling Division</option>
                <option>Other</option>
              </Sel>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:crewForm.isContractor?C.steelDim:"rgba(14,9,4,0.5)",border:`1px solid ${crewForm.isContractor?"rgba(122,138,150,0.28)":C.border}`,borderRadius:5}}>
              <Toggle checked={crewForm.isContractor} onChange={v=>setCrewForm(p=>({...p,isContractor:v}))} color={C.steel}/>
              <div>
                <div style={{fontSize:13,fontWeight:600}}>Contract / 1099</div>
                <div style={{fontSize:11,color:C.muted}}>No payroll — ticket-only, no hourly rate</div>
              </div>
            </div>
            {!crewForm.isContractor&&(
              <Inp label="Hourly Rate" prefix="$" suffix="/hr" type="number" placeholder="32.00" value={crewForm.hourly} onChange={hc("hourly")}/>
            )}
            <Sel label="Assigned Machine" value={crewForm.machine} onChange={hc("machine")}>
              <option value="">None / TBD</option>
              {machines.map(m=><option key={m.id} value={m.name}>{m.name}</option>)}
              <option value="Other">Other</option>
            </Sel>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <Inp label="Phone (optional)" placeholder="715-555-0000" value={crewForm.phone} onChange={hc("phone")}/>
              <Inp label="Email (optional)" placeholder="name@email.com" value={crewForm.email} onChange={hc("email")} type="email"/>
            </div>
            <div style={{padding:10,background:C.goldDim,border:`1px solid ${C.goldBorder}`,borderRadius:5,fontSize:11,color:C.gold}}>
              An invite link will be sent to their email so they can join your company on MillMarket.
            </div>
            <div style={{display:"flex",gap:8}}>
              <Btn v="outline" full onClick={()=>{setAddCrewModal(false);setEditCrew(null);}}>Cancel</Btn>
              <Btn full disabled={!crewForm.name} onClick={saveCrewMember}>{editCrew?"Save Changes":"Add to Crew"}</Btn>
            </div>
            {editCrew&&(
              <Btn v="danger" full size="sm" onClick={()=>{setCrew(cs=>cs.filter(c=>c.id!==editCrew.id));setAddCrewModal(false);setEditCrew(null);}}>
                Remove from Crew
              </Btn>
            )}
          </div>
        </Modal>
      )}

      {/* ADD / EDIT MACHINE MODAL */}
      {addMachineModal&&(
        <Modal title={editMachine?"EDIT MACHINE":"+ ADD MACHINE"} onClose={()=>{setAddMachineModal(false);setEditMachine(null);}}>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <Inp label="Machine Name / ID" placeholder="Tigercat 822D" value={machineForm.name} onChange={hm("name")}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <Sel label="Type" value={machineForm.type} onChange={hm("type")}>
                {MACHINE_TYPES.map(t=><option key={t}>{t}</option>)}
              </Sel>
              <Sel label="Make" value={machineForm.make} onChange={hm("make")}>
                {MACHINE_MAKES.map(m=><option key={m}>{m}</option>)}
              </Sel>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <Inp label="Year" type="number" placeholder="2022" value={machineForm.year} onChange={hm("year")}/>
              <Sel label="Assigned To" value={machineForm.assignedTo} onChange={hm("assignedTo")}>
                <option value="">Unassigned</option>
                {crew.filter(c=>c.status==="active").map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
              </Sel>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <Inp label="Current Hours" suffix="hrs" type="number" placeholder="4820" value={machineForm.hours} onChange={hm("hours")}/>
              <Inp label="Next Service At" suffix="hrs" type="number" placeholder="5000" value={machineForm.nextService} onChange={hm("nextService")} note="Service alert fires 100hrs before"/>
            </div>
            <div style={{display:"flex",gap:8}}>
              <Btn v="outline" full onClick={()=>{setAddMachineModal(false);setEditMachine(null);}}>Cancel</Btn>
              <Btn full disabled={!machineForm.name} onClick={saveMachine}>{editMachine?"Save Changes":"Add Machine"}</Btn>
            </div>
            {editMachine&&(
              <Btn v="danger" full size="sm" onClick={()=>{setMachines(ms=>ms.filter(m=>m.id!==editMachine.id));setAddMachineModal(false);setEditMachine(null);}}>
                Remove Machine
              </Btn>
            )}
          </div>
        </Modal>
      )}

      {/* NOTIFY ALL MODAL */}
      {notifyModal&&(
        <Modal title="📣 NOTIFY CREW" onClose={()=>setNotifyModal(false)} width={460}>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <Sel label="Send To" value="all" onChange={()=>{}}>
              <option value="all">All Active Crew ({crew.filter(c=>c.status==="active").length})</option>
              <option value="loggers">Loggers only</option>
              <option value="truckers">Truckers only</option>
            </Sel>
            <Sel label="Message Type" value="general" onChange={()=>{}}>
              <option value="general">General Announcement</option>
              <option value="site">Job Site Update</option>
              <option value="safety">Safety Alert</option>
              <option value="schedule">Schedule Change</option>
            </Sel>
            <div>
              <Lbl style={{marginBottom:7}}>Message</Lbl>
              <textarea placeholder="Your message here…" style={{width:"100%",background:"rgba(14,9,4,0.8)",border:`1px solid rgba(255,255,255,0.09)`,borderRadius:4,padding:"10px 12px",color:C.sawdust,fontSize:13,fontFamily:"'DM Sans',sans-serif",outline:"none",resize:"vertical",minHeight:80,boxSizing:"border-box"}}/>
            </div>
            <div style={{display:"flex",gap:8}}>
              <Btn v="outline" full onClick={()=>setNotifyModal(false)}>Cancel</Btn>
              <Btn full onClick={()=>setNotifyModal(false)}>Send Notification</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
