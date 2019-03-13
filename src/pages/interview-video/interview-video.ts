import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { SuperTabsController } from 'ionic2-super-tabs';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@Component({
  selector: 'page-interview-video',
  templateUrl: 'interview-video.html',
})
export class InterviewVideoPage {

  url:any;
  loading: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private sanitizer: DomSanitizer,
    public loadingCtrl: LoadingController,
    private youtube: YoutubeVideoPlayer,
    private screenOrientation: ScreenOrientation,
    private superTabsCtrl: SuperTabsController) {

  }

  ionViewWillEnter() {

    
    let choose = this.navParams.data;

    // set to landscape
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
    if(choose==1) this.url = 'https://drive.google.com/file/d/0B9ZkzJpxfLAMUk1uOXhRd2pkVmtKUlpJU3dtVWJQeWRrZmlN/preview';
    else if(choose==2 ) this.url = 'https://drive.google.com/file/d/0B9ZkzJpxfLAMOHZudURfMEl3NDdaQWZETWhTQXlrSWtTQ0ZR/preview';
    else if(choose==3 ) this.url = 'https://drive.google.com/file/d/0B9ZkzJpxfLAMR0o1ajdIUzZjeGhFWEFObFZwNHY2TlktQlBj/preview';
    else if(choose==4 ) this.url = 'https://drive.google.com/file/d/0B9ZkzJpxfLAMR0h5aXJoQmVWbmk2SG1SOWl3YkQyYVRDRkJ3/preview';
    else if(choose==5 ) this.url = 'https://drive.google.com/file/d/0B9ZkzJpxfLAMMG5OVmZxWWlwR0tZM2FpOEU2aDhEMlBvOFlB/preview';
    else if(choose==6 ) this.url = 'https://drive.google.com/file/d/0B9ZkzJpxfLAMdFVZc0RnVnZKX09Ta2U2Z1NhT2lfcFdWT3lB/preview';
    
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);

    this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
    });

    this.loading.present();

    this.superTabsCtrl.enableTabsSwipe(false);
    this.superTabsCtrl.showToolbar(false);
  }

  ionViewWillLeave(){
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    this.superTabsCtrl.showToolbar(true);
    this.superTabsCtrl.enableTabsSwipe(true);
  }

  handleIFrameLoadEvent(): void {
    this.loading.dismiss();
  }

  dismiss(){
    this.navCtrl.pop();
  }

}
