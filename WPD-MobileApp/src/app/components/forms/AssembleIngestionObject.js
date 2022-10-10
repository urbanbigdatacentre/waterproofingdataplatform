import moment from "moment";
import sendFormAnswer from "../../api/Ingestion/sendFormAnswer";

async function AssembleIngestionObject(
  { images, description },
  user,
  situation,
  code,
  location,
  date,
  time,
  address,
  connection,
  formName
) {
  console.log(
    `----> Sending data: ${code} = ${situation} => ${moment().format(
      "DD/MM, h:mm:ss:SSS"
    )}`
  );
  const ingestionObject = {
    responseData: {
      array_to_json: [
        {
          formcode: code,
          formsanswersuserinformer: user.username,
          fieldsanswerslongitude: location["longitude"],
          fieldsanswerslatitude: location["latitude"],
          fields: [
            {
              fieldsanswerssituation: situation ? situation : "CHUVA FRACA",
              fieldsanswerseventaddress: address,
              fieldsanswerseventdate: moment(date).format("DD-MM-YYYY"),
              fieldsanswerseventtime: moment(time).format("HH:mm"),
              fieldsanswerscomments: description,
            },
          ],
        },
      ],
    },
  };

  return sendFormAnswer(ingestionObject, connection, formName);
}
const AssembleIngestionPluviometer = async ({
  pluviometer,
  description,
  images,
  user,
  date,
  time,
  connection,
  formName,
}) => {
  console.log(
    `----> Sending data: PLUVIOMETER_FORM = ${pluviometer} => ${moment().format(
      "DD/MM, h:mm:ss:SSS"
    )}`
  );
  const pluviometerObject = {
    responseData: {
      array_to_json: [
        {
          formcode: "PLUVIOMETER_FORM",
          formsanswersuserinformer: user.username,
          fieldsanswerslongitude: user.pluviometer.coordinates["long"],
          fieldsanswerslatitude: user.pluviometer.coordinates["lat"],
          fields: [
            {
              fieldsanswerssituation: null,
              fieldsanswerseventaddress: user.pluviometer.address,
              fieldsanswerseventdate: moment(date).format("DD-MM-YYYY"),
              fieldsanswerseventtime: moment(time).format("HH:mm"),
              fieldsanswersrainamount: pluviometer,
              fieldsanswerscomments: description,
            },
          ],
        },
      ],
    },
  };

  const a = await sendFormAnswer(pluviometerObject, connection, formName);
  return a;
};

async function AssembleIngestionPluvRegistration(
  date,
  time,
  user,
  address,
  coordinates
) {
  const pluvResgistrationObject = {
    responseData: {
      array_to_json: [
        {
          formcode: "PLUVIOMETER_REGISTRATION",
          formsanswersuserinformer: user.username,
          fieldsanswerslongitude: coordinates["longitude"],
          fieldsanswerslatitude: coordinates["latitude"],
          fields: [
            {
              fieldsanswerseventaddress: address,
              fieldsanswerseventdate: moment(date).format("DD-MM-YYYY"),
              fieldsanswerseventtime: moment(time).format("HH:mm"),
              fieldsanswersinstitutename: user.institutionName
                ? user.institutionName
                : null,
              fieldsanswerrinstitutetype: user.institutionType
                ? user.institutionType
                : null,
            },
          ],
        },
      ],
    },
  };
  const a = await sendFormAnswer(pluvResgistrationObject);
  return a;
}
export {
  AssembleIngestionObject,
  AssembleIngestionPluviometer,
  AssembleIngestionPluvRegistration,
};
