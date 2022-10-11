import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { FloodMemoryService } from '../flood-memories/flood-memory.service';
import { AlertService } from '../shared/alert.service';
import { EditFloodMemoryComponent } from '../flood-memories/edit-flood-memory/edit-flood-memory.component';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { AuthenticationService } from '../shared/authentication.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, AfterViewInit {

  emptyFMData: boolean = true;
  loggedIn: boolean;
  loggedInUser: any;
  formData: FormGroup;
  formName: FormControl;
  formEmail: FormControl;
  formPassword: FormControl;

  ELEMENT_DATA: FloodMemoryList[];
  displayedColumns: string[] = ['id', 'title', 'date', 'action'];
  fmDataSource: MatTableDataSource<FloodMemoryList>;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor(
    private fmService: FloodMemoryService,
    public editFmDialog: MatDialog,
    // public dialogRef: MatDialogRef<any>,
    private authenticationService: AuthenticationService,
    private router: Router,
    public confirmDeleteDialog: MatDialog,
    private alertService: AlertService,
    private translate: TranslateService
  ) {}

  ngOnInit() {

    const loggedInUserJwt = localStorage.getItem('currentUser');

    // user not loggedIn 
    if(!loggedInUserJwt){
      this.loggedIn = false;
      // redirect the page to home page
      this.router.navigate(['']);
      return false;
    }
     
    this.loggedIn = true;
    // decode the jwt to get logged in user's ID
    this.loggedInUser = JSON.parse(atob(loggedInUserJwt.split('.')[1]))
    // console.log('loggedInUser = ', this.loggedInUser)

    this.formName = new FormControl(this.loggedInUser.name, Validators.required);
    this.formEmail = new FormControl(this.loggedInUser.email, Validators.required);
    this.formPassword = new FormControl('', Validators.required);

    this.formData = new FormGroup({
      'formName': this.formName,
      'formEmail': this.formEmail,
      'formPassword': this.formPassword
    })

  }

  ngAfterViewInit(): void {
    // get API for list of FM of currently logged in user
    if(this.loggedIn)
      this.loadFMList()
  }

  loadFMList(): void {

    this.fmService.getFloodMemoriesOfUser({userId: this.loggedInUser.id})
      .pipe( map((preRes: any) => { 
        // console.log(preRes.pages.list)
        return preRes.pages.list.map( page => {
          return {
            id: page.id,
            title: page.title,
            path: page.path,
            description: JSON.parse(page.description)
          }
        })
      }))
      .subscribe((res: any) => {
        if(res) {
          if(res.length > 0) {
            console.log(res)
            this.fmDataSource = new MatTableDataSource<FloodMemoryList>(res);
            // this.fmDataSource.data = res
            this.fmDataSource.paginator = this.paginator;  
            this.emptyFMData = false
          } else {
            this.emptyFMData = true
          }
        }
      },
      err => {
        console.log(err)
        this.alertService.error(this.translate.instant('USER.PROFILE.FM_LIST_FAILED'));
      })

  }

  /**
   * Edit the FM
   * 
   * @param fm 
   */
  editFloodMemory(fm) {
    console.log('>>> UserProfileComponent >>> editFloodMemory ', fm)
    // call get FM detial API to get all details of FM and then open the EditFM modal
    this.fmService.getFloodMemoryDetail({id: fm.id})
      .subscribe( (res: any) => {
        // Object<{pages: Object<{single}>}>
        console.log('response = ', res)
        // res.pages.single
        
        let renderObj: any = this.getObjectFromHTMLString(res.pages.single.render.toString())

        const editFMdialogRef = this.editFmDialog.open(EditFloodMemoryComponent, {
          width: '700px',
          // data: res.pages.single
          data: {
            id: fm.id,
            title: fm.title,
            story: renderObj.story, 
            creatorId: this.loggedInUser.id,
            creatorName: res.pages.single.creatorName,
            location: renderObj.location,
            time: renderObj.time,
            assets: renderObj.assets
          },
          panelClass: 'custom-addEditFMmodalbox'
        });

        editFMdialogRef.afterClosed().subscribe(result => {
          console.log('>>> UserProfileComponent >>> afterEditDialogClosed ', result)
          if(result === 'success'){
            // refresh the table
            this.loadFMList()
          } else {
            // refresh the table
            // this.loadFMList()
          }
        });
      },
      err => {
        console.log(err);
        this.alertService.error('Server Error: '+ err.error[0].message)
      })
    
  }

  /**
   * Takes the main content of wiki page and extracts data from it and converts then into JS object
   * 
   * @param htmlStr wiki page's render property with HTML of FM story
   * @returns JS Object with all page data
   */
  getObjectFromHTMLString(htmlStr): Object {
    // console.log('HTMLString ', htmlStr)
    document.getElementById('contentHolder').innerHTML = htmlStr
    const strAssets = (<HTMLInputElement>document.getElementById('assets')).value
    // console.log('strAssets = ', strAssets)
    
    let metaData = strAssets ? JSON.parse(strAssets) : []

    // const time = metaData.time
    // const location = metaData.location
    let assets = [] 
    assets.push(...metaData.audios)
    assets.push(...metaData.images)
    assets.push(...metaData.videos)

    let returnVal = {
      'story': document.getElementById('contentHolder').textContent.trim(),
      'location': metaData.location,
      'time': metaData.time,
      'assets': assets
    }

    // console.log('returnVal = ', returnVal)
    return returnVal
  }

  /**
   * Delete FM
   * 
   * @param fm 
   */
  deleteFloodMemory(fm) {
    console.log('>>> UserProfileComponent >>> deleteFloodMemory ', fm)

    // confirm alert message
    const confirmDeleteAsset = this.confirmDeleteDialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        id: fm.id,
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
              // refresh the table
              this.loadFMList()
            } else {
              console.log('unable to delete asset, errorMessage ', res.assets.deleteAsset.responseResult.message)
              this.alertService.error(this.translate.instant('FM_ALERT.FM_DELETE_FAILED'));
            }
          },
          err => {
            console.error(err)
            this.alertService.error(this.translate.instant('FM_ALERT.FM_DELETE_FAILED'));
          })
      } 
    });

  }

  /**
   * Save the changes done to User profile
   */
  saveProfile() {
    console.log('>>> UserProfileComponent >>> saveProfile ', this.formData.value)

    this.authenticationService.update(
      {
        userId: this.loggedInUser.id,
        name: this.formData.value.formName, 
        email: this.formData.value.formEmail, 
        password: this.formData.value.formPassword
      })
      .subscribe(
        data => {
          if(data) {
            // this.router.navigate([this.returnUrl]);
            // this.loggedIn = true;
            this.alertService.success("User Profile updated");
            // since the page is already on profile page it won't reload the page
            // this.router.navigate(['profile']);
            // make the Password as blank as initial load style
          } else {
            // failed to login
            // console.log('failed to log in')
            this.alertService.error("Error while updating User Profile");
          }
        },
        error => {
          this.alertService.error("Error while updating User Profile");
          // this.loading = false;
        });
  }

  close() {
    this.router.navigate(['']);
  }

}

export interface FloodMemoryList {
  id: number;
  title: string;
  description: Object;
  path: string;  
}
