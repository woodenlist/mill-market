/**
 * Scraped / researched US timber & lumber mill data.
 * Sources: Company websites, state forestry commission databases, USDA Forest Service mill surveys,
 * AF&PA directories, Forisk consulting data, and public SEC filings.
 *
 * All mills set verified: false since these are compiled from public sources and not field-verified.
 * Coordinates are approximate (city-center or known industrial area).
 */
const SCRAPED_MILLS = [
  // ═══════════════════════════════════════════════════════════════════
  // WEYERHAEUSER
  // ═══════════════════════════════════════════════════════════════════
  {id:1, name:"Weyerhaeuser — Marshfield", state:"WI", city:"Marshfield", lat:44.669, lng:-90.172, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Chip-n-Saw","Softwood Pulp","Hardwood Pulp"]},
  {id:2, name:"Weyerhaeuser — Millport", state:"AL", city:"Millport", lat:33.566, lng:-88.080, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:3, name:"Weyerhaeuser — Philadelphia", state:"MS", city:"Philadelphia", lat:32.771, lng:-89.117, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Pine Pulp","Chip-n-Saw"]},
  {id:4, name:"Weyerhaeuser — Bruce", state:"MS", city:"Bruce", lat:33.992, lng:-89.349, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:5, name:"Weyerhaeuser — Dierks", state:"AR", city:"Dierks", lat:34.119, lng:-94.017, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp","Chip-n-Saw"]},
  {id:6, name:"Weyerhaeuser — Hot Springs", state:"AR", city:"Hot Springs", lat:34.502, lng:-93.055, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:7, name:"Weyerhaeuser — Dodson", state:"LA", city:"Dodson", lat:32.060, lng:-92.664, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Pine Pulp"]},
  {id:8, name:"Weyerhaeuser — Longview", state:"WA", city:"Longview", lat:46.138, lng:-122.938, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Hemlock Sawtimber","Softwood Pulp"]},
  {id:9, name:"Weyerhaeuser — Raymond", state:"WA", city:"Raymond", lat:46.687, lng:-123.733, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Hemlock Sawtimber","Softwood Pulp"]},
  {id:10, name:"Weyerhaeuser — Cottage Grove", state:"OR", city:"Cottage Grove", lat:43.797, lng:-123.059, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Softwood Pulp"]},
  {id:11, name:"Weyerhaeuser — Springfield", state:"OR", city:"Springfield", lat:44.046, lng:-122.984, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Hemlock Sawtimber"]},
  {id:12, name:"Weyerhaeuser — Valliant", state:"OK", city:"Valliant", lat:33.993, lng:-95.088, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:13, name:"Weyerhaeuser — Emerson", state:"AR", city:"Emerson", lat:33.094, lng:-93.174, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:14, name:"Weyerhaeuser — Grayling", state:"MI", city:"Grayling", lat:44.661, lng:-84.715, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Aspen","Softwood Pulp","Hardwood Pulp"]},
  {id:15, name:"Weyerhaeuser — Elkin", state:"NC", city:"Elkin", lat:36.244, lng:-80.843, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Hardwood Sawtimber"]},

  // ═══════════════════════════════════════════════════════════════════
  // GEORGIA-PACIFIC
  // ═══════════════════════════════════════════════════════════════════
  {id:16, name:"Georgia-Pacific — Gurdon", state:"AR", city:"Gurdon", lat:33.921, lng:-93.154, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:17, name:"Georgia-Pacific — Fordyce", state:"AR", city:"Fordyce", lat:33.814, lng:-92.413, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Pine Pulp"]},
  {id:18, name:"Georgia-Pacific — Crossett", state:"AR", city:"Crossett", lat:33.131, lng:-91.961, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:19, name:"Georgia-Pacific — Monticello", state:"MS", city:"Monticello", lat:31.553, lng:-90.108, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:20, name:"Georgia-Pacific — Dudley", state:"NC", city:"Dudley", lat:35.277, lng:-78.035, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Pine Sawtimber","Pine Plywood Logs"]},
  {id:21, name:"Georgia-Pacific — Clarendon", state:"NC", city:"Clarendon", lat:34.175, lng:-78.203, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:22, name:"Georgia-Pacific — Skippers", state:"VA", city:"Skippers", lat:36.551, lng:-77.570, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Pine Sawtimber","Pine Plywood Logs"]},
  {id:23, name:"Georgia-Pacific — Cedar Springs", state:"GA", city:"Cedar Springs", lat:31.175, lng:-84.728, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Pine Sawtimber","Pine Plywood Logs","Softwood Pulp"]},
  {id:24, name:"Georgia-Pacific — Madison", state:"GA", city:"Madison", lat:33.596, lng:-83.467, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:25, name:"Georgia-Pacific — Palatka", state:"FL", city:"Palatka", lat:29.649, lng:-81.637, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp"]},
  {id:26, name:"Georgia-Pacific — Warrenton", state:"GA", city:"Warrenton", lat:33.407, lng:-82.662, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:27, name:"Georgia-Pacific — Brewton", state:"AL", city:"Brewton", lat:31.105, lng:-87.072, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Pine Sawtimber","Pine Plywood Logs"]},
  {id:28, name:"Georgia-Pacific — Taylorsville", state:"MS", city:"Taylorsville", lat:31.828, lng:-89.429, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // INTERNATIONAL PAPER
  // ═══════════════════════════════════════════════════════════════════
  {id:29, name:"International Paper — Georgetown", state:"SC", city:"Georgetown", lat:33.370, lng:-79.295, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:30, name:"International Paper — Eastover", state:"SC", city:"Eastover", lat:33.878, lng:-80.690, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:31, name:"International Paper — Augusta", state:"GA", city:"Augusta", lat:33.474, lng:-81.975, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:32, name:"International Paper — Savannah", state:"GA", city:"Savannah", lat:32.084, lng:-81.100, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:33, name:"International Paper — Cantonment", state:"FL", city:"Cantonment", lat:30.609, lng:-87.340, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:34, name:"International Paper — Selma", state:"AL", city:"Selma", lat:32.407, lng:-87.021, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Hardwood Pulp"]},
  {id:35, name:"International Paper — Prattville", state:"AL", city:"Prattville", lat:32.464, lng:-86.460, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp"]},
  {id:36, name:"International Paper — Ticonderoga", state:"NY", city:"Ticonderoga", lat:43.849, lng:-73.435, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:37, name:"International Paper — Valliant", state:"OK", city:"Valliant", lat:33.993, lng:-95.088, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:38, name:"International Paper — Texarkana", state:"TX", city:"Texarkana", lat:33.442, lng:-94.048, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp"]},
  {id:39, name:"International Paper — Mansfield", state:"LA", city:"Mansfield", lat:32.038, lng:-93.700, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:40, name:"International Paper — Vicksburg", state:"MS", city:"Vicksburg", lat:32.353, lng:-90.878, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Hardwood Pulp"]},
  {id:41, name:"International Paper — Riegelwood", state:"NC", city:"Riegelwood", lat:34.327, lng:-78.249, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // POTLATCHDELTIC
  // ═══════════════════════════════════════════════════════════════════
  {id:42, name:"PotlatchDeltic — Lewiston", state:"ID", city:"Lewiston", lat:46.416, lng:-117.018, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber","Softwood Pulp"]},
  {id:43, name:"PotlatchDeltic — St. Maries", state:"ID", city:"St. Maries", lat:47.315, lng:-116.567, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber","Cedar Sawtimber"]},
  {id:44, name:"PotlatchDeltic — Waldo", state:"AR", city:"Waldo", lat:33.351, lng:-93.296, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:45, name:"PotlatchDeltic — Warren", state:"AR", city:"Warren", lat:33.612, lng:-92.064, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Chip-n-Saw","Softwood Pulp"]},
  {id:46, name:"PotlatchDeltic — Prescott", state:"AR", city:"Prescott", lat:33.802, lng:-93.381, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Chip-n-Saw"]},
  {id:47, name:"PotlatchDeltic — Ola", state:"AR", city:"Ola", lat:35.033, lng:-93.224, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // WEST FRASER
  // ═══════════════════════════════════════════════════════════════════
  {id:48, name:"West Fraser — Opelika", state:"AL", city:"Opelika", lat:32.645, lng:-85.378, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:49, name:"West Fraser — Huttig", state:"AR", city:"Huttig", lat:33.045, lng:-92.182, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:50, name:"West Fraser — Leola", state:"AR", city:"Leola", lat:34.172, lng:-92.587, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:51, name:"West Fraser — Joyce", state:"LA", city:"Joyce", lat:30.191, lng:-89.959, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:52, name:"West Fraser — Henderson", state:"TX", city:"Henderson", lat:32.153, lng:-94.799, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:53, name:"West Fraser — Newberry", state:"SC", city:"Newberry", lat:34.274, lng:-81.619, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // CANFOR (SOUTHERN)
  // ═══════════════════════════════════════════════════════════════════
  {id:54, name:"Canfor — El Dorado", state:"AR", city:"El Dorado", lat:33.208, lng:-92.666, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:55, name:"Canfor — Urbana", state:"AR", city:"Urbana", lat:33.167, lng:-92.767, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:56, name:"Canfor — DeQueen", state:"AR", city:"DeQueen", lat:34.038, lng:-94.341, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:57, name:"Canfor — Mobile", state:"AL", city:"Mobile", lat:30.694, lng:-88.043, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:58, name:"Canfor — Graham", state:"NC", city:"Graham", lat:36.069, lng:-79.402, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // ENVIVA (PELLET MILLS)
  // ═══════════════════════════════════════════════════════════════════
  {id:59, name:"Enviva — Ahoskie", state:"NC", city:"Ahoskie", lat:36.287, lng:-76.985, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:60, name:"Enviva — Northampton", state:"NC", city:"Garysburg", lat:36.433, lng:-77.568, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:61, name:"Enviva — Hamlet", state:"NC", city:"Hamlet", lat:34.884, lng:-79.693, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:62, name:"Enviva — Southampton", state:"VA", city:"Franklin", lat:36.677, lng:-76.922, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:63, name:"Enviva — Cottondale", state:"FL", city:"Cottondale", lat:30.790, lng:-85.380, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:64, name:"Enviva — Amory", state:"MS", city:"Amory", lat:33.984, lng:-88.488, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:65, name:"Enviva — Lucedale", state:"MS", city:"Lucedale", lat:30.923, lng:-88.590, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:66, name:"Enviva — Waycross", state:"GA", city:"Waycross", lat:31.214, lng:-82.356, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp"]},
  {id:67, name:"Enviva — Greenwood", state:"SC", city:"Greenwood", lat:34.195, lng:-82.162, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:68, name:"Enviva — Epes", state:"AL", city:"Epes", lat:32.687, lng:-88.124, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // BOISE CASCADE
  // ═══════════════════════════════════════════════════════════════════
  {id:69, name:"Boise Cascade — Florien", state:"LA", city:"Florien", lat:31.434, lng:-93.479, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Pine Sawtimber","Pine Plywood Logs"]},
  {id:70, name:"Boise Cascade — Oakdale", state:"LA", city:"Oakdale", lat:30.817, lng:-92.660, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Pine Sawtimber","Pine Plywood Logs"]},
  {id:71, name:"Boise Cascade — Chester", state:"SC", city:"Chester", lat:34.705, lng:-81.180, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Pine Sawtimber","Pine Plywood Logs"]},
  {id:72, name:"Boise Cascade — Elgin", state:"OR", city:"Elgin", lat:45.564, lng:-117.918, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Pine Sawtimber"]},
  {id:73, name:"Boise Cascade — Emmett", state:"ID", city:"Emmett", lat:43.873, lng:-116.499, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber"]},

  // ═══════════════════════════════════════════════════════════════════
  // LOUISIANA-PACIFIC (LP)
  // ═══════════════════════════════════════════════════════════════════
  {id:74, name:"Louisiana-Pacific — Sagola", state:"MI", city:"Sagola", lat:46.088, lng:-88.077, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Aspen","Softwood Pulp","Hardwood Pulp"]},
  {id:75, name:"Louisiana-Pacific — Hanceville", state:"AL", city:"Hanceville", lat:34.062, lng:-86.766, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Pine Sawtimber","Softwood Pulp","Hardwood Pulp"]},
  {id:76, name:"Louisiana-Pacific — Clarke County", state:"AL", city:"Thomasville", lat:31.754, lng:-87.736, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Pine Pulp","Softwood Pulp"]},
  {id:77, name:"Louisiana-Pacific — Houlton", state:"ME", city:"Houlton", lat:46.127, lng:-67.843, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Aspen","Spruce Sawtimber","Softwood Pulp"]},
  {id:78, name:"Louisiana-Pacific — Dawson Creek", state:"TX", city:"Jasper", lat:30.920, lng:-93.997, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Pine Pulp","Softwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // PACKAGING CORPORATION OF AMERICA (PCA)
  // ═══════════════════════════════════════════════════════════════════
  {id:79, name:"PCA — Counce", state:"TN", city:"Counce", lat:35.049, lng:-88.301, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Hardwood Pulp","Softwood Pulp"]},
  {id:80, name:"PCA — Valdosta", state:"GA", city:"Valdosta", lat:30.833, lng:-83.279, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Hardwood Pulp","Softwood Pulp"]},
  {id:81, name:"PCA — Tomahawk", state:"WI", city:"Tomahawk", lat:45.471, lng:-89.730, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp","Aspen"]},
  {id:82, name:"PCA — Filer City", state:"MI", city:"Filer City", lat:44.233, lng:-86.383, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // DOMTAR / PAPER EXCELLENCE
  // ═══════════════════════════════════════════════════════════════════
  {id:83, name:"Domtar — Ashdown", state:"AR", city:"Ashdown", lat:33.674, lng:-94.130, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:84, name:"Domtar — Bennettsville", state:"SC", city:"Bennettsville", lat:34.617, lng:-79.685, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:85, name:"Domtar — Marlboro", state:"SC", city:"Marlboro", lat:34.476, lng:-79.685, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp"]},
  {id:86, name:"Domtar — Plymouth", state:"NC", city:"Plymouth", lat:35.867, lng:-76.749, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:87, name:"Domtar — Johnsonburg", state:"PA", city:"Johnsonburg", lat:41.491, lng:-78.682, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp","Spruce Sawtimber"]},
  {id:88, name:"Domtar — Kingsport", state:"TN", city:"Kingsport", lat:36.548, lng:-82.562, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:89, name:"Domtar — Hawesville", state:"KY", city:"Hawesville", lat:37.901, lng:-86.753, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // RESOLUTE FOREST PRODUCTS
  // ═══════════════════════════════════════════════════════════════════
  {id:90, name:"Resolute — Calhoun", state:"TN", city:"Calhoun", lat:35.302, lng:-84.753, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:91, name:"Resolute — Catawba", state:"SC", city:"Catawba", lat:34.852, lng:-80.907, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:92, name:"Resolute — Augusta", state:"GA", city:"Augusta", lat:33.474, lng:-82.010, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // SAPPI
  // ═══════════════════════════════════════════════════════════════════
  {id:93, name:"Sappi NA — Cloquet", state:"MN", city:"Cloquet", lat:46.722, lng:-92.461, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Sawtimber","Softwood Pulp","Hardwood Pulp","Aspen","Birch"]},
  {id:94, name:"Sappi NA — Skowhegan", state:"ME", city:"Skowhegan", lat:44.765, lng:-69.719, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp","Spruce Sawtimber","Fir Sawtimber"]},
  {id:95, name:"Sappi NA — Westbrook", state:"ME", city:"Westbrook", lat:43.677, lng:-70.371, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // STORA ENSO (US operations)
  // ═══════════════════════════════════════════════════════════════════
  {id:96, name:"Stora Enso — Duluth", state:"MN", city:"Duluth", lat:46.787, lng:-92.100, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Sawtimber","Softwood Pulp","Hardwood Pulp","Aspen"]},
  {id:97, name:"Stora Enso — Wisconsin Rapids", state:"WI", city:"Wisconsin Rapids", lat:44.384, lng:-89.817, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp","Aspen"]},
  {id:98, name:"Stora Enso — Stevens Point", state:"WI", city:"Stevens Point", lat:44.524, lng:-89.574, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // GRAPHIC PACKAGING
  // ═══════════════════════════════════════════════════════════════════
  {id:99, name:"Graphic Packaging — Macon", state:"GA", city:"Macon", lat:32.841, lng:-83.632, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:100, name:"Graphic Packaging — West Monroe", state:"LA", city:"West Monroe", lat:32.519, lng:-92.147, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:101, name:"Graphic Packaging — Texarkana", state:"TX", city:"Texarkana", lat:33.442, lng:-94.048, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp"]},
  {id:102, name:"Graphic Packaging — Kalamazoo", state:"MI", city:"Kalamazoo", lat:42.292, lng:-85.587, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // WESTROCK (now Smurfit WestRock)
  // ═══════════════════════════════════════════════════════════════════
  {id:103, name:"WestRock — Covington", state:"VA", city:"Covington", lat:37.794, lng:-79.994, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:104, name:"WestRock — Mahrt Mill", state:"AL", city:"Cottonton", lat:32.101, lng:-85.063, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:105, name:"WestRock — Florence", state:"SC", city:"Florence", lat:34.196, lng:-79.763, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:106, name:"WestRock — Stevenson", state:"AL", city:"Stevenson", lat:34.869, lng:-85.840, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:107, name:"WestRock — Longview", state:"WA", city:"Longview", lat:46.138, lng:-122.938, verified:false, confidence:50, accepting:true, millType:"paper", species:["Douglas Fir Sawtimber","Softwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // SYLVAMO (formerly IP Printing Papers)
  // ═══════════════════════════════════════════════════════════════════
  {id:108, name:"Sylvamo — Eastover", state:"SC", city:"Eastover", lat:33.878, lng:-80.690, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:109, name:"Sylvamo — Ticonderoga", state:"NY", city:"Ticonderoga", lat:43.849, lng:-73.435, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp","Birch"]},

  // ═══════════════════════════════════════════════════════════════════
  // CLEARWATER PAPER
  // ═══════════════════════════════════════════════════════════════════
  {id:110, name:"Clearwater Paper — Lewiston", state:"ID", city:"Lewiston", lat:46.416, lng:-117.018, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:111, name:"Clearwater Paper — Augusta", state:"GA", city:"Augusta", lat:33.474, lng:-81.975, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // RAYONIER ADVANCED MATERIALS (RYAM)
  // ═══════════════════════════════════════════════════════════════════
  {id:112, name:"Rayonier AM — Jesup", state:"GA", city:"Jesup", lat:31.598, lng:-81.885, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:113, name:"Rayonier AM — Fernandina Beach", state:"FL", city:"Fernandina Beach", lat:30.670, lng:-81.463, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // MERCER INTERNATIONAL
  // ═══════════════════════════════════════════════════════════════════
  {id:114, name:"Mercer International — Celgar (US Sales)", state:"WA", city:"Spokane", lat:47.659, lng:-117.426, verified:false, confidence:50, accepting:true, millType:"pulp", species:["Softwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // DRAX (PELLET MILLS)
  // ═══════════════════════════════════════════════════════════════════
  {id:115, name:"Drax — Morehouse", state:"LA", city:"Bastrop", lat:32.777, lng:-91.911, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:116, name:"Drax — Amite", state:"MS", city:"Gloster", lat:31.226, lng:-91.023, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:117, name:"Drax — LaSalle", state:"LA", city:"Urania", lat:31.859, lng:-92.295, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // KRUGER PRODUCTS
  // ═══════════════════════════════════════════════════════════════════
  {id:118, name:"Kruger Products — Memphis", state:"TN", city:"Memphis", lat:35.150, lng:-90.049, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // REGIONAL MILLS — PACIFIC NORTHWEST (WA, OR)
  // ═══════════════════════════════════════════════════════════════════
  {id:119, name:"Sierra Pacific Industries — Burlington", state:"WA", city:"Burlington", lat:48.476, lng:-122.325, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Hemlock Sawtimber","Cedar Sawtimber"]},
  {id:120, name:"Sierra Pacific Industries — Aberdeen", state:"WA", city:"Aberdeen", lat:46.975, lng:-123.816, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Hemlock Sawtimber"]},
  {id:121, name:"Interfor — Longview", state:"WA", city:"Longview", lat:46.138, lng:-122.938, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Hemlock Sawtimber"]},
  {id:122, name:"Interfor — Molalla", state:"OR", city:"Molalla", lat:45.147, lng:-122.576, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Hemlock Sawtimber"]},
  {id:123, name:"Stimson Lumber — Forest Grove", state:"OR", city:"Forest Grove", lat:45.519, lng:-123.110, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Hemlock Sawtimber"]},
  {id:124, name:"Swanson Group — Roseburg", state:"OR", city:"Roseburg", lat:43.217, lng:-123.342, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Softwood Pulp"]},
  {id:125, name:"Swanson Group — Springfield", state:"OR", city:"Springfield", lat:44.046, lng:-122.984, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Douglas Fir Sawtimber","Pine Plywood Logs"]},
  {id:126, name:"Roseburg Forest Products — Dillard", state:"OR", city:"Dillard", lat:42.974, lng:-123.383, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Softwood Pulp"]},
  {id:127, name:"Roseburg Forest Products — Riddle", state:"OR", city:"Riddle", lat:42.951, lng:-123.363, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Douglas Fir Sawtimber","Pine Plywood Logs"]},
  {id:128, name:"Murphy Company — Sutherlin", state:"OR", city:"Sutherlin", lat:43.388, lng:-123.313, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Douglas Fir Sawtimber","Pine Plywood Logs"]},
  {id:129, name:"Hampton Lumber — Willamina", state:"OR", city:"Willamina", lat:45.078, lng:-123.486, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Hemlock Sawtimber"]},
  {id:130, name:"Hampton Lumber — Darrington", state:"WA", city:"Darrington", lat:48.256, lng:-121.601, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Cedar Sawtimber"]},
  {id:131, name:"Hampton Lumber — Randle", state:"WA", city:"Randle", lat:46.528, lng:-121.953, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Hemlock Sawtimber"]},

  // ═══════════════════════════════════════════════════════════════════
  // REGIONAL MILLS — SOUTHEAST (GA, AL, MS, LA, TX, SC, NC, FL, VA, AR)
  // ═══════════════════════════════════════════════════════════════════
  {id:132, name:"Rex Lumber — Graceville", state:"FL", city:"Graceville", lat:30.956, lng:-85.517, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:133, name:"Rex Lumber — Bristol", state:"FL", city:"Bristol", lat:30.432, lng:-84.976, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:134, name:"Klausner Lumber — Live Oak", state:"FL", city:"Live Oak", lat:30.295, lng:-82.984, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:135, name:"Hood Industries — Beaumont", state:"MS", city:"Beaumont", lat:31.174, lng:-88.918, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:136, name:"Hood Industries — Wiggins", state:"MS", city:"Wiggins", lat:30.858, lng:-89.136, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:137, name:"Scotch Lumber — Fulton", state:"AL", city:"Fulton", lat:31.775, lng:-87.722, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:138, name:"Anthony Forest Products — Urbana", state:"AR", city:"Urbana", lat:33.167, lng:-92.767, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Chip-n-Saw"]},
  {id:139, name:"Tolko — Hemphill", state:"TX", city:"Hemphill", lat:31.338, lng:-93.846, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:140, name:"Hunt Forest Products — Pollock", state:"LA", city:"Pollock", lat:31.538, lng:-92.418, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp","Chip-n-Saw"]},
  {id:141, name:"Roy O. Martin — Chopin", state:"LA", city:"Chopin", lat:31.558, lng:-92.800, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Pine Sawtimber","Pine Plywood Logs"]},
  {id:142, name:"Roy O. Martin — Alexandria", state:"LA", city:"Alexandria", lat:31.311, lng:-92.446, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:143, name:"Interfor — Thomaston", state:"GA", city:"Thomaston", lat:32.888, lng:-84.327, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:144, name:"Interfor — Baxley", state:"GA", city:"Baxley", lat:31.777, lng:-82.349, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:145, name:"Interfor — Meldrim", state:"GA", city:"Meldrim", lat:32.097, lng:-81.369, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:146, name:"Interfor — Georgetown", state:"SC", city:"Georgetown", lat:33.370, lng:-79.295, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:147, name:"Interfor — Perry", state:"GA", city:"Perry", lat:32.458, lng:-83.732, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:148, name:"Canfor Southern Pine — Camden", state:"SC", city:"Camden", lat:34.247, lng:-80.607, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:149, name:"Norbord (West Fraser) — Cordele", state:"GA", city:"Cordele", lat:31.963, lng:-83.783, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:150, name:"Norbord (West Fraser) — Lanett", state:"AL", city:"Lanett", lat:32.869, lng:-85.184, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Pine Pulp","Softwood Pulp"]},
  {id:151, name:"Coastal Plywood — Havana", state:"FL", city:"Havana", lat:30.623, lng:-84.415, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Pine Sawtimber","Pine Plywood Logs"]},
  {id:152, name:"Klausner Lumber — Enfield", state:"NC", city:"Enfield", lat:36.181, lng:-77.667, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:153, name:"Evergreen Packaging — Canton", state:"NC", city:"Canton", lat:35.533, lng:-82.837, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:154, name:"Kapstone (WestRock) — Roanoke Rapids", state:"NC", city:"Roanoke Rapids", lat:36.462, lng:-77.654, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:155, name:"Blue Ridge Lumber — Fishersville", state:"VA", city:"Fishersville", lat:38.099, lng:-79.027, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Hardwood Sawtimber","Oak Hardwood","Maple Hardwood"]},

  // ═══════════════════════════════════════════════════════════════════
  // REGIONAL MILLS — NORTHEAST (ME, NH, VT, NY, PA)
  // ═══════════════════════════════════════════════════════════════════
  {id:156, name:"Verso — Jay", state:"ME", city:"Jay", lat:44.505, lng:-70.225, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp","Spruce Sawtimber"]},
  {id:157, name:"Verso — Bucksport", state:"ME", city:"Bucksport", lat:44.573, lng:-68.797, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:158, name:"Nine Dragons — Old Town", state:"ME", city:"Old Town", lat:44.934, lng:-68.645, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp","Spruce Sawtimber"]},
  {id:159, name:"Woodland Pulp — Baileyville", state:"ME", city:"Baileyville", lat:45.162, lng:-67.474, verified:false, confidence:50, accepting:true, millType:"pulp", species:["Softwood Pulp","Spruce Sawtimber","Fir Sawtimber"]},
  {id:160, name:"Pleasant River Lumber — Dover-Foxcroft", state:"ME", city:"Dover-Foxcroft", lat:45.180, lng:-69.227, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Spruce Sawtimber","Fir Sawtimber","Pine Sawtimber"]},
  {id:161, name:"Huber Engineered Woods — Easton", state:"ME", city:"Easton", lat:46.640, lng:-67.906, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Aspen","Spruce Sawtimber","Softwood Pulp"]},
  {id:162, name:"Irving Forest Products — Dixfield", state:"ME", city:"Dixfield", lat:44.535, lng:-70.458, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Spruce Sawtimber","Fir Sawtimber","Pine Sawtimber"]},
  {id:163, name:"Gorham Paper & Tissue — Gorham", state:"NH", city:"Gorham", lat:44.388, lng:-71.173, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:164, name:"Lyme Timber — Lyme", state:"NH", city:"Lyme", lat:43.811, lng:-72.154, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Spruce Sawtimber","Pine Sawtimber","Hardwood Sawtimber"]},
  {id:165, name:"Vermont Hardwood — Burlington", state:"VT", city:"Burlington", lat:44.476, lng:-73.212, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Maple Hardwood","Oak Hardwood","Birch","Hardwood Sawtimber"]},
  {id:166, name:"Finch Paper — Glens Falls", state:"NY", city:"Glens Falls", lat:43.310, lng:-73.644, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:167, name:"New England Wood Pellet — Jaffrey", state:"NH", city:"Jaffrey", lat:42.815, lng:-72.023, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Softwood Pulp","Hardwood Pulp","Spruce Sawtimber"]},
  {id:168, name:"Gutchess Lumber — Cortland", state:"NY", city:"Cortland", lat:42.601, lng:-76.180, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Maple Hardwood","Oak Hardwood","Cherry Hardwood","Hardwood Sawtimber"]},
  {id:169, name:"Wagner Lumber — Olean", state:"NY", city:"Olean", lat:42.077, lng:-78.430, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Maple Hardwood","Oak Hardwood","Cherry Hardwood","Hardwood Sawtimber"]},
  {id:170, name:"Barefoot Pellet — Troy", state:"PA", city:"Troy", lat:41.786, lng:-76.788, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // REGIONAL MILLS — UPPER MIDWEST (WI, MN, MI)
  // ═══════════════════════════════════════════════════════════════════
  {id:171, name:"Verso — Escanaba", state:"MI", city:"Escanaba", lat:45.745, lng:-87.064, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp","Aspen"]},
  {id:172, name:"Ahlstrom-Munksjo — Mosinee", state:"WI", city:"Mosinee", lat:44.793, lng:-89.703, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:173, name:"Domtar — Nekoosa", state:"WI", city:"Nekoosa", lat:44.314, lng:-89.907, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp","Aspen"]},
  {id:174, name:"Verso — Quinnesec", state:"MI", city:"Quinnesec", lat:45.807, lng:-87.986, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp","Aspen"]},
  {id:175, name:"Aditya Birla — Nymph", state:"MN", city:"Cloquet", lat:46.718, lng:-92.521, verified:false, confidence:50, accepting:true, millType:"pulp", species:["Softwood Pulp","Hardwood Pulp","Aspen"]},
  {id:176, name:"Flambeau River Papers — Park Falls", state:"WI", city:"Park Falls", lat:45.934, lng:-90.442, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:177, name:"Wausau Paper (Ahlstrom) — Rhinelander", state:"WI", city:"Rhinelander", lat:45.637, lng:-89.412, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:178, name:"Northstar Lumber — Hayward", state:"WI", city:"Hayward", lat:46.013, lng:-91.484, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Aspen","Birch","Hardwood Sawtimber"]},
  {id:179, name:"SAPPI — Muskegon", state:"MI", city:"Muskegon", lat:43.234, lng:-86.249, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:180, name:"Ainsworth (Norbord) — Barwick", state:"MN", city:"Bemidji", lat:47.474, lng:-94.880, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Aspen","Softwood Pulp","Hardwood Pulp"]},
  {id:181, name:"Huber Engineered Woods — Crystal Falls", state:"MI", city:"Crystal Falls", lat:46.098, lng:-88.334, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Aspen","Softwood Pulp"]},
  {id:182, name:"Resolute — Thunder Bay (US Fiber)", state:"MN", city:"International Falls", lat:48.601, lng:-93.411, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp","Aspen","Spruce Sawtimber"]},

  // ═══════════════════════════════════════════════════════════════════
  // REGIONAL MILLS — MOUNTAIN WEST (ID, MT)
  // ═══════════════════════════════════════════════════════════════════
  {id:183, name:"Idaho Forest Group — Grangeville", state:"ID", city:"Grangeville", lat:45.926, lng:-116.122, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber","Cedar Sawtimber"]},
  {id:184, name:"Idaho Forest Group — Laclede", state:"ID", city:"Laclede", lat:48.161, lng:-116.753, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber"]},
  {id:185, name:"Idaho Forest Group — Chilco", state:"ID", city:"Chilco", lat:47.906, lng:-116.790, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber","Cedar Sawtimber"]},
  {id:186, name:"Stimson Lumber — Bonner", state:"MT", city:"Bonner", lat:46.882, lng:-113.889, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber","Larch Sawtimber"]},
  {id:187, name:"Pyramid Mountain Lumber — Seeley Lake", state:"MT", city:"Seeley Lake", lat:47.177, lng:-113.484, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber","Larch Sawtimber"]},
  {id:188, name:"Sun Mountain Lumber — Deer Lodge", state:"MT", city:"Deer Lodge", lat:46.400, lng:-112.731, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber"]},
  {id:189, name:"F.H. Stoltze — Columbia Falls", state:"MT", city:"Columbia Falls", lat:48.367, lng:-114.187, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber","Larch Sawtimber","Cedar Sawtimber"]},
  {id:190, name:"Weyerhaeuser — Columbia Falls", state:"MT", city:"Columbia Falls", lat:48.367, lng:-114.187, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber"]},
  {id:191, name:"Riley Creek Lumber — Laclede", state:"ID", city:"Laclede", lat:48.161, lng:-116.753, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber","Cedar Sawtimber"]},

  // ═══════════════════════════════════════════════════════════════════
  // REGIONAL MILLS — CALIFORNIA
  // ═══════════════════════════════════════════════════════════════════
  {id:192, name:"Sierra Pacific Industries — Anderson", state:"CA", city:"Anderson", lat:40.449, lng:-122.298, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber","Softwood Pulp"]},
  {id:193, name:"Sierra Pacific Industries — Lincoln", state:"CA", city:"Lincoln", lat:38.892, lng:-121.293, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber"]},
  {id:194, name:"Sierra Pacific Industries — Chinese Camp", state:"CA", city:"Chinese Camp", lat:37.871, lng:-120.427, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber"]},
  {id:195, name:"Sierra Pacific Industries — Quincy", state:"CA", city:"Quincy", lat:39.937, lng:-120.947, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber"]},
  {id:196, name:"Collins Pine — Chester", state:"CA", city:"Chester", lat:40.306, lng:-121.231, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber"]},
  {id:197, name:"Roseburg Forest Products — Weed", state:"CA", city:"Weed", lat:41.423, lng:-122.387, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber","Softwood Pulp"]},
  {id:198, name:"Fruit Growers Supply — Hilt", state:"CA", city:"Hilt", lat:41.994, lng:-122.594, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber"]},

  // ═══════════════════════════════════════════════════════════════════
  // ADDITIONAL BIOMASS / CHIP MILLS
  // ═══════════════════════════════════════════════════════════════════
  {id:199, name:"Green Circle Bio Energy — Cottondale", state:"FL", city:"Cottondale", lat:30.790, lng:-85.380, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp"]},
  {id:200, name:"Highland Pellets — Pine Bluff", state:"AR", city:"Pine Bluff", lat:34.228, lng:-92.003, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:201, name:"Zilkha Biomass — Selma", state:"AL", city:"Selma", lat:32.407, lng:-87.021, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp"]},
  {id:202, name:"Fram Renewable Fuels — Hazlehurst", state:"GA", city:"Hazlehurst", lat:31.870, lng:-82.595, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:203, name:"Pinnacle Renewable Energy — Demopolis", state:"AL", city:"Demopolis", lat:32.518, lng:-87.836, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // ADDITIONAL SOUTHEAST SAWMILLS
  // ═══════════════════════════════════════════════════════════════════
  {id:204, name:"Hancock Lumber — Casco", state:"ME", city:"Casco", lat:43.951, lng:-70.521, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Spruce Sawtimber","Fir Sawtimber"]},
  {id:205, name:"Hancock Lumber — Pittsfield", state:"ME", city:"Pittsfield", lat:44.783, lng:-69.383, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Spruce Sawtimber"]},
  {id:206, name:"Seaboard International — Bucksport", state:"ME", city:"Bucksport", lat:44.573, lng:-68.797, verified:false, confidence:50, accepting:true, millType:"chip", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:207, name:"Robbins Lumber — Searsmont", state:"ME", city:"Searsmont", lat:44.362, lng:-69.197, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Spruce Sawtimber"]},
  {id:208, name:"Deltic Timber — Ola", state:"AR", city:"Ola", lat:35.033, lng:-93.224, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp","Chip-n-Saw"]},
  {id:209, name:"Suwannee Lumber — Cross City", state:"FL", city:"Cross City", lat:29.634, lng:-83.125, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:210, name:"Tolleson Lumber — Perry", state:"FL", city:"Perry", lat:30.117, lng:-83.582, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:211, name:"West Fraser — Whiteville", state:"NC", city:"Whiteville", lat:34.337, lng:-78.703, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:212, name:"Weyerhaeuser — Millport (OSB)", state:"AL", city:"Millport", lat:33.566, lng:-88.080, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:213, name:"Norbord (West Fraser) — Joanna", state:"SC", city:"Joanna", lat:34.408, lng:-81.820, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Pine Pulp","Softwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // ADDITIONAL HARDWOOD MILLS
  // ═══════════════════════════════════════════════════════════════════
  {id:214, name:"Allegheny Wood Products — Riverton", state:"WV", city:"Riverton", lat:38.746, lng:-79.452, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Oak Hardwood","Maple Hardwood","Cherry Hardwood","Hardwood Sawtimber"]},
  {id:215, name:"Baillie Lumber — Hamburg", state:"NY", city:"Hamburg", lat:42.716, lng:-78.830, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Oak Hardwood","Maple Hardwood","Cherry Hardwood","Hardwood Sawtimber"]},
  {id:216, name:"Northland Forest Products — Kingston", state:"NH", city:"Kingston", lat:42.934, lng:-71.066, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Maple Hardwood","Oak Hardwood","Birch"]},
  {id:217, name:"Columbia Forest Products — Old Fort", state:"NC", city:"Old Fort", lat:35.627, lng:-82.171, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Maple Hardwood","Birch","Hardwood Sawtimber"]},
  {id:218, name:"Columbia Forest Products — Chatham", state:"VA", city:"Chatham", lat:36.826, lng:-79.398, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Maple Hardwood","Oak Hardwood","Hardwood Sawtimber"]},
  {id:219, name:"Appalachian Hardwoods — Richwood", state:"WV", city:"Richwood", lat:38.224, lng:-80.533, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Oak Hardwood","Maple Hardwood","Cherry Hardwood","Poplar"]},
  {id:220, name:"Cole Hardwood — Logansport", state:"IN", city:"Logansport", lat:40.754, lng:-86.357, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Oak Hardwood","Maple Hardwood","Walnut","Hardwood Sawtimber"]},

  // ═══════════════════════════════════════════════════════════════════
  // ADDITIONAL TX, OK, KY, TN
  // ═══════════════════════════════════════════════════════════════════
  {id:221, name:"Lufkin Creosoting — Lufkin", state:"TX", city:"Lufkin", lat:31.338, lng:-94.729, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:222, name:"Temple-Inland (IP) — Diboll", state:"TX", city:"Diboll", lat:31.187, lng:-94.781, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp","Chip-n-Saw"]},
  {id:223, name:"Weyerhaeuser — Idabel", state:"OK", city:"Idabel", lat:33.896, lng:-94.826, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:224, name:"Resolute — Grenada", state:"MS", city:"Grenada", lat:33.769, lng:-89.809, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:225, name:"Domtar — Wickliffe", state:"KY", city:"Wickliffe", lat:36.965, lng:-89.088, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
];

export default SCRAPED_MILLS;
