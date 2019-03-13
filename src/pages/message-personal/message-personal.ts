import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, LoadingController, AlertController  } from 'ionic-angular';
import { SuperTabsController } from 'ionic2-super-tabs';
import { Data } from '../../providers/data';
import { Http, Headers } from '@angular/http';

@Component({
  selector: 'page-message-personal',
  templateUrl: 'message-personal.html',
})
export class MessagePersonalPage {
  @ViewChild(Content) content:Content;

  sortTime: any = (new Date).getTime();
  dateNow : any = new Date().toISOString();
  timeNow: any = new Date().toLocaleTimeString();

  message:string;
  sender_name:any;
  chats:any;
  id_sender:any;
  id_receiver:any;

  user_email:any;
  user_id:any;
  id:any;
  photo:any;

  constructor(
    public navCtrl: NavController,
    private superTabsCtrl: SuperTabsController,
    private data : Data,
    public navParams: NavParams,
    public loadCtrl: LoadingController,
    public alertCtrl: AlertController,
    public http: Http
  ) {

    let temp = this.navParams.data;
    console.log("temp", temp)
    if(temp.origin == "contact"){
      this.sender_name = temp.dataContact.user_name;
      this.id_sender = temp.id_user;
      this.id_receiver = temp.id_receiver;
      this.id = temp.id;
      this.photo = temp.photo;
    }
    else{
      this.sender_name = temp.name;
      // this.id_sender = temp.id_user;
      // this.id_receiver = temp.id_receiver;
      this.id = temp.id_prev;
      this.photo = temp.photo;
    }

    this.getChats();

  }

  ionViewWillEnter() {
    this.superTabsCtrl.enableTabsSwipe(false);
    this.superTabsCtrl.showToolbar(false);

    this.data.getData().then((data) => {
      this.user_email = data.user_email;
      this.user_id = data.user_id;

      this.getChats();
    })
  }

  ionViewWillLeave(){
    this.superTabsCtrl.showToolbar(true);
    this.superTabsCtrl.enableTabsSwipe(true);
  }


  scrollToBottom() {
    setTimeout(() => {
        this.content.scrollToBottom(200);
    });
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

  getChats() {

    let input = {
      param1: this.user_id, 
      param2: this.id
    };

    this.data.getOriginalPassword().then((password) =>{
      let headers = new Headers({'Authorization':'Basic ' +  btoa("vitorizkiimanda@gmail.com" + ':' +"vitovito") });
      this.http.post(this.data.BASE_URL+"auth/loadChat",input,{ headers: headers }).subscribe(data => {
        let response = data.json();
        this.chats = response;
        console.log("chats",response);
        this.scrollToBottom();

      }, err => {     
        console.log("error cui :",err);      
      });
    });   
  }

  postChat(data) {
    this.dateNow = String(this.dateNow).substr(0,10)
    let input = {
      id_prev: this.id, 
      sender: this.user_id,
      message: data,
      date: this.dateNow, 
      time: this.timeNow, 
      sort_time: this.sortTime
    };

    console.log("kirim chat", input)

    this.data.getOriginalPassword().then((password) =>{
      let headers = new Headers({'Authorization':'Basic ' +  btoa("vitorizkiimanda@gmail.com" + ':' +"vitovito") });
      this.http.post(this.data.BASE_URL+"auth/sendMessage",input,{ headers: headers }).subscribe(data => {
        let response = data.json();
        console.log("chats",response);
        this.getChats();

      }, err => {     
        console.log("error cui :",err);      
      });
    });   
  }

}
