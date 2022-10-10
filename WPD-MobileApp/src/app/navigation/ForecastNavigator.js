import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ForecastScreen from "../screens/ForecastScreen";

const Stack = createStackNavigator();

const ForecastNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Previsão do Tempo"
      component={ForecastScreen}
      options={{
        title: "Previsão do Tempo",
        headerStyle: {
          backgroundColor: "white",
        },
      }}
    />
  </Stack.Navigator>
);

export default ForecastNavigator;
