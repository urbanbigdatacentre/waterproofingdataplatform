import React from "react";
import { useFormikContext } from "formik";

import Button from "../Button";
import {View} from "react-native";

function SubmitButton({ title, paddingHorizontal = 16 }) {
  const { handleSubmit } = useFormikContext();

  return (
  <View
    style={{paddingHorizontal: paddingHorizontal}}
  >
      <Button  title={title} onPress={handleSubmit} />
    </View>
  );
}

export default SubmitButton;
