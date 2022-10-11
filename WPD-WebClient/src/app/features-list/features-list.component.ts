import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { LiveFeatureComponent } from '../live-feature/live-feature.component';
import { LiveService } from '../shared/live.service';
import { WSResponsetype } from '../shared/WSResponseType';
import { AlertService } from '../shared/alert.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'features-list',
  templateUrl: './features-list.component.html',
  styleUrls: ['./features-list.component.css']
})
export class FeaturesListComponent implements OnInit {

  @Input() features: any;

  constructor(
    private dialog: MatDialog,
    private liveService: LiveService,
    private alertService: AlertService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    // console.log('>>> FeaturesListComponent >>> ', this.features)

    this.features = this.features.map( f => f.properties )

    // console.log('this.features = ', this.features)
  }

  showFeatureDetail(feature) {
    // console.log('>>> showFeatureDetail ', feature)
    let tempSub = this.liveService.getFieldsAnswers(feature)

    if(tempSub)
    tempSub.subscribe( (res: WSResponsetype) => {
      if(!res.responseData.array_to_json) {
        this.alertService.error(this.translate.instant('MAP.NO_DATA'));
        console.error('res was empty ', res.responseData)
        return
      }
      // res will always return single feature's fieldsanswers 
      // console.log('>>> response from getFieldsAnswers ', res.responseData.array_to_json[0])
      // flatten the response data

      let liveFeature: any = {};
      // console.log(res.responseData.array_to_json[0].formcode)
      liveFeature.formcode = res.responseData.array_to_json[0].formcode
      liveFeature.formcode_title = this.generateNicerLayerTitle(liveFeature.formcode)
      liveFeature.formsanswersgeom = res.responseData.array_to_json[0].formsanswersgeom
      liveFeature.formsanswersid = res.responseData.array_to_json[0].formsanswersid
      liveFeature.fieldsAnswers = res.responseData.array_to_json[0].array_to_json

      // console.log('liveFeature = ', liveFeature)

      const dialogRef = this.dialog.open(LiveFeatureComponent, {
        width: '650px',
        data: liveFeature
      });
  
      dialogRef.afterClosed().subscribe(result => {
        // console.log('>>> MapComponent >>> afterDialogClosed ', result)
      });
    })
  }

  /**
   * Generate nicer label for display of formcode
   * 
   * @param formcode 
   */
  generateNicerLayerTitle(formcode) {
    // console.log('>>> generateNicerLayerTitle ', formcode)
    let title = formcode.replace("_", " ");

    title = title.toLowerCase().split(' ').map(function(word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');

    // title = title.replace("Form", "");
    // title = title.replace("Official", "");

    return title
  }

}
