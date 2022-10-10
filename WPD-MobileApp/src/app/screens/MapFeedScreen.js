import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import OpenStreetMap from "../components/map/OpenStreetMap";
import attachFocusToQuery from "../hooks/useFocus";
import HeaderBarMenu from "../components/HeaderBarMenu";
import useSocketMarkers from "../hooks/useSocketMarkers";
import LoadingMarkersModal from "../components/LoadingMarkersModal";
import NoGPSError from "../components/NoGPSError";

import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import ConnectionWarning from "../components/ConnectionWarning";

export default function MapFeedScreen(props) {
  HeaderBarMenu(props.navigation);

  const [dataOptionsToShow, setDataOptionsToShow] = useState({
    oficial: {
      automaticPluviometer: false,
      susceptibilityAreas: false,
    },
    citzen: {
      floodRisk: false,
      pluviometer: true,
      rain: true,
      floodZones: true,
      riverFlood: true,
    },
  });  


  const markers = useSocketMarkers(!(useNetInfo().isConnected));

 // console.log("============= qtd markers  " + markers.markers.size + " ================" )

  // console.log("location:  " + JSON.stringify(global.location))
  return (
    <View style={{flex:1, width: "100%"}}>
    
    {/* <ConnectionWarning /> */}
   { (global.location) ? (
    <View style={styles.container}>
      <OpenStreetMap
        markers={markers}
        centerUserLocation={true}
        dataOptionsToShow={dataOptionsToShow}
        setDataOptionsToShow={setDataOptionsToShow}
      />  
      <LoadingMarkersModal
        show={markers.markers.size <= 0}/>
    </View>
    ):(
      <NoGPSError/>
    )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
});
