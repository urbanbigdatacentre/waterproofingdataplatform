import React, { useState, useEffect } from "react";
import { useFormikContext } from "formik";

import TextInput from "../TextInput";
import ErrorMessage from "./ErrorMessage";
import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import colors from "../../config/colors";
import defaultStyles from "../../config/styles";

function IncreaseDecreaseButtons({ content }) {
  return (
    <View
      style={{
        ...defaultStyles.shadow,
        backgroundColor: colors.primary,
        width: 35,
        height: 48,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
      }}
    >
      <Text style={{ color: "white", fontSize: 24 }}>{content}</Text>
    </View>
  );
}

function RenderPluviometerInput({
  name,
  setFieldTouched,
  setFieldValue,
  otherProps,
  width,
  values,
}) {
  const [fieldVal, setFieldVal] = useState(values[name]);

  useEffect(() => {
    setFieldValue(name, fieldVal, true);
  }, [fieldVal]);

  const increase = () => {
    Number(fieldVal) + 1 <= 999 &&
      setFieldVal((Number(fieldVal) + 1).toString());
  };

  const decrease = () => {
    Number(fieldVal) - 1 >= 0 && setFieldVal((Number(fieldVal) - 1).toString());
  };

  return (
    <View
      style={{
        flexDirection: "row",
      }}
    >
      <View style={{ flex: 1, alignSelf: "stretch" }}>
        <TextInput
          height={38}
          onBlur={() => setFieldTouched(name)}
          onChangeText={(val) => {
            setFieldVal(val);
          }}
          value={fieldVal.toString()}
          {...otherProps}
        />
      </View>

      <TouchableOpacity
        onPress={() => {
          decrease();
        }}
        style={{
          paddingLeft: 4,
          paddingRight: 1.5,
        }}
      >
        <IncreaseDecreaseButtons content={"-"} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          increase();
        }}
        style={{
          paddingLeft: 1.5,
          paddingRight: 16,
        }}
      >
        <IncreaseDecreaseButtons content={"+"} />
      </TouchableOpacity>
    </View>
  );
}

function AppFormField({
  name,
  width,
  increaseDecreaseButtons = false,
  flex = 0,
  paddingLeft = 16,
  paddingRight = 16,
  numberOfLines = 1,
  ...otherProps
}) {
  const {
    values,
    setFieldTouched,
    setFieldValue,
    handleChange,
    errors,
    touched,
  } = useFormikContext();

  return (
    <View flex={flex}>
      <View
        style={{
          paddingLeft: paddingLeft,
          paddingRight: increaseDecreaseButtons ? 0 : paddingRight,
        }}
      >
        {name != "pluviometer" ? (
          <TextInput
            height={numberOfLines <= 1 ? 48 : 60}
            onBlur={() => setFieldTouched(name)}
            onChangeText={handleChange(name)}
            width={width}
            {...otherProps}
          />
        ) : (
          <RenderPluviometerInput
            name={name}
            setFieldTouched={setFieldTouched}
            setFieldValue={setFieldValue}
            otherProps={otherProps}
            width={width}
            values={values}
          />
        )}
      </View>

      <View style={{ paddingRight: paddingRight, paddingLeft: paddingLeft }}>
        <ErrorMessage error={errors[name]} visible={touched[name]} />
      </View>
    </View>
  );
}

export default AppFormField;
