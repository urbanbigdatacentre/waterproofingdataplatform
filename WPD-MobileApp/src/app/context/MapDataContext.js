import React, { useState, createContext } from "react"


export const MapDataContext = createContext();
// 1/3(Ana): Preciso melhorar esse código

const MapDataProvider = ({ children }) => {

    const [layers, setLayers] = useState({
        values:
            [
                {
                    id: 1,
                    name: 'Chuva',
                    isSelected: true,
                    image: require("../assets/dataMenu/chuva.png"),
                },
                {
                    id: 2,
                    name: 'Ponto de alagamento',
                    isSelected: true,
                    image: require("../assets/dataMenu/alagamento.png"),
                },
                {
                    id: 3,
                    name: 'Pluviômetro artesanal',
                    isSelected: true,
                    image: require("../assets/dataMenu/pluviometroArtesanal.png"),
                },
                {
                    id: 4,
                    name: 'Pluviômetro oficial',
                    isSelected: false,
                    image: require("../assets/dataMenu/pluviometroOficial.png"),
                },
                {
                    id: 5,
                    name: 'Água no rio',
                    isSelected: true,
                    image: require("../assets/dataMenu/aguaRio.png"),
                },
                {
                    id: 6,
                    name: 'Área de inundação',
                    isSelected: false,
                    image: require("../assets/dataMenu/areaInundacao.png"),
                },
            ]
    });


    //chuva
    const [rain, setRain] = useState(true);

    //Ponto de alagamento
    const [flood, setFlood] = useState(true);

    //Pluviometro artesanal
    const [pluviometer, setPluviometer] = useState(true);

    //Água no rio
    const [river, setRiver] = useState(true);

    //Pluviometro oficial
    const [officialPluviometer, setOfficialPluviometer] = useState(false);


    //Área de inundação
    const [floodAreas, setFloodAreas] = useState(false);

    //1/3: harcoding 
    const setChanges = (data) => {
        const json = JSON.stringify(data);
        const obj = JSON.parse(json);

        layers.values = obj;
        setRain(layers.values[0].isSelected);
        setFlood(layers.values[1].isSelected);
        setPluviometer(layers.values[2].isSelected);
        setOfficialPluviometer(layers.values[3].isSelected);
        setRiver(layers.values[4].isSelected);
        setFloodAreas(layers.values[5].isSelected);

    }


    return (
        <MapDataContext.Provider value={{
            rain,
            flood,
            pluviometer,
            river,
            officialPluviometer,
            floodAreas,
            layers,
            setChanges,

        }}>
            {children}
        </MapDataContext.Provider>
    )
}
export default MapDataProvider;