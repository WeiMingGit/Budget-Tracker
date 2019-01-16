import { Component } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { Entrydata } from '../../models/entrydata';
import { AlertController } from 'ionic-angular';
import { TabsControllerPage } from '../tabs-controller/tabs-controller';
import { BudgetLimit } from '../../models/budgetLimit';


@Component({
  selector: 'page-add-entry',
  templateUrl: 'add-entry.html'
})
export class AddEntryPage {



  itemData = [];
  img:string;
  currentDate:string;
  userId:string;
  params:any;
  category:string;
  type:string;
  amount:number;





  constructor(public navCtrl: NavController, private view: ViewController, private fdb: AngularFireDatabase, private alertCtrl: AlertController,navParams: NavParams) {
    this.params = navParams;
    this.userId = this.params.data.userId;
    this.userId = "qWAn0pYj2eh9OCLocSB1zJKcHUC3";
    console.log("inside entrypage userid: ",this.userId);
    let date = new Date();
    this.currentDate = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
    console.log("current date: ",this.currentDate);

  }

  addEntry(){



    if (this.category === "Food") this.img = "assets/img/food.png";
    if (this.category === "Transport") this.img = "assets/img/transport.png";
    if (this.category === "Utility") this.img = "assets/img/utility.png";
    if (this.category === "Shopping") this.img = "assets/img/shopping.png";
    let key = "";
    let entryData = new Entrydata(this.type,this.amount,this.category, this.img, this.userId,this.currentDate,key);
    key = this.fdb.list("/entryItems/").push(entryData).key;

    this.fdb.object('/entryItems/' + key).update({ key: key});
    console.log("entry successful", entryData);
    this.presentAlert();


  }

  presentAlert() {
  let alert = this.alertCtrl.create({
    title: 'Entry has been successfully updated!',
    message: '',
    buttons: [
      {
        text: 'Dismiss',
        role: 'cancel',
        handler: () => {
          this.navCtrl.setRoot(TabsControllerPage,{userId:this.userId});
        }
      }
    ]
  });
  alert.present();
}


}
