import { useEffect, useState } from "react";
import * as Location from "expo-location";

function useLocation(defaultLocation = { longitude: 0.0, latitude: 0.0 }) {
  const [location, setLocation] = useState(defaultLocation);

  const getLocation = async () => {
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync();

      if (!granted) return;

      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });

      setLocation({ lat: latitude, long: longitude, zoom: 16.5 });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return location;
}

const getLocation = async () => {
  try {
    const { granted } = await Location.requestForegroundPermissionsAsync();

    if (!granted) return;

    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation,
    });

    return { lat: latitude, long: longitude, zoom: 16.5 };
  } catch (error) {
    console.log(error);
  }
  return null;
};

export { useLocation, getLocation };
