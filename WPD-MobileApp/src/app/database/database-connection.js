import * as SQLite from "expo-sqlite";

function openDatabase() {
  const db = SQLite.openDatabase("db.testDb");

  // return undefined
  return db;
}

export default openDatabase;

// Snippet from docs:
// https://docs.expo.io/versions/latest/sdk/sqlite/#importing-an-existing-database
// async function openDatabase() {
//   if (
//     !(await FileSystem.getInfoAsync(
//       FileSystem.documentDirectory + "SQLite"
//     ).then(exists))
//     // .exists
//   ) {
//     await FileSystem.makeDirectoryAsync(
//       FileSystem.documentDirectory + "SQLite"
//     );
//   }
//   await FileSystem.downloadAsync(
//     Asset.fromModule(require("../assets/ddl.sqlite3.db")).uri,
//     FileSystem.documentDirectory + "SQLite/wp6.db"
//   );

//   return SQLite.openDatabase("wp6.db");
// }
