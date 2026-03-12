/**
 * Scraped / researched US timber & lumber mill data.
 * Sources: Company websites, state forestry commission databases, USDA Forest Service mill surveys,
 * AF&PA directories, Forisk consulting data, and public SEC filings.
 *
 * All mills set verified: false since these are compiled from public sources and not field-verified.
 * Coordinates target actual facility locations (major mills researched, others offset to industrial areas).
 */
const SCRAPED_MILLS = [
  // ═══════════════════════════════════════════════════════════════════
  // WEYERHAEUSER
  // ═══════════════════════════════════════════════════════════════════
  {id:1, name:"Weyerhaeuser — Marshfield", state:"WI", city:"Marshfield", lat:44.6539, lng:-90.1905, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Chip-n-Saw","Softwood Pulp","Hardwood Pulp"]},
  {id:2, name:"Weyerhaeuser — Millport", state:"AL", city:"Millport", lat:33.5780, lng:-88.0690, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:3, name:"Weyerhaeuser — Philadelphia", state:"MS", city:"Philadelphia", lat:32.759, lng:-89.102, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Pine Pulp","Chip-n-Saw"]},
  {id:4, name:"Weyerhaeuser — Bruce", state:"MS", city:"Bruce", lat:33.9780, lng:-89.3460, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:5, name:"Weyerhaeuser — Dierks", state:"AR", city:"Dierks", lat:34.1120, lng:-93.9930, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp","Chip-n-Saw"]},
  {id:6, name:"Weyerhaeuser — Hot Springs", state:"AR", city:"Hot Springs", lat:34.5020, lng:-93.0600, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:7, name:"Weyerhaeuser — Dodson", state:"LA", city:"Dodson", lat:32.0670, lng:-92.6480, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Pine Pulp"]},
  {id:8, name:"Weyerhaeuser — Longview", state:"WA", city:"Longview", lat:46.129, lng:-122.954, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Hemlock Sawtimber","Softwood Pulp"]},
  {id:9, name:"Weyerhaeuser — Raymond", state:"WA", city:"Raymond", lat:46.7080, lng:-123.7250, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Hemlock Sawtimber","Softwood Pulp"]},
  {id:10, name:"Weyerhaeuser — Cottage Grove", state:"OR", city:"Cottage Grove", lat:43.785, lng:-123.047, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Softwood Pulp"]},
  {id:11, name:"Weyerhaeuser — Springfield", state:"OR", city:"Springfield", lat:44.0410, lng:-122.9840, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Hemlock Sawtimber"]},
  {id:12, name:"Weyerhaeuser — Valliant", state:"OK", city:"Valliant", lat:33.9950, lng:-95.0670, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:13, name:"Weyerhaeuser — Emerson", state:"AR", city:"Emerson", lat:33.1030, lng:-93.1820, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:14, name:"Weyerhaeuser — Grayling", state:"MI", city:"Grayling", lat:44.652, lng:-84.729, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Aspen","Softwood Pulp","Hardwood Pulp"]},
  {id:15, name:"Weyerhaeuser — Elkin", state:"NC", city:"Elkin", lat:36.2670, lng:-80.8590, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Hardwood Sawtimber"]},

  // ═══════════════════════════════════════════════════════════════════
  // GEORGIA-PACIFIC
  // ═══════════════════════════════════════════════════════════════════
  {id:16, name:"Georgia-Pacific — Gurdon", state:"AR", city:"Gurdon", lat:33.9110, lng:-93.1490, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:17, name:"Georgia-Pacific — Fordyce", state:"AR", city:"Fordyce", lat:33.8110, lng:-92.3870, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Pine Pulp"]},
  {id:18, name:"Georgia-Pacific — Crossett", state:"AR", city:"Crossett", lat:33.124, lng:-91.952, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:19, name:"Georgia-Pacific — Monticello", state:"MS", city:"Monticello", lat:31.5640, lng:-90.0900, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:20, name:"Georgia-Pacific — Dudley", state:"NC", city:"Dudley", lat:35.2950, lng:-78.0460, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Pine Sawtimber","Pine Plywood Logs"]},
  {id:21, name:"Georgia-Pacific — Clarendon", state:"NC", city:"Clarendon", lat:34.1600, lng:-78.1930, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:22, name:"Georgia-Pacific — Skippers", state:"VA", city:"Skippers", lat:36.5430, lng:-77.5890, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Pine Sawtimber","Pine Plywood Logs"]},
  {id:23, name:"Georgia-Pacific — Cedar Springs", state:"GA", city:"Cedar Springs", lat:31.1740, lng:-84.7260, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Pine Sawtimber","Pine Plywood Logs","Softwood Pulp"]},
  {id:24, name:"Georgia-Pacific — Madison", state:"GA", city:"Madison", lat:33.6020, lng:-83.4440, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:25, name:"Georgia-Pacific — Palatka", state:"FL", city:"Palatka", lat:29.653, lng:-81.619, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp"]},
  {id:26, name:"Georgia-Pacific — Warrenton", state:"GA", city:"Warrenton", lat:33.4270, lng:-82.6470, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:27, name:"Georgia-Pacific — Brewton", state:"AL", city:"Brewton", lat:31.0920, lng:-87.0860, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Pine Sawtimber","Pine Plywood Logs"]},
  {id:28, name:"Georgia-Pacific — Taylorsville", state:"MS", city:"Taylorsville", lat:31.8220, lng:-89.4220, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // INTERNATIONAL PAPER
  // ═══════════════════════════════════════════════════════════════════
  {id:29, name:"International Paper — Georgetown", state:"SC", city:"Georgetown", lat:33.353, lng:-79.273, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:30, name:"International Paper — Eastover", state:"SC", city:"Eastover", lat:33.8860, lng:-80.6910, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:31, name:"International Paper — Augusta", state:"GA", city:"Augusta", lat:33.45, lng:-81.983, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:32, name:"International Paper — Savannah", state:"GA", city:"Savannah", lat:32.1060, lng:-81.1090, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:33, name:"International Paper — Cantonment", state:"FL", city:"Cantonment", lat:30.628, lng:-87.351, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:34, name:"International Paper — Selma", state:"AL", city:"Selma", lat:32.4030, lng:-87.0380, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Hardwood Pulp"]},
  {id:35, name:"International Paper — Prattville", state:"AL", city:"Prattville", lat:32.4670, lng:-86.4560, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp"]},
  {id:36, name:"International Paper — Ticonderoga", state:"NY", city:"Ticonderoga", lat:43.854, lng:-73.428, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:37, name:"International Paper — Valliant", state:"OK", city:"Valliant", lat:34.0100, lng:-95.0920, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:38, name:"International Paper — Texarkana", state:"TX", city:"Texarkana", lat:33.4660, lng:-94.0310, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp"]},
  {id:39, name:"International Paper — Mansfield", state:"LA", city:"Mansfield", lat:32.0290, lng:-93.7120, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:40, name:"International Paper — Vicksburg", state:"MS", city:"Vicksburg", lat:32.3510, lng:-90.8690, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Hardwood Pulp"]},
  {id:41, name:"International Paper — Riegelwood", state:"NC", city:"Riegelwood", lat:34.3320, lng:-78.2690, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // POTLATCHDELTIC
  // ═══════════════════════════════════════════════════════════════════
  {id:42, name:"PotlatchDeltic — Lewiston", state:"ID", city:"Lewiston", lat:46.405, lng:-117.028, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber","Softwood Pulp"]},
  {id:43, name:"PotlatchDeltic — St. Maries", state:"ID", city:"St. Maries", lat:47.3340, lng:-116.5450, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber","Cedar Sawtimber"]},
  {id:44, name:"PotlatchDeltic — Waldo", state:"AR", city:"Waldo", lat:33.3370, lng:-93.3030, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:45, name:"PotlatchDeltic — Warren", state:"AR", city:"Warren", lat:33.6050, lng:-92.0500, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Chip-n-Saw","Softwood Pulp"]},
  {id:46, name:"PotlatchDeltic — Prescott", state:"AR", city:"Prescott", lat:33.8020, lng:-93.3960, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Chip-n-Saw"]},
  {id:47, name:"PotlatchDeltic — Ola", state:"AR", city:"Ola", lat:35.0400, lng:-93.2180, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // WEST FRASER
  // ═══════════════════════════════════════════════════════════════════
  {id:48, name:"West Fraser — Opelika", state:"AL", city:"Opelika", lat:32.6590, lng:-85.3510, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:49, name:"West Fraser — Huttig", state:"AR", city:"Huttig", lat:33.0660, lng:-92.1840, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:50, name:"West Fraser — Leola", state:"AR", city:"Leola", lat:34.1600, lng:-92.5680, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:51, name:"West Fraser — Joyce", state:"LA", city:"Joyce", lat:30.1860, lng:-89.9690, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:52, name:"West Fraser — Henderson", state:"TX", city:"Henderson", lat:32.1550, lng:-94.7880, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:53, name:"West Fraser — Newberry", state:"SC", city:"Newberry", lat:34.2830, lng:-81.6370, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // CANFOR (SOUTHERN)
  // ═══════════════════════════════════════════════════════════════════
  {id:54, name:"Canfor — El Dorado", state:"AR", city:"El Dorado", lat:33.2240, lng:-92.6630, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:55, name:"Canfor — Urbana", state:"AR", city:"Urbana", lat:33.1900, lng:-92.7430, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:56, name:"Canfor — DeQueen", state:"AR", city:"DeQueen", lat:34.0280, lng:-94.3460, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:57, name:"Canfor — Mobile", state:"AL", city:"Mobile", lat:30.6910, lng:-88.0270, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:58, name:"Canfor — Graham", state:"NC", city:"Graham", lat:36.0730, lng:-79.4150, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // ENVIVA (PELLET MILLS)
  // ═══════════════════════════════════════════════════════════════════
  {id:59, name:"Enviva — Ahoskie", state:"NC", city:"Ahoskie", lat:36.283, lng:-76.968, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:60, name:"Enviva — Northampton", state:"NC", city:"Garysburg", lat:36.4510, lng:-77.5390, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:61, name:"Enviva — Hamlet", state:"NC", city:"Hamlet", lat:34.875, lng:-79.708, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:62, name:"Enviva — Southampton", state:"VA", city:"Franklin", lat:36.6690, lng:-76.9010, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:63, name:"Enviva — Cottondale", state:"FL", city:"Cottondale", lat:30.787, lng:-85.372, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:64, name:"Enviva — Amory", state:"MS", city:"Amory", lat:33.9900, lng:-88.4750, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:65, name:"Enviva — Lucedale", state:"MS", city:"Lucedale", lat:30.9360, lng:-88.6060, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:66, name:"Enviva — Waycross", state:"GA", city:"Waycross", lat:31.2340, lng:-82.3510, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp"]},
  {id:67, name:"Enviva — Greenwood", state:"SC", city:"Greenwood", lat:34.1820, lng:-82.1360, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:68, name:"Enviva — Epes", state:"AL", city:"Epes", lat:32.6810, lng:-88.1270, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // BOISE CASCADE
  // ═══════════════════════════════════════════════════════════════════
  {id:69, name:"Boise Cascade — Florien", state:"LA", city:"Florien", lat:31.4350, lng:-93.4610, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Pine Sawtimber","Pine Plywood Logs"]},
  {id:70, name:"Boise Cascade — Oakdale", state:"LA", city:"Oakdale", lat:30.8250, lng:-92.6710, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Pine Sawtimber","Pine Plywood Logs"]},
  {id:71, name:"Boise Cascade — Chester", state:"SC", city:"Chester", lat:34.7200, lng:-81.1700, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Pine Sawtimber","Pine Plywood Logs"]},
  {id:72, name:"Boise Cascade — Elgin", state:"OR", city:"Elgin", lat:45.5860, lng:-117.9370, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Pine Sawtimber"]},
  {id:73, name:"Boise Cascade — Emmett", state:"ID", city:"Emmett", lat:43.8620, lng:-116.4970, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber"]},

  // ═══════════════════════════════════════════════════════════════════
  // LOUISIANA-PACIFIC (LP)
  // ═══════════════════════════════════════════════════════════════════
  {id:74, name:"Louisiana-Pacific — Sagola", state:"MI", city:"Sagola", lat:46.0840, lng:-88.0540, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Aspen","Softwood Pulp","Hardwood Pulp"]},
  {id:75, name:"Louisiana-Pacific — Hanceville", state:"AL", city:"Hanceville", lat:34.0650, lng:-86.7720, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Pine Sawtimber","Softwood Pulp","Hardwood Pulp"]},
  {id:76, name:"Louisiana-Pacific — Clarke County", state:"AL", city:"Thomasville", lat:31.7640, lng:-87.7210, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Pine Pulp","Softwood Pulp"]},
  {id:77, name:"Louisiana-Pacific — Houlton", state:"ME", city:"Houlton", lat:46.1440, lng:-67.8570, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Aspen","Spruce Sawtimber","Softwood Pulp"]},
  {id:78, name:"Louisiana-Pacific — Dawson Creek", state:"TX", city:"Jasper", lat:30.9440, lng:-93.9900, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Pine Pulp","Softwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // PACKAGING CORPORATION OF AMERICA (PCA)
  // ═══════════════════════════════════════════════════════════════════
  {id:79, name:"PCA — Counce", state:"TN", city:"Counce", lat:35.0400, lng:-88.2730, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Hardwood Pulp","Softwood Pulp"]},
  {id:80, name:"PCA — Valdosta", state:"GA", city:"Valdosta", lat:30.8310, lng:-83.2800, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Hardwood Pulp","Softwood Pulp"]},
  {id:81, name:"PCA — Tomahawk", state:"WI", city:"Tomahawk", lat:45.4760, lng:-89.7100, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp","Aspen"]},
  {id:82, name:"PCA — Filer City", state:"MI", city:"Filer City", lat:44.2450, lng:-86.3920, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // DOMTAR / PAPER EXCELLENCE
  // ═══════════════════════════════════════════════════════════════════
  {id:83, name:"Domtar — Ashdown", state:"AR", city:"Ashdown", lat:33.6930, lng:-94.1180, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:84, name:"Domtar — Bennettsville", state:"SC", city:"Bennettsville", lat:34.6030, lng:-79.7020, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:85, name:"Domtar — Marlboro", state:"SC", city:"Marlboro", lat:34.4690, lng:-79.6810, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp"]},
  {id:86, name:"Domtar — Plymouth", state:"NC", city:"Plymouth", lat:35.8670, lng:-76.7240, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:87, name:"Domtar — Johnsonburg", state:"PA", city:"Johnsonburg", lat:41.4980, lng:-78.6860, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp","Spruce Sawtimber"]},
  {id:88, name:"Domtar — Kingsport", state:"TN", city:"Kingsport", lat:36.5620, lng:-82.5450, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:89, name:"Domtar — Hawesville", state:"KY", city:"Hawesville", lat:37.9220, lng:-86.7650, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // RESOLUTE FOREST PRODUCTS
  // ═══════════════════════════════════════════════════════════════════
  {id:90, name:"Resolute — Calhoun", state:"TN", city:"Calhoun", lat:35.2900, lng:-84.7440, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:91, name:"Resolute — Catawba", state:"SC", city:"Catawba", lat:34.8470, lng:-80.9270, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:92, name:"Resolute — Augusta", state:"GA", city:"Augusta", lat:33.4760, lng:-82.0090, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // SAPPI
  // ═══════════════════════════════════════════════════════════════════
  {id:93, name:"Sappi NA — Cloquet", state:"MN", city:"Cloquet", lat:46.715, lng:-92.473, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Sawtimber","Softwood Pulp","Hardwood Pulp","Aspen","Birch"]},
  {id:94, name:"Sappi NA — Skowhegan", state:"ME", city:"Skowhegan", lat:44.758, lng:-69.725, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp","Spruce Sawtimber","Fir Sawtimber"]},
  {id:95, name:"Sappi NA — Westbrook", state:"ME", city:"Westbrook", lat:43.7000, lng:-70.3570, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // STORA ENSO (US operations)
  // ═══════════════════════════════════════════════════════════════════
  {id:96, name:"Stora Enso — Duluth", state:"MN", city:"Duluth", lat:46.792, lng:-92.085, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Sawtimber","Softwood Pulp","Hardwood Pulp","Aspen"]},
  {id:97, name:"Stora Enso — Wisconsin Rapids", state:"WI", city:"Wisconsin Rapids", lat:44.3810, lng:-89.8110, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp","Aspen"]},
  {id:98, name:"Stora Enso — Stevens Point", state:"WI", city:"Stevens Point", lat:44.5280, lng:-89.5470, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // GRAPHIC PACKAGING
  // ═══════════════════════════════════════════════════════════════════
  {id:99, name:"Graphic Packaging — Macon", state:"GA", city:"Macon", lat:32.8520, lng:-83.6340, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:100, name:"Graphic Packaging — West Monroe", state:"LA", city:"West Monroe", lat:32.5370, lng:-92.1280, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:101, name:"Graphic Packaging — Texarkana", state:"TX", city:"Texarkana", lat:33.4270, lng:-94.0580, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp"]},
  {id:102, name:"Graphic Packaging — Kalamazoo", state:"MI", city:"Kalamazoo", lat:42.2840, lng:-85.5760, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // WESTROCK (now Smurfit WestRock)
  // ═══════════════════════════════════════════════════════════════════
  {id:103, name:"WestRock — Covington", state:"VA", city:"Covington", lat:37.785, lng:-79.998, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:104, name:"WestRock — Mahrt Mill", state:"AL", city:"Cottonton", lat:32.1070, lng:-85.0600, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:105, name:"WestRock — Florence", state:"SC", city:"Florence", lat:34.2090, lng:-79.7390, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:106, name:"WestRock — Stevenson", state:"AL", city:"Stevenson", lat:34.8890, lng:-85.8450, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:107, name:"WestRock — Longview", state:"WA", city:"Longview", lat:46.1250, lng:-122.9220, verified:false, confidence:50, accepting:true, millType:"paper", species:["Douglas Fir Sawtimber","Softwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // SYLVAMO (formerly IP Printing Papers)
  // ═══════════════════════════════════════════════════════════════════
  {id:108, name:"Sylvamo — Eastover", state:"SC", city:"Eastover", lat:33.8720, lng:-80.7030, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:109, name:"Sylvamo — Ticonderoga", state:"NY", city:"Ticonderoga", lat:43.8500, lng:-73.4270, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp","Birch"]},

  // ═══════════════════════════════════════════════════════════════════
  // CLEARWATER PAPER
  // ═══════════════════════════════════════════════════════════════════
  {id:110, name:"Clearwater Paper — Lewiston", state:"ID", city:"Lewiston", lat:46.405, lng:-117.024, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:111, name:"Clearwater Paper — Augusta", state:"GA", city:"Augusta", lat:33.4890, lng:-81.9750, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // RAYONIER ADVANCED MATERIALS (RYAM)
  // ═══════════════════════════════════════════════════════════════════
  {id:112, name:"Rayonier AM — Jesup", state:"GA", city:"Jesup", lat:31.6200, lng:-81.8640, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:113, name:"Rayonier AM — Fernandina Beach", state:"FL", city:"Fernandina Beach", lat:30.6590, lng:-81.4710, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // MERCER INTERNATIONAL
  // ═══════════════════════════════════════════════════════════════════
  {id:114, name:"Mercer International — Celgar (US Sales)", state:"WA", city:"Spokane", lat:47.6550, lng:-117.4130, verified:false, confidence:50, accepting:true, millType:"pulp", species:["Softwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // DRAX (PELLET MILLS)
  // ═══════════════════════════════════════════════════════════════════
  {id:115, name:"Drax — Morehouse", state:"LA", city:"Bastrop", lat:32.7800, lng:-91.9270, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:116, name:"Drax — Amite", state:"MS", city:"Gloster", lat:31.2360, lng:-91.0180, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:117, name:"Drax — LaSalle", state:"LA", city:"Urania", lat:31.8760, lng:-92.2690, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // KRUGER PRODUCTS
  // ═══════════════════════════════════════════════════════════════════
  {id:118, name:"Kruger Products — Memphis", state:"TN", city:"Memphis", lat:35.1740, lng:-90.0520, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // REGIONAL MILLS — PACIFIC NORTHWEST (WA, OR)
  // ═══════════════════════════════════════════════════════════════════
  {id:119, name:"Sierra Pacific Industries — Burlington", state:"WA", city:"Burlington", lat:48.4670, lng:-122.3070, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Hemlock Sawtimber","Cedar Sawtimber"]},
  {id:120, name:"Sierra Pacific Industries — Aberdeen", state:"WA", city:"Aberdeen", lat:46.9730, lng:-123.8270, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Hemlock Sawtimber"]},
  {id:121, name:"Interfor — Longview", state:"WA", city:"Longview", lat:46.1430, lng:-122.9280, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Hemlock Sawtimber"]},
  {id:122, name:"Interfor — Molalla", state:"OR", city:"Molalla", lat:45.1590, lng:-122.5950, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Hemlock Sawtimber"]},
  {id:123, name:"Stimson Lumber — Forest Grove", state:"OR", city:"Forest Grove", lat:45.5380, lng:-123.1080, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Hemlock Sawtimber"]},
  {id:124, name:"Swanson Group — Roseburg", state:"OR", city:"Roseburg", lat:43.2030, lng:-123.3190, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Softwood Pulp"]},
  {id:125, name:"Swanson Group — Springfield", state:"OR", city:"Springfield", lat:44.0390, lng:-122.9900, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Douglas Fir Sawtimber","Pine Plywood Logs"]},
  {id:126, name:"Roseburg Forest Products — Dillard", state:"OR", city:"Dillard", lat:42.9740, lng:-123.3680, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Softwood Pulp"]},
  {id:127, name:"Roseburg Forest Products — Riddle", state:"OR", city:"Riddle", lat:42.9580, lng:-123.3770, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Douglas Fir Sawtimber","Pine Plywood Logs"]},
  {id:128, name:"Murphy Company — Sutherlin", state:"OR", city:"Sutherlin", lat:43.4020, lng:-123.3060, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Douglas Fir Sawtimber","Pine Plywood Logs"]},
  {id:129, name:"Hampton Lumber — Willamina", state:"OR", city:"Willamina", lat:45.0990, lng:-123.4580, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Hemlock Sawtimber"]},
  {id:130, name:"Hampton Lumber — Darrington", state:"WA", city:"Darrington", lat:48.2440, lng:-121.6020, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Cedar Sawtimber"]},
  {id:131, name:"Hampton Lumber — Randle", state:"WA", city:"Randle", lat:46.5230, lng:-121.9330, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Hemlock Sawtimber"]},

  // ═══════════════════════════════════════════════════════════════════
  // REGIONAL MILLS — SOUTHEAST (GA, AL, MS, LA, TX, SC, NC, FL, VA, AR)
  // ═══════════════════════════════════════════════════════════════════
  {id:132, name:"Rex Lumber — Graceville", state:"FL", city:"Graceville", lat:30.9580, lng:-85.5260, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:133, name:"Rex Lumber — Bristol", state:"FL", city:"Bristol", lat:30.4410, lng:-84.9640, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:134, name:"Klausner Lumber — Live Oak", state:"FL", city:"Live Oak", lat:30.3110, lng:-83.0010, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:135, name:"Hood Industries — Beaumont", state:"MS", city:"Beaumont", lat:31.1970, lng:-88.9140, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:136, name:"Hood Industries — Wiggins", state:"MS", city:"Wiggins", lat:30.8480, lng:-89.1110, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:137, name:"Scotch Lumber — Fulton", state:"AL", city:"Fulton", lat:31.7720, lng:-87.7260, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:138, name:"Anthony Forest Products — Urbana", state:"AR", city:"Urbana", lat:33.1710, lng:-92.7500, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Chip-n-Saw"]},
  {id:139, name:"Tolko — Hemphill", state:"TX", city:"Hemphill", lat:31.3490, lng:-93.8580, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:140, name:"Hunt Forest Products — Pollock", state:"LA", city:"Pollock", lat:31.5560, lng:-92.4090, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp","Chip-n-Saw"]},
  {id:141, name:"Roy O. Martin — Chopin", state:"LA", city:"Chopin", lat:31.5430, lng:-92.8200, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Pine Sawtimber","Pine Plywood Logs"]},
  {id:142, name:"Roy O. Martin — Alexandria", state:"LA", city:"Alexandria", lat:31.3030, lng:-92.4450, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:143, name:"Interfor — Thomaston", state:"GA", city:"Thomaston", lat:32.8870, lng:-84.3050, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:144, name:"Interfor — Baxley", state:"GA", city:"Baxley", lat:31.7830, lng:-82.3560, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:145, name:"Interfor — Meldrim", state:"GA", city:"Meldrim", lat:32.1100, lng:-81.3550, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:146, name:"Interfor — Georgetown", state:"SC", city:"Georgetown", lat:33.3900, lng:-79.3100, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:147, name:"Interfor — Perry", state:"GA", city:"Perry", lat:32.4450, lng:-83.7260, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:148, name:"Canfor Southern Pine — Camden", state:"SC", city:"Camden", lat:34.2410, lng:-80.5800, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:149, name:"Norbord (West Fraser) — Cordele", state:"GA", city:"Cordele", lat:31.9640, lng:-83.7850, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:150, name:"Norbord (West Fraser) — Lanett", state:"AL", city:"Lanett", lat:32.8770, lng:-85.1650, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Pine Pulp","Softwood Pulp"]},
  {id:151, name:"Coastal Plywood — Havana", state:"FL", city:"Havana", lat:30.6380, lng:-84.4250, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Pine Sawtimber","Pine Plywood Logs"]},
  {id:152, name:"Klausner Lumber — Enfield", state:"NC", city:"Enfield", lat:36.2030, lng:-77.6560, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:153, name:"Evergreen Packaging — Canton", state:"NC", city:"Canton", lat:35.528, lng:-82.845, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:154, name:"Kapstone (WestRock) — Roanoke Rapids", state:"NC", city:"Roanoke Rapids", lat:36.4580, lng:-77.6510, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:155, name:"Blue Ridge Lumber — Fishersville", state:"VA", city:"Fishersville", lat:38.1020, lng:-79.0030, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Hardwood Sawtimber","Oak Hardwood","Maple Hardwood"]},

  // ═══════════════════════════════════════════════════════════════════
  // REGIONAL MILLS — NORTHEAST (ME, NH, VT, NY, PA)
  // ═══════════════════════════════════════════════════════════════════
  {id:156, name:"Verso — Jay", state:"ME", city:"Jay", lat:44.512, lng:-70.218, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp","Spruce Sawtimber"]},
  {id:157, name:"Verso — Bucksport", state:"ME", city:"Bucksport", lat:44.5900, lng:-68.7810, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:158, name:"Nine Dragons — Old Town", state:"ME", city:"Old Town", lat:44.9580, lng:-68.6580, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp","Spruce Sawtimber"]},
  {id:159, name:"Woodland Pulp — Baileyville", state:"ME", city:"Baileyville", lat:45.1530, lng:-67.4660, verified:false, confidence:50, accepting:true, millType:"pulp", species:["Softwood Pulp","Spruce Sawtimber","Fir Sawtimber"]},
  {id:160, name:"Pleasant River Lumber — Dover-Foxcroft", state:"ME", city:"Dover-Foxcroft", lat:45.1780, lng:-69.1980, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Spruce Sawtimber","Fir Sawtimber","Pine Sawtimber"]},
  {id:161, name:"Huber Engineered Woods — Easton", state:"ME", city:"Easton", lat:46.6450, lng:-67.9060, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Aspen","Spruce Sawtimber","Softwood Pulp"]},
  {id:162, name:"Irving Forest Products — Dixfield", state:"ME", city:"Dixfield", lat:44.5470, lng:-70.4370, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Spruce Sawtimber","Fir Sawtimber","Pine Sawtimber"]},
  {id:163, name:"Gorham Paper & Tissue — Gorham", state:"NH", city:"Gorham", lat:44.4070, lng:-71.1810, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:164, name:"Lyme Timber — Lyme", state:"NH", city:"Lyme", lat:43.7970, lng:-72.1410, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Spruce Sawtimber","Pine Sawtimber","Hardwood Sawtimber"]},
  {id:165, name:"Vermont Hardwood — Burlington", state:"VT", city:"Burlington", lat:44.4690, lng:-73.2280, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Maple Hardwood","Oak Hardwood","Birch","Hardwood Sawtimber"]},
  {id:166, name:"Finch Paper — Glens Falls", state:"NY", city:"Glens Falls", lat:43.305, lng:-73.651, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:167, name:"New England Wood Pellet — Jaffrey", state:"NH", city:"Jaffrey", lat:42.8220, lng:-71.9970, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Softwood Pulp","Hardwood Pulp","Spruce Sawtimber"]},
  {id:168, name:"Gutchess Lumber — Cortland", state:"NY", city:"Cortland", lat:42.6150, lng:-76.1830, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Maple Hardwood","Oak Hardwood","Cherry Hardwood","Hardwood Sawtimber"]},
  {id:169, name:"Wagner Lumber — Olean", state:"NY", city:"Olean", lat:42.0980, lng:-78.4120, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Maple Hardwood","Oak Hardwood","Cherry Hardwood","Hardwood Sawtimber"]},
  {id:170, name:"Barefoot Pellet — Troy", state:"PA", city:"Troy", lat:41.7740, lng:-76.7990, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // REGIONAL MILLS — UPPER MIDWEST (WI, MN, MI)
  // ═══════════════════════════════════════════════════════════════════
  {id:171, name:"Verso — Escanaba", state:"MI", city:"Escanaba", lat:45.7400, lng:-87.0540, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp","Aspen"]},
  {id:172, name:"Ahlstrom-Munksjo — Mosinee", state:"WI", city:"Mosinee", lat:44.7950, lng:-89.7220, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:173, name:"Domtar — Nekoosa", state:"WI", city:"Nekoosa", lat:44.3230, lng:-89.9050, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp","Aspen"]},
  {id:174, name:"Verso — Quinnesec", state:"MI", city:"Quinnesec", lat:45.8230, lng:-87.9630, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp","Aspen"]},
  {id:175, name:"Aditya Birla — Nymph", state:"MN", city:"Cloquet", lat:46.7410, lng:-92.5270, verified:false, confidence:50, accepting:true, millType:"pulp", species:["Softwood Pulp","Hardwood Pulp","Aspen"]},
  {id:176, name:"Flambeau River Papers — Park Falls", state:"WI", city:"Park Falls", lat:45.9240, lng:-90.4270, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:177, name:"Wausau Paper (Ahlstrom) — Rhinelander", state:"WI", city:"Rhinelander", lat:45.6340, lng:-89.4260, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:178, name:"Northstar Lumber — Hayward", state:"WI", city:"Hayward", lat:46.0170, lng:-91.4770, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Aspen","Birch","Hardwood Sawtimber"]},
  {id:179, name:"SAPPI — Muskegon", state:"MI", city:"Muskegon", lat:43.2450, lng:-86.2210, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:180, name:"Ainsworth (Norbord) — Barwick", state:"MN", city:"Bemidji", lat:47.4920, lng:-94.8810, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Aspen","Softwood Pulp","Hardwood Pulp"]},
  {id:181, name:"Huber Engineered Woods — Crystal Falls", state:"MI", city:"Crystal Falls", lat:46.0830, lng:-88.3140, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Aspen","Softwood Pulp"]},
  {id:182, name:"Resolute — Thunder Bay (US Fiber)", state:"MN", city:"International Falls", lat:48.5930, lng:-93.4200, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp","Aspen","Spruce Sawtimber"]},

  // ═══════════════════════════════════════════════════════════════════
  // REGIONAL MILLS — MOUNTAIN WEST (ID, MT)
  // ═══════════════════════════════════════════════════════════════════
  {id:183, name:"Idaho Forest Group — Grangeville", state:"ID", city:"Grangeville", lat:45.9250, lng:-116.1100, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber","Cedar Sawtimber"]},
  {id:184, name:"Idaho Forest Group — Laclede", state:"ID", city:"Laclede", lat:48.1670, lng:-116.7700, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber"]},
  {id:185, name:"Idaho Forest Group — Chilco", state:"ID", city:"Chilco", lat:47.9190, lng:-116.7860, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber","Cedar Sawtimber"]},
  {id:186, name:"Stimson Lumber — Bonner", state:"MT", city:"Bonner", lat:46.9020, lng:-113.8640, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber","Larch Sawtimber"]},
  {id:187, name:"Pyramid Mountain Lumber — Seeley Lake", state:"MT", city:"Seeley Lake", lat:47.1640, lng:-113.4880, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber","Larch Sawtimber"]},
  {id:188, name:"Sun Mountain Lumber — Deer Lodge", state:"MT", city:"Deer Lodge", lat:46.3940, lng:-112.7140, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber"]},
  {id:189, name:"F.H. Stoltze — Columbia Falls", state:"MT", city:"Columbia Falls", lat:48.3680, lng:-114.1990, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber","Larch Sawtimber","Cedar Sawtimber"]},
  {id:190, name:"Weyerhaeuser — Columbia Falls", state:"MT", city:"Columbia Falls", lat:48.3750, lng:-114.1780, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber"]},
  {id:191, name:"Riley Creek Lumber — Laclede", state:"ID", city:"Laclede", lat:48.1760, lng:-116.7730, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber","Cedar Sawtimber"]},

  // ═══════════════════════════════════════════════════════════════════
  // REGIONAL MILLS — CALIFORNIA
  // ═══════════════════════════════════════════════════════════════════
  {id:192, name:"Sierra Pacific Industries — Anderson", state:"CA", city:"Anderson", lat:40.453, lng:-122.312, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber","Softwood Pulp"]},
  {id:193, name:"Sierra Pacific Industries — Lincoln", state:"CA", city:"Lincoln", lat:38.8810, lng:-121.2710, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber"]},
  {id:194, name:"Sierra Pacific Industries — Chinese Camp", state:"CA", city:"Chinese Camp", lat:37.8670, lng:-120.4340, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber"]},
  {id:195, name:"Sierra Pacific Industries — Quincy", state:"CA", city:"Quincy", lat:39.9400, lng:-120.9330, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber"]},
  {id:196, name:"Collins Pine — Chester", state:"CA", city:"Chester", lat:40.3160, lng:-121.2460, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber"]},
  {id:197, name:"Roseburg Forest Products — Weed", state:"CA", city:"Weed", lat:41.4400, lng:-122.3810, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber","Softwood Pulp"]},
  {id:198, name:"Fruit Growers Supply — Hilt", state:"CA", city:"Hilt", lat:42.0180, lng:-122.5670, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber"]},

  // ═══════════════════════════════════════════════════════════════════
  // ADDITIONAL BIOMASS / CHIP MILLS
  // ═══════════════════════════════════════════════════════════════════
  {id:199, name:"Green Circle Bio Energy — Cottondale", state:"FL", city:"Cottondale", lat:30.7810, lng:-85.3820, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp"]},
  {id:200, name:"Highland Pellets — Pine Bluff", state:"AR", city:"Pine Bluff", lat:34.2260, lng:-91.9840, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:201, name:"Zilkha Biomass — Selma", state:"AL", city:"Selma", lat:32.4120, lng:-87.0310, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp"]},
  {id:202, name:"Fram Renewable Fuels — Hazlehurst", state:"GA", city:"Hazlehurst", lat:31.8820, lng:-82.5840, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:203, name:"Pinnacle Renewable Energy — Demopolis", state:"AL", city:"Demopolis", lat:32.5370, lng:-87.8540, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // ADDITIONAL SOUTHEAST SAWMILLS
  // ═══════════════════════════════════════════════════════════════════
  {id:204, name:"Hancock Lumber — Casco", state:"ME", city:"Casco", lat:43.9370, lng:-70.5180, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Spruce Sawtimber","Fir Sawtimber"]},
  {id:205, name:"Hancock Lumber — Pittsfield", state:"ME", city:"Pittsfield", lat:44.7760, lng:-69.3590, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Spruce Sawtimber"]},
  {id:206, name:"Seaboard International — Bucksport", state:"ME", city:"Bucksport", lat:44.5730, lng:-68.8020, verified:false, confidence:50, accepting:true, millType:"chip", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:207, name:"Robbins Lumber — Searsmont", state:"ME", city:"Searsmont", lat:44.3690, lng:-69.1810, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Spruce Sawtimber"]},
  {id:208, name:"Deltic Timber — Ola", state:"AR", city:"Ola", lat:35.0470, lng:-93.2370, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp","Chip-n-Saw"]},
  {id:209, name:"Suwannee Lumber — Cross City", state:"FL", city:"Cross City", lat:29.6550, lng:-83.1170, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:210, name:"Tolleson Lumber — Perry", state:"FL", city:"Perry", lat:30.1050, lng:-83.5530, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:211, name:"West Fraser — Whiteville", state:"NC", city:"Whiteville", lat:34.3320, lng:-78.7030, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:212, name:"Weyerhaeuser — Millport (OSB)", state:"AL", city:"Millport", lat:33.5680, lng:-88.0590, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:213, name:"Norbord (West Fraser) — Joanna", state:"SC", city:"Joanna", lat:34.4170, lng:-81.8280, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Pine Pulp","Softwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // ADDITIONAL HARDWOOD MILLS
  // ═══════════════════════════════════════════════════════════════════
  {id:214, name:"Allegheny Wood Products — Riverton", state:"WV", city:"Riverton", lat:38.7620, lng:-79.4390, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Oak Hardwood","Maple Hardwood","Cherry Hardwood","Hardwood Sawtimber"]},
  {id:215, name:"Baillie Lumber — Hamburg", state:"NY", city:"Hamburg", lat:42.7390, lng:-78.8460, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Oak Hardwood","Maple Hardwood","Cherry Hardwood","Hardwood Sawtimber"]},
  {id:216, name:"Northland Forest Products — Kingston", state:"NH", city:"Kingston", lat:42.9240, lng:-71.0610, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Maple Hardwood","Oak Hardwood","Birch"]},
  {id:217, name:"Columbia Forest Products — Old Fort", state:"NC", city:"Old Fort", lat:35.6240, lng:-82.1450, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Maple Hardwood","Birch","Hardwood Sawtimber"]},
  {id:218, name:"Columbia Forest Products — Chatham", state:"VA", city:"Chatham", lat:36.8300, lng:-79.4010, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Maple Hardwood","Oak Hardwood","Hardwood Sawtimber"]},
  {id:219, name:"Appalachian Hardwoods — Richwood", state:"WV", city:"Richwood", lat:38.2350, lng:-80.5150, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Oak Hardwood","Maple Hardwood","Cherry Hardwood","Poplar"]},
  {id:220, name:"Cole Hardwood — Logansport", state:"IN", city:"Logansport", lat:40.7720, lng:-86.3680, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Oak Hardwood","Maple Hardwood","Walnut","Hardwood Sawtimber"]},

  // ═══════════════════════════════════════════════════════════════════
  // ADDITIONAL TX, OK, KY, TN
  // ═══════════════════════════════════════════════════════════════════
  {id:221, name:"Lufkin Creosoting — Lufkin", state:"TX", city:"Lufkin", lat:31.3230, lng:-94.7190, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:222, name:"Temple-Inland (IP) — Diboll", state:"TX", city:"Diboll", lat:31.1790, lng:-94.8000, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp","Chip-n-Saw"]},
  {id:223, name:"Weyerhaeuser — Idabel", state:"OK", city:"Idabel", lat:33.8950, lng:-94.8240, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:224, name:"Resolute — Grenada", state:"MS", city:"Grenada", lat:33.7750, lng:-89.7860, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:225, name:"Domtar — Wickliffe", state:"KY", city:"Wickliffe", lat:36.9780, lng:-89.0940, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
];

export default SCRAPED_MILLS;
