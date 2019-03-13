import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { SettingPage } from '../setting/setting';
import { ProfileEditPage } from '../profile-edit/profile-edit';
import { HomePage } from '../home/home';
import { MessagingPage } from '../messaging/messaging';
import { JobsPage } from '../jobs/jobs';
import { AboutPage } from '../about/about';
import { FollowPage } from '../follow/follow';
import { CvPage } from '../cv/cv';
import { Data } from '../../providers/data';
import { Http, RequestOptions, Headers  } from '@angular/http';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  loading:any;

  experience = true;
  education = false;
  skill = false;
  accomplishment = false;
  contact = false;

  user:any;
  user_id: any;
  follower: any;
  following: any;

  // variabel Output
  post: any;
  user_name:any;
  user_address:any;
  user_photo:any;
  description:any;
  user_email:any;
  user_job:any;

  experiences:any;
  educations:any;
  contacts:any;
  achievements:any;
  skills:any;

  
  tab1Root = AboutPage;
  tab2Root = AboutPage;
  tab3Root = AboutPage;
  tab4Root = AboutPage;
  tab5Root = AboutPage;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadCtrl: LoadingController,
    private data: Data,
    public http: Http) {
  }

  ionViewWillEnter() {
    console.log('ionViewDidLoad ProfilePage');
    this.data.getData().then((data) =>{
      this.user_id = data.user_id;
      this.user_email = data.user_email;
      console.log(data);
    
      this.countFollow(this.user_id);
      this.getUserData(this.user_id);
      this.getMyTimeline(this.user_id);
    })    
  }

  getUserData(data){
    this.data.getOriginalPassword().then((password) =>{
      console.log(password);
      let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
      this.http.get(this.data.BASE_URL+"auth/getuser/"+data,{ headers: headers }).timeout(5000).subscribe(data => {
        let response = data.json();
        this.user = response;
        this.user_name = response.user_name;
        this.user_address = response.user_address;
        this.user_job = response.user_job;
        this.description = response.user_contact;
        this.user_photo = response.user_photo;
        this.experiences = response.experiences.reverse();
        this.educations = response.educations.reverse();
        this.contacts = response.contacts.reverse();
        this.achievements = response.achievements.reverse();
        this.skills = response.skills.reverse();
        console.log("user data :", response)
      }, err => {     
        console.log("error cui :",err);
        this.runTimeError();
        
      });
    })
  }

  openSetting(){
    this.navCtrl.push(SettingPage);
  }

  openProfileEdit(){
    this.navCtrl.push(ProfileEditPage);
  }

  countFollow(data){
    
    this.data.getOriginalPassword().then((password) =>{
      console.log(password);
      let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
      this.http.get(this.data.BASE_URL+"auth/countFollow/"+data,{ headers: headers }).subscribe(data => {
        let response = data.json();
        console.log(response);
        this.follower=response.follower;
        this.following=response.following;
        // alert(response)
      }, err => {     
        console.log("error cui :",err);
        
      });
    }) 
  }

  getMyTimeline(data){
    this.data.getOriginalPassword().then((password) =>{

      let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
      this.http.get(this.data.BASE_URL+"auth/getMyTimeline/"+data,{ headers: headers }).subscribe(data => {
        let response = data.json();
        console.log(response);
        this.post = response.reverse();
        // alert(response)
      }, err => {     
        console.log("error cui :",err);
        
      });
    });
  }

  open(origin){
    let data = this.user;
    data.origin = origin;
    this.navCtrl.push(FollowPage, data);
  }

  more(dataPost){
    let prompt = this.alertCtrl.create({
      subTitle:dataPost.timeline_description + "<br>" + dataPost.timeline_date,
      buttons: [
        {
          text: 'Delete',
          handler: data => {
            this.data.getOriginalPassword().then((password) =>{

              let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
              this.http.delete(this.data.BASE_URL+"auth/deleteTimeline/"+dataPost.timeline_id,{ headers: headers }).subscribe(data => {
                this.getMyTimeline(this.user_id);
                // alert(response)
              }, err => {     
                console.log("error cui :",err);
                
              });
            });
          }
        },
        // {
        //   text: 'Edit',
        //   handler: data => {
        //     // this.navCtrl.push(EditJobPage, dataJob);
        //   }
        // }
      ]
    });
    prompt.present();
  }

  openCV(){
    this.navCtrl.push(CvPage);
  }


  //algo for dynamic tabs

  onTabSelect(ev: any) {
    console.log('Tab selected', 'Index: ' + ev.index, 'Unique ID: ' + ev.id);
    if(ev.index==0) this.activeExperience();
    else if(ev.index==1) this.activeEducation();
    else if(ev.index==2) this.activeSkill();
    else if(ev.index==3) this.activeAccomplishment();
    else if(ev.index==4) this.activeContact();
  }
  
  activeExperience(){
    this.experience = true;
    this.education = false;
    this.skill = false;
    this.accomplishment = false;
    this.contact = false;
  }

  activeEducation(){
    this.experience = false;
    this.education = true;
    this.skill = false;
    this.accomplishment = false;
    this.contact = false;
  }

  activeSkill(){
    this.experience = false;
    this.education = false;
    this.skill = true;
    this.accomplishment = false;
    this.contact = false;
  }

  activeAccomplishment(){
    this.experience = false;
    this.education = false;
    this.skill = false;
    this.accomplishment = true;
    this.contact = false;
  }

  activeContact(){
    this.experience = false;
    this.education = false;
    this.skill = false;
    this.accomplishment = false;
    this.contact = true;
  }

  add() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Choose Field');

    alert.addInput(
      {
      type: 'radio',
      label: 'Experience',
      value: 'experience',
      checked: true
      },
    );

    alert.addInput(
      {
      type: 'radio',
      label: 'Education',
      value: 'education'
      },
    );

    alert.addInput(
      {
      type: 'radio',
      label: 'Skill',
      value: 'skill'
      },
    );

    alert.addInput(
      {
      type: 'radio',
      label: 'Achivement',
      value: 'achivement'
      },
    );

    alert.addInput(
      {
      type: 'radio',
      label: 'Contact',
      value: 'contact'
      },
    );

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        if(data=="experience") this.addExperience();
        if(data=="education") this.addEducation();
        if(data=="skill") this.addSkill();
        if(data=="achivement") this.addAchivement();
        if(data=="contact") this.addContact();
      }
    });
    alert.present();
  }

  optionExperience(dataExperience){
    
    let prompt = this.alertCtrl.create({
      title: dataExperience.title,
      subTitle:dataExperience.description +"<br>"+dataExperience.year,
      buttons: [
        {
          text: 'Delete',
          handler: data => {
            this.loading = this.loadCtrl.create({
              content: 'Please wait...'
            });
            this.loading.present();
            this.data.getOriginalPassword().then((password) =>{
              let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
              this.http.delete(this.data.BASE_URL+"auth/deleteExperience/"+dataExperience.id,{ headers: headers }).timeout(5000).subscribe(data => {
                let response = data.json();
                this.login();
                this.loading.dismiss();
              }, err => {     
                console.log("error cui :",err);
                this.runTimeError();
                this.loading.dismiss();      
              }); 
            });
          }
        },
        {
          text: 'Edit',
          handler: data => {
            this.editExperience(dataExperience);
          }
        }
      ]
    });
    prompt.present();
  }

  editExperience(dataExperience){
    console.log("dataedit",dataExperience)
    const prompt = this.alertCtrl.create({
      title: 'Experience',
      inputs: [
        {
          name: 'title',
          placeholder: 'Title',
          value:dataExperience.title
        },
        { 
          name: 'year',
          placeholder: 'Year',
          value:dataExperience.year
        },
        {
          name: 'description',
          placeholder: 'Description',
          value:dataExperience.description
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log(data);
            this.loading = this.loadCtrl.create({
              content: 'Please wait...'
            });
            this.loading.present();

            let input = {
              user_id: this.user_id, 
              title: data.title,
              description: data.description,
              year: data.year
            };

            this.data.getOriginalPassword().then((password) =>{
              let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
              this.http.put(this.data.BASE_URL+"auth/updateExperience/"+dataExperience.id,input,{ headers: headers }).timeout(5000).subscribe(data => {
                let response = data.json();
                this.login();
                this.loading.dismiss();
              }, err => {     
                console.log("error cui :",err);
                this.runTimeError();
                this.loading.dismiss();      
              }); 
            });
          }
        }
      ]
    });
    prompt.present();
  }

  addExperience(){
    const prompt = this.alertCtrl.create({
      title: 'Experience',
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
        {
          name: 'year',
          placeholder: 'Year'
        },
        {
          name: 'description',
          placeholder: 'Description'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log(data);
            this.loading = this.loadCtrl.create({
              content: 'Please wait...'
            });
            this.loading.present();

            let input = {
              user_id: this.user_id, 
              title: data.title,
              description: data.description,
              year: data.year
            };

            this.data.getOriginalPassword().then((password) =>{
              let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
              this.http.post(this.data.BASE_URL+"auth/addExperience",input,{ headers: headers }).timeout(5000).subscribe(data => {
                let response = data.json();
                this.login();
                this.loading.dismiss();
              }, err => {     
                console.log("error cui :",err);
                this.runTimeError();
                this.loading.dismiss();      
              }); 
            });
          }
        }
      ]
    });
    prompt.present();
  }

  optionEducation(dataTemp){
    
    let prompt = this.alertCtrl.create({
      title: dataTemp.school,
      subTitle:dataTemp.major +"<br>"+dataTemp.year,
      buttons: [
        {
          text: 'Delete',
          handler: data => {
            this.loading = this.loadCtrl.create({
              content: 'Please wait...'
            });
            this.loading.present();
            this.data.getOriginalPassword().then((password) =>{
              let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
              this.http.delete(this.data.BASE_URL+"auth/deleteEducation/"+dataTemp.id,{ headers: headers }).timeout(5000).subscribe(data => {
                let response = data.json();
                this.login();
                this.loading.dismiss();
              }, err => {     
                console.log("error cui :",err);
                this.runTimeError();
                this.loading.dismiss();      
              }); 
            });
          }
        },
        {
          text: 'Edit',
          handler: data => {
            this.editEducation(dataTemp);
          }
        }
      ]
    });
    prompt.present();
  }

  editEducation(dataTemp){
    console.log("dataedit",dataTemp)
    const prompt = this.alertCtrl.create({
      title: 'Education',
      inputs: [
        {
          name: 'school',
          placeholder: 'School',
          value: dataTemp.school
        },
        {
          name: 'major',
          placeholder: 'Major',
          value: dataTemp.major
        },
        {
          name: 'year',
          placeholder: 'Year',
          value: dataTemp.year
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log(data);
            this.loading = this.loadCtrl.create({
              content: 'Please wait...'
            });
            this.loading.present();

            let input = {
              user_id: this.user_id, 
              school: data.school,
              major: data.major,
              year: data.year
            };

            this.data.getOriginalPassword().then((password) =>{
              let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
              this.http.put(this.data.BASE_URL+"auth/updateEducation/"+dataTemp.id,input,{ headers: headers }).timeout(5000).subscribe(data => {
                let response = data.json();
                this.login();
                this.loading.dismiss();
              }, err => {     
                console.log("error cui :",err);
                this.runTimeError();
                this.loading.dismiss();      
              }); 
            });
          }
        }
      ]
    });
    prompt.present();
  }

  addEducation(){
    const prompt = this.alertCtrl.create({
      title: 'Education',
      inputs: [
        {
          name: 'school',
          placeholder: 'School'
        },
        {
          name: 'major',
          placeholder: 'Major'
        },
        {
          name: 'year',
          placeholder: 'Year'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log(data);
            this.loading = this.loadCtrl.create({
              content: 'Please wait...'
            });
            this.loading.present();

            let input = {
              user_id: this.user_id, 
              school: data.school,
              major: data.major,
              year: data.year
            };

            this.data.getOriginalPassword().then((password) =>{
              let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
              this.http.post(this.data.BASE_URL+"auth/addEducation",input,{ headers: headers }).timeout(5000).subscribe(data => {
                let response = data.json();
                this.login();
                this.loading.dismiss();
              }, err => {     
                console.log("error cui :",err);
                this.runTimeError();
                this.loading.dismiss();      
              }); 
            });
          }
        }
      ]
    });
    prompt.present();
  }

  optionSkill(dataTemp){
    
    let prompt = this.alertCtrl.create({
      title: dataTemp.skill,
      buttons: [
        {
          text: 'Delete',
          handler: data => {
            this.loading = this.loadCtrl.create({
              content: 'Please wait...'
            });
            this.loading.present();
            this.data.getOriginalPassword().then((password) =>{
              let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
              this.http.delete(this.data.BASE_URL+"auth/deleteSkill/"+dataTemp.id,{ headers: headers }).timeout(5000).subscribe(data => {
                let response = data.json();
                this.login();
                this.loading.dismiss();
              }, err => {     
                console.log("error cui :",err);
                this.runTimeError();
                this.loading.dismiss();      
              }); 
            });
          }
        },
        {
          text: 'Edit',
          handler: data => {
            this.editSkill(dataTemp);
          }
        }
      ]
    });
    prompt.present();
  }

  editSkill(dataTemp){
    const prompt = this.alertCtrl.create({
      title: 'Skill',
      inputs: [
        {
          name: 'skill',
          placeholder: 'Skill',
          value: dataTemp.skill
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log(data);
            this.loading = this.loadCtrl.create({
              content: 'Please wait...'
            });
            this.loading.present();

            let input = {
              user_id: this.user_id, 
              skill: data.skill
            };

            this.data.getOriginalPassword().then((password) =>{
              let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
              this.http.put(this.data.BASE_URL+"auth/updateSkill/"+dataTemp.id,input,{ headers: headers }).timeout(5000).subscribe(data => {
                let response = data.json();
                this.login();
                this.loading.dismiss();
              }, err => {     
                console.log("error cui :",err);
                this.runTimeError();
                this.loading.dismiss();      
              }); 
            });
          }
        }
      ]
    });
    prompt.present();
  }

  addSkill(){
    const prompt = this.alertCtrl.create({
      title: 'Skill',
      inputs: [
        {
          name: 'skill',
          placeholder: 'Skill'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log(data);
            this.loading = this.loadCtrl.create({
              content: 'Please wait...'
            });
            this.loading.present();

            let input = {
              user_id: this.user_id, 
              skill: data.skill
            };

            this.data.getOriginalPassword().then((password) =>{
              let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
              this.http.post(this.data.BASE_URL+"auth/addSkill",input,{ headers: headers }).timeout(5000).subscribe(data => {
                let response = data.json();
                this.login();
                this.loading.dismiss();
              }, err => {     
                console.log("error cui :",err);
                this.runTimeError();
                this.loading.dismiss();      
              }); 
            });
          }
        }
      ]
    });
    prompt.present();
  }

  optionAchivement(dataTemp){
    
    let prompt = this.alertCtrl.create({
      title: dataTemp.achivement,
      subTitle:dataTemp.form +"<br>"+dataTemp.year,
      buttons: [
        {
          text: 'Delete',
          handler: data => {
            this.loading = this.loadCtrl.create({
              content: 'Please wait...'
            });
            this.loading.present();
            this.data.getOriginalPassword().then((password) =>{
              let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
              this.http.delete(this.data.BASE_URL+"auth/deleteAchievement/"+dataTemp.id,{ headers: headers }).timeout(5000).subscribe(data => {
                let response = data.json();
                this.login();
                this.loading.dismiss();
              }, err => {     
                console.log("error cui :",err);
                this.runTimeError();
                this.loading.dismiss();      
              }); 
            });
          }
        },
        {
          text: 'Edit',
          handler: data => {
            this.editAchivement(dataTemp);
          }
        }
      ]
    });
    prompt.present();
  }

  editAchivement(dataTemp){
    const prompt = this.alertCtrl.create({
      title: 'Achivement',
      inputs: [
        {
          name: 'achivement',
          placeholder: 'Achivement',
          value: dataTemp.achivement
        },
        {
          name: 'form',
          placeholder: 'From',
          value: dataTemp.form
        },
        {
          name: 'year',
          placeholder: 'Year',
          value: dataTemp.year
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log(data);
            this.loading = this.loadCtrl.create({
              content: 'Please wait...'
            });
            this.loading.present();

            let input = {
              user_id: this.user_id, 
              achivement: data.achivement,
              form: data.form,
              year: data.year
            };

            this.data.getOriginalPassword().then((password) =>{
              let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
              this.http.put(this.data.BASE_URL+"auth/updateAchievement/"+dataTemp.id,input,{ headers: headers }).timeout(5000).subscribe(data => {
                let response = data.json();
                this.login();
                this.loading.dismiss();
              }, err => {     
                console.log("error cui :",err);
                this.runTimeError();
                this.loading.dismiss();      
              }); 
            });
          }
        }
      ]
    });
    prompt.present();
  }

  addAchivement(){
    const prompt = this.alertCtrl.create({
      title: 'Achivement',
      inputs: [
        {
          name: 'achivement',
          placeholder: 'Achivement'
        },
        {
          name: 'form',
          placeholder: 'From'
        },
        {
          name: 'year',
          placeholder: 'Year'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log(data);
            this.loading = this.loadCtrl.create({
              content: 'Please wait...'
            });
            this.loading.present();

            let input = {
              user_id: this.user_id, 
              achivement: data.achivement,
              form: data.form,
              year: data.year
            };

            this.data.getOriginalPassword().then((password) =>{
              let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
              this.http.post(this.data.BASE_URL+"auth/addAchievement",input,{ headers: headers }).timeout(5000).subscribe(data => {
                let response = data.json();
                this.login();
                this.loading.dismiss();
              }, err => {     
                console.log("error cui :",err);
                this.runTimeError();
                this.loading.dismiss();      
              }); 
            });
          }
        }
      ]
    });
    prompt.present();
  }

  optionContact(dataTemp){
    
    let prompt = this.alertCtrl.create({
      title: dataTemp.contact,
      subTitle:dataTemp.form,
      buttons: [
        {
          text: 'Delete',
          handler: data => {
            this.loading = this.loadCtrl.create({
              content: 'Please wait...'
            });
            this.loading.present();
            this.data.getOriginalPassword().then((password) =>{
              let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
              this.http.delete(this.data.BASE_URL+"auth/deleteContact/"+dataTemp.id,{ headers: headers }).timeout(5000).subscribe(data => {
                let response = data.json();
                this.login();
                this.loading.dismiss();
              }, err => {     
                console.log("error cui :",err);
                this.runTimeError();
                this.loading.dismiss();      
              }); 
            });
          }
        },
        {
          text: 'Edit',
          handler: data => {
            this.editContact(dataTemp);
          }
        }
      ]
    });
    prompt.present();
  }

  editContact(dataTemp){
    const prompt = this.alertCtrl.create({
      title: 'Contact',
      inputs: [
        {
          name: 'contact',
          placeholder: 'Title',
          value: dataTemp.contact
        },
        {
          name: 'form',
          placeholder: 'Id/Number',
          value: dataTemp.form
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log(data);
            this.loading = this.loadCtrl.create({
              content: 'Please wait...'
            });
            this.loading.present();

            let input = {
              user_id: this.user_id, 
              contact: data.contact,
              form: data.form
            };

            this.data.getOriginalPassword().then((password) =>{
              let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
              this.http.put(this.data.BASE_URL+"auth/updateContact/"+dataTemp.id,input,{ headers: headers }).timeout(5000).subscribe(data => {
                let response = data.json();
                this.login();
                this.loading.dismiss();
              }, err => {     
                console.log("error cui :",err);
                this.runTimeError();
                this.loading.dismiss();      
              }); 
            });
          }
        }
      ]
    });
    prompt.present();
  }

  addContact(){
    const prompt = this.alertCtrl.create({
      title: 'Contact',
      inputs: [
        {
          name: 'contact',
          placeholder: 'Title'
        },
        {
          name: 'form',
          placeholder: 'Id/Number'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log(data);
            this.loading = this.loadCtrl.create({
              content: 'Please wait...'
            });
            this.loading.present();

            let input = {
              user_id: this.user_id, 
              contact: data.contact,
              form: data.form
            };

            this.data.getOriginalPassword().then((password) =>{
              let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
              this.http.post(this.data.BASE_URL+"auth/addContact",input,{ headers: headers }).timeout(5000).subscribe(data => {
                let response = data.json();
                this.login();
                this.loading.dismiss();
              }, err => {     
                console.log("error cui :",err);
                this.runTimeError();
                this.loading.dismiss();      
              }); 
            });
          }
        }
      ]
    });
    prompt.present();
  }


  runTimeError(){
    let alert = this.alertCtrl.create({
      title: 'Failed',
      subTitle: 'Please try again',      
    });
    alert.present();
  }

  login(){
    
    this.data.getOriginalPassword().then((password) =>{

    let input = { 
      user_email: this.user_email,
      user_password:password
    };

    let headers = new Headers({'Authorization':'Basic ' +  btoa(this.user_email + ':' +password) });
      this.http.post(this.data.BASE_URL+"auth/login",input,{ headers: headers }).timeout(5000).subscribe(data => {
        
        let response = data.json();
        console.log(response)
        
        this.data.logout(); //cleaning local storage
        this.data.login(response,"user");//save to local
        this.data.saveOriginalPassword(password);
        this.getUserData(this.user_id);
        this.loading.dismiss();
        
      },  err => {     
        this.loading.dismiss();
        this.runTimeError();
        
      });
    });
  }

}
