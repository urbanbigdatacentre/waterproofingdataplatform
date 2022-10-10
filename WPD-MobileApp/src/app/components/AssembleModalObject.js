import moment from "moment";
import getFieldsAnswers from "../api/RequestFieldsAnswers/getFieldsAnswers";
import assets from "../config/assets";
//----- 1/3: melhorar código (URGENTE) +1 up-vote
const custom_assets = {
  pluviometer: assets.PluviometerIcon,
  officialPluviometer: assets.OfficialPluviometer,
  floodZones: assets.floodZones,
  riverLevel: ["low", "normal", "high", "flooding"].map((key) => {
    return assets.riverLevel[key];
  }),
  rainLevel: ["rain_0_5", "rain_1_5", "rain_2_5", "rain_3_5"].map((key) => {
    return assets.rainLevel[key];
  }),
};

function getLogo(name, situation) {
  if (name == "automaticPluviometer") {
    return custom_assets.officialPluviometer;
  }

  if (name == "pluviometer") {
    return custom_assets.pluviometer;
  }

  if (name == "rain") {
    if (situation == "SEM CHUVA") {
      return custom_assets.rainLevel[0];
    } else if (situation == "CHUVA FRACA") {
      return custom_assets.rainLevel[1];
    } else if (situation == "CHUVA MODERADA") {
      return custom_assets.rainLevel[2];
    } else if (situation == "CHUVA FORTE") {
      return custom_assets.rainLevel[3];
    } else {
      return custom_assets.rainLevel[3];
    }
  }

  if (name == "riverFlood") {
    if (situation == "BAIXO") {
      return custom_assets.riverLevel[0];
    } else if (situation == "NORMAL") {
      return custom_assets.riverLevel[1];
    } else if (situation == "ALTO") {
      return custom_assets.riverLevel[2];
    } else if (situation == "INUNDAR" || situation == "TRANSBORDADO") {
      return custom_assets.riverLevel[3];
    }
    return custom_assets.riverLevel[0];
  }
  if (name == "floodZones") {
    if (situation == "TRANSITÁVEL") {
      return custom_assets.floodZones.passable;
    } else {
      return custom_assets.floodZones.notPassable;
    }
  }
}

function verifymeasureDates(labels, measureDate, day, dt) {
  // console.log(measureDate);
  if (labels == null || !labels.find((f) => f == measureDate)) {
    labels.push(measureDate);
    day.label = measureDate;
    day.date_format = dt;

    return true;
  }
  return false;
}

const getCurrentPluviometer = (pluvForm, userId, data, datapluv) => {
  var day = { label: null, date_format: null, values: [] };
  var time = null;
  var dt = null;
  var measure = { rainGauge: null, dateTime: null, comment: null };
  var measureDate = null;
  var fieldsAnswers = null;
  if (pluvForm.formsanswersuserinformer == userId) {
    pluvForm.array_to_json.find((field) => {
      if (field.fieldname == "date") {
        fieldsAnswers = moment(
          field.fieldsanswersvalue,
          "DD-MM-YYYY"
        ).toObject();
        measureDate = moment(field.fieldsanswersvalue, "DD-MM-YYYY").format(
          "DD/MM"
        );
        dt = moment(field.fieldsanswersvalue, "DD-MM-YYYY").format(
          "DD-MM-YYYY"
        );
      } else if (field.fieldname == "eventtime") {
        time = moment(field.fieldsanswersvalue, "HH:mm").format("HH:mm");
      } else if (field.fieldname == "comments") {
        measure.comment = field.fieldsanswersvalue;
      }
    });

    var data_sort = new Date(
      fieldsAnswers.years,
      fieldsAnswers.months,
      fieldsAnswers.date,
      "13",
      "00",
      "00",
      "00"
    );
    //  console.log(data_sort);
    measure.dateTime = moment(dt + "T" + time, "DD-MM-YYYYTHH:mm").format(
      "DD-MM-YYYYTHH:mm"
    );
    // console.log("dt:  " + day.dateTime);

    pluvForm.array_to_json.find((field) => {
      if (field.fieldname == "rainamount") {
        measure.rainGauge = field.fieldsanswersvalue
          ? parseFloat(field.fieldsanswersvalue)
          : null;
        if (verifymeasureDates(data.labels, measureDate, day, data_sort)) {
          day.values.push(measure);
          datapluv.push(day);
        } else {
          datapluv.forEach((d) => {
            if (d.label === measureDate) {
              d.values.push(measure);
            }
          });
        }
      }
    });

    return pluvForm;
  }
};

