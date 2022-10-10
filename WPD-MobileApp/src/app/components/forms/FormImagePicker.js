import React from "react";
import { useFormikContext } from "formik";

import ErrorMessage from "./ErrorMessage";
import ImageInputList from "../ImageInputList";
import { View, Alert } from "react-native";

function FormImagePicker({ name }) {
  const { errors, setFieldValue, touched, values } = useFormikContext();
  const imageUris = values[name];

  const handleAdd = (uri) => {
    if (imageUris.length === 0) {
      setFieldValue(name, [uri]);
    } else {
      createTwoButtonAlert(uri);
    }
  };

  const createTwoButtonAlert = (uri) =>
    Alert.alert(
      "Substituir imagem?",
      "É possível enviar apenas uma imagem",
      [
        {
          text: "Cancel",
       //   onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () =>  setFieldValue(name, [uri])}
      ],
      { cancelable: false }
    );


  const handleRemove = (uri) => {
    setFieldValue(
      name,
      imageUris.filter((imageUri) => imageUri !== uri)
    );
  };

  return (
    <View>
      <ImageInputList
        imageUris={imageUris}
        onAddImage={handleAdd}
        onRemoveImage={handleRemove}
      />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </View>
  );
}


export default FormImagePicker;
