import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useFormikContext } from "formik";
import colors from "../../config/colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import ErrorMessage from "./ErrorMessage";
import { dimensions } from "../../config/dimensions";
import CustomCheckBox from "../CustomCheckBox";

export default function CheckBox({ name, children, navigate, ...props }) {
  const { setFieldValue, errors, touched } = useFormikContext();
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  useEffect(() => {
    setFieldValue(name, toggleCheckBox, true);
  }, [toggleCheckBox]);

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <CustomCheckBox
          value={toggleCheckBox}
          onValueChange={(newValue) => setToggleCheckBox(newValue)}
          style={{marginRight: 12}}
        />

        <TouchableOpacity
          onPress={() => {
            setToggleCheckBox(!toggleCheckBox);
          }}
        >
          <Text
            style={{
              fontSize: dimensions.text.default,
              color: colors.medium,
            }}
          >Li e estou de acordo com os{" "}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigate()}>
        <Text
          style={{
            marginTop: 12,
            marginLeft: 35,
            color: colors.lightBlue,
            fontSize: dimensions.text.default,
          }}
        >Termos de uso e condições</Text>
      </TouchableOpacity>
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </View>
  );
};
