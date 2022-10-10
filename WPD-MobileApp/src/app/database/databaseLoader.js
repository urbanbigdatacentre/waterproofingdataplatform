import "../config/globals";

import moment from "moment";

function transaction(db, query, values) {
  //console.log("inserting values");
  db.transaction((tx) => {
    tx.executeSql(
      query,
      values,
      (_, results) => {
        console.debug("Values inserted successfully" + results.rowsAffected);
      },
      (_, err) => {
        console.debug("Error while inserting values: " + JSON.stringify(err));
      }
    );
  });
}

function insertFloodZone({
  images,
  description,
  passable,
  location,
  date,
  time,
  address,
}) {
  const query = `INSERT INTO FloodZones(Description, Images, Latitude, Longitude, Passable, Date, Time, Address) VALUES(?, ?, ?, ?, ?, ?, ?, ?);`;
  if (location === undefined) {
    console.debug("undefined location");
    return;
  }

  const values = [
    description,
    JSON.stringify(images),
    parseFloat(location["latitude"]),
    parseFloat(location["longitude"]),
    parseInt(passable),
    moment(date).format("DD/MM/YYYY"),
    moment(time).format("HH:mm"),
    address,
  ];

  transaction(global.userDataBase, query, values);
}

function insertPluviometerData({
  pluviometer,
  description,
  images,
  dateTime,
  time,
}) {
  const query = `INSERT INTO PluviometerData(Date, Images, Precipitation, Description) VALUES(?, ?, ?, ?);`;

  // if (location === undefined) {
  //   console.debug("undefined location");
  //   return;
  // }

  const values = [
    moment(dateTime).format("DD/MM/YYYY") +
      " | " +
      moment(time).format("HH:mm"),
    JSON.stringify(images),
    parseFloat(pluviometer),
    description,
  ];

  transaction(global.userDataBase, query, values);
}

function insertRainData({
  images,
  description,
  rain,
  location,
  date,
  time,
  address,
}) {
  const query = `INSERT INTO RainLevel(RainIdx, Description, Images, Latitude, Longitude, Date, Time, Address) VALUES(?, ?, ?, ?, ?, ?, ?, ?);`;

  if (location === undefined) {
    console.debug("undefined location");
    return;
  }

  const values = [
    parseInt(rain),
    description,
    JSON.stringify(images),
    parseFloat(location["latitude"]),
    parseFloat(location["longitude"]),
    moment(date).format("DD/MM/YYYY"),
    moment(time).format("HH:mm"),
    address,
  ];

  console.log(values);

  transaction(global.userDataBase, query, values);
}

function insertRiverData({
  images,
  description,
  riverScale,
  location,
  date,
  time,
  address,
}) {
  const query = `INSERT INTO RiverLevel(RiverIdx, Description, Images, Latitude, Longitude, Date, Time, Address) VALUES(?, ?, ?, ?, ?, ?, ?, ?);`;

  if (location === undefined) {
    console.debug("undefined location");
    return;
  }

  const values = [
    parseInt(riverScale),
    description,
    JSON.stringify(images),
    parseFloat(location["latitude"]),
    parseFloat(location["longitude"]),
    moment(date).format("DD/MM/YYYY"),
    moment(time).format("HH:mm"),
    address,
  ];

  console.log(values);

  transaction(global.userDataBase, query, values);
}

export {
  insertFloodZone,
  insertPluviometerData,
  insertRainData,
  insertRiverData,
};
