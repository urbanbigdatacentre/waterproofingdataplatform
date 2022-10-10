// FIXME: Refactor to our database ERM already combined

const init_queries = [
  `CREATE TABLE IF NOT EXISTS PluviometerData (
        Id integer PRIMARY KEY autoincrement,
        Date text NOT NULL,
        Images text,
        Precipitation real NOT NULL,
        Description text
    )`,
  `CREATE TABLE IF NOT EXISTS FloodZones (
        Id integer PRIMARY KEY autoincrement,
        Description text,
        Images text,
        Latitude real NOT NULL,
        Longitude real NOT NULL,
        Passable INTERGER NOT NULL,
        Date text,
        Time text,
        Address text
    );`,
  // `CREATE TABLE IF NOT EXISTS Pluviometer (
  //       Id integer PRIMARY KEY autoincrement,
  //       Date text NOT NULL,
  //       Latitude real NOT NULL,
  //       Longitude real NOT NULL,
  //       Address text,
  //       School text,
  //  );`,
  // `INSERT INTO Pluviometer(Latitude, Longitude, Precipitation, Address, Description) VALUES(?, ?, ?, ?, ?, ?, ?);`,

  `CREATE TABLE IF NOT EXISTS RainLevel (
        Id integer PRIMARY KEY autoincrement,
        Description text,
        RainIdx INTEGER NOT NULL,
        Images text,
        Latitude real NOT NULL,
        Longitude real NOT NULL,
        Date text,
        Time text,
        Address text
   );`,
  `CREATE TABLE IF NOT EXISTS RiverLevel (
        Id integer PRIMARY KEY autoincrement,
        Description text,
        RiverIdx INTEGER NOT NULL,
        Images text,
        Latitude real NOT NULL,
        Longitude real NOT NULL,
        Date text,
        Time text,
        Address text
   );`,
];

//   `CREATE TABLE IF NOT EXISTS Users (
//         Id integer PRIMARY KEY autoincrement,
//         Email text NOT NULL,
//         FirstName text NOT NULL,
//         SurName text NOT NULL,
//         Avatar text NOT NULL,
//         Active integer NOT NULL
//     );`,

//   `CREATE TABLE IF NOT EXISTS Profiles (
//         Id integer PRIMARY KEY autoincrement,
//         Name text NOT NULL,
//         Active integer NOT NULL
//     );`,

//   `CREATE TABLE IF NOT EXISTS UsersProfiles (
//         Id integer PRIMARY KEY autoincrement,
//         IdUsers integer NOT NULL,
//         IdProfiles integer NOT NULL,
//         Active integer NOT NULL,
//         FOREIGN KEY (IdUsers) REFERENCES Users (Id),
//         FOREIGN KEY (IdProfiles) REFERENCES Profiles (Id)
//     );`,

//   `CREATE TABLE IF NOT EXISTS Permissions (
//         Id integer PRIMARY KEY autoincrement,
//         Name text NOT NULL,
//         Active integer NOT NULL
//     );`,

//   `CREATE TABLE IF NOT EXISTS ProfilesPermissions (
//         Id integer PRIMARY KEY autoincrement,
//         IdProfiles integer NOT NULL,
//         IdPermissions integer NOT NULL,
//         Active integer NOT NULL,
//         FOREIGN KEY (IdProfiles) REFERENCES Profiles (Id),
//         FOREIGN KEY (IdPermissions) REFERENCES Permissions (Id)
//     );`,

//   `CREATE TABLE IF NOT EXISTS FormsOrigins (
//         Id integer PRIMARY KEY autoincrement,
//         Name text NOT NULL,
//         Active integer NOT NULL
//     );`,

//   `CREATE TABLE IF NOT EXISTS Forms (
//         Id integer PRIMARY KEY autoincrement,
//         IdFormsOrigins integer NOT NULL,
//         Name text NOT NULL,
//         Description text NOT NULL,
//         DtCreation TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
//         Active integer NOT NULL,
//         FOREIGN KEY (IdFormsOrigins) REFERENCES FormsOrigins (Id)
//     );`,

