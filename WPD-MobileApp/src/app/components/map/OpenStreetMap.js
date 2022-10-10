import React, { useState, useEffect } from "react";
import { View, Linking } from "react-native";
import WebView from "react-native-webview";
import {
  setViewCode,
  handleEvent,
  insertMarker,
  deleteAllMarkers,
  insertPolygon,
} from "./LeafLetMap";
import MapModal from "../MapModal";
import html_content from "./Map.js";
import MapDataMenu from "../MapDataMenu";
import { MapMarkerList } from "../MapMarkerList";

function bindEventsToListeners(
  event,
  clickListener,
  setMarkerListener,
  moveEndListener
) {
  switch (event.object) {
    case "click":
      clickListener && clickListener(event.cords);
      break;
    case "marker":
      setMarkerListener(event.id);
      break;
    case "moveend":
      moveEndListener && moveEndListener(event.id);
      break;
    default:
      break;
  }
}

function notEmpy(lista) {
  return lista && [...lista].length > 0;
}

export default function OpenStreetMap({
  markers,
  clickListener,
  moveEndListener,
  dataOptionsToShow,
  setDataOptionsToShow,
  isForm = false,
}) {
  const [mapRef, setMapRef] = useState(null);
  const webviewContent = html_content;
  const [markerListener, setMarkerListener] = useState(null);

  const _location = global.location || global.defaultLocation
  const viewFunction = setViewCode(_location.lat, _location.long, _location.zoom);

  const markersList = MapMarkerList({
    markers: markers,
    renderOptions: dataOptionsToShow,
  });

  useEffect(() => {
    if (markersList && mapRef) {
      deleteAllMarkers(mapRef);

      notEmpy(markersList) &&
        markersList.forEach((val) => {
          if (val.name == "susceptibilityAreas") {
            insertPolygon(mapRef, val.ID, val.coordinate);
          } else {
            insertMarker(mapRef, val.ID, val.coordinate, val.image);
          }
        });
    }
  }, [markersList, dataOptionsToShow]);

  return (
    <View flex={1}>
      {webviewContent && (
        <WebView
          ref={(webViewRef) => {
            setMapRef(webViewRef);
          }}
          onMessage={(event) => {
            bindEventsToListeners(
              handleEvent(event),
              clickListener,
              setMarkerListener,
              moveEndListener
            );
          }}
          javaScriptEnabled={true}
          source={{ html: webviewContent }}
          injectedJavaScript={viewFunction}
          onShouldStartLoadWithRequest={(event) => {
            if (event.url.slice(0, 4) === "http") {
              Linking.openURL(event.url);
              return false;
            }
            return true;
          }}
        />
      )}
      {!isForm && (
        <View>
          <MapModal
            showModal={markerListener}
            setShowModal={setMarkerListener}
            markers={markers.markers}
          />

          <MapDataMenu
            dataOptionsToShow={dataOptionsToShow}
            setDataOptionsToShow={setDataOptionsToShow}
          />
        </View>
      )}
    </View>
  );
}
