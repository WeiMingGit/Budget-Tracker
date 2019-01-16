import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, LoadingController} from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { Entrydata } from '../../models/entrydata';
import { AlertController } from 'ionic-angular';
import { Chart } from 'chart.js';
import { TransactionHistoryPage } from '../transaction-history/transaction-history';
import { AddEntryPage } from '../add-entry/add-entry';
import { ScanReceiptPage } from '../scan-receipt/scan-receipt';
import { TabsControllerPage } from '../tabs-controller/tabs-controller';
import { Storage } from '@ionic/storage';
import * as moment from 'moment'
import { ChartService } from '../../providers/chart';

@Component({
  selector: 'page-summary',
  templateUrl: 'summary.html'
})
export class SummaryPage implements OnInit{


  @ViewChild("balgauge", { read: ElementRef }) balgauge: ElementRef;
  @ViewChild("cfgauge", { read: ElementRef }) cfgauge: ElementRef;
  @ViewChild('doughnutCanvas') doughnutCanvas;




  doughnutChart: any;

  userEntryData:Entrydata[] = [];
  public homeColor : string;
  public borderRadius : string;
  public border : string;
  public padding: string;
  public height: string;
  public width: string;
  totalExpenses = 0;
  totalIncome = 0;
  cashFlow = 0;
  userIncome = 0;
  initialIncome = 0;
  chartLabel:string[]=[];
  chartData:number[]=[];
  userId:string;
  userName:string
  currentMonth:any;
  currentYear:any;
  loader:any;
  balance:string;
  cashflow:string;
  conditionDiv: boolean;
  ExpensesStructure:string;
  params:any;


  constructor(public navCtrl: NavController,private fdb: AngularFireDatabase,private chartService:ChartService, public navParams: NavParams,public loadingCtrl: LoadingController, private storage:Storage ) {

    this.params = navParams;
    console.log("user name ",this.params);
    this.userId =  this.params.data.userId;
    this.userName = this.params.data.userName;
    console.log("user id ",this.userId, this.userName);

    this.userId = "qWAn0pYj2eh9OCLocSB1zJKcHUC3";
    this.storage.set('userId', this.userId);



     let date = new Date();
     this.currentMonth = date.getMonth()+1;
     this.currentYear = moment().year();

  }


  ngOnInit(){
    //console.log("Oninit");
    this.conditionDiv = false;
    this.loader = this.presentLoadingCrescent();
    this.getUserIncome();
    this.getUserData();

  }

  presentLoadingCrescent() {
      let loading = this.loadingCtrl.create({
        spinner: 'crescent',
        content: 'Fetching data in progress'
      });

      loading.present();
      return loading;
    }

  loaderDismiss(){
    this.loader.dismiss();
    this.balance = "Balance";
    this.cashflow = "Cash Flow";
    this.ExpensesStructure = "Expenses Structure";
    this.conditionDiv = true;
    this.homeColor = "white";
    this.borderRadius = "25px";
    this.border = "2px solid #84A7E6";
    this.padding = "20px";
    this.width = "350px";
    this.height = "250px";

  }


    ionViewDidEnter(){
      //console.log("xxxxx ");
    }

    ionViewWillEnter(){
      //console.log("sssss");
    }


  getUserIncome(){
    console.log("reached ",this.userId);
    this.fdb.list("income/").valueChanges().subscribe(
      data => {
        let overallData = data;


        overallData.forEach( (entry:any) => {

          if(entry.userId === this.userId){
            this.userIncome = Number(entry.income);
            this.initialIncome = Number(entry.income);
            console.log("passed", this.userIncome);
          }
          // this.userIncome = this.income;
          // console.log("check", entry.userId," ",this.userId);


        })
        // this.userIncome = Number(data);
      }
    )
  }



