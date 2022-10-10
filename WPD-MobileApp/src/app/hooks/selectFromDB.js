import { useState, useEffect, useReducer, useContext } from "react";

import { CurrentLocationContext } from "../context/CurrentLocationContext";
import "../config/globals";
import assets from "../config/assets";
import PinIntransitavel from "../assets/floodZonesAssets/PinIntransitavel";
import PinTransitavel from "../assets/floodZonesAssets/PinTransitavel";


const custom_assets = {
  pluviometer: assets.pluviometer,
  officialPluviometer: assets.officialPluviometer,
  floodZones: assets.floodZones,
  riverLevel: ["low", "normal", "high", "flooding"].map((key) => {
    return assets.riverLevel[key];
  }),
  rainLevel: [
    "rain_0_5",
    "rain_1_5",
    "rain_2_5",
    "rain_3_5",
  ].map((key) => {
    return assets.rainLevel[key];
  }),
};

const custom_assets_pin = {
  pluviometer: assets.pluviometer_pin,
  officialPluviometer: assets.officialPluviometer_pin,
  floodZones: {
    passable: PinTransitavel,
    not_passable: PinIntransitavel,
  },
  riverLevel: ["low_pin", "normal_pin", "high_pin", "flooding_pin"].map(
    (key) => {
      return assets.riverLevel[key];
    }
  ),
  rainLevel: [
    "rain_0_5_pin",
    "rain_1_5_pin",
    "rain_2_5_pin",
    "rain_3_5_pin",
  ].map((key) => {
    return assets.rainLevel[key];
  }),
};

// NOTE: For debug pourposes, every icon will be placed some `offset` from
// another. In final release, offset must be assigned to 0.0
var offset = 0.0001;
var displacement = 0;

var ID = 0;

var fetched_data = {
  pluv: new Set(),
  flood: new Set(),
  rain: new Set(),
  river: new Set(),
};

function is_valid(id, category) {
  if (fetched_data[category].has(id)) {
    return false;
  } else {
    fetched_data[category].add(id);
  }
  return true;
}

function parseFloodZones(row) {
  if (!is_valid(row["Id"], "flood")) {
    return null;
  }

  // displacement += offset;
  return {
    ID: ++ID,
    name: "flood",
    title: row["Passable"] == 1 ? "Transponível" : "Intransponível",
    coordinate: {
      latitude: row["Latitude"],
      longitude: row["Longitude"] + displacement,
    },
    image:
      row["Passable"] == 1
        ? custom_assets_pin.floodZones.passable
        : custom_assets_pin.floodZones.not_passable,
    logo:
      row["Passable"] == 1
        ? custom_assets.floodZones.passable
        : custom_assets.floodZones.notPassable,
    description: row["Description"],
    date: row["Date"] + " | " + row["Time"],
    pictures: row["Images"],
    address: row["Address"],
  };
}

function parseRiverLevel(row) {
  if (!is_valid(row["Id"], "river")) {
    return null;
  }
  // console.log(JSON.stringify(row));
  // displacement += offset;
  const riverLevel = ["baixo", "normal", "alto", "transbordando"];
  const riverIdx = row["RiverIdx"];
  return {
    ID: ++ID,
    name: "river",
    title: "Rio " + riverLevel[riverIdx],
    coordinate: {
      latitude: row["Latitude"],
      longitude: row["Longitude"] + displacement,
    },
    image: custom_assets_pin.riverLevel[riverIdx],
    logo: custom_assets.riverLevel[riverIdx],
    description: row["Description"],
    date: row["Date"] + " | " + row["Time"],
    pictures: row["Images"],
    address: row["Address"],
  };
}

function parseRainLevel(row) {
  if (!is_valid(row["Id"], "rain")) {
    return null;
  }

  // displacement += offset;
  const rainLevel = [
    "Sem chuva",
    "Chuva fraca",
    "Chuva moderada",
    "Chuva forte",
  ];
  const rainIdx = row["RainIdx"];
  const description = row["Description"] ? row["Description"] : "";

  return {
    ID: ++ID,
    name: "rain",
    title: rainLevel[rainIdx],
    coordinate: {
      latitude: row["Latitude"],
      longitude: row["Longitude"] + displacement,
    },
    image: custom_assets_pin.rainLevel[rainIdx],
    logo: custom_assets.rainLevel[rainIdx],
    description: description,
    date: row["Date"] + " | " + row["Time"],
    pictures: row["Images"],
    address: row["Address"],
  };
}

function parseResult(db_result, parseRow, cleanParse) {
  if (cleanParse) return parseRow(db_result);

  var warnings = [];

  for (let i = 0; i < db_result.rows.length; ++i) {
    var row = db_result.rows.item(i);
    const data = parseRow(row);
    if (data !== null) {
      warnings.push(data);
    }
  }

  return warnings;
}

