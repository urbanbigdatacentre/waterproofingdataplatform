import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';
import * as turf from '@turf/turf'
import * as moment from 'moment';

import { environment } from '../../environments/environment';
import FloodMemory from './flood-memory.model';
import { MainMapDetails } from '../map/map.component';

@Injectable()
export class FloodMemoryService {
  
  url = environment.wpdApiUrl;

  // Dynamic store of FMs which is all or spatio-temporal filtered
  memoriesSource = new BehaviorSubject<Array<FloodMemory>>([])
  memories: Observable<Array<FloodMemory>> = this.memoriesSource.asObservable()

  // stores all flood memories from API. updates only when FM active
  allMemoriesSource = new BehaviorSubject<Array<FloodMemory>>([])
  allMemories: Observable<Array<FloodMemory>> = this.allMemoriesSource.asObservable()

  // accepts FM ID as number - for communication from MapComponent to FloodMemoriesComponent
  // fmHoveredOnSource = new BehaviorSubject<number>(null)
  // fmHoveredOn: Observable<number> = this.fmHoveredOnSource.asObservable()
  fmHoveredOnSource = new BehaviorSubject<Array<number>>(null)
  fmHoveredOn: Observable<Array<number>> = this.fmHoveredOnSource.asObservable()

  // accepts FM ID as number - for communication from FloodMemoriesComponent to MapComponent
  fmHoveredonListSource = new BehaviorSubject<number>(null)
  fmHoveredOnList: Observable<number> = this.fmHoveredonListSource.asObservable()

  private mapView: MainMapDetails;

