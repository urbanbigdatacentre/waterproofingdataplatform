import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../../config/colors";

import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { dimensions, screen_height } from "../../config/dimensions";
import ConfirmationModal from "../ConfirmationModal";

function OnSubmitMessageModal({ show, setShow, sucess, navigation }){
const onModalClose = () =>{
    setShow(false);
    navigation.navigate("Home");
}
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
          <View style={{ flex: 0.85 }}>
            {sucess == false && (
              <View>
                <AntDesign
                  name="warning"
                  size={50}
                  color={colors.primary}
                  style={{ alignSelf: "center", marginBottom: 12 }}
                />
                <Text style={styles.text}>
                  Erro ao enviar informação. Por favor, tente mais tarde!
                </Text>
              </View>
            )}
            {sucess && (
              <View>
                <MaterialCommunityIcons
                  name="check-all"
                  size={50}
                  color={colors.primary}
                  style={{ alignSelf: "center", marginBottom: 12 }}
                />
                <Text style={styles.text}>Informação enviada com sucesso!</Text>
              </View>
            )}
          </View>
          <View style={{ flex: 0.15 }}>
            <Text style={styles.btn} onPress={()=> onModalClose()}>OK</Text>
          </View>
        </View>
      </Modal>
    );
  } else {
    return <></>;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    alignSelf: "center",
  },
  btn: {
    fontSize: dimensions.text.secondary,
    textAlign: "right",
    alignContent: "center",
    color: colors.primary,
    fontWeight: "bold",
  },
});

export default OnSubmitMessageModal;
