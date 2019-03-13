import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { SuperTabsController } from 'ionic2-super-tabs';
import { AboutPage } from '../about/about';
import { FollowPage } from '../follow/follow';
import { MessagePersonalPage } from '../message-personal/message-personal';
import { Data } from '../../providers/data';
import { Http, Headers } from '@angular/http';
import { MessagingPage } from '../messaging/messaging';

@Component({
  selector: 'page-profile-other',
  templateUrl: 'profile-other.html',
})
export class ProfileOtherPage {

  statusFollow : boolean = true;
  user_id:any;
  user_idForeign:any;
  user_email:any;

  user:any;

  loading:any;

  bio:any;
  name:any;
  address:any;
  user_photo:any;
  job:any;

  follower:any;
  following:any;

  experiences:any;
  educations:any;
  contacts:any;
  achievements:any;
  skills:any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private data : Data,
    public http: Http,
    public loadCtrl: LoadingController,
    private superTabsCtrl: SuperTabsController,
    public alertCtrl: AlertController) {

      this.data.getData().then((data) => {
        this.user_id = data.user_id;
        this.user_email = data.user_email;
        console.log(this.user_id);
      })
  }

  ionViewWillEnter() {
    this.superTabsCtrl.enableTabsSwipe(false);
    this.superTabsCtrl.showToolbar(false);

    let temp = this.navParams.data;
    if(temp.origin=="notification") temp.user_id = temp.data_id;
    this.getuserData(temp.user_id);
    this.countFollow(temp.user_id);
    this.checkFollow(temp.user_id);
  }

  getuserData(data){

    this.loading = this.loadCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();

    this.data.getOriginalPassword().then((password) =>{
      console.log(password);
      let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
      this.http.get(this.data.BASE_URL+"auth/getuser/"+data,{ headers: headers }).timeout(5000).subscribe(data => {
        let response = data.json();
        console.log(response);
        // alert(response)
        this.user = response;
        this.user_idForeign = response.user_id;
        this.user_photo = response.user_photo;
        this.name = response.user_name;
        this.address = response.user_address;
        this.bio = response.user_contact;
        this.job = response.user_job;

        this.experiences=response.experiences;
        this.educations=response.educations;
        this.contacts=response.contacts;
        this.achievements=response.achievements;
        this.skills=response.skills;
        this.loading.dismiss();
      }, err => {     
        console.log("error cui :",err);
        this.runTimeError();
        this.loading.dismiss();
      });
    })
  }

  countFollow(data){
    
    this.data.getOriginalPassword().then((password) =>{
      console.log(password);
      let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
      this.http.get(this.data.BASE_URL+"auth/countFollow/"+data,{ headers: headers }).subscribe(data => {
        let response = data.json();
        console.log(response);
        this.follower=response.follower;
        this.following=response.following;
        // alert(response)
      }, err => {     
        console.log("error cui :",err);
        
      });
    }) 
  }

  checkFollow(data){
    this.statusFollow = true;
    
    this.data.getOriginalPassword().then((password) =>{
      console.log(password);
      let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
      this.http.get(this.data.BASE_URL+"auth/getFollower/"+data,{ headers: headers }).subscribe(data => {
        let response = data.json();
        console.log("follower",response);
        for(let data of response){
          if(data.user_id==this.user_id) this.statusFollow= false;
        }
      }, err => {     
        console.log("error cui :",err);
        
      });
    }) 
  }

  runTimeError(){
    let alert = this.alertCtrl.create({
      title: 'Failed',
      subTitle: 'Please try again',      
    });
    alert.present();
  }

  ionViewWillLeave(){
    this.superTabsCtrl.showToolbar(true);
    this.superTabsCtrl.enableTabsSwipe(true);
  }
  
  open(origin){
    let data = this.user;
    data.root = "other";
    data.origin = origin;
    this.navCtrl.push(FollowPage, data);
  }

  openMessage(){
    this.navCtrl.push(MessagingPage);
  }

  follow(){
    
    let input = {
      user_id: this.user_id,
      follow: this.user_idForeign
    };
    this.data.getOriginalPassword().then((password) =>{
      let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
      this.http.post(this.data.BASE_URL+"auth/following",input,{ headers: headers }).timeout(5000).subscribe(data => {
        let response = data.json();
        console.log(response);
        // this.notifications = null;
        this.checkFollow(this.user_idForeign);
        this.countFollow(this.user_idForeign);
        this.postFollowNotification();
        this.loading.dismiss();
      }, err => {     
        console.log("error cui :",err);
        this.runTimeError();
        // this.loading.dismiss();      
      }); 
    });
  }

  unfollow(){
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
            let input = {
              param1: this.user_id,
              param2: this.user_idForeign
            };
            this.data.getOriginalPassword().then((password) =>{
              let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
              this.http.post(this.data.BASE_URL+"auth/deleteFollowing",input,{ headers: headers }).timeout(5000).subscribe(data => {
                let response = data.json();
                console.log(response);
                // this.notifications = null;
                this.checkFollow(this.user_idForeign);
                this.countFollow(this.user_idForeign);
                this.loading.dismiss();
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

  detailExperience(data){
    let detail = this.alertCtrl.create({
      title: data.title,
      subTitle:data.description +"<br>" + data.year,
      buttons: [
        {
          text: 'Close',
          handler: data => {}
        }
      ]
    });
    detail.present();
  }

  detailEducation(data){
    let detail = this.alertCtrl.create({
      title: data.school,
      subTitle:data.major +"<br>" + data.year,
      buttons: [
        {
          text: 'Close',
          handler: data => {}
        }
      ]
    });
    detail.present();
  }

  detailSkill(data){
    let detail = this.alertCtrl.create({
      title: data.skill,
      buttons: [
        {
          text: 'Close',
          handler: data => {}
        }
      ]
    });
    detail.present();
  }

  detailAchivement(data){
    let detail = this.alertCtrl.create({
      title: data.achivement,
      subTitle:data.form +"<br>" + data.year,
      buttons: [
        {
          text: 'Close',
          handler: data => {}
        }
      ]
    });
    detail.present();
  }

  detailContact(data){
    let detail = this.alertCtrl.create({
      title: data.contact,
      subTitle:data.form,
      buttons: [
        {
          text: 'Close',
          handler: data => {}
        }
      ]
    });
    detail.present();
  }

  postFollowNotification(){
    let input = {
      user_id : this.user_idForeign,
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

}
