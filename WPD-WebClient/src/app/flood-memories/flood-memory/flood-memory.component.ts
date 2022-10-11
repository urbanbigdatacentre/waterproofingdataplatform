import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

import { environment } from '../../../environments/environment';
import { FMData } from '../flood-memory.model';
import { EditFloodMemoryComponent } from '../edit-flood-memory/edit-flood-memory.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { FloodMemoryService } from '../flood-memory.service';
import { AlertService } from '../../shared/alert.service';
import { MetaDataService } from 'src/app/shared/meta-data.service';

@Component({
  selector: 'app-flood-memory',
  templateUrl: './flood-memory.component.html',
  styleUrls: ['./flood-memory.component.css']
})
export class FloodMemoryComponent implements OnInit {

  story: String
  /* 
  images: Array<{id: String, title: String, url: String}>
  audios: Array<{id: String, title: String, url: String}>
  videos: Array<{id: String, title: String, url: String}> 
  */
  images: Array<{id: String, title: String, image: String, thumbImage: String}>
  audios: Array<{id: String, title: String, video: String}>
  videos: Array<{id: String, title: String, video: String}> 
  imageObject: Array<Object>
  isAllowedtoEdit: boolean = false
  fmDate: string
  isApproxDate: boolean
  fmLocation: JSON

  constructor(
    @Inject(MAT_DIALOG_DATA) public fmData: FMData,
    public dialogRef: MatDialogRef<FloodMemoryComponent>,
    private fmService: FloodMemoryService,
    public editFmDialog: MatDialog,
    public confirmDeleteDialog: MatDialog,
    private alertService: AlertService,
    private metaService: MetaDataService,
    private translate: TranslateService
    ) {}

  onCloseClick(): void {
    // console.log('>>> FloodMemoryComponent >>> Edit clicked ')
    this.dialogRef.close();
  }

  ngOnInit() {
    console.log('>>> FloodMemoryComponent ', this.fmData)
    // let content = this.fmData.render
    // content = content.substr(content.indexOf('<p>') + 3, content.indexOf('</p>'))
    // this.content = content

    document.getElementById('contentHolder').innerHTML = this.fmData.render.toString()
    const strAssets = (<HTMLInputElement>document.getElementById('assets')).value
    if(!strAssets){
      console.log('No Assets Found!!!')
      return
    }

    let assets = JSON.parse(strAssets)
    // console.log('assets = ', assets)

    // this.fmDate = assets.time
    this.fmDate = moment(assets.time).format("DD-MM-YYYY")
    this.isApproxDate = assets.isApproxDate
    this.fmLocation = assets.location
    this.story = document.getElementById('contentHolder').textContent.trim()

    // prefix wiki server's path to url
    assets.images.forEach( image => { 
      image.image = environment.wikiUrl + image.url
      image.thumbImage = environment.wikiUrl + image.url
    })
    assets.audios.forEach( audio => { 
      audio.video = environment.wikiUrl + audio.url
      audio.posterImage = 'assets/img/audio_thumbnail.png'
    })
    assets.videos.forEach( video => { video.video = environment.wikiUrl + video.url})

    this.videos = assets.videos
    this.images = assets.images
    this.audios = assets.audios

    this.imageObject = [
      ...this.images,
      ...this.audios,
      ...this.videos
    ];

    this.isAllowedtoEdit = this.isCreatorAndCurrentUserSame()
  }

  onEditClick() {
    console.log('>>> FloodMemoryComponent >>> onEditClick ')
    this.dialogRef.close();

    const editFMdialogRef = this.editFmDialog.open(EditFloodMemoryComponent, {
      width: '700px',
      // data: res.pages.single
      data: {
        id: this.fmData.id,
        title: this.fmData.title,
        story: this.story, 
        creatorId: this.fmData.creatorId,
        creatorName: this.fmData.creatorName,
        location: this.fmLocation,
        time: this.fmDate,
        isApproxDate: this.isApproxDate,
        assets: this.imageObject
      },
      panelClass: 'custom-addEditFMmodalbox'
    });

  }

  /**
   * Check is the loggedin user and the creator of the FM is the same
   * 
   * @returns boolean to make the Edit button visible/invisible 
   */
  isCreatorAndCurrentUserSame(): boolean {
    const loggedInUserJwt = localStorage.getItem('currentUser');
    const fmCreatorID = this.fmData.creatorId;

    if(!loggedInUserJwt)
      return false;
      
    // decode the jwt to get logged in user's ID
    const decoded = JSON.parse(atob(loggedInUserJwt.split('.')[1]))
    // console.log('decoded = ', decoded)

    if(decoded.id == fmCreatorID)
      return true;
    else 
      return false;
  }

  /**
   * Deletes this FM
   * uses the global fmData 
   */
  onDeleteClick() {
    console.log('>>> FloodMemoryComponent >>> onDeleteClick ', this.fmData)

    // confirm alert message
    const confirmDeleteAsset = this.confirmDeleteDialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        id: this.fmData.id,
        title: `${this.translate.instant('FM_ALERT.FM_DELETE_TITLE')}`,
        message: `${this.translate.instant('FM_ALERT.FM_DELETE_MESSAGE')}`
      }
    });

    confirmDeleteAsset.afterClosed().subscribe(result => {
      // result: number // assetID
      if(typeof result === "number"){
        console.log('Confirm delete FM dialog closed ', result);
        // this.confirmDelete = result;
        // call API to delete
        this.fmService.deleteFloodMemory({ id: result })
          .subscribe((res: any) => {
            if(res.pages.delete.responseResult.succeeded) {
              console.log('FM deleted = ', res)
              this.alertService.success(this.translate.instant('FM_ALERT.FM_DELETE_SUCCESS'));
              setTimeout( () => {
                this.metaService.getMetadata();
              }, 200)
              this.dialogRef.close()
            } else {
              console.log('unable to delete asset, errorMessage ', res.assets.deleteAsset.responseResult.message)
              this.alertService.error(this.translate.instant('FM_ALERT.FM_DELETE_FAILED'));
            }
          },
          err => {
            console.error(err)
            this.alertService.error(this.translate.instant('FM_ALERT.FM_DELETE_FAILED'));
            this.dialogRef.close('closed');
          })
      } 
    });
    
  }
}
