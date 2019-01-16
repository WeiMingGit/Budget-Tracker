import { Component, OnInit } from '@angular/core';
import { NavController,Platform } from 'ionic-angular';
import { SummaryPage } from '../summary/summary';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from 'ionic-angular';
import { TabsControllerPage } from '../tabs-controller/tabs-controller';
import { Events } from 'ionic-angular';
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage implements OnInit {

  userId:string;
  loginForm: FormGroup;
  token:any;
  email:string;
  password:string;



  constructor(public platform:Platform,private fdb: AngularFireDatabase,private fingerprint: AndroidFingerprintAuth,public afAuth: AngularFireAuth,public navCtrl: NavController, private alertCtrl: AlertController, public events: Events) {




  }

  ngOnInit() {
    this.password = "";
    this.email = "";
    let EMAILPATTERN = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    this.loginForm = new FormGroup({
      password: new FormControl('', [Validators.required,Validators.minLength(6)]),
      email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),
    });
  }



  goToSummary(userId){
    //if (!params) params = {};
    console.log("go to summary ", userId," ", name);
    this.navCtrl.setRoot(TabsControllerPage,{userId:userId});
  }


  async loginWithFingerprint(){
    this.email = "test@gmail.com";
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
            this.email = "test@gmail.com";
            this.password = "123123";
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
      this.afAuth.auth.signInWithEmailAndPassword(this.email,this.password)
      .then( data => {
        this.afAuth.authState.subscribe(user => {
          if(user) this.goToSummary(user.uid)
          this.events.publish('userName', user.displayName);
        })
      })
      .catch(e => {
        let alert = this.alertCtrl.create({
          title: e.message,
          subTitle: '',
          buttons: ['Dismiss']
        });
        alert.present();
      })
      console.log('sign in with ',this.email, this.password, this.userId);

    }
    catch(e){
      console.error(e);
      let alert = this.alertCtrl.create({
        title: e.message,
        subTitle: '',
        buttons: ['Dismiss']
      });
      alert.present();
    }



  }
}
