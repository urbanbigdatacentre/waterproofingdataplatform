import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../../config/colors";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { dimensions, screen_height } from "../../config/dimensions";

const OnSubmitAwaitModal = ({ show }) => {
  if (show) {
    return (
      <Modal
        transparent={true}
        isVisible={show}
        style={{
          justifyContent: "flex-start",
          alignSelf: "flex-end",
        }}
      >
        <View style={[styles.container, { bottom: (screen_height - 267) / 2 }]}>
          <MaterialCommunityIcons
            name="sync"
            size={50}
            color={colors.primary}
            style={{ alignSelf: "center", marginBottom: 12 }}
          />
          <Text style={styles.text}>
            Aguarde um momento enquanto registramos o dado.
          </Text>
        </View>
      </Modal>
    );
  } else {
    return <></>;
  }
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "85%",
    height: 170,
    // justifyContent: "center",
    alignSelf: "center",
    backgroundColor: colors.lightestGray,
    borderColor: colors.primary,
    borderWidth: 2,
    borderRadius: 12,
    padding: 12,
  },
  text: {
    fontSize: dimensions.text.secondary,
    textAlign: "center",
    color: colors.black,
    fontWeight: "bold",
  },
});

export default OnSubmitAwaitModal;
