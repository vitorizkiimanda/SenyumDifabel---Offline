import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { ContactPage } from '../contact/contact';
import { MessagePersonalPage } from '../message-personal/message-personal';
import { MessageGroupPage } from '../message-group/message-group';
import { CreateGroupPage } from '../create-group/create-group';
import { Data } from '../../providers/data';
import { Http, Headers } from '@angular/http';

@Component({
  selector: 'page-messaging',
  templateUrl: 'messaging.html',
})
export class MessagingPage {
  user_id:any;
  user_email:any;

  messages:any;
  list_search: any;
  statusSearch : boolean = false;

  chats:any;

  constructor(
    public navCtrl: NavController,
    private data : Data,
    public navParams: NavParams,
    public loadCtrl: LoadingController,
    public alertCtrl: AlertController,
    public http: Http
  ) {
  }

  ionViewWillEnter() {
    this.data.getData().then((data) => {
      this.user_email = data.user_email;
      this.user_id = data.user_id;

      this.getChats(this.user_id);
    })
  }

  openContact(){
    this.navCtrl.push(ContactPage);
  }

  openMessage(data: any){
    console.log("data mau buka chat", data)
    this.navCtrl.push(MessagePersonalPage, data);
    // if(data.size == 0) this.navCtrl.push(MessagePersonalPage);
    // else this.navCtrl.push(MessageGroupPage);
  }

  openCreateGroup(){
    this.navCtrl.push(CreateGroupPage);
  }


  getChats(data){
    this.data.getOriginalPassword().then((password) =>{
      console.log(password);
      let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
      this.http.get(this.data.BASE_URL+"auth/listChat/"+data,{ headers: headers }).timeout(5000).subscribe(data => {
        let response = data.json();
        console.log("chats",response);
        this.chats = response.reverse();
        // alert(response)

      }, err => {     
        console.log("error cui :",err);
        this.runTimeError();
        
      });
    })
  }

  runTimeError(){
    let alert = this.alertCtrl.create({
      title: 'Failed',
      subTitle: 'Please try again',     
      buttons: [
        {
          text: 'Refresh',
          handler: data => {
            this.ionViewWillEnter();
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
    this.list_search = this.chats;
    console.log("list", this.list_search)

    // set val to the value of the ev target
    var val = ev.target.value;
    console.log(val);

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.list_search = this.list_search.filter((data) => {
        return ((data.name.toLowerCase().indexOf(val.toLowerCase()) > -1));
      })
    }
    else {
      this.statusSearch=false;
      this.getChats(this.user_id);
    }

    console.log(this.list_search);
    console.log("search="+this.statusSearch);
  }
  //Fungsi Searchbar^^^^^

}