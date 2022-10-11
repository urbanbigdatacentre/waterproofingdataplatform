import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';

import FloodMemory from './flood-memory.model';
import { FloodMemoryService } from "./flood-memory.service";
import { FloodMemoryComponent } from './flood-memory/flood-memory.component';
import { Subscription } from 'rxjs/Subscription';
import { AddFloodMemoryComponent } from './add-flood-memory/add-flood-memory.component';
import { AlertService } from '../shared/alert.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'flood-memories',
  templateUrl: './flood-memories.component.html',
  styleUrls: ['./flood-memories.component.css']
})
export class FloodMemoriesComponent implements OnInit, OnDestroy {

  @Input() data: any;
  
  memories: Array<FloodMemory>
  loggedIn: boolean;
  fmServiceList: Subscription;
  isHoveredOn: boolean;
  // hoveredFMId: number;
  hoveredFMId: Array<number>;
  hoverSubscription: Subscription;
  
  constructor(
    public dialog: MatDialog,
    private fmService: FloodMemoryService,
    // private sidenav: SidenavService,
    private alertService: AlertService,
    private translate: TranslateService) { }

  ngOnInit() {
    this.fmServiceList = this.fmService.memories
      .subscribe(data => {
        // console.log('>>> FloodMemoriesComponent >>> memories Subsription ', data)
        this.memories = data

        if(localStorage.getItem('currentUser'))
          this.loggedIn = true
    });

    this.hoverSubscription = this.fmService.fmHoveredOn
      .subscribe( (data: Array<number>) => {
        // console.log('hoveredFm ', data)
        // don't check for null has if null then no list-item will be active
        this.hoveredFMId = data
      })
  }

  ngOnDestroy() {
    this.fmServiceList.unsubscribe();
    this.hoverSubscription.unsubscribe();
  }

  showDetailMemory(objMem) {
    console.log('>>> FloodMemoriesComponent >>> showDetailMemory ', objMem)
    this.fmService.getFloodMemoryDetail({id: objMem.id})
    // TODO: chnage the res type from any to an interface
      .subscribe( (res: any) => {
        // Object<{pages: Object<{single}>}>
        console.log('response = ', res)

        const dialogRef = this.dialog.open(FloodMemoryComponent, {
          width: '700px',
          data: res.pages.single
        });
    
        dialogRef.afterClosed().subscribe(result => {
          console.log('>>> FloodMemoriesComponent >>> afterDialogClosed ', result)
        });
      },
      err => {
        console.log(err);
        if(err.error){
          if(err.error[0].message.indexOf('Too many requests, please try again') !== -1)
            this.alertService.error( err.error[0].message +' TIP: '+ this.translate.instant('FLOODMEMORIES.LOGIN_ON_ERROR'))
          else
            this.alertService.error('Server Error: '+ err.error[0].message)
        }
      })
  }

  showAddFloodMemory() {
    // console.log('>>> FloodMemoriesComponent >>> showAddFloodMemory ')
    if(! this.loggedIn) {
      this.alertService.warning(this.translate.instant('FLOODMEMORIES.ADD_FM_TOOLTIP'))
      return;
    }

    const addFMdialogRef = this.dialog.open(AddFloodMemoryComponent, {
      width: '700px',
      // data: res.pages.single
      data: null,
      panelClass: 'custom-addEditFMmodalbox'
    });

    addFMdialogRef.afterClosed().subscribe(result => {
      // console.log('>>> FloodMemoriesComponent >>> afterDialogClosed ', result)
      // hack to show latest data on map
      // reload the sideNav with FloodMemoriesComponent to reload the list of features in it 
      // this.sidenav.setComponent(new SidebarItem(FloodMemoriesComponent, {
      //   'componentName' : 'FloodMemoriesComponent'
      // }));
    });    
  }

  /**
   * Triggers a event to MapController once Hovered on FM List
   * Communication from FloodMemoriesController to MapController
   * 
   * @param objMem FloodMemory
   */
  mouseOverFMFromList(objMem: FloodMemory) {
    // console.log('>>> FloodMemoriesComponent >>> mouseOverFMFromList ', objMem)
    if(objMem)
      this.fmService.fmHoveredonListSource.next(objMem.id.valueOf())
    else
      this.fmService.fmHoveredonListSource.next(null)
  }

  /**
   * Checks whether the FM was hovered on map
   * 
   * @param id 
   * @returns boolean
   */
  isFMHovered(id) {
    if(this.hoveredFMId){
      if(this.hoveredFMId.indexOf(id) !== -1)
        return true
      else
        return false
    } else {
      return false
    }
  }
}
