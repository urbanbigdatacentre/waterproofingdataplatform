import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '../shared/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
// import { DataDariesComponent } from '../data-daries/data-daries.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  navbarOpen = false;
  public clicked = false;
  // _el: any;
  userMenuOpen = false;
  langMenuOpen = false;

  selectedComponent: string = "Perception_Maps";
  DDComponent = null;
  public selectedLanguage = null;

  loggedIn = false;
  loggedInUser;
  
  // to check if clicked outside the dropdown to close it
  @HostListener('document:click') clickedOutside() {
    if(this.userMenuOpen) {
      this.userMenuOpen = !this.userMenuOpen;
    }
  }
  
  constructor(
    public translate: TranslateService,
    private authenticationService: AuthenticationService,
    private dialog: MatDialog) { 
      
      translate.addLangs(['English', 'Portuguese']);
      translate.setDefaultLang('English');

      const browserLang = translate.getBrowserLang();
      translate.use(browserLang.match(/English|Portuguese/) ? browserLang : 'English');

      this.selectedLanguage = this.translate.currentLang;

      if(! localStorage.getItem('language')){
        this.selectedLanguage = this.translate.currentLang;
      }
      else {
        this.translate.use(localStorage.getItem('language'))
        this.selectedLanguage = localStorage.getItem('language');
      }

    }

  ngOnInit() {
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  // Top Navbar event handlers
  public onClick(event): void {
    event.preventDefault();
    event.stopPropagation();
    this.clicked = true;
  }

  navigate(navTo: string) {
    console.log('>>> HeaderComponent >>> navigate ', navTo.trim())
    this.selectedComponent = navTo.trim()
  }

  toggleLogin() {
    this.userMenuOpen = !this.userMenuOpen;
    event.stopPropagation();
  }

  loginActionTaken(e: boolean) {
    // console.log('loginActionTaken = ', e)
    this.userMenuOpen = e
  }

  toggleLangDropdown() {
    this.langMenuOpen = !this.langMenuOpen
  }

  changeLanguage(lang) {
    this.translate.use(lang)
    localStorage.setItem('language', lang)
  }

  isLoggedIn() {
    if(localStorage.getItem('currentUser')){
      const loggedInUserJwt = localStorage.getItem('currentUser');
      // decode the jwt to get logged in user's details
      this.loggedInUser = JSON.parse(atob(loggedInUserJwt.split('.')[1]))
      // console.log('loggedInUser = ', this.loggedInUser.name)
      this.loggedIn = true
    } 
    else 
      this.loggedIn = false

    return this.loggedIn
  }

  logout() {
    this.authenticationService.logout();
    // this.loginActionTaken.emit(false);
    this.loggedIn = false;
    // this.alertService.success(this.translate.instant('USER.LOGIN.LOGOUT_SUCCESS'));
    // this.router.navigate(['']);
    // this.toggleLogin();
    location.reload();
  }

  showAbout() {
    const dialogRef = this.dialog.open(AboutDialog, {
      width: '65%',
      data: { staticText: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}

@Component({
  selector: 'about-dialog',
  templateUrl: 'about-dialog.html',
})
export class AboutDialog {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AboutDialog>) {}

  onCloseClick() {
    this.dialogRef.close();
  }
}