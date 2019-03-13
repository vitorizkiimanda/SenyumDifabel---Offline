import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { SuperTabsController } from 'ionic2-super-tabs';
import { ProfileOtherPage } from '../profile-other/profile-other';
import { CommentPage } from '../comment/comment';
import 'rxjs/add/operator/timeout';
import { Data } from '../../providers/data';
import { Http, Headers } from '@angular/http';


@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {

  loading:any;
  user_id:any;
  user_email:any;

  notifications:any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private data : Data,
    public loadCtrl: LoadingController,
    public http: Http,
    public alertCtrl: AlertController,
    private superTabsCtrl: SuperTabsController) {

      
    this.data.getData().then((data) => {
      this.user_id = data.user_id;
      this.user_email = data.user_email;
      console.log(this.user_id);
      this.getNotif(this.user_id);
    })
  }

  ionViewWillEnter() {
    this.superTabsCtrl.enableTabsSwipe(false);
    this.superTabsCtrl.showToolbar(false);
  }

  ionViewWillLeave(){
    this.superTabsCtrl.showToolbar(true);
    this.superTabsCtrl.enableTabsSwipe(true);
  }

  openProfile(data){
    data.origin ="notification";
    this.navCtrl.push(ProfileOtherPage,data);
  }

  follow(dataUser){
    // this.loading = this.loadCtrl.create({
    //   content: 'Please wait...'
    // });
    // this.loading.present();
    
    let input = {
      user_id: this.user_id,
      follow: dataUser.forward_id
    };

    console.log(input)

    
    this.data.getOriginalPassword().then((password) =>{
      let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
      this.http.post(this.data.BASE_URL+"auth/following",input,{ headers: headers }).timeout(5000).subscribe(data => {
        let response = data.json();
        console.log(response);
        // this.notifications = null;
        this.getNotif(this.user_id);
        this.postFollowNotification(dataUser)
        this.loading.dismiss();
      }, err => {     
        console.log("error cui :",err);
        this.runTimeError();
        // this.loading.dismiss();      
      }); 
    });
  }

  postFollowNotification(dataUser){
    let input = {
      user_id : dataUser.user_idForeign,
      data_id : this.user_id,
      data_id2: 1
    };
    
    this.data.getOriginalPassword().then((password) =>{
      let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
      this.http.post(this.data.BASE_URL+"auth/pushNotification/follow",input,{ headers: headers }).timeout(5000).subscribe(data => {
        let response = data.json();
        console.log(response);
        // this.getComments();
        
      }, err => {     
        console.log("error cui :",err);
        this.runTimeError();
          
      }); 
    });
  }

  unfollow(dataNotif){
    let prompt = this.alertCtrl.create({
      subTitle:"Unfollow NamaOrangnya?",
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            // this.deleteJob(dataJob);
          }
        },
        {
          text: 'Unfollow',
          handler: data => {
            // this.loading = this.loadCtrl.create({
            //   content: 'Please wait...'
            // });
            // this.loading.present();

            let input = {
              param1: this.user_id,
              param2: dataNotif.forward_id
            };
            
            this.data.getOriginalPassword().then((password) =>{
              let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
              this.http.post(this.data.BASE_URL+"auth/deleteFollowing/", input, { headers: headers }).timeout(5000).subscribe(data => {
                let response = data.json();
                console.log(response);
                // this.notifications = null;
                this.getNotif(this.user_id);
                // this.loading.dismiss();
              }, err => {     
                console.log("error cui :",err);
                this.runTimeError();
                // this.loading.dismiss();      
              }); 
            });
          }
        }
      ]
    });
    prompt.present();
  }

  openPost(data){
    data.origin = "notifications";
    console.log(data)
    this.navCtrl.push(CommentPage, data);
  }

  getNotif(data){

    this.loading = this.loadCtrl.create({
        content: 'Please wait...'
    });

    this.loading.present();
    
    this.data.getOriginalPassword().then((password) =>{
      let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
      this.http.get(this.data.BASE_URL+"auth/getNotification/"+data,{ headers: headers }).timeout(5000).subscribe(data => {
        let response = data.json();
        console.log(response);
        // alert(response)
        this.notifications = response.reverse();
        this.loading.dismiss();
        for(let data of this.notifications){
          if(data.enable == true ) console.log("123")
        }

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
