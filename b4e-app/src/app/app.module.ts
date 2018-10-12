import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './api.service';
import { AppComponent } from './app.component';
import { HomeComponent} from './home/home.component';
import { BannerComponent } from './banner/banner.component';
import { FooterComponent } from './footer/footer.component';
import { CampaignsComponent} from './campaigns/campaigns.component';
import { ActivitiesComponent} from './activities/activities.component';
import { AboutComponent } from './about/about.component';
import { SmallbannerComponent } from './smallbanner/smallbanner.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { CookieService } from 'ngx-cookie-service';


const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'campaigns', component: CampaignsComponent },
  {path: 'activities', component: ActivitiesComponent },
  {path: 'about', component: AboutComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'profile', component: ProfileComponent}
]; 

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BannerComponent,
    FooterComponent,
    CampaignsComponent,
    ActivitiesComponent,
    AboutComponent,
    SmallbannerComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent
  ],
  imports: [
    [RouterModule.forRoot(routes)],
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule
    
  ],
  providers: [ApiService, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
