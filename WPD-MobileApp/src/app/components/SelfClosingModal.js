import React from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { screen_width } from "../config/dimensions";
import colors from "../config/colors";

export default function SelfClosingModal(props) {

  return (
    <View style={[styles.centeredView, props.style]}>
      <Modal
        animationType={props.animationType}
        transparent={props.transparent}
        visible={props.showModal != null}
      >
        <TouchableWithoutFeedback
          onPress={() => props.setShowModal(null)}
        >
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View style={styles.centeredView}>
          <View style={styles.modalView}>{props.children}</View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 22,
    marginBottom: 49,
  },
  modalView: {
    flexShrink: 1,
    margin: 20,
    width: screen_width,
    backgroundColor: colors.grayBG,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 0,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0)",
  },
});
