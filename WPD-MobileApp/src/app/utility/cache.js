import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

const prefix = "cache";
const expiryInMinutes = 5;

const store = async (key, value) => {
  try {
    const item = {
      value,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(prefix + key, JSON.stringify(value));
  //  return true;
  } catch (error) {
   // return false;
  }
};

const isExpired = (item) => {
  const now = moment(Date.now());
  const storedTime = moment(item.timestamp);
  return now.diff(storedTime, "minutes") > expiryInMinutes;
};
const clear = async (key) => {
  try {
    await AsyncStorage.removeItem(prefix + key);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const get = async (key) => {
  try {
    const value = await AsyncStorage.getItem(prefix + key);

    /*if (isExpired(isExperired)) {
      await AsyncStorage.removeItem(prefix + key);
      return null;
    }*/

    if (!value) return null;
    return value;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const merge = async (key) => {
  try {
    await AsyncStorage.mergeItem(prefix + key, JSON.stringify(value));
  } catch (error) {}
};

const getAllKeys = async () => {
  let keys = [];
  try {
    keys = await AsyncStorage.getAllKeys();
    return keys;
  } catch (e) {
    console.log(e);
  }

  // console.log(keys)
  // example console.log result:
  // ['@MyApp_user', '@MyApp_key']
};

export default {
  store,
  get,
  merge,
  clear,
  getAllKeys,
};
