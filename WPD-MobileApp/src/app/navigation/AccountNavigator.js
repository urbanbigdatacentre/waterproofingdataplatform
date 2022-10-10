import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AccountScreen from "../screens/AccountScreen";
import PluviometerRegisterScreen from "../screens/PluviometerRegisterScreen";
import MapFormScreen from "../screens/MapFormScreen";
import Abbout from "../screens/Abbout";
import ActivateInstitution from "../screens/ActivateInstitution";
import UpdatePassword from "../screens/UpdatePassword";
import EditUserData from "../screens/EditUserData";
import ActivateInstitutionCode from "../screens/ActivateInstitutionCode";
import ActivateInstitutionShowCode from "../screens/ActivateInstitutionShowCode";
import PasswordRecovery from "../screens/PasswordRecoveryScreen";
import PasswordRecoveryChangePswd from "../screens/PasswordRecoveryChangePswdScreen";

const Stack = createStackNavigator();

const AccountNavigator = () => (
  <Stack.Navigator initialRouteName="Profile">
    <Stack.Screen
      name="Profile"
      component={AccountScreen}
      options={{
        title: "Perfil",
        headerStyle: {
          backgroundColor: "white",
        },
      }}
    />

    <Stack.Screen
      name="PluviometerRegister"
      component={PluviometerRegisterScreen}
      options={{
        title: "",
        headerStyle: {
          backgroundColor: "white",
        },
      }}
    />
    <Stack.Screen
      name="Abbout"
      component={Abbout}
      options={{
        title: "",
        headerStyle: {
          backgroundColor: "white",
        },
      }}
    />
    <Stack.Screen
      name="ActivateInstitution"
      component={ActivateInstitution}
      options={{
        title: "",
        headerStyle: {
          backgroundColor: "white",
        },
      }}
    />
    <Stack.Screen
      name="ActivateInstitutionCode"
      component={ActivateInstitutionCode}
      initialParams={{ instRole : "" }}
      options={{
        title: "",
        headerStyle: {
          backgroundColor: "white",
        },
      }}
    />
    <Stack.Screen
      name="ActivateInstitutionShowCode"
      component={ActivateInstitutionShowCode}
      initialParams={{ code: "" }}
      options={{
        title: "",
        headerStyle: {
          backgroundColor: "white",
        },
      }}
    />
    <Stack.Screen
      name="PasswordRecovery"
      component={PasswordRecovery}
      initialParams={{ user : {}, title: "Alterar senha" }}
      options={{ headerTitle: "" }}
    />

    <Stack.Screen
      name="PasswordRecoveryChangePswd"
      component={PasswordRecoveryChangePswd}
      initialParams={{ authToken : "" }}
      options={{ headerTitle: "" }}
    />


    <Stack.Screen
      name="EditUserData"
      component={EditUserData}
      options={{
        title: "",
        headerStyle: {
          backgroundColor: "white",
        },
      }}
    />
    <Stack.Screen
      name="FormMap"
      component={MapFormScreen}
      initialParams={{ setLocationAddr: null }}
      options={{
        title: "Voltar",
        headerStyle: {
          backgroundColor: "white",
        },
      }}
    /> 


  </Stack.Navigator>
);

export default AccountNavigator;
