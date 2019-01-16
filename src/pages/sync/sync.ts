import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BankSyncPage } from '../bank-sync/bank-sync';
import { AlertController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { BankDetails } from '../../models/bankDetails';
import { Entrydata } from '../../models/entrydata';
import * as moment from 'moment'

 const ocbcAccBal = "https://api.ocbc.com:8243/transactional/accountbalance/1.0";
 const ocbcAccTran = "https://api.ocbc.com:8243/transactional/accounttransactionhistory/1.0?accountId=c03effed-a0ff-4e89-978e-0fcd86fc7a56";
 const payNow = "https://api.ocbc.com:8243/transactional/payanyone/1.0?accountId=c03effed-a0ff-4e89-978e-0fcd86fc7a56&amount=110&payeeName=weiming&payeePhoneNo=%2B6591283746&secretPassCode=999999";

@IonicPage({segment:'syncPage'})
@Component({
  selector: 'page-sync',
  templateUrl: 'sync.html',
})
export class SyncPage {

  bank: any;
  userId:string;
  //bankDetails:BankDetails[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController, private fdb: AngularFireDatabase, private alertCtrl: AlertController, public http: HttpClient,) {
    //this.userId = "qWAn0pYj2eh9OCLocSB1zJKcHUC3";
    this.userId= this.navParams.get('userId');
    //this.userId = "qWAn0pYj2eh9OCLocSB1zJKcHUC3";
    console.log(this.userId);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BankSyncPage');
  }

  presentAlert() {
  let alert = this.alertCtrl.create({
    title: 'Connected Successfully!',
    message: '',
    buttons: [
      {
        text: 'Dismiss',
        role: 'cancel',
        handler: () => {
          this.navCtrl.setRoot(BankSyncPage);
        }
      }
    ]
  });
  alert.present();
}

presentLoadingCrescent() {
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Fetching data in progress'
    });

    loading.present();

    setTimeout( () => {
      loading.dismiss().then(() => {
        this.presentAlert();
          });

    }, 3000);

  }


  syncBankData(){

    if(this.bank === "OCBC"){

      let header = new HttpHeaders();
      header = header.append("Accept", "application/json");
       header = header.append("sessionToken", "OAuth2INB 0672758062da6ef57e444777cadc6b3e"); 
      header = header.append("Authorization", "Bearer 0672758062da6ef57e444777cadc6b3e"); 

        this.http.get(ocbcAccBal,{headers:header}).subscribe((data:any) => {
            console.log("passed account api");
            //this.presentLoadingCrescent();
            data.results.responseList.forEach( (d:any) => {
              console.log("check ",d);
              let bankData = new BankDetails(d.accountName,d.accountMaskedNumber,d.balance.availableBalance,d.id,"assets/img/ocbc.jpeg");
              this.fdb.list("/bankAccount/").push(bankData);
            })
            console.log(data);
            //resolve(data);
        }, err => {
          console.log("ERROR account",err);
        });

          // this.http.get(ocbcAccTran,{headers:header}).subscribe((data:any) => {
          //
          //     console.log("passed account api");
          //     this.presentLoadingCrescent();
          //     console.log("check ",data);
          //     data.results.responseList.forEach( (d:any) => {
          //       let category = "";
          //       let img = "";
          //       if(d.description.includes("BILL")){
          //         category = "Utility";
          //         img = "assets/img/utility.png";
          //       }
          //       if(d.description.includes("TRANSFER")){
          //         category = "Transfer";
          //         img = "assets/img/transfer.png";
          //       }
          //       console.log("check transaction",d);
          //       let key = "";
          //       let bankTran = new Entrydata("expense",d.amount,category,img,this.userId,d.transactionDate,key);
          //       key = this.fdb.list("/entryItems/").push(bankTran);
          //       this.fdb.object('/entryItems/' + key).update({ key: key});
          //     })
          //
          // }, err => {
          //   console.log("ERROR account",err);
          // });
    }



  }

  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

}
