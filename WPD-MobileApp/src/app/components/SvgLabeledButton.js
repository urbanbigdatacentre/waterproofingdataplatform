import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
} from "react-native";
import colors from "../config/colors";
import { scaleDimsFromWidth } from "../config/dimensions";
import { Shadow } from "react-native-shadow-2";

export default function SvgLabeledButton({
  SvgImage,
  label,
  onPress,
  style = {},
  width = 95,
  height = 95,
  isToggle = false,
  normalBgcolor = colors.white,
  toggledBgColor = colors.toggle,
  active = true,
  inactiveOnPress = () => {},
}) {
  if(!active){
    normalBgcolor = colors.grayBG;
  }
  const dims = scaleDimsFromWidth(width, height, 16);
  return (
    <Shadow
      viewStyle={[{ width: 150, height: 150 }, style]}
      offset={[0, 3]}
      distance={3}
      radius={4}
      startColor="rgba(0, 0, 0, 0.15)"
      paintInside={true}
    >
      <TouchableNativeFeedback onPress={active ? onPress : inactiveOnPress}>
        <View
          style={[
            styles.container,
            {
              borderColor: active ? colors.primary : colors.gray,
              backgroundColor: active ? colors.primary : colors.gray,
            },
          ]}
        >
          <View
            style={[
              styles.innerContainer,
              {
                backgroundColor: isToggle ? toggledBgColor : normalBgcolor,
                borderColor: isToggle ? toggledBgColor : normalBgcolor,
              },
            ]}
          >
              <SvgImage {...dims} />

            <Text style={styles.label}>{label}</Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    </Shadow>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderWidth: 6,
    borderRadius: 6,
    width: 150,
    height: 150,
  },
  innerContainer: {
    overflow: "hidden",
    flex: 1,
    borderWidth: 6,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    paddingTop: 5,
    textAlign: "center",
    color: colors.primary,
    backgroundColor: "transparent",
    fontSize: 14,
    fontWeight: "bold",
  },
});
