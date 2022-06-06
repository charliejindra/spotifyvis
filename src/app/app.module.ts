import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from '../app/components/home-page/home-page.component';
import { AuthComponent } from './components/auth/auth.component';
import { AuthService } from './services/auth-service/auth-service';
import { AbstractAuthService } from './services/auth-service/abstract-auth-service';
import { StreamAudioComponent } from './components/stream-audio/stream-audio.component';
import { AppConfig } from './app-config';
import { HttpClientModule } from '@angular/common/http';
import { AbstractProcessDataService } from './services/process-data-service/abstract-process-data.service';
import { ProcessDataService } from './services/process-data-service/process-data.service';
import { AbstractPrettifyService } from './services/prettify-service/abstract-prettify.service';
import { PrettifyService } from './services/prettify-service/prettify.service';
import { AbstractSpotifyApiService } from './services/spotify-api-service/abstract-spotify-api.service';
import { SpotifyApiService } from './services/spotify-api-service/spotify-api.service';
import { NewsCardComponent } from './components/info-card/news/news-card.component';
import { AbstractThrottleService } from './services/throttle-service/abstract-throttle.service';
import { ThrottleService } from './services/throttle-service/throttle.service';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { CallbackComponent } from './components/callback/callback.component';
import { WikiCardComponent } from './components/info-card/wiki/wiki-card.component';
import { ClassicViewComponent } from './components/views/classic-view/classic-view.component';
export function initializeApp(appconfig: AppConfig){
  return() => appconfig.load();
}
@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    AuthComponent,
    StreamAudioComponent,
    NewsCardComponent,
    WikiCardComponent,
    LandingPageComponent,
    CallbackComponent,
    ClassicViewComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [
    AppConfig,
    { provide: APP_INITIALIZER, useFactory: initializeApp, deps: [AppConfig], multi: true},
    {provide: AbstractProcessDataService, useClass: ProcessDataService},
    { provide: AbstractPrettifyService, useClass: PrettifyService},
    { provide: AbstractAuthService, useClass: AuthService },
    {provide:  AbstractSpotifyApiService, useClass: SpotifyApiService},
    {provide: AbstractThrottleService, useClass: ThrottleService}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
