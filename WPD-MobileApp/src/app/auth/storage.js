import * as SecureStore from "expo-secure-store";

const tokenKey = "authToken";
const userKey = "userKey";

const setToken = async (authToken) => {
  try {
    await SecureStore.setItemAsync(tokenKey, authToken);
  } catch (error) {
    console.log("Error while storing authToken");
  }
};

const getToken = async () => {
  try {
    return await SecureStore.getItemAsync(tokenKey);
  } catch (error) {
    console.log("Error while gettig authToken");
  }
};

const removeToken = async () => {
  try {
    await SecureStore.deleteItemAsync(tokenKey);
  } catch (e) {
    console.log("Error while removing authToken");
  }
};

const setUser = async (userData) => {
  try {
    await SecureStore.setItemAsync(userKey, JSON.stringify(userData));
  } catch (error) {
    console.log("Error while storing user data");
  }
};

const getUser = async () => {
  try {
    return await SecureStore.getItemAsync(userKey).then((data) => {
      return JSON.parse(data);
    });
  } catch (error) {
    console.log("Error while getting user data");
  }
};

const removeUser = async () => {
  try {
    await SecureStore.deleteItemAsync(userKey);
  } catch (e) {
    console.log("Error while removing authToken");
  }
};

export default { setToken, getUser, removeToken, getToken, setUser, removeUser };
