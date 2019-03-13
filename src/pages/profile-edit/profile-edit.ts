import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, LoadingController, AlertController } from 'ionic-angular';
import { SuperTabsController } from 'ionic2-super-tabs';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Data } from '../../providers/data';
import { Http, Headers } from '@angular/http';
import { TabsPage } from '../tabs/tabs';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

@Component({
  selector: 'page-profile-edit',
  templateUrl: 'profile-edit.html',
})
export class ProfileEditPage {

  loadingSpinner:any=false;
  loading:any;
  post: any;
  user_name:any;
  user_address:any;
  user_photo:any;
  description:any;
  user_id: any;
  user_email;
  image:any;
  imageFinal:any;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public loadCtrl: LoadingController,
    private transfer: FileTransfer,
    private superTabsCtrl: SuperTabsController,
    public alertCtrl: AlertController,
    public actionSheetCtrl : ActionSheetController,
    public http: Http,
    private data: Data,
    private camera: Camera) {
  }

  ionViewWillEnter() {
    this.superTabsCtrl.enableTabsSwipe(false);
    this.superTabsCtrl.showToolbar(false);
    this.data.getData().then((data) =>{
      this.user_id = data.user_id;
      this.user_name = data.user_name;
      this.user_email = data.user_email;
      this.user_address = data.user_address;
      this.description = data.user_contact;
      this.imageFinal = data.user_photo;
      console.log(data);
    })
    
    this.data.getOriginalPassword().then((data) =>{
      console.log(data);
    })
  }

  ionViewWillLeave(){
    this.superTabsCtrl.showToolbar(true);
    this.superTabsCtrl.enableTabsSwipe(true);
  }

  profileEdit(){
    if(this.user_name && this.user_address && this.description) {

      
      this.loading = this.loadCtrl.create({
          content: 'Please wait...'
      });

      this.loading.present();

      let input = { 
        user_name: this.user_name,
        user_address: this.user_address,
        user_contact: this.description,
        user_photo: this.imageFinal
      };

      //api
      
      this.data.getOriginalPassword().then((password) =>{
        let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
        this.http.put(this.data.BASE_URL+"auth/update/"+this.user_id,input,{ headers: headers }).timeout(5000).subscribe(data => {
          
          let response = data.json();
          console.log(response)
          
          this.data.logout(); //cleaning local storage
          this.data.login(response,"user");//save to local
          this.navCtrl.pop();
          this.loading.dismiss();
          
        },  err => {     
          this.loading.dismiss();
          this.runTimeError();
          
        });
      });
    }
    else {
      let alert = this.alertCtrl.create({
        title: '',
        subTitle: 'Complete your data',      
        buttons: [
          {
            text: 'Refresh',
            handler: data => {
              this.profileEdit();
            }
          }
        ]
      });
      alert.present();
    }
  }

  runTimeError(){
    let alert = this.alertCtrl.create({
      title: 'Failed',
      subTitle: 'Please try again',      
      buttons: [
        {
          text: 'Refresh',
          handler: data => {
            this.profileEdit();
          }
        }
      ]
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

  
  this.loadingSpinner=true;

  const fileTransfer: FileTransferObject = this.transfer.create();

  
  this.data.getOriginalPassword().then((password) =>{
    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: "ProfilePict_" + Date.now() +".PNG",
      chunkedMode: false,
      mimeType: "image/jpeg",
      headers: {'Authorization':'Basic ' +  btoa(this.user_email + ':' +password)}
    }

    fileTransfer.upload(data, this.data.BASE_URL+"auth/uploadFile", options)
      .then((data) => {

        let response = data.response;
        this.imageFinal = response;
        
        this.loadingSpinner=false;

    }, (err) => {
      console.log(err);
      alert( JSON.stringify(err));
      this.loadingSpinner=false;
    });
    
  });
}

}
