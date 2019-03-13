import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { SuperTabsController } from 'ionic2-super-tabs';
import { Data } from '../../providers/data';
import { Http, Headers } from '@angular/http';
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  selector: 'page-comment',
  templateUrl: 'comment.html',
})
export class CommentPage {
  dateNow : any = new Date().toISOString();
  timeNow: any = new Date().toLocaleTimeString();

  loading:any;
  
  user_id:any;
  user_email:any;
  user_name:any;
  user_photo:any;

  timeline_date:any;
  timeline_description:any;
  timeline_time:any;
  timeline_photo:any;
  timeline_user_id:any;
  timeline_id:any;

  counterLike:any;
  counterComments:any;

  likes:any;
  comments:any;
  message:any;
  temp:any;

  allowLike:any;


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private data : Data,
    private socialSharing: SocialSharing,
    public loadCtrl: LoadingController,
    public http: Http,
    public alertCtrl: AlertController,
    private superTabsCtrl: SuperTabsController) {     

  }

  ionViewWillEnter() {
    this.superTabsCtrl.enableTabsSwipe(false);
    this.superTabsCtrl.showToolbar(false);

    this.temp = this.navParams.data;
    
    this.data.getData().then((data) => {
      this.user_id = data.user_id;
      this.user_email = data.user_email;
      console.log(this.user_id);

      if(this.temp.origin=="notifications"){
        this.timeline_id = this.temp.forward_id;
        this.getPostData();
        this.getComments();
        this.getLikes();
      }
      else if(this.temp.origin=="home"){
        console.log(this.temp)
        
        this.user_name = this.temp.user_name;
        this.user_photo = this.temp.user_photo;
        this.timeline_date = this.temp.timeline_date;
        this.timeline_description = this.temp.timeline_description;
        this.timeline_time = this.temp.timeline_time;
        this.timeline_photo = this.temp.timeline_photo;
        this.timeline_user_id = this.temp.user_id;
        this.timeline_description = this.temp.timeline_description;
        this.counterComments =  this.temp.comments;
        this.counterLike = this.temp.like;

        this.timeline_id = this.temp.timeline_id;
        this.getComments();
        this.getLikes();
      }

    })    
  }

  ionViewWillLeave(){
    this.superTabsCtrl.showToolbar(true);
    this.superTabsCtrl.enableTabsSwipe(true);
  }

  getPostData(){
    
    this.data.getOriginalPassword().then((password) =>{
      let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
      this.http.get(this.data.BASE_URL+"auth/getTimeline/"+this.timeline_id,{ headers: headers }).timeout(5000).subscribe(data => {
        let response = data.json();
        console.log(response);
        this.user_name = response.user_name;
        this.user_photo = response.user_photo;
        this.timeline_date = response.timeline_date;
        this.timeline_description = response.timeline_description;
        this.timeline_time = response.timeline_time;
        this.timeline_photo = response.timeline_photo;
        this.timeline_user_id = response.user_id;
        this.timeline_description = response.timeline_description;
        this.counterComments =  response.comments;
        this.counterLike = response.like;
        // alert(response)

      }, err => {     
        console.log("error cui :",err);
        this.runTimeError();
      });
    });
  }

  getComments(){
    this.data.getOriginalPassword().then((password) =>{
      let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
      this.http.get(this.data.BASE_URL+"auth/getComments/"+this.timeline_id,{ headers: headers }).timeout(5000).subscribe(data => {
        let response = data.json();
        console.log(response);
        this.comments = response.reverse();

      }, err => {     
        console.log("error cui :",err);
        this.runTimeError();
      });
    });
  }

  getLikes(){
    this.data.getOriginalPassword().then((password) =>{
      let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
      this.http.get(this.data.BASE_URL+"auth/getLikes/"+this.timeline_id,{ headers: headers }).timeout(5000).subscribe(data => {
        let response = data.json();
        console.log(response);
        this.likes = response;

        this.allowLike = true;

        for(let like of this.likes){
          if(like.user_id == this.user_id ) this.allowLike = false;
        }

      }, err => {     
        console.log("error cui :",err);
        this.runTimeError();
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

  share(){
    let loading = this.loadCtrl.create({
      content: 'berbagi..'
    });


    loading.present();
    
    setTimeout(() => {
      loading.dismiss();
    }, 5000);
    

    // this.socialSharing.share(data.name, data.user, "http://156.67.218.250:81"+data.picture, data.youtube)
    this.socialSharing.share(this.timeline_description, null,null , null);

  }

  sendChat(keyCode){

    let regex = /^[\r\n/\s/g]*$/;

    if(keyCode == 13 && (regex.test(this.message) == false) && this.message!=null){
      // alert(this.message);
      this.postChat(this.message);
      this.message=null;
      console.log(keyCode);
      
      console.log(this.message);
    }
    else if(keyCode != 13 && (regex.test(this.message) == false)){
      
    }
    else{
      this.message=null;
    }
  }

  postChat(data){
    this.loading = this.loadCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
    
    this.dateNow = String(this.dateNow).substr(0,10);

    let input = {
      user_id : this.user_id,
      timeline_id : this.timeline_id,
      time: this.timeNow,
      date: this.dateNow,
      comment: data,
    };

    console.log("comment:", input)

    
    this.data.getOriginalPassword().then((password) =>{
      let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
      this.http.post(this.data.BASE_URL+"auth/addComment",input,{ headers: headers }).timeout(5000).subscribe(data => {
        let response = data.json();
        console.log(response);
        this.getComments();
        this.loading.dismiss();
      }, err => {     
        console.log("error cui :",err);
        this.runTimeError();
        this.loading.dismiss();      
      }); 
    });

    if(this.user_id != this.timeline_user_id) this.postCommentNotification();

  }

  postCommentNotification(){
    let input = {
      user_id : this.timeline_user_id,
      data_id : this.user_id,
      data_id2: this.timeline_id
    };
    
    this.data.getOriginalPassword().then((password) =>{
      let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
      this.http.post(this.data.BASE_URL+"auth/pushNotification/comment",input,{ headers: headers }).timeout(5000).subscribe(data => {
        let response = data.json();
        console.log(response);
        this.getComments();
        
      }, err => {     
        console.log("error cui :",err);
        this.runTimeError();
          
      }); 
    });
  }

  addLike(){
    let input = {
      user_id : this.user_id,
      timeline_id: this.timeline_id
    };

    if(this.allowLike){  
      this.data.getOriginalPassword().then((password) =>{
        let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
        this.http.post(this.data.BASE_URL+"auth/addLikes",input,{ headers: headers }).timeout(5000).subscribe(data => {
          let response = data.json();
          console.log(response);
          this.getLikes();
          this.getPostData();        
        }, err => {     
          console.log("error cui :",err);
          this.runTimeError();
            
        }); 
      });
      
      if(this.user_id != this.timeline_user_id) this.postLikeNotification();
    }
  }

  postLikeNotification(){
    let input = {
      user_id : this.timeline_user_id,
      data_id : this.user_id,
      data_id2: this.timeline_id
    };
    
    this.data.getOriginalPassword().then((password) =>{
      let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
      this.http.post(this.data.BASE_URL+"auth/pushNotification/like",input,{ headers: headers }).timeout(5000).subscribe(data => {
        let response = data.json();
        this.getPostData();
        
      }, err => {     
        console.log("error cui :",err);
        this.runTimeError();
          
      }); 
    });
  }
}
