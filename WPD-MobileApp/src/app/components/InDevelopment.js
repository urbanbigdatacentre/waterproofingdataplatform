import React from "react";
import { StyleSheet, View, Text, SafeAreaView } from "react-native";

import { FontAwesome5 } from "@expo/vector-icons";
import { dimensions } from "../config/dimensions";
import colors from "../config/colors";

function InDevelopment(props) {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <FontAwesome5 name="laptop-code" size={60} color="black" />
        <Text style={{ fontSize: dimensions.text.header, fontWeight: "bold" }}>
          Em construção...
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginTop: 20,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});

export default InDevelopment;
