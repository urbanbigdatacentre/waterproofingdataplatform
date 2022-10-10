import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DataScreen from "../screens/DataScreen";

const Stack = createStackNavigator();

const DataNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Data"
      component={DataScreen}
      options={{
        title: "Dados",
        headerStyle: {
          backgroundColor: "white",
        },
      }}
    />
  </Stack.Navigator>
);

export default DataNavigator;
