import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { SuperTabsController } from 'ionic2-super-tabs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'page-cv',
  templateUrl: 'cv.html',
})
export class CvPage {

  url:any;
  loading: any;

  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
     public loadingCtrl: LoadingController,
     private sanitizer: DomSanitizer,
     public alertCtrl: AlertController,
     private superTabsCtrl: SuperTabsController) {
  }

  ionViewWillEnter() {
    this.url = 'https://drive.google.com/file/d/1yPqWPRolr1TMCnk8XJjA2bRM6EWQdxaC/preview';
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);

    this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
    });

    this.loading.present();

    
    this.superTabsCtrl.enableTabsSwipe(false);
    this.superTabsCtrl.showToolbar(false);
  }

  ionViewWillLeave(){
    this.superTabsCtrl.showToolbar(true);
    this.superTabsCtrl.enableTabsSwipe(true);
  }

  option(){
    let prompt = this.alertCtrl.create({
      subTitle:"namaCV.pdf",
      buttons: [
        {
          text: 'Delete',
          handler: data => {
            // this.deleteJob(dataJob);
          }
        },
        {
          text: 'Update',
          handler: data => {
            // this.navCtrl.push(EditJobPage, dataJob);
          }
        }
      ]
    });
    prompt.present();
  }


  handleIFrameLoadEvent(): void {
    this.loading.dismiss();
  }

}
