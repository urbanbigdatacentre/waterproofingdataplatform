import React, { useContext, useState } from "react";
import MapView from "react-native-maps";
import { StyleSheet, View, Text } from "react-native";

import colors from "../config/colors";
import { screen_width, screen_height } from "../config/dimensions";
import attachFocusToQuery from "../hooks/useFocus";
import { CurrentLocationContext } from "../context/CurrentLocationContext";
import { MapMarkerList } from "../components/MapMarkerList";

function DataScreen(props) {
  const location = useContext(CurrentLocationContext).currentCoordinates;

  const focusChanged = attachFocusToQuery();

  const default_location = {
    latitude: -12.901799,
    longitude: -51.692116,
    latitudeDelta: 70,
    longitudeDelta: 70 * (screen_width / screen_height),
  };

  const map_scale = 0.003;
  const lat_long_delta = {
    latitudeDelta: map_scale,
    longitudeDelta: map_scale * (screen_width / screen_height),
  };

  const [renderRain, setRenderRain] = useState(true);
  const [renderFlood, setRenderFlood] = useState(true);
  const [renderRiver, setRenderRiver] = useState(true);
  const [renderPluviometer, setRenderPluviometer] = useState(true);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.mapStyle}
        showsUserLocation={true}
        initialRegion={{ ...default_location }}
        region={{
          latitude: location["latitude"],
          longitude: location["longitude"],
          ...lat_long_delta,
        }}
      >
        <MapMarkerList
          reload={focusChanged}
          renderRain={renderRain}
          renderFlood={renderFlood}
          renderRiver={renderRiver}
          renderPluviometer={renderPluviometer}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.black,
    flex: 1,
  },
  mapStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default DataScreen;
