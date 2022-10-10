import React, { useContext, useState } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import Screen from "../components/Screen";
import { AuthContext } from "../auth/context";
import authStorage from "../auth/storage";
import { TouchableOpacity } from "react-native-gesture-handler";
import assets from "../config/assets";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import ConfirmationModal from "../components/ConfirmationModal";
import utils from "../config/utils";
import { mask } from "react-native-mask-text";
import { useNetInfo } from "@react-native-community/netinfo";
import ConnectionWarning from "../components/ConnectionWarning";

function UserHeader({ name, fone }) {
  const index = utils.hashPhoneNumber(fone) % assets.avatar.length || 2;
  const Avatar = assets.avatar[index];

  var _mask = "";
  switch (fone?.length) {
    case 12:
      _mask = "(999) 99999-9999";
      break;
    case 11:
      _mask = "(99) 99999-9999";
      break;
    case 10:
      _mask = "(99) 9999-9999";
      break;
    default:
      _mask = "(99) 9999-9999";
      break;
  }

  const fone_mask = mask(fone, _mask);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: name ? "flex-start" : "center",
      }}
    >
      <Avatar width={60} height={60} />
      <View style={{ marginLeft: 16 }}>
        <Text style={[styles.text, { fontWeight: "bold" }]}>{name}</Text>
        <Text style={styles.text}>{fone ? fone_mask : ""}</Text>
      </View>
    </View>
  );
}

function ProfileItensList({ icon, IconProvider, title, onPress }) {
  const isConnected = useNetInfo().isConnected;
  return (
    <View>
      <View
        style={{
          height: 1,
          backgroundColor: colors.separatorGray,
        }}
      ></View>

      <TouchableOpacity disabled={!isConnected} onPress={onPress}>
        <View
          style={{
            marginVertical: 16,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <IconProvider name={icon} size={18} color={isConnected ? colors.black : colors.gray} />
          <Text
            style={{
              fontSize: 16,
              marginLeft: 16,
              textTransform: "uppercase",
              fontWeight: "500",
              color: isConnected ? colors.black : colors.gray,
            }}
          >
            {title}
          </Text>
          <View
            style={{
              alignItems: "flex-end",
              flex: 1,
            }}
          >
            <MaterialCommunityIcons
              name={"chevron-right"}
              size={20}
              color={isConnected ? colors.black : colors.gray}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

function AccountScreen(props) {
  const { user, setUser } = useContext(AuthContext);
  const isRegistered = user?.username != null;
  const [showLog, setShowLog] = useState(false);

  //console.log(user);
  const logout = () => {
    setShowLog(false);
    setUser(true);
    props.navigation.navigate("Home");
    authStorage.removeToken();
    authStorage.removeUser();
  };

  const activationActions = () => {
    if (user?.providerActivationKey)
      props.navigation.navigate("ActivateInstitutionShowCode");
    else props.navigation.navigate("ActivateInstitutionCode");
  };

  const showActivation = () => {
    if (!isRegistered) return false;
    else if (user.role === "ROLE_CLIENT") return !user.active;
    else return true;
  };

  const profileItems = [
    {
      icon: "lock",
      show: isRegistered,
      IconProvider: MaterialCommunityIcons,
      title: "alterar senha",
      onPress: () => {
        props.navigation.navigate("PasswordRecovery", { user: user });
      },
    },
    {
      icon: "account",
      show: user.pluviometer != undefined,
      IconProvider: MaterialCommunityIcons,
      title: user.pluviometer
        ? "Dados do pluviômetro"
        : "Cadastrar pluviômetro",
      onPress: () => {
        props.navigation.navigate("PluviometerRegister");
      },
    },
    {
      icon: "bank",
      // show: showActivation(),
      show: false,
      IconProvider: MaterialCommunityIcons,
      title: "ATIVAR INSTITUIÇÃO",
      onPress: () => {
        activationActions();
      },
    },
    {
      icon: "information-outline",
      show: true,
      IconProvider: MaterialCommunityIcons,
      title: "SOBRE O PROJETO",
      onPress: () => {
        props.navigation.navigate("Abbout");
      },
    },
    {
      icon: "logout",
      show: isRegistered,
      IconProvider: MaterialCommunityIcons,
      title: "sair",
      onPress: () => {
        setShowLog(true);
      },
    },

    {
      icon: "login",
      show: !isRegistered,
      IconProvider: MaterialCommunityIcons,
      title: "Entrar",
      onPress: () => {
        setUser(false);
      },
    },
  ];

  return (
    <View style={{flex:1, width: "100%"}}>
    
    {/* <ConnectionWarning /> */}
    <Screen>
      <ScrollView>
        <View
          style={{
            padding: 16,
          }}
        >
          <UserHeader name={user.nickname} fone={user.username} />

          <View style={{ marginTop: 24 }}>
            {profileItems.map(
              ({ icon, IconProvider, title, onPress, show }) =>
                show && (
                  <View key={title}>
                    <ProfileItensList
                      icon={icon}
                      IconProvider={IconProvider}
                      title={title}
                      onPress={onPress}
                    />
                  </View>
                )
            )}
          </View>
          <ConfirmationModal
            show={showLog}
            icon={"log-out-outline"}
            description="Você tem certeza que deseja sair?"
            confirmationLabel="SIM"
            declineLabel="NÃO"
            onConfirm={logout}
            onDecline={() => setShowLog(false)}
          />
        </View>
      </ScrollView>
    </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
  },
});

export default AccountScreen;
