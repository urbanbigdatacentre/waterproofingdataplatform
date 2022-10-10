import init_queries from "./db";

/* createAllTables(db)
 *
 * Creates all tables from `db.js` file into
 * db arg.
 */
function createAllTables(db) {
  db.transaction((tx) => {
    init_queries.forEach((query) => {
      tx.executeSql(
        query,
        [],
        (_, { rows: { _array } }) => {
          console.debug("Table created successfully");
        },
        (_, err) => {
          console.debug("Error while creating table: " + JSON.stringify(err));
        }
      );
    });
  });
}

/* initDatabase(db)
 *
 * Initiate database with tables and forms from FeedScreens
 *
 */
function initDatabase(db) {
  (db != undefined && db !== null) && createAllTables(db);
}

export default initDatabase;
