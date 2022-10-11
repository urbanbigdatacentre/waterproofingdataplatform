import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, Inject } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { MatCheckboxChange, MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
// import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

import { SidebarService } from '../../shared/sidebar.service';
import { TREE_DATA, LayerNode } from 'src/app/shared/treeData';
import { MetaDataService } from '../../shared/meta-data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tree-checkbox',
  templateUrl: './tree-checkbox.component.html',
  styleUrls: ['./tree-checkbox.component.css']
})
export class TreeCheckboxComponent {

  treeControl = new NestedTreeControl<LayerNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<LayerNode>();
  fmActive = true;
  showAllFM = true;
  textDisplayLimit = 20;
  allHotLayers: Array<any>;

  constructor(
    private metaData : MetaDataService,
    private sidebarService: SidebarService,
    private dialog: MatDialog
    ) {

    // get API server Capabilities to make layer list of all HOT layers
    this.metaData.getAPICapabilities().subscribe( (res: any) => {
      // console.log('APICapabilities = ', res)
      if(!res.success) {
        console.log('APICapabilities >>> Server returned with no data')
        this.dataSource.data = TREE_DATA;
        return
      }

      this.allHotLayers = res.responseData.array_to_json
      this.allHotLayers = this.isInEnvHotLayerList(this.allHotLayers)
      // this.allHotLayers = this.assignTag(this.allHotLayers)

      // console.log('this.allHotLayers = ', this.allHotLayers)

      // parse in format to make node as like TREE_DATA 
      // console.log('TREE_DATA = ', TREE_DATA)
      let tempTreeData = _.sortBy(TREE_DATA, ['id'])
      // console.log('sorted TREE_DATA = ', tempTreeData)
      let lastObjInTreeData = _.findLast(tempTreeData)
      
      // check for available_times and clean it
      
      _.forEach(this.allHotLayers, layer => {
        if(layer.available_times)
          layer.available_times = layer.available_times.filter(function(val) { return val !== null; })

        let tempTags = []
        if(layer.code.indexOf('OFFICIAL') > -1)
          tempTags = [{name: 'LEFT_SIDEBAR.OFFICIAL.NAME', description: 'LEFT_SIDEBAR.OFFICIAL.DESC', color: '#4396AC'}]
        else if(layer.code.indexOf('FORM') > -1)
          tempTags = [{name: 'LEFT_SIDEBAR.CITIZEN.NAME', description: 'LEFT_SIDEBAR.CITIZEN.DESC', color: '#38A471'}]

        let tempLayerObj = {
          id: lastObjInTreeData.id++,
          name: layer.code,
          // title: layer.name,
          title: this.generateNicerLayerTitle(layer.code),
          state: false,
          tags: tempTags,
          buttons: [{method:'showLayerInfo', title: 'LEFT_SIDEBAR.INFO_BUTTON.TITLE', description: 'LEFT_SIDEBAR.INFO_BUTTON.DESCRIPTION'}],
          source: 'hot',
          available_times: layer.available_times,
          description: layer.description ? layer.description : null
        }

        // add these layers in it
        tempTreeData.push(tempLayerObj)
      });
      
      // console.log('tempTreeData = ', tempTreeData)

      this.sidebarService.setLayerList(tempTreeData)
      this.dataSource.data = tempTreeData;
    }, err => {
      console.log('err aala ', err)
      // errered out to receive HOT layers load the local layers
      this.dataSource.data = TREE_DATA;
    })

    // this.dataSource.data = TREE_DATA;
    
  }

  hasChild = (_: number, node: LayerNode) => !!node.children && node.children.length > 0;
 
