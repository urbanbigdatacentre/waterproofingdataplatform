import {
  Form,
  SubmitButton,
  FormField,
} from "../components/forms";
import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableNativeFeedback,
  ScrollView,
} from "react-native";
import Screen from "../components/Screen";
import { dimensions } from "../config/dimensions";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import * as Yup from "yup";
import FormDatePicker from "../components/forms/FormDatePicker";
import moment from "moment";
import SearchablePicker from "../components/SearchablePicker";
import { states, statesToCities } from "../assets/cities_states";
import institutions from "../assets/institutions";
import { useFormikContext } from "formik";
import {
  signup,
  login,
  userPersonalData,
  existUsername,
  existNickname,
} from "../api/auth";
import { AuthContext } from "../auth/context";
import authStorage from "../auth/storage";
import ConfirmationModal from "../components/ConfirmationModal";
import PasswordFormField from "../components/forms/PasswordFormField";
import constants from "../config/constants";
import CheckBox from "../components/forms/CheckBox";
import defaultStyles from "../config/styles";
import PhoneNumberFormField from "../components/forms/PhoneNumberFormField";
import { unMask, mask } from "react-native-mask-text";

const phoneRegex = RegExp(
  /^\(?[\(]?([0-9]{2})?\)?[)\b]?([0-9]{4,5})[-. ]?([0-9]{4})$/
);

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("O nome é obrigatório")
    .matches(/[a-zA-Z]/, "O nome e só pode conter letras"),
  number: Yup.string()
    .matches(phoneRegex, "Número inválido")
    .required("O número de telefone é obrigatório"),
  password: Yup.string()
    .required("A senha é obrigatória")
    .min(8, "Senha muito curta, minimo 8 caracteres")
    .matches(/[a-zA-Z]/, "A senha só pode conter letras"),
  confirmPassword: Yup.string()
    .required("A senha é obrigatória")
    .min(8, "Senha muito curta, minimo 8 caracteres")
    .matches(/[a-zA-Z]/, "A senha só pode conter letras"),
  state: Yup.string().required("O estado é obrigatório"),
  city: Yup.string().required("A cidade é obrigatória"),
  institutionName: Yup.string(),
  secQuestion: Yup.string().required("Escolha a pergunta de segurança"),
  secQuestionAns: Yup.string()
    .required("A resposta da pergunta de segurança é obrigatória")
    .max(255),
  consent: Yup.bool().equals([true], "Este campo é obrigatório"),
  role: Yup.string(),
});

function LocalDatePicker({ date, setDate, _moment }) {
  const formatDate = () => date.format("DD/MM/YYYY");

  return (
    <View flex={1}>
      <FormDatePicker
        onDateChange={(value) => setDate(value)}
        minimumDate={new Date(moment().subtract(110, "year"))}
        date={date}
      >
        <View style={[styles.dateInput, { flex: 1, paddingRight: 2 }]}>
          <View
            style={{
              ...defaultStyles.shadow,
              height: 58,
              paddingLeft: 12,
              backgroundColor: colors.white,
              borderColor: colors.grayBG,
              borderWidth: 1,
              padding: 5,
              borderRadius: 6,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: colors.medium,
                fontSize: 18,
              }}
            >
              {date != _moment
                ? formatDate()
                : "Selecione a data de nascimento"}
            </Text>
          </View>
        </View>
      </FormDatePicker>
    </View>
  );
}

function GenderPicker({ name }) {
  const [items, setItems] = useState([
    { value: "F", label: "Feminino" },
    { value: "M", label: "Masculino" },
    { value: "N", label: "Prefiro não dizer" },
  ]);
  return (
    <SearchablePicker
      name={name}
      items={items}
      setItems={setItems}
      formPlaceholder={"Selecione o seu gênero"}
      searchPlaceholder={"Busca..."}
    />
  );
}

function InstitutionPicker({ name }) {
  const [items, setItems] = useState([
    { value: "E", label: "Escola" },
    { value: "D", label: "Defesa civil" },
    { value: "N", label: "Não governamental" },
    { value: "O", label: "Outra" },
    { value: "X", label: "Nenhuma" },
  ]);
  return (
    <SearchablePicker
      name={name}
      items={items}
      setItems={setItems}
      formPlaceholder={"Selecione o tipo da instituição"}
      searchPlaceholder={"Busca..."}
    />
  );
}

function StatePicker({ name }) {
  const [items, setItems] = useState(states);
  return (
    <SearchablePicker
      name={name}
      items={items}
      setItems={setItems}
      formPlaceholder={"Selecione o seu estado"}
      searchPlaceholder={"Busca..."}
    />
  );
}

