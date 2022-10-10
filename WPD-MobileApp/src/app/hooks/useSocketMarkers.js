import { useState, useEffect, useReducer, useContext } from "react";
import assets from "../config/assets";
import PinIntransitavel from "../assets/floodZonesAssets/PinIntransitavel";
import PinTransitavel from "../assets/floodZonesAssets/PinTransitavel";
import moment from "moment";
import cache from "../utility/cache";

const custom_assets = {
  pluviometer: assets.pluviometer,
  officialPluviometer: assets.pluviometer,
  floodZones: assets.floodZones,
  riverLevel: ["low", "normal", "high", "flooding"].map((key) => {
    return assets.riverLevel[key];
  }),
  rainLevel: ["rain_0_5", "rain_1_5", "rain_2_5", "rain_3_5"].map((key) => {
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

const initialState = { markers: new Map() };

function getImage(name, situation) {
  if (name == "automaticPluviometer") {
    return custom_assets_pin.officialPluviometer;
  }

  if (name == "pluviometer") {
    return custom_assets_pin.pluviometer;
  }

  if (name == "rain") {
    if (situation == "SEM CHUVA") {
      return custom_assets_pin.rainLevel[0];
    } else if (situation == "CHUVA FRACA") {
      return custom_assets_pin.rainLevel[1];
    } else if (situation == "CHUVA MODERADA") {
      return custom_assets_pin.rainLevel[2];
    } else if (situation == "CHUVA FORTE") {
      return custom_assets_pin.rainLevel[3];
    }
    return custom_assets_pin.rainLevel[3];
  }

  if (name == "riverFlood") {
    if (situation == "BAIXO") {
      return custom_assets_pin.riverLevel[0];
    } else if (situation == "NORMAL") {
      return custom_assets_pin.riverLevel[1];
    } else if (situation == "ALTO") {
      return custom_assets_pin.riverLevel[2];
    } else if (situation == "INUNDAR" || situation == "TRANSBORDADO") {
      return custom_assets_pin.riverLevel[3];
    }
    return custom_assets_pin.riverLevel[0];
  }
  if (name == "floodZones") {
    if (situation == "TRANSITÁVEL") {
      return custom_assets_pin.floodZones.passable;
    } else {
      return custom_assets_pin.floodZones.not_passable;
    }
  }
}

function buildPolygonsObject(response, name) {
  var r = JSON.parse(response);
  var coordinate = [];
  var formsanswersgeom = r.formsanswersgeom;
  if (JSON.parse(formsanswersgeom).type == "Polygon") {
    const arrayCoordinates = JSON.parse(formsanswersgeom)["coordinates"][0];
    var n = Object.keys(arrayCoordinates).length;

    for (let i = 0; i < n; i++) {
      var lat = arrayCoordinates[i][1];
      var lon = arrayCoordinates[i][0];
      coordinate.push([lat, lon]);
    }
    return {
      ID: r.formsanswersid,
      name: name,
      coordinate: coordinate,
      pictures: null,
      image: "", //getMarkerImage(answer.name),
    };
  } else {
    return {
      ID: r.formsanswersid,
      name: name,
      coordinate: [null, null],
      pictures: null,
      image: "", //getMarkerImage(answer.name),
    };
  }
}

function buildMarkerObject(response, name) {
  const r = JSON.parse(response);

  const resposta = r.formsanswersgeom;
  const formsanswersgeom = JSON.parse(resposta).coordinates;
  var situation = null;

  if (r.array_to_json) {
    situation = r.array_to_json.find((field) => field.fieldname == "situation");
  }

  return {
    ID: r.formsanswersid,
    name: name,
    title: situation ? situation.fieldsanswersvalue : null,
    coordinate: {
      latitude: formsanswersgeom[1],
      longitude: formsanswersgeom[0],
    },
    user: r.formsanswersuserinformer,
    image: getImage(name, situation ? situation.fieldsanswersvalue : null),
  };
}

function verifyResponse(response, name) {
  var markers = [];

  if (response) {
    const answer = JSON.parse(response);
    if (answer.success == true) {
      answer.responseData.array_to_json.forEach((r) => {
        if (r.formcode == "FLOODZONES_OFFICIAL") {
          markers.push(buildPolygonsObject(JSON.stringify(r), name));
        } else {
          markers.push(buildMarkerObject(JSON.stringify(r), name));
        }
      });
      if (name !== "susceptibilityAreas") {
        cache.store(name, markers);
      }
    }
  }

  return markers;
}

function getFormsAnswers(socketObject, dispatch, fetchFromCache) {
  const [socketResponse, setSocketResponse] = useState();

  // GATO: Was getting an error due to too long timer (10min), so counting 10
  // times 1 minute to fetch new sockets
  const [timerCounter, setTimer] = useState(1);

  const openListeners = () => {
    socketObject.socketUrl.onerror = (e) => {
      console.log(e.message);
    };

    socketObject.socketUrl.onmessage = ({ data }) => {
      console.log(
        `\t ====== Getting data from: ${
          socketObject.name
        }  =>  ${moment().format("DD/MM, h:mm:ss:SSS")}`
      );
      setSocketResponse(data);
    };

    socketObject.socketUrl.onclose = () => {
      console.log(
        `\t ====== Socket closed : ${socketObject.name}  =>  ${moment().format(
          "DD/MM, h:mm:ss:SSS"
        )}`
      );
    };
  };

  openListeners();

  // GATO 3: Actually closing/opening sockets every 4min
  // This is a workaround to an instability in our cloud-server. It stops to
  // send feedback data after ~4 minutes and they could not manage to solve. So
  // we were told to "fix" this issue this way for a while.
  useEffect(() => {
    if (timerCounter % 4 == 0) {
      console.log(
        `========> Closing/Opening socket: ${
          socketObject.name
        }  =>  ${moment().format("DD/MM, h:mm:ss:SSS")}`
      );
      socketObject.socketUrl.close();
      socketObject.socketUrl = new WebSocket(socketObject.url);
      openListeners();
    }
  }, [timerCounter]);

  // Timer acting like a clock at F = 1/60 Hz
  useEffect(() => {
    const timer = setInterval(() => {
      setTimer((oldTime) => oldTime + 1);
    }, 60000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!fetchFromCache) {
      dispatch({
        increment: verifyResponse(socketResponse, socketObject.name),
      });
    }
  }, [socketResponse]);
}

function reducer(state = initialState, action) {
  action.increment.map((val) => {
    state.markers.set(val.ID, val);
  });

  return { markers: state.markers };
}

export default function useSocketMarkers(fetchFromCache) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [dataFromCache, setDataFromCache] = useState();
  const formsKeys = [
    "floodZones",
    "rain",
    "pluviometer",
    "automaticPluviometer",
    "riverFlood",
  ];

  useEffect(() => {
    if (fetchFromCache) {
      formsKeys.forEach((key) => {
        cache.get(key).then((cachedData) => {
          if (cachedData && cachedData?.success) {
            dispatch({ increment: JSON.parse(cachedData) });
          }
        });
      });
    }
  }, []);
  global.formsSockets.forEach((socket) =>
    getFormsAnswers(socket, dispatch, fetchFromCache)
  );

  return state;
}
