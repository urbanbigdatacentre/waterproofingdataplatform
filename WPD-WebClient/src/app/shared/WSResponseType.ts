export interface WSResponsetype {
  responseData: any,
  // responseData: string | { array_to_json: Array<FormsAnswersType> },
  responseTimestamp: string, // date in ISO8601 format
  success: boolean
}

export interface FieldAnswersType {
  fieldsanswersdtfilling: string, // date in ISO8601 format
  fieldsanswersid: number,
  fieldsanswersvalue: string
}

export interface FormsAnswersType {
  formcode: string,
  formsanswersgeom: string, // geojson geometry
  formsanswersid: number,
  formsanswerslatitude: number,
  formsanswerslongitude: number, 
  formsanswersuserinformer: string,
  fias: Array<FieldAnswersType>
}