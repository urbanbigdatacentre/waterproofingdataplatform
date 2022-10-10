import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import { dimensions } from "../config/dimensions";

export default function NoGPSError() {
  return (
    <View style={styles.containter}>
      <View style={styles.icon}>
        <MaterialCommunityIcons
          name="map-marker-outline"
          size={58}
          color={colors.primary}
          alignSelf="center"
        />
      </View>
      <Text style={styles.txtHeader}>Ops, algo deu errado...</Text>
      <Text style={styles.txtStyle}>
        Não foi possível definir a sua localização. Ative o GPS e tente novamente.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  containter: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
  icon:{
      alignSelf:"center",
  },
  txtHeader: {
    color: colors.primary,
    fontSize: dimensions.text.header,
    fontWeight: "bold",
    textAlign: "center",
    paddingBottom: 20,
  },
  txtStyle: {
    fontSize: dimensions.text.secondary,
    fontWeight: "bold",
    textAlign: "center",
  },
});
