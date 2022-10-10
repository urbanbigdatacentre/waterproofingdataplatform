import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import PasswordRecovery from "../screens/PasswordRecoveryScreen"
import colors from "../config/colors";
import UserAgreement from "../screens/UserAgreement";
import PasswordRecoveryChangePswd from "../screens/PasswordRecoveryChangePswdScreen";

const Stack = createStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Register"
      component={RegisterScreen}
      options={{ headerTitle: "" }}
    />
    <Stack.Screen
      name="UserAgreement"
      component={UserAgreement}
      options={{ headerTitle: "" }}
    />

    <Stack.Screen
      name="PasswordRecovery"
      component={PasswordRecovery}
      initialParams={{ user : {}, title: "Recuperação de senha" }}
      options={{ headerTitle: "" }}
    />

    <Stack.Screen
      name="PasswordRecoveryChangePswd"
      component={PasswordRecoveryChangePswd}
      initialParams={{ authToken : "" }}
      options={{ headerTitle: "" }}
    />

  </Stack.Navigator>
);

export default AuthNavigator;
