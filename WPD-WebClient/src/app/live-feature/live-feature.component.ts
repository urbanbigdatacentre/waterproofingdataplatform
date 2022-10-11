import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'live-feature',
  templateUrl: './live-feature.component.html',
  styleUrls: ['./live-feature.component.css']
})
export class LiveFeatureComponent implements OnInit {

  liveFeature = null;
  featureAttributes = {}
  // chart params
  isPluvio = false;
  chartData: any[] = [];
  view: any[] = [600, 300];
  // chart options
  legend: boolean = false;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'DateTime';
  yAxisLabel: string = 'Pluviometer reading in mm';
  timeline: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public feature,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<LiveFeatureComponent>,
    private translate: TranslateService
    ) { 
      
      console.log('>>> LiveFeatureComponent >>> ', this.feature)
      if(this.feature.formcode === "PLUVIOMETER_FORM" || this.feature.formcode === "PLUVIOMETERS_OFFICIAL" ){
        this.chartData = [this.formatDataToChart(this.feature.fieldsAnswers, this.feature.formsanswersid, this.feature.formcode)]
        // Object.assign(this, { chartData });

        // console.log('this.chartData = ', this.chartData)
        if(this.chartData[0].series.length > 0) {
          this.isPluvio = true
        } else {
          console.log('No temporal data for ', this.chartData[0].name)
        }
      }

      this.featureAttributes = this.getFeatureAttributes(this.feature.fieldsAnswers)

  }

  ngOnInit() {
    
    
  }

  onCloseClick() {
    this.dialogRef.close();
  }

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  onSelect(data): void {
    // console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    // console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    // console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  /**
   * Prepares data required to display chart using chart.js 
   * 
   * @param fieldsAnswers 
   * @param id 
   * @param formCode 
   */
  formatDataToChart(fieldsAnswers, id, formCode): any {
    /* 
    sample data of one line
    {
      "name": "UK",
      "series": [
        {
          "name": "1990",
          "value": 57000000
        },
        {
          "name": "2010",
          "value": 62000000
        }
      ]
    } */

    // console.log('>>> formatDataToChart ', fieldsAnswers)
    let returnChartData = {
      "name": `${formCode} : ${id}`,
      "series": []
    }

    // field "medicao" or field number 46 is the column/field for pluviometer readings
    // remove all null data as chart will fail
    fieldsAnswers = fieldsAnswers.filter( f => {
      return f.fieldsanswersfieldsid === 46 && f.fieldsanswersvalue !== null
    })
    // console.log('>>> formatDataToChart ', fieldsAnswers)

    let tempSeries = fieldsAnswers.map( f => {
      return {
        "name": new Date(f.fieldsanswersdtfilling),
        "value": Number.parseFloat(f.fieldsanswersvalue)
      }
    })

    // console.log('tempSeries = ', tempSeries)
    returnChartData.series = tempSeries
    return returnChartData
  }

  /**
   * Filters out attributes which need not be displayed 
   * Eg: Pluviometer reading i.e fieldsanswersfieldsid === 46, latitude, longitude, etc
   * 
   * @param fieldsAnswers 
   */
  getFeatureAttributes(fieldsAnswers): Array<any> {

    // console.log('fieldsAnswers = ', fieldsAnswers)
    // capitalise fieldname for translation
    fieldsAnswers.forEach( f => {
      f.fieldlabel = this.translate.instant(`LIVEFEATURE.${f.fieldname.toUpperCase()}`)
    })

    let returnAttr = fieldsAnswers.filter( f => {
      return (
        f.fieldsanswersvalue !== null
        && !( f.fieldsanswersfieldsid === 46
            || f.fieldname === 'latitude'
            || f.fieldname === 'longitude'
          )
      )
    })

    // console.log('returnAttr = ', returnAttr)
    return returnAttr
  }

}