  constructor(private http: HttpClient) { }

  
  /**
   * Generates header with user token
   * 
   * DOESNT WORK, NOT USING
   */
  getHttpOptions() {
    const userJwt = localStorage.getItem('currentUser');

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
        // , 'Authorization': 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJhcGlAd3BkLmNvbSIsIm5hbWUiOiJBUEkiLCJwaWN0dXJlVXJsIjpudWxsLCJ0aW1lem9uZSI6IkFtZXJpY2EvTmV3X1lvcmsiLCJsb2NhbGVDb2RlIjoiZW4iLCJkZWZhdWx0RWRpdG9yIjoibWFya2Rvd24iLCJwZXJtaXNzaW9ucyI6WyJyZWFkOnBhZ2VzIiwicmVhZDphc3NldHMiLCJ3cml0ZTpwYWdlcyIsIm1hbmFnZTpwYWdlcyIsIndyaXRlOmFzc2V0cyIsIm1hbmFnZTphc3NldHMiXSwiZ3JvdXBzIjpbNF0sImlhdCI6MTU4MjU1MDU2NiwiZXhwIjoxNTgyNTUyMzY2LCJhdWQiOiJ1cm46d2lraS5qcyIsImlzcyI6InVybjp3aWtpLmpzIn0.1ZvcG3467ObKmLK8iOeDbAFPkL6R3Jli1FdYa0wZyOKjf1Wm2dUwZFfds1HJlAtHjXxds8j-DvFFcS4F-edYLZnXfZoxBpoiSluoyiHclCq6JnkaDG9XP3Fh10Tcx5Pdmum_vpB5OoyshMYJUYDtQASCGh1a8mJp6fU4ojbuPTSeonFW9QAB_cuqSOuvt0I_KHBZH_OhgAY-FcrnAffEynC_7nX_B60gWJwLaxSRhf5F-nYqTVH4VtEj_2Lj3T_nhIfyxNw13Ccji0ut-_gHKBhQr9M3oNckK5uOdKOLPMruagoDZwKSo8GNFURZD2noAsDvs5MJMmJfcOPNRxSzvA'
        // , 'Authorization': JSON.parse(localStorage.getItem('currentUser'))
      })
    }

    if(userJwt) {
      httpOptions.headers.set('Authorization', JSON.parse(userJwt))
      // httpOptions.headers.append('Authorization', JSON.parse(userJwt))
    }
    return httpOptions;
  }

  /**
   * Gets list of Flood memories based in Spatio-temporal filters
   * 
   * @param param 
   */
  getFloodMemoryList(param: any) {
    // console.log('getFloodMemoryList ', param)
    const allFMs = this.allMemoriesSource.getValue()
    
    let filtered = allFMs.filter((fm) => {
      let desc = this.tryParseJSON(fm.description)

      if(!desc) {
        return;
      }

      // Spatial filter
      const point = turf.point([desc.location.longitude, desc.location.latitude])
      const polygon = turf.bboxPolygon(param.bbox)
      const spatiallyWithin = turf.booleanPointInPolygon(point, polygon)

      // Temporal filter
      // check if page's time falls in requested date's month
      // currently returning for entire month
      const temporalWithin = moment(desc.time).isBetween(
        moment(param.time).startOf('month').format("YYYY-MM-DD"),
        moment(param.time).endOf('month').format("YYYY-MM-DD"),
        null,
        '[]'
      )
      // return temporalWithin

      return spatiallyWithin && temporalWithin
    })
    // console.log('# of All pages = ',filtered.length)
    console.log('# of Pages after filter (spatial and temporal) = ',filtered.length)
    // console.log('filtered = ', filtered)

    this.memoriesSource.next(filtered)

  }

  tryParseJSON (jsonString) {
    try {
        let o = JSON.parse(jsonString);
        if (o && typeof o === "object" && o !==undefined) {
            return o;
        }
    }
    catch (e) { }
  
    return false;
  }

  /**
   * Gets list of Flood memories based in Spatio-temporal filters
   * 
   * @param param 
   */
  getAllFloodMemoryListFromAPI(param: any) {
    // console.log('getAllFloodMemoryListFromAPI ', param)
    const userJwt = localStorage.getItem('currentUser');
    let httpOptions = {};

    if(userJwt) {
      httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': JSON.parse(userJwt)
        })
      }
    } else {
      httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    }

    return this.http.post(`${this.url}/floodmemory/all`, param, httpOptions)
      .subscribe((res: any) => {
      // console.log('>>> Response from floodmemory/list = ', res)
      let resFmList = res.pages.list.map( (fm) => new FloodMemory(
            fm.id,
            fm.path,
            fm.title,
            fm.description,
            fm.isPublished,
            fm.tags,
            fm.content,
            fm.creatorId,
            fm.creatorName
          )
        )
      this.memoriesSource.next(resFmList)
      this.allMemoriesSource.next(resFmList)
    })
  }

  /**
   * Gets All Flood memories from the stored allMemoriesSource, not making a API call
   */
  getAllFloodMemoryList() {
    this.memoriesSource.next(this.allMemoriesSource.getValue())
  }

  /**
   * Gets Flood memory
   * 
   * @param param FM id / wiki page id
   */
  getFloodMemoryDetail(param: { id: number }) : Observable<Object> {
    const userJwt = localStorage.getItem('currentUser');

    if(userJwt) {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': JSON.parse(userJwt)
        })
      }

      return this.http.get(`${this.url}/floodmemory/view?id=${param.id}`, httpOptions)
    }
    else {
      return this.http.get(`${this.url}/floodmemory/view?id=${param.id}`)
    }
    
  }

  /**
   * Uploads media files in particular folder based on its file types
   * 
   * @param formData file data
   */
  uploadMedia(formData) {
    const userJwt = localStorage.getItem('currentUser')
    return this.http.post(environment.wikiUrl + '/u', formData, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + JSON.parse(userJwt)
      }),
      withCredentials: true,
      reportProgress: true,
      observe: 'events',
      responseType: 'text'
    })
  }

  /**
   * Gets the list of assets in a particular folder
   * 
   * @param param folder id
   */
  getAssetList(param) : Observable<Object>{
    const userJwt = localStorage.getItem('currentUser')
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': JSON.parse(userJwt)
      })
    }
    return this.http.post(`${this.url}/floodmemory/asset/list`, param, httpOptions)
  }

  /**
   * Creates Flood memory
   * 
   * @param param 
   */
  createFloodMemory(param: any) : Observable<Object> {
    // const httpOptions = this.getHttpOptions();
    // console.group('httpOptions = ', httpOptions)
    const userJwt = localStorage.getItem('currentUser');

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': JSON.parse(userJwt)
      })
    }
    return this.http.post(`${this.url}/floodmemory/create`, param, httpOptions)
  }

  /**
   * Deletes asset / media assiciated to a Flood memory
   * @param param assetID
   */
  deleteAsset(param: { assetID: number }) : Observable<Object> {
    const userJwt = localStorage.getItem('currentUser')
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': JSON.parse(userJwt)
      })
    }
    return this.http.post(`${this.url}/floodmemory/asset/delete`, param, httpOptions)
  }

  /**
   * Edit Flood memory
   * 
   * @param param 
   */
  editFloodMemory(param: any) : Observable<Object> {
    // console.log('>>> FloodMemoryService >>> editFloodMemory ', param)
    const userJwt = localStorage.getItem('currentUser');

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': JSON.parse(userJwt)
      })
    }
    return this.http.post(`${this.url}/floodmemory/edit`, param, httpOptions)
  }

  /**
   * Deletes Flood memory, internally on server-side deletes all assets on that page
   * 
   * @param param Flood memory / wiki page ID
   */
  deleteFloodMemory(param: { id: number }) : Observable<Object> {
    // console.log('>>> FloodMemoryService >>> deleteFloodMemory ', param)
    const userJwt = localStorage.getItem('currentUser');

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': JSON.parse(userJwt)
      })
    }
    
    return this.http.get(`${this.url}/floodmemory/delete?id=${param.id}`, httpOptions)
  }

  getFloodMemoriesOfUser(param: {userId: number}) : Observable<Object> {
    console.log('>>> FloodMemoryService >>> getFloodMemoriesOfUser ', param)
    const userJwt = localStorage.getItem('currentUser');

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': JSON.parse(userJwt)
      })
    }

    return this.http.get(`${this.url}/floodmemory/user?userId=${param.userId}`, httpOptions)
  }

  getMapViewDetails(): MainMapDetails {
    return this.mapView
  }

  setMapViewDetails(viewDetail: MainMapDetails) {
    this.mapView = viewDetail
  }
}