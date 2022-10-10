import React, { useContext, useState, useEffect, memo } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import * as Location from "expo-location";

import colors from "../config/colors";

import { EventLocationContext } from "../context/EventLocationContext";
import { TouchableOpacity } from "react-native-gesture-handler";
import OpenStreetMap from "../components/map/OpenStreetMap";

// NOTE: Implementação posterior: É interessante adcionar um searchBox para que o usuário busque um endereço (google places autocomplete é uma api paga)
const MapFormScreen = (props) => {
  const context = useContext(EventLocationContext); //local do evento
  const [moveEndListener, setMoveEndListener] = useState(null);

  const getAddress = async (coordenadas) => {
    Location.setGoogleApiKey("AIzaSyD_wuuokS3SVczc8qSASrsBq0E5qIpdyMc");

    const address = await Location.reverseGeocodeAsync(coordenadas);
    // console.log(address);
    // console.log(coordenadas);
    if (address[0] != undefined) {
      var street = address[0].street == null ? "" : address[0].street;
      var number = address[0].name == null ? "" : ", " + address[0].name;
      var district =
        address[0].district == null ? "" : "\n" + address[0].district;
      return street + number + district;
    } else {
      //Quando o usuário não da permissão de acesso da localização o geoCode retorna um array vazio
      return "Não foi possível carregar endereço";
    }
  };

  const setLocation = () => {
    getAddress(moveEndListener).then((addr) => {
      if (props.route.params && props.route.params.setLocationAddr){
        props.route.params.setLocationAddr(addr);
        if(props.route.params.setGeoLocation){
          props.route.params.setGeoLocation(moveEndListener);
        }}
      else
        context.saveNewLocation(addr, moveEndListener);
    });

    props.navigation.goBack(null);
  };

  //leva o mapa pra localização escolhida pelo usuário
  const moveLocation = (l) => {
    // console.log(l);
    setMoveEndListener(l);
    // setPosition({
    //   lat: l["latitude"],
    //   long: l["longitude"],
    //   zoom: 16.5,
    // })
  };

  return (
    <View style={styles.container}>
      <OpenStreetMap
        moveEndListener={(e) => moveLocation(e)}
        centerUserLocation={true}
        isForm={true}
      />
      <View style={styles.markerFixed}>
        <Image
          style={styles.marker}
          resizeMode="contain"
          source={require("../assets/map-marker.png")}
        />
      </View>

      <View style={styles.submit_btn}>
        <TouchableOpacity onPress={() => setLocation()}>
          <View style={styles.button}>
            <Text style={styles.text}>Confirmar</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  submit_btn: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 20,
  },
  container: {
    backgroundColor: colors.black,
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
  },
  button: {
    backgroundColor: "#1976D2",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 42,
    marginVertical: 10,
    textAlign: "center",
  },
  markerFixed: {
    alignSelf: "center",
    justifyContent: "center",
    position: "absolute",
    flexDirection: "row",
    alignItems: "flex-start",
    height: "13%",
    width: 38,
  },
  text: {
    color: colors.white,
    fontSize: 16,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  marker: {
    height: "50%",
    width: 40,
  },
});

export default MapFormScreen;
