import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import { dimensions } from "../config/dimensions";

export default function NoInternetConnectionScreen() {
  return (
    <View style={styles.containter}>
      <View style={styles.icon}>
        <MaterialCommunityIcons
          name="wifi-off"
          size={58}
          color={colors.primary}
          alignSelf="center"
        />
      </View>
      <Text style={styles.txtHeader}>Conecte-se à internet</Text>
      <Text style={styles.txtStyle}>
        Você está offline. Verifique sua conexão com a internet.
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
