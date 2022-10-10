import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";

import navigationTheme from "./app/navigation/navigationTheme";
import "./app/config/globals.js";
import AppLoading from "expo-app-loading";
import FlashMessage, {
  showMessage,
  hideMessage,
} from "react-native-flash-message";
import AppNavigator from "./app/navigation/AppNavigator";
import EventLocationProvider from "./app/context/EventLocationContext";
import CurrentLocationProvider from "./app/context/CurrentLocationContext";
import AuthNavigator from "./app/navigation/AuthNavigator";
import { AuthContext } from "./app/auth/context";
import authStorage from "./app/auth/storage";
import MapDataProvider from "./app/context/MapDataContext";
import { getLocation } from "./app/hooks/useLocation";
import { useFiltering } from "./app/hooks/useFiltering";
import NoInternetConnectionScreen from "./app/screens/NoInternetConnectionScreen";
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import getPluviometerStation from "./app/hooks/usePluviometricStation";
import cache from "./app/utility/cache";
import sendFormAnswer from "./app/api/Ingestion/sendFormAnswer";
import { connect } from "formik";
import colors from "./app/config/colors";
import { dimensions } from "./app/config/dimensions";

export default function App() {
  const [user, setUser] = useState();
  const [pluviometerStation, setPluviometerStation] = useState(undefined);
  const [isReady, setIsReady] = useState();
  const [isReconnected, setIsReconnected] = useState(true);

  const netInfo = useNetInfo();

  function notImplemented(color, message, duration, autoHide) {
    showMessage({
      message: message,
      autoHide: autoHide,
      duration: duration,
      type: "default",
      backgroundColor: color, // background color
      color: colors.black, // text color
      textStyle: {
        textAlign: "center",
        alignSelf: "center",
        fontSize: dimensions.text.default,
      },
    });
  }

  useEffect(async () => {
    if (netInfo.isInternetReachable) {
      const cachedForms = await cache.get("sendforms");
      if (!isReconnected) {
        notImplemented(
          colors.greenWarning,
          "Conexão à internet restabelecida",
          3000,
          true
        );
        setIsReconnected(true);
      }

      if (cachedForms) {
        const arrayForms = JSON.parse(cachedForms);
        arrayForms.forEach(async (element) => {
          const isSent = await sendFormAnswer(
            element,
            netInfo.isInternetReachable,
            null
          );

          if (isSent.ok) {
            cache.clear("sendforms");
          }
        });
      }
    } else {
      notImplemented(colors.blueWarning, "Sem conexão à internet", null, false);
      setIsReconnected(false);
    }
  }, [netInfo.isInternetReachable]);

  useEffect(() => {
    if (user?.username != null) {
      if (pluviometerStation == undefined) {
        getPluviometerStation(user.id, setPluviometerStation);
      }
      authStorage.setUser(user);
    } else {
      setPluviometerStation(undefined);
    }
  }, [user]);

  useEffect(() => {
    if (user?.username != null) {
      setUser({ ...user, pluviometer: pluviometerStation });
    }
  }, [pluviometerStation]);

  const restoreUser = async () => {
    const storageUser = await authStorage.getUser();
    if (storageUser) setUser(storageUser);

    global.location = await getLocation();
  };

  if (!isReady) {
    return (
      <AppLoading
        startAsync={restoreUser}
        onFinish={() => setIsReady(true)}
        onError={(e) => console.log(e)}
      />
    );
  } else {
    if (global.formsSockets === undefined)
      global.formsSockets = useFiltering(
        global.location || global.defaultLocation
      );

    return (
      <AuthContext.Provider
        value={{
          user,
          setUser,
        }}
      >
        <CurrentLocationProvider>
          <EventLocationProvider>
            <MapDataProvider>
              <NavigationContainer theme={navigationTheme}>
                {user ? <AppNavigator /> : <AuthNavigator />}
                <FlashMessage position="top" />
              </NavigationContainer>
            </MapDataProvider>
          </EventLocationProvider>
        </CurrentLocationProvider>
      </AuthContext.Provider>
    );
  }
}
