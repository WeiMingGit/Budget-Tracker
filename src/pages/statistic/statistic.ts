import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs, LoadingController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { entryItemFbProvider } from '../../providers/entryItemFirebase';
import * as moment from 'moment'
import { ChartService } from '../../providers/chart';
import * as HighCharts from 'highcharts';
import More from 'highcharts/highcharts-more';
import Drilldown from 'highcharts/modules/drilldown';

Drilldown(HighCharts);
More(HighCharts);



@Component({
  selector: 'page-statistic',
  templateUrl: 'statistic.html'
})
export class StatisticPage implements OnInit{

  // @ViewChild("balgauge", { read: ElementRef }) balgauge: ElementRef;
  // @ViewChild("cfgauge", { read: ElementRef }) cfgauge: ElementRef;
  @ViewChild("expenseBar", { read: ElementRef }) expenseBar: ElementRef;
  @ViewChild("expenseSavingLine", { read: ElementRef }) expenseSavingLine: ElementRef;
  @ViewChild("limitBar", { read: ElementRef }) limitBar: ElementRef;



  userIncome = 0;
  totalExpenses = 0;
  totalIncome = 0;
  userId:string;
  amountLeft:string;
  cashFlow:string;
  currentMonth:any;
  currentDate: any;
  currentDays:any;
  currentYear:any;
  category:string[];
  categoryExpenseCurrentMonth:any[];
  categoryExpenseSixMonth:any[];
  oneMonthBackDate:any;
  sevenMonthBackDate:any;
  sixMonthsSavingsData:any[];
  sixMonthsExpensesData:any[];
  catAmountPerMonth:any[];
  catBudgetPerMonth:any[];
  loader:any;
  date:string;


  constructor(public navCtrl: NavController,public platform:Platform, public navParams: NavParams,private fdb: AngularFireDatabase,private chartService:ChartService,public loadingCtrl: LoadingController, private entryService: entryItemFbProvider) {
    //this.userId = "qWAn0pYj2eh9OCLocSB1zJKcHUC3";
    this.userId= this.navParams.get('userId');
    let date = new Date();
    console.log(moment(date, "DD/MM/YYY"));
    this.currentDate = moment(date, "DD/MM/YYY");
    this.currentDays = moment(date, "DD/MM/YYY").format('D');
    this.currentMonth = moment(date, "DD/MM/YYY").format('M');
    this.currentYear = moment(date, "DD/MM/YYY").format('Y');
    this.category = [];
    this.categoryExpenseCurrentMonth = new Array(5);
    this.categoryExpenseSixMonth = new Array(5);
    this.sixMonthsExpensesData = new Array(5);
    this.sixMonthsSavingsData = new Array(5);
    this.catAmountPerMonth = new Array(5);
    this.catBudgetPerMonth = new Array(5);
    this.catAmountPerMonth[0] = new Array(4);
    this.catAmountPerMonth[1] = new Array(4);
    this.catAmountPerMonth[2] = new Array(4);
    this.catAmountPerMonth[3] = new Array(4);
    this.catAmountPerMonth[4] = new Array(4);
    this.catAmountPerMonth[5] = new Array(4);
    this.catBudgetPerMonth[0] = new Array(4);
    this.catBudgetPerMonth[1] = new Array(4);
    this.catBudgetPerMonth[2] = new Array(4);
    this.catBudgetPerMonth[3] = new Array(4);
    this.catBudgetPerMonth[4] = new Array(4);
    this.catBudgetPerMonth[5] = new Array(4);
    this.date = "Current Month";

  }



  ngOnInit(){
    this.loader = this.presentLoadingCrescent();
    this.retrieveIncome();
    this.retrieveExpense();




  }

  filterDate(ev:any){

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
    this.amountLeft = "Amount Left";
    this.cashFlow = "Cash Flow";

  }

  retrieveIncome(){

    this.fdb.list("income/").valueChanges().subscribe(
      data => {
        data.forEach( (entry:any) => {

          if(entry.userId === this.userId){
            this.userIncome = Number(entry.income);

          }


        })

      }
    )
  }


  retrieveBudgetLimit(){
    this.fdb.list("budgetLimit/").valueChanges().subscribe(
      data => {

        data.forEach( (entry:any) => {
          this.getBudgetLimitForSixMonths(entry);
        })
      }
    )
  }