//   `CREATE TABLE IF NOT EXISTS FieldsDataTypes (
//         Id integer PRIMARY KEY autoincrement,
//         Name text NOT NULL,
//         Description text NOT NULL,
//         Active integer NOT NULL
//     );`,

//   `CREATE TABLE IF NOT EXISTS Fields (
//         Id integer PRIMARY KEY autoincrement,
//         IdFieldsDataTypes integer NOT NULL,
//         Name text NOT NULL,
//         Description text NOT NULL,
//         FillingClue text NOT NULL,
//         Active integer NOT NULL,
//         FOREIGN KEY (IdFieldsDataTypes) REFERENCES FieldsDataTypes (Id)
//     );`,

//   `CREATE TABLE IF NOT EXISTS FormsFields (
//         Id integer PRIMARY KEY autoincrement,
//         IdForms integer NOT NULL,
//         IdFields integer NOT NULL,
//         Active integer NOT NULL,
//         FOREIGN KEY (IdForms) REFERENCES Forms (Id),
//         FOREIGN KEY (IdFields) REFERENCES Fields (Id)
//     );`,

//   `CREATE TABLE IF NOT EXISTS Alternatives (
//         Id integer PRIMARY KEY autoincrement,
//         Response text NOT NULL,
//         ShortResponse text NOT NULL,
//         Description text NOT NULL,
//         Active integer NOT NULL
//     );`,

//   `CREATE TABLE IF NOT EXISTS FieldsAlternatives (
//         Id integer PRIMARY KEY autoincrement,
//         IdFields integer NOT NULL,
//         IdAlternatives integer NOT NULL,
//         Active integer NOT NULL,
//         FOREIGN KEY (IdFields) REFERENCES Fields (Id),
//         FOREIGN KEY (IdAlternatives) REFERENCES Alternatives (Id)
//     );`,

//   `CREATE TABLE IF NOT EXISTS FieldsAnswers (
//         Id integer PRIMARY KEY autoincrement,
//         IdFields integer NOT NULL,
//         Value text NOT NULL,
//         DtFilling TIMESTAMP NOT NULL,
//         Active integer NOT NULL,
//         FOREIGN KEY (IdFields) REFERENCES Fields (Id)
//     );`,

//   `CREATE TABLE IF NOT EXISTS UsersInformerFieldsAnswers (
//         Id integer PRIMARY KEY autoincrement,
//         IdUsersInformer integer NOT NULL,
//         IdFieldsAnswers integer NOT NULL,
//         Latitude real NULL,
//         Longitude real NULL,
//         Active integer NOT NULL,
//         FOREIGN KEY (IdUsersInformer) REFERENCES Users (Id),
//         FOREIGN KEY (IdFieldsAnswers) REFERENCES FieldsAnswers (Id)
//     );`,

//   `CREATE TABLE IF NOT EXISTS UsersEndorsementFieldsAnswers (
//         Id integer PRIMARY KEY autoincrement,
//         IdUsersEndorsement integer NOT NULL,
//         IdFieldsAnswers integer NOT NULL,
//         Latitude real NULL,
//         Longitude real NULL,
//         IsTrustable integer NOT NULL,
//         Active integer NOT NULL,
//         FOREIGN KEY (IdUsersEndorsement) REFERENCES Users (Id),
//         FOREIGN KEY (IdFieldsAnswers) REFERENCES FieldsAnswers (Id)
//     );`,

//   `CREATE TABLE IF NOT EXISTS PreliminaryData (
//         Id integer PRIMARY KEY autoincrement,
//         IdFieldsAnswers integer NOT NULL,
//         DtInsert TIMESTAMP NOT NULL,
//         Active integer NOT NULL,
//         FOREIGN KEY (IdFieldsAnswers) REFERENCES FieldsAnswers (Id)
//     );`,

//   `CREATE TABLE IF NOT EXISTS TrustedData (
//         Id integer PRIMARY KEY autoincrement,
//         IdFieldsAnswers integer NOT NULL,
//         DtInsert TIMESTAMP NOT NULL,
//         Active integer NOT NULL,
//         FOREIGN KEY (IdFieldsAnswers) REFERENCES FieldsAnswers (Id)
//     );`,
// ];

export default init_queries;
