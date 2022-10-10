import React, { useState, useEffect } from "react";
import ErrorMessage from "./ErrorMessage";
import { useFormikContext } from "formik";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableNativeFeedback,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../config/colors";
import defaultStyles from "../../config/styles";

function PasswordFormField({
  name,
  flex = 0,
  paddingLeft = 16,
  paddingRight = 16,
  ...otherProps
}) {
  const { values, setFieldTouched, setFieldValue, errors, touched } = useFormikContext();
  const [hidePswd, setHidePswd] = useState(true);

  return (
    <View flex={flex} paddingLeft={paddingLeft} paddingRight={paddingRight}>
      <View style={styles.container}>
        <TextInput
          flex={1}
          onBlur={() => setFieldTouched(name)}
          onChangeText={(v) => setFieldValue(name, v, true)}
          value={values[name]?.toString()}
          style={defaultStyles.text}
          height={48}
          secureTextEntry={hidePswd}
          placeholderTextColor={colors.medium}
          {...otherProps}
        />

        <TouchableNativeFeedback onPress={() => setHidePswd(!hidePswd)}>
          <MaterialCommunityIcons
            name={hidePswd ? "eye-off" : "eye"}
            size={25}
            color={defaultStyles.colors.medium}
            style={styles.icon}
          />
        </TouchableNativeFeedback>
      </View>
      {/* <View style={{ paddingHorizontal: 2 }}> */}
      <ErrorMessage error={errors[name]} visible={touched[name]} />
      {/* </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...defaultStyles.shadow,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 6,
    borderColor: colors.grayBG,
    borderWidth: 1,
    padding: 5,
    paddingLeft: 10,
  },
  icon: {
    marginRight: 10,
    alignItems: "flex-end",
  },
});

export default PasswordFormField;
