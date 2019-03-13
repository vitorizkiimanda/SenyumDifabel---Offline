import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { ProfilePage } from '../profile/profile';
import { MessagingPage } from '../messaging/messaging';
import { JobsPage } from '../jobs/jobs';
import { SuperTabsController } from 'ionic2-super-tabs';
import { NavParams } from 'ionic-angular';
import { Data } from '../../providers/data';
import { Http, Headers } from '@angular/http';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  messageNotif:any;
  user_email:any;
  user_id:any;

  tab1Root = HomePage;
  tab2Root = MessagingPage;
  tab3Root = JobsPage;
  tab4Root = ProfilePage;

  constructor(
    private superTabsCtrl: SuperTabsController,
    public navParams: NavParams,
    private data : Data,
    public http: Http
  ) {
    let temp = this.navParams.data;
    this.data.getData().then((data) => {
      this.user_email = data.user_email;
      this.user_id = data.user_id;
    })
  }

  ngAfterViewInit() {
    this.data.getOriginalPassword().then((password) =>{
      let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
      this.http.get(this.data.BASE_URL+"auth/getCountFlagChat/"+this.user_id,{ headers: headers }).subscribe(data => {
        let response = data.json();
        // alert(response)
        this.messageNotif = response;
        console.log(this.messageNotif);

      }, err => {     
        console.log("error cui :",err);      
      });
    });   
    // must wait for AfterViewInit if you want to modify the tabs instantly
    if(this.messageNotif) this.superTabsCtrl.setBadge('messageTab', this.messageNotif);
  
  }

  update(data){
    console.log(data)
    if(data.index == 1){
      this.data.getOriginalPassword().then((password) =>{
        let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
        this.http.get(this.data.BASE_URL+"auth/getCountFlagChat/"+this.user_id,{ headers: headers }).subscribe(data => {
          let response = data.json();
          // alert(response)
          this.messageNotif = response;
          console.log(this.messageNotif);
  
        }, err => {     
          console.log("error cui :",err);      
        });
      });   
      this.ngAfterViewInit();   
    }
  }
}