import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth} from '@angular/fire/auth';

import { environment } from 'src/environments/environment';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './pages/login/login.component';
import { EmailComponent } from './pages/email/email.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SignupComponent } from './pages/signup/signup.component';

import { lunacianApiService } from './services/lunacian-api.service';
import { HttpClientModule } from '@angular/common/http';
import { ApiTrackerService } from './services/api-tracker.service';
import { AxieTechApiService } from './services/axie-tech-api.service';
import { ShareComponentModule } from './components/shareComponent.module';
import { FireServiceService } from './services/fire-service.service';
import { GetPriceService } from './services/get-price.service';
import { FriendService } from './services/friend.service';
ShareComponentModule
@NgModule({
  declarations: [
    AppComponent,
    EmailComponent,
    LoginComponent,
    ProfileComponent,
    SignupComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    ShareComponentModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AuthService,
    lunacianApiService,
    ApiTrackerService,
    AxieTechApiService,
    FireServiceService,
    GetPriceService,
    FriendService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
