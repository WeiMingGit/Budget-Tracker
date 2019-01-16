import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { SummaryPage } from '../summary/summary';

@Component({
  selector: 'page-registration-successful',
  templateUrl: 'registration-successful.html'
})
export class RegistrationSuccessfulPage {

  constructor(public navCtrl: NavController) {
  }
  goToLogin(params){
    if (!params) params = {};
    //this.navCtrl.push(LoginPage);
    //this.nav.setRoot(MainPagePage);
    this.navCtrl.popToRoot();
  }goToSummary(params){
    if (!params) params = {};
    this.navCtrl.push(SummaryPage);
  }
}
