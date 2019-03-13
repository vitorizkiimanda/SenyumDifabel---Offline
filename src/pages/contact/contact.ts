import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { SuperTabsController } from 'ionic2-super-tabs';
import { ProfileOtherPage } from '../profile-other/profile-other';
import { MessagePersonalPage } from '../message-personal/message-personal';
import { Data } from '../../providers/data';
import { Http, Headers } from '@angular/http';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {
  sortTime: any = (new Date).getTime();
  dateNow : any = new Date().toISOString();
  timeNow: any = new Date().toLocaleTimeString();
  
  people:any;
  list_search: any;
  statusSearch : boolean = false;

  user_id:any;
  user_email:any;

  loading:any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private data: Data,
    public http: Http,
    public loadCtrl: LoadingController,
    private superTabsCtrl: SuperTabsController) {
  }

  ionViewWillEnter() {
    this.superTabsCtrl.enableTabsSwipe(false);
    this.superTabsCtrl.showToolbar(false);
    this.data.getData().then((data) =>{
      this.user_id = data.user_id;
      this.user_email = data.user_email;
      console.log(data);
      this.getFollowing(this.user_id)
    })    
  }

  ionViewWillLeave(){
    this.superTabsCtrl.showToolbar(true);
    this.superTabsCtrl.enableTabsSwipe(true);
  }

  openChat(dataContact){

    this.loading = this.loadCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();

    //check history chat
    let input = {
      param1: this.user_id, 
      param2: dataContact.user_id
    };

    console.log(input)
    
    this.data.getOriginalPassword().then((password) =>{
      let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
      this.http.post(this.data.BASE_URL+"auth/checkRoom",input,{ headers: headers }).subscribe(data => {
        let response = data.json();
        console.log(response);
        if(response.id != null){
          response.origin = "contact"
          response.dataContact = dataContact;
          this.navCtrl.push(MessagePersonalPage, response);
        }
        else{
          this.dateNow = String(this.dateNow).substr(0,10)
          let input = {
            peopleA: this.user_id, 
            peopleB: dataContact.user_id,
            date:this.dateNow,
            time: this.timeNow,
            sort_time: this.sortTime
          };

          console.log("new input",input);
          let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
          this.http.post(this.data.BASE_URL+"auth/addChat",input,{ headers: headers }).timeout(5000).subscribe(data => {
            let response = data.json();
            console.log("new room",response);
            
            response.origin = "contact"
            response.dataContact = dataContact;
            this.navCtrl.push(MessagePersonalPage, response);
            
          }, err => {     
            console.log("error cui :",err);
            this.runTimeError();     
          }); 
        }
        
      }, err => {     
        console.log("error cui :",err);
        this.runTimeError();     
      }); 
    });
    this.loading.dismiss();
  }

  getFollowing(data){
    this.data.getOriginalPassword().then((password) =>{
      let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
      this.http.get(this.data.BASE_URL+"auth/getFollowing/"+data,{ headers: headers }).subscribe(data => {
        let response = data.json();
        this.people = response;
        console.log("follow",response);
      }, err => {     
        console.log("error cui :",err);
        
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

  
  //Fungsi Searchbar
  getItems(ev) {
    this.statusSearch=true;

    // Reset items back to all of the items
    this.list_search = this.people;

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
