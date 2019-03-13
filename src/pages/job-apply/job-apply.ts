import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { SuperTabsController } from 'ionic2-super-tabs';
import { CvPage } from '../cv/cv';
import { Data } from '../../providers/data';
import { Http, RequestOptions, Headers  } from '@angular/http';

@Component({
  selector: 'page-job-apply',
  templateUrl: 'job-apply.html',
})
export class JobApplyPage {

  user_id: any;
  user_email: any;
  user_photo:any;
  user_address:any;
  user_job:any;
  apply: any;

  job_id:any;
  company_id :any;

  loading:any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadCtrl: LoadingController,
    private data: Data,
    public http: Http,
    private superTabsCtrl: SuperTabsController) {
  }


  ionViewWillEnter() {
    this.superTabsCtrl.enableTabsSwipe(false);
    this.superTabsCtrl.showToolbar(false);

    
    let temp = this.navParams.data;    
    this.job_id =  temp.job_id;
    this.company_id = temp.company_id;
    console.log("apply", temp)


    this.data.getData().then((data) =>{
      console.log(data);
      this.user_email = data.user_email;
      this.user_address = data.user_address;
      this.user_id = data.user_id;
      this.user_job = data.user_job;
      this.user_photo = data.user_photo

    })
  }

  ionViewWillLeave(){
    this.superTabsCtrl.showToolbar(true);
    this.superTabsCtrl.enableTabsSwipe(true);
  }


  openCV(){
    this.navCtrl.push(CvPage);
  }

  postApply(){

    this.loading = this.loadCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();

    let input = {
      status: 1, 
      user_id: this.user_id,
      job_id: this.job_id,
      company_id: this.company_id ,
    };

    console.log(input)

    
    this.data.getOriginalPassword().then((password) =>{
      let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
      this.http.post(this.data.BASE_URL+"auth/addProposal",input,{ headers: headers }).timeout(5000).subscribe(data => {
        let response = data.json();
        console.log(response);
        this.navCtrl.pop();
        this.navCtrl.pop();
        this.loading.dismiss();
      }, err => {     
        console.log("error cui :",err);
        this.runTimeError();
        this.loading.dismiss();
      }); 
    });
  }

  runTimeError(){
    let alert = this.alertCtrl.create({
      title: 'Failed',
      subTitle: 'Please try again',      
    });
    alert.present();
  }

}
