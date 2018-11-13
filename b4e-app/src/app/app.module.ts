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
import { MissionsComponent} from './missions/missions.component';
import { AboutComponent } from './about/about.component';
import { SmallbannerComponent } from './smallbanner/smallbanner.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { CookieService } from 'ngx-cookie-service';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { MatDialogModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { FundCampaignComponent } from './fund-campaign/fund-campaign.component'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule} from '@angular/material/button';
import { BuyItemComponent } from './buy-item/buy-item.component';
import { CampaignProfileComponent } from './campaign-profile/campaign-profile.component';
import { CreateMissionComponent } from './create-mission/create-mission.component';
import { EvaluateActivitiesComponent } from './evaluate-activities/evaluate-activities.component';
import { MentorsComponent } from './mentors/mentors.component';
import { AskformentorComponent } from './askformentor/askformentor.component';
import { LeaveReviewComponent } from './leave-review/leave-review.component';
import { ErrorComponent } from './error/error.component';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'campaigns', component: CampaignsComponent },
  {path: 'missions', component: MissionsComponent },
  {path: 'about', component: AboutComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'marketplace', component: MarketplaceComponent },
  {path: 'campaignprofile', component: CampaignProfileComponent },
  {path: 'mentors', component: MentorsComponent }
]; 

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BannerComponent,
    FooterComponent,
    CampaignsComponent,
    MissionsComponent,
    AboutComponent,
    SmallbannerComponent,
    RegisterComponent,
    ProfileComponent,
    MarketplaceComponent,
    FundCampaignComponent,
    BuyItemComponent,
    CampaignProfileComponent,
    CreateMissionComponent,
    EvaluateActivitiesComponent,
    MentorsComponent,
    AskformentorComponent,
    LeaveReviewComponent,
    ErrorComponent
  ],
  imports: [
    [RouterModule.forRoot(routes)],
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatButtonModule
    
  ],
  providers: [ApiService, CookieService,
    ],
  bootstrap: [AppComponent],
  entryComponents: [FundCampaignComponent, BuyItemComponent,
     CreateMissionComponent, EvaluateActivitiesComponent,
     AskformentorComponent, LeaveReviewComponent, ErrorComponent]
})
export class AppModule { }
