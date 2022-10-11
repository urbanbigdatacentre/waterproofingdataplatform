import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Ng5SliderModule } from 'ng5-slider';
import { NgImageSliderModule } from 'ng-image-slider';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MetaDataService } from "./shared/meta-data.service";
import { FloodMemoryService } from './flood-memories/flood-memory.service';
import { AuthenticationService } from './shared/authentication.service';
import { MapComponent } from './map/map.component';
import { HeaderComponent, AboutDialog } from './header/header.component';
import { FloodMemoriesComponent } from './flood-memories/flood-memories.component';
import { FloodMemoryComponent } from './flood-memories/flood-memory/flood-memory.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AlertComponent } from './alert/alert.component';
import { DataDariesComponent } from './data-daries/data-daries.component';
import { AddFloodMemoryComponent } from './flood-memories/add-flood-memory/add-flood-memory.component';
import { EditFloodMemoryComponent } from './flood-memories/edit-flood-memory/edit-flood-memory.component';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';
import { EditOnMapComponent } from './flood-memories/edit-on-map/edit-on-map.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserRegisterComponent, ReadTermsNConditionDialog } from './user-register/user-register.component';
import { TreeCheckboxComponent, ChipDescription, LayerDescription } from './home/tree-checkbox/tree-checkbox.component';
import { LiveService } from './shared/live.service';
import { LiveFeatureComponent } from './live-feature/live-feature.component';
import { FeaturesListComponent } from './features-list/features-list.component';
import { GotoLocationComponent } from './goto-location/goto-location.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    HeaderComponent,
    FloodMemoriesComponent,
    FloodMemoryComponent,
    HomeComponent,
    LoginComponent,
    AlertComponent,
    DataDariesComponent,
    AddFloodMemoryComponent,
    EditFloodMemoryComponent,
    ConfirmDialogComponent,
    EditOnMapComponent,
    UserProfileComponent,
    UserRegisterComponent,
    ReadTermsNConditionDialog,
    TreeCheckboxComponent,
    AboutDialog,
    ChipDescription,
    LayerDescription,
    LiveFeatureComponent,
    FeaturesListComponent,
    GotoLocationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    LoadingBarHttpClientModule,
    Ng5SliderModule,
    NgImageSliderModule,
    MaterialModule,
    NgxChartsModule
  ],
  entryComponents: [
    FloodMemoryComponent, // needed since we open it in modal
    FloodMemoriesComponent, // needed since sidebar dynamically creates it
    DataDariesComponent,
    AddFloodMemoryComponent,
    EditFloodMemoryComponent,
    ConfirmDialogComponent,
    ReadTermsNConditionDialog,
    AboutDialog,
    ChipDescription,
    LayerDescription,
    LiveFeatureComponent
  ],
  providers: [
    AuthenticationService,
    MetaDataService,
    { provide: APP_INITIALIZER, useFactory: metaDataFactory, deps: [MetaDataService], multi: true },
    FloodMemoryService,
    LiveService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function metaDataFactory(provider: MetaDataService) {
  return () => provider.getMetadata()
}

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient,
    './assets/i18n/', // or whatever path you're using
    '.json');
}