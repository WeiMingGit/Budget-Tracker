import { Component, OnInit } from '@angular/core';
import { NavController,Platform } from 'ionic-angular';
import { SummaryPage } from '../summary/summary';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from 'ionic-angular';
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth';
import { TabsControllerPage } from '../tabs-controller/tabs-controller';
import { Events } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';

@Component({
  selector: 'page-loginWithFingerPrint',
  templateUrl: 'loginWithFingerPrint.html'
})
export class LoginWithFingerPrintPage implements OnInit {


  loginForm: FormGroup;
  token:any;
  userId:string;
  email:string;
  password:string;



  constructor(private fingerprint: AndroidFingerprintAuth,private fdb: AngularFireDatabase,public platform:Platform,public afAuth: AngularFireAuth, public events: Events,public navCtrl: NavController, private alertCtrl: AlertController) {


    this.email = '';

  }

  ngOnInit() {
    let EMAILPATTERN = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),
    });
  }



  goToSummary(params){
    //if (!params) params = {};
    console.log("go to summary ", params);
    this.navCtrl.setRoot(TabsControllerPage,{userId:params});
  }

  async loginWithFingerprint(){

    if (this.email === '')
      {
        let alert = this.alertCtrl.create({
          title: "Please Enter your email",
          subTitle: '',
          buttons: ['Dismiss']
        });
        alert.present();
      }
    else{
      await this.fdb.list("userAccount/").valueChanges().subscribe(
        data => {
         let overallData = data;
         overallData.forEach( (user:any) => {

            if(this.email === user.email){
              this.password = user.password;
              console.log("registered user",user.password);
              console.log("inside finger print");
              this.fingerPrint();

            }
            else{
              let alert = this.alertCtrl.create({
                title: "Please enter a registered email",
                subTitle: '',
                buttons: ['Dismiss']
              });
              alert.present();
            }



          })
        });
    }

  }


  fingerPrint(){
    let encryptConfig = {
      clientId: "trackerApp",
      maxAttempts: 5,
      dialogTitle: "Login in with your fingerprint",
      dialogMessage: "Put your finger on the device"
    };
    this.fingerprint.isAvailable()
    .then((result)=>{
      if(result.isAvailable){
        this.fingerprint.encrypt(encryptConfig)
        .then(result => {
          if(result.withFingerprint){

            console.log("login in successfully");
            this.login();


          } else if (result.withBackup){
            console.log("with backup login");
            this.navCtrl.push(TabsControllerPage);
          } else{
            console.log("unable to login in");
          }
        })
        .catch(error => {
          if(error === this.fingerprint.ERRORS.FINGERPRINT_CANCELLED){
            console.log("Fingerprint authentication cancelled");
          } else console.error("error statement: ",error);

        });
      } else {
        var title = "fingerprint scanner isnt available";
        let alert = this.alertCtrl.create({
          title: title,
          subTitle: '',
          buttons: ['Dismiss']
        });
        alert.present();
      }
    })
    .catch(error => console.log("Error statement: ", error));
  }


  async login(){
    try{
      console.log("email: ", this.email, " password: ",this.password);
      await this.afAuth.auth.signInWithEmailAndPassword(this.email,this.password);
      await this.afAuth.authState.subscribe(user => {
        if(user) this.goToSummary(user.uid);
        this.events.publish('userName', user.displayName);
      })

    }
    catch(e){

    }
  }


}
