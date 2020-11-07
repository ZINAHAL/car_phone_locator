// React Native Async Storage is used: https://react-native-async-storage.github.io/async-storage/

import AsyncStorage from '@react-native-community/async-storage';



export const pushToDatabase = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    // console.log(`The key ${key} was not stored, errors were encountered: ${error}`);
    return false;
  }
};

export const pullFromDatabase = async (key) => {
  try {
    return JSON.parse(await AsyncStorage.getItem(key));    
  } catch (error) {
    console.log(`The value for the key ${key} did not get pulled, errors were encountered: ${error}`);
  }
};

export const clearDatabase = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.log(`Database could not be cleared, errors were encountered: ${error}`);
  }
};