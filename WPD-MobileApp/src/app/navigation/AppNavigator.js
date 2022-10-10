import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AccountNavigator from "./AccountNavigator";
import FeedNavigator from "./FeedNavigator";
import MessagesNavigator from "./MessagesNavigator";
import ForecastNavigator from "./ForecastNavigator";
import NewListingButton from "./NewListingButton";
import SharingDataOptionsNavigator from "./SharingDataOptionsNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Abbout from "../screens/Abbout";
import colors from "../config/colors";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabScreens() {
  return (
    <Tab.Navigator
      style={{ backgroundColor: "black" }}
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
      }}
    >
      <Tab.Screen
        name="Home"
        component={FeedNavigator}          
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="SharingData"
        component={SharingDataOptionsNavigator}
        options={({ navigation }) => ({
          headerShown: false,
          tabBarButton: () => (
            <NewListingButton
              onPress={() =>
                navigation.navigate("SharingData", {
                  screen: "Voltar",
                  initial: false,
                })
              }
            />
          ),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="plus-circle"
              color={color}
              size={size}
            />
          ),
        })}
      />

      <Tab.Screen
        name="Perfil"
        component={AccountNavigator}        
        options={{
          unmountOnBlur: true,
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const AppNavigator = () => (
  <NavigationContainer independent={true}>
    <Stack.Navigator>
      <Stack.Screen
        name="tab"
        options={{ headerShown: false }}
        component={TabScreens}
      />

      <Stack.Screen
        name="Abbout"
        component={Abbout}
        options={{
          title: "Dados à Prova d'água",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="information-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