  retrieveExpense(){
    let count = 0;


    this.fdb.list("entryItems/").valueChanges().subscribe(
      data => {

        data.forEach( (entry:any) => {

          this.category.push(entry.category);
          this.category = Array.from(new Set(this.category));

          let entryYear = moment(entry.date,"YYYY-MM-DD").format('Y');
          let entryMonth = moment(entry.date,"YYYY-MM-DD").format('M');

          if(entry.userId === this.userId){
            if(entryYear === this.currentYear){
                if(entryMonth === this.currentMonth){

                  if(entry.type === "expense"){
                    this.totalExpenses += Number(entry.amount);

                    this.currentMonthData(entry);

                  }
                  else{
                    this.totalIncome += Number(entry.amount);


                  }
                }

              }

              this.currentAndSixMonthData(entryMonth,entry);
              this.getLineChartAndColumnDataExpense(entry);

          }
          //Fomatting
          this.categoryExpenseCurrentMonth = Array.from(this.categoryExpenseCurrentMonth, v => v === undefined ? 0 : v);
          this.categoryExpenseSixMonth = Array.from(this.categoryExpenseSixMonth, v => v === undefined ? 0 : v);

          //retrieveLimitForChart


        })
        //getAverageValue
        this.getAverageSixMonthExpense();

        //retrieveBudgetLimit
        this.retrieveBudgetLimit();
        //getLineChartDataSaving
        this.getLineChartDataSaving(this.userIncome,this.sixMonthsExpensesData);

        //display chart
        let bal  = this.userIncome+this.totalIncome-this.totalExpenses;
        let cf = this.totalIncome-this.totalExpenses;

        //displayBarChart
        this.chartService.displayBarChart(this.expenseBar.nativeElement,this.category,this.categoryExpenseCurrentMonth,this.categoryExpenseSixMonth,this.oneMonthBackDate+" to " +this.sevenMonthBackDate);
        //displayLineChart
        this.chartService.displayLineChart(this.expenseSavingLine.nativeElement,this.dateCat(),this.sixMonthsExpensesData,this.sixMonthsSavingsData);
        //displayColumnChart
        setTimeout( () => {
          this.chartService.displayColumnChart(this.limitBar.nativeElement,this.dateCat(),this.category,this.sixMonthsExpensesData,this.catAmountPerMonth,this.catBudgetPerMonth);

        }, 500);
        //if bal > original income

        // //displayGaugeChart
        // if(bal > this.userIncome){
        //   this.chartService.displayGaugeChart(this.balgauge.nativeElement,bal,bal*0.7,bal*0.3,bal,0);
        // }
        // //if bal < original income
        // if(bal < this.userIncome && bal != 0){
        //   this.chartService.displayGaugeChart(this.balgauge.nativeElement,this.userIncome,this.userIncome*0.7,this.userIncome*0.3,bal,0);
        // }
        // //if bal < 0
        // if(bal < this.userIncome && bal < 0){
        //   this.chartService.displayGaugeChart(this.balgauge.nativeElement,this.userIncome,this.userIncome*0.7,this.userIncome*0.3,bal,bal);
        // }
        // //if cf < 0
        // if(cf < 0){
        //   this.chartService.displayGaugeChart(this.cfgauge.nativeElement,this.userIncome,this.userIncome*0.7,this.userIncome*0.3,cf,cf);
        // }
        // //if cf > 0
        // if(cf > 0 && cf < this.userIncome){
        //   this.chartService.displayGaugeChart(this.cfgauge.nativeElement,this.userIncome,this.userIncome*0.7,this.userIncome*0.3,cf,0);
        // }
        // if(cf > 0 && cf > this.userIncome){
        //   this.chartService.displayGaugeChart(this.cfgauge.nativeElement,cf,cf*0.7,cf*0.3,cf,0);
        // }
        // console.log("check cat ",this.category);
        this.loaderDismiss();
      }
    )




  }

  currentMonthData(entry){
    if(this.category.includes(entry.category)){
      if(this.categoryExpenseCurrentMonth[this.category.indexOf(entry.category)] > -1 === false){

        this.categoryExpenseCurrentMonth[this.category.indexOf(entry.category)] = Number(entry.amount);
      }
      else{
        this.categoryExpenseCurrentMonth[this.category.indexOf(entry.category)] += Number(entry.amount);
      }



    }
  }

