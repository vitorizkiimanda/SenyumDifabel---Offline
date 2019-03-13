import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { NotificationPage } from '../notification/notification';
import { PostPage } from '../post/post';
import { SuperTabsController } from 'ionic2-super-tabs';
import { Data } from '../../providers/data';
import { Http, RequestOptions, Headers } from '@angular/http';
import { ProfileOtherPage } from '../profile-other/profile-other';
import { JobDetailPage } from '../job-detail/job-detail';
import { CommentPage } from '../comment/comment';
import 'rxjs/add/operator/timeout';
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  user_id: any;
  user_email: any;
  user_password: any;
  nothing: any = false;

  post: any;
  people: any;
  list_search: any;
  statusSearch: boolean = false;
  counter: any;

  dataPost = [
    {
      user_photo: "https://image.flaticon.com/icons/svg/1498/1498552.svg",
      user_name: "Budi Budiman",
      timeline_date: "28 Februari 2019",
      timeline_time: "15:30 WIB",
      timeline_description: "lorem ipsum dolor sir amet lorem ipsum dolor sir amet lorem ipsum dolor sir amet lorem ipsum dolor sir amet lorem ipsum dolor sir amet",
      timeline_photo: "https://cdn.pixabay.com/photo/2017/02/15/10/38/background-2068211_960_720.jpg"
    },
    {
      user_photo: "https://image.flaticon.com/icons/svg/1498/1498552.svg",
      user_name: "Budi Budiman",
      timeline_date: "28 Februari 2019",
      timeline_time: "15:30 WIB",
      timeline_description: "lorem ipsum dolor sir amet lorem ipsum dolor sir amet lorem ipsum dolor sir amet lorem ipsum dolor sir amet lorem ipsum dolor sir amet",
      timeline_photo: "https://cdn.pixabay.com/photo/2017/02/15/10/38/background-2068211_960_720.jpg"
    }
  ]

  constructor(
    public navCtrl: NavController,
    private superTabsCtrl: SuperTabsController,
    private data: Data,
    public navParams: NavParams,
    public loadCtrl: LoadingController,
    private socialSharing: SocialSharing,
    public alertCtrl: AlertController,
    public http: Http) {
  }

  ionViewWillEnter() {
    this.data.getData().then((data) => {
      this.user_email = data.user_email;
      this.user_id = data.user_id;

      this.getTimeline(this.user_id);
      this.getNotifCount(this.user_id);
    })
    this.getusers();
  }

  doRefresh(refresher) {
    console.log("refresh", refresher)
    console.log('Begin async operation', refresher);
    this.ionViewWillEnter();

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  getTimeline(data) {
    // this.data.getOriginalPassword().then((password) =>{
    //   console.log(password);
    //   let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
    //   this.http.get(this.data.BASE_URL+"auth/getFollowingTimeline/"+data,{ headers: headers }).timeout(5000).subscribe(data => {
    //     let response = data.json();
    //     console.log(response);
    //     // alert(response)
    //     this.post = response.reverse();
    //     if(this.post.length){
    //       this.nothing = false;
    //       }

    //   }, err => {     
    //     console.log("error cui :",err);
    //     this.runTimeError();

    //   });
    // })

    this.post = this.dataPost.reverse();
    if (this.post.length) {
      this.nothing = false;
    }


  }

  getusers() {
    this.data.getOriginalPassword().then((password) => {
      let headers = new Headers({ 'Authorization': 'Basic ' + btoa(this.user_email + ':' + password) });
      this.http.get(this.data.BASE_URL + "auth/getusers", { headers: headers }).subscribe(data => {
        let response = data.json();
        console.log(response);
        // alert(response)
        this.people = response;

      }, err => {
        console.log("error cui :", err);

      });
    });
  }

  getNotifCount(data) {
    this.data.getOriginalPassword().then((password) => {
      let headers = new Headers({ 'Authorization': 'Basic ' + btoa(this.user_email + ':' + password) });
      this.http.get(this.data.BASE_URL + "auth/getCountNotification/" + data, { headers: headers }).subscribe(data => {
        let response = data.json();
        console.log(response);
        // alert(response)
        this.counter = response;

      }, err => {
        console.log("error cui :", err);
      });
    });
  }

  runTimeError() {
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

  openNotification() {
    this.navCtrl.push(NotificationPage);
  }

  openNewPost() {
    this.navCtrl.push(PostPage);
  }

  openProfile(data) {
    this.navCtrl.push(ProfileOtherPage, data);
  }

  openComment(data) {
    data.origin = "home";
    console.log(data)
    this.navCtrl.push(CommentPage, data);
  }

  share(data) {
    let loading = this.loadCtrl.create({
      content: 'berbagi..'
    });

    console.log(data.name);

    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 5000);


    // this.socialSharing.share(data.name, data.user, "http://156.67.218.250:81"+data.picture, data.youtube)
    this.socialSharing.share(data.timeline_description, null, null, null);

  }

  //Fungsi Searchbar
  getItems(ev) {
    this.statusSearch = true;

    // Reset items back to all of the items
    this.list_search = this.people;

    console.log('list: \n\n');
    console.log(this.list_search);

    // set val to the value of the ev target
    var val = ev.target.value;
    console.log(val);

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {

      this.list_search = this.list_search.filter((data) => {
        // console.log(data.user_name);
        return ((data.user_name.toLowerCase().indexOf(val.toLowerCase()) > -1));
      })
    }
    else {
      this.statusSearch = false;
      this.ionViewWillEnter();
    }

    console.log(this.list_search);
    console.log("search=" + this.statusSearch);
  }
  //Fungsi Searchbar^^^^^

}
