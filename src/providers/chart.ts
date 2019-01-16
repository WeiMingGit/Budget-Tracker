import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import * as HighCharts from 'highcharts';
import More from 'highcharts/highcharts-more';
More(HighCharts);



@Injectable()

export class ChartService {
  options:any;

  constructor(public platform:Platform) {

  }


  //displayBarChart function
  displayBarChart(div,cat,currentMonthData,sixMonthData,subtitle){
  this.options = {
    chart: {
      type: 'bar',
      width: this.platform.width()-30
    },
    title: {
      text: 'Expense Structure'
    },
    subtitle: {
        text: subtitle
    },
    credits: {
        enabled: false
    },
    xAxis: {
      categories: cat
    },
    yAxis: {
      title: {
        text: 'Expense'
      }
    },
    series: [{
      name: 'Current Month',
      data: currentMonthData,
      tooltip: {
          valuePrefix: 'SGD '
      },
    },
     {
      name: 'Pass 6 Months (Average)',
      data: sixMonthData,
      tooltip: {
          valuePrefix: 'SGD '
      },
    }]
  };
    HighCharts.chart(div, this.options);
  }

  //displayLineChart function
  displayLineChart(div,dateCatFunction,sixMonthsExpensesData,sixMonthsSavingsData){
    //console.log("check ",sixMonthsSavingsData);
    this.options = {
      chart: {
        type: 'spline',
        width: this.platform.width()-30
      },
      title: {
        text: 'Expense vs Saving'
      },
      xAxis: {
        categories: dateCatFunction,
      },
      credits: {
          enabled: false
      },
      yAxis: {
        title: {
          text: 'Amount'
        }
      },
      series: [{
              name: 'Savings',
              data: sixMonthsSavingsData,
              tooltip: {
                  valuePrefix: 'SGD '
              },
          }, {
              name: 'Expenses',
              data: sixMonthsExpensesData,
              tooltip: {
                  valuePrefix: 'SGD '
              },
          }]
    };
    let dateCat = dateCatFunction;
    HighCharts.chart(div, this.options);
  }


  //displayGaugeChart function
  displayGaugeChart(div,max,range1,range2,currentBal,min){
  this.options = {
           chart: {
                  type: 'gauge',
                  plotBackgroundColor: null,
                  plotBackgroundImage: null,
                  plotBorderWidth: 0,
                  plotShadow: false,

              },
              pane: {
                  startAngle: -150,
                  endAngle: 150,
                  background: [{
                      backgroundColor: {
                          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                          stops: [
                              [0, '#FFF'],
                              [1, '#333']
                          ]
                      },
                      borderWidth: 0,
                      outerRadius: '109%'
                  }, {
                      backgroundColor: {
                          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                          stops: [
                              [0, '#333'],
                              [1, '#FFF']
                          ]
                      },
                      borderWidth: 1,
                      outerRadius: '107%'
                  }, {
                      // default background
                  }, {
                      backgroundColor: '#DDD',
                      borderWidth: 0,
                      outerRadius: '105%',
                      innerRadius: '103%'
                  }]
              },

              // the value axis
              yAxis: {
                  min: min,
                  max: max,

                  minorTickInterval: 'auto',
                  minorTickWidth: 1,
                  minorTickLength: 10,
                  minorTickPosition: 'inside',
                  minorTickColor: '#666',

                  tickPixelInterval: 30,
                  tickWidth: 2,
                  tickPosition: 'inside',
                  tickLength: 10,
                  tickColor: '#666',
                  labels: {
                      step: 2,
                      rotation: 'auto'
                  },
                  plotBands: [{
                      from: min,
                      to: range2,
                      color: '#DF5353' // red
                  }, {
                      from: range2,
                      to: range1,
                      color: '#DDDF0D' // yellow
                  }, {
                      from: range1,
                      to: max,
                      color: '#55BF3B' // green
                  }]
              },
              credits: {
                  enabled: false
              },
              title:{
              text: null
            },
              series: [{
                  name: 'Remaining amount to spend',
                  data: [currentBal],
                  tooltip: {
                      valuePrefix: 'SGD '
                  },
                  dataLabels: {
                  enabled: true,
                  style: {
                      fontWeight:'bold',
                      fontSize: '10px'
                  }
              }
              }]
            };
    HighCharts.chart(div, this.options)
  }



