import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

import colors from "../../config/colors";
import { dimensions } from "../../config/dimensions";
import DatePicker from "../../components/DatePicker";

function EventsDatePicker(props) {
  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <View style={styles.dateIcon}>
        <MaterialCommunityIcons name="calendar-today" size={20} color="white" />
      </View>
      <View style={styles.dateInput}>
        <Text style={{ fontSize: dimensions.text.default }}>
          {" "}
          {props.date.format("DD/MM/YYYY")} {" | "} {props.time.format("HH:mm")}
        </Text>
        <View>
          <Text style={{ color: colors.primary }}>
            {props.subtitle ? props.subtitle : " Defina a data do evento"}
          </Text>
        </View>
      </View>
    </View>
  );
}

function PluvRegisterPicker(props) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
        <MaterialCommunityIcons name="calendar-today" size={30} color={colors.primary} />
      <View style={styles.dateInput}>
        <Text style={{ fontSize: dimensions.text.default }}>
          {props.date.format("DD/MM/YYYY")} {" | "} {props.time.format("HH:mm")}
        </Text>
      </View>
    </View>
  );
}

export default function FormDatePicker({ formTypeFace = "events", onDateChange, onTimeChange, children, ...props }) {
  const RenderFace = () => {
    if (children)
      return children
    else if (formTypeFace == "events")
      return EventsDatePicker(props)
    else
      return PluvRegisterPicker(props)
  }


  return (
    <View flex={1}>
      <DatePicker
        textStyle={{
          borderColor: colors.gray,
          borderWidth: 3,
        }}
        defaultDate={new Date()}
        onDateChange={onDateChange}
        onTimeChange={onTimeChange}
        {...props}
      >
        <RenderFace/>
      </DatePicker>
      </View>
  );
}

const styles = StyleSheet.create({
  dateInput: {
    paddingLeft: 12,
    flexDirection: "column",
    justifyContent: "center",
  },
  dateIcon: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
});
