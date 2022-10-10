import moment from "moment";
import { useState } from "react";
import dataClient from "../api/Websockets/dataClient";

function getPluviometerData(geoLocation, setPluviometerData) {
  const initialDate = moment().format("YYYY-MM-DDTHH:mm:ss");
  const finalDate = moment().subtract(5, "days").format("YYYY-MM-DDTHH:mm:ss");
  const time = finalDate + "/" + initialDate;
  const endpoint =
    dataClient +
    `type=PLUVIOMETER_FORM&time=${time}&lat=${geoLocation.latitude}&lon=${geoLocation.longitude}&buffer=1`;
  const socketObject = new WebSocket(endpoint);

  socketObject.onmessage = ({ data }) => {
    if (data != undefined) {
      console.log(`\t ====== Getting data from: PLUVIOMETER_FORM  =>  ${moment().format('DD/MM, h:mm:ss:SSS')}`);
      const dataObject = JSON.parse(data);
      // console.log(dataObject.responseData);
      setPluviometerData(dataObject);
    } else {
      setPluviometerData(false);
    }

    socketObject.close();
  };
}

export default getPluviometerData;
