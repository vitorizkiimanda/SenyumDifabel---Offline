import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { SuperTabsController } from 'ionic2-super-tabs';
import { JobApplyPage } from '../job-apply/job-apply';
import { Data } from '../../providers/data';
import { Http, RequestOptions, Headers  } from '@angular/http';

@Component({
  selector: 'page-job-detail',
  templateUrl: 'job-detail.html',
})
export class JobDetailPage {

  bookmark:boolean = false;

  user_id: any;
  jobs: any;

  company_name: any;
  name: any;
  date: any;
  description: any;

  jobData:any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl: ToastController,
    private data: Data,
    public http: Http,    
    private superTabsCtrl: SuperTabsController) {      
  }


  ionViewWillEnter() {
    this.superTabsCtrl.enableTabsSwipe(false);
    this.superTabsCtrl.showToolbar(false);

    let temp = this.navParams.data;      
    this.jobData = temp;
    
    this.company_name = temp.company_name;
    this.name = temp.name;
    this.date = temp.date;
    this.description = temp.description;

    console.log(temp);

    this.data.getData().then((data) =>{
      this.user_id = data.user_id;
      console.log(data);
    })
  }

  ionViewWillLeave(){
    this.superTabsCtrl.showToolbar(true);
    this.superTabsCtrl.enableTabsSwipe(true);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JobDetailPage');
  }
  

  changeBookmark(){
    // ini nnti kao udah berhasil bookmark ada snackbarnya gitu 
    if(this.bookmark == false){
      this.bookmark = true;
      let toast = this.toastCtrl.create({
        message: 'Bookmark success',
        duration: 3000,
        showCloseButton: true,
        closeButtonText: 'Ok'
      });
      toast.present();
    }
    else{
      this.bookmark = false;
      let toast = this.toastCtrl.create({
        message: 'Remove bookmark success',
        showCloseButton: true,
        closeButtonText: 'Ok',
        duration: 3000
      });
      toast.present();
    }
  }

  apply(){
    console.log("data apply mau kirim", this.jobData);
    this.navCtrl.push(JobApplyPage, this.jobData );
  }

}