function isAvailable(dataBase) {
  return dataBase !== undefined && dataBase !== null;
}

function genericSelect(queriesToParsersMapper, dispatch, isFocused) {
  useEffect(() => {
    console.log("requesting data");
    if (isAvailable(global.userDataBase)) {
      queriesToParsersMapper.forEach(([query, parser, cleanParse]) => {
        global.userDataBase.transaction((tx) => {
          tx.executeSql(query, [], (tx, results) => {
            dispatch({ increment: parseResult(results, parser, cleanParse) });
          });
        });
      });
    }
  }, [isFocused]);
}

const initialState = { markers: new Map() };

function reducer(state = initialState, action) {
  // NOTE: removing old pluviometer value to new data can be displayed
  state.markers.forEach((m, key) => {
    if (m.name == "pluviometer" || m.name == "officialPluviometer") {
      state.markers.delete(key);
    }
  });

  action.increment.map((val) => {
    if (!state.markers.has(val.ID)) {
      state.markers.set(val.ID, val);
    }
  });

  return {
    markers: state.markers,
  };
}

function buildRandonData(location, addr) {
  const points = [
    [
      ["01/01", 10],
      ["05/02", 5],
      ["10/07", 2],
      ["12/07", 0],
      ["12/12", 20],
      ["13/12", 20],
      ["14/12", 0],
    ],
    [
      ["01/01", 0],
      ["03/01", 0],
      ["05/01", 1],
      ["07/01", 1],
      ["10/01", 1],
      ["13/01", 1],
      ["15/01", 2],
    ],
  ];
  var i = 1;

  return points.map((points) => {
    return {
      image: custom_assets_pin.officialPluviometer,
      logo: custom_assets.officialPluviometer,
      ID: ++ID,
      name: "officialPluviometer",
      title: "Pluviometro Oficial " + i++,
      coordinate: {
        latitude: location.latitude + i * 0.0003,
        longitude: location.longitude - i * 0.0002,
      },
      address: addr,
      data: {
        labels: points.map((i) => {
          return i[0];
        }),
        values: points.map((i) => {
          return i[1];
        }),
      },
      pictures: "[]",
      description: "",
      date: points.slice(-1)[0][0],
    };
  });
}

function compare(a, b) {
  if (a == b) return 0;
  if (parseInt(a[0].slice(3, 5)) < parseInt(b[0].slice(3, 5))) return -1;
  else if (parseInt(a[0].slice(0, 2)) < parseInt(b[0].slice(0, 2))) return -1;
  return 0;
}

function useMarkers(isFocused) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const context = useContext(CurrentLocationContext);
  const location = context.currentCoordinates;
  const addr = context.currentLocation;

  // const parseOfficialPluviometers = () => {
  //   return buildRandonData(location, addr);
  // };

  // const parsePluviometer = (db_result) => {
  //   // if (db_result.rows.length <= 0) return [];
  //   const points = [];

  //   const info = {
  //     pictures: "[]",
  //     description: "",
  //     date: "",
  //   };

  //   for (let i = 0; i < db_result.rows.length; ++i) {
  //     var row = db_result.rows.item(i);

  //     description = row["Description"] ? "\n\n" + row["Description"] : "";
  //     info.date = row["Date"];
  //     info.description =
  //       row["Precipitation"] + "mm" + ",  " + row["Date"] + description;
  //     info.pictures = row["Images"];

  //     points.push([row["Date"].slice(0, 5), parseInt(row["Precipitation"])]);
  //   }

  //   latestPoints = points.sort(compare).slice(-7);
  //   if (latestPoints.length == 0) {
  //     var labels = [];
  //     var values = [];
  //   }
  //   var labels = latestPoints.map((i) => {
  //     return i[0];
  //   });
  //   var values = latestPoints.map((i) => {
  //     return i[1];
  //   });

  //   const result = {
  //     image: custom_assets_pin.pluviometer,
  //     logo: custom_assets.pluviometer,
  //     ID: ++ID,
  //     name: "pluviometer",
  //     title: "Pluviometro 1",
  //     coordinate: location,
  //     address: addr,
  //     data: {
  //       labels: labels,
  //       values: values,
  //     },
  //     ...info,
  //   };

  //   return [result, ...parseOfficialPluviometers()];
  // };

  const queriesToParsersMapper = [
    ["SELECT * FROM FloodZones;", parseFloodZones, false],
    ["SELECT * FROM RiverLevel;", parseRiverLevel, false],
    ["SELECT * FROM RainLevel;", parseRainLevel, false],
    // ["SELECT * FROM PluviometerData;", parsePluviometer, true],
  ];

  genericSelect(queriesToParsersMapper, dispatch, isFocused);
  
  return state;
}

export default useMarkers;
