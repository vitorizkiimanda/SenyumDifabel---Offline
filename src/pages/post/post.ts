import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ActionSheetController } from 'ionic-angular';
import { SuperTabsController } from 'ionic2-super-tabs';
import 'rxjs/add/operator/timeout';
import { Data } from '../../providers/data';
import { Http, Headers } from '@angular/http';
import { Camera,CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {
  dateNow : any = new Date().toISOString();
  timeNow: any = new Date().toLocaleTimeString();

  description:any;
  user_id:any;
  user_email:any;
  image:any;
  imageFinal:any;

  user_photo:any;
  

  loading:any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private data : Data,
    public actionSheetCtrl : ActionSheetController,
    private camera: Camera,
    private transfer: FileTransfer,
    public loadCtrl: LoadingController,
    public alertCtrl: AlertController,
    public http: Http,
    private superTabsCtrl: SuperTabsController) {

      this.data.getData().then((data) => {
        this.user_id = data.user_id;
        this.user_email = data.user_email;
        this.user_photo = data.user_photo;
        console.log(this.user_id);
      })

  }

  ionViewWillEnter() {
    console.log('ionViewDidLoad PostPage');

    this.superTabsCtrl.enableTabsSwipe(false);

    this.hideToolbar();
    this.dateNow = String(this.dateNow).substr(0,10)
    console.log("date :", this.dateNow);
    console.log("time :", this.timeNow);
  }

  ionViewWillLeave(){
    this.superTabsCtrl.showToolbar(true);
    this.superTabsCtrl.enableTabsSwipe(true);
  }

  showToolbar() {
    this.superTabsCtrl.showToolbar(true);
  }


  hideToolbar() {
    this.superTabsCtrl.showToolbar(false);
  }

  post(){
    if(this.description && this.image){

      this.loading = this.loadCtrl.create({
        content: 'Please wait...'
      });
      this.loading.present();
      
      if(this.image) this.postPict(this.image);
      
      let input = {
        timeline_date: this.dateNow, 
        timeline_time: this.timeNow,
        timeline_photo: this.imageFinal,
        timeline_description: this.description ,
        user_id : this.user_id
      };

      console.log(input)

      
      this.data.getOriginalPassword().then((password) =>{
        let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
        this.http.post(this.data.BASE_URL+"auth/postTimeline",input,{ headers: headers }).timeout(5000).subscribe(data => {
          let response = data.json();
          console.log(response);
          this.description=null;
          this.navCtrl.pop();
          this.loading.dismiss();
        }, err => {     
          console.log("error cui :",err);
          this.runTimeError();
          this.loading.dismiss();      
        }); 
      });
    }
    else {
      this.loading = this.loadCtrl.create({
        content: 'Please wait...'
      });
      this.loading.present();
      let input = {
        timeline_date: this.dateNow, 
        timeline_time: this.timeNow,
        timeline_photo: null,
        timeline_description: this.description ,
        user_id : this.user_id
      };

      console.log(input)

      this.data.getOriginalPassword().then((password) =>{
        let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
        this.http.post(this.data.BASE_URL+"auth/postTimeline",input,{ headers: headers }).timeout(5000).subscribe(data => {
          let response = data.json();
          console.log(response);
          this.description=null;
          this.navCtrl.pop();
          this.loading.dismiss();
        }, err => {     
          console.log("error cui :",err);
          this.runTimeError();
          this.loading.dismiss();      
        }); 
      });
    }
  }

  runTimeError(){
    let alert = this.alertCtrl.create({
      title: 'Failed',
      subTitle: 'Please try again',      
    });
    alert.present();
  }


  ////////////////////////////////////////photo
  updatePicture() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Pilihan',
      buttons: [
        {
          text: 'Ambil Gambar Baru',
          role: 'ambilGambar',
          handler: () => {
            this.takePicture();
          }
        },
        {
          text: 'Pilih Dari Galleri',
          role: 'gallery',
          handler: () => {
            this.getPhotoFromGallery();
          }
        }
      ]
    });
    actionSheet.present();
  }

  async takePicture(){
    try {
      const options : CameraOptions = {
        quality: 20, //to reduce img size
        targetHeight: 600,
        targetWidth: 600,
        // destinationType: this.camera.DestinationType.DATA_URL, //to make it base64 image
        destinationType: this.camera.DestinationType.FILE_URI, //to make it base64 image
        encodingType: this.camera.EncodingType.JPEG,
        mediaType:this.camera.MediaType.PICTURE,
        correctOrientation: true,
        allowEdit: true 
      }

      const result =  await this.camera.getPicture(options);
      this.postPict(result);
      this.image = result;

    }
    catch (e) {
      console.error(e);
      alert("error");
    }

  }

  getPhotoFromGallery(){
    this.camera.getPicture({
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType     : this.camera.PictureSourceType.PHOTOLIBRARY,
        targetWidth: 600,
        targetHeight: 600,
        allowEdit: true 
    }).then((imageData) => {
        this.postPict(imageData);
      }, (err) => {
    });
  }

  postPict(data){
    const fileTransfer: FileTransferObject = this.transfer.create();

    
    this.data.getOriginalPassword().then((password) =>{
      let options: FileUploadOptions = {
        fileKey: 'file',
        fileName: "Post_" + Date.now() +".PNG",
        chunkedMode: false,
        mimeType: "image/jpeg",
        headers: {'Authorization':'Basic ' +  btoa(this.user_email + ':' +password)}
      }

      fileTransfer.upload(data, this.data.BASE_URL+"auth/uploadFile", options)
        .then((data) => {

          let response = data.response;
          this.imageFinal = response;

      }, (err) => {
        console.log(err);
        alert( JSON.stringify(err));
      });
      
    });
  }

}
