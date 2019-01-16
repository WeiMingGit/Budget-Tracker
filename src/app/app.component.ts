import { Component, ViewChild } from '@angular/core';
import { Platform, Nav,MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';
import { SummaryPage } from '../pages/summary/summary';
import { MainPagePage } from '../pages/main-page/main-page';
import { StatisticPage } from '../pages/statistic/statistic';
import { AddEntryPage } from '../pages/add-entry/add-entry';
import { ScanReceiptPage } from '../pages/scan-receipt/scan-receipt';
import { TabsControllerPage } from '../pages/tabs-controller/tabs-controller';
import { TransactionHistoryPage } from '../pages/transaction-history/transaction-history';
import { BankSyncPage } from '../pages/bank-sync/bank-sync';
import { SyncPage } from '../pages/sync/sync';
import { Storage } from '@ionic/storage';
import { AuthService } from '../providers/auth-service';
import { Events } from 'ionic-angular';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav;
    rootPage:any =  MainPagePage;
    userId:string;
    userName:string;

  constructor(platform: Platform,public afAuth: AngularFireAuth,public menu:MenuController , statusBar: StatusBar, splashScreen: SplashScreen, private storage:Storage, private authService: AuthService,public events: Events) {
    events.subscribe('userName', (user) => {
      this.userName = user;
    });
    storage.get('userId').then((val) => {
      this.userId = val;
      console.log('user ID', val);
    });
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  goToSummary(params){
    console.log("auth ",this.afAuth.auth);
    console.log("check ",this.userId);
    if (!params) params = {};
    this.nav.setRoot(TabsControllerPage,{userId:this.userId});
  }
  goToStatistic(params){
    console.log("check ",this.userId, this.userName);
    if (!params) params = {};
    this.nav.setRoot(StatisticPage,{userId:this.userId});
  }
  goToTransactionHisotryPage(params){
    console.log("check ",this.userId);
    if (!params) params = {};
    this.nav.setRoot(TransactionHistoryPage,{userId:this.userId});
  }
  goToBackSyncPage(params){
    if (!params) params = {};
    this.nav.setRoot(BankSyncPage,{userId:this.userId});
  }
  goToLogout(){
    this.storage.remove('userId');

    this.authService.logout();
    this.nav.setRoot(MainPagePage);
    this.nav.popToRoot();


  }



}
