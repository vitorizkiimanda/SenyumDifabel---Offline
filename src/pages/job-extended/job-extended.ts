import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { SuperTabsController } from 'ionic2-super-tabs';
import { Data } from '../../providers/data';
import { Http, RequestOptions, Headers  } from '@angular/http';
import { JobDetailPage } from '../job-detail/job-detail';
import { LoginPage } from '../login/login';
import { TabsPage } from '../tabs/tabs';




@Component({
  selector: 'page-job-extended',
  templateUrl: 'job-extended.html',
})
export class JobExtendedPage {

  choosed:any;
  bookmark: any;
  user_email: any;
  password: any;

  user_id: any;
  job_id: any;
  applies: any;
  saves: any;
  attendies: any;

  loading: any;  
  flag_bookmark: any;

  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private superTabsCtrl: SuperTabsController,
    private data: Data,
    public http: Http,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public loadCtrl: LoadingController,    
    public toastCtrl: ToastController) {
      
    let temp = this.navParams.data;
    this.choosed = temp;          
  }
  
  ionViewWillEnter() {
    this.superTabsCtrl.enableTabsSwipe(false);
    this.superTabsCtrl.showToolbar(false);

    this.data.getData().then((data) =>{
      this.user_id = data.user_id;
      this.job_id = data.job_id;      
      console.log(this.user_id);

      if(this.choosed=="saved") this.getBookmark(this.user_id);
      else if(this.choosed=="applied") this.getApplied(this.user_id);        
      else if(this.choosed=="attended") this.getAttended(this.user_id);        
    })
  }

  ionViewWillLeave(){
    this.superTabsCtrl.showToolbar(true);
    this.superTabsCtrl.enableTabsSwipe(true);
  }

  getBookmark(data){
    let headers = new Headers({'Authorization':'Basic ' +  btoa('vitovito@gmail.com' + ':' +'vitovito') });
    this.http.get(this.data.BASE_URL+"auth/getBookmark/"+data,{ headers: headers }).subscribe(data => {
      let response = data.json();
      console.log(response);
      this.saves = response;
      // alert(response)
    }, err => {     
      console.log("error cui :",err);
      
    });
  }

  getApplied(data){
    let headers = new Headers({'Authorization':'Basic ' +  btoa('vitovito@gmail.com' + ':' +'vitovito') });
    this.http.get(this.data.BASE_URL+"auth/getApplied/"+data,{ headers: headers }).subscribe(data => {
      let response = data.json();
      console.log(response);
      this.applies = response;
      // alert(response)
    }, err => {     
      console.log("error cui :",err);
      
    });
  }

  getAttended(data){
    let headers = new Headers({'Authorization':'Basic ' +  btoa('vitovito@gmail.com' + ':' +'vitovito') });
    this.http.get(this.data.BASE_URL+"auth/getInterview/"+data,{ headers: headers }).subscribe(data => {
      let response = data.json();
      console.log(response);
      this.attendies = response;
      // alert(response)
    }, err => {     
      console.log("error cui :",err);
      
    });
  }

  openJobDetail(data){
    this.navCtrl.push(JobDetailPage, data);
  }

  changeBookmark(data){
    // ini nnti kao udah berhasil bookmark ada snackbarnya gitu 
    if(data.flag_bookmark == 0){

      let toast = this.toastCtrl.create({
        message: 'Bookmark success',
        duration: 3000,
        showCloseButton: true,
        closeButtonText: 'Ok'
      });
      toast.present();

      this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });

      this.loading.present();

      let input = {
        user_id: this.user_id, 
        job_id: data.job_id,
      };

      let headers = new Headers({'Authorization':'Basic ' +  btoa('vitovito@gmail.com' + ':' +'vitovito') });
      this.http.post(this.data.BASE_URL+"auth/addBookmark", input,{ headers: headers }).timeout(5000).subscribe(data => {
        let response = data.json();
        this.getBookmark(this.user_id); 
        this.getApplied(this.user_id);       
        this.getAttended(this.user_id);       
        console.log(response);
        this.loading.dismiss();

        }, err => {     
          this.loading.dismiss();
          this.runTimeError();
          
        });      
    }
    else{
      let toast = this.toastCtrl.create({
        message: 'Remove bookmark success',
        showCloseButton: true,
        closeButtonText: 'Ok',
        duration: 3000
      });
      toast.present();

      this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });

      this.loading.present();

      let input = {
        param1: this.user_id, 
        param2: data.job_id,
      };

      console.log("remove",input)

      let headers = new Headers({'Authorization':'Basic ' +  btoa('vitovito@gmail.com' + ':' +'vitovito') });
      this.http.post(this.data.BASE_URL+"auth/deleteBookmark",input,{ headers: headers }).timeout(5000).subscribe(data => {
        let response = data.json();
        this.getBookmark(this.user_id); 
        this.getApplied(this.user_id);       
        this.getAttended(this.user_id);       
        console.log(response);
        this.loading.dismiss();

        }, err => {     
          this.loading.dismiss();
          this.runTimeError();
          
        });      
    }
  }

  runTimeError(){
    let alert = this.alertCtrl.create({
      title: 'Failed',
      subTitle: 'Please try again',      
      buttons: [
        {
          text: 'Refresh',
          handler: data => {
            this.changeBookmark(data);
          }
        }
      ]
    });
    alert.present();
  }
  
}