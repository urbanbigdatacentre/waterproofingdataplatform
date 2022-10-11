import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MetaDataService {

  private dataSource: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  data: Observable<any> = this.dataSource.asObservable();
  
  constructor(private httpClient: HttpClient) {}

  getMetadata() {
    return this.httpClient.get(environment.wpdApiUrl+'/meta').toPromise().
      then((response)=>{
        // console.log('>>> /meta response ', response)
        // this.dataSource = new BehaviorSubject<any>(response);
        // this.data = this.dataSource.asObservable();
        this.dataSource.next(response);
      })
      .catch(console.log)
  }

  getGeoserverCapabilities() {
    return this.httpClient.get(
      `${environment.geoserverUrl}/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities`
      ,{responseType: 'text'}
    );
  }

  getAPICapabilities(): Observable<Object> {
    return this.httpClient.get(
      // https://waterproofing.geog.uni-heidelberg.de/api/hot/capability
      environment.wpdApiUrl+'/hot/capability?withtimes=true'
    );
  }
}