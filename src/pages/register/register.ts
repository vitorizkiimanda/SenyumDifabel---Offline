import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validator, Validators, AbstractControl } from '@angular/forms';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { ProfilePage } from '../profile/profile';
import { Data } from '../../providers/data';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/timeout';
import { SuperTabsController } from 'ionic2-super-tabs';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  loading: any;

  submitAttempt: boolean = false;
  registerForm: FormGroup;
  
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  lihatPassword: boolean = true;
  lihatConfirmPassword: boolean = true;
  status: string;
  mismatch: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    private data : Data,
    public loadCtrl: LoadingController,
    private superTabsCtrl: SuperTabsController,
    public alertCtrl: AlertController,
    public http: Http) {
    this.registerForm = formBuilder.group({
      username: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(32)])],
      email: ['', Validators.compose([Validators.required, Validators.pattern("[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$")])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(32)])],
      confirmPassword: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(32)])]
    }, {validator: this.passMismatch('password', 'confirmPassword')});
  }

  ionViewWillEnter(){
    this.status = "password";
  }

  ionViewWillLeave(){
    this.superTabsCtrl.showToolbar(true);
    this.superTabsCtrl.enableTabsSwipe(true);
  }

  confirmPass(){
    if(this.registerForm.value.password == this.registerForm.value.confirmPassword) this.mismatch = false;
    else this.mismatch = true;
  }

  passMismatch(passwordKey: string, confirmPasswordKey: string){
    return (group: FormGroup): {[key: string]: any} => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    }
    // if(this.password != this.confirmPassword)
    // {
    //   this.mismatch = true;
    // }    
    // else{
    //   this.mismatch = false;      
    // }
  }

  register(){
    this.submitAttempt = true;

    if(!this.registerForm.valid){
      // this.navCtrl.setRoot(RegisterPage);
    }
    else {

      
      this.loading = this.loadingCtrl.create({
          content: 'Please wait...'
      });

      this.loading.present();

      let input = {
        user_name: this.registerForm.value.username, 
        user_email: this.registerForm.value.email,
        user_password:this.registerForm.value.password
      };
      this.http.post(this.data.BASE_URL+"register", input).timeout(5000).subscribe(data => {
        let response = data.json();
        console.log(response);
        if(response.user_name!="email sudah ada"){
          this.data.logout(); //cleaning local storage
          this.data.login(response,"user");//save to local
          this.data.saveOriginalPassword(this.registerForm.value.password);
          this.navCtrl.setRoot(TabsPage);
        } 
        else{
          let alert = this.alertCtrl.create({
            subTitle: 'Email has been used',      
            });
          alert.present();
        }
        this.loading.dismiss();

      }, err => {     
        this.loading.dismiss();
        this.runTimeError();
        
      });
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
            this.register();
          }
        }
      ]
    });
    alert.present();
  }

  showPassword(){
    this.status = "text";
    this.lihatPassword = false;
    console.log(this.status);
  }

  hidePassword(){
    this.status = "password";
    this.lihatPassword = true;
    console.log(this.status);
  }

  showConfirmPassword(){
    this.status = "text";
    this.lihatConfirmPassword = false;
    console.log(this.status);
  }

  hideConfirmPassword(){
    this.status = "password";
    this.lihatConfirmPassword = true;
    console.log(this.status);
  }

  gotoLoginPage(){
    this.navCtrl.setRoot(LoginPage);
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

}