function CityPicker({ name }) {
  const { values } = useFormikContext();
  const state = values["state"];

  useEffect(() => {
    state && setItems(statesToCities[state].cities);
  }, [state]);

  const [items, setItems] = useState([]);

  return (
    <SearchablePicker
      name={name}
      items={items}
      setItems={setItems}
      formPlaceholder={"Selecione a sua cidade"}
      nothingToShow={
        state
          ? "Não encontramos nada com esse termo"
          : "Selecione o Estado primeiro"
      }
      searchPlaceholder={"Busca..."}
    />
  );
}

function InstitutionNamePicker({ name }) {
  const { values } = useFormikContext();
  const state = values["state"];
  const instType = values["institution"];
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      if (state && instType) {
        const insts = institutions[state] && institutions[state][instType];
        console.log(insts);
        insts ? setItems(insts) : setItems([]);
      }
    } catch (e) {
      console.log(e);
    }
  }, [state, instType]);

  return (
    <SearchablePicker
      name={name}
      items={items}
      setItems={setItems}
      formPlaceholder={"Selecione o nome da instituição"}
      doubleItemLine={true}
      nothingToShow={
        institutions?.state?.instType
          ? "Não encontramos nada com esse termo"
          : state && instType
          ? `Nenhuma instituição do tipo ${constants.institutionMap[instType]} no ${constants.statesMap[state]}`
          : "Selecione o Estado e o tipo da instituição primeiro"
      }
      searchPlaceholder={"Busca..."}
    />
  );
}

function SecQuestionPicker({ name }) {
  const [items, setItems] = useState([
    { value: "Qual a sua cor predileta?", label: "Qual a sua cor predileta?" },
    {
      value: "Qual é seu livro predileto?",
      label: "Qual é seu livro predileto?",
    },
    {
      value: "Qual o nome da rua em que você cresceu?",
      label: "Qual o nome da rua em que você cresceu?",
    },
    {
      value: "Qual o nome do seu bicho de estimação predileto?",
      label: "Qual o nome do seu bicho de estimação predileto?",
    },
    {
      value: "Qual a sua comida predileta?",
      label: "Qual a sua comida predileta?",
    },
    {
      value: "Qual é o seu país preferido?",
      label: "Qual é o seu país preferido?",
    },
    {
      value: "Qual é a sua marca de carro predileto?",
      label: "Qual é a sua marca de carro predileto?",
    },
  ]);

  return (
    <SearchablePicker
      name={name}
      items={items}
      setItems={setItems}
      formPlaceholder={"Selecione a pergunta de segurança"}
      searchPlaceholder={"Busca..."}
      marginLeft={2}
    />
  );
}

function RolePicker({ name }) {
  const [items, setItems] = useState([
    { value: "ROLE_INSTITUTION", label: "Responsável" },
    { value: "ROLE_CLIENT", label: "Não responsável" },
  ]);

  return (
    <SearchablePicker
      name={name}
      items={items}
      setItems={setItems}
      formPlaceholder={"Selecione o vínculo institucional"}
      searchPlaceholder={"Busca..."}
    />
  );
}

