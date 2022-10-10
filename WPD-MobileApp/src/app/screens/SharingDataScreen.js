import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, View, Text } from "react-native";
import ConfirmationModal from "../components/ConfirmationModal";
import { ScrollView } from "react-native";
import assets from "../config/assets";
import { dimensions } from "../config/dimensions";
import SvgLabeledButton from "../components/SvgLabeledButton";
import { AuthContext } from "../auth/context";
import { useNetInfo } from "@react-native-community/netinfo";

function SharingDataScreen({ navigation }) {
  const authContext = useContext(AuthContext);
  const [showLog, setShowLog] = useState(false);
  const [showLogPluv, setShowLogPluv] = useState(false);

  const isRegistered = authContext.user?.username != null;
  const pluviometer = authContext.user?.pluviometer ? true : false;
  const currentUser = authContext.user;

  const onConfirmPluv = () => {
    if (authContext.user?.pluviometer == false) {
      setShowLogPluv(false);
      navigation.navigate("Perfil");
    } else if (authContext.user?.pluviometer == undefined) {
      setShowLogPluv(false);
    }
  };

  return (
    <View style={{ flex: 1, width: "100%" }}>
      {/* <ConnectionWarning /> */}
      <View style={styles.container}>
        <ConfirmationModal
          show={showLogPluv}
          icon={"md-warning-outline"}
          description="Para enviar um dado pluviométrico, cadastre um pluviômetro"
          confirmationLabel="Cadastrar"
          onConfirm={() => onConfirmPluv()} //{setShowLogPluv(false), navigation.navigate("Perfil")}}
          onDecline={() => setShowLogPluv(false)}
        />
        <ConfirmationModal
          show={showLog}
          icon={"md-warning-outline"}
          description={
            "Para enviar uma informação," + "\n" + "faça o login ou cadastre-se"
          }
          confirmationLabel="LOGIN"
          onConfirm={() => authContext.setUser(false)}
          onDecline={() => setShowLog(false)}
        />
        <ScrollView>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 30,
            }}
          >
            <SvgLabeledButton
              label={"ÁREA DE \nALAGAMENTO"}
              style={{ marginRight: 24 }}
              SvgImage={assets.floodZones.FloodZonesIcon}
              onPress={() =>
                navigation.navigate("FloodSharingData", { user: currentUser })
              }
              active={isRegistered}
              inactiveOnPress={() => setShowLog(true)}
            />

            <SvgLabeledButton
              label={"CHUVA"}
              onPress={() =>
                navigation.navigate("RainSharingData", { user: currentUser })
              }
              SvgImage={assets.rainLevel.RainIcon}
              active={isRegistered}
              inactiveOnPress={() => setShowLog(true)}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              flex: 1,
              marginVertical: 24,
            }}
          >
            <SvgLabeledButton
              style={{ marginRight: 24 }}
              label={"DIÁRIO DO\nPLUVIÔMETRO"}
              onPress={() =>
                navigation.navigate("PluviometerSharingData", {
                  user: currentUser,
                })
              }
              SvgImage={assets.PluviometricDataIcon}
              active={isRegistered && pluviometer}
              inactiveOnPress={() => {
                setShowLog(!isRegistered),
                  setShowLogPluv(!pluviometer && isRegistered);
              }}
            />

            <SvgLabeledButton
              label={"NÍVEL ÁGUA\nNO RIO"}
              onPress={() =>
                navigation.navigate("RiverFloodData", { user: currentUser })
              }
              SvgImage={assets.riverLevel.RiverIcon}
              active={isRegistered}
              inactiveOnPress={() => setShowLog(true)}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: dimensions.text.default,
    textAlign: "center",
    marginTop: 10,
  },

  container: {
    paddingHorizontal: 10,
    flex: 1,
  },
});

export default SharingDataScreen;
