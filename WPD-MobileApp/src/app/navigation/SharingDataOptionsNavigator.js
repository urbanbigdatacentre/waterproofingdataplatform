import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import RainSharingDataScreen from '../screens/RainSharingDataScreen';
import RiverFloodSharingDataScreen from '../screens/RiverFloodSharingDataScreen';
import SharingFloodZonesScreen from '../screens/SharingFloodZonesScreen';
import PluviometerSharingDataScreen from '../screens/PluviometerSharingDataScreen';
import SharingDataNavigator from './SharingDataNavigator';
import MapFormScreen from '../screens/MapFormScreen';

const Stack = createStackNavigator();

function SharingDataOptionsNavigator() {
    return (
    <Stack.Navigator initialRouteName="SharingData">
      <Stack.Screen
        name="Voltar"
        component={SharingDataNavigator}
        options={{
            headerShown: false
        }}
      />
      <Stack.Screen
        name="RainSharingData"
        component={RainSharingDataScreen}
        options={{
          title: "Chuva",
          headerStyle: {
            backgroundColor: "white",
          },
        }}
      />
      <Stack.Screen
        name="FloodSharingData"
        component={SharingFloodZonesScreen}
        options={{
          title: "Área de alagamento",
          headerStyle: {
            backgroundColor: "white",
          },
        }}
      />
      <Stack.Screen
        name="PluviometerSharingData"
        component={PluviometerSharingDataScreen}
        options={{
          title: "Pluviômetro",
          headerStyle: {
            backgroundColor: "white",
          },
        }}
      />
      <Stack.Screen
        name="RiverFloodData"
        component={RiverFloodSharingDataScreen}
        options={{
          title: "Nível de água no rio",
          headerStyle: {
            backgroundColor: "white",
          },
        }}
      />
      <Stack.Screen
        name="FormMap"
        component={MapFormScreen}
        options={{
          title: "Selecione o ponto no mapa",
          headerStyle: {
            backgroundColor: "white",
          },
        }}
      />
    </Stack.Navigator>
  );
}
export default SharingDataOptionsNavigator;