function MaterialCommunityIconsCustom({
  name,
  color = colors.primary,
  size = 25,
}) {
  return (
    <View justifyContent={"center"} height={48}>
      <MaterialCommunityIcons name={name} size={size} color={color} />
    </View>
  );
}
export default function RegisterScreen(props) {
  const authContext = useContext(AuthContext);
  const _moment = moment();
  const [date, setDate] = useState(_moment);
  const [scroll, setScroll] = useState();
  const [showLog, setShowLog] = useState({ show: false, message: "" });
  const [showModal, setShowModal] = useState({
    show: false,
    message: "",
    form: null,
  });

  const comparePassword = (password, confirmPassword) => {
    return password !== confirmPassword;
  };

  const automaticLogin = async (form) => {
    const result = await login(form.number, form.password);

    if (!result.ok) return;

    authStorage.setToken(result.data);
    const user = await userPersonalData();
    user.ok && authContext.setUser(user.data);
  };

  const handleSubmit = async (form) => {
    console.log(form);
    const formDate =
      date.format("DD/MM/yyyy") === moment().format("DD/MM/yyyy") ? "" : date;

    const result = await signup({ ...form, dateofborn: formDate });

    switch (result.status) {
      case 200:
        automaticLogin(form);
        break;
      case 422:
        setShowLog({
          show: true,
          message: "Campo obrigatório não informado",
        });
        break;
      default:
        setShowLog({
          show: true,
          message: "Um erro inesperado ocorreu. Tente novamente mais tarde",
        });
    }
  };

  const fieldsAreNotInUse = async (form, actions) => {
    var inUse = false;
    const ru = await existUsername(form.number);

    if (ru.data) {
      actions.setFieldError("number", "Este número de telefone já está em uso");
      inUse = true;
    }

    const rn = await existNickname(form.name);
    if (rn.data) {
      actions.setFieldError("name", "Este apelido de usuário já está em uso");
      inUse = true;
    }

    if (!ru.ok || !rn.ok)
      setShowLog({
        show: true,
        message: "Um erro inesperado ocorreu. Tente novamente mais tarde",
      });

    inUse &&
      setShowLog({
        show: true,
        message: "Apelido de usuário ou telefone em uso",
      });

    return !inUse;
  };

  const copnfirmations = (form, actions) => {
    console.log(form);
    var current_mask =
      form.number.length >= 11 ? "(99) 99999-9999" : "(99) 9999-9999";

    const psw_match = comparePassword(form.password, form.confirmPassword);
    if (psw_match) {
      actions.setFieldError("confirmPassword", "As senhas não correspondem");
      scroll.scrollTo({ x: 0, y: 0, animated: true });
    } else {
      fieldsAreNotInUse(form, actions).then((isNotUsed) => {
        if (isNotUsed) {
          setShowModal({
            show: true,
            form: form,
            message:
              'Você está cadastrando o apelido "' +
              form.name +
              '" e o número ' + mask(form.number, current_mask) +
              '. Deseja continuar o cadastro?',
          });
        } else {
          console.log("scrolll");
          scroll.scrollTo({ x: 0, y: 0, animated: true });
        }
      });
    }
  };

  return (
    <Screen style={styles.containter}>
      <ConfirmationModal
        show={showLog.show}
        description={showLog.message}
        confirmationLabel="OK"
        onConfirm={() => setShowLog({ ...showLog, show: false })}
      />
      <ConfirmationModal
        show={showModal.show}
        description={showModal.message}
        isNicknameConfirmation={true}
        icon="user-check"
        confirmationLabel="SIM"
        declineLabel="NÃO"
        onConfirm={() => {
          handleSubmit(showModal.form);
        }}
        onDecline={() => {
          setShowModal({ ...showModal, show: false, message: "" });
        }}
      />

      <Form
        initialValues={{
          name: "",
          number: "",
          password: "",
          confirmPassword: "",
          institutionName: "",
          gender: "",
          state: "",
          city: "",
          institution: "",
          secQuestion: "",
          secQuestionAns: "",
          role: "",
          consent: false,
        }}
        onSubmit={(form, actions) => {
          copnfirmations(form, actions);
        }}
        validationSchema={validationSchema}
      >
        <View
          style={{ flexDirection: "column", justifyContent: "center", flex: 1 }}
        >
          <ScrollView
            scrollToOverflowEnabled={true}
            ref={(ref) => {
              setScroll(ref);
            }}
            scrollEnabled={true}
          >
            <Text
              style={{
                color: colors.primary,
                fontSize: 20,
                fontWeight: "bold",
                alignSelf: "center",
                marginVertical: 24,
              }}
            >
              Cadastro do usuário
            </Text>
            <Text style={styles.labelStyle}>Apelido de usuário*</Text>
            <View style={styles.iconField}>
              <MaterialCommunityIconsCustom name="account" />
              <FormField
                paddingRight={2}
                flex={1}
                maxLength={40}
                name="name"
                placeholder="Digite o apelido de usuário"
              />
            </View>
            <Text style={styles.labelStyle}>Número do telefone:*</Text>
            <View style={styles.iconField}>
              <MaterialCommunityIconsCustom name="phone" />
              <PhoneNumberFormField
                flex={1}
                name="number"
                paddingRight={2}
                maxLength={11}
                placeholder="(DDD) XXXXX-XXXX"
              />
            </View>
            <Text style={styles.labelStyle}>Senha:*</Text>
            <View style={{ flexDirection: "column", flex: 1 }}>
              <View style={{ ...styles.iconField, marginBottom: 12 }}>
                <MaterialCommunityIconsCustom name="lock" />
                <PasswordFormField
                  flex={1}
                  maxLength={20}
                  name="password"
                  placeholder="Digite a senha"
                  paddingRight={2}
                />
              </View>
              <Text style={styles.warningText}>
                A senha deve conter entre 8 e 20 caracteres
              </Text>
            </View>
            <Text style={styles.labelStyle}>Confirmar senha:*</Text>
            <View style={{ flexDirection: "column", flex: 1 }}>
              <View style={{ ...styles.iconField, marginBottom: 12 }}>
                <MaterialCommunityIconsCustom name="lock" />
                <PasswordFormField
                  flex={1}
                  maxLength={20}
                  name="confirmPassword"
                  placeholder="Repita a senha"
                  paddingRight={2}
                />
              </View>
              <Text style={styles.warningText}>
                A senha deve conter entre 8 e 20 caracteres
              </Text>
            </View>
            <Text style={styles.labelStyle}>Data de nascimento:</Text>
            <View style={styles.iconField}>
              <MaterialCommunityIconsCustom name="calendar-today" />
              <LocalDatePicker
                date={date}
                setDate={setDate}
                _moment={_moment}
              />
            </View>
            <Text style={styles.labelStyle}>Gênero:</Text>
            <View style={[styles.iconField]}>
              <MaterialCommunityIconsCustom name="account" />
              <GenderPicker name="gender" />
            </View>
            <Text style={styles.labelStyle}>Estado*:</Text>
            <View style={[styles.iconField]}>
              <MaterialCommunityIconsCustom name="map-marker" />
              <StatePicker name="state" />
            </View>
            <Text style={styles.labelStyle}>Cidade*:</Text>
            <View style={[styles.iconField]}>
              <MaterialCommunityIconsCustom name="map-marker" />
              <CityPicker name={"city"} />
            </View>
            <Text style={styles.labelStyle}>Tipo de instituição:</Text>
            <View style={[styles.iconField]}>
              <MaterialCommunityIconsCustom name="bank" />
              <InstitutionPicker name="institution" />
            </View>
            <Text style={styles.labelStyle}>Nome da instituição</Text>
            <View style={{ flexDirection: "column", flex: 1 }}>
              <View style={{ ...styles.iconField, marginBottom: 12 }}>
                <MaterialCommunityIconsCustom name="bank" />
                <InstitutionNamePicker name="institutionName" />
              </View>
              <Text style={styles.warningText}>
                O nome da instituição é fornecido pelo Cemaden Educação
              </Text>
            </View>
            <Text style={styles.labelStyle}>Vínculo institucional:</Text>
            <View style={[styles.iconField]}>
              <MaterialCommunityIconsCustom name="bank" />
              <RolePicker name="role" />
            </View>
            <Text style={styles.labelStyle}>Pergunta de segurança*:</Text>
            <View
              style={{
                flexDirection: "row",
                marginTop: 12,
                marginBottom: 24,
              }}
            >
              <SecQuestionPicker name="secQuestion" />
            </View>
            <Text style={styles.labelStyle}>Resposta*:</Text>
            <View style={styles.iconField}>
              <FormField
                flex={1}
                maxLength={255}
                name="secQuestionAns"
                placeholder="Digite a resposta à pergunta"
                paddingRight={2}
                paddingLeft={2}
              />
            </View>

            <Text style={styles.labelStyle}>Termos de uso*</Text>
            <View
              flexDirection={"column"}
              alignItems={"flex-start"}
              marginBottom={24}
              marginTop={12}
            >
              <CheckBox
                name={"consent"}
                navigate={() => props.navigation.navigate("UserAgreement")}
              />
            </View>

            <SubmitButton
              flex={1}
              title="cadastrar"
              backgroundColor={colors.primary}
            />

            <TouchableNativeFeedback
              onPress={() => {
                props.navigation.goBack();
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignSelf: "center",
                  paddingBottom: 34,
                  marginTop: 6,
                }}
              >
                <Text>Já tem uma conta? </Text>
                <Text style={{ color: colors.lightBlue }}>Faça Login</Text>
              </View>
            </TouchableNativeFeedback>
          </ScrollView>
        </View>
      </Form>
    </Screen>
  );
}

const styles = StyleSheet.create({
  containter: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    paddingHorizontal: 10,
  },
  labelStyle: {
    fontSize: dimensions.text.secondary,
    fontWeight: "bold",
    textAlign: "left",
    color: colors.secondary,
  },
  iconField: {
    alignItems: "center",
    width: "100%",
    flex: 1,
    flexDirection: "row",
    marginTop: 12,
    marginBottom: 24,
  },
  dateInput: {
    paddingLeft: 16,
  },
  warningText: {
    color: colors.primary,
    fontSize: dimensions.text.primary,
    textAlign: "left",
    marginBottom: 24,
  },
}); 
