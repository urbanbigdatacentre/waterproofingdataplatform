import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SharingDataScreen from "../screens/SharingDataScreen";

const Stack = createStackNavigator();

const SharingDataNavigator = () => (
<Stack.Navigator>
    <Stack.Screen name="Enviar uma informação" component={SharingDataScreen}
    options={{
        title: "Enviar uma informação",
        headerStyle: {
          backgroundColor: "white",
        },
      }} />
  </Stack.Navigator>
);

export default SharingDataNavigator;