import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

import bsCustomFileInput from 'bs-custom-file-input';
import { generate } from 'shortid';
import { toLonLat } from 'ol/proj';
import * as moment from 'moment';

import { FloodMemoryService } from '../flood-memory.service';
import { AlertService } from '../../shared/alert.service';
import { environment } from '../../../environments/environment';
import { MetaDataService } from '../../shared/meta-data.service';
import { GeoJSONGeom } from '../edit-on-map/edit-on-map.component';
import { SidebarService } from '../../shared/sidebar.service';

@Component({
  selector: 'app-add-flood-memory',
  templateUrl: './add-flood-memory.component.html',
  styleUrls: ['./add-flood-memory.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AddFloodMemoryComponent implements OnInit {

  formTitle: FormControl;
  formContent: FormControl;
  // formLocation: FormControl;
  formTime: FormControl;
  formData: FormGroup;
  fileData: File = null;
  // previewUrl:any = null;
  fileUploadProgress: string = null;
  // uploadedFilePath: string = null;
  uploadedMedia: Array<any> = [];
  uploadedImages: Array<MediaType> = [];
  uploadedAudios: Array<MediaType> = [];
  uploadedVideos: Array<MediaType> = [];
  imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'tif'];
  audioExtensions = ['mp3', 'wav'];
  videoExtensions = ['mp4'];
  maxDate = new Date();
  // locOptions: string[];
  // locations: Observable<GeoJSON>;
  // locationValid: boolean = false;
  fmNewLocation = null;
  isApproxDate: boolean = false;
  years: Array<any>;
  months: Array<string>;
  approxMonth;
  approxYear;
  message: any;

  constructor(
    // private http: HttpClient,
    private metaService: MetaDataService,
    private fmService: FloodMemoryService,
    private alertService: AlertService,
    private sidebarService: SidebarService,
    // private locService: LocationService,
    public dialogRef: MatDialogRef<AddFloodMemoryComponent>,
    private translate: TranslateService) { }

  ngOnInit() {
    bsCustomFileInput.init();

    const getYears = (back) => {
      const year = new Date().getFullYear();
      return Array.from({length: back}, (v, i) => year - back + i + 1);
    }
    // getting 80 years from current dates year
    this.years = getYears(80).reverse()
    this.approxYear = this.years[0]

    // this.months = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    this.months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    
    this.formTitle = new FormControl('', Validators.required);
    this.formContent = new FormControl('', Validators.required);
    // this.formLocation = new FormControl('', Validators.required);
    this.formTime = new FormControl(new Date(), Validators.required);

    this.formData = new FormGroup({
        'formTitle': this.formTitle,
        'formContent': this.formContent,
        // 'formLocation': this.formLocation,
        'formTime': this.formTime
      })

    // default value on start
    this.fmNewLocation = {
      geometry: {
        coordinates: toLonLat(this.fmService.getMapViewDetails().center),
        type: "Point" 
      }
    }
  }

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    // this.preview();
  }

  // Show image preview
  // preview() {
  //   var mimeType = this.fileData.type;
  //   if (mimeType.match(/image\/*/) == null) {
  //     return;
  //   }

  //   var reader = new FileReader();      
  //   reader.readAsDataURL(this.fileData); 
  //   reader.onload = (_event) => { 
  //     this.previewUrl = reader.result; 
  //   }
  // }

  /**
   * uploads media files to wiki server
   * 
   */
  uploadMedia() {
    if(!this.fileData){
      this.alertService.warning(this.translate.instant('FM_ALERT.FM_NOFILE_TO_UPLOAD'));
      return;
    }
    //  get file type based on file extension
    let fileType = this.getFileType(this.fileData.name)
    // console.log('fileType = ', fileType)
    if(! this.isFileSizeWithinLimit(this.fileData)) {
      this.fileUploadProgress = this.translate.instant('FM_ALERT.FILE_TOO_LARGE');
      this.alertService.error(this.translate.instant('FM_ALERT.FILE_TOO_LARGE'));
      return;
    } else {
    if(!fileType) {
      this.fileUploadProgress = 'File type not supported';
      this.alertService.error(this.translate.instant('FM_ALERT.FILE_NOT_SUPPORTED'));
      return;
    }
    if(fileType === "audio") {
      this.fileUploadProgress = 'File type not supported';
      this.alertService.error(this.translate.instant('FM_ALERT.FILE_NOT_SUPPORTED'));
      return;
    }

    const formData = new FormData();
    const uniqueFileName = this.createUniqueName(this.fileData.name);
    let path = '';
    let folderId: number = null;

    //  for images 
    if(fileType === 'image') {
      folderId = environment.imageFolderId;
      formData.append('mediaUpload', `{"folderId": ${folderId}}`);
      path = '/user_images/' + uniqueFileName;
    } else if(fileType === 'audio') {
      folderId = environment.audioFolderId;
      formData.append('mediaUpload', `{"folderId": ${folderId}}`);
      path = '/user_audios/' + uniqueFileName
    } else if(fileType === 'video') {
      folderId = environment.videoFolderId;
      formData.append('mediaUpload', `{"folderId":${folderId}}`);
      path = '/user_videos/' + uniqueFileName
    }

    formData.append('mediaUpload', this.fileData, uniqueFileName);

    this.fileUploadProgress = '0%';
    
    this.fmService.uploadMedia(formData)
      .subscribe(events => {
        if(events.type === HttpEventType.UploadProgress) {
          this.fileUploadProgress = Math.round(events.loaded / events.total * 100) + '%';
          console.log(this.fileUploadProgress);
        } else if(events.type === HttpEventType.Response) {
          this.fileUploadProgress = '';
          // console.log(events.body);
          // alert('SUCCESS !!');
          // if(events.body.toString() === 'ok') {
          if(events.body.indexOf('ok') !== -1) {
            this.alertService.success(this.fileData.name + this.translate.instant('FM_ALERT.UPLOAD_SUCCESS'));

            let param = {
              'folderId': folderId
            }
            this.fmService.getAssetList(param).subscribe( (res: { assets: {list: Array<{id: number, filename: string}>}}) => {
              // { assets: {list: Array<id: number, filename: string>}}
              // console.log('Asset list res = ', res)
              // search for the asset ID, search by filename
              const uploadedAsset = res.assets.list.find( asset => asset.filename === uniqueFileName)
              // console.log('uploadedAsset = ', uploadedAsset)

              if(fileType === 'image') {
                this.uploadedImages.push({
                  id: uploadedAsset.id,
                  title: uniqueFileName,
                  url: path
                })
              } else if(fileType === 'audio') {
                this.uploadedAudios.push({
                  id: uploadedAsset.id,
                  title: uniqueFileName,
                  url: path
                })
              } else if(fileType === 'video') {
                this.uploadedVideos.push({
                  id: uploadedAsset.id,
                  title: uniqueFileName,
                  url: path
                })
              }
  
              // add the upload object to uploadedMedia
              this.uploadedMedia.push({
                // name: this.fileData.name,
                id: uploadedAsset.id,
                name: uniqueFileName,
                path: path
              })
            })
          }
        }
      },
      (err) => {
        console.log("Erroa aala ", err);
        this.fileUploadProgress = 'failed to upload';
        this.alertService.error(this.translate.instant('FM_ALERT.FM_FAILED_UPLOAD'));
      }) 
    }
  }
  
  /**
   * Creates a unique file name to be uploaded. Same name is used for file title
   * 
   * @param fileName 
   * @returns string unique file name
   */
  createUniqueName(fileName: string): string {
    let tempName = fileName.split('.')[0].substring(0, 12)
    tempName = tempName.replace(/\s+/g, '').toLowerCase()
    const extension = fileName.slice((fileName.lastIndexOf(".") - 1 >>> 0) + 2);
    // console.log('>>> createUniqueName ', tempName + '-' + generate().toLowerCase() + '.' + extension)
    // return generate().toLowerCase() + '.' + extension;
    return tempName + '-' + generate().toLowerCase() + '.' + extension;
  }

  /**
   * Based on file extension returns its type
   * 
   * @param fileName string
   * @returns 'image' | 'audio' | 'video'
   */
  getFileType(fileName): string {
    // const extension = fileName.split('.')[1];
    const extension = fileName.slice((fileName.lastIndexOf(".") - 1 >>> 0) + 2);
    if((this.imageExtensions.findIndex( ext => ext === extension)) !== -1)
      return 'image'
    
    if((this.audioExtensions.findIndex( ext => ext === extension)) !== -1)
      return 'audio'

    if((this.videoExtensions.findIndex( ext => ext === extension)) !== -1)
      return 'video'   
  }

  /**
   * Check for fie size and compare to be larger the limit defined in .env file
   * 
   * @param file 
   * @returns boolean
   */
  isFileSizeWithinLimit(file): boolean {
    // console.log('>>> isFileSizeWithinLimit ',file.size)
    if(environment.maxFileSize >= file.size)
      return true
    else
      return false
  }

  /**
   * Save FM to server
   */
  saveFM() {
    console.log('>>> AddFloodMemory >>> saveFM')
    const loggedInUserJwt = localStorage.getItem('currentUser');
    // decode the jwt to get logged in user's ID
    const loggedInUser = JSON.parse(atob(loggedInUserJwt.split('.')[1]))

    // get time from appropriate control
    let time = null
    if(this.isApproxDate) {
      if(this.approxMonth)
        time = this.approxYear + '-'+ this.approxMonth + '-01'
      else
        time = this.approxYear + '-01-01'
    } else {
      // time = this.formTime.value.toISOString().substring(0, 10)
      // time = this.formTime.value.getDate()+ '-' +this.formTime.value.getMonth()+ '-' +this.formTime.value.getFullYear()
      // time = `${this.formTime.value.getDate()}-${this.formTime.value.getMonth() + 1}-${this.formTime.value.getFullYear()}`
      time = moment(this.formTime.value).format("YYYY-MM-DD")
    }

    let tempParam = {
      'title': this.formTitle.value,
      'content': this.formContent.value,
      'address': this.fmNewLocation.geometry.coordinates,
      // 'time': this.formTime.value.toISOString().substring(0, 10),
      'time': time,
      'isApproxDate': this.isApproxDate,
      'creatorId': loggedInUser.id,
      'images': this.uploadedImages,
      'audios': this.uploadedAudios,
      'videos': this.uploadedVideos
    }
    console.log('tempParam = ', tempParam)
    this.fmService.createFloodMemory(tempParam)
      .subscribe((res: any) => {
        // console.log('res = ', res)
        if(res.pages.create.responseResult.succeeded) {
          this.alertService.success(this.translate.instant('FM_ALERT.FM_SAVED_SUCCESS'));
          // this.message.type = 'success';
          // location.reload();
          // delay to let server esure server will return newly created memory
          setTimeout( () => {
            this.metaService.getMetadata();
            this.sidebarService.showAllFmSource.next(! this.sidebarService.getShowAllFM())
            this.sidebarService.showAllFmSource.next(! this.sidebarService.getShowAllFM())
            this.fmService.getAllFloodMemoryListFromAPI({})
          }, 500)
          this.closeDialog();
        }
      },
      err => {
        this.alertService.error(this.translate.instant('FM_ALERT.FM_SAVE_FAILED'));
        this.message.type = 'error';
        this.closeDialog();
      })
  }

  closeDialog() {
    // this.close.emit();
    this.dialogRef.close('closed');
  }

  /**
   * Handles data sent from edit-on-map-component (child component)
   * @param $event 
   */
  updateLocation($event: GeoJSONGeom) {
    console.log('>>> updateLocation >>> ',$event )
    this.fmNewLocation = $event
  }
  
}

export interface MediaType {
  id: number,
  title: string,
  url: string
}