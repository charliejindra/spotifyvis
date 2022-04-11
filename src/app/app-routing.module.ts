import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { AuthService } from './services/auth-service/auth-service';


const routes: Routes = [
  { path: '', component: LandingPageComponent},
  { path: 'home', component: HomePageComponent},
  { path: 'auth', component: AuthComponent},
  { path: '**', component: HomePageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
