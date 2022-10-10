import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import * as Yup from "yup";

import { Form, SubmitButton } from "../components/forms";
import colors from "../config/colors";
import { dimensions } from "../config/dimensions";
import PasswordFormField from "../components/forms/PasswordFormField";
import ConfirmationModal from "../components/ConfirmationModal";
import { updatePassword } from "../api/auth";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .required("A senha é obrigatória")
    .min(8, "Senha muito curta, minimo 8 caracteres")
    .matches(/[a-zA-Z]/, "A senha só pode conter letras"),
  confirmPassword: Yup.string()
    .required("A senha é obrigatória")
    .min(8, "Senha muito curta, minimo 8 caracteres")
    .matches(/[a-zA-Z]/, "A senha só pode conter letras"),
});

export default function PasswordRecoveryChangePswd({ navigation, route }) {
  const authToken = route.params.authToken;
  const username = route.params.username;

  const [confirmatioModalData, setConfirmatioModalData] = useState({
    show: false,
    message: "",
    onConfirmAction: () => {},
  });

  const comparePassword = (password, confirmPassword) => {
    return password !== confirmPassword;
  };

  const handleSubmit = async (password) => {
    const apiReturn = await updatePassword(authToken, username, password);

    switch (apiReturn.status) {
      case 200:
        setConfirmatioModalData({
          message: "Senha alterada com sucesso",
          show: true,
          onConfirmAction: () => {
            navigation.navigate("Login");
          },
        });
        break;
      case 404:
        setConfirmatioModalData({
          message: "Número de telefone inválido",
          show: true,
        });
        break;
      case 500:
      case 403:
        setConfirmatioModalData({
          message: "Algo deu errado, tente novamente mais tarde",
          show: true,
        });
        break;
      default:
        setConfirmatioModalData({
          message: "Algo deu errado, tente novamente mais tarde",
          show: true,
        });
        break;
    }
  };

  return (
    <View>
      <ConfirmationModal
        show={confirmatioModalData.show}
        description={confirmatioModalData.message}
        confirmationLabel="OK"
        onConfirm={() => {
          setConfirmatioModalData({ ...confirmatioModalData, show: false });
          confirmatioModalData?.onConfirmAction();
        }}
      />

      <KeyboardAwareScrollView>
        <Form
          validationSchema={validationSchema}
          initialValues={{
            password: "",
            confirmPassword: "",
          }}
          onSubmit={(form, actions) => {
            const psw_not_match = comparePassword(
              form.password,
              form.confirmPassword
            );
            if (psw_not_match) {
              actions.setFieldError(
                "confirmPassword",
                "As senhas não correspondem"
              );
            } else {
              handleSubmit(form.password);
            }
          }}
        >
          <View style={{ padding: 16 }}>
            <Text style={styles.textHeader}>Redefinir sua senha</Text>
            <Text style={styles.textSubtitle}>
              Digite uma nova senha nos campos abaixo para redefini-la
            </Text>
          </View>

          <View>
            <Text style={styles.labelStyle}>Nova senha*:</Text>
            <PasswordFormField
              maxLength={20}
              name="password"
              placeholder="Digite a nova senha"
            />
          </View>

          <View style={{ marginVertical: 24 }}>
            <Text style={styles.labelStyle}>Confirmar a senha</Text>
            <PasswordFormField
              maxLength={20}
              name="confirmPassword"
              placeholder="Digite novamente a senha"
            />
          </View>

          <SubmitButton title="confirmar" backgroundColor={colors.primary} />
        </Form>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  labelStyle: {
    fontSize: dimensions.text.secondary,
    fontWeight: "bold",
    textAlign: "left",
    color: colors.secondary,
    marginBottom: 14,
    paddingHorizontal: 16,
  },
  textHeader: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 22,
  },
  textSubtitle: {
    textAlign: "center",
    fontSize: dimensions.text.secondary,
    marginVertical: 22,
  },
});
