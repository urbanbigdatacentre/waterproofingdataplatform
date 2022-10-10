import React, { useContext } from "react";
import { View } from "react-native";
import { Polygon } from "react-native-maps";
import { CurrentLocationContext } from "../context/CurrentLocationContext";

export default function MapPolygons() {
    const context = useContext(CurrentLocationContext);
    const location = context.currentCoordinates;


    //Coordenadas dos poligonos das áreas de inundação (substituir por valores da API)
    const coordinates1 = [
        {
            latitude: location["latitude"] - 0.001,
            longitude: location["longitude"] + 0.00002
        },
        {
            latitude: (location.latitude) - 0.0002,
            longitude: (location.longitude) + 0.0001
        },
        {
            latitude: (location.latitude) + 0.001,
            longitude: (location.longitude) - 0.00002
        },
        {
            latitude: (location.latitude) + 0.0002,
            longitude: (location.longitude) - 0.001
        }
    ];
    const coordinates2 = [
        {
            latitude: location["latitude"] + 0.0010,
            longitude: location["longitude"] - 0.0007
        },
        {
            latitude: (location.latitude) + 0.0006,
            longitude: (location.longitude) - 0.0006
        },
        {
            latitude: (location.latitude) + 0.17,
            longitude: (location.longitude) - 0.00225
        },
        {
            latitude: (location.latitude) + 0.001,
            longitude: (location.longitude) - 0.00212
        }
    ]
    return (
        <View>
            <Polygon
                coordinates={coordinates1}
                // hole={hole}
                strokeColor="rgba(25, 118, 210,0.2)"
                fillColor="rgba(25, 118, 210,0.5)"
                strokeWidth={5}
            />
            <Polygon
                coordinates={coordinates2}
                // hole={hole}
                strokeColor="rgba(25, 118, 210,0.2)"
                fillColor="rgba(25, 118, 210,0.5)"
                strokeWidth={5}
            />
        </View>
    );
}


