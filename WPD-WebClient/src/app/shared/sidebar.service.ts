import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TREE_DATA, LayerNode } from './treeData';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  
  // All Layer list of all layer from TREE_DATA and Live layer
  private layerListSource = new BehaviorSubject<Array<LayerNode>>(null);
  layerList = this.layerListSource.asObservable();

  // no getter and setter used directly done by components
  fmActiveSource = new BehaviorSubject<boolean>(null);
  fmActive = this.fmActiveSource.asObservable();

  // zoomToLayerNameSource = new BehaviorSubject<string>('');
  // zoomToLayerName = this.zoomToLayerNameSource.asObservable();
  zoomToLayerNameSource = new BehaviorSubject<Array<number>>([]);
  zoomToLayerName = this.zoomToLayerNameSource.asObservable();

  baseLayerSource = new BehaviorSubject<string>('');
  baseLayer = this.baseLayerSource.asObservable();

  showAllFmSource = new BehaviorSubject<boolean>(true);
  showAllFm = this.showAllFmSource.asObservable();

  featuresListSource = new BehaviorSubject<Array<any>>([]);
  featuresList = this.featuresListSource.asObservable();

  // data as GEOJSON geometry
  private gotoLocationSource = new BehaviorSubject<any>(null);
  gotoLocation = this.gotoLocationSource.asObservable();

  public setLayerList(layers: Array<LayerNode>) {
    this.layerListSource.next(layers)
  }

  public getLayerList(){
    return this.layerListSource.getValue();
  }

  public zoomToLayer(layerName) {
    this.zoomToLayerNameSource.next(layerName)
  }

  public changeBaseLayer(layerName) {
    this.baseLayerSource.next(layerName)
  }

  /**
   * Take tree structure and returns all the leaf nodes in it
   * 
   * @param tree_data 
   * @returns Array of all Leaf nodes
   */
  public getAllLeafNodes(): Array<LayerNode> {
    // console.log('tree_data = ', tree_data)
    let returnAllLeafs = []

    var recursiveLeafFinder = function(tree) {
      tree.forEach(node => {
        if(!!node.children && node.children.length > 0) {
          recursiveLeafFinder(node.children)
        } else {
          returnAllLeafs.push(node)
        }
      });
    }

    // recursiveLeafFinder(TREE_DATA)
    // console.log('this.getLayerList() = ', this.getLayerList())
    if(this.getLayerList())
      recursiveLeafFinder(this.getLayerList())
    // console.log('TREE_DATA = ', TREE_DATA)
    
    // console.log('returnAllLeafs = ', returnAllLeafs)
    return returnAllLeafs;
  }

  /**
   * Searches for the LayerNode from our Sidebar TreeData 
   * by name provided
   * 
   * @param name string Name of the LayerNode to search for
   * @returns LayerNode 
   */
  public searchLayerByNameInTreeData(name: string): LayerNode {
    return TREE_DATA.find(node => node.name === name)
  }

  public getShowAllFM(): boolean {
    return this.showAllFmSource.getValue()
  }

  public setGotoLocation(location: any) {
    console.log('>>> setGotoLocation ', location)
    this.gotoLocationSource.next(location)
  }
  
}