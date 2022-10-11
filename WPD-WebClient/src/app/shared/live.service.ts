import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LiveService {

  liveDataWebSocket: WebSocketSubject<any>;
  // liveData = this.liveDataWebSocket.asObservable()
  
  constructor(private httpClient: HttpClient) {}
  
  public getData(param) {
    console.log('>>> LiveService >>> getData ', param)
    let tempParamStr = '?type='+ param.name
    if(param.lat && param.lon && param.buffer)
      tempParamStr = `${tempParamStr}&lat=${param.lat}&lon=${param.lon}&buffer=${param.buffer}`

    // time=2021-07-15/2021-07-16
    // if(param.time)

    if(param.bbox)
      tempParamStr = `${tempParamStr}&bbox=${param.bbox}`
    this.liveDataWebSocket = webSocket(environment.wpdWSLiveApiUrl + 'databybbox' + tempParamStr);
    return this.liveDataWebSocket.asObservable()
  }

  public getFormsAnswers(param) {
    console.log('>>> LiveService >>> getFormsAnswers ', param)
    let tempParamStr = '?type='+ param.name
    // if(param.lat && param.lon && param.buffer)
    //   tempParamStr = `${tempParamStr}&lat=${param.lat}&lon=${param.lon}&buffer=${param.buffer}`

    // time=2021-07-15/2021-07-16
    // if(param.time)

    if(param.bbox)
      tempParamStr = `${tempParamStr}&bbox=${param.bbox}`
    /* this.liveDataWebSocket = webSocket(environment.wpdWSLiveApiUrl + 'formsanswers' + tempParamStr);
    return this.liveDataWebSocket.asObservable() */
    return this.httpClient.get(
      // https://waterproofing.geog.uni-heidelberg.de/api/hot/formsanswers
      environment.wpdLiveApiUrl+'formsanswers' + tempParamStr
    );
  }

  public getFieldsAnswers(param) {
    console.log('>>> LiveService >>> getFeildsAnswers ', param)
    if(! param.formsanswersid)
      return

    // if fieldsanswer data is already present then return in res format
    // else get it from API
    if(param.array_to_json) {
      let resTemplate = {
        'responseTimestamp': new Date().toISOString(),
        'responseData': {
          'array_to_json': [{
          'array_to_json': param.array_to_json,
          'formsanswersid': param.formsanswersid,
          'formcode': param.formcode
        }]},
        'success': true
      }
      
      return new BehaviorSubject<any>(resTemplate).asObservable()
    }

    let tempParamStr = `faid=${param.formsanswersid}`
    return this.httpClient.get(
      // https://waterproofing.geog.uni-heidelberg.de/api/hot/fieldsanswers
      environment.wpdLiveApiUrl+'fieldsanswers?' + tempParamStr
    );
  }

  public getDataByBbox(param) {
    // databybbox
    console.log('>>> LiveService >>> getFormsAnswers ', param)
    let tempParamStr = '?type='+ param.name
    // if(param.lat && param.lon && param.buffer)
    //   tempParamStr = `${tempParamStr}&lat=${param.lat}&lon=${param.lon}&buffer=${param.buffer}`

    // time=2021-07-15/2021-07-16
    // if(param.time)

    if(param.bbox)
      tempParamStr = `${tempParamStr}&bbox=${param.bbox}`
    /* this.liveDataWebSocket = webSocket(environment.wpdWSLiveApiUrl + 'formsanswers' + tempParamStr);
    return this.liveDataWebSocket.asObservable() */
    return this.httpClient.get(
      // https://waterproofing.geog.uni-heidelberg.de/api/hot/databybbox
      environment.wpdLiveApiUrl+'databybbox' + tempParamStr
    );
  }
}
