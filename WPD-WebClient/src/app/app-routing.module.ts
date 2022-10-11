import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: 'register', component: UserRegisterComponent },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

// export const routingComponents = [
//     SidebarDirective,
//     MapComponent,
//     HeaderComponent,
//     FloodMemoriesComponent,
//     FloodMemoryComponent,
//     HomeComponent,
//     LoginComponent,
//     AlertComponent,
//     SidebarComponent,
//     DataDariesComponent,
//     AddFloodMemoryComponent,
//     EditFloodMemoryComponent,
//     ConfirmDialogComponent,
//     EditOnMapComponent,
//     UserProfileComponent
// ]