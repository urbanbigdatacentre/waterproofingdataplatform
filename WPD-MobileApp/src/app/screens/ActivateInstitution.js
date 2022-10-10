import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { showMessage } from "react-native-flash-message";
import { dimensions } from "../config/dimensions";
import colors from "../config/colors";
import SearchablePicker from "../components/SearchablePicker";
import Button from "../components/Button";

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

function RolePicker({ setSelected }) {
  const [items, setItems] = useState([
    { value: "Responsável", label: "Responsável" },
    { value: "Não responsável", label: "Não responsável" },
  ]);

  return (
    <SearchablePicker
      items={items}
      setItems={setItems}
      setSelected={setSelected}
      formPlaceholder={"Selecione o vínculo institucional"}
      searchPlaceholder={"Busca..."}
      marginLeft={0}
    />
  );
}

function SelectInstitutionalRole({ setInstRole, onPress }) {
  return (
    <View flex={1} padding={16} width="100%">
      <Header />
      <Text
        style={{
          padding: 15,
          marginTop: 24,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        A instituição da qual você faz parte está cadastrada no projeto Cemaden
        Educação. Se no projeto você é responsável pela instituição, selecione a
        opção “Responsável” no campo “Vínculo”.
      </Text>

      <Text style={styles.labelStyle}>Vínculo institucional:</Text>

      <View flexDirection="row">
        <RolePicker setSelected={setInstRole} />
      </View>

      <Button
        style={{ marginTop: 24 }}
        title="Próximo"
        onPress={() => onPress()}
      />
    </View>
  );
}

export default function ActivateInstitution(props) {
  const [instRole, setInstRole] = useState(null);

  return (
    <SelectInstitutionalRole
      setInstRole={setInstRole}
      onPress={() => {
        props.navigation.navigate("ActivateInstitutionCode", {instRole: instRole});
      }}
    />
  );
}

const styles = StyleSheet.create({
  labelStyle: {
    fontSize: dimensions.text.secondary,
    fontWeight: "bold",
    textAlign: "left",
    color: colors.secondary,
    marginBottom: 12,
    marginTop: 48,
  },
  iconField: {
    flexDirection: "row",
  },
});
