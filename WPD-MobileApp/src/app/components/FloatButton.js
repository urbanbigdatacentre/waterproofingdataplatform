import React, { useContext, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  PixelRatio,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";

import colors from "../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { dimensions } from "../config/dimensions";
import { MapDataContext } from "../context/MapDataContext";
import MenuItens from "./MenuItens";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;


function FloatButton(props) {
  const animation = useRef(new Animated.Value(0)).current;

  const [open, setOpen] = useState(false);
  const context = useContext(MapDataContext);

  const toggleMenu = () => {
    const value = open ? 0 : 1;

    Animated.spring(animation, {
      toValue: value,
      friction: 6,
      useNativeDriver: true,
    }).start();
    const json = JSON.stringify(context.layers);
    const obj = JSON.parse(json);

    setLayers(obj);
    setOpen(!open);
  };

  /*--------------------------------------------------------MENU----------------------------------------------------- */
  const [changed, setChanged] = useState(true);
  const [layers, setLayers] = useState({
    values:
      [
        {
          id: 1,
          name: 'Chuva',
          isSelected: context.layers.values[0].isSelected,
          image: require("../assets/dataMenu/chuva.png"),
        },
        {
          id: 2,
          name: 'Ponto de alagamento',
          isSelected: context.layers.values[1].isSelected,
          image: require("../assets/dataMenu/alagamento.png"),
        },
        {
          id: 3,
          name: 'Pluviômetro artesanal',
          isSelected: context.layers.values[2].isSelected,
          image: require("../assets/dataMenu/pluviometroArtesanal.png"),
        },
        {
          id: 4,
          name: 'Pluviômetro oficial',
          isSelected: context.layers.values[3].isSelected,
          image: require("../assets/dataMenu/pluviometroOficial.png"),
        },
        {
          id: 5,
          name: 'Água no rio',
          isSelected: context.layers.values[4].isSelected,
          image: require("../assets/dataMenu/aguaRio.png"),
        },
        {
          id: 6,
          name: 'Área de inundação',
          isSelected: context.layers.values[5].isSelected,
          image: require("../assets/dataMenu/areaInundacao.png"),
        },
      ]
  });

  const selectedItens = (item) => {
    item.isSelected = !item.isSelected;
    setChanged(!changed);
  }

  const renderItem = ({ item }) => {
    const icon = item.isSelected ? "check-box" : "check-box-outline-blank";
    return (
      <MenuItens
        item={item}
        onPress={() => selectedItens(item)}
        icon={icon}
        image={item.image}
      />
    );
  };

  const applyLayers = () => {
    context.setChanges(layers.values);
    setOpen(false);
  }

  const DataMenu = () => {
    return (
      <View>
        <View style={styles.Menucontainer} >
          <View style={{
            flex: 1,
            flexDirection: "column",
            height: (PixelRatio.get() >= 3 ? screenHeight * 0.75 : screenHeight * 0.80), //solução temporária, procurar soluções pro menu se ajustar melhor ao layout
            paddingTop: (PixelRatio.get() > 3 ? screenHeight * 0.10 : 5)
          }}>
            <View style={{
              flex: 0.05,
              marginTop: screenHeight * 0.09,
              paddingBottom: 10,
              zIndex: 3,
              justifyContent: "center"
            }}>
              <Text style={styles.menuLabel}>
                Selecione os dados:
              </Text>
            </View>
            <View
              style={{ flex: 0.85, flexGrow: 0.85, marginTop: 2 }}>
              <FlatList
                data={layers.values}
                keyExtractor={(datas) => datas.id.toString()}
                renderItem={renderItem}
                extraData={changed}
              />
            </View>
            <View style={styles.submit_btn}>
              <TouchableOpacity onPress={() => applyLayers()}>
                <View style={styles.button}>
                  <Text style={styles.textBtn}>Confirmar</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
  /*------------------------------------------------------------------------------------------------------------------------ */

  return (
    <View style={[styles.container]}>
      {open && (<View style={{
        width: screenWidth * 0.70,
      }}>
        <Animated.View>
          {DataMenu()}
        </Animated.View>
      </View>)}
      <View style={{ flex: 0.10, margin: 12, alignSelf: "flex-end" }}>
        <TouchableWithoutFeedback onPress={toggleMenu}>
          <Animated.View style={[styles.floatButton, styles.menu]}>
            <MaterialCommunityIcons
              name="layers-plus"
              size={36}
              color={colors.white}
            />
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  floatButton: {
    width: 50,
    height: 50,
    borderRadius: 6,
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowOffset: {
      height: 10,
    },
    padding: 3,
  },
  menu: {
    backgroundColor: colors.primary,
  },
  Menucontainer: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
    backgroundColor: colors.white,
  },
  submit_btn: {
    bottom: 0,
    width: "100%",
    padding: 20,
    flex: 0.10
  },
  button: {
    backgroundColor: "#1976D2",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 42,
    textAlign: "center",
  },
  textBtn: {
    color: colors.white,
    fontSize: 16,
    textTransform: "uppercase",
    fontWeight: "bold",
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
  },
  menuLabel: {
    color: colors.lightBlue,
    fontSize: 16,
    fontWeight: "bold",
    padding: 10,
    backgroundColor: colors.white,
  },
});

export default FloatButton;
