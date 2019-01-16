import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { LoginPage } from '../login/login';
import { LoginWithFingerPrintPage } from '../loginWithFingerPrint/loginWithFingerPrint';
import { SummaryPage } from '../summary/summary';

@Component({
  selector: 'page-main-page',
  templateUrl: 'main-page.html'
})
export class MainPagePage {

  constructor(public navCtrl: NavController) {
  }
  goToSignup(params){
    if (!params) params = {};
    this.navCtrl.push(SignupPage);
  }goToLogin(params){
    if (!params) params = {};
    this.navCtrl.push(LoginPage);
  }goToLoginWithFingerPrint(params){
    if (!params) params = {};
    this.navCtrl.push(LoginWithFingerPrintPage);
  }
}