  getAverageSixMonthExpense(){
    for(let i=0;i<this.categoryExpenseSixMonth.length; i++){
      this.categoryExpenseSixMonth[i] = +((this.categoryExpenseSixMonth[i] / 6).toFixed(2));
    }
  }

  dateCat(){
    let dateCat = [];
    let oneMonthBeforeDate = moment(this.currentDate).subtract(this.currentDays-1, 'days').subtract(1, 'month').format('YYYY-MM-DD');
    let secondMonthDate = moment(oneMonthBeforeDate).subtract(1, 'month').format('YYYY-MM-DD');
    let thirdMonthDate = moment(secondMonthDate).subtract(1, 'month').format('YYYY-MM-DD');
    let fourthMonthDate = moment(thirdMonthDate).subtract(1, 'month').format('YYYY-MM-DD');
    let fifthMonthDate = moment(fourthMonthDate).subtract(1, 'month').format('YYYY-MM-DD');
    let sixthMonthDate = moment(fifthMonthDate).subtract(1, 'month').format('YYYY-MM-DD');
    dateCat = [oneMonthBeforeDate,secondMonthDate,thirdMonthDate,fourthMonthDate,fifthMonthDate, sixthMonthDate];
    return dateCat;


  }

  getLineChartDataSaving(income,sixMonthsExpensesData){
    for(let i=0; i<6; i++){
      if(this.sixMonthsSavingsData[i] > -1 === false){
        this.sixMonthsSavingsData[i] = income - sixMonthsExpensesData[i];
      }


    }



  }

  getBudgetLimitForSixMonths(entry){

    let dateCat = this.dateCat();
    let date = moment(entry.date).format("YYYY-MM-DD");
    if(this.userId === entry.userId){
      //1MonthBefore
      if(date === dateCat[0]
        && this.category.includes(entry.category)
        && this.catBudgetPerMonth[0] > -1 === false
        && this.catBudgetPerMonth[0][this.category.indexOf(entry.category)] > -1 === false)this.catBudgetPerMonth[0][this.category.indexOf(entry.category)] = Number(entry.limit);
      //2MonthBefore
      if(date === dateCat[1]
        &&this.category.includes(entry.category)
        &&this.catBudgetPerMonth[1] > -1 === false
        &&this.catBudgetPerMonth[1][this.category.indexOf(entry.category)] > -1 === false)this.catBudgetPerMonth[1][this.category.indexOf(entry.category)] = Number(entry.limit);
      //3MonthBefore
      if(date === dateCat[2]
        &&this.category.includes(entry.category)
        &&this.catBudgetPerMonth[2] > -1 === false
        &&this.catBudgetPerMonth[2][this.category.indexOf(entry.category)] > -1 === false)this.catBudgetPerMonth[2][this.category.indexOf(entry.category)] = Number(entry.limit);
      //4MonthBefore
      if(date === dateCat[3]
        &&this.category.includes(entry.category)
        &&this.catBudgetPerMonth[3] > -1 === false
        &&this.catBudgetPerMonth[3][this.category.indexOf(entry.category)] > -1 === false)this.catBudgetPerMonth[3][this.category.indexOf(entry.category)] = Number(entry.limit);
      //5MonthBefore
      if(date === dateCat[4]
        &&this.category.includes(entry.category)
        &&this.catBudgetPerMonth[4] > -1 === false
        &&this.catBudgetPerMonth[4][this.category.indexOf(entry.category)] > -1 === false)this.catBudgetPerMonth[4][this.category.indexOf(entry.category)] = Number(entry.limit);
      //6MonthBefore
      if(date === dateCat[5]
        &&this.category.includes(entry.category)
        &&this.catBudgetPerMonth[5] > -1 === false
        &&this.catBudgetPerMonth[5][this.category.indexOf(entry.category)] > -1 === false)this.catBudgetPerMonth[5][this.category.indexOf(entry.category)] = Number(entry.limit);
    }
  }



