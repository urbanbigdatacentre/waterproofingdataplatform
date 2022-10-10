import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import moment from "moment";
import colors from "../config/colors";

export default function DatePicker(props) {
  const [disabled, setDisabled] = useState(props.disabled);

  const { textStyle, defaultDate } = props;
  const [date, setDate] = useState(moment(defaultDate));
  const [show, setShow] = useState(false);
  const [auxDate, setAuxDate] = useState(moment());
  const [mode, setMode] = useState("date");
  const [time, setTime] = useState(moment(defaultDate));

  const validateTimeInput = (selectedDate) => {
    const hour = moment(selectedDate, "HH:mm").format("HH:mm");
    const day_month = moment(date, "DD-MM-YYYY").format("DD-MM-YYYY");
    const dateTime = moment(
      day_month + "T" + hour,
      "DD-MM-YYYYTHH:mm"
    ).toObject();
    var dateTime_event = new Date(
      dateTime.years,
      dateTime.months,
      dateTime.date,
      dateTime.hours,
      dateTime.minutes
    );
    var today = new Date();
    if (dateTime_event > today) {
      Alert.alert("Horário inválido", "Selecione um horário válido", [
        { text: "OK", onPress: () => renderDatePicker() },
      ]);
      return false;
    }
    return true;
  };

  const onChange = (e, selectedDate) => {
    setAuxDate(moment(selectedDate)); // variavel auxiliar para não alterar a data com a rolagem, apenas com o done
  };

  const androidOnChange = (e, selectedDate) => {
    setShow(false);

    if (selectedDate) {
      if (mode == "date") {
        setDate(moment(selectedDate));
        props.onDateChange(moment(selectedDate));
        if (props.onTimeChange) {
          setMode("time");
          setShow(true); // to show the picker again in time mode
        }
      } else {
        if (validateTimeInput(selectedDate)) {
          setTime(moment(selectedDate));
          props.onTimeChange(moment(selectedDate));
          setShow(false);
          setMode("date");
        } else {
          //setTime(moment());
          setShow(false);
          setMode("date");
        }
      }
    }
  };

  const onCancelPress = () => {
    setShow(false);
  };

  const onDonePress = () => {
    setShow(false);

    if (mode == "date") {
      setDate(moment(auxDate)); //atualizar a data com a variável auxiliar
      props.onDateChange(auxDate);
      if (props.onTimeChange) {
        setMode("time");
        setShow(true); // to show the picker again in time mode
      }
    } else {
      if (validateTimeInput(auxDate)) {
        setTime(moment(auxDate));
        props.onTimeChange(auxDate);
        setShow(false);
        setMode("date");
      } else {
        setTime(moment());
      }
    }
  };

  const renderDatePicker = () => {
    return (
      <DateTimePicker
        timeZoneOffsetInDays={-1}
        value={new Date(auxDate)}
        mode={mode}
        is24Hour={true}
        locale={"pt-br"}
        // minimumDate={props.minimumDate}
        maximumDate={new Date(moment())}
        formatChosenDate={(selectedDate) => {
          if (mode == "date") {
            return moment(selectedDate).format("DD/mm/YYYY");
          } else {
            return moment(selectedDate).format("HH:mm");
          }
        }} //formatar a data e hora do selected date
        display={Platform.OS === "ios" ? "spinner" : "default"}
        onChange={Platform.OS === "ios" ? onChange : androidOnChange}
      />
    );
  };

  return (
    <View flex={1}>
      <TouchableOpacity disabled={disabled} onPress={() => setShow(true)}>
        {props.children}
      </TouchableOpacity>
      {Platform.OS !== "ios" && show && renderDatePicker()}

      {Platform.OS === "ios" && show && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={show}
          supportedOrientations={["portrait"]}
          onRequestClose={() => setShow(false)}
        >
          <View style={{ flex: 1 }}>
            <TouchableHighlight
              style={{
                flex: 1,
                alignItems: "flex-end",
                flexDirection: "row",
              }}
              activeOpacity={1}
              visible={show}
              onPress={() => setShow(false)}
            >
              <TouchableHighlight
                underlayColor={"#ffffff"}
                style={{
                  flex: 1,
                  borderTopColor: "#d3d3d3",
                  borderTopWidth: 1,
                }}
              >
                <View
                  style={{
                    backgroundColor: "#ffffff",
                    height: 256,
                    overflow: "hidden",
                  }}
                >
                  <View style={{ marginTop: 20 }}>{renderDatePicker()}</View>
                  <TouchableHighlight
                    underlayColor={"transparent"}
                    onPress={() => onCancelPress()}
                    style={[styles.btnText, styles.btnCancel]}
                  >
                    <Text style={{ color: colors.primary }}>Cancelar</Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    underlayColor={"transparent"}
                    onPress={() => onDonePress()}
                    style={[styles.btnText, styles.btnDone]}
                  >
                    <Text style={{ color: colors.primary }}>Confirmar</Text>
                  </TouchableHighlight>
                </View>
              </TouchableHighlight>
            </TouchableHighlight>
          </View>
        </Modal>
      )}
    </View>
  );
}

DatePicker.defaultProps = {
  textStyle: {},
  defaultDate: moment(),
  onDateChange: () => {},
  onTimeChange: undefined,
  minimumDate: new Date(moment().subtract(1, "month")),
  flex: 0,
};

const styles = StyleSheet.create({
  btnCancel: {
    left: 0,
  },
  btnDone: {
    right: 0,
  },
  btnText: {
    position: "absolute",
    top: 0,
    height: 42,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
