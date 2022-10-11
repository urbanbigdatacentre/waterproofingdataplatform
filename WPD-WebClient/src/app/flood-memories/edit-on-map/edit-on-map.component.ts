import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { map, startWith, catchError, switchMap, debounceTime } from 'rxjs/operators';
import { of } from 'rxjs';

import Map from 'ol/Map';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Icon } from 'ol/style';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { defaults as defaultControls} from 'ol/control';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import GeoJSON from 'ol/format/GeoJSON';
import { Modify, Snap} from 'ol/interaction';

import { FloodMemoryService } from '../flood-memory.service';
import { LocationService } from 'src/app/shared/location.service';
import { environment } from 'src/environments/environment';
import { MainMapDetails } from '../../map/map.component';

export interface GeoJSONGeom {
  "geometry": {
    "coordinates": Array<number>,
    "type": string 
  }
}

@Component({
  selector: 'app-edit-on-map',
  templateUrl: './edit-on-map.component.html',
  styleUrls: ['./edit-on-map.component.css']
})
export class EditOnMapComponent implements OnInit {

  formLocation: FormControl;
  locations: Observable<GeoJSON>;
  locationValid: boolean = false;
  map = null;
  fmLayer = null;
  fmNewLocation: GeoJSONGeom = {
    "geometry": {
      "coordinates": [0,0],
      "type": "Point"
    }
  };
  isShowMap: boolean = true;

  @Input() fmOnMap: GeoJSONGeom
  @Output() newLocation: EventEmitter<GeoJSONGeom> = new EventEmitter()
  
  constructor(
    private locService: LocationService,
    private fmService: FloodMemoryService
  ) { }

