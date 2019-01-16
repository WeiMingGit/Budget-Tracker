import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { RegistrationSuccessfulPage } from '../registration-successful/registration-successful'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import * as firebase from 'firebase';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage implements OnInit {

  signupform: FormGroup;
  name:string;
  phone:string;
  email:string;
  password:string;

  constructor(public afAuth: AngularFireAuth,private fdb: AngularFireDatabase,  public navCtrl: NavController, private alertCtrl: AlertController) {
  }

  ngOnInit() {
    this.password = "";
    this.email = "";
    let EMAILPATTERN = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    this.signupform = new FormGroup({
      password: new FormControl('', [Validators.required,Validators.minLength(6)]),
      email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),
      name: new FormControl(''),
      phone: new FormControl(''),
    });
  }

  presentAlert(data) {
  let alert = this.alertCtrl.create({
    title: data.message,
    subTitle: 'Please enter a different email',
    buttons: ['Dismiss']
  });
  alert.present();
}

  goToSuccessPage(){
    this.navCtrl.push(RegistrationSuccessfulPage);
  }

  async register(){
    try{
      this.afAuth.auth.createUserWithEmailAndPassword(this.email, this.password)
      .then(data =>{
        console.log(data);
        console.log("user ",this.phone);
        this.afAuth.auth.currentUser.updateProfile({
            displayName: this.name,
            photoURL: ''
          })
        let accData = new User(this.email,this.password);
        this.fdb.list("/userAccount/").push(accData);
        this.goToSuccessPage();
      })
      .catch(e =>{
        let alert = this.alertCtrl.create({
          title: e.message,
          subTitle: 'Please enter a different email',
          buttons: ['Dismiss']
        });
        alert.present();
      })


    }
    catch(e){
      console.error(e);
      let alert = this.alertCtrl.create({
        title: e.message,
        subTitle: 'Please enter a different email',
        buttons: ['Dismiss']
      });
      alert.present();
    }
  }

}
