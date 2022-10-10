import React from 'react';
import { Pressable, StyleSheet, View, } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";

export default function CustomCheckBox({value, onValueChange, ...otherProps}) {
  const onCheckmarkPress = () => {
    onValueChange(!value);
  }

  return (
    <View style={otherProps.style}>
    <Pressable
      style={[styles.checkboxBase, value && styles.checkboxChecked]}
      onPress={onCheckmarkPress}>
      {value && <MaterialCommunityIcons name="check" size={15} color="white" />}
    </Pressable>
    </View>
  );
}


const styles = StyleSheet.create({
  checkboxBase: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },


});