  displayColumnChart(div,dateCat,cat,sixMonthsExpensesData,catAmountPerMonth,catBudgetPerMonth){
    this.options = {
            chart: {
              type: 'column',
              width: this.platform.width()-30,
              events: {
                drilldown: function(e) {
                  var chart = this,
                    drilldowns = chart.userOptions.drilldown.series,
                    series = [];
                  e.preventDefault();
                  drilldowns.forEach(function (value) {
                    if (value.id.includes(e.point.name)) {
                        chart.addSingleSeriesAsDrilldown(e.point, value);
                      }
                  });
                  // HighCharts.each(drilldowns, function(p) {
                  //   console.log(p);
                  //   if (p.id.includes(e.point.name)) {
                  //     chart.addSingleSeriesAsDrilldown(e.point, p);
                  //   }
                  // })
                  chart.applyDrilldown();
                }
              }
            },
            title: {
              text: 'Monthly Expenses for past 6 months'
            },
            credits: {
                enabled: false
            },
            xAxis: {
              type: 'category'
            },
            yAxis: [{
              title: {
                text: 'Amount'
              }

            }],
            legend: {
              enabled: false
            },
            plotOptions: {
            column: {
                        grouping: false,
                        shadow: false,
                        borderWidth: 0
                    }
            },
            series: [{
              name: 'Monthly Expense',
              colorByPoint: true,
              tooltip: {
                  valuePrefix: 'SGD '
              },
              data: [{
                name: dateCat[0],
                y: sixMonthsExpensesData[0],
                drilldown: dateCat[0]
              }, {
                name: dateCat[1],
                y: sixMonthsExpensesData[1],
                drilldown: dateCat[1]
              }, {
                name: dateCat[2],
                y: sixMonthsExpensesData[2],
                drilldown: dateCat[2]
              }, {
                name: dateCat[3],
                y: sixMonthsExpensesData[3],
                drilldown: dateCat[3]
              }, {
                name: dateCat[4],
                y: sixMonthsExpensesData[4],
                drilldown: dateCat[4]
              }, {
                name: dateCat[5],
                y: sixMonthsExpensesData[5],
                drilldown: dateCat[5]
              }]
            }],
            drilldown: {
              series: [{
                name: 'Budget Limit',
                id: dateCat[0],
                type: 'column',
        		    color: 'rgba(165,170,217,1)',
        		    pointPadding: 0.2,
                tooltip: {
                    valuePrefix: 'SGD '
                },
                data: [
                  [cat[0], catBudgetPerMonth[0][0]],
                  [cat[1], catBudgetPerMonth[0][1]],
                  [cat[2], catBudgetPerMonth[0][2]],
                  [cat[3], catBudgetPerMonth[0][3]],
                  [cat[4], 0]
                ]
              }, {
                name: 'Expenses',
                id: dateCat[0],
                type: 'column',
        		    color: 'rgba(126,86,134,.9)',
        		    pointPadding: 0.3,
                tooltip: {
                    valuePrefix: 'SGD '
                },
                data: [
                  [cat[0], catAmountPerMonth[0][0]],
                  [cat[1], catAmountPerMonth[0][1]],
                  [cat[2], catAmountPerMonth[0][2]],
                  [cat[3], catAmountPerMonth[0][3]],
                  [cat[4], catAmountPerMonth[0][4]]
                ]
              },
              {
                name: 'Budget Limit',
                id: dateCat[1],
                type: 'column',
                color: 'rgba(165,170,217,1)',
                pointPadding: 0.2,
                tooltip: {
                    valuePrefix: 'SGD '
                },
                data: [
                  [cat[0], catBudgetPerMonth[1][0]],
                  [cat[1], catBudgetPerMonth[1][1]],
                  [cat[2], catBudgetPerMonth[1][2]],
                  [cat[3], catBudgetPerMonth[1][3]],
                  [cat[4], 0]
                ]
              }, {
                name: 'Expenses',
                id: dateCat[1],
                type: 'column',
                color: 'rgba(126,86,134,.9)',
                pointPadding: 0.3,
                tooltip: {
                    valuePrefix: 'SGD '
                },
                data: [
                  [cat[0], catAmountPerMonth[1][0]],
                  [cat[1], catAmountPerMonth[1][1]],
                  [cat[2], catAmountPerMonth[1][2]],
                  [cat[3], catAmountPerMonth[1][3]],
                  [cat[4], catAmountPerMonth[1][4]]
                ]
              },
              {
                name: 'Budget Limit',
                id: dateCat[2],
                type: 'column',
                color: 'rgba(165,170,217,1)',
                pointPadding: 0.2,
                tooltip: {
                    valuePrefix: 'SGD '
                },
                data: [
                  [cat[0], catBudgetPerMonth[2][0]],
                  [cat[1], catBudgetPerMonth[2][1]],
                  [cat[2], catBudgetPerMonth[2][2]],
                  [cat[3], catBudgetPerMonth[2][3]],
                  [cat[4], 0]
                ]
              }, {
                name: 'Expenses',
                id: dateCat[2],
                type: 'column',
                color: 'rgba(126,86,134,.9)',
                pointPadding: 0.3,
                tooltip: {
                    valuePrefix: 'SGD '
                },
                data: [
                  [cat[0], catAmountPerMonth[2][0]],
                  [cat[1], catAmountPerMonth[2][1]],
                  [cat[2], catAmountPerMonth[2][2]],
                  [cat[3], catAmountPerMonth[2][3]],
                  [cat[4], catAmountPerMonth[2][4]]
                ]
              },
              {
                name: 'Budget Limit',
                id: dateCat[3],
                type: 'column',
                color: 'rgba(165,170,217,1)',
                pointPadding: 0.2,
                tooltip: {
                    valuePrefix: 'SGD '
                },
                data: [
                  [cat[0], catBudgetPerMonth[3][0]],
                  [cat[1], catBudgetPerMonth[3][1]],
                  [cat[2], catBudgetPerMonth[3][2]],
                  [cat[3], catBudgetPerMonth[3][3]],
                  [cat[4], 0]
                ]
              }, {
                name: 'Expenses',
                id: dateCat[3],
                type: 'column',
                color: 'rgba(126,86,134,.9)',
                pointPadding: 0.3,
                tooltip: {
                    valuePrefix: 'SGD '
                },
                data: [
                  [cat[0], catAmountPerMonth[3][0]],
                  [cat[1], catAmountPerMonth[3][1]],
                  [cat[2], catAmountPerMonth[3][2]],
                  [cat[3], catAmountPerMonth[3][3]],
                  [cat[4], catAmountPerMonth[3][4]]
                ]
              },
              {
                name: 'Budget Limit',
                id: dateCat[4],
                type: 'column',
                color: 'rgba(165,170,217,1)',
                pointPadding: 0.2,
                tooltip: {
                    valuePrefix: 'SGD '
                },
                data: [
                  [cat[0], catBudgetPerMonth[4][0]],
                  [cat[1], catBudgetPerMonth[4][1]],
                  [cat[2], catBudgetPerMonth[4][2]],
                  [cat[3], catBudgetPerMonth[4][3]],
                  [cat[4], 0]
                ]
              }, {
                name: 'Expenses',
                id: dateCat[4],
                type: 'column',
                color: 'rgba(126,86,134,.9)',
                pointPadding: 0.3,
                tooltip: {
                    valuePrefix: 'SGD '
                },
                data: [
                  [cat[0], catAmountPerMonth[4][0]],
                  [cat[1], catAmountPerMonth[4][1]],
                  [cat[2], catAmountPerMonth[4][2]],
                  [cat[3], catAmountPerMonth[4][3]],
                  [cat[4], catAmountPerMonth[4][4]]
                ]
              },
              {
                name: 'Budget Limit',
                id: dateCat[5],
                type: 'column',
                color: 'rgba(165,170,217,1)',
                pointPadding: 0.2,
                tooltip: {
                    valuePrefix: 'SGD '
                },
                data: [
                  [cat[0], catBudgetPerMonth[5][0]],
                  [cat[1], catBudgetPerMonth[5][1]],
                  [cat[2], catBudgetPerMonth[5][2]],
                  [cat[3], catBudgetPerMonth[5][3]],
                  [cat[4], 0]
                ]
              }, {
                name: 'Expenses',
                id: dateCat[5],
                type: 'column',
                color: 'rgba(126,86,134,.9)',
                pointPadding: 0.3,
                tooltip: {
                    valuePrefix: 'SGD '
                },
                data: [
                  [cat[0], catAmountPerMonth[5][0]],
                  [cat[1], catAmountPerMonth[5][1]],
                  [cat[2], catAmountPerMonth[5][2]],
                  [cat[3], catAmountPerMonth[5][3]],
                  [cat[4], catAmountPerMonth[5][4]]
                ]
              }]
            }
          };

    var chart = new HighCharts.Chart(div, this.options);

  }




}
