import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import colors from "../config/colors";

import NetInfo, { useNetInfo } from "@react-native-community/netinfo";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { dimensions } from "../config/dimensions";
function ConnectionWarning() {
  const reconnected = {
    title: "Conexão à internet restabelecida",
    color: colors.greenWarning,
  };
  const disconnected = {
    title: "Sem conexão à internet",
    color: colors.blueWarning,
  };

  const [warningObject, setWarningObject] = useState({
    title: disconnected.title,
    color: disconnected.color,
  });

  const [isConnected, setIsConnected] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        setShowWarning(true);
        setWarningObject({
            ...warningObject,
            title: disconnected.title,
            color: disconnected.color,
          });
      }
      else if (!isConnected && state.isConnected) {
        const timeout = setTimeout(() => {
          setShowWarning(false);
        }, 3000);
        setWarningObject({
          ...warningObject,
          title: reconnected.title,
          color: reconnected.color,
        });
      }
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, [useNetInfo().isConnected]);

  

  return (
    <>
      {showWarning && (
        <View
          style={{
            backgroundColor: warningObject.color,
            padding: 8,
            alignContent: "center",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: dimensions.text.default,
              color: colors.black,
            }}
          >
            {warningObject.title}
          </Text>
        </View>
      )}
    </>
  );
}

export default ConnectionWarning;