  displayChart(data,label) {

    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels:label,
        datasets: [{
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          hoverBackgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#FF6384",
              "#36A2EB",
              "#FFCE56"
          ]
        }]
      },
      options: {
        legend: {
          display: true
        },
        tooltips: {
          enabled: true,
        },
        title: {
          display: false,
          fontStyle: 'bold',
          fontSize: 18
        }
      },

    });
  }


  condition(data){
    if(data.type === "expense") return true;
  }


  getUserData(){
    var shoppingAmt = 0;
    var transportAmt = 0;
    var foodAmt = 0;
    var utilityAmt = 0;
    var catAmt = {};


    this.fdb.list("entryItems/").valueChanges().subscribe(
      data => {

        let overallData = data.sort((a:any, b:any) => a.date >= b.date ? -1 : 1);

        overallData.forEach( (entry:any) => {

          if(entry.userId === this.userId){
            let entryMonth = new Date(entry.date).getMonth()+1;
            let entryYear = moment(entry.date,"YYYY-MM-DD").year();

            if(entryYear === this.currentYear){
                if(entryMonth === this.currentMonth){
                  console.log("entry ",entry.amount);
                  this.userEntryData.push(entry);
                  if(entry.type === "expense"){

                    this.totalExpenses += Number(entry.amount);
                    if(entry.category === "Shopping") shoppingAmt += Number(entry.amount);
                    if(entry.category === "Transport") transportAmt += Number(entry.amount);
                    if(entry.category === "Food") foodAmt += Number(entry.amount);
                    if(entry.category === "Utility") utilityAmt += Number(entry.amount);
                  }
                  else{
                    let entryMonth = new Date(entry.date).getMonth()+1;
                    // console.log(entry.date);
                    // console.log("entry month: ",entryMonth);
                    if(entryMonth === this.currentMonth){
                      this.totalIncome += Number(entry.amount);
                    }
                  //  console.log("check",this.totalIncome);
                  }

                }
            }


          }


        })

        catAmt =
          {
            "food":foodAmt,
            "transport":transportAmt,
            "utility":utilityAmt,
            "shopping":shoppingAmt,

          };


        Object.keys(catAmt).forEach(key => catAmt[key] === 0 ? delete catAmt[key] : '');
        //console.log("check for chartlabel: ",Object.keys(catAmt),Object.values(catAmt));

        this.chartLabel = Object.keys(catAmt);
        this.chartData = Object.values(catAmt);
        this.displayChart(this.chartData,this.chartLabel);
        this.cashFlow = this.totalIncome - this.totalExpenses;
        this.userIncome += this.totalIncome;
        this.userIncome -= this.totalExpenses;
        this.userEntryData = this.userEntryData.sort(function(a:any, b:any) {
            var dateA:any = new Date(a.date), dateB:any = new Date(b.date);
            return dateB - dateA;
        });


        //displayGaugeChart
        if(this.userIncome > this.initialIncome){
          this.chartService.displayGaugeChart(this.balgauge.nativeElement,this.userIncome,this.userIncome*0.7,this.userIncome*0.3,this.userIncome,0);
        }
        //if bal < original income
        if(this.userIncome < this.initialIncome && this.userIncome != 0){
          this.chartService.displayGaugeChart(this.balgauge.nativeElement,this.initialIncome,this.initialIncome*0.7,this.initialIncome*0.3,this.userIncome,0);
        }
        //if bal < 0
        if(this.userIncome < this.initialIncome && this.userIncome < 0){
          this.chartService.displayGaugeChart(this.balgauge.nativeElement,this.initialIncome,this.userIncome*0.7,this.initialIncome*0.3,this.userIncome,this.userIncome);
        }
        //if cf < 0
        if(this.cashFlow < 0){
          this.chartService.displayGaugeChart(this.cfgauge.nativeElement,this.initialIncome,this.initialIncome*0.7,this.initialIncome*0.3,this.cashFlow,this.cashFlow);
        }
        //if cf > 0
        if(this.cashFlow > 0 && this.cashFlow < this.initialIncome){
          this.chartService.displayGaugeChart(this.cfgauge.nativeElement,this.initialIncome,this.initialIncome*0.7,this.initialIncome*0.3,this.cashFlow,0);
        }
        if(this.cashFlow > 0 && this.cashFlow > this.initialIncome){
          this.chartService.displayGaugeChart(this.cfgauge.nativeElement,this.cashFlow,this.cashFlow*0.7,this.cashFlow*0.3,this.cashFlow,0);
        }
        this.loaderDismiss();
      }
    )



  }


  goToTransactionHisotryPage(){
    this.navCtrl.setRoot(TransactionHistoryPage,{userId:this.userId});
  }



}
