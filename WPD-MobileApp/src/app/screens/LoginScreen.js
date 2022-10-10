import React, { useState, useContext } from "react";
import { StyleSheet, View, Text } from "react-native";
import * as Yup from "yup";
import {
  Form,
  SubmitButton,
  FormField,
  ErrorMessage,
} from "../components/forms";
import Screen from "../components/Screen";
import colors from "../config/colors";
import { dimensions } from "../config/dimensions";

import { AuthContext } from "../auth/context";
import authStorage from "../auth/storage";
import assets from "../config/assets";
import Button from "../components/Button";
import { TouchableNativeFeedback } from "react-native-gesture-handler";
import { login, userPersonalData } from "../api/auth";
import PasswordFormField from "../components/forms/PasswordFormField";
import ConfirmationModal from "../components/ConfirmationModal";
import PhoneNumberFormField from "../components/forms/PhoneNumberFormField";

const phoneRegex = RegExp(
  /^\(?[\(]?([0-9]{2})?\)?[)\b]?([0-9]{4,5})[-. ]?([0-9]{4})$/
);

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .matches(phoneRegex, "Número inválido")
    .required("O número de telefone é obrigatório"),
  password: Yup.string()
    .required("A senha é obrigatória")
    .min(8, "Senha muito curta, minimo 8 caracteres")
    .matches(/[a-zA-Z]/, "A senha só pode conter letras"),
});

function DashedOrSeparator() {
  return (
    <View
      style={{
        flexDirection: "row",
        marginVertical: 20,
        alignItems: "center",
        paddingHorizontal: 14,
      }}
    >
      <View
        style={{
          flex: 1,
          height: 1,
          backgroundColor: colors.subText,
        }}
      ></View>

      <Text
        style={{
          marginHorizontal: 10,
          fontSize: 14,
          fontWeight: "bold",
          color: colors.subText,
        }}
      >
        OU
      </Text>

      <View
        style={{
          height: 1,
          flex: 1,
          backgroundColor: colors.subText,
        }}
      ></View>
    </View>
  );
}

export default function LoginScreen(props) {
  const authContext = useContext(AuthContext);
  const [showLog, setShowLog] = useState({ show: false, message: "" });

  const handleSubmit = async (name, password, setLoginFailed) => {
    const result = await login(name, password);

    switch (result.status) {
      case 404:
        setLoginFailed(true);
        return;
      case 400:
        setShowLog({
          show: true,
          message: "Um erro inesperado ocorreu. Tente novamente mais tarde",
        });
        return;
    }

    await authStorage.setToken(result.data);

    result.ok && setLoginFailed(false);
    const user = await userPersonalData();
    user.ok && authContext.setUser(user.data);
  };

  const [loginFailed, setLoginFailed] = useState(false);

  return (
    <Screen style={[styles.containter, { backgroundColor: colors.grayBG }]}>
      <ConfirmationModal
        show={showLog.show}
        description={showLog.message}
        confirmationLabel="OK"
        onConfirm={() => setShowLog({ ...showLog, show: false })}
      />
      <Form
        initialValues={{
          name: "",
          password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={({ name, password }) =>
          handleSubmit(name, password, setLoginFailed)
        }
      >
        <View paddingHorizontal={14}>
          <assets.AppLogoTitle
            preserveAspectRatio="xMidYMid meet"
            width={263}
            height={200}
            alignSelf="center"
            marginBottom={dimensions.spacing.big_padding}
          />

          <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
            <ErrorMessage
              error="Número de telefone ou senha inválidos"
              visible={loginFailed}
            />
          </View>

          <View style={{ paddingBottom: 24 }}>
            <PhoneNumberFormField
              name="name"
              maxLength={11}
              placeholder="(DDD) XXXXX-XXXX"
            />
          </View>

          <View style={{ paddingBottom: 24 }}>
            <PasswordFormField
              maxLength={20}
              name="password"
              placeholder="Senha"
            />
          </View>

          <SubmitButton title="entrar" backgroundColor={colors.primary} />

          <TouchableNativeFeedback
            onPress={() => {
              props.navigation.navigate("PasswordRecovery");
            }}
          >
            <View flexDirection="row" alignSelf="center">
              <Text style={{ color: colors.lightBlue, fontWeight: "bold", paddingVertical: 12}}>
                Esqueceu a senha?
              </Text>
            </View>
          </TouchableNativeFeedback>

          <DashedOrSeparator />

          <Button
            title="cadastrar-se"
            color={colors.green}
            style={{ paddingHorizontal: 16 }}
            onPress={() => {
              props.navigation.navigate("Register");
            }}
          />

          <TouchableNativeFeedback
            onPress={() => {
              authContext.setUser(true);
            }}
          >
            <View flexDirection="row" alignSelf="center" marginTop={16}>
              <Text style={{ color: colors.lightBlue, fontWeight: "bold" }}>
                Ou continue sem uma conta
              </Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      </Form>
    </Screen>
  );
}

const styles = StyleSheet.create({
  containter: {
    justifyContent: "center",
  },
  txtHeader: {
    fontSize: dimensions.text.header,
    color: colors.primary,
    fontWeight: "bold",
    textAlign: "center",
    padding: dimensions.spacing.normal_padding,
  },
});
