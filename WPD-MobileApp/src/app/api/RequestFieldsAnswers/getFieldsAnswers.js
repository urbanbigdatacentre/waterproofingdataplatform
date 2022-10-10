import apiClient from "../client";

const endpoint = "/hot/fieldsanswers?";

const fieldsAnswers = (time, id) =>
  apiClient.get(endpoint + `time=${time}&faid=${id}`);

export default { fieldsAnswers };
