import { create } from "apisauce";

const appIngestion = create({
  baseURL: "https://wpdappingestion.azurewebsites.net",
});

export default appIngestion;
