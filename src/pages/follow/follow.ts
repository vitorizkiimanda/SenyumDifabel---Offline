import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { SuperTabsController } from 'ionic2-super-tabs';
import { Data } from '../../providers/data';
import { Http, RequestOptions, Headers  } from '@angular/http';
import 'rxjs/add/operator/timeout';
import { ProfileOtherPage } from '../profile-other/profile-other';

@Component({
  selector: 'page-follow',
  templateUrl: 'follow.html',
})
export class FollowPage {

  choosed:any;
  statusFollow : boolean = true;
  user_id: any;
  user_email:any;
  following: any;
  follower: any;
  
  people:any;
  list_search: any;
  statusSearch : boolean = false;
  tempList:any;

  target_id:any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private data: Data,
    public http: Http,
    private superTabsCtrl: SuperTabsController) {
      let temp = this.navParams.data;
      this.choosed = temp.origin;
      if(temp.root=="other") this.target_id = temp.user_id;
      
      this.data.getData().then((data) =>{
        this.user_id = data.user_id;
        this.user_email = data.user_email;
        if(temp.root!="other") this.target_id = data.user_id;

        if(this.choosed=="following") this.getFollowing(this.target_id);
        else if(this.choosed=="follower") this.getFollower(this.target_id);        
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

  follow(){
    this.statusFollow = false;
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
            this.statusFollow = true;
          }
        }
      ]
    });
    prompt.present();
  }

  getFollowing(data){
    this.data.getOriginalPassword().then((password) =>{
      let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
      this.http.get(this.data.BASE_URL+"auth/getFollowing/"+data,{ headers: headers }).subscribe(data => {
        let response = data.json();
        this.people = response;
        for(let data of this.people){
          data.statusFollow = this.checkFollow(data.user_id);        
        }
        console.log("follower baru",response);
        // alert(response)
      }, err => {     
        console.log("error cui :",err);
        
      });
    });
  }

  getFollower(data){
    this.data.getOriginalPassword().then((password) =>{
      let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
      this.http.get(this.data.BASE_URL+"auth/getFollower/"+data,{ headers: headers }).subscribe(data => {
        let response = data.json();
        this.people = response;
        for(let data of this.people){
          data.statusFollow = this.checkFollow(data.user_id);    
          // data.statusFollow = true;      
          console.log(data.statusFollow)  
        }
        console.log("follower baru",response);
        // alert(response)
      }, err => {     
        console.log("error cui :",err);
        
      });
    });
  }

  checkFollow(id_check){
    this.statusFollow = true;
    let headers = new Headers({'Authorization':'Basic ' +  btoa('vitovito@gmail.com' + ':' +'vitovito') });
    this.http.get(this.data.BASE_URL+"auth/getFollowing/"+this.user_id,{ headers: headers }).subscribe(data => {
      let response = data.json();
      console.log(response);
      for(let data of response){
        if(data.user_id == id_check){
          this.statusFollow = false;
          break;
        }      
      }
      return this.statusFollow;
      // alert(response)
    }, err => {     
      console.log("error cui :",err);
      
    });
  }

  openProfile(data){
    if(data.user_id!=this.user_id) this.navCtrl.push(ProfileOtherPage,data);
  }

  //Fungsi Searchbar
  getItems(ev) {
    this.statusSearch=true;

    // Reset items back to all of the items
    this.tempList = this.people;
    this.list_search = this.people;

    console.log('list:'+this.list_search);

    // set val to the value of the ev target
    var val = ev.target.value;
    console.log(val);

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.list_search = this.list_search.filter((data) => {
        return ((data.user_name.toLowerCase().indexOf(val.toLowerCase()) > -1));
      })
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
