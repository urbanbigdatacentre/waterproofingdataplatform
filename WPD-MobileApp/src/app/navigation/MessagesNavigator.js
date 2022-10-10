import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MessagesScreen from "../screens/MessagesScreen";

const Stack = createStackNavigator();

const MessagesNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Notificação" component={MessagesScreen}
      options={{
        title: "Notificação",
        headerStyle: {
          backgroundColor: "white",
        },
      }} />
  </Stack.Navigator>
);

export default MessagesNavigator;
