import React, { useState, useContext, useEffect } from "react";
import { View, Text } from "react-native";
import { dimensions } from "../config/dimensions";
import colors from "../config/colors";
import authStorage from "../auth/storage";
import { AuthContext } from "../auth/context";
import {userPersonalData} from "../api/auth";

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
        Código de ativação
      </Text>
    </View>
  );
}

export default function ActivateInstitutionShowCode() {
  const [actCode, setActCode] = useState("");

  const authContext = useContext(AuthContext);


  useEffect(() => {
    if (authContext.user?.providerActivationKey?.activationkey)
      setActCode(authContext.user.providerActivationKey.activationkey);
    else
      userPersonalData().then((userData) => {
        userData.ok && authContext.setUser(userData.data);
        setActCode(userData.data.providerActivationKey.activationkey);
      });
  }, []);


  return (
    <View>
      <Header />
      <Text
        style={{
          padding: 15,
          marginTop: 24,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Você é responsável pela institução. Compartilhe o código de ativação com
        as demais pessoas vinculadas à instituição que utilizam o aplicativo
      </Text>

      <Text
        style={{
          padding: 15,
          marginTop: 24,
          fontWeight: "bold",
          textAlign: "center",
          fontSize: dimensions.text.header,
        }}
      >
        {actCode}
      </Text>
    </View>
  );
}
