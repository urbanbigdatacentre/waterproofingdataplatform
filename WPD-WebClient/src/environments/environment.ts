// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  wpdApiUrl: 'http://localhost:9090',
  wikiUrl: 'http://localhost:8080',
  // geoserverUrl: 'http://localhost:8600/geoserver',
  geocodeApiUrl: 'https://photon.komoot.io/api',
  brasilExtent: [-117.219769875, -45.15060906955992, 1.432573874999999, 25.958610977859664],
  brasilCenter: [-57.893598, -11.823725],
  imageFolderId: 1,
  audioFolderId: 3,
  videoFolderId: 2,
  maxFileSize: 104857600,
  mapTilerKey: 'jlcKtioZjs4UlTWet5Yu',
  // staging config
  // ,wpdApiUrl: 'https://waterproofing.geog.uni-heidelberg.de/api',
  // wikiUrl: 'https://wiki-waterproofing.geog.uni-heidelberg.de',
  geoserverUrl: 'https://waterproofing.geog.uni-heidelberg.de/geoserver',
  wpdWSLiveApiUrl: 'ws://localhost:9090/hot/',
  wpdLiveApiUrl: 'http://localhost:9090/hot/',
  // wpdLiveApiUrl: 'wss://waterproofing.geog.uni-heidelberg.de/wss/hot/data',
  hotLayers: ['FLOODZONES_OFFICIAL', 'PLUVIOMETER_FORM', 'RAIN_FORM', 'FLOODZONES_FORM', 'RIVERFLOOD_FORM', 'PLUVIOMETERS_OFFICIAL']
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
