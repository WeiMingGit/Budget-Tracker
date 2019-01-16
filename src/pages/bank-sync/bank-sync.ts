import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SyncPage } from '../sync/sync';
import { AngularFireDatabase } from 'angularfire2/database';


@Component({
  selector: 'page-bank-sync',
  templateUrl: 'bank-sync.html',
})
export class BankSyncPage implements OnInit{


  bankData = [];
  userId:string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private fdb: AngularFireDatabase) {
    this.userId= this.navParams.get('userId');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BankSyncPage');
  }

  ngOnInit(){
    //console.log("Oninit");
    this.fetchBankData();



  }

  async fetchBankData(){
    this.fdb.list("bankAccount/").valueChanges().subscribe(
      data => {

        this.bankData = data;

        console.log("check bankdata: ",this.bankData);
        // overallData.forEach( entry => {
        //
        //   if(entry.userId === this.userId){
        //     this.userIncome = Number(entry.income);
        //     console.log("passed", this.userIncome);
        //   }
        //   // this.userIncome = this.income;
        //   // console.log("check", entry.userId," ",this.userId);
        //
        //
        // })
      }
    )
  }

  goToSync(){
    this.navCtrl.push(SyncPage,{userId:this.userId});
  }

}
