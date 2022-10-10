import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Screen from "../components/Screen";
import { dimensions, scaleDimsFromWidth } from "../config/dimensions";
import colors from "../config/colors/";
import { LineChart } from "react-native-chart-kit";

import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from "@expo/vector-icons";
import { Dimensions } from "react-native";


const dims = scaleDimsFromWidth(85, 85, 25);
const screenWidth = (Dimensions.get("window").width) * 0.95;
const screenHeight = Dimensions.get('window').height * 0.30;

const data = { //substituir por dados da API
    labels: ["01/01", "01/02", "01/03", "01/04", "01/05"],
    datasets: [
        {
            data: [0, 10, 20, 25, 5 ],
            color: () => colors.gold, 
            strokeWidth: 2,
        }
    ],

    legend: ["Registros pluviométricos"] 
};
const chartConfig = {
    backgroundGradientFrom: 0,
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0,
    color: () => colors.primary,
    strokeWidth: 2, // optional, default 3
    useShadowColorFromDataset: true,   
    propsForLabels: {
        fontSize: 12,        
    } 
    
};


function PluviometerDiaryScreen(props) {
    //Substituir por dados vindos da API
    const school = "Escola registrada do pluviômetro";
    const profile = "Tipo de perfil do usuário";
    const local = "Endereço registrado do pluviômetro";

    return (
        <Screen style={styles.container}>
            <View style={{ flex: 1, alignItems: "center", flexDirection: "row"}}>
                <LineChart
                    data={data}
                    width={screenWidth}
                    height={screenHeight}
                    chartConfig={chartConfig}
                    withVerticalLines={false}
                    yAxisSuffix="mm"
                />
                <Text style={{ textAlign:"center" }}>Data</Text>
            </View>
            <View
                style={{
                    flex: 1,
                    flexDirection: "column",
                    alignContent: "flex-start",
                    justifyContent: "space-between",
                }}>
                {/* Endereço */}
                < View style={{ flex: 1 }}>
                    <View style={styles.location}>
                        <View style={styles.mapIcon}>
                            <MaterialIcons
                                name="location-on"
                                size={28}
                                color="white"
                                alignItems="center"
                                alignContent="center"
                            />
                        </View>
                        <View style={styles.adressText}>
                            <Text style={{
                                fontSize: dimensions.text.default,
                            }}>
                                {local}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Escola */}
                <View style={{ flex: 1 }}>
                    <View style={styles.location}>
                        <View style={styles.mapIcon}>
                            <FontAwesome5
                                name="university"
                                size={28}
                                color="white"
                                alignItems="center"
                                alignContent="center"
                            />
                        </View>
                        <View style={styles.adressText}>
                            <Text style={{
                                fontSize: dimensions.text.default,
                            }}>
                                {school}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Usuário */}
                <View style={{ flex: 1 }}>
                    <View style={styles.location}>
                        <View style={styles.mapIcon}>
                            <FontAwesome5
                                name="user-alt"
                                size={28}
                                color="white"
                                alignItems="center"
                                alignContent="center"
                            />
                        </View>
                        <View style={styles.adressText}>
                            <Text style={{
                                fontSize: dimensions.text.default,
                            }}>
                                {profile}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </Screen >
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1,
    },
    image: {
        width: dims.width * 0.8,
        height: dims.height * 0.8,
        justifyContent: "center",
        alignItems: "center",
    },
    label: {
        fontSize: dimensions.text.secondary,
        fontWeight: "bold",
        textAlign: "left",
        color: colors.lightBlue,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        color: colors.primary,
    },
    location: {
        width: "100%",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
    },
    adressText: {
        flex: 0.90,
        height: "100%",
        flexDirection: "column",
        justifyContent: "center",
        paddingLeft: 5,
    },
    mapIcon: {
        backgroundColor: colors.primary,
        padding: 8,
        width: 20,
        alignItems: "center",
        borderRadius: 5,
        flex: 0.10,
        marginTop: 8,
    },

});

export default PluviometerDiaryScreen;