  layerSelected(event: MatCheckboxChange): void {
    // console.log('>>> TreeCheckboxComponent >>> layerSelected ', event.source.name)

    if(event.source.name === "Flood Memories") {
      // console.log('>>> Activate FMComponent')
      this.sidebarService.fmActiveSource.next(event.source.checked)
      this.fmActive = !event.source.checked
      this.sidebarService.setLayerList(this.sidebarService.getLayerList())
    } 
    else {
      // console.log('>>> TreeCheckboxComponent >>> layerSelected ', event.source.name, TREE_DATA)
      // send the layerList with updated state
      // execute set function to trigger subscriber
      this.sidebarService.setLayerList(this.sidebarService.getLayerList())
    }
  }

  zoomToLayerExtent(node) {
    // console.log('>>> zoomToLayerExtent ', node)
    // this.sidebarService.zoomToLayer(node.layerName)
    this.sidebarService.zoomToLayer(node.extent)
  }

  /**
   * Open the Description explaining what this tag means
   * there are 2 types of tags 'citizen' and 'official'
   * 
   * @param tag 
   */
  openChipDialog(tag) {
    // console.log('>>> openChipDialog ', tag)

    const dialogRef = this.dialog.open(ChipDescription, {
      width: '65%',
      data: tag 
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  showLayerInfo(layerNode) {
    // console.log('>>> showLayerInfo ', layerNode)

    const dialogRef = this.dialog.open(LayerDescription, {
      width: '65%',
      data: layerNode
    });

    dialogRef.afterClosed().subscribe(result => {
    });

  }

  /**
   * Dynamic button to method calling function
   * 
   * @param node 
   * @param button 
   */
  buttonClicked(node, button) {
    // console.log('>>> TreeCheckboxComponent >>> buttonClicked ', node)
    if(button.method === "showLayerInfo")
      this.showLayerInfo(node)
    else if(button.method === "zoomToLayerExtent")
      this.zoomToLayerExtent(node)
    else if(button.method === "toggleShowAllFM")
      this.toggleShowAllFM(button)
  }

  /**
   * Show all FM button toggler
   * 
   * @param button 
   */
  toggleShowAllFM(button) {
    this.showAllFM = !this.showAllFM
    // console.log('>>> TreeCheckboxComponent >>> toggleShowAllFM ', button, this.showAllFM)
    
    this.sidebarService.showAllFmSource.next(this.showAllFM)
  }
  
  /**
   * Style class function
   * // NOT USED
   */
  getShowAllFmClass() {
    if(this.showAllFM === true)
      return 'fas fa-toggle-on'
    else if(this.showAllFM === false)
      return 'fas fa-toggle-off'
  }

  isConstrained() {
    const collapseFeature = document.getElementById("collapseFeature")
    // console.log('(mid[0] as HTMLElement).clientWidth = ', (mid[0] as HTMLElement).clientWidth)
    // console.log('window.outerWidth = ', window.outerWidth)
    // console.log('window.innerWidth = ', window.innerWidth)
    return (collapseFeature as HTMLElement).clientWidth < 350;
  }

  isInEnvHotLayerList(ll: Array<any>): Array<any> {
    // console.log('>>> isInEnvHotLayerList ', ll)
    let tempLL = ll.filter(l => environment.hotLayers.indexOf(l.code) !== -1  )
    return tempLL
  }

  /**
   * Assign Tag as 'citizen' or 'official' based on the code of layer
   * NOT USED
   * 
   * @param ll 
   */
  assignTag(ll: Array<any>): Array<any> {
    console.log('>>> assignTag ', ll)
    
    return ll
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

    title = title.replace("Form", "");
    title = title.replace("Official", "");

    return title
  }
}

@Component({
  selector: 'chip-description',
  templateUrl: 'chip-description.html',
})
export class ChipDescription {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ChipDescription>) {
      // console.log('>>> ChipDescription >>> ', data)
    }

  closeDialog() {
    this.dialogRef.close('closed');
  }
}

@Component({
  selector: 'layer-description',
  templateUrl: 'layer-description.html',
})
export class LayerDescription {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<LayerDescription>) {
      // console.log('>>> LayerDescription >>> ', data)
    }

  closeDialog() {
    this.dialogRef.close('closed');
  }
}