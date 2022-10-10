import { create } from "apisauce";
import { authClient, authChangePswdClient } from "../auth/authClient";
import authStorage from "../auth/storage";

function login(name, password) {
  return authClient.post(`/login?username=${name}&password=${password}`);
}

function signup({
  name,
  number,
  password,
  dateofborn,
  institutionName,
  gender,
  state,
  city,
  institution,
  secQuestion,
  secQuestionAns,
  consent,
  role,
}) {
  const body = {
    username: number,
    nickname: name,
    password: password,
    dateofborn: dateofborn,
    gender: gender,
    state: state,
    city: city,
    institutiontype: institution,
    institution: institutionName,
    securityquestion: secQuestion,
    securityanswer: secQuestionAns,
    termsofusage: consent,
    roles: role !== "" ? [role] : ["ROLE_CLIENT"],
  };

  Object.entries(body).forEach(([key, value]) => {
    value === "" && delete body[key];
  });

  return authClient.post(`/signup`, body);
}

async function userPersonalData() {
  const authToken = await authStorage.getToken();
  const localClient = create({
    baseURL: "http://wpd.brazilsouth.cloudapp.azure.com:8080/users",
  });
  localClient.setHeader("Authorization", `Bearer ${authToken}`);

  return localClient.get(`/me`);
}

async function userActivation(code) {
  const { username } = await authStorage.getUser();
  const authToken = await authStorage.getToken();
  // console.log("TOKEN ACTIVATE: "+authToken);
  // console.log("USER NAME: " + username);

  const localClient = create({
    baseURL: "http://wpd.brazilsouth.cloudapp.azure.com:8080/users",
  });

  localClient.setHeader("Authorization", `Bearer ${authToken}`);

  return localClient.post(
    `/activate?username=${username}&activationkey=${code}`
  );
}

async function existUsername(username) {
  return authClient.post(`/existsByUsername?username=${username}`);
}

async function existNickname(nickname) {
  return authClient.post(`/existsByNickname?nickname=${nickname}`);
}

function loginByUsernamAnswers(username, secQuestionId, secQuestionAnswer) {
  const body = [
    {
      id: 1,
      forgotpasswordquestionsid: secQuestionId,
      usersid: 1,
      answer: secQuestionAnswer
    }
  ];

  return authChangePswdClient.post(
    `/loginbyusernameandanswers?username=${username}`,
    body
  );
}

function updatePassword(authToken, username, password) {
  const localClient = create({
    baseURL: "http://wpd.brazilsouth.cloudapp.azure.com:8080/forgotpasswords",
  });

  localClient.setHeader("Authorization", `Bearer ${authToken}`);

  return localClient.post(
    `/passwordupdatebyusername?username=${username}&newPassword=${password}`
  );
}


export {
  login,
  signup,
  userPersonalData,
  userActivation,
  existNickname,
  existUsername,
  loginByUsernamAnswers,
  updatePassword,
};
