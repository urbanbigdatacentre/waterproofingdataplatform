import React from "react";
import { View } from "react-native";

import colors from "../config/colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import FormDatePicker from "../components/forms/FormDatePicker";
import FormLocationPicker from "../components/forms/FormLocationPicker";

export default function PickEventDateLocation({
  setDate = () => {},
  date = undefined,
  setTime = () => {},
  time = undefined,
  navigation = () => {},
  location = true,
  ...props
}) {
  return (
    <View
      style={{
        flex: 1,
        paddingTop: 36,
        paddingHorizontal: 16,
        paddingBottom:24
      }}
    >
      {/* <View> */}
      <FormDatePicker
        textStyle={{
          borderColor: colors.gray,
          borderWidth: 3,
        }}
        defaultDate={new Date()}
        onDateChange={(value) => setDate(value)}
        date={date}
        onTimeChange={(value) => setTime(value)}
        time={time}
        {...props}
      />
      {/* </View> */}
      {location && (
        <TouchableOpacity onPress={() => navigation.navigate("FormMap")}>
          <FormLocationPicker />
        </TouchableOpacity>
      )}
    </View>
  );
}
