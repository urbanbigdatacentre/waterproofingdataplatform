import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import { dimensions, screen_height } from "../config/dimensions";

export default function LoadingMarkersModal({ show }) {
  const [closed, setClosed] = useState(false);
  if (show && !closed) {
    return (
      // NOTE:
      // 267 = (tabBar height = 49) + (data menu btn height = 48) + (this modal = 170/2)
      <View style={[styles.container, { bottom: (screen_height - 267) / 2 }]}>
        <View
          style={{
            justifyContent: "flex-start",
            alignSelf: "flex-end",
          }}
        >
          <TouchableOpacity onPress={() => setClosed(true)}>
            <MaterialCommunityIcons
              name="close"
              size={20}
              color={colors.primary}
              alignItems="center"
            />
          </TouchableOpacity>
        </View>
        <MaterialCommunityIcons
          name="sync"
          size={48}
          color={colors.primary}
          style={{ alignSelf: "center", marginBottom: 12 }}
        />
        <Text style={styles.text}>
          Aguarde um momento enquanto os dados são carregados.
        </Text>
      </View>
    );
  } else {
    return <></>;
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "80%",
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