async function getPluviometerStatio_informations(id) {
  const result = await getFieldsAnswers.fieldsAnswers(null, id);

  if (result.data) {
    return result.data.responseData.array_to_json[0];
  }

  return null;
}

const AssembleModalObject = async (response, name, userId, formId) => {

  var situation = null;
  var user = null;
  var institution = null;
  var address = null;
  var date = null;
  var time = null;
  var comments = null;
  var pictures = null;
  var data = {
    labels: [],
  };

  var datapluv = [];

  if (name == "pluviometer") {
    situation = "PLUVIÔMETRO";
    const pluv_sation = await getPluviometerStatio_informations(formId);
   // console.log(pluv_sation);
    if (pluv_sation) {
      user = pluv_sation.formsanswersuserinformernickname
      pluv_sation.array_to_json.forEach((field) => {
        if (field.fieldname == "institutename") {
          institution =
            field.fieldsanswersvalue != "None"
              ? field.fieldsanswersvalue
              : "Não há vínculo institucional";
        } else if (field.fieldname == "eventaddress") {
          address = field.fieldsanswersvalue;
        }
      });
    }
    if (response) {
      if (JSON.parse(response).array_to_json) {
        const r = JSON.parse(response).array_to_json;

        const currentPluv = JSON.parse(response).array_to_json.filter(
          (pluvForm) => getCurrentPluviometer(pluvForm, userId, data, datapluv)
        );
        if (datapluv) {
          datapluv.sort(function (a, b) {
            return a.date_format - b.date_format;
          });

          datapluv.forEach((measureDay) => {
            measureDay.values.sort(function (a, b) {
              return a.dateTime.localeCompare(b.dateTime);
            });
          });
          dtlength = datapluv.length > 0 ? datapluv.length - 1 : 0;
          if (datapluv[dtlength]?.values) {
            val_length =
              datapluv[dtlength].values.length > 0
                ? datapluv[dtlength].values.length - 1
                : 0;

            comments = datapluv[dtlength].values[val_length].comment;
          }
        }
     //   console.log(datapluv);
      }
    }
  } else if (JSON.parse(response).array_to_json) {
    const r = JSON.parse(response).array_to_json;
    //console.log(r[0].formsanswersuserinformernickname);
    if (name == "automaticPluviometer") {
      situation = "PLUVIÔMETRO";
      r[0].array_to_json.forEach(function (f) {
        var day = { label: null, values: [] };
        var measure = { rainGauge: null };
        if (f.fieldname == "medicao") {
          var measureDate = moment(
            f.fieldsanswersdtfilling,
            "YYYY-MM-DDTHH:mm:ss"
          ).format("DD/MM");

          measure.rainGauge = f.fieldsanswersvalue
            ? parseFloat(f.fieldsanswersvalue)
            : null;

          if (verifymeasureDates(data.labels, measureDate, day)) {
            day.values.push(measure);
            day.label = measureDate;
            datapluv.push(day);
          } else {
            datapluv.forEach((d) => {
              if (d.label == measureDate) {
                d.values.push(measure);
              }
            });
          }
        }

        if (f.fieldname == "siglarede") {
          institution = f.fieldsanswersvalue;
        }
        if (f.fieldname == "nome") {
          address = f.fieldsanswersvalue;
        }
      });

      if (datapluv) {
        datapluv.sort(function (dataPluv, dataPluvB) {
          return dataPluv.label.localeCompare(dataPluvB.label);
        });
      }

      // console.log(datapluv);
    } else {
      if (r[0].array_to_json) {
        user = r[0].formsanswersuserinformernickname;
        institution = r[0].formsanswersuserinformerinstitution;

        r[0].array_to_json.forEach(function (f) {
          if (f.fieldname == "situation") {
            situation = f.fieldsanswersvalue;
          }
          if (f.fieldname == "eventaddress") {
            address = f.fieldsanswersvalue;
          }
          if (f.fieldname == "eventdate") {
            date = moment(f.fieldsanswersvalue, "DD-MM-YYYY").format(
              "DD/MM/YYYY"
            );
          }
          if (f.fieldname == "eventtime") {
            time = f.fieldsanswersvalue;
          }
          if (f.fieldname == "comments") {
            comments = f.fieldsanswersvalue;
          }
        });
      }
    }
  }

  // GATO 2: Now INUNDAR is replaced to TRANSBORDADO, so checking from
  // response and changing to new value
  const _title = situation == "INUNDAR" ? "TRANSBORDADO" : situation;
  return {
    name: name,
    title: _title,
    user: user,
    institution: institution,
    address: address,
    date: date + " | " + time,
    description: comments,
    logo: getLogo(name, situation),
    pictures: pictures,
    data: datapluv,
  };
};

export default AssembleModalObject;
