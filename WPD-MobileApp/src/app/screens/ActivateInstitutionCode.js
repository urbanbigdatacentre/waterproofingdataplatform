import React, { useState, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { dimensions } from "../config/dimensions";
import colors from "../config/colors";
import Button from "../components/Button";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AuthContext } from "../auth/context";
import authStorage from "../auth/storage";

import {
  Form,
  SubmitButton,
  FormField,
  ErrorMessage,
} from "../components/forms";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ConfirmationModal from "../components/ConfirmationModal";
import { userActivation } from "../api/auth";

function Header() {
  return (
    <View
      style={{
        paddingVertical: 24,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: dimensions.text.secondary,
          color: colors.primary,
          fontWeight: "bold",
        }}
      >
        Ativar instituição
      </Text>
    </View>
  );
}

function Institution({ user }) {
  const institutionMap = {
    E: "Escola",
    D: "Defesa Civil",
    N: "Não governamental",
    O: "Outra",
    N: "Nenhuma",
  };

  const roleMap = {
    ROLE_CLIENT: "Não responsável",
    ROLE_INSTITUTION: "Responsável",
  }

  return (
    <View style={{ marginTop: 24, marginBottom: 24 }}>
      <Text style={styles.label}>Tipo de instituição: </Text>
      <View style={{ flexDirection: "row" }}>
        <MaterialCommunityIcons name="bank" size={30} color={colors.primary} />
        <Text style={styles.subText}>
          {user.institutiontype ? institutionMap[user.institutiontype] : "Não informado"}
        </Text>
      </View>

      <Text style={[styles.label, { marginTop: 24 }]}>
        Nome da instituição:
      </Text>
      <View style={{ flexDirection: "row" }}>
        <MaterialCommunityIcons name="bank" size={30} color={colors.primary} />
        <Text style={styles.subText}>{user.institution ? user.institution : "Não informado"}</Text>
      </View>

      <Text style={[styles.label, { marginTop: 24 }]}>
        Vínculo institucional:
      </Text>
      <View style={{ flexDirection: "row" }}>
        <MaterialCommunityIcons
          name="account"
          size={30}
          color={colors.primary}
        />
        <Text style={styles.subText}>{roleMap[user?.roles[0]]}</Text>
      </View>
    </View>
  );
}


function ValidateCode({ user }) {
  return (
    <View flex={1} padding={16} width="100%">
      <Header />

      <Institution user={user} />

      <Text style={[styles.label]}>Código de ativação:</Text>
      <View style={styles.iconField}>
        <MaterialCommunityIcons
          name="key"
          size={30}
          color={colors.primary}
          style={{
            transform: [{ rotate: "-90deg" }],
          }}
        />
        <FormField
          paddingRight={2}
          flex={1}
          maxLength={36}
          name="code"
          // numberOfLines={1}
          placeholder="Digite o código de ativação"
        />
      </View>

      <SubmitButton title="Confirmar" />
    </View>
  );
}


async function processOnSubmit(navigation, form, instRole, setShowLog) {
  const response = await userActivation(form.code);
  console.log("==============================================================================")
  console.log(response)


  if (instRole == "Não responsável") {
    if (response.ok) {
      setShowLog({ show: true, message: true });
    } else {
      setShowLog({ show: true, message: false });
    }
  } else if (response.ok) {
    navigation.navigate("ActivateInstitutionShowCode");
  } else {
    setShowLog({ show: true, message: false });
  }

  // navigation.navigate("ActivateInstitutionShowCode", { code: form.code });
}


export default function ActivateInstitutionCode({ navigation }) {
  const { user, _ } = useContext(AuthContext);
  // FIXME: wpdAuth has errors while giving /me data for ROLE_INSTITUTION
  // user.role = "ROLE_CLIENT"
  // console.log(user)

  const initialState = { show: false, message: true };
  const [showLog, setShowLog] = useState(initialState);

  return (
    <Form
      initialValues={{
        code: "",
      }}
      onSubmit={(form) => {
        console.log("Forms values: \n" + JSON.stringify(form));
        processOnSubmit(navigation, form, user.role, setShowLog);
      }}
    >
      <ConfirmationModal
        show={showLog.show}
        description={
          showLog.message
            ? "O código de ativação foi validado com sucesso."
            : "O código de ativação informado não coincide com o código do responsável pela instituição no Cemaden Educação."
        }
        confirmationLabel="OK"
        onConfirm={() => setShowLog(initialState)}
        onDecline={() => setShowLog(initialState)}
      />

      <KeyboardAwareScrollView>
        <ValidateCode user={user} />
      </KeyboardAwareScrollView>
    </Form>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: dimensions.text.secondary,
    marginBottom: 12,
    fontWeight: "bold",
    textAlign: "left",
    color: colors.secondary,
  },
  subText: {
    color: colors.subText,
    fontSize: 16,
    alignSelf: "center",
    fontWeight: "500",
    paddingLeft: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.primary,
  },
  labelStyle: {
    fontSize: dimensions.text.secondary,
    fontWeight: "bold",
    textAlign: "left",
    color: colors.secondary,
    marginBottom: 12,
    marginTop: 48,
  },
  iconField: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 24,
  },
});
