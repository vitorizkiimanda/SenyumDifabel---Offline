import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { JobDetailPage } from '../job-detail/job-detail';
import { InterviewPage } from '../interview/interview';
import { JobExtendedPage } from '../job-extended/job-extended';
import { Data } from '../../providers/data';
import { Http, RequestOptions, Headers  } from '@angular/http';
import { LoginPage } from '../login/login';
import { SuperTabsController } from 'ionic2-super-tabs';
import { TabsPage } from '../tabs/tabs';


@Component({
  selector: 'page-jobs',
  templateUrl: 'jobs.html',
})
export class JobsPage {

  bookmark: any;
  jobs:any;
  list_search: any;
  statusSearch : boolean = false;

  user_id: any;
  loading: any;  

  saved: any;
  applied: any;
  interview: any;
  user_email:any;  
  job_id: any;
  flag_bookmark: any;
  

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl: ToastController,
    private data: Data,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public loadCtrl: LoadingController,    
    public http: Http) {
      let temp = this.navParams.data;      
  }

  ionViewWillEnter() {
    console.log('ionViewDidLoad ProfilePage');
    this.data.getData().then((data) =>{
      this.user_id = data.user_id;
      this.job_id = data.job_id;
      this.user_email = data.user_email;
      console.log(data);
    
      this.countJob(this.user_id);
      this.getJobs(this.user_id);
    })    
  }

  countJob(data){
    this.data.getOriginalPassword().then((password) =>{
      console.log(password);
      let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
      this.http.get(this.data.BASE_URL+"auth/countJob/"+data,{ headers: headers }).subscribe(data => {
        let response = data.json();
        console.log(response);
        this.saved = response.saved;
        this.applied = response.applied;
        this.interview = response.interview;
        // alert(response)
      }, err => {     
        console.log("error cui :",err);
        
      });
    })
  }

  getJobs(data){
    let headers = new Headers({'Authorization':'Basic ' +  btoa('vitovito@gmail.com' + ':' +'vitovito') });
    this.http.get(this.data.BASE_URL+"auth/getjobs/"+data,{ headers: headers }).subscribe(data => {
        let response = data.json();
        console.log(response);
        this.jobs = response;
        // alert(response)
      }, err => {     
        console.log("error cui :",err);
        
      });
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

      this.data.getOriginalPassword().then((password) =>{
        console.log(password);
        let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });  
        this.http.post(this.data.BASE_URL+"auth/addBookmark", input,{ headers: headers }).timeout(5000).subscribe(data => {
        let response = data.json();
        console.log(response);
        this.getJobs(this.user_id);
        this.countJob(this.user_id);
        this.loading.dismiss();

        }, err => {     
          this.loading.dismiss();
          this.runTimeError();
          
        });      
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

      this.data.getOriginalPassword().then((password) =>{
        console.log(password);
        let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
        this.http.post(this.data.BASE_URL+"auth/deleteBookmark",input,{ headers: headers }).timeout(5000).subscribe(data => {
        let response = data.json();
        console.log(response);
        this.getJobs(this.user_id);
        this.countJob(this.user_id);
        this.loading.dismiss();

        }, err => {     
          this.loading.dismiss();
          this.runTimeError();
          
        });      
      });
    }
  }

  openJobDetail(data){
    this.navCtrl.push(JobDetailPage, data);
  }

  openInterview(){
    this.navCtrl.push(InterviewPage);
  }

  open(data){
    this.navCtrl.push(JobExtendedPage, data);
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


  //Fungsi Searchbar
  getItems(ev) {
    this.statusSearch=true;

    // Reset items back to all of the items
    this.list_search = this.jobs;

    console.log('list:'+this.list_search);

    // set val to the value of the ev target
    var val = ev.target.value;
    console.log(val);

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      // this.list_search = this.list_search.filter((item) => {
      //   return (item.data.toLowerCase().indexOf(val.toLowerCase()) > -1);
      // })


      // this.list_search = this.list_search.filter((data) => {
      //   return ((data.nama_undangan.toLowerCase().indexOf(val.toLowerCase()) > -1) || (data.oleh_undangan.toLowerCase().indexOf(val.toLowerCase()) > -1));
      // })
    }
    else {
      this.statusSearch=false;
      // this.getInvitation();
    }

    console.log(this.list_search);
    console.log("search="+this.statusSearch);
  }
  //Fungsi Searchbar^^^^^

}