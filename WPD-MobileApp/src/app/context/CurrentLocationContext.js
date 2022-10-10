import React, { useState, createContext, useEffect } from "react"
import * as Location from "expo-location";


export const CurrentLocationContext = createContext();

const CurrentLocationProvider = ({ children }) => {
    const [currentLocation, setCurrentLocation] = useState("endereço usuário");
    const [currentCoordinates, setCurrentCoordinates] = useState({ longitude: 0.0, latitude: 0.0 });

    //get user current location coordinates
    const getCoordinates = async () => {
        try {
            const { granted } = await Location.requestForegroundPermissionsAsync();

            if (!granted) return;

            const {
                coords: { latitude, longitude },
            } = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Highest,
            });

            setCurrentCoordinates({ latitude, longitude });

            getAddress({ latitude, longitude });
            
        } catch (error) {
            console.log(error);
        }
    };

    //get user current location address
    const getAddress = async (coordenadas) => {
        Location.setGoogleApiKey("AIzaSyD_wuuokS3SVczc8qSASrsBq0E5qIpdyMc");
        

        const address = await Location.reverseGeocodeAsync(coordenadas);
        if (address[0] != undefined) {
            var street = (address[0].street == null ? "" : address[0].street);
            var number = (address[0].name == null ? "" : ", " + address[0].name);
            var district = (address[0].district == null ? "" : "\n" + address[0].district);
            setCurrentLocation(street + number +  district , coordenadas.x);
        }
        else{//Quando o usuário não da permissão de acesso da localização o geoCode retorna um array vazio
            setCurrentLocation("Erro ao carregar localização", coordenadas.x);
        }        
    };




    useEffect(() => {
        getCoordinates();
        //console.log(currentCoordinates.latitude);
    }, []);
    const getCurrentLocation = (coordenadas) => {
        setCurrentCoordinates(coordenadas);
    }


    return (
        <CurrentLocationContext.Provider value={{
            currentLocation,
            currentCoordinates,
            getCurrentLocation,
        }}>
            {children}
        </CurrentLocationContext.Provider>
    )
}
export default CurrentLocationProvider;