  getLineChartAndColumnDataExpense(entry){
    let dateCat = this.dateCat();


    if(entry.type === "expense"){
        //1MonthBefore

        if(moment(entry.date).isSameOrAfter(dateCat[0], 'day') === true && moment(entry.date).isBefore(moment(dateCat[0]).add(1, 'month').format('YYYY-MM-DD'), 'day') === true){

          if(this.category.includes(entry.category)){
            if(this.catAmountPerMonth[0] > -1 === false){
              if(this.catAmountPerMonth[0][this.category.indexOf(entry.category)] > -1 === true)this.catAmountPerMonth[0][this.category.indexOf(entry.category)] += Number(entry.amount);
              if(this.catAmountPerMonth[0][this.category.indexOf(entry.category)] > -1 === false)this.catAmountPerMonth[0][this.category.indexOf(entry.category)] = Number(entry.amount);
            }
            else{
              this.catAmountPerMonth[0][this.category.indexOf(entry.category)] += Number(entry.amount);
            }
          }
          if(this.sixMonthsExpensesData[0] > -1 === true){this.sixMonthsExpensesData[0] += Number(entry.amount);}
          if(this.sixMonthsExpensesData[0] > -1 === false){this.sixMonthsExpensesData[0] = Number(entry.amount);}
        }
        //2MonthBefore
        else if(moment(entry.date).isSameOrAfter(dateCat[1], 'day') === true && moment(entry.date).isBefore(dateCat[0], 'day') === true){
          if(this.category.includes(entry.category)){
            if(this.catAmountPerMonth[1] > -1 === false){
              if(this.catAmountPerMonth[1][this.category.indexOf(entry.category)] > -1 === true)this.catAmountPerMonth[1][this.category.indexOf(entry.category)] += Number(entry.amount);
              if(this.catAmountPerMonth[1][this.category.indexOf(entry.category)] > -1 === false)this.catAmountPerMonth[1][this.category.indexOf(entry.category)] = Number(entry.amount);
            }
            else{
              this.catAmountPerMonth[1][this.category.indexOf(entry.category)] += Number(entry.amount);
            }
          }
          if(this.sixMonthsExpensesData[1] > -1 === true){this.sixMonthsExpensesData[1] += Number(entry.amount);}
          if(this.sixMonthsExpensesData[1] > -1 === false){this.sixMonthsExpensesData[1] = Number(entry.amount);}
        }
        //3MonthBefore
        else if(moment(entry.date).isSameOrAfter(dateCat[2], 'day') === true && moment(entry.date).isBefore(dateCat[1], 'day') === true){
          if(this.category.includes(entry.category)){
            if(this.catAmountPerMonth[2] > -1 === false){
              if(this.catAmountPerMonth[2][this.category.indexOf(entry.category)] > -1 === true)this.catAmountPerMonth[2][this.category.indexOf(entry.category)] += Number(entry.amount);
              if(this.catAmountPerMonth[2][this.category.indexOf(entry.category)] > -1 === false)this.catAmountPerMonth[2][this.category.indexOf(entry.category)] = Number(entry.amount);
            }
            else{
              this.catAmountPerMonth[2][this.category.indexOf(entry.category)] += Number(entry.amount);
            }
          }
          if(this.sixMonthsExpensesData[2] > -1 === true){this.sixMonthsExpensesData[2] += Number(entry.amount);}
          if(this.sixMonthsExpensesData[2] > -1 === false){this.sixMonthsExpensesData[2] = Number(entry.amount);}
        }
        //4MonthBefore
        else if(moment(entry.date).isSameOrAfter(dateCat[3], 'day') === true && moment(entry.date).isBefore(dateCat[2], 'day') === true){
          if(this.category.includes(entry.category)){
            if(this.catAmountPerMonth[3] > -1 === false){
              if(this.catAmountPerMonth[3][this.category.indexOf(entry.category)] > -1 === true)this.catAmountPerMonth[3][this.category.indexOf(entry.category)] += Number(entry.amount);
              if(this.catAmountPerMonth[3][this.category.indexOf(entry.category)] > -1 === false)this.catAmountPerMonth[3][this.category.indexOf(entry.category)] = Number(entry.amount);
            }
            else{
              this.catAmountPerMonth[3][this.category.indexOf(entry.category)] += Number(entry.amount);
            }
          }
          if(this.sixMonthsExpensesData[3] > -1 === true){this.sixMonthsExpensesData[3] += Number(entry.amount);}
          if(this.sixMonthsExpensesData[3] > -1 === false){this.sixMonthsExpensesData[3] = Number(entry.amount);}
        }
        //5MonthBefore
        else if(moment(entry.date).isSameOrAfter(dateCat[4], 'day') === true && moment(entry.date).isBefore(dateCat[3], 'day') === true){
          if(this.category.includes(entry.category)){
            if(this.catAmountPerMonth[4] > -1 === false){
              if(this.catAmountPerMonth[4][this.category.indexOf(entry.category)] > -1 === true)this.catAmountPerMonth[4][this.category.indexOf(entry.category)] += Number(entry.amount);
              if(this.catAmountPerMonth[4][this.category.indexOf(entry.category)] > -1 === false)this.catAmountPerMonth[4][this.category.indexOf(entry.category)] = Number(entry.amount);
            }
            else{
              this.catAmountPerMonth[4][this.category.indexOf(entry.category)] += Number(entry.amount);
            }
          }
          if(this.sixMonthsExpensesData[4] > -1 === true){this.sixMonthsExpensesData[4] += Number(entry.amount);}
          if(this.sixMonthsExpensesData[4] > -1 === false){this.sixMonthsExpensesData[4] = Number(entry.amount);}
        }
        //6MonthBefore
        else if(moment(entry.date).isSameOrAfter(dateCat[5], 'day') === true && moment(entry.date).isBefore(dateCat[4], 'day') === true){
          if(this.category.includes(entry.category)){
            if(this.catAmountPerMonth[5] > -1 === false){
              if(this.catAmountPerMonth[5][this.category.indexOf(entry.category)] > -1 === true)this.catAmountPerMonth[5][this.category.indexOf(entry.category)] += Number(entry.amount);
              if(this.catAmountPerMonth[5][this.category.indexOf(entry.category)] > -1 === false)this.catAmountPerMonth[5][this.category.indexOf(entry.category)] = Number(entry.amount);
            }
            else{
              this.catAmountPerMonth[5][this.category.indexOf(entry.category)] += Number(entry.amount);
            }
          }
          if(this.sixMonthsExpensesData[5] > -1 === true){this.sixMonthsExpensesData[5] += Number(entry.amount);}
          if(this.sixMonthsExpensesData[5] > -1 === false){this.sixMonthsExpensesData[5] = Number(entry.amount);}
        }
    }
    // console.log("line data : ",this.sixMonthsExpensesData);
    //console.log("data : ",this.catAmountPerMonth);
  }


