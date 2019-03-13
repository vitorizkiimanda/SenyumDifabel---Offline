import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { RegisterPage } from '../register/register';
import { HomePage } from '../home/home';
import { TabsPage } from '../tabs/tabs';
import { Data } from '../../providers/data';
import { Http, Headers, ResponseContentType } from '@angular/http';
import { SuperTabsController } from 'ionic2-super-tabs';
import 'rxjs/add/operator/timeout';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loading:any;

  submitAttempt: boolean = false;
  authForm: FormGroup;
  
  email: string;
  password: string;
  lihat: boolean = true;
  status: string;

  response = {
    user_name: "Vito Rizki Imanda",
    user_email: "vitorizkiimanda@gmail.com",

  }

  constructor(
    public navCtrl: NavController, 
    public formBuilder: FormBuilder,
    private data : Data,
    public loadCtrl: LoadingController,
    public alertCtrl: AlertController,
    public http: Http,
    private superTabsCtrl: SuperTabsController
    ) {
    this.authForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern("[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$")])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(32)])]
    });
  }

  ionViewWillEnter(){
    this.status = "password";
  }

  ionViewWillLeave() {
    this.superTabsCtrl.enableTabsSwipe(true);
    this.superTabsCtrl.showToolbar(true);
  }

  login(){
    this.submitAttempt = true;

    if(!this.authForm.valid){
      
    }
    else {

      
      this.loading = this.loadCtrl.create({
          content: 'Please wait...'
      });

      this.loading.present();

      let input = { 
        user_email: this.authForm.value.email,
        user_password:this.authForm.value.password
      };

      // //api
      // let headers = new Headers({'Authorization':'Basic ' +  btoa(this.authForm.value.email + ':' +this.authForm.value.password) });
      // this.http.post(this.data.BASE_URL+"auth/login",input,{ headers: headers }).timeout(5000).subscribe(data => {
        
      //   let response = data.json();
      //   console.log(response)
        
      //   this.data.logout(); //cleaning local storage
      //   this.data.login(response,"user");//save to local
      //   this.data.saveOriginalPassword(this.authForm.value.password);
      //   this.navCtrl.setRoot(TabsPage);
      //   this.loading.dismiss();
        
      // },  err => {     
      //   this.loading.dismiss();
      //   this.runTimeError();
        
      // });


      
      this.data.logout(); //cleaning local storage
      this.data.login(this.response,"user");//save to local
      this.data.saveOriginalPassword(this.authForm.value.password);
      this.navCtrl.setRoot(TabsPage);
      this.loading.dismiss();

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
            this.login();
          }
        }
      ]
    });
    alert.present();
  }

  showPassword(){
    this.status = "text";
    this.lihat = false;
    console.log(this.status);
  }

  hidePassword(){
    this.status = "password";
    this.lihat = true;
    console.log(this.status);
  }

  gotoRegisterPage(){
    this.navCtrl.setRoot(RegisterPage);
  }
}

