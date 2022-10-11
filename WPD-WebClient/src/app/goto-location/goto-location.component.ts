import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { startWith, debounceTime, switchMap, map, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import { LocationService } from '../shared/location.service';
import { SidebarService } from '../shared/sidebar.service';

@Component({
  selector: 'goto-location',
  templateUrl: './goto-location.component.html',
  styleUrls: ['./goto-location.component.css']
})
export class GotoLocationComponent implements OnInit {
  formLocation: any;
  locations: any;
  locationValid: boolean;

  constructor(
    private locService: LocationService,
    private sidebarService: SidebarService
  ) { }

  ngOnInit() {
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

  locationLookup(value: any): Observable<any> {
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
    } 
    // called when option clicked for selection
    else {
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
          
          // call gotoLocation to zoom to location
          this.gotoLocation(results.features)
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

  gotoLocation(locations) {
    // console.log('>>> gotoLocation ', locations)
    this.sidebarService.setGotoLocation(locations[0].geometry)
  }
}
