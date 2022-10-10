import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import colors from "../../config/colors";
import { dimensions } from "../../config/dimensions";
import { EventLocationContext } from "../../context/EventLocationContext";

function FormLocationPicker({ subtitle }) {
  const context = useContext(EventLocationContext);
  const local = context.eventLocation.toString();

  return (
      <View style={styles.location}>

        <View style={styles.mapIcon}>
          <MaterialIcons
            name="location-on"
            size={20}
            color="white"
          />
        </View>

        <View style={styles.adressText}>
          <Text
            style={{
              fontSize: dimensions.text.default,
            }}
          >
            {local}
          </Text>
          <Text style={{ color: colors.primary}}>
            {subtitle ? subtitle : "Defina o local no mapa"}
          </Text>
        </View>

      </View>
  );
}

const styles = StyleSheet.create({
  location: {
    flexDirection: "row",
    alignContent: "space-around",
    justifyContent: "flex-start",
    marginTop: 24,
  },

  adressText: {
    height: "100%",
    paddingLeft: 16,
  },

  mapIcon: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
});

export default FormLocationPicker;
