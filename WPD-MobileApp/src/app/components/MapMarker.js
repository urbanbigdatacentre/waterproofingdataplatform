import React, { useState, useEffect } from "react";
import { View } from "react-native";
import MapModal from "./MapModal";

export default function MapMarker(markerListener, setMarkerListener, markers) {
  return (
    <View>
      <MapModal
        markerToRender={}
        setMarkerToRender={setIsModalVisible}
        markers={markers}
      />
    </View>
  );
}
