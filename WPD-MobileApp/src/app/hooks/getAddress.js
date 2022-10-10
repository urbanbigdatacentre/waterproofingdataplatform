import React, { useEffect, useState } from "react";
import * as Location from 'expo-location';

export default function getAddress(coordenadas) {
    const [location, setLocation] = useState(coordenadas.x);

    const convert = async () => {

        Location.setGoogleApiKey("AIzaSyD_wuuokS3SVczc8qSASrsBq0E5qIpdyMc");

        global.eventAddress = await Location.reverseGeocodeAsync(location);
        console.log(global.eventAddress);

        global.eventCoordinates = coordenadas.x;
    };

    useEffect(() => {
        convert();
    }, []);

    return location;
}
