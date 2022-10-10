import appIngestion from "./appIngestion";
import cache from "../../utility/cache";
const endpoint = "/api/wpdAppIngestion?";

async function sendFormAnswer(ingestionObject, connection, formName) {
  if (connection) {
    const response = await appIngestion.post(
      endpoint,
      JSON.stringify(ingestionObject)
    );
    return response;
  } else {
    const formArray = [];
    const teste = await cache.get("sendforms");
    if (teste) {
      var object = JSON.parse(teste);
      object.forEach((element) => formArray.push(element));
    }
    formArray.push(ingestionObject);
    cache.store("sendforms", formArray);
    return { ok: true };
  }
}

export default sendFormAnswer;