  currentAndSixMonthData(entryMonth,entry){

    let sevenMonthBack = this.currentMonth - 8;
    let sevenMonthBackYear = this.currentYear;
    let dateCat = this.dateCat();

    if(entryMonth > sevenMonthBack){
      sevenMonthBack = Math.abs(sevenMonthBack);
      sevenMonthBackYear -= 1;
    }
    else if(sevenMonthBack === 0){
      sevenMonthBack = 12;
      sevenMonthBackYear -= 1;
    }
    // sevenMonthBack = ("0" + sevenMonthBack).slice(-2);

    if(moment(entry.date).isSameOrAfter(sevenMonthBackYear+"-"+sevenMonthBack+"-01", 'day') === true && moment(entry.date).isBefore(moment(dateCat[0]).add(1, 'month').format('YYYY-MM-DD'), 'day') === true){

      if(entry.type === "expense"){





        if(this.category.includes(entry.category)){
          if(this.categoryExpenseSixMonth[this.category.indexOf(entry.category)] > -1 === false){

            this.categoryExpenseSixMonth[this.category.indexOf(entry.category)] = Number(entry.amount);
          }
          else{
            this.categoryExpenseSixMonth[this.category.indexOf(entry.category)] += Number(entry.amount);
          }



        }
      }
      //console.log("check ",this.categoryExpenseSixMonth, "  ", this.category);
    }
    this.oneMonthBackDate = moment(dateCat[0]).add(1, 'month').subtract(1, 'day').format('YYYY-MM-DD');
    this.sevenMonthBackDate = sevenMonthBackYear+"-"+sevenMonthBack+"-01";
  }

}
