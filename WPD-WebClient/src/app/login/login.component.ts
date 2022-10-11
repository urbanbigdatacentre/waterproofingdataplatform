import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from '../shared/authentication.service';
import { AlertService } from '../shared/alert.service';
// import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loggedIn = false;
  user: any = {};

  @Output() loginActionTaken: EventEmitter<boolean> = new EventEmitter();
  
  constructor(
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private router: Router,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    // get jwt from localstorage
    if(localStorage.getItem('currentUser')) {
      this.loggedIn = true
      this.router.navigate(['']);
    }
  }

  login() {
    // console.log('>>> LoginComponent >>> login ')
    this.loginActionTaken.emit(false);

    if(! (this.user.username && this.user.password))
      this.alertService.warning(this.translate.instant('USER.LOGIN.EMAIL_PASSWORD_NEEDED'));
    else {
      const username = this.user.username + '@wpd.com'
      this.authenticationService.login(username, this.user.password)
        .subscribe(
          data => {
            if(data) {
              // this.router.navigate([this.returnUrl]);
              this.loggedIn = true;
              this.alertService.success(this.translate.instant('USER.LOGIN.SUCCESS'));
              // location.reload();
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
  }

  isLoggedIn() {
    if(localStorage.getItem('currentUser'))
      this.loggedIn = true
    else 
      this.loggedIn = false
    return this.loggedIn
  }

  close() {
    this.router.navigate(['']);
  }
}
