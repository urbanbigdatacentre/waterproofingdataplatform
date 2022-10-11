import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core/';
import { Subscription, of } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

import { AlertService } from '../shared/alert.service';
import { AuthenticationService } from '../shared/authentication.service';

const emailAsyncValidator = (authService: AuthenticationService, phoneAlreadyRegisters: boolean) => (c: FormControl) => {
  if (!c || String(c.value).length === 0) {
    return of(null);
  }
  const emailFromPhone = String(c.value) + '@wpd.com';
  return authService.checkEmail( {email: emailFromPhone})
    .pipe(
      map((res: any) => {
        return  res.phoneExist ? { phoneExist: true } : null;
      }),
    );
};

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent implements OnInit {

  formData: FormGroup;
  formName: FormControl;
  formPhone: FormControl;
  formPassword: FormControl;
  formConfirmPassword: FormControl;
  formTerms: FormControl;
  checkPhoneSubscribe: Subscription;
  phoneAlreadyRegisters: boolean = false;

  constructor(
    private router: Router,
    private readTermsNCondition: MatDialog,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private translate: TranslateService
  ) { 
    
    this.formName = new FormControl('', [Validators.required, Validators.maxLength(256)]);
    this.formPhone = new FormControl('', [
      Validators.required, 
      Validators.maxLength(11), 
      Validators.minLength(11)
    ], [
      emailAsyncValidator(this.authenticationService, this.phoneAlreadyRegisters)
    ]);
    this.formPassword = new FormControl('', [Validators.required, Validators.minLength(6)]);
    this.formConfirmPassword = new FormControl('', [Validators.required, Validators.minLength(6)]);
    this.formTerms = new FormControl(false, [Validators.requiredTrue])

    this.formData = new FormGroup({
      'formName': this.formName,
      'formPhone': this.formPhone,
      'formPassword': this.formPassword,
      'formConfirmPassword': this.formConfirmPassword,
      'formTerms': this.formTerms
    },
    [
      this.passwordConfirming
    ] )

  }

  ngOnInit() {
    const loggedInUserJwt = localStorage.getItem('currentUser');
    // user loggedIn 
    if(loggedInUserJwt){
      // redirect the page to home page
      this.router.navigate(['']);
      return false;
    }
  }

  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if(c.get('formConfirmPassword').value !== '')
      if (c.get('formPassword').value !== c.get('formConfirmPassword').value) {
        return {invalid: true};
      }
  }

  createUser() {
    // console.log('>>> createUser ', this.formData.value)
    
    // add "@wpd.com" to the phone number to mimic as a email address
    const email = this.formPhone.value + '@wpd.com'

    // {email: string, name: string, password: string}
    let param: {email: string, name: string, password: string} = {
      email: email,
      name: this.formName.value,
      password: this.formPassword.value
    }

    // console.log('param = ', param)

    // call api
    this.authenticationService.signUp(param)
      .subscribe( res => {
        if(res.users.create.responseResult.succeeded) {
          console.log('res = ', res.users.create.responseResult)
          this.alertService.success(this.translate.instant('USER.SIGNUP.ALERT_SIGNUP_SUCCESS'));
          // if successful then auto login
          setTimeout(() => {
            this.login(param.email, param.password)  
          }, 1000);
          // this.router.navigate([''])
        } else {
          if(res.users.create.responseResult.message)
            this.alertService.error('Server Error: '+ res.users.create.responseResult.message);
          else
            this.alertService.error('Server Error');
        }
      },
      error => {
        this.alertService.error(this.translate.instant('USER.SIGNUP.ALERT_SIGNUP_FAILED'));
      })
  }

  showTermNConditions() {
    console.log('>>> UserRegisterComponent >>> showTermNConditions')

    const readTermsdialogRef = this.readTermsNCondition.open(ReadTermsNConditionDialog, {
      width: '700px',
      data: { }
    });

    readTermsdialogRef.afterClosed().subscribe(result => {
      console.log('>>> UserRegisterComponent >>> afterTermsDialogClosed ', result)
    });

  }

  login(username, password) {
    this.authenticationService.login(username, password)
        .subscribe(
          data => {
            if(data) {
              // this.router.navigate([this.returnUrl]);
              // this.loggedIn = true;
              this.alertService.success(this.translate.instant('USER.LOGIN.SUCCESS'));
              this.router.navigate(['']);
            } else {
              // failed to login
              // console.log('failed to log in')
              this.alertService.error(this.translate.instant('USER.LOGIN.FAILED'));
            }
          },
          error => {
            this.alertService.error(this.translate.instant('USER.LOGIN.ERROR'));
            // this.loading = false;
          });
  }

  close() {
    this.router.navigate(['']);
  }
}

@Component({
  selector: 'read-terms-n-condition-dialog',
  template: `
    <h1 mat-dialog-title>{{ 'USER.SIGNUP.TERMS.HEADER' | translate }} </h1>
    <div mat-dialog-content>
      <p style="margin-left: 15px; margin-right: 15px;">{{ 'USER.SIGNUP.TERMS.BODY' | translate }}</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()" cdkFocusInitial>OK</button>
    </div>
  `,
})
export class ReadTermsNConditionDialog {

  constructor(
    public dialogRef: MatDialogRef<ReadTermsNConditionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}