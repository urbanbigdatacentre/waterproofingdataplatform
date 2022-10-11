import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
// import { webSocket } from 'rxjs/webSocket';

import { Options, ChangeContext, LabelType } from 'ng5-slider';
import * as moment from 'moment';
import Map from 'ol/Map';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import TileLayer from 'ol/layer/Tile';
import { Cluster, OSM, Vector as VectorSource, XYZ, TileWMS } from 'ol/source';
import { Style, Stroke, Fill, Icon, Text, Circle as CircleStyle } from 'ol/style';
// import Layer from 'ol/layer/Layer';
// import Stamen from 'ol/source/Stamen.js';
import { transformExtent, fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
import { unByKey } from 'ol/Observable';
import WMSCapabilities from 'ol/format/WMSCapabilities';
import { defaults as defaultControls } from 'ol/control';
import GeoJSON from 'ol/format/GeoJSON';
import {bbox as bboxStrategy} from 'ol/loadingstrategy';

import { environment } from '../../environments/environment';
import { FloodMemoryService } from '../flood-memories/flood-memory.service';
import { MetaDataService } from '../shared/meta-data.service';
import { FloodMemoryComponent } from '../flood-memories/flood-memory/flood-memory.component';
import { SidebarService } from '../shared/sidebar.service';
import { AlertService } from '../shared/alert.service';
import { LayerNode } from '../shared/treeData';
import { LiveService } from '../shared/live.service';
import { WSResponsetype, FormsAnswersType } from '../shared/WSResponseType';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { LiveFeatureComponent } from '../live-feature/live-feature.component';

// this object type is used by EditOnMapComponent
export interface MainMapDetails {
  center: [], 
  zoom: number
  // ,baseLayer: Layer
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {

  @Input() sidebarVisible: boolean;

  map: Map;
  mapView = null;
  fmLayer: VectorLayer;
  currentExtent: Array<number> = [];
  // Time Slider
  dateRange: Date[];
  slidValue: number;
  slidOptions: Options;
  minDate: Date;
  maxDate: Date;
  showTS: boolean = false;
  clickListener = null;
  hoverListener = null;
  hotClickListener = null;
  hotHoverListener = null;
  fmHighlightLayer: VectorLayer;
  fmActive = false;
  geoserverCapabilities = null;
  showAllFm: boolean = true;
  tree_data: Array<LayerNode>;

  memSubscription: Subscription = null;
  hoverOnListSubscription: Subscription = null;
  showAllFMSubscription: Subscription = null;
  hotSubscriptions: Array<{
    name: string,
    subscription: Subscription
  }> = [];
  // d3schemeSet3: Array<string> = [
  //   '#8dd3c7',
  //   '#ffffb3',
  //   '#bebada',
  //   '#fb8072',
  //   '#fdb462',
  //   '#b3de69',
  //   '#fccde5',
  //   '#d9d9d9',
  //   '#bc80bd',
  //   '#ccebc5',
  //   '#ffed6f'
  // ]

  d3schemeSet3: Array<string> = [
    'rgba(141, 211, 199, 0.7)',
    'rgba(255, 255, 179, 0.7)',
    'rgba(190, 186, 218, 0.7)',
    'rgba(251, 128, 114, 0.7)',
    'rgba(253, 180, 98, 0.7)',
    'rgba(179, 222, 105, 0.7)',
    'rgba(252, 205, 229, 0.7)',
    'rgba(217, 217, 217, 0.7)',
    // 'rgba(188, 128, 189, 0.7)',
    'rgba(204, 235, 197, 0.7)',
    'rgba(255, 237, 111, 0.7)'
  ]
  
  timeFormattedFeatures: Array<{time: string, featuresGeojson: any}> = [];

  allLeafs: Array<LayerNode>;

  constructor(
    private fmService: FloodMemoryService,
    private metaData : MetaDataService,
    private sidebarService: SidebarService,
    // private sidenavService: SidenavService,
    private liveService: LiveService,
    private alertService: AlertService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private loadingBar: LoadingBarService
    ) { 
      // this.allLeafs = this.sidebarService.getAllLeafNodes()
    }

  ngOnDestroy(): void {
    if(this.memSubscription)
      this.memSubscription.unsubscribe();
  }

  ngOnInit() {
    this.mapView = new View({
      center: fromLonLat(environment.brasilCenter),
      extent: transformExtent(environment.brasilExtent, 'EPSG:4326', 'EPSG:3857'),
      zoom: 4
    });

    // key of mrizwan1.khan@gmail.com account
    const attributions =
      'Developed by <a href="https://www.geog.uni-heidelberg.de/gis/" target="_blank">GIScience</a><br>' +
      '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
      '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'+
      '<div>Icons made by <a href="https://www.flaticon.com/authors/those-icons" target="_blank" title="Those Icons">Those Icons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>';

    const osm = new TileLayer({
        source: new OSM()
      })

    this.map = new Map({
      target: 'map',
      layers: [
        osm,
        // olstamen,
        // mapTilerDarkMatter
        // mapTilerToner
      ],
      view: this.mapView,
      controls: defaultControls({ attributionOptions: { collapsible: true } })
    });

    this.metaData.data
      .subscribe(data => {
        // console.log('>>> MapComponent >>> metaDataSubsribe ', data) 
        if(data.available_times)
          this.initTimeSliderVar(data.available_times)
    });

    // Get Geoserver Capabilities
    this.metaData.getGeoserverCapabilities()
      .subscribe( res => {
      let parser = new WMSCapabilities();
      this.geoserverCapabilities = parser.read(res);
      // console.log('this.geoserverCapabilities = ', this.geoserverCapabilities)
    })

    // subscription to listen to FM active or not
    this.sidebarService.fmActiveSource
      .subscribe( active => {
      if(active) {
        // add FM related layers
        this.addFMLayers()

        if(this.showAllFm === false ) {
          this.currentExtent = transformExtent(this.mapView.calculateExtent(this.map.getSize()), 'EPSG:3857', 'EPSG:4326')
          this.reloadFmList(this.currentExtent, moment(this.slidValue).format("YYYY-MM-DD"))
        } else {
          this.fmService.getAllFloodMemoryListFromAPI({})
        }
        
        // subscription on FmList to display points on map
        this.memSubscription = null;
        // if(this.memSubscription === null)
        this.memSubscription = this.fmService.memories
          .subscribe(data => {
            this.clearMap()
            // console.log('>>> MapComponent >>> memories Subsription ', data)
            if(data && data.length > 0) {
              this.displayFmOnMap(data)
            }
            else if(data && data.length == 0)
              this.clearMap()
        });

        // subscription to listen to hover on FM List
        this.hoverOnListSubscription = this.fmService.fmHoveredOnList
          .subscribe( (data: number) => {
            // console.log('hoveredFm on list', data)
            if(data){
              // search for FM on map
              const fmFeature = this.searchFmOnMap(data)
              // console.log('fmFeature = ', fmFeature)
              // highlight on map
              if(fmFeature)
                this.highlightFMonMap(fmFeature)
            } else {
              // clear highlight FM 
              if(this.fmHighlightLayer)
                this.fmHighlightLayer.getSource().clear()
            }
          })

        this.showAllFMSubscription = this.sidebarService.showAllFm
          .subscribe( (showAllFm: boolean) => {
          // console.log('>>> MapComponent >>> showAllFm.subscribe ', showAllFm)
          this.showAllFm = showAllFm
          if(showAllFm !== null) {
            
            if(this.showAllFm === false ) {
              this.currentExtent = transformExtent(this.mapView.calculateExtent(this.map.getSize()), 'EPSG:3857', 'EPSG:4326')
              this.reloadFmList(this.currentExtent, moment(this.slidValue).format("YYYY-MM-DD"))
            } else {
              // this.fmService.getAllFloodMemoryList({})
              this.fmService.getAllFloodMemoryList()
            }
          } 
        })

        // add FM point clicked
        this.addFMInteraction()

        this.fmActive = true
        // this.showTimeSlider()
        this.showTS = true

      } else {
        // Flood Memory functionality closed, remove all Fm related objects 
        if(this.memSubscription)
          this.memSubscription.unsubscribe();
        
        if(this.hoverOnListSubscription)
          this.hoverOnListSubscription.unsubscribe();

        if(this.showAllFMSubscription)
          this.showAllFMSubscription.unsubscribe();

        // this.clearMap();
        this.removeFMLayers();
        this.removeFMInteraction();
        this.fmActive = false
        // dont show TimeSlider if Fm is deactive
        this.showTS = false
      }

    })

    // one Layerlist which maintains Layers List when dynamically added and when its visibility is changes
    // subscription to listen which layers are selected or deselected
    // receives entire array of layers and sets visiblity to all layers
    this.sidebarService.layerList
      .subscribe( (layerList: Array<LayerNode>) => {
      if(layerList && layerList.length > 0) {
        // console.log('Layer selection changed OR Layer list updated', layerList)
        
        // get updated list everytime as it might be that a new layerNode is add
        this.allLeafs = this.sidebarService.getAllLeafNodes()

        /* this.allLeafs.forEach( pLayer => {
          if(pLayer.layerName)
          if(pLayer.name) {
            const layerOnMap = this.searchLayerByNameInMap(pLayer.name)
            if(layerOnMap)
              layerOnMap.setVisible(pLayer.state)
          }
        }) */

        let hotLayerCounter = 0
        this.allLeafs.forEach( pLayer => {
          // check if layer already on map, if not that add on map
          if(pLayer.layerName && pLayer.source === 'wms'){
            if(this.searchLayerByPropertyNameInMap(pLayer.layerName, 'layerName') === null){
              this.createWMSLayer(pLayer)
            }
          }

          // if layer already Exist on Map then set its Visibilty to current visible state
          if(pLayer.layerName)
          if(pLayer.name) {
            const layerOnMap = this.searchLayerByNameInMap(pLayer.name)
            if(layerOnMap)
              layerOnMap.setVisible(pLayer.state)
          }

          // if hot layers then
          if(pLayer.source === 'hot') {
            // check if hot layer already on map, if not then create it and add it on map
            const layerOnMap = this.searchLayerByPropertyNameInMap(pLayer.name, 'name')
            if(layerOnMap === null){
              this.createLiveLayer(pLayer, hotLayerCounter++)
            } else {
              layerOnMap.setVisible(pLayer.state)
              // console.log(pLayer.state)
              // if(layerOnMap.getVisible() !== pLayer.state) 
              // if(pLayer.state === true){
                // check for map extent too large to display data
                // subscribe to listen to live layer
                // if(!this.isMapExtentTooLarge())
                // console.log('>>> calling subscribeLiveData')
                  // this.subscribeLiveData(pLayer)
                // else{
                  // TODO: uncheck checkbox
                  // console.log(pLayer)
                  // pLayer.state = false
                // }
              // }
              // else if(pLayer.state === false){
                // this.unsubscribeLiveData(pLayer)
                // clear features from map
                // layerOnMap.getSource().clear()
                // // clear timestamps from timeslider
                // this.showTS = false
              // }

              
            }
            
          }
          
        })

        const visibleHotLayers = this.allLeafs.filter( l => (l.source === 'hot' && l.state) )
        // clear the Multiple feature panel
        if(visibleHotLayers.length === 0)
          this.sidebarService.featuresListSource.next([])

      }
    })

    this.addHotInteraction()

    this.map.on('moveend', (evt) => {
      // console.log('map moveend ', evt)
      // const currentlyLoadedComponentInSidebar = this.sidenavService.getComponent();
      // if(this.sidenavService.getLoadedComponentName() 
      //   && this.sidenavService.getLoadedComponentName() === "FloodMemoriesComponent") {
      // if(currentlyLoadedComponentInSidebar && currentlyLoadedComponentInSidebar.data.componentName === "FloodMemoriesComponent") {
      if(this.fmActive && this.showAllFm !== true ) {
        this.currentExtent = transformExtent(this.mapView.calculateExtent(this.map.getSize()), 'EPSG:3857', 'EPSG:4326')
        this.reloadFmList(this.currentExtent, moment(this.slidValue).format("YYYY-MM-DD"))
      }
      this.fmService.setMapViewDetails({
        center: this.mapView.getCenter(), 
        zoom: this.mapView.getZoom()
        // baseLayer: Object.assign({}, this.map.getLayers().getArray()[0])
        // ,baseLayer: _.cloneDeep(this.map.getLayers().getArray()[0])
      })
    })

    /* 
    this.map.on('change:size', (evt) => {
      // this.map.updateSize();
      console.log('>>> MapComponent >>> map.change:size')
    }) 
    */

    // Subscription for listen Zoom To Layer Extent
    /* this.sidebarService.zoomToLayerName.subscribe( (layerName: string) => {
      if(layerName && layerName !== '') {
        let layerToZoom = this.searchLayerByLayerNameInMap(layerName)
        // console.log('layerToZoom = ', layerToZoom)
        let layerExtent = this.getLayerExtentFromGeoserverCapabilities(layerName)
        if(layerToZoom && layerExtent) {
          // console.log('layerExtent = ', layerExtent)
          var layerExtent_3857 = transformExtent(layerExtent, 'EPSG:4326', 'EPSG:3857')
          this.map.getView().fit(layerExtent_3857, {duration: 500})
        } else {
          console.error('Layer '+ layerName + ' not found or Extent not found')
          this.alertService.error(this.translate.instant('MAP.LAYER_NOT_FOUND'));
        }
      }
    }) */

    this.sidebarService.zoomToLayerName
      .subscribe( (layerExtent: Array<number>) => {
        if(layerExtent && layerExtent.length > 0) {
          // console.log('layerExtent = ', layerExtent)
          var layerExtent_3857 = transformExtent(layerExtent, 'EPSG:4326', 'EPSG:3857')
          this.map.getView().fit(layerExtent_3857, {duration: 500})
        } 
      })

    
    // listen to Base Layer change from right-sidebar
    this.sidebarService.baseLayer
      .subscribe( (baseLayer: string) => {
        let base_layer = null;
        if(baseLayer === 'osm') {
          base_layer = new TileLayer({
            source: new OSM({
              attributions: attributions
            })
          })
        } else if(baseLayer === 'dark') {
          base_layer = new TileLayer({
            source: new XYZ({
              attributions: attributions,
              url:
                'https://api.maptiler.com/maps/toner/{z}/{x}/{y}.png?key=' + environment.mapTilerKey,
            })
          })
        } else if (baseLayer === 'satellite') {
          base_layer = new TileLayer({
            source: new XYZ({
              attributions: attributions,
              url:
                'https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=' + environment.mapTilerKey,
            })
          })
        } 

        // console.log('base_layer = ', base_layer, this.map.getLayers() )
        this.map.getLayers().removeAt(0)
        this.map.getLayers().insertAt(0, base_layer);
      })

    // zooms to location when searched
    this.sidebarService.gotoLocation
      .subscribe( (location: any) => {
        // expecting location as geometry part of GEOJSON
        if(location) {
          if(location.type = 'POINT') {
            // console.log('>>> gotoLocation >>> subscribe ', location)
            this.map.getView().setCenter(fromLonLat(location.coordinates), {duration: 500})
            this.map.getView().setZoom(10)
          } else if(location.type = 'POLYGON') { 
            const locGeom = new Polygon(location.coordinates)
            // console.log('locGeom ', locGeom.getExtent())
            this.map.getView().fit(locGeom.transform('EPSG:4326', 'EPSG:3857'), {duration: 500})
          }
        }
      })
  }

  /**
   * 
   * @param wmsNodes 
   */
  createWMSLayer(wmsNode) {
    // create ol layers of all leaf nodes in our tree structure which has aproperty of 'layerName'
    // wmsNodes.forEach( pLayer => {
      if(wmsNode.layerName){
        const tempPLayer = new TileLayer({
          // title: this.translate.instant('MAP.RISK_GENERAL_LAYER'),
          name: wmsNode.name,
          layerName: wmsNode.layerName,
          source: new TileWMS({
            url: `${environment.geoserverUrl}/wms`,
            params: {'LAYERS': wmsNode.layerName, 'TILED': true},
            serverType: 'geoserver'
          }),
          opacity: 0.8
        })
        tempPLayer.setVisible(wmsNode.state)
        this.map.addLayer(tempPLayer)
      }
    // });
  }

  /**
   * Generate Layers required for Flood memory funcitonality
   */
  addFMLayers() {
    let styleCache = {};
    // Flood Memory layer
    this.fmLayer = new VectorLayer({
      source: new Cluster({
        // distance: 10,  
        source: new VectorSource()
      }),
      name: 'fmLayer',
      // style for cluster
      style: function (feature) {
        let size = feature.get('features').length;
        let style = styleCache[size];
          if (!style) {
            if(size > 1){
            style = new Style({
              image: new CircleStyle({
                radius: 10,
                stroke: new Stroke({
                  color: '#fff',
                }),
                fill: new Fill({
                  color: '#3399CC',
                }),
              }),
              text: new Text({
                text: size.toString(),
                fill: new Fill({
                  color: '#fff',
                }),
              }),
            });
          } else {
            style = new Style({
              image: new Icon({
                scale: 0.1,
                anchor: [0.5, 1],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                src: 'assets/img/PIN_FLOODMEMORY.png',
              })
            });
          }
          styleCache[size] = style;
        }
        return style;
      }
    });
    this.fmLayer.setZIndex(2)
    this.map.addLayer(this.fmLayer);

    // FM highlight layer
    this.fmHighlightLayer = new VectorLayer({
      source: new VectorSource(),
      name: 'fmHighlightLayer',
      style: new Style({
        image: new Icon({
          // src: 'assets/img/flood_blue.png',
          scale: 0.15,
          anchor: [0.5, 1],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          src: 'assets/img/PIN_FLOODMEMORY.png',
        })
      })
    });
    this.fmHighlightLayer.setZIndex(2)
    this.map.addLayer(this.fmHighlightLayer);

  }

  removeFMLayers() {
    if(this.fmLayer)
      this.fmLayer.getSource().getSource().clear()
    // this.fmLayer.getSource().clear()
    
    if(this.fmHighlightLayer)
      this.fmHighlightLayer.getSource().clear()

    this.fmLayer = null;
    this.fmHighlightLayer = null;
  }

  /**
   * Fires event change to reload the Flood Memory List
   * 
   * @param bbox Map Extent
   * @param time Time vlaue set on Time Slider
   */
  reloadFmList(bbox, time) {
    // console.log('>>> reloadFmList ', bbox, time)
    this.fmService.getFloodMemoryList({bbox, time})
  }

  showTimeSlider() {
    // this.showTS = false;
    if(this.fmActive && this.showAllFm==false)
      this.showTS = true;
    else 
      this.showTS = false;

    return this.showTS
  }
  
  /**
   * Initializes values for time slider
   */
  initTimeSliderVar(dates: Array<string>) {
    /*  Experimenting to use Time Slider with Moment object

    const dateRange = dates.map( date => moment(date));
    const minDate = dateRange[0];
    // const maxDate = dateRange[dateRange.length - 1];
    const maxDate = dates[dates.length - 1];
    this.slidValue = moment(`${dates[dates.length - 1]} +0000`, "YYYY-MM-DD").valueOf();
    // console.log('this.slidValue = ', this.slidValue)
    this.slidOptions = {
      stepsArray: dates.map((date) => {
        return { value: moment(`${date} +0000`, "YYYY-MM-DD").valueOf() };
      }),
      translate: (value: number, label: LabelType): string => {
        return moment(value, 'DD-MM-YYYY').toString();
      }
    }; */
    const tempdateRange = dates.map( date => new Date(date));
    // console.log('tempdateRange = ', tempdateRange)
    // remove duplicate dates
    let dateRange = tempdateRange
      .map(function (date) { return date.getTime() })
      .filter(function (date, i, array) {
          return array.indexOf(date) === i;
      })
      .map(function (time) { return new Date(time); });
    // console.log('dateRange = ', dateRange)
    
    const minDate = dateRange[0];
    const maxDate = dateRange[dateRange.length - 1];
    this.slidValue = maxDate.getTime();
    this.slidOptions = {
      stepsArray: dateRange.map((date) => {
        return { value: date.getTime() };
      }),
      translate: (value: number, label: LabelType): string => {
        // return new Date(value).toDateString();
        return `${moment(value).utc().format('MMM YYYY')}`
      }
    };
  }
  
  /**
   * Called when time slider is slided
   * 
   * @param changeContext Event
   */
  onSliderChange(changeContext: ChangeContext) {
    // console.log('>>> MapComponent >>> onSliderChange ', changeContext.value)
    // const currentlyLoadedComponentInSidebar = this.sidenavService.getComponent();
    // if(currentlyLoadedComponentInSidebar && currentlyLoadedComponentInSidebar.data.componentName === "FloodMemoriesComponent") {
      this.reloadFmList(this.currentExtent, moment(this.slidValue).format("YYYY-MM-DD"))
    // }
  }

  /**
   * Display Flood Memory as points on map
   * 
   * @param fmList 
   */
  displayFmOnMap(fmList: Array<any>) {
    // console.log('>>> MapComponent >>> displayFmOnMap ', fmList)
    let fmFeatures = fmList.map( fm => {
      const desc = JSON.parse(fm.description)
      const location = desc.location
      const time = desc.time

      let fmFeature = new Feature({
        fmId: fm.id,
        time: time,
        title: fm.title,
        description: fm.description,
        path: fm.path,
        // geometry: new Point([location.longitude, location.latitude]).transform('EPSG:4326', 'EPSG:3857')
        geometry: new Point(fromLonLat([location.longitude, location.latitude]))
      })
      return fmFeature
    });
    
    // console.log(fmFeatures)
    this.fmLayer.getSource().getSource().addFeatures(fmFeatures);
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
   * Searches for the LayerNode from our Sidebar TreeData 
   * by name provided
   * 
   * @param name string Name of the LayerNode to search for
   * @returns LayerNode 
   */
  searchLayerByNameInTreeData(name: string): LayerNode {
    return this.tree_data.find(node => node.name === name)
  }

  /**
   * Searches for a layer on map
   * 
   * @param name string Layer's name
   * @returns openlayer layer
   */
  searchLayerByNameInMap(name: string): any {
    let returnLayer = null;
    this.map.getLayers().forEach(layer => {
      if(layer.get('name') === name)
        returnLayer = layer
    });
    return returnLayer;
  }

  /**
   * Searches for Layer with the layerName as name provided
   * 
   * @param name Name of the Layer to search on map 
   * @returns ol layer
   */
  searchLayerByLayerNameInMap(name: string): any {
    let returnLayer = null;
    this.map.getLayers().forEach(layer => {
      // console.log('layer = ', layer)
      if(layer.get('layerName') === name)
        returnLayer = layer
    });
    return returnLayer;
  }

  /**
   * Searches for Layer with the property supplied to the function
   * 
   * @param name Name of the Layer to search on map 
   * @param propertyName
   * @returns ol layer
   */
  searchLayerByPropertyNameInMap(name: string, propertyName: string): any {
    let returnLayer = null;
    this.map.getLayers().forEach(layer => {
      // console.log('layer = ', layer)
      if(layer.get(propertyName) === name)
        returnLayer = layer
    });
    return returnLayer;
  }

  /**
   * Gets Extent from Geoserver's Capabilities
   * 
   * @param layerName 
   * @returns ol layer extent
   */
  getLayerExtentFromGeoserverCapabilities(layerName: string): any {
    const tempLayerMetadata = this.geoserverCapabilities.Capability.Layer.Layer.find(l => l.Name === layerName)
    if(tempLayerMetadata)
      return tempLayerMetadata.EX_GeographicBoundingBox;
    else {
      console.error('Layer '+ layerName +' not found in Geoserver Capability')
      return;
    }
  }

  /**
   * Clear FM vector layer
   */
  clearMap(): void {
    if(this.fmLayer)
     this.fmLayer.getSource().getSource().clear();
      // this.fmLayer.getSource().clear();
  }

  /**
   * Added map interaction need for Flood memories functionality
   */
  addFMInteraction(): void {
    
    this.clickListener = this.map.on('singleclick', evt => {
      /* this.fmLayer.getFeatures(evt.pixel).then( (features) => {
        const feature = features.length ? features[0] : undefined;
        if (feature) {
          console.log('feature cliked ', features)
          // open FM Detail modal
          this.showDetailFloodMemory(feature)
        }
      }); */

      this.map.forEachFeatureAtPixel(evt.pixel, (features) =>  {
        // console.log('features ', features)
        const feature = features.get('features').length ? features.get('features')[0] : undefined;
        if(features.get('features').length === 1)
        if (feature) {
          console.log('feature cliked ', features)
          // open FM Detail modal
          this.showDetailFloodMemory(feature)
        }
      }, {
        layerFilter: (l)=> {
          return (l.get('name') === 'fmLayer')
        }
      });
    });

    this.hoverListener = this.map.on('pointermove', evt => {
      // old working code for single FM features
      /* this.fmLayer.getFeatures(evt.pixel).then( (features) => {
        const feature = features.length ? features[0] : undefined;
        if (feature) {
          // call fmService to notify FloodMemoriesComponent to highlight Fm from List
          this.fmService.fmHoveredOnSource.next(feature.get('fmId'))
        } else {
          this.fmService.fmHoveredOnSource.next(null)
        }
      }); */

      if(this.fmLayer){
        // hover for cluster features; works only for cluster features and not for single features
        /* this.fmLayer.getFeatures(evt.pixel).then( (cfeatures) => {
          if(cfeatures.length > 0) {
            cfeatures = cfeatures.length ? cfeatures[0] : undefined;
            const features = cfeatures.get('features').length ? cfeatures.get('features') : undefined;
            if(features) {
              let fmIds = features.map( f => f.get('fmId'))
              this.fmService.fmHoveredOnSource.next(fmIds)
            } 
          } else {
            this.fmService.fmHoveredOnSource.next(null)
          }
        }); */

        // remove and selected FM
        this.fmService.fmHoveredOnSource.next(null)
        this.map.forEachFeatureAtPixel(evt.pixel, (cfeatures) =>  {
          const features = cfeatures.get('features').length ? cfeatures.get('features') : undefined;
          // console.log(features)
          if(features) {
            let fmIds = features.map( f => f.get('fmId'))
            // console.log(fmIds)
            this.fmService.fmHoveredOnSource.next(fmIds)
          } 
          return true;
        }, {
          layerFilter: (l)=> {
            return (l.get('name') === 'fmLayer')
          }
        });
      }
    });
  }

  /**
   * Removes map Interactions required for Flood Memory functionality
   */
  removeFMInteraction(): void {
    // console.log('>>> removeFMInteraction ')
    unByKey(this.clickListener)
    unByKey(this.hoverListener)
  }

  /**
   * Show Flood Memory details in modal
   * 
   * @param fmFeature openlayers feature type
   */
  showDetailFloodMemory (fmFeature: any) {

    this.fmService.getFloodMemoryDetail({id: fmFeature.get('fmId')})
    // TODO: chnage the res type from any to an interface
      .subscribe( (res: any) => {
        // Object<{pages: Object<{single}>}>
        console.log('getFloodMemoryDetail response = ', res)

        const dialogRef = this.dialog.open(FloodMemoryComponent, {
          width: '700px',
          data: res.pages.single
        });
    
        dialogRef.afterClosed().subscribe(result => {
          // console.log('>>> MapComponent >>> afterDialogClosed ', result)
        });
      },
      err => {
        console.log(err);
        // this.alertService.error('Server Error: '+ err.error[0].message)
      })
  }

  /**
   * Search for Flood Memory feature from ID
   * 
   * @param fmId Flood Memory ID
   * @returns openlayers Feature
   */
  searchFmOnMap(fmId: number): Feature {
    return this.fmLayer.getSource().getSource().getFeatures().find( f => f.get('fmId') === fmId)
  }

  /**
   * Highlight the feature on map. By adding this feature in our Highlight layer
   * 
   * @param feature 
   */
  highlightFMonMap(feature) {
    // clean layer
    this.fmHighlightLayer.getSource().clear()
    this.fmHighlightLayer.getSource().addFeature(feature)
  }

  /**
   * Generates colors from schemeCategory10 color scheme which is used in chartInput and 
   * on map's feature style to be the same
   * 
   * @returns string color Hex code
   */
  /* getRandomColor(counter: number): string {
    // schemeCategory10 has only 10 colors. hence counter value should be between 0-9
    counter = counter % 9;
    counter = (counter + 1) > 9 ? counter - 1 : (counter + 1);

    return d3schemeSet3.schemeCategory10[Math.trunc(counter)];
  } */

  /**
   * 
   * @param layer 
   */
  /* createLiveLayer(layerNode: LayerNode, layerCounter: number) {
    // console.log('>>> MapCompoment >>> createLiveLayer ', layerNode)
    
    // Flood Memory layer
    var defaultStyle = {
      'Point': new Style({
        image: new CircleStyle({
          fill: new Fill({
            // color: 'rgba(255,255,0,0.5)'
            color: this.d3schemeSet3[layerCounter]
          }),
          radius: 5,
          stroke: new Stroke({
            color: '#ff0',
            width: 1
          })
        })
      }),
      'LineString': new Style({
        stroke: new Stroke({
          // color: '#f00',
          color: this.d3schemeSet3[layerCounter],
          width: 3
        })
      }),
      'Polygon': new Style({
        fill: new Fill({
          // color: 'rgba(0,255,255,0.5)'
          color: this.d3schemeSet3[layerCounter]
          // color: 'rgba(141,211,199, 0.7)'
        }),
        stroke: new Stroke({
          // color: '#0ff',
          color: '#222222',
          width: 1
        })
      }),
      'MultiPoint': new Style({
        image: new CircleStyle({
          fill: new Fill({
            // color: 'rgba(255,0,255,0.5)'
            color: this.d3schemeSet3[layerCounter]
          }),
          radius: 5,
          stroke: new Stroke({
            // color: '#f0f',
            color: '#222222',
            width: 1
          })
        })
      }),
      'MultiLineString': new Style({
        stroke: new Stroke({
          // color: '#0f0',
          color: this.d3schemeSet3[layerCounter],
          width: 3
        })
      }),
      'MultiPolygon': new Style({
        fill: new Fill({
          // color: 'rgba(0,0,255,0.5)'
          color: this.d3schemeSet3[layerCounter]
        }),
        stroke: new Stroke({
          // color: '#00f',
          color: '#222222',
          width: 1
        })
      })
    };

    this.fmLayer = new VectorLayer({
      source: new VectorSource(),
      name: layerNode.name,
      // style: new Style({
      //   image: new Icon({
      //     color: d3schemeSet3[layerCounter],
      //     crossOrigin: 'anonymous',
      //     src: 'assets/dot.png'
      //   })
      // })
      style: function(feature, resolution) {
        var featureStyleFunction = feature.getStyleFunction();
        if (featureStyleFunction) {
          return featureStyleFunction.call(feature, resolution);
        } else {
          return defaultStyle[feature.getGeometry().getType()];
        }
      }
    });
    this.map.addLayer(this.fmLayer);
  } */
  
  createLiveLayer(layerNode: LayerNode, layerCounter: number) {
    // console.log('>>> MapCompoment >>> createLiveLayer ', layerNode)
    
    // Live layer
    var defaultStyle = {
      'Point': new Style({
        image: new Icon({
          color: 'white',
          scale: 0.1,
          // opacity: 0.5,
          // crossOrigin: 'anonymous',
          anchor: [0.5, 1],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          src: `assets/img/PIN_${layerNode.name}.png`
          // src: 'data:image/svg+xml,' + encodeURIComponent(`
          // <svg width="20px" height="20px" id="a4752417-fea0-42ac-93f8-2871bd16eff1" data-name="Camada 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 410 410"><circle cx="205.5" cy="159.5" r="120.5" fill="#fff"/><path d="M205,14.64c-79.95,0-145,65.05-145,145a143.68,143.68,0,0,0,28.93,86.93L196.06,390.86c.27.35.68.48,1,.8a10.79,10.79,0,0,0,16.89-.8c30.85-41.16,87.4-118,109.14-147a.14.14,0,0,1,0,0l.13-.18a144,144,0,0,0,26.78-84C350,79.69,285,14.64,205,14.64Zm-.26,258.84c-62.79,0-114.1-51.32-114.1-114.1S142,45.28,204.74,45.28s114.09,51.31,114.09,114.1S267.52,273.48,204.74,273.48Z" fill="#3b7097"/><rect x="186.81" y="110.16" width="36.3" height="135.45" fill="#ececec"/><path d="M226.5,249H183.43V106.78H226.5Zm-36.3-6.77h29.53V113.55H190.2Z" fill="#3b7097"/><rect x="189.34" y="108.68" width="15.76" height="136.35" fill="#d9d9d9"/><path d="M188.56,207.7,190,205c5.69-3.5,7.27-5.29,12.33-1.52.46.33.91.67,1.39,1l3.74,2.72C211,210,214,206.76,215,206l3.79-2.87a2.59,2.59,0,0,1,4.21,2v36.54a2.59,2.59,0,0,1-2.48,2.58l-29.13,1.26a2.58,2.58,0,0,1-2.7-2.48l-1.36-33A2.6,2.6,0,0,1,188.56,207.7Z" fill="#9fdfff"/><path d="M205.09,205.44l-1.37-1c-.48-.3-.93-.64-1.39-1-5.06-3.77-6.64-2-12.33,1.52l-1.44,2.7a2.6,2.6,0,0,0-1.23,2.32l1.36,33a2.58,2.58,0,0,0,2.7,2.48l13.7-.59Z" fill="#7dd6f9"/><path d="M226.5,249H183.43V106.78H226.5Zm-36.3-6.77h29.53V113.55H190.2Z" fill="#727272"/><path d="M162.09,75.72h85.82a0,0,0,0,1,0,0V79.9a28.62,28.62,0,0,1-28.62,28.62H190.72A28.62,28.62,0,0,1,162.09,79.9V75.72a0,0,0,0,1,0,0Z" fill="#ececec"/><path d="M215.43,111.91H194.57a35.9,35.9,0,0,1-35.86-35.86V72.34h92.58v3.71A35.9,35.9,0,0,1,215.43,111.91Zm-49.79-32.8a29.12,29.12,0,0,0,28.93,26h20.86a29.12,29.12,0,0,0,28.93-26Z" fill="#3b7097"/><path d="M165.51,75.63h39.36a0,0,0,0,1,0,0v33a0,0,0,0,1,0,0H194.34a28.84,28.84,0,0,1-28.84-28.84V75.63A0,0,0,0,1,165.51,75.63Z" fill="#d9d9d9"/><path d="M215.43,111.91H194.57a35.9,35.9,0,0,1-35.86-35.86V72.34h92.58v3.71A35.9,35.9,0,0,1,215.43,111.91Zm-49.79-32.8a29.12,29.12,0,0,0,28.93,26h20.86a29.12,29.12,0,0,0,28.93-26Z" fill="#727272"/><rect x="183.79" y="139.33" width="25.94" height="2.71" fill="#727272"/><rect x="183.79" y="157.95" width="25.94" height="2.71" fill="#727272"/><rect x="183.79" y="176.58" width="25.94" height="2.71" fill="#727272"/><rect x="183.79" y="195.2" width="25.94" height="2.71" fill="#727272"/><rect x="183.79" y="213.83" width="25.94" height="2.71" fill="#727272"/></svg>`)
        })
      }),
      /* 'Point': new Style({
        image: new CircleStyle({
          fill: new Fill({
            // color: 'rgba(255,255,0,0.5)'
            color: this.d3schemeSet3[layerCounter]
          }),
          radius: 5,
          stroke: new Stroke({
            color: '#ff0',
            width: 1
          })
        })
      }), */
      'LineString': new Style({
        stroke: new Stroke({
          // color: '#f00',
          color: this.d3schemeSet3[layerCounter],
          width: 3
        })
      }),
      'Polygon': new Style({
        fill: new Fill({
          // color: 'rgba(0,255,255,0.5)'
          color: this.d3schemeSet3[layerCounter]
          // color: 'rgba(141,211,199, 0.7)'
        }),
        stroke: new Stroke({
          // color: '#0ff',
          color: '#222222',
          width: 1
        })
      }),
      'MultiPoint': new Style({
        image: new Icon({
          color: 'white',
          scale: 0.1,
          // opacity: 0.5,
          // crossOrigin: 'anonymous',
          anchor: [0.5, 0.5],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          src: `assets/img/PIN_${layerNode.name}.png`
        })
      }),
      'MultiLineString': new Style({
        stroke: new Stroke({
          // color: '#0f0',
          color: this.d3schemeSet3[layerCounter],
          width: 3
        })
      }),
      'MultiPolygon': new Style({
        fill: new Fill({
          // color: 'rgba(0,0,255,0.5)'
          color: this.d3schemeSet3[layerCounter]
        }),
        stroke: new Stroke({
          // color: '#00f',
          color: '#222222',
          width: 1
        })
      })
    };


    let vectorSource = new VectorSource({
      loader: (extent, resolution, projection, success, failure) => {
        var proj = projection.getCode();
        if(layerNode.state === true){
          // console.log(' ========= extent changed =========== ')
          this.subscribeLiveData(layerNode, transformExtent(extent, proj, 'EPSG:4326'))
        }
      },
      strategy: bboxStrategy
    
    })
    let liveLayer = new VectorLayer({
      source: vectorSource,
      name: layerNode.name,
      style: function(feature, resolution) {
        // console.log('>>> styleFunction >>> feature ', feature)
        if(feature.get('formcode') === 'FLOODZONES_OFFICIAL') {
          let fieldAnswers = feature.get('array_to_json')
          fieldAnswers = fieldAnswers.filter(fia => fia.fieldname === 'classe')
          // console.log('fieldAnswers = ', fieldAnswers)
          let color = ''
          // low
          if(fieldAnswers[0].fieldsanswersvalue.toUpperCase() === 'Baixa'.toUpperCase()) {
            color = 'rgba(88,206,255, 0.6)'
          } 
          // medium
          else if(fieldAnswers[0].fieldsanswersvalue.toUpperCase() === 'Média'.toUpperCase()) {
            color = 'rgba(37,191,255, 0.6)'
          } 
          // high
          else if(fieldAnswers[0].fieldsanswersvalue.toUpperCase() === 'Alta'.toUpperCase()) {
            color = 'rgba(0,171,241, 0.6)'
          }
          return new Style({
            fill: new Fill({
              color: color
            }),
            stroke: new Stroke({
              color: '#0085bc',
              width: 1
            })
          })
          
        }
        else if(feature.get('formcode') === 'RAIN_FORM') {
          let fieldAnswers = feature.get('array_to_json')
          fieldAnswers = fieldAnswers.filter(fia => fia.fieldname === 'situation')
          // console.log('fieldAnswers = ', fieldAnswers)
          // let color = 'rgba(11,184,255, 0.6)'
          if(fieldAnswers && fieldAnswers.length > 0){
            let src = ''
            // const tempEnvFloodzoneVal = environment.floodzoneLevels.map( val => val.toUpperCase() )
            // if(tempEnvFloodzoneVal.indexOf(fieldAnswers.fieldsanswersvalue.toUpperCase()) !== -1) {          
            // passable
            if(fieldAnswers[0].fieldsanswersvalue.toUpperCase() === 'transitavel'.toUpperCase()) {
              // src = `assets/img/PIN_${'transitavel'.toUpperCase()}.png`
              src = `assets/img/PIN_PASSABLE.png`
            } 
            // impassable
            else if(fieldAnswers[0].fieldsanswersvalue.toUpperCase() === 'intransitavel'.toUpperCase()) {
              // src  = `assets/img/PIN_${'transitavel'.toUpperCase()}.png`
              src = `assets/img/PIN_IMPASSABLE.png`
            } 
            // HEAVY RAIN
            else if(fieldAnswers[0].fieldsanswersvalue.toUpperCase() === 'CHUVA FORTE'.toUpperCase()) {
              // src = `assets/img/PIN_${'transitavel'.toUpperCase()}.png`
              src = `assets/img/PIN_RAIN_FORM_HEAVY.png`
            }
            else if(fieldAnswers[0].fieldsanswersvalue.toUpperCase() === 'CHUVA FRACA'.toUpperCase()) {
              // src = `assets/img/PIN_${'transitavel'.toUpperCase()}.png`
              src = `assets/img/PIN_RAIN_FORM_MODERED.png`
            }
            else if(fieldAnswers[0].fieldsanswersvalue.toUpperCase() === 'SEM CHUVA'.toUpperCase()) {
              // src = `assets/img/PIN_${'transitavel'.toUpperCase()}.png`
              src = `assets/img/PIN_RAIN_FORM_NORAIN.png`
            }
            else if(fieldAnswers[0].fieldsanswersvalue.toUpperCase() === 'CHUVA MODERADA'.toUpperCase()) {
              // src = `assets/img/PIN_${'transitavel'.toUpperCase()}.png`
              src = `assets/img/PIN_RAIN_FORM_MODERED.png`
            }
            else {
              src = `assets/img/PIN_RAIN_FORM_MODERED.png`
            }
            return new Style({
              image: new Icon({
                color: 'white',
                scale: 0.1,
                anchor: [0.5, 1],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                src: src
              })
            })
          } else {
            return new Style({
              image: new Icon({
                color: 'white',
                scale: 0.1,
                anchor: [0.5, 1],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                src: `assets/img/PIN_RAIN_FORM_MODERED.png`
              })
            })
          }
        }
        var featureStyleFunction = feature.getStyleFunction();
        if (featureStyleFunction) {
          return featureStyleFunction.call(feature, resolution);
        } else {
          return defaultStyle[feature.getGeometry().getType()];
        }
      }
    });

    // set zIndex of POLYGON type layer below than point layers
    if(layerNode.name.indexOf('FLOODZONES_OFFICIAL') !== -1) {
      liveLayer.setZIndex(1)
    } else {
      liveLayer.setZIndex(2)
    }
    this.map.addLayer(liveLayer);
    liveLayer.setVisible(false);
  }

  /**
   * Added map interaction need for HOT layers
   */
  addHotInteraction(): void {
    
    this.hotClickListener = this.map.on('click', evt => {
      // console.log('singleclick >>> evt ', evt.pixel)
      let featuresAtPixel = []
      this.map.forEachFeatureAtPixel(evt.pixel, (feature) =>  {
        // console.log('singleclick >>> features ', feature)
        if (feature) {
          // make a array of features on this pixel
          featuresAtPixel.push(new GeoJSON({featureProjection: 'EPSG:3857'})
            .writeFeatureObject(feature.clone()))
        }
        else {
          // clear the Multiple feature panel
          this.sidebarService.featuresListSource.next([])
        }
      }, {
        layerFilter: (l)=> {
          // return (l.get('name') === layer.name && l.getVisible())
          // return l.getVisible()
          // return this.isInEnvHotLayerList([l])
          return environment.hotLayers.indexOf(l.get('name')) !== -1
        }
      });
      // check if its one feature or mulitple
      // open HOT features Detail modal if single feature at clicked position
      if(featuresAtPixel.length === 1) {
        this.showLiveFeatureDetails(featuresAtPixel[0])
        this.sidebarService.featuresListSource.next([])
      }
      
      // open left-sidebar sub panel with list of features
      else if(featuresAtPixel.length > 1) {
        console.log('>>> many feature at click poistion ', featuresAtPixel)
        this.sidebarService.featuresListSource.next(featuresAtPixel)
      }
      else {
        this.sidebarService.featuresListSource.next([])
      }
    },
    {
      hitTolerance: 5
    });

    /* this.hotHoverListener = this.map.on('pointermove', evt => {
    }); */
  }

  /**
   * Starts listening to Live Data
   * @param layer 
   */
  /* subscribeLiveData(layer) {

    // find subsctiption from array of subscriptions 
    let tempHotSub = _.find(this.hotSubscriptions, { 'name': layer.name });

    // if it doesnt already exist then subscribe and add to our subscription array
    if(!tempHotSub){
      // console.log('>>> MapComponent >>> subscribeLiveData ', layer, this.hotSubscriptions, tempHotSub)
      console.log('>>> MapComponent >>> subscribeLiveData ', layer)
      this.loadingBar.start();
      let tempSub = this.liveService.getFormsAnswers({
        name: layer.name,
        bbox: transformExtent(this.mapView.calculateExtent(this.map.getSize()), 'EPSG:3857', 'EPSG:4326')
      }).subscribe( (res: WSResponsetype) => {
          // console.log('res from server live data = ', res)
          this.loadingBar.complete();
          this.handleLiveDataResponse(res, layer)
          this.addHotInteraction(layer)
          }, 
          err => {
            console.log(err)
            this.deleteSubscription(layer)
            this.clearLayerFromMap(layer)
            this.loadingBar.complete();
          }, 
          () => {
            console.log('live data disconnected for layer ', layer.name) 
            this.deleteSubscription(layer)
            this.clearLayerFromMap(layer)
            this.loadingBar.complete();
          }
        )

      // main array of subscriptions for all live data layers
      // This is used for managing subscription and unsubsricbing it 
      this.hotSubscriptions.push({
        'subscription': tempSub,
        'name': layer.name
      })
    }
  } */
  
  subscribeLiveData(layer, extent?) {

    // console.log('>>> MapComponent >>> subscribeLiveData ', layer, this.hotSubscriptions, tempHotSub)
    console.log('>>> MapComponent >>> subscribeLiveData ', layer)
    if(!extent) {
      extent = transformExtent(this.mapView.calculateExtent(this.map.getSize()), 'EPSG:3857', 'EPSG:4326')

      // extent is sent from on map extent change
    // let tempMapLayer = this.searchLayerByPropertyNameInMap(layer.name, 'name')
    // // console.log('tempMapLayer = ', tempMapLayer)
    // // if layer is already visible then don't added it again
    // if(tempMapLayer.getVisible()) {
    //   return
    // }
    } else {
      
    }

  let obsReq = null
  if(layer.name.indexOf('_FORM') !== -1) {
    obsReq = this.liveService.getDataByBbox({
      name: layer.name,
      bbox: extent
    })
  } 
  else if(layer.name.indexOf('PLUVIOMETERS_OFFICIAL') !== -1) {
    obsReq = this.liveService.getFormsAnswers({
      name: layer.name,
      bbox: extent
    })
  } else if(layer.name.indexOf('FLOODZONES_OFFICIAL') !== -1) {
    obsReq = this.liveService.getDataByBbox({
      name: layer.name,
      bbox: extent
    })
  }
    // let tempSub = this.liveService.getFormsAnswers({
    let tempSub = obsReq.subscribe( (res: WSResponsetype) => {
        // console.log('res from server live data = ', res)
        this.handleLiveDataResponse(res, layer)
        
        }, 
        err => {
          console.log(err)
          // this.deleteSubscription(layer)
          this.clearLayerFromMap(layer)
        }
      )
  }
  /**
   * Unsubscribe to listening of Live data once checkbox is uncehcked
   * 
   * @param layer which layer to unsubscribe
   */
  unsubscribeLiveData(layer) {
    if(this.hotSubscriptions.length === 0)
      return

    // if(layer.state === true)
    //   return

    // find subsctiption from array of subscriptions 
    
    let tempSub = this.findSubscription(layer)

    if(tempSub){
      // console.log('>>> MapComponent >>> unsubscribeLiveData ', layer, this.hotSubscriptions, tempSub)
      
      // unsubscribe to this subscription to disconnect ws connection
      tempSub.subscription.unsubscribe();
      // delete it from the main subscription array
      this.deleteSubscription(layer)
      // console.log('this.hotSubscriptions = ', this.hotSubscriptions)
    }
  }

  /**
   * Finds subscription among the array of Subscriptions 
   * 
   * @param layerNode 
   * @returns LayerNode
   */
  findSubscription(layerNode: LayerNode) {
    return _.find(this.hotSubscriptions, { 'name': layerNode.name });
  }

  /**
   * Deletes subscription from the array
   * 
   * @param layerNode 
   */
  deleteSubscription(layerNode) {
    if(layerNode.state === true)
      layerNode.state = false
      
    this.hotSubscriptions = _.reject(this.hotSubscriptions, { 'name': layerNode.name });
  }

  /**
   * Handle response from server for Live data ws
   * 
   * @param res 
   */
  handleLiveDataResponse(res: WSResponsetype, layerNode: LayerNode) {
    console.log('>>> MapComponent >>> handleLiveDataResponse ', res)
    let minTime = null;
    let maxTime = null;
    let timeSteps = [];
    if(res.success === false){
      console.log('>>> MapComponent >>> handleLiveDataResponse ', res)
      // this.translate.instant('MAP.LAYER_NOT_FOUND')
      this.alertService.error((res.responseData).toString(), false)
      layerNode.state = false
      // this.unsubscribeLiveData(layerNode)
      return
    }
    
    // make geojson out of json
    let tempGeojson = {"type": "FeatureCollection", "features": []}
    let tempArrayToJson: Array<FormsAnswersType> = _.filter(res.responseData.array_to_json, function(o) { 
      return (o['formsanswersgeom'] && o['formsanswersgeom'] !== null)
    })

    tempArrayToJson.forEach(formsAnswer => {

      // add title for nicer formcode
      formsAnswer['formcode_title'] = this.generateNicerLayerTitle(formsAnswer.formcode)

      let geom = JSON.parse(formsAnswer.formsanswersgeom)
      delete formsAnswer.formsanswersgeom;
      let feature = {"type": "Feature", "geometry": geom, "properties": formsAnswer, "id": formsAnswer.formsanswersid}
      tempGeojson.features.push(feature);
      // find min and max of time for this formsAnswer
      // ASSUMPTION: server is going to return in Time Ascending order

      // console.log('formsAnswer = ', formsAnswer)
      /* _.forEach(formsAnswer.fias, fia => {
        if(!fia.fieldsanswersdtfilling)
          return

        this.timeFormattedFeatures.push({
          time: fia.fieldsanswersdtfilling,
          featuresGeojson: tempGeojson
        })
      }) */

    })

    /* // let tempAvailable_times = this.timeFormattedFeatures.map( f => f.time)
    let tempAvailable_times = layerNode.available_times
    // console.log('this.timeFormattedFeatures = ', this.timeFormattedFeatures)
    console.log('tempAvailable_times = ', tempAvailable_times)

    if(tempAvailable_times.length > 1) {
      this.showTS = true
      this.initTimeSliderVar(tempAvailable_times)
    } */
    // this.configTimeSlider(layerNode)
    // console.log('Geojson Format tempGeojson = ', tempGeojson)

    // find this form type layer on map
    let tempMapLayer = this.searchLayerByPropertyNameInMap(layerNode.name, 'name')
    // console.log('tempMapLayer = ', tempMapLayer)
    if(tempMapLayer)
      tempMapLayer.getSource().addFeatures((new GeoJSON({featureProjection: 'EPSG:3857'})).readFeatures(tempGeojson))
    else
      console.error('No Layer found for name ', layerNode.name)
  }

  configTimeSlider(layerNode) {
    console.log('>>> configTimeSlider ', layerNode)
    // let tempAvailable_times = this.timeFormattedFeatures.map( f => f.time)
    let tempAvailable_times = layerNode.available_times
    // console.log('this.timeFormattedFeatures = ', this.timeFormattedFeatures)
    // console.log('tempAvailable_times = ', tempAvailable_times)

    if(tempAvailable_times && tempAvailable_times.length > 1) {
      this.showTS = true
      this.initTimeSliderVar(tempAvailable_times)
    }
  }

  /**
   * Sets layer to invisible and removes all features added to it
   * 
   * @param layerNode 
   */
  clearLayerFromMap(layerNode: LayerNode) {
    let tempMapLayer = this.searchLayerByPropertyNameInMap(layerNode.name, 'name')
    // console.log('tempMapLayer = ', tempMapLayer)
    if(tempMapLayer) {
      tempMapLayer.setVisible(false)
      tempMapLayer.getSource().clear()
    }
  }

  clearTemporalFeatures() {}

  isMapExtentTooLarge(): boolean {
    // console.log('>>> isMapExtentTooLarge ', this.mapView.getZoom())
    if(this.mapView.getZoom() < 7){
      this.alertService.warning(this.translate.instant('MAP.EXTENT_TOO_LARGE'),false)
      return true
    }
    else
      return false
  }

  showLiveFeatureDetails(olfeature) {
    console.log('>>> showFeatureDetails ', olfeature)

    let tempSub = this.liveService.getFieldsAnswers(olfeature.properties)

    if(tempSub)
    tempSub.subscribe( (res: WSResponsetype) => {
      if(!res.responseData.array_to_json) {
        this.alertService.error(this.translate.instant('MAP.NO_DATA'));
        console.error('res was empty ', res.responseData)
        return
      }
      // console.log('>>> response from getFieldsAnswers ', res.responseData.array_to_json[0])
      // flatten the response data
      let liveFeature: any = {};
      liveFeature.formcode = res.responseData.array_to_json[0].formcode
      liveFeature.formcode_title = this.generateNicerLayerTitle(liveFeature.formcode)
      liveFeature.formsanswersgeom = res.responseData.array_to_json[0].formsanswersgeom
      liveFeature.formsanswersid = res.responseData.array_to_json[0].formsanswersid
      liveFeature.fieldsAnswers = res.responseData.array_to_json[0].array_to_json

      // console.log('liveFeature = ', liveFeature)

      const dialogRef = this.dialog.open(LiveFeatureComponent, {
        width: '650px',
        data: liveFeature
      });
  
      dialogRef.afterClosed().subscribe(result => {
        // console.log('>>> MapComponent >>> afterDialogClosed ', result)
      });
    })

    
  }

  /**
   * Generate nicer label for display of formcode
   * 
   * @param formcode 
   */
  generateNicerLayerTitle(formcode) {
    // console.log('>>> generateNicerLayerTitle ', formcode)
    let title = formcode.replace("_", " ");

    title = title.toLowerCase().split(' ').map(function(word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');

    return title
  }

  /**
   * Displays Actual features based on current time selected
   * 
   * @param currentTime Time sliders time
   */
  /* displayActualFeatureOnMap(currentTime) {
    
    let timeKey = ''
    if(! currentTime){
      timeKey = `${new Date(this.currentTime).toISOString().split('.')[0]}Z`
    } else {
      timeKey = currentTime
    }

    let features = this.ohsomeService.getActualFeatures()
    // console.log('>>> displayActualFeatureOnMap >>> getActualFeatures() ', features)
    this.clearTemporalFeatures()
    if(features && features.length > 0) {
      let currentFeatures = features.find(f => f.time === timeKey )
      // console.log('currentFeatures = ', currentFeatures)
      let fcFeatures = (new GeoJSON({featureProjection: 'EPSG:3857'})).readFeatures( {
        "type": "FeatureCollection",
        "features": currentFeatures.features
      } )
      this.actualFeatureLayer.getSource().addFeatures(fcFeatures)
    }

  } */
}
