import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

import colors from "../config/colors";
import { dimensions } from "../config/dimensions";

function MenuItens({ item, onPress, icon, image }) {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.item]}>
            <View style={{ flexDirection: "row", flex: 1, paddingTop: 20, justifyContent: "center" }}>
                <View style={{ flexDirection: "row", flex: 0.15, justifyContent:"center" }}>
                    <Image
                        style={{ width: 30, height: 25 }}
                        resizeMode= "contain"
                        source={image}
                    />
                </View>
                <View style={{ flexDirection: "row", flex: 0.70 }}>
                    <Text style={[styles.text]}>{item.name}</Text>
                </View>
                <View
                    style={{ flex: 0.15, alignSelf: "flex-start", flexDirection: "row", justifyContent: "flex-start" }}>
                    <MaterialIcons name={icon} size={24} color={colors.lightBlue} />
                </View>
            </View>
        </TouchableOpacity>
    );
};
export default MenuItens;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        alignSelf: "flex-end",
        backgroundColor: colors.white,
    },
    text: {
        color: colors.lightBlue,
        fontSize: 14,
        fontWeight: "bold",
    },
    item: {
        color: colors.lightBlue,
        fontSize: dimensions.text.tertiary,
        fontWeight: "bold",
    }

});



