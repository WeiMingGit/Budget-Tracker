import { Component, ViewChild,OnInit, } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { Entrydata } from '../../models/entrydata';
import * as moment from 'moment'
import { Storage } from '@ionic/storage';
import { entryItemFbProvider } from '../../providers/entryItemFirebase';


@Component({
  selector: 'page-transaction-history',
  templateUrl: 'transaction-history.html'
})
export class TransactionHistoryPage implements OnInit{

  userId:string;
  userOverallData:Entrydata[] = [];
  sevenDays:string;
  oneMonth:string;
  sixMonth:string;
  oneYear:string;
  total:number=0;
  date:any;

  constructor(public navCtrl: NavController,private fdb: AngularFireDatabase, public navParams: NavParams, private storage:Storage, private entryService: entryItemFbProvider) {
    this.userId= this.navParams.get('userId');
    //this.userId = "qWAn0pYj2eh9OCLocSB1zJKcHUC3";
    console.log("check user id ",this.userId);
    this.date = "7 Days";

    this.sevenDays = moment().subtract(6, 'days').format("YYYY-MM-DD");
    this.oneMonth = moment().subtract(1, 'month').format("YYYY-MM-DD");
    this.sixMonth = moment().subtract(6, 'months').format("YYYY-MM-DD");
    this.oneYear = moment().subtract(1, 'year').format("YYYY-MM-DD");

  }

  ngOnInit(){
    this.retrieveAllRecords({value:this.date});
  }

  conditionTotal(data){
    if(data < 0) return true;
  }

  condition(data){
    if(data.type === "expense") return true;
  }

  filterItems(searchTerm){
    //console.log(searchTerm);

          return this.userOverallData.filter((item:any) => {
              return item.amount.indexOf(searchTerm) > -1;
          });

      }

  setFilteredItems(ev:any) {


      let searchTerm = ev.target.value;
      if(searchTerm === ""){
        this.ngOnInit();
      }

        this.userOverallData = this.filterItems(searchTerm);

    }

  delete(item: any) {
    console.log('Delete');
    this.entryService.removeItem(item);
    this.ngOnInit();



  }

  retrieveAllRecords(ev:any){
    this.userOverallData = [];
    console.log("check",this.userOverallData);
    this.total = 0;
    let condition = ev.value;

    this.fdb.list("entryItems/").valueChanges().subscribe(
      data => {
        let overallData = data.sort((a:any, b:any) => a.date >= b.date ? -1 : 1);



        overallData.forEach( (entry:any) => {
          let entryDate = entry.date;
          //console.log("dd ",entryDate, this.oneYear)
          //console.log("check: ",moment('2018-12-28').isSameOrAfter(this.oneYear, 'year'));

          if(entry.userId === this.userId){
            if(condition === "7 Days"){

              if(moment(entryDate).isSameOrAfter(this.sevenDays, 'day') === true){

                this.userOverallData.push(entry);
                if(entry.type === "expense"){
                  this.total -= Number(entry.amount);
                }
                else{
                  this.total += Number(entry.amount);

                }
              }


            }

            else if(condition === "1 Month"){
              if(moment(entryDate).isSameOrAfter(this.oneMonth, 'day') === true){

                this.userOverallData.push(entry);
                if(entry.type === "expense"){
                  this.total -= Number(entry.amount);
                }
                else{
                  this.total += Number(entry.amount);

                }
              }



            }

            else if(condition === "6 Months"){

              if(moment(entryDate).isSameOrAfter(this.sixMonth, 'month') === true){

                this.userOverallData.push(entry);

                if(entry.type === "expense"){
                  this.total -= Number(entry.amount);
                }
                else{
                  this.total += Number(entry.amount);

                }
              }


            }

            else if(condition === "1 Year"){

              if(moment(entryDate).isSameOrAfter(this.oneYear, 'day') === true){


                this.userOverallData.push(entry);
                if(entry.type === "expense"){
                  this.total -= Number(entry.amount);
                }
                else{
                  this.total += Number(entry.amount);

                }
              }


            }











            }

          });
          this.userOverallData = this.userOverallData.sort(function(a:any, b:any) {
              var dateA:any = new Date(a.date), dateB:any = new Date(b.date);
              return dateB - dateA;
          });
          console.log("check userOverallData: ",this.userOverallData,this.total);

        }
    )


  }




}
