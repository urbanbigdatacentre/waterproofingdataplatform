import React, { useState, createContext, useContext, useEffect } from "react"

export const MapRefContext = createContext();

const MapRefProvider = ({ children }) => {

    //problema:  as vzs renderiza antes de carregar a localização correta do usuário 
    const [mapRef, setMapRef] = useState();

    return (
        <MapRefContext.Provider value={{
            mapRef,
            setMapRef,
        }}>
            {children}
        </MapRefContext.Provider>
    )
}
export default MapRefProvider;