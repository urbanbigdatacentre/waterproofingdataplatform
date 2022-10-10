import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MapFeedScreen from "../screens/MapFeedScreen";

const Stack = createStackNavigator();

const FeedNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Map" component={MapFeedScreen}
      options={{
        title: "Dados à Prova d'água",
        headerStyle: {
          backgroundColor: "white",
        },
      }} />
  </Stack.Navigator>
);

export default FeedNavigator;
