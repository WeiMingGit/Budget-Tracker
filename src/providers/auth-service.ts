import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AlertController } from 'ionic-angular';
import * as firebase from 'firebase/app';

@Injectable()

export class AuthService {


  constructor(public afAuth: AngularFireAuth, private alertCtrl: AlertController) {

  }



  logout(){

         this.afAuth.auth.signOut();

    }
}
