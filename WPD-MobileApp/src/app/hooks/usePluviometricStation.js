import { useState } from "react";
import getFieldsAnswers from "../api/RequestFieldsAnswers/getFieldsAnswers";
import webSocketClient from "../api/Websockets/webSocketClient";
import cache from "../utility/cache";

async function getPluvStation_data(id) {
  const result = await getFieldsAnswers.fieldsAnswers(null, id);
  if (result.data) {
    return result;
  }
  return undefined;
}

function assemblePluvStationObject(pluvData) {
  var date = null;
  var time = null;
  var address = null;
  var institutionType = null;
  var institutionName = null;

  pluvData.array_to_json.forEach(function (field) {
    if (field.fieldname == "eventaddress") {
      address = field.fieldsanswersvalue;
    } else if (field.fieldname == "eventdate") {
      date = field.fieldsanswersvalue;
    } else if (field.fieldname == "eventtime") {
      time = field.fieldsanswersvalue;
    } else if (field.fieldname == "institutename") {
      institutionName = field.fieldsanswersvalue;
    } else if (field.fieldname == "institutetype") {
      institutionType = field.institutionType;
    }
  });

  return {
    regiterDate: date + " | " + time,
    address: address,
    institutionType: institutionType,
    institutionName: institutionName,
    coordinates: {
      lat: pluvData.formsanswerslatitude,
      long: pluvData.formsanswerslongitude,
    },
  };
}

async function getPluviometerStation(userId, setPluviometerStation) {
  const endpoint =
    webSocketClient + `type=PLUVIOMETER_REGISTRATION&user=${userId}`;
  const socketObject = new WebSocket(endpoint);

  socketObject.onmessage = async ({ data }) => {
    const dataObject = JSON.parse(data);
    if (dataObject?.success) {
      const pluvStation_id =
        dataObject.responseData.array_to_json[0].formsanswersid;
      const pluvStation_data = await getPluvStation_data(pluvStation_id);
      const pluvObject = assemblePluvStationObject(
        pluvStation_data.data.responseData.array_to_json[0]
      );
      setPluviometerStation(pluvObject);
      cache.store(socketObject, JSON.stringify(pluvObject))
    } else {
      setPluviometerStation(false);
      cache.store(socketObject, false)
    }
    socketObject.close();
  };

  socketObject.onerror = async (e) => {
    const dataCache = await cache.get(url);
    console.log(e.message);
    setPluviometerStation(dataCache);
  };
}

export default getPluviometerStation;
