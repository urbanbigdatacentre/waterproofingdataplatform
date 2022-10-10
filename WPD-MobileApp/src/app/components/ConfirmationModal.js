import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../config/colors";
import { dimensions } from "../config/dimensions";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

function Btn({ label, onPress, bgColor, txtColor, style={} }) {
  return (
    <TouchableOpacity style={{marginTop: 15}} onPress={onPress}>
      <View
        style={[style, {
          paddingHorizontal: 40,
          paddingVertical: 7,
          backgroundColor: bgColor,
          borderRadius: 6,
        }]}
      >
        <Text style={{ color: txtColor, fontWeight: "bold", textTransform: "uppercase" }}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function ConfirmationModal({
  show,
  onConfirm,
  onDecline,
  confirmationLabel,
  declineLabel,
  title = null,
  description = "",
  icon = null,
  isNicknameConfirmation= false,
}) {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={show}
      supportedOrientations={["portrait"]}
    >
      <TouchableOpacity onPress={onDecline}>
        <View
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
          }}
        >
          <View style={styles.container}>
            {title && (
              <View style={{ flex: 1, marginBottom: title !== "" ? 40 : 0 }}>
                <Text
                  style={[styles.text, { fontSize: dimensions.text.secondary }]}
                >
                  {title}
                </Text>
              </View>
            )}
            <View style={{ flexDirection: "row", alignItems: "center", width: "95%" }}>
              {icon && !isNicknameConfirmation && (
                <View style={{ marginRight: 12 }}>
                  <Ionicons name={icon} size={30} color={colors.primary} />
                </View>
              )}
              {icon && isNicknameConfirmation && (
                <View style={{ marginRight: 12, justifyContent: "flex-start", alignSelf: "flex-start" }}>
                  <FontAwesome5 name={icon} size={20} color={colors.primary} />
                </View>
              )}
              <Text style={styles.text}>{description}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop: 24,
              }}
            > 
              {onDecline && declineLabel && (
                <Btn
                  style={{marginRight: 16}}
                  label={declineLabel}
                  onPress={onDecline}
                  bgColor={colors.secondary}
                  txtColor={colors.white}
                />
              )}
              {onConfirm && confirmationLabel && (
                <Btn
                  label={confirmationLabel}
                  onPress={onConfirm}
                  bgColor={colors.primary}
                  txtColor={colors.white}
                />
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "85%",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: colors.lightestGray,
    borderColor: colors.primary,
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
  },
  text: {
    fontSize: dimensions.text.default,
    textAlign: "left",
    fontWeight: "bold",
  },
});
