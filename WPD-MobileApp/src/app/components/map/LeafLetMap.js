import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";

const HTML_FILE_PATH = require(`./Map.html`);

const loadLocalAsset = async (asset) => {
  try {
    const [{ localUri }] = await Asset.loadAsync(asset);
    const fileString = await FileSystem.readAsStringAsync(localUri);

    return fileString;
  } catch (error) {
    console.warn(error);
  }
  return "asidaosid";
};

const loadHTMLFile = async () => {
  return loadLocalAsset(HTML_FILE_PATH);
};

function goToRegion(mapRef, position) {
  mapRef.injectJavaScript(`
    setCustomView(${position.lat}, ${position.long}, 16.5);`);
}

function setViewCode(lat, long, zoom = 16.5) {
  return `setCustomView(${lat}, ${long}, ${zoom});`;
}

const code_to_function = {
  1: clickCallback,
  2: markerCallback,
  3: moveEndCallback,
};

function clickCallback(payload) {
  return {
    object: "click",
    cords: payload.content,
  };
}

function markerCallback(payload) {
  return {
    object: "marker",
    id: payload.content,
  };
}

function moveEndCallback(payload) {
  return {
    object: "moveend",
    id: payload.content,
  };
}
function handleEvent(event) {
  const payload = JSON.parse(event.nativeEvent.data);
  return code_to_function[payload.code](payload);
}

function deleteAllMarkers(mapRef) {
  mapRef.injectJavaScript(`
  for (const [key, value] of Object.entries(markers)) {
    map.removeLayer(value);
  }
  markers = {};
  
  for (const [key, value] of Object.entries(polygons)) {
    map.removeLayer(value);
  }
  polygons = {};
  `);
}

async function insertMarker(mapRef, ID, coordinate, icon) {
  mapRef.injectJavaScript(`
  var customIcon = L.divIcon({
    className: 'marker-class',
    html: \`<body>${icon}</body>\`,
    iconAnchor: [30, 78],
  });
  // Check if there is no other marker with same ID already in map
  if (!(${ID} in markers)) {
    // Creates marker object
    markers[${ID}] = L.marker([${coordinate.latitude}, ${coordinate.longitude}], {icon: customIcon, ID: ${ID}});
    // Add marker to map and bind callback event to its function
    markers[${ID}].addTo(map).on('click', onPopupClick);
  }`);
}
async function insertPolygon(mapRef, ID, coordinate) {
  // console.log("COORDENADAS: "+JSON.stringify(coordinate));
  //  var coordinates = JSON.stringify(coordinate.coordinate);
  // console.log(coordinates);
  mapRef.injectJavaScript(`
  if (!(${ID} in polygons)) {
    polygons[${ID}] = L.polygon(${JSON.stringify(
    coordinate
  )}, { ID: ${ID}});     
    
    polygons[${ID}].addTo(map);
  }
  `);
}

export {
  loadHTMLFile,
  handleEvent,
  insertMarker,
  insertPolygon,
  goToRegion,
  setViewCode,
  deleteAllMarkers,
};
