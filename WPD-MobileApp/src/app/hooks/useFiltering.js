import moment from "moment";
import webSocketClient from "../api/Websockets/webSocketClient";

function useFiltering(location) {
  const endpoint = webSocketClient;
  const initialDate = moment().add(1, "days").format("YYYY-MM-DDTHH:mm:ss");
  const finalDate = moment().subtract(1, "days").format("YYYY-MM-DDTHH:mm:ss");

  console.log(`Opening all sockets on useFiltering:  ${moment().format('DD/MM, h:mm:ss:SSS')}`);

  const filters = [
    {
      name: "floodZones",
      url: endpoint +
        `type=FLOODZONES_FORM&time=${finalDate}/${initialDate}&lat=${location.lat}&lon=${location.long}&buffer=20000&limit=50`,
      socketUrl: new WebSocket(
        endpoint +
          `type=FLOODZONES_FORM&time=${finalDate}/${initialDate}&lat=${location.lat}&lon=${location.long}&buffer=20000&limit=50`
      ),
    },
    {
      name: "rain",
      url: endpoint +
        `type=RAIN_FORM&time=${finalDate}/${initialDate}&lat=${location.lat}&lon=${location.long}&buffer=20000&limit=50`,
      socketUrl: new WebSocket(
        endpoint +
          `type=RAIN_FORM&time=${finalDate}/${initialDate}&lat=${location.lat}&lon=${location.long}&buffer=20000&limit=50`
      ),
    },
    {
      name: "riverFlood",
      url: endpoint +
        `type=RIVERFLOOD_FORM&time=${finalDate}/${initialDate}&lat=${location.lat}&lon=${location.long}&buffer=20000&limit=50`,
      socketUrl: new WebSocket(
        endpoint +
          `type=RIVERFLOOD_FORM&time=${finalDate}/${initialDate}&lat=${location.lat}&lon=${location.long}&buffer=20000&limit=50`
      ),
    },
    {
      name: "pluviometer",
      url: endpoint +
        `type=PLUVIOMETER_REGISTRATION&lat=${location.lat}&lon=${location.long}&buffer=20000&limit=50`,
      socketUrl: new WebSocket(
        endpoint +
          `type=PLUVIOMETER_REGISTRATION&lat=${location.lat}&lon=${location.long}&buffer=20000&limit=50`
      ),
    },
    {
      name: "susceptibilityAreas",
      url: endpoint +
        `type=FLOODZONES_OFFICIAL&lat=${location.lat}&lon=${location.long}&buffer=20000&limit=20`,
      socketUrl: new WebSocket(
        endpoint +
          `type=FLOODZONES_OFFICIAL&lat=${location.lat}&lon=${location.long}&buffer=20000&limit=20`
      ),
    },
    {
      name: "automaticPluviometer",
      url: endpoint +
        `type=PLUVIOMETERS_OFFICIAL&lat=${location.lat}&lon=${location.long}&buffer=50000&limit=20`,
      socketUrl: new WebSocket(
        endpoint +
          `type=PLUVIOMETERS_OFFICIAL&lat=${location.lat}&lon=${location.long}&buffer=50000&limit=20`
      ),
    },
  ];

  return filters;
}

export { useFiltering };
