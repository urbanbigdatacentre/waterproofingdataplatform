# Endpoint under /dashboard 


### **/capability**


_Description_: Get all the formsanswers with their time ranges that are able for query in DB. Works with Http's GET method only.

_Params_:
- `withtimes <string>` Optional param. Whether the time ranges for all formsanswers type required. Eg: true

_Response_: JSON


### **/formsanswers**


_Description_: Gets the all formsanswers based on the filtering params provided along the all fieldanswers which are associated with each formsanswers. Whenever a new entry is made, notification is pushed to all clients listening based on filter params requested. Eg: Notification are not send if different clients have requested for different regions or different time range. This endpoints work with WebSocket rather then usual http and keeps the connection open until the timeout which is defined as parameter in config file.

_Params_: 
- `type* <string>` Types of FormsAnswer specified available in DB. Eg: PLUVIOMETERS_OFFICIAL
- `lat <Latitude>` Latitude from where the data is required. Should used with lon and buffer params. Don't use bbox if this used. Eg: -23.623
- `lon <Longitude>` Longitude from where the data is required. Should used with lat and buffer params. Don't use bbox if this used. Eg: -46.5637
- `buffer <number>` Distance in meters from the Spatial point specified by lat and lon values. Should be used with lat and lon params. Don't use bbox if this used. Eg: 50000
- `time <ISO 8601 time interval string>` Time range of the data requested for Eg: 2021-09-13/2021-09-17
- `limit <number>` Limit the number of formsAnswers in response. Eg: 5
- `bbox <Comma seperated numbers>` Filters formsanswers by spatial bbox. Don't use it with lat, lon, buffer params. Eg: -67.98451956245826,-10.09049971309554,-67.69796501946632,-9.900096285440455
- `user <string>` Filters formsanswers by user ID. Whatever is defined as user ID. Table: 'users' column: 'ID'. Eg: 1


_Response_: 
<JSON> a initial response and further notification as JSON object for newly added values 

### **/data**


_Description_: Predecessor of formsanswer. Later /formsanswers evolved into this.

_Params_: 
- `type* <string>` Types of FormsAnswer specified available in DB. Eg: PLUVIOMETERS_OFFICIAL
- `lat <Latitude>` Latitude from where the data is required. Should used with lon and buffer params. Don't use bbox if this used. Eg: -23.623
- `lon <number>` Longitude from where the data is required. Should used with lat and buffer params. Don't use bbox if this used. Eg: -46.5637
- `buffer <number>` Distance in meters from the Spatial point specified by lat and lon values. Should be used with lat and lon params. Don't use bbox if this used. Eg: 50000
- `time <ISO 8601 time interval string>` Time range of the data requested for Eg: 2021-09-13/2021-09-17
- `limit <number>` Limit the number of formsAnswers in response. Eg: 5
- `bbox <Comma seperated numbers>` Filters formsanswers by spatial bbox. Don't use it with lat, lon, buffer params. Eg: -67.98451956245826,-10.09049971309554,-67.69796501946632,-9.900096285440455


_Response_: 
JSON as initial response and further notification as JSON object for newly added values


### **/fieldsanswers**


_Description_: Gets FieldsAnswers data based on the requested FormsAnswersId. Can have Temporal filter params.

Params: 
- `faid* <number>` ID of the fieldsanswer. Eg: 1234
- `time <ISO 8601 time interval string>` Time range of the data requested for Eg: 2021-09-13/2021-09-17


_Response_: 
<JSON> Object with all fieldanswers associated with it
