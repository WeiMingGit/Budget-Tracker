import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { ScanReceiptPage } from '../pages/scan-receipt/scan-receipt';
import { StatisticPage } from '../pages/statistic/statistic';
import { AddEntryPage } from '../pages/add-entry/add-entry';
import { TabsControllerPage } from '../pages/tabs-controller/tabs-controller';
import { SummaryPage } from '../pages/summary/summary';
import { MainPagePage } from '../pages/main-page/main-page';
import { LoginPage } from '../pages/login/login';
import { LoginWithFingerPrintPage } from '../pages/loginWithFingerPrint/loginWithFingerPrint';
import { TransactionHistoryPage } from '../pages/transaction-history/transaction-history';
import { BankSyncPage } from '../pages/bank-sync/bank-sync';
import { SignupPage } from '../pages/signup/signup';
import { SyncPage } from '../pages/sync/sync';
import { SyncPageModule } from '../pages/sync/sync.module';

import { RegistrationSuccessfulPage } from '../pages/registration-successful/registration-successful';
import { UserProfileSettingPage } from '../pages/user-profile-setting/user-profile-setting';
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth';
import { ChartsModule } from 'ng2-charts';
import { IonicStorageModule } from '@ionic/storage';
import { IonicPageModule } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { HttpClientModule } from '@angular/common/http';
import { entryItemFbProvider } from '../providers/entryItemFirebase';
import { AuthService } from '../providers/auth-service';
import { ChartService } from '../providers/chart'

var firebaseConfig = {
    apiKey: "AIzaSyC4G6f-Uq0llQAbNgUoahleViwgcE9Xx_Q",
    authDomain: "budgettrackerapp-5014e.firebaseapp.com",
    databaseURL: "https://budgettrackerapp-5014e.firebaseio.com",
    projectId: "budgettrackerapp-5014e",
    storageBucket: "budgettrackerapp-5014e.appspot.com",
    messagingSenderId: "464629297687"
  };

@NgModule({
  declarations: [
    MyApp,
    ScanReceiptPage,
    StatisticPage,
    AddEntryPage,
    TabsControllerPage,
    SummaryPage,
    MainPagePage,
    LoginPage,
    LoginWithFingerPrintPage,
    SignupPage,
    RegistrationSuccessfulPage,
    UserProfileSettingPage,
    TransactionHistoryPage,
    BankSyncPage,
    //SyncPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    ChartsModule,
    HttpClientModule,
    SyncPageModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ScanReceiptPage,
    StatisticPage,
    AddEntryPage,
    TabsControllerPage,
    LoginWithFingerPrintPage,
    SummaryPage,
    MainPagePage,
    LoginPage,
    SignupPage,
    RegistrationSuccessfulPage,
    UserProfileSettingPage,
    TransactionHistoryPage,
    BankSyncPage,
    SyncPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AndroidFingerprintAuth,
    AuthService,
    ChartService,
    entryItemFbProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
