import React, { useState, createContext, useContext, useEffect } from "react"
import { CurrentLocationContext } from "./CurrentLocationContext";

export const EventLocationContext = createContext();

const EventLocationProvider = ({ children }) => {

    const context = useContext(CurrentLocationContext);

    //problema:  as vzs renderiza antes de carregar a localização correta do usuário 
    const [eventLocation, setEventLocation] = useState(context.currentLocation);
    const [eventCoordinates, setEventCoordinates] = useState(context.currentCoordinates);


    //Função chamada em MapFormScreen após o usuário definir a nova localização
    const saveNewLocation = (local, coordinates) => {
        setEventLocation(local);
        setEventCoordinates(coordinates);
    }


    const defaultLocation = () =>{
        setEventCoordinates(context.currentCoordinates);
        setEventLocation(context.currentLocation);
    }

    return (
        <EventLocationContext.Provider value={{
            eventLocation,
            eventCoordinates,
            saveNewLocation,
            defaultLocation,
        }}>
            {children}
        </EventLocationContext.Provider>
    )
}
export default EventLocationProvider;