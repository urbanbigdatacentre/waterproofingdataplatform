import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { environment } from 'src/environments/environment';
import { SidebarService } from '../shared/sidebar.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  sidebarVisibility = true;
  sidebarRightVisibility = true;
  mainFeatureVisibility = true;
  legendVisibility = true;
  showLegends = false;
  subFeatureVisibility: boolean = false;
  subBodyVisibility = true;
  activeFm: boolean = false;
  multiFeatureList: boolean = false;
  // legendSrcs: Array<string> = [];
  legendSrcs: Array<any> = [];
  baseLayer: string;

  allLeafs: Array<any>;

  clickedFeatures: Array<any>;

  constructor(
    private translate: TranslateService,
    private sidebarService: SidebarService) { }

  ngOnInit() {

    // subscriber to listen to FM checkbox active or not
    this.sidebarService.fmActiveSource.subscribe( activeFm => {
      this.activateFM(activeFm)
    })

    this.sidebarService.featuresListSource.subscribe( features => {
      // console.log('>>> HomeComponent >>> featuresListSource ', features)
      if(features) {
        this.clickedFeatures = features
        
        if(features.length > 0) {
          this.multiFeatureList = true
          this.toggleSubFeatureVisibility()
        } else if(features.length === 0){
          this.multiFeatureList = false
        }
      }
    })

    
    // subscription to listen which layers are selected or deselected
    // receives entire list of layers with updated state
    this.sidebarService.layerList.subscribe( (layerList: Array<any>) => {
      if(layerList && layerList.length > 0) {
        this.allLeafs = this.sidebarService.getAllLeafNodes()
        // console.log('>>> HomeComponent >>> layerList = ', this.allLeafs)
        let visibleLayers = this.allLeafs.filter( n => n.state )
        // console.log('visibleLayers = ',  visibleLayers)
        if(visibleLayers.length > 0) {
          this.showLegends = true;
          this.updateGetLegendGraphicUrl(visibleLayers.map(n => n))
        } else {
          this.showLegends = false;
        }
      }
    })

    window.addEventListener('resize', (event) => {
      this.applyMargins();
      setTimeout(() => {
        this.applyInitialUIState();  
      }, 100);
    });

    this.sidebarService.changeBaseLayer('dark')
  }

  ngAfterViewInit(): void {
    this.applyMargins();
    setTimeout(() => {
      this.applyInitialUIState();  
    }, 100);
  }

  applyInitialUIState() {
    // console.log('this.isConstrained() = ', this.isConstrained())
    if (this.isConstrained()) {
      this.toggleLeftSidebar()
      this.toggleRightSidebar()
    }
  }

  applyMargins(): void {
    // const olZoom = document.getElementsByClassName("ol-zoom");
    const olRotate = document.getElementsByClassName("ol-rotate"); 
    const sideBarLeftElements = document.getElementsByClassName("sidebar-left");
    const sideBarRightElements = document.getElementsByClassName("sidebar-right");
    const mid = document.getElementsByClassName("mid");
    if(!this.sidebarVisibility) {
      // olZoom[0].style.marginLeft = 0;
      // (olZoom[0] as HTMLElement).style.marginLeft = "0px";
      // (olZoom[0] as HTMLElement).style.marginTop = "60px";
      // olZoom[0].classList.remove("zoom-top-opened-sidebar")
      // olZoom[0].classList.add("zoom-top-collapsed");
    } else {
      setTimeout(() => {
        // (olZoom[0] as HTMLElement).style.marginLeft = ((sideBarLeftElements[0] as HTMLElement).offsetWidth - 10) + 'px';
        // (olZoom[0] as HTMLElement).style.marginTop = "0px";
        // olZoom[0].classList.remove("zoom-top-opened-sidebar")
        // olZoom[0].classList.add("zoom-top-collapsed");  
        mid[0].classList.remove("col-sm-8");
        mid[0].classList.remove("col-md-9");
        mid[0].classList.add("col-sm-4");
        mid[0].classList.add("col-md-6");
      }, 50);
    }
    if(!this.sidebarRightVisibility) {
      mid[0].classList.remove("col-sm-8");
      mid[0].classList.remove("col-md-9");
      mid[0].classList.add("col-sm-4");
      mid[0].classList.add("col-md-6");
    } 
    else {
        mid[0].classList.remove("col-sm-4");
        mid[0].classList.remove("col-md-6");
        mid[0].classList.add("col-sm-8");
        mid[0].classList.add("col-md-9");
    }

  }

  isConstrained() {
    const mid = document.getElementsByClassName("mid")
    // console.log('(mid[0] as HTMLElement).clientWidth = ', (mid[0] as HTMLElement).clientWidth)
    // console.log('window.outerWidth = ', window.outerWidth)
    // console.log('window.innerWidth = ', window.innerWidth)
    return (mid[0] as HTMLElement).clientWidth >= window.outerWidth;
  }

  toggleLeftSidebar(): void {
    // console.log('>>> toggleSidebar ', this.sidebarVisibility)
    this.sidebarVisibility = !this.sidebarVisibility
    this.applyMargins();
  }

  toggleRightSidebar(): void {
    // console.log('>>> toggleSidebar ', this.sidebarVisibility)
    this.sidebarRightVisibility = !this.sidebarRightVisibility
    this.applyMargins();
  }

  toggleMainFeature(): void {
    this.mainFeatureVisibility = ! this.mainFeatureVisibility
  }

  toggleLegendNBase(): void {
    this.legendVisibility = ! this.legendVisibility
  }

  toggleSubFeatureBody(): void {
    this.subBodyVisibility = ! this.subBodyVisibility
  }

  toggleSubFeatureVisibility(): void {
    this.subFeatureVisibility = !this.subFeatureVisibility
  }

  // layerSelected(checkbox) {
  //   console.log('checkbox clicked ', checkbox)

  //   if(checkbox.value = 'Flood Memories') {
  //     this.toggleSubFeatureVisibility()

  //     // load Flood Memories component
  //   }
  // }

  activateFM(e: boolean) {
    this.subFeatureVisibility = e
    this.activeFm = e
    // this.sidebarService.fmActiveSource.next(this.subFeatureVisibility)
  }

  updateGetLegendGraphicUrl(layers: Array<any>) {
    // console.log('>>> updateGetLegendGraphicUrl ', layers)
    this.legendSrcs = [];
    let legendDiv = document.getElementById('hotAndFmLegend');
    legendDiv.innerHTML= ""
    layers.forEach( l => {
      if(l.source === 'hot') {
        let img = new Image();
        // console.log('>>> HomeComponent >>> legendDiv ', legendDiv)
        img.onload = () => {
          legendDiv.innerHTML += `<br><img src="${img.src}" width="26px"/> ${l.title}`;
        }
        img.src = `assets/img/${l.name}.png`; 
      } 
      else if(l.name === 'Flood Memories') {
        let img = new Image();
        img.onload = () => {
          legendDiv.innerHTML += `<br><img src="${img.src}" width="26px"/> ${this.translate.instant('HEADER.FLOOD_MEMORIES')}`;
        }
        img.src = `assets/img/FLOODMEMORY.png`; 
        // <img src="assets/img/flood_black.png" width="16px"> {{ 'HEADER.FLOOD_MEMORIES' | translate}}
      }
      else {
        if(l.name !== 'Flood Memories')
        this.legendSrcs.push({
          name: l.name,
          url: `${environment.geoserverUrl}/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=${l.layerName}&STYLE=${l.style}${this.translate.instant('HEADER.SELECTED_LANG')}&legend_options=forceLabels:on`
        }
        );
      }
    })
    // console.log('this.legendSrc = ',this.legendSrcs)
  }

  baseLayerChanged(event) {
    // console.log('>>> baseLayerChanged ', event.target.id)
    this.sidebarService.changeBaseLayer(event.target.id)
  }

  showFeaturesList() {
    if(this.clickedFeatures)
    if(this.clickedFeatures.length > 0)
      return true
    else
      return false
  }
}
