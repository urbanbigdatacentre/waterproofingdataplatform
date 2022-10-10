import React from "react";
import { useFormikContext } from "formik";
import { unMask, mask } from "react-native-mask-text";
import TextInput from "../TextInput";
import ErrorMessage from "./ErrorMessage";
import { View } from "react-native";

function PhoneNumberFormField({
  name,
  flex = 0,
  maxLength = 12,
  placeholder = "",
  paddingLeft = 16,
  paddingRight = 16,
  editable = true,
}) {
  const {
    values,
    setFieldTouched,
    setFieldValue,
    errors,
    touched,
  } = useFormikContext();

  var current_mask =
    values[name].length >= 11 ? "(99) 99999-9999" : "(99) 9999-9999";

  return (
    <View flex={flex}>
      <View
        style={{
          paddingLeft: paddingLeft,
          paddingRight: paddingRight,
        }}
      >
        <TextInput
          editable={editable}
          height={48}
          onBlur={() => setFieldTouched(name)}
          onChangeText={(val) => {
            const rawText = unMask(val, current_mask);
            setFieldValue(name, rawText.substr(0, maxLength));
          }}
          value={mask(values[name], current_mask)}
          placeholder={placeholder}
          keyboardType="numeric"
        />
      </View>

      <View style={{ paddingRight: paddingRight, paddingLeft: paddingLeft }}>
        <ErrorMessage error={errors[name]} visible={touched[name]} />
      </View>
    </View>
  );
}

export default PhoneNumberFormField;
