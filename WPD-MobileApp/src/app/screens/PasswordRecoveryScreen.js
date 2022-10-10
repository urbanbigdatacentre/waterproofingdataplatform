import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import * as Yup from "yup";

import { Form, SubmitButton, FormField } from "../components/forms";
import colors from "../config/colors";
import { dimensions } from "../config/dimensions";
import PhoneNumberFormField from "../components/forms/PhoneNumberFormField";
import SearchablePicker from "../components/SearchablePicker";
import ConfirmationModal from "../components/ConfirmationModal";
import { loginByUsernamAnswers, existUsername } from "../api/auth";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

function SecQuestionPicker({ name }) {
  const [items, setItems] = useState([
    { value: "1", label: "Qual a sua cor predileta?" },
    {
      value: "2",
      label: "Qual é seu livro predileto?",
    },
    {
      value: "3",
      label: "Qual o nome da rua em que você cresceu?",
    },
    {
      value: "4",
      label: "Qual o nome do seu bicho de estimação predileto?",
    },
    {
      value: "5",
      label: "Qual a sua comida predileta?",
    },
    {
      value: "7",
      label: "Qual é o seu país preferido?",
    },
    {
      value: "8",
      label: "Qual é a sua marca de carro predileto?",
    },
  ]);

  return (
    <SearchablePicker
      flex={0}
      name={name}
      items={items}
      setItems={setItems}
      formPlaceholder={"Selecione a pergunta de segurança"}
      searchPlaceholder={"Busca..."}
      marginRight={16}
    />
  );
}

const phoneRegex = RegExp(
  /^\(?[\(]?([0-9]{2})?\)?[)\b]?([0-9]{4,5})[-. ]?([0-9]{4})$/
);
const validationSchema = Yup.object().shape({
  number: Yup.string()
    .matches(phoneRegex, "Número inválido")
    .required("O número de telefone é obrigatório"),
  secQuestion: Yup.string().required("Escolha a pergunta de segurança"),
  answer: Yup.string()
    .required("A resposta da pergunta de segurança é obrigatória")
    .max(255),
});

export default function PasswordRecovery({ navigation, route }) {
  const user = route.params.user;
  const title = route.params.title;

  const [showLoading, setShowLoading] = useState(false);
  const [confirmatioModalData, setConfirmatioModalData] = useState({
    show: false,
    message: "",
  });

  const handleSubmit = async (number, answer, secQuestion) => {
    setShowLoading(true);
    setTimeout(() => {
      showLoading &&
        setConfirmatioModalData({
          message: "Validando informações",
          show: true,
        });
    }, 2000);

    const userExists = await existUsername(number);
    if (userExists.data == null) {
      setConfirmatioModalData({
        message: "Um erro inesperado ocorreu. Tente novamente mais tarde",
        show: true,
      });
      setShowLoading(false);
      return;
    }

    const apiResponse = await loginByUsernamAnswers(
      number,
      secQuestion,
      answer
    );
    setShowLoading(false);

    switch (apiResponse.status) {
      case 200:
        navigation.navigate("PasswordRecoveryChangePswd", {
          authToken: apiResponse.data,
          username: number,
        });
        break;
      case 404:
        setConfirmatioModalData({
          message: "Pergunta de segurança ou senha incorretos",
          show: true,
        });
        break;
      case 422:
        setConfirmatioModalData({
          message: "Pergunta de segurança ou senha incorretos",
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
      />

      <KeyboardAwareScrollView>
        <Form
          validationSchema={validationSchema}
          initialValues={{
            number: user.username || "",
            answer: "",
            secQuestion: "",
          }}
          onSubmit={({ number, answer, secQuestion }) => {
            handleSubmit(number, answer, secQuestion);
          }}
        >
          <View style={{ padding: 16 }}>
            <Text style={styles.textHeader}>{title}</Text>
            <Text style={styles.textSubtitle}>
              Responda à pergunta de segurança, isso ajuda a mostrar que essa
              conta realmente pertence a você
            </Text>
          </View>

          <View>
            <Text style={styles.labelStyle}>Número de telefone*:</Text>
            <PhoneNumberFormField
              name="number"
              maxLength={11}
              placeholder={"(DDD) XXXXX-XXXX"}
              editable={user.username == null}
            />
          </View>

          <View style={{ marginTop: 24 }}>
            <Text style={styles.labelStyle}>Pergunta*:</Text>
            <SecQuestionPicker name="secQuestion" />
          </View>

          <View style={{ marginVertical: 24 }}>
            <Text style={styles.labelStyle}>Resposta*:</Text>
            <FormField
              name="answer"
              maxLength={255}
              placeholder={"Digite a resposta à pergunta"}
            />
          </View>

          <SubmitButton title="próximo" backgroundColor={colors.primary} />
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