  ngOnInit() {
    console.log('>>> EditOnMapComponent >>> ', this.fmOnMap)

    this.formLocation = new FormControl('');

    this.locations = this.formLocation.valueChanges.pipe(
      startWith(''),
      // delay emits
      debounceTime(300),
      // use switch map so as to cancel previous subscribed events, before creating new once
      switchMap(value => {
        if (value !== '') {
          if(value.hasOwnProperty('properties')){
            // this.formLocation.setValue(value.properties.name +', '+ value.properties.city ? value.properties.city: '' +', '+ value.properties.country)
            this.locationValid = true;
            // update point location on map
            this.updatePointOnMap(value)
          }
          else{
            this.locationValid = false;
          }
          // lookup from github
          return this.locationLookup(value);
        } else {
          this.locationValid = false;
          // if no value is pressent, return null
          return of(null);
        }
      })
    );
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap() {
    // console.log('>>> EditFm >>> initMap ')

    let mainMapViewDetails: MainMapDetails = this.fmService.getMapViewDetails()
    let mapCenter, mapZoom, baseLayer;
      if(this.fmOnMap === null) {
        if(mainMapViewDetails) {
          mapCenter = mainMapViewDetails.center
          mapZoom = mainMapViewDetails.zoom
          // baseLayer = mainMapViewDetails.baseLayer
        } else {
          mapCenter = fromLonLat(environment.brasilCenter)
          mapZoom = 3
          // baseLayer = new TileLayer({ source: new OSM() })
        }
      } else {
        mapCenter = fromLonLat([this.fmOnMap.geometry.coordinates[0], this.fmOnMap.geometry.coordinates[1]])
        mapZoom = 18
      }

    // if(!this.map) {
      this.map = new Map({
        target: 'pickOnMap',
        layers: [
          // baseLayer
          new TileLayer({
            source: new OSM()
          })
        ],
        view: new View({
          center: mapCenter,
          zoom: mapZoom
        }),
        // no attribution for this map
        controls: defaultControls({attribution: false}) 
      });

      const source = new VectorSource();
      this.fmLayer = new VectorLayer({
        source: source,
        name: 'fmLayer',
        style: new Style({
          image: new Icon({
            color: 'blue',
            crossOrigin: 'anonymous',
            src: 'assets/dot.png'
          })
        })
      });
      this.map.addLayer(this.fmLayer);

      this.map.getView().setMaxZoom(19)

      let fmFeature = new Feature({
        // fmId: this.fmData.id,
        // time: this.fmData.time,
        // title: this.fmData.title,
        // geometry: new Point(fromLonLat([this.fmOnMap.geometry.coordinates[0], this.fmOnMap.geometry.coordinates[1]]))
        geometry: new Point(mapCenter)
      })
      
      // console.log('before geom change = ',fmFeature.getGeometry())
      this.fmLayer.getSource().addFeature(fmFeature);

      const modify = new Modify({source: source});
      this.map.addInteraction(modify);

      const snap = new Snap({source: source});
      this.map.addInteraction(snap);

      modify.on('modifyend', (evt)=> {
        // only one feature is with a FM
        const feature = evt.features.getArray()[0].clone()
        // const featureGeom = feature.getGeometry()
        const featureGeom = feature.getGeometry().transform('EPSG:3857', 'EPSG:4326')
        // console.log('modifyend ', featureGeom)
        // const coordinates = toLonLat(feature.getGeometry().flatCoordinates)
        this.fmNewLocation.geometry.coordinates = featureGeom.flatCoordinates
        // console.log('before featureGeojson = ', featureGeom)
        // this.fmNewLocation = (new GeoJSON).writeGeometry(featureGeom)
        // console.log('featureGeojson = ', this.fmNewLocation)
        this.newLocation.emit(this.fmNewLocation)
      })
    // }
  }

  /**
   * 
   * @param geom GeoJSON format geometry
   */
  updatePointOnMap(geom: GeoJSONGeom) {
    console.log('>>> EditFM >>> updatePointOnMap ', geom)
    // let existingFmFeature = this.fmLayer.getSource().getFeatures()
    // console.log('existingFmFeature = ', existingFmFeature)
    this.fmLayer.getSource().clear()

    let fmFeature = new Feature({
      // fmId: this.fmData.id,
      // time: this.fmData.time,
      // title: this.fmData.title,
      geometry: new Point(fromLonLat([geom.geometry.coordinates[0], geom.geometry.coordinates[1]]))
    })
    
    // console.log('before geom change = ',fmFeature.getGeometry())
    this.fmLayer.getSource().addFeature(fmFeature);

    // recenter map 
    // this.map.getView().setCenter(fromLonLat([geom.coordinates[0], geom.coordinates[1]]))
    this.map.getView().fit(new Point(fromLonLat([geom.geometry.coordinates[0], geom.geometry.coordinates[1]])), this.map.getSize())

    // this.fmNewLocation = {"geometry":{"coordinates":[this.fmData.location.longitude,this.fmData.location.latitude],"type":"Point"}}
    this.fmNewLocation = {"geometry":{"coordinates":[geom.geometry.coordinates[0] ,geom.geometry.coordinates[1]],"type":"Point"}}
    this.newLocation.emit(this.fmNewLocation)
  }

  locationLookup(value: any): Observable<GeoJSON> {
    // console.log('>>> locationLookup ', value)
    if(typeof value === "string") {
      return this.locService.search(value.toLowerCase()).pipe(
        // map the item property of the github results as our return object
        map(results => {
          results.features.map(loc => {
            let tempLocLabel = `${loc.properties.name}`
            if(loc.properties.city)
            tempLocLabel += ', '+ loc.properties.city
            
            if(loc.properties.country)
              tempLocLabel += ', '+ loc.properties.country

            if(loc.properties.osm_value)
              tempLocLabel += ' ('+ loc.properties.osm_value + ')'
            
            loc.properties.title = tempLocLabel

            return loc
          })

          return results.features
        }),
        // catch errors
        catchError(_ => {
          return of(null);
        })
      );
    } else {
      return this.locService.search(value.properties.name.toLowerCase()).pipe(
        // map the item property of the github results as our return object
        map(results => {
          results.features.map(loc => {
            let tempLocLabel = `${loc.properties.name}`
            if(loc.properties.city)
            tempLocLabel += ', '+ loc.properties.city
            
            if(loc.properties.country)
              tempLocLabel += ', '+ loc.properties.country

            if(loc.properties.osm_value)
              tempLocLabel += ' ('+ loc.properties.osm_value + ')'
            
            loc.properties.title = tempLocLabel

            return loc
          })
          
          return results.features
        }),
        // catch errors
        catchError(_ => {
          return of(null);
        })
      );
    }
  }

  displayFn(feature: any): string | undefined {
    let returnText = "";
    if(feature.properties)
    if(feature.properties.city) {
      returnText = `${feature.properties.name}, ${feature.properties.city}, ${feature.properties.country}`;
    } else {
      returnText = `${feature.properties.name}, ${feature.properties.country}`
    }
    return feature ? returnText : undefined;
  }

}

