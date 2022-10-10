import React, { useState } from "react";
import { dimensions, screen_width } from "../config/dimensions";
import {
  View,
  StyleSheet,
  Text,
  Button,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import SelfClosingModal from "./SelfClosingModal";
import colors from "../config/colors";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Shadow } from "react-native-shadow-2";
import assets from "../config/assets";

function DataMenuHeader({ setShowModal }) {
  return (
    <View
      style={{
        backgroundColor: colors.primary,
        height: 42,
        justifyContent: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 16,
      }}
    >
      <Text style={styles.text}>CAMADA DE DADOS</Text>

      <TouchableOpacity
        style={styles.topBarIcon}
        onPress={() => setShowModal(null)}
      >
        <MaterialCommunityIcons name="close" size={24} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
}

function DataOriginSelector({ dataOriginToShow, setDataOriginToShow }) {
  const bgToUse = (selected) =>
    dataOriginToShow == selected ? colors.secondary : colors.gray;

  return (
    <Shadow
      viewStyle={{ width: "100%", height: 40 }}
      offset={[0, 3]}
      distance={3}
      radius={0}
      startColor="rgba(0, 0, 0, 0.15)"
      paintInside={true}
    >
      <View
        style={{
          height: 40,
          justifyContent: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: colors.secondary,
        }}
      >
        <TouchableOpacity
          style={[styles.choicesBtn, { backgroundColor: bgToUse("oficial") }]}
          onPress={() => setDataOriginToShow("oficial")}
        >
          <MaterialIcons
            name="account-balance"
            size={24}
            color={colors.white}
            alignItems="center"
          />
          <Text style={[styles.text, { marginLeft: 12 }]}>OFICIAL</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.choicesBtn, { backgroundColor: bgToUse("citzen") }]}
          onPress={() => setDataOriginToShow("citzen")}
        >
          <FontAwesome5
            name="user-alt"
            size={22}
            color={colors.white}
            alignItems="center"
          />
          <Text style={[styles.text, { marginLeft: 12 }]}>CIDADÃO</Text>
        </TouchableOpacity>
      </View>
    </Shadow>
  );
}

// FIXME: Change icon values in the future
const dataOptions = {
  oficial: [
    {
      name: "Área de suscetibilidade",
      code: "susceptibilityAreas",
      source: "CPRM",
      icon: assets.SusceptibilityAreas,
    },
    {
      name: "Pluviômetro automático",
      code: "automaticPluviometer",
      source: "Cemaden",
      icon: assets.PluviometricDataIcon,
    },
  ],
  citzen: [
    {
      name: "Pluviômetro artesanal",
      code: "pluviometer",
      source: null,
      icon: assets.PluviometricDataIcon,
    },
    {
      name: "Intensidade de chuva",
      code: "rain",
      source: null,
      icon: assets.rainLevel.Rain_1_5,
    },
    {
      name: "Área de alagamento",
      code: "floodZones",
      source: null,
      icon: assets.floodZones.FloodZonesIcon,
    },
    {
      name: "Água do rio",
      code: "riverFlood",
      source: null,
      icon: assets.riverLevel.High,
    },
  ],
};

function Border() {
  return (
    <View
      style={{
        width: 0.91 * screen_width,
        alignSelf: "center",
        height: 2,
        borderRadius: 2,
        paddingHorizontal: 16,
        backgroundColor: colors.separatorGray,
      }}
    />
  );
}

function ListDataOptions(
  dataOptionsToShow,
  dataOriginToShow,
  setDataOptionsToShow,
  option
) {
  const item = dataOptionsToShow[dataOriginToShow][option.code];
  const dataOptionObject = {
    ...dataOptionsToShow,
    [dataOriginToShow]: {
      ...dataOptionsToShow[dataOriginToShow],
      [option.code]: !item,
    },
  };

  return (
    <View key={option.code}>
      <View
        style={{
          flex: 1,
          height: 76,
          flexDirection: "row",
          paddingTop: 16,
          alignItems: "center",
          paddingHorizontal: 16,
          paddingBottom: 16,
        }}
      >
        <option.icon width={44} height={31} />

        <View
          style={{
            flex: 1,
            marginLeft: 16,
            alignItems: "flex-start",
          }}
        >
          <Text style={styles.itensText}>{option.name}</Text>
          {option.source && (
            <Text
              style={[
                styles.itensText,
                { color: colors.subText, fontSize: 14 },
              ]}
            >
              Fonte: {option.source}
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={() => {
            setDataOptionsToShow(dataOptionObject);
          }}
        >
          <View
            style={{
              alignContent: "flex-end",
              width: 120,
              height: 36,
              justifyContent: "center",
              borderRadius: 6,
              backgroundColor: !item ? colors.activated : colors.notActivated,
            }}
          >
            <Text style={styles.text}>{!item ? "ADICIONAR" : "REMOVER"}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Border />
    </View>
  );
}

function DataOriginOptions({
  dataOriginToShow,
  dataOptionsToShow,
  setDataOptionsToShow,
}) {
  return (
    <View
      style={{
        paddingTop: 8,
        flexDirection: "column",
      }}
    >
      <ScrollView height={270} automaticallyAdjustContentInsets={true}>
        <View>
          {dataOptions[dataOriginToShow].map((option) =>
            ListDataOptions(
              dataOptionsToShow,
              dataOriginToShow,
              setDataOptionsToShow,
              option
            )
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function DataMenuBody({
  setShowModal,
  dataOptionsToShow,
  setDataOptionsToShow,
}) {
  const [dataOriginToShow, setDataOriginToShow] = useState("oficial");

  return (
    <View backgroundColor={colors.grayBG}>
      <DataMenuHeader setShowModal={setShowModal} />
      <DataOriginSelector
        dataOriginToShow={dataOriginToShow}
        setDataOriginToShow={setDataOriginToShow}
      />
      <DataOriginOptions
        dataOptionsToShow={dataOptionsToShow}
        setDataOptionsToShow={setDataOptionsToShow}
        dataOriginToShow={dataOriginToShow}
      />
    </View>
  );
}

function ModalOpenBtn({ setShowModal }) {
  return (
    <TouchableOpacity onPress={() => setShowModal()}>
      <View
        style={{
          width: "100%",
          height: 48,
          backgroundColor: colors.primary,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={styles.text}>VISUALIZAR DADOS NO MAPA</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function MapDataMenu({
  dataOptionsToShow,
  setDataOptionsToShow,
}) {
  const [showModal, setShowModal] = useState(null);
  return (
    <View>
      <ModalOpenBtn setShowModal={() => setShowModal(true)} />

      <SelfClosingModal
        style={{ position: "absolute" }}
        animationType="slide"
        transparent={true}
        showModal={showModal}
        setShowModal={setShowModal}
      >
        <DataMenuBody
          setShowModal={setShowModal}
          dataOptionsToShow={dataOptionsToShow}
          setDataOptionsToShow={setDataOptionsToShow}
        />
      </SelfClosingModal>
    </View>
  );
}

const styles = StyleSheet.create({
  choicesBtn: {
    width: "50%",
    backgroundColor: colors.secondary,
    height: "100%",
    justifyContent: "center",
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  itensText: {
    color: colors.black,
    fontWeight: "500",
    fontSize: 16,
  },
  text: {
    color: colors.white,
    alignSelf: "center",
    fontWeight: "500",
    fontSize: 16,
  },
  topBarIcon: {
    alignSelf: "center",
  },
});
