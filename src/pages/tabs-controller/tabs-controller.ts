import { Component } from '@angular/core';
import { NavController, ModalController, NavParams } from 'ionic-angular';
import { SummaryPage } from '../summary/summary';
import { StatisticPage } from '../statistic/statistic';
import { ScanReceiptPage } from '../scan-receipt/scan-receipt';
import { AddEntryPage } from '../add-entry/add-entry';


@Component({
  selector: 'page-tabs-controller',
  templateUrl: 'tabs-controller.html'
})
export class TabsControllerPage {

  home: any = SummaryPage;
  scan: any = ScanReceiptPage;
  // stat: any = StatisticPage;
  entry: any = AddEntryPage;
  params:any;
  homeParams:any;

  //tab4Root: any = this.openEntryModal();
  constructor(public navCtrl: NavController, private modal: ModalController,public navParams:NavParams) {
    this.params = navParams;
    this.homeParams = this.params.data;
    console.log("paramenter in tabs ",this.homeParams);
  }
  goToSummary(params){
    console.log('triggered');
    if (!params) params = {};
    this.navCtrl.setRoot(SummaryPage);
  }
  // goToNotification(params){
  //   if (!params) params = {};
  //   this.navCtrl.push(StatisticPage);}
  goToAddEntry(params){
    if (!params) params = {};
    this.navCtrl.push(AddEntryPage);
  }




  openEntryModal(){
    const entryModal = this.modal.create(AddEntryPage,this.homeParams);
    console.log("test");
    entryModal.present();
  }
}
