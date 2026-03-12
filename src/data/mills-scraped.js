/**
 * Scraped / researched US timber & lumber mill data.
 * Sources: Company websites, state forestry commission databases, USDA Forest Service mill surveys,
 * AF&PA directories, Forisk consulting data, and public SEC filings.
 *
 * All mills set verified: false since these are compiled from public sources and not field-verified.
 * Coordinates adjusted to approximate industrial/mill facility locations (near highways, rail corridors, or rivers).
 */
const SCRAPED_MILLS = [
  // ═══════════════════════════════════════════════════════════════════
  // WEYERHAEUSER
  // ═══════════════════════════════════════════════════════════════════
  {id:1, name:"Weyerhaeuser — Marshfield", state:"WI", city:"Marshfield", lat:44.6588, lng:-90.1607, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Chip-n-Saw","Softwood Pulp","Hardwood Pulp"]},
  {id:2, name:"Weyerhaeuser — Millport", state:"AL", city:"Millport", lat:33.558, lng:-88.084, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:3, name:"Weyerhaeuser — Philadelphia", state:"MS", city:"Philadelphia", lat:32.771, lng:-89.116, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Pine Pulp","Chip-n-Saw"]},
  {id:4, name:"Weyerhaeuser — Bruce", state:"MS", city:"Bruce", lat:34.0136, lng:-89.3529, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:5, name:"Weyerhaeuser — Dierks", state:"AR", city:"Dierks", lat:34.119, lng:-94.017, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp","Chip-n-Saw"]},
  {id:6, name:"Weyerhaeuser — Hot Springs", state:"AR", city:"Hot Springs", lat:34.5153, lng:-93.0729, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:7, name:"Weyerhaeuser — Dodson", state:"LA", city:"Dodson", lat:32.061, lng:-92.662, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Pine Pulp"]},
  {id:8, name:"Weyerhaeuser — Longview", state:"WA", city:"Longview", lat:46.138, lng:-122.938, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Hemlock Sawtimber","Softwood Pulp"]},
  {id:9, name:"Weyerhaeuser — Raymond", state:"WA", city:"Raymond", lat:46.677, lng:-123.756, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Hemlock Sawtimber","Softwood Pulp"]},
  {id:10, name:"Weyerhaeuser — Cottage Grove", state:"OR", city:"Cottage Grove", lat:43.796, lng:-123.052, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Softwood Pulp"]},
  {id:11, name:"Weyerhaeuser — Springfield", state:"OR", city:"Springfield", lat:44.069, lng:-122.955, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Hemlock Sawtimber"]},
  {id:12, name:"Weyerhaeuser — Valliant", state:"OK", city:"Valliant", lat:33.993, lng:-95.087, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:13, name:"Weyerhaeuser — Emerson", state:"AR", city:"Emerson", lat:33.087, lng:-93.175, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:14, name:"Weyerhaeuser — Grayling", state:"MI", city:"Grayling", lat:44.638, lng:-84.663, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Aspen","Softwood Pulp","Hardwood Pulp"]},
  {id:15, name:"Weyerhaeuser — Elkin", state:"NC", city:"Elkin", lat:36.271, lng:-80.828, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Hardwood Sawtimber"]},

  // ═══════════════════════════════════════════════════════════════════
  // GEORGIA-PACIFIC
  // ═══════════════════════════════════════════════════════════════════
  {id:16, name:"Georgia-Pacific — Gurdon", state:"AR", city:"Gurdon", lat:33.922, lng:-93.159, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:17, name:"Georgia-Pacific — Fordyce", state:"AR", city:"Fordyce", lat:33.812, lng:-92.375, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Pine Pulp"]},
  {id:18, name:"Georgia-Pacific — Crossett", state:"AR", city:"Crossett", lat:33.141, lng:-91.96, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:19, name:"Georgia-Pacific — Monticello", state:"MS", city:"Monticello", lat:31.552, lng:-90.107, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:20, name:"Georgia-Pacific — Dudley", state:"NC", city:"Dudley", lat:35.272, lng:-78.031, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Pine Sawtimber","Pine Plywood Logs"]},
  {id:21, name:"Georgia-Pacific — Clarendon", state:"NC", city:"Clarendon", lat:33.745, lng:-80.11, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:22, name:"Georgia-Pacific — Skippers", state:"VA", city:"Skippers", lat:36.531, lng:-77.576, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Pine Sawtimber","Pine Plywood Logs"]},
  {id:23, name:"Georgia-Pacific — Cedar Springs", state:"GA", city:"Cedar Springs", lat:31.177, lng:-84.771, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Pine Sawtimber","Pine Plywood Logs","Softwood Pulp"]},
  {id:24, name:"Georgia-Pacific — Madison", state:"GA", city:"Madison", lat:33.596, lng:-83.443, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:25, name:"Georgia-Pacific — Palatka", state:"FL", city:"Palatka", lat:29.6818, lng:-81.67, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp"]},
  {id:26, name:"Georgia-Pacific — Warrenton", state:"GA", city:"Warrenton", lat:33.406, lng:-82.661, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:27, name:"Georgia-Pacific — Brewton", state:"AL", city:"Brewton", lat:31.097, lng:-87.066, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Pine Sawtimber","Pine Plywood Logs"]},
  {id:28, name:"Georgia-Pacific — Taylorsville", state:"MS", city:"Taylorsville", lat:31.828, lng:-89.427, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // INTERNATIONAL PAPER
  // ═══════════════════════════════════════════════════════════════════
  {id:29, name:"International Paper — Georgetown", state:"SC", city:"Georgetown", lat:33.362, lng:-79.287, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:30, name:"International Paper — Eastover", state:"SC", city:"Eastover", lat:33.877, lng:-80.689, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:31, name:"International Paper — Augusta", state:"GA", city:"Augusta", lat:33.3289, lng:-81.9533, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:32, name:"International Paper — Savannah", state:"GA", city:"Savannah", lat:32.092, lng:-81.086, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:33, name:"International Paper — Cantonment", state:"FL", city:"Cantonment", lat:30.618, lng:-87.319, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:34, name:"International Paper — Selma", state:"AL", city:"Selma", lat:32.387, lng:-87.053, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Hardwood Pulp"]},
  {id:35, name:"International Paper — Prattville", state:"AL", city:"Prattville", lat:32.431, lng:-86.453, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp"]},
  {id:36, name:"International Paper — Ticonderoga", state:"NY", city:"Ticonderoga", lat:43.837, lng:-73.395, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:37, name:"International Paper — Valliant", state:"OK", city:"Valliant", lat:33.992, lng:-95.081, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:38, name:"International Paper — Texarkana", state:"TX", city:"Texarkana", lat:33.306, lng:-94.174, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp"]},
  {id:39, name:"International Paper — Mansfield", state:"LA", city:"Mansfield", lat:32.041, lng:-93.728, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:40, name:"International Paper — Vicksburg", state:"MS", city:"Vicksburg", lat:32.396, lng:-90.899, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Hardwood Pulp"]},
  {id:41, name:"International Paper — Riegelwood", state:"NC", city:"Riegelwood", lat:34.337, lng:-78.227, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // POTLATCHDELTIC
  // ═══════════════════════════════════════════════════════════════════
  {id:42, name:"PotlatchDeltic — Lewiston", state:"ID", city:"Lewiston", lat:46.417, lng:-117.019, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber","Softwood Pulp"]},
  {id:43, name:"PotlatchDeltic — St. Maries", state:"ID", city:"St. Maries", lat:47.313, lng:-116.563, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber","Cedar Sawtimber"]},
  {id:44, name:"PotlatchDeltic — Waldo", state:"AR", city:"Waldo", lat:33.352, lng:-93.296, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:45, name:"PotlatchDeltic — Warren", state:"AR", city:"Warren", lat:33.61, lng:-92.064, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Chip-n-Saw","Softwood Pulp"]},
  {id:46, name:"PotlatchDeltic — Prescott", state:"AR", city:"Prescott", lat:33.802, lng:-93.381, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Chip-n-Saw"]},
  {id:47, name:"PotlatchDeltic — Ola", state:"AR", city:"Ola", lat:35.032, lng:-93.22, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // WEST FRASER
  // ═══════════════════════════════════════════════════════════════════
  {id:48, name:"West Fraser — Opelika", state:"AL", city:"Opelika", lat:32.651, lng:-85.399, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:49, name:"West Fraser — Huttig", state:"AR", city:"Huttig", lat:33.038, lng:-92.174, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:50, name:"West Fraser — Leola", state:"AR", city:"Leola", lat:34.165, lng:-92.572, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:51, name:"West Fraser — Joyce", state:"LA", city:"Joyce", lat:30.201, lng:-89.973, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:52, name:"West Fraser — Henderson", state:"TX", city:"Henderson", lat:32.161, lng:-94.811, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:53, name:"West Fraser — Newberry", state:"SC", city:"Newberry", lat:34.269, lng:-81.606, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // CANFOR (SOUTHERN)
  // ═══════════════════════════════════════════════════════════════════
  {id:54, name:"Canfor — El Dorado", state:"AR", city:"El Dorado", lat:33.214, lng:-92.652, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:55, name:"Canfor — Urbana", state:"AR", city:"Urbana", lat:33.161, lng:-92.758, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:56, name:"Canfor — DeQueen", state:"AR", city:"DeQueen", lat:34.042, lng:-94.351, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:57, name:"Canfor — Mobile", state:"AL", city:"Mobile", lat:30.688, lng:-88.056, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:58, name:"Canfor — Graham", state:"NC", city:"Graham", lat:36.071, lng:-79.415, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // ENVIVA (PELLET MILLS)
  // ═══════════════════════════════════════════════════════════════════
  {id:59, name:"Enviva — Ahoskie", state:"NC", city:"Ahoskie", lat:36.287, lng:-76.975, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:60, name:"Enviva — Northampton", state:"NC", city:"Garysburg", lat:36.433, lng:-77.569, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:61, name:"Enviva — Hamlet", state:"NC", city:"Hamlet", lat:34.859, lng:-79.721, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:62, name:"Enviva — Southampton", state:"VA", city:"Franklin", lat:36.679, lng:-76.951, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:63, name:"Enviva — Cottondale", state:"FL", city:"Cottondale", lat:30.793, lng:-85.379, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:64, name:"Enviva — Amory", state:"MS", city:"Amory", lat:33.983, lng:-88.473, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:65, name:"Enviva — Lucedale", state:"MS", city:"Lucedale", lat:30.92, lng:-88.59, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:66, name:"Enviva — Waycross", state:"GA", city:"Waycross", lat:31.231, lng:-82.354, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp"]},
  {id:67, name:"Enviva — Greenwood", state:"SC", city:"Greenwood", lat:34.178, lng:-82.148, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:68, name:"Enviva — Epes", state:"AL", city:"Epes", lat:32.687, lng:-88.105, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // BOISE CASCADE
  // ═══════════════════════════════════════════════════════════════════
  {id:69, name:"Boise Cascade — Florien", state:"LA", city:"Florien", lat:31.428, lng:-93.471, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Pine Sawtimber","Pine Plywood Logs"]},
  {id:70, name:"Boise Cascade — Oakdale", state:"LA", city:"Oakdale", lat:30.823, lng:-92.652, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Pine Sawtimber","Pine Plywood Logs"]},
  {id:71, name:"Boise Cascade — Chester", state:"SC", city:"Chester", lat:34.699, lng:-81.173, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Pine Sawtimber","Pine Plywood Logs"]},
  {id:72, name:"Boise Cascade — Elgin", state:"OR", city:"Elgin", lat:45.558, lng:-117.923, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Pine Sawtimber"]},
  {id:73, name:"Boise Cascade — Emmett", state:"ID", city:"Emmett", lat:43.865, lng:-116.507, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber"]},

  // ═══════════════════════════════════════════════════════════════════
  // LOUISIANA-PACIFIC (LP)
  // ═══════════════════════════════════════════════════════════════════
  {id:74, name:"Louisiana-Pacific — Sagola", state:"MI", city:"Sagola", lat:46.092, lng:-88.083, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Aspen","Softwood Pulp","Hardwood Pulp"]},
  {id:75, name:"Louisiana-Pacific — Hanceville", state:"AL", city:"Hanceville", lat:34.058, lng:-86.759, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Pine Sawtimber","Softwood Pulp","Hardwood Pulp"]},
  {id:76, name:"Louisiana-Pacific — Clarke County", state:"AL", city:"Thomasville", lat:31.744, lng:-87.728, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Pine Pulp","Softwood Pulp"]},
  {id:77, name:"Louisiana-Pacific — Houlton", state:"ME", city:"Houlton", lat:46.131, lng:-67.849, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Aspen","Spruce Sawtimber","Softwood Pulp"]},
  {id:78, name:"Louisiana-Pacific — Dawson Creek", state:"TX", city:"Jasper", lat:30.924, lng:-93.989, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Pine Pulp","Softwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // PACKAGING CORPORATION OF AMERICA (PCA)
  // ═══════════════════════════════════════════════════════════════════
  {id:79, name:"PCA — Counce", state:"TN", city:"Counce", lat:35.053, lng:-88.297, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Hardwood Pulp","Softwood Pulp"]},
  {id:80, name:"PCA — Valdosta", state:"GA", city:"Valdosta", lat:30.838, lng:-83.272, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Hardwood Pulp","Softwood Pulp"]},
  {id:81, name:"PCA — Tomahawk", state:"WI", city:"Tomahawk", lat:45.465, lng:-89.735, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp","Aspen"]},
  {id:82, name:"PCA — Filer City", state:"MI", city:"Filer City", lat:44.228, lng:-86.389, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // DOMTAR / PAPER EXCELLENCE
  // ═══════════════════════════════════════════════════════════════════
  {id:83, name:"Domtar — Ashdown", state:"AR", city:"Ashdown", lat:33.671, lng:-94.138, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:84, name:"Domtar — Bennettsville", state:"SC", city:"Bennettsville", lat:34.613, lng:-79.679, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:85, name:"Domtar — Marlboro", state:"SC", city:"Marlboro", lat:34.483, lng:-79.678, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp"]},
  {id:86, name:"Domtar — Plymouth", state:"NC", city:"Plymouth", lat:35.861, lng:-76.743, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:87, name:"Domtar — Johnsonburg", state:"PA", city:"Johnsonburg", lat:41.487, lng:-78.675, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp","Spruce Sawtimber"]},
  {id:88, name:"Domtar — Kingsport", state:"TN", city:"Kingsport", lat:36.543, lng:-82.552, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:89, name:"Domtar — Hawesville", state:"KY", city:"Hawesville", lat:37.894, lng:-86.747, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // RESOLUTE FOREST PRODUCTS
  // ═══════════════════════════════════════════════════════════════════
  {id:90, name:"Resolute — Calhoun", state:"TN", city:"Calhoun", lat:35.298, lng:-84.748, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:91, name:"Resolute — Catawba", state:"SC", city:"Catawba", lat:34.849, lng:-80.902, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:92, name:"Resolute — Augusta", state:"GA", city:"Augusta", lat:33.467, lng:-82.015, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // SAPPI
  // ═══════════════════════════════════════════════════════════════════
  {id:93, name:"Sappi NA — Cloquet", state:"MN", city:"Cloquet", lat:46.716, lng:-92.459, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Sawtimber","Softwood Pulp","Hardwood Pulp","Aspen","Birch"]},
  {id:94, name:"Sappi NA — Skowhegan", state:"ME", city:"Skowhegan", lat:44.738, lng:-69.677, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp","Spruce Sawtimber","Fir Sawtimber"]},
  {id:95, name:"Sappi NA — Westbrook", state:"ME", city:"Westbrook", lat:43.689, lng:-70.357, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // STORA ENSO (US operations)
  // ═══════════════════════════════════════════════════════════════════
  {id:96, name:"Stora Enso — Duluth", state:"MN", city:"Duluth", lat:46.729, lng:-92.152, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Sawtimber","Softwood Pulp","Hardwood Pulp","Aspen"]},
  {id:97, name:"Stora Enso — Wisconsin Rapids", state:"WI", city:"Wisconsin Rapids", lat:44.382, lng:-89.817, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp","Aspen"]},
  {id:98, name:"Stora Enso — Stevens Point", state:"WI", city:"Stevens Point", lat:44.503, lng:-89.543, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // GRAPHIC PACKAGING
  // ═══════════════════════════════════════════════════════════════════
  {id:99, name:"Graphic Packaging — Macon", state:"GA", city:"Macon", lat:32.834, lng:-83.625, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:100, name:"Graphic Packaging — West Monroe", state:"LA", city:"West Monroe", lat:32.513, lng:-92.141, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:101, name:"Graphic Packaging — Texarkana", state:"TX", city:"Texarkana", lat:33.438, lng:-94.054, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp"]},
  {id:102, name:"Graphic Packaging — Kalamazoo", state:"MI", city:"Kalamazoo", lat:42.287, lng:-85.581, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // WESTROCK (now Smurfit WestRock)
  // ═══════════════════════════════════════════════════════════════════
  {id:103, name:"WestRock — Covington", state:"VA", city:"Covington", lat:37.785, lng:-79.998, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:104, name:"WestRock — Mahrt Mill", state:"AL", city:"Cottonton", lat:32.098, lng:-85.058, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:105, name:"WestRock — Florence", state:"SC", city:"Florence", lat:34.191, lng:-79.758, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:106, name:"WestRock — Stevenson", state:"AL", city:"Stevenson", lat:34.863, lng:-85.835, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:107, name:"WestRock — Longview", state:"WA", city:"Longview", lat:46.132, lng:-122.943, verified:false, confidence:50, accepting:true, millType:"paper", species:["Douglas Fir Sawtimber","Softwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // SYLVAMO (formerly IP Printing Papers)
  // ═══════════════════════════════════════════════════════════════════
  {id:108, name:"Sylvamo — Eastover", state:"SC", city:"Eastover", lat:33.883, lng:-80.695, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:109, name:"Sylvamo — Ticonderoga", state:"NY", city:"Ticonderoga", lat:43.854, lng:-73.428, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp","Birch"]},

  // ═══════════════════════════════════════════════════════════════════
  // CLEARWATER PAPER
  // ═══════════════════════════════════════════════════════════════════
  {id:110, name:"Clearwater Paper — Lewiston", state:"ID", city:"Lewiston", lat:46.409, lng:-117.022, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:111, name:"Clearwater Paper — Augusta", state:"GA", city:"Augusta", lat:33.468, lng:-81.969, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // RAYONIER ADVANCED MATERIALS (RYAM)
  // ═══════════════════════════════════════════════════════════════════
  {id:112, name:"Rayonier AM — Jesup", state:"GA", city:"Jesup", lat:31.592, lng:-81.88, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:113, name:"Rayonier AM — Fernandina Beach", state:"FL", city:"Fernandina Beach", lat:30.664, lng:-81.457, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // MERCER INTERNATIONAL
  // ═══════════════════════════════════════════════════════════════════
  {id:114, name:"Mercer International — Celgar (US Sales)", state:"WA", city:"Spokane", lat:47.646, lng:-117.412, verified:false, confidence:50, accepting:true, millType:"pulp", species:["Softwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // DRAX (PELLET MILLS)
  // ═══════════════════════════════════════════════════════════════════
  {id:115, name:"Drax — Morehouse", state:"LA", city:"Bastrop", lat:32.771, lng:-91.905, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:116, name:"Drax — Amite", state:"MS", city:"Gloster", lat:31.22, lng:-91.017, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:117, name:"Drax — LaSalle", state:"LA", city:"Urania", lat:31.853, lng:-92.289, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // KRUGER PRODUCTS
  // ═══════════════════════════════════════════════════════════════════
  {id:118, name:"Kruger Products — Memphis", state:"TN", city:"Memphis", lat:35.144, lng:-90.043, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // REGIONAL MILLS — PACIFIC NORTHWEST (WA, OR)
  // ═══════════════════════════════════════════════════════════════════
  {id:119, name:"Sierra Pacific Industries — Burlington", state:"WA", city:"Burlington", lat:48.47, lng:-122.331, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Hemlock Sawtimber","Cedar Sawtimber"]},
  {id:120, name:"Sierra Pacific Industries — Aberdeen", state:"WA", city:"Aberdeen", lat:46.969, lng:-123.821, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Hemlock Sawtimber"]},
  {id:121, name:"Interfor — Longview", state:"WA", city:"Longview", lat:46.134, lng:-122.941, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Hemlock Sawtimber"]},
  {id:122, name:"Interfor — Molalla", state:"OR", city:"Molalla", lat:45.141, lng:-122.569, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Hemlock Sawtimber"]},
  {id:123, name:"Stimson Lumber — Forest Grove", state:"OR", city:"Forest Grove", lat:45.523, lng:-123.115, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Hemlock Sawtimber"]},
  {id:124, name:"Swanson Group — Roseburg", state:"OR", city:"Roseburg", lat:43.221, lng:-123.338, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Softwood Pulp"]},
  {id:125, name:"Swanson Group — Springfield", state:"OR", city:"Springfield", lat:44.051, lng:-122.978, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Douglas Fir Sawtimber","Pine Plywood Logs"]},
  {id:126, name:"Roseburg Forest Products — Dillard", state:"OR", city:"Dillard", lat:42.968, lng:-123.387, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Softwood Pulp"]},
  {id:127, name:"Roseburg Forest Products — Riddle", state:"OR", city:"Riddle", lat:42.945, lng:-123.357, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Douglas Fir Sawtimber","Pine Plywood Logs"]},
  {id:128, name:"Murphy Company — Sutherlin", state:"OR", city:"Sutherlin", lat:43.393, lng:-123.309, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Douglas Fir Sawtimber","Pine Plywood Logs"]},
  {id:129, name:"Hampton Lumber — Willamina", state:"OR", city:"Willamina", lat:45.083, lng:-123.491, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Hemlock Sawtimber"]},
  {id:130, name:"Hampton Lumber — Darrington", state:"WA", city:"Darrington", lat:48.251, lng:-121.596, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Cedar Sawtimber"]},
  {id:131, name:"Hampton Lumber — Randle", state:"WA", city:"Randle", lat:46.523, lng:-121.948, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Douglas Fir Sawtimber","Hemlock Sawtimber"]},

  // ═══════════════════════════════════════════════════════════════════
  // REGIONAL MILLS — SOUTHEAST (GA, AL, MS, LA, TX, SC, NC, FL, VA, AR)
  // ═══════════════════════════════════════════════════════════════════
  {id:132, name:"Rex Lumber — Graceville", state:"FL", city:"Graceville", lat:30.962, lng:-85.511, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:133, name:"Rex Lumber — Bristol", state:"FL", city:"Bristol", lat:30.426, lng:-84.97, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:134, name:"Klausner Lumber — Live Oak", state:"FL", city:"Live Oak", lat:30.301, lng:-82.978, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:135, name:"Hood Industries — Beaumont", state:"MS", city:"Beaumont", lat:31.179, lng:-88.913, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:136, name:"Hood Industries — Wiggins", state:"MS", city:"Wiggins", lat:30.853, lng:-89.13, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:137, name:"Scotch Lumber — Fulton", state:"AL", city:"Fulton", lat:31.769, lng:-87.716, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:138, name:"Anthony Forest Products — Urbana", state:"AR", city:"Urbana", lat:33.173, lng:-92.761, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Chip-n-Saw"]},
  {id:139, name:"Tolko — Hemphill", state:"TX", city:"Hemphill", lat:31.332, lng:-93.852, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:140, name:"Hunt Forest Products — Pollock", state:"LA", city:"Pollock", lat:31.532, lng:-92.412, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp","Chip-n-Saw"]},
  {id:141, name:"Roy O. Martin — Chopin", state:"LA", city:"Chopin", lat:31.552, lng:-92.794, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Pine Sawtimber","Pine Plywood Logs"]},
  {id:142, name:"Roy O. Martin — Alexandria", state:"LA", city:"Alexandria", lat:31.305, lng:-92.441, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:143, name:"Interfor — Thomaston", state:"GA", city:"Thomaston", lat:32.882, lng:-84.321, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:144, name:"Interfor — Baxley", state:"GA", city:"Baxley", lat:31.771, lng:-82.343, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:145, name:"Interfor — Meldrim", state:"GA", city:"Meldrim", lat:32.091, lng:-81.363, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:146, name:"Interfor — Georgetown", state:"SC", city:"Georgetown", lat:33.364, lng:-79.289, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:147, name:"Interfor — Perry", state:"GA", city:"Perry", lat:32.452, lng:-83.726, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:148, name:"Canfor Southern Pine — Camden", state:"SC", city:"Camden", lat:34.241, lng:-80.601, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:149, name:"Norbord (West Fraser) — Cordele", state:"GA", city:"Cordele", lat:31.957, lng:-83.777, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:150, name:"Norbord (West Fraser) — Lanett", state:"AL", city:"Lanett", lat:32.863, lng:-85.178, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Pine Pulp","Softwood Pulp"]},
  {id:151, name:"Coastal Plywood — Havana", state:"FL", city:"Havana", lat:30.610, lng:-84.428, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Pine Sawtimber","Pine Plywood Logs"]},
  {id:152, name:"Klausner Lumber — Enfield", state:"NC", city:"Enfield", lat:36.168, lng:-77.680, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:153, name:"Evergreen Packaging — Canton", state:"NC", city:"Canton", lat:35.520, lng:-82.850, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:154, name:"Kapstone (WestRock) — Roanoke Rapids", state:"NC", city:"Roanoke Rapids", lat:36.449, lng:-77.667, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:155, name:"Blue Ridge Lumber — Fishersville", state:"VA", city:"Fishersville", lat:38.086, lng:-79.040, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Hardwood Sawtimber","Oak Hardwood","Maple Hardwood"]},

  // ═══════════════════════════════════════════════════════════════════
  // REGIONAL MILLS — NORTHEAST (ME, NH, VT, NY, PA)
  // ═══════════════════════════════════════════════════════════════════
  {id:156, name:"Verso — Jay", state:"ME", city:"Jay", lat:44.509, lng:-70.219, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp","Spruce Sawtimber"]},
  {id:157, name:"Verso — Bucksport", state:"ME", city:"Bucksport", lat:44.567, lng:-68.791, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:158, name:"Nine Dragons — Old Town", state:"ME", city:"Old Town", lat:44.928, lng:-68.639, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp","Spruce Sawtimber"]},
  {id:159, name:"Woodland Pulp — Baileyville", state:"ME", city:"Baileyville", lat:45.156, lng:-67.468, verified:false, confidence:50, accepting:true, millType:"pulp", species:["Softwood Pulp","Spruce Sawtimber","Fir Sawtimber"]},
  {id:160, name:"Pleasant River Lumber — Dover-Foxcroft", state:"ME", city:"Dover-Foxcroft", lat:45.174, lng:-69.221, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Spruce Sawtimber","Fir Sawtimber","Pine Sawtimber"]},
  {id:161, name:"Huber Engineered Woods — Easton", state:"ME", city:"Easton", lat:46.634, lng:-67.9, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Aspen","Spruce Sawtimber","Softwood Pulp"]},
  {id:162, name:"Irving Forest Products — Dixfield", state:"ME", city:"Dixfield", lat:44.529, lng:-70.452, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Spruce Sawtimber","Fir Sawtimber","Pine Sawtimber"]},
  {id:163, name:"Gorham Paper & Tissue — Gorham", state:"NH", city:"Gorham", lat:44.392, lng:-71.167, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:164, name:"Lyme Timber — Lyme", state:"NH", city:"Lyme", lat:43.798, lng:-72.167, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Spruce Sawtimber","Pine Sawtimber","Hardwood Sawtimber"]},
  {id:165, name:"Vermont Hardwood — Burlington", state:"VT", city:"Burlington", lat:44.463, lng:-73.225, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Maple Hardwood","Oak Hardwood","Birch","Hardwood Sawtimber"]},
  {id:166, name:"Finch Paper — Glens Falls", state:"NY", city:"Glens Falls", lat:43.305, lng:-73.651, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:167, name:"New England Wood Pellet — Jaffrey", state:"NH", city:"Jaffrey", lat:42.802, lng:-72.036, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Softwood Pulp","Hardwood Pulp","Spruce Sawtimber"]},
  {id:168, name:"Gutchess Lumber — Cortland", state:"NY", city:"Cortland", lat:42.588, lng:-76.193, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Maple Hardwood","Oak Hardwood","Cherry Hardwood","Hardwood Sawtimber"]},
  {id:169, name:"Wagner Lumber — Olean", state:"NY", city:"Olean", lat:42.064, lng:-78.443, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Maple Hardwood","Oak Hardwood","Cherry Hardwood","Hardwood Sawtimber"]},
  {id:170, name:"Barefoot Pellet — Troy", state:"PA", city:"Troy", lat:41.773, lng:-76.801, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // REGIONAL MILLS — UPPER MIDWEST (WI, MN, MI)
  // ═══════════════════════════════════════════════════════════════════
  {id:171, name:"Verso — Escanaba", state:"MI", city:"Escanaba", lat:45.739, lng:-87.058, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp","Aspen"]},
  {id:172, name:"Ahlstrom-Munksjo — Mosinee", state:"WI", city:"Mosinee", lat:44.787, lng:-89.697, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:173, name:"Domtar — Nekoosa", state:"WI", city:"Nekoosa", lat:44.308, lng:-89.901, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp","Aspen"]},
  {id:174, name:"Verso — Quinnesec", state:"MI", city:"Quinnesec", lat:45.801, lng:-87.98, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp","Aspen"]},
  {id:175, name:"Aditya Birla — Nymph", state:"MN", city:"Cloquet", lat:46.712, lng:-92.515, verified:false, confidence:50, accepting:true, millType:"pulp", species:["Softwood Pulp","Hardwood Pulp","Aspen"]},
  {id:176, name:"Flambeau River Papers — Park Falls", state:"WI", city:"Park Falls", lat:45.928, lng:-90.436, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:177, name:"Wausau Paper (Ahlstrom) — Rhinelander", state:"WI", city:"Rhinelander", lat:45.631, lng:-89.406, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:178, name:"Northstar Lumber — Hayward", state:"WI", city:"Hayward", lat:46.000, lng:-91.497, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Aspen","Birch","Hardwood Sawtimber"]},
  {id:179, name:"SAPPI — Muskegon", state:"MI", city:"Muskegon", lat:43.228, lng:-86.243, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:180, name:"Ainsworth (Norbord) — Barwick", state:"MN", city:"Bemidji", lat:47.468, lng:-94.874, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Aspen","Softwood Pulp","Hardwood Pulp"]},
  {id:181, name:"Huber Engineered Woods — Crystal Falls", state:"MI", city:"Crystal Falls", lat:46.092, lng:-88.328, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Aspen","Softwood Pulp"]},
  {id:182, name:"Resolute — Thunder Bay (US Fiber)", state:"MN", city:"International Falls", lat:48.595, lng:-93.405, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp","Aspen","Spruce Sawtimber"]},

  // ═══════════════════════════════════════════════════════════════════
  // REGIONAL MILLS — MOUNTAIN WEST (ID, MT)
  // ═══════════════════════════════════════════════════════════════════
  {id:183, name:"Idaho Forest Group — Grangeville", state:"ID", city:"Grangeville", lat:45.932, lng:-116.128, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber","Cedar Sawtimber"]},
  {id:184, name:"Idaho Forest Group — Laclede", state:"ID", city:"Laclede", lat:48.155, lng:-116.747, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber"]},
  {id:185, name:"Idaho Forest Group — Chilco", state:"ID", city:"Chilco", lat:47.9, lng:-116.784, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber","Cedar Sawtimber"]},
  {id:186, name:"Stimson Lumber — Bonner", state:"MT", city:"Bonner", lat:46.876, lng:-113.883, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber","Larch Sawtimber"]},
  {id:187, name:"Pyramid Mountain Lumber — Seeley Lake", state:"MT", city:"Seeley Lake", lat:47.181, lng:-113.49, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber","Larch Sawtimber"]},
  {id:188, name:"Sun Mountain Lumber — Deer Lodge", state:"MT", city:"Deer Lodge", lat:46.394, lng:-112.725, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber"]},
  {id:189, name:"F.H. Stoltze — Columbia Falls", state:"MT", city:"Columbia Falls", lat:48.361, lng:-114.181, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber","Larch Sawtimber","Cedar Sawtimber"]},
  {id:190, name:"Weyerhaeuser — Columbia Falls", state:"MT", city:"Columbia Falls", lat:48.362, lng:-114.192, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber"]},
  {id:191, name:"Riley Creek Lumber — Laclede", state:"ID", city:"Laclede", lat:48.156, lng:-116.748, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber","Cedar Sawtimber"]},

  // ═══════════════════════════════════════════════════════════════════
  // REGIONAL MILLS — CALIFORNIA
  // ═══════════════════════════════════════════════════════════════════
  {id:192, name:"Sierra Pacific Industries — Anderson", state:"CA", city:"Anderson", lat:40.453, lng:-122.312, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber","Softwood Pulp"]},
  {id:193, name:"Sierra Pacific Industries — Lincoln", state:"CA", city:"Lincoln", lat:38.886, lng:-121.287, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber"]},
  {id:194, name:"Sierra Pacific Industries — Chinese Camp", state:"CA", city:"Chinese Camp", lat:37.865, lng:-120.421, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber"]},
  {id:195, name:"Sierra Pacific Industries — Quincy", state:"CA", city:"Quincy", lat:39.931, lng:-120.941, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber"]},
  {id:196, name:"Collins Pine — Chester", state:"CA", city:"Chester", lat:40.3, lng:-121.225, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber"]},
  {id:197, name:"Roseburg Forest Products — Weed", state:"CA", city:"Weed", lat:41.417, lng:-122.381, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber","Softwood Pulp"]},
  {id:198, name:"Fruit Growers Supply — Hilt", state:"CA", city:"Hilt", lat:41.988, lng:-122.588, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Fir Sawtimber"]},

  // ═══════════════════════════════════════════════════════════════════
  // ADDITIONAL BIOMASS / CHIP MILLS
  // ═══════════════════════════════════════════════════════════════════
  {id:199, name:"Green Circle Bio Energy — Cottondale", state:"FL", city:"Cottondale", lat:30.7870, lng:-85.3720, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp"]},
  {id:200, name:"Highland Pellets — Pine Bluff", state:"AR", city:"Pine Bluff", lat:34.215, lng:-92.016, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:201, name:"Zilkha Biomass — Selma", state:"AL", city:"Selma", lat:32.394, lng:-87.034, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp"]},
  {id:202, name:"Fram Renewable Fuels — Hazlehurst", state:"GA", city:"Hazlehurst", lat:31.857, lng:-82.608, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:203, name:"Pinnacle Renewable Energy — Demopolis", state:"AL", city:"Demopolis", lat:32.505, lng:-87.849, verified:false, confidence:50, accepting:true, millType:"pellet", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // ADDITIONAL SOUTHEAST SAWMILLS
  // ═══════════════════════════════════════════════════════════════════
  {id:204, name:"Hancock Lumber — Casco", state:"ME", city:"Casco", lat:43.938, lng:-70.534, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Spruce Sawtimber","Fir Sawtimber"]},
  {id:205, name:"Hancock Lumber — Pittsfield", state:"ME", city:"Pittsfield", lat:44.770, lng:-69.396, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Spruce Sawtimber"]},
  {id:206, name:"Seaboard International — Bucksport", state:"ME", city:"Bucksport", lat:44.586, lng:-68.784, verified:false, confidence:50, accepting:true, millType:"chip", species:["Softwood Pulp","Hardwood Pulp"]},
  {id:207, name:"Robbins Lumber — Searsmont", state:"ME", city:"Searsmont", lat:44.349, lng:-69.210, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Spruce Sawtimber"]},
  {id:208, name:"Deltic Timber — Ola", state:"AR", city:"Ola", lat:35.020, lng:-93.236, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp","Chip-n-Saw"]},
  {id:209, name:"Suwannee Lumber — Cross City", state:"FL", city:"Cross City", lat:29.621, lng:-83.138, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:210, name:"Tolleson Lumber — Perry", state:"FL", city:"Perry", lat:30.104, lng:-83.595, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:211, name:"West Fraser — Whiteville", state:"NC", city:"Whiteville", lat:34.324, lng:-78.716, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:212, name:"Weyerhaeuser — Millport (OSB)", state:"AL", city:"Millport", lat:33.5670, lng:-88.0905, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:213, name:"Norbord (West Fraser) — Joanna", state:"SC", city:"Joanna", lat:34.395, lng:-81.833, verified:false, confidence:50, accepting:true, millType:"OSB", species:["Pine Pulp","Softwood Pulp"]},

  // ═══════════════════════════════════════════════════════════════════
  // ADDITIONAL HARDWOOD MILLS
  // ═══════════════════════════════════════════════════════════════════
  {id:214, name:"Allegheny Wood Products — Riverton", state:"WV", city:"Riverton", lat:38.733, lng:-79.465, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Oak Hardwood","Maple Hardwood","Cherry Hardwood","Hardwood Sawtimber"]},
  {id:215, name:"Baillie Lumber — Hamburg", state:"NY", city:"Hamburg", lat:42.703, lng:-78.843, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Oak Hardwood","Maple Hardwood","Cherry Hardwood","Hardwood Sawtimber"]},
  {id:216, name:"Northland Forest Products — Kingston", state:"NH", city:"Kingston", lat:42.921, lng:-71.079, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Maple Hardwood","Oak Hardwood","Birch"]},
  {id:217, name:"Columbia Forest Products — Old Fort", state:"NC", city:"Old Fort", lat:35.614, lng:-82.184, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Maple Hardwood","Birch","Hardwood Sawtimber"]},
  {id:218, name:"Columbia Forest Products — Chatham", state:"VA", city:"Chatham", lat:36.813, lng:-79.411, verified:false, confidence:50, accepting:true, millType:"plywood", species:["Maple Hardwood","Oak Hardwood","Hardwood Sawtimber"]},
  {id:219, name:"Appalachian Hardwoods — Richwood", state:"WV", city:"Richwood", lat:38.211, lng:-80.546, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Oak Hardwood","Maple Hardwood","Cherry Hardwood","Poplar"]},
  {id:220, name:"Cole Hardwood — Logansport", state:"IN", city:"Logansport", lat:40.741, lng:-86.370, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Oak Hardwood","Maple Hardwood","Walnut","Hardwood Sawtimber"]},

  // ═══════════════════════════════════════════════════════════════════
  // ADDITIONAL TX, OK, KY, TN
  // ═══════════════════════════════════════════════════════════════════
  {id:221, name:"Lufkin Creosoting — Lufkin", state:"TX", city:"Lufkin", lat:31.325, lng:-94.742, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:222, name:"Temple-Inland (IP) — Diboll", state:"TX", city:"Diboll", lat:31.174, lng:-94.794, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp","Chip-n-Saw"]},
  {id:223, name:"Weyerhaeuser — Idabel", state:"OK", city:"Idabel", lat:33.883, lng:-94.839, verified:false, confidence:50, accepting:true, millType:"sawmill", species:["Pine Sawtimber","Softwood Pulp"]},
  {id:224, name:"Resolute — Grenada", state:"MS", city:"Grenada", lat:33.756, lng:-89.822, verified:false, confidence:50, accepting:true, millType:"paper", species:["Pine Pulp","Softwood Pulp","Hardwood Pulp"]},
  {id:225, name:"Domtar — Wickliffe", state:"KY", city:"Wickliffe", lat:36.952, lng:-89.101, verified:false, confidence:50, accepting:true, millType:"paper", species:["Softwood Pulp","Hardwood Pulp"]},
];

export default SCRAPED_MILLS;
