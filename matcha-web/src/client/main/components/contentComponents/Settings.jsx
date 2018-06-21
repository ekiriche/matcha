import React, { Component } from 'react';
import jwtDecode from 'jwt-decode';
import './css/Settings.css'
import { PostData } from '../library/PostData';

class Settings extends Component
{

  constructor(props)
  {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
      email: '',
      tags: '',
      old_password: '',
      new_password: '',
      biography: '',
      birthdate: '',
      age: '',
      gender: '',
      sexual_preference: '',
      login: props.login,
      column: 'all',
      errors: '',
      errorMainPicture: false,
      errorAdditionalPhotos: '',
      img_main: '',
      location: '',
      data_loaded: false,
      editProfile: false,
      editMainPhoto: false,
      editAdditionalPhotos: false,
      editPassword: false,
      access: 0
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangePasswordSubmit = this.handleChangePasswordSubmit.bind(this);
    this.handleGenderChange = this.handleGenderChange.bind(this);
    this.handleSexualPreferenceChange = this.handleSexualPreferenceChange.bind(this);
    this.handleBiographyChange = this.handleBiographyChange.bind(this);
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleTagsChange =this.handleTagsChange.bind(this);
    this.handleOldPasswordChange = this.handleOldPasswordChange.bind(this);
    this.handleNewPasswordChange = this.handleNewPasswordChange.bind(this);
    this.handleAgeChange = this.handleAgeChange.bind(this);
    this.handleFiles = this.handleFiles.bind(this);
    this.removeMe = this.removeMe.bind(this);
    this.MainPictureSelected = this.MainPictureSelected.bind(this);
    this.handleChangeFields = this.handleChangeFields.bind(this);
    this.handleChangeMainPictureSubmit = this.handleChangeMainPictureSubmit.bind(this);
    this.handleChangeAdditionalPicturesSubmit = this.handleChangeAdditionalPicturesSubmit.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.getAllInfo(this);
  }

  componentWillMount() {
    let token =  localStorage.getItem('accessToken');
    let id = jwtDecode(token);
    PostData('auth/create_access_token', { username: id.uid, expireTime: 3600 }).then ((result) => {
      localStorage.setItem('accessToken', result);
    })
    PostData('profile/get_access_level', {user_id: id.user_id}).then ((result) => {
      this.setState({ access : result });
    })

  }

  handleSubmit(event)
  {
    event.preventDefault();
    this.handleAgeChange();
    this.handleBiographyChange();
    this.handleFirstNameChange();
    this.handleLastNameChange();
    this.handleEmailChange();
    this.handleTagsChange();
    this.handleGenderChange();
    this.handleSexualPreferenceChange();
    this.handleLocationChange();
/*    let formated_tags = this.state.tags.replace(/\s/g, '');
    formated_tags = formated_tags.split(',');
    console.log(formated_tags);
    this.setState({ tags : formated_tags });
    console.log(this.state.tags);*/
    let token =  localStorage.getItem('accessToken');
    let id = jwtDecode(token);
    setTimeout(function() {
      PostData('profile/edit', this.state).then ((result) => {
      if (result === "OK")
      {
        this.setState({ errors : '' });
        this.setState({ editProfile : true });
      }
      else
        this.setState({ errors : result });
      PostData('profile/get_access_level', {user_id: id.user_id}).then ((result) => {
          if (this.state.access === 1 && result === 2) {
            this.setState({access: 3});
            this.props.parentMethod();
          }
      })
    })}.bind(this), 25);

  }

  handleChangePasswordSubmit(event)
  {
    event.preventDefault();
    this.handleOldPasswordChange();
    this.handleNewPasswordChange();
    this.setState({ errors : '' });
    setTimeout(function() {
      PostData('profile/change_password', this.state).then ((result) => {
        if (result !== "OK")
        {
          this.setState({ old_password : result });
        }
        else
          this.setState({ editPassword : true });
      })}.bind(this), 1);
  }

  handleChangeMainPictureSubmit(event)
  {
    event.preventDefault();
    let token =  localStorage.getItem('accessToken');
    let id = jwtDecode(token);
    if (!this.MainPictureSelected())
    {
      this.setState({ errorMainPicture : true });
      return ;
    }
    this.setState({ errorMainPicture : false });
    var c = document.getElementsByClassName('profile_picture')[0].src;
    setTimeout(function() {
      PostData('profile/post_main_picture', [c, this.state.login]).then ((result) => {
        this.setState({ editMainPhoto : true });
        PostData('profile/get_access_level', {user_id: id.user_id}).then ((result) => {
            if (this.state.access === 1 && result === 2) {
              this.setState({access: 3});
              this.props.parentMethod();
            }
        })
      });
    }.bind(this), 100);
  }

  handleChangeAdditionalPicturesSubmit(event)
  {
    event.preventDefault();
    if (this.MainPictureSelected() === false)
    {
      this.setState({ errorAdditionalPhotos : 'main_photo' });
      return ;
    }
    this.setState({ errorAdditionalPhotos : '' });
    var c = [];
    var images = document.getElementsByClassName('profile_images');
    var i = 0;
    while (images[i])
    {
      c[i] = images[i].src;
      i++;
    }
    setTimeout(function() {
      PostData('profile/post_additional_pictures', [c, this.state.login]).then ((result) => {
        this.setState({ editAdditionalPhotos : true });
      })
    }.bind(this), 100);
  }

  handleMainPicture(selectorFiles: FileList)
  {
    if (!this.MainPictureSelected())
    {
      var reader = new FileReader();
      var new_img = document.createElement('img');
      var img_tag = document.getElementById('main_image');

      reader.readAsDataURL(selectorFiles[0]);
      reader.onloadend = function() {
        new_img.setAttribute('src', reader.result);
        new_img.setAttribute('class', 'profile_picture card');
        new_img.setAttribute('style', 'max-width: 100px; max-height: 100px;');
        new_img.setAttribute('onClick', '{ this.removeMe }');
        new_img.setAttribute('alt', 'Main');
        img_tag.appendChild(new_img);
      }
    }
  }

  MainPictureSelected()
  {
    if (document.querySelectorAll('img.profile_picture').length === 0)
      return false;
    return true;
  }

  handleFiles(selectorFiles: FileList, num, class_to_render)
  {
    var images_number = document.querySelectorAll('img.profile_images').length;
    if (document.querySelectorAll('img.profile_picture').length === 0)
    {
      this.setState({ noMainImageSelected : true });
      return false;
    }
    this.setState({ noMainImageSelected : false });
    if (images_number < 4)
    {
      var reader = new FileReader();
      reader.readAsDataURL(selectorFiles[0]);
      reader.onloadend = function() {
        var new_img = document.createElement('img');
        var img_tag = document.getElementById(class_to_render);
        new_img.setAttribute('src', reader.result);
        new_img.setAttribute('class', 'profile_images card');
        new_img.setAttribute('style', 'max-width: 100px; max-height: 100px; margin: 0.5%;');
        new_img.setAttribute('alt', 'Additional');
        img_tag.appendChild(new_img);
      }
    }
  }


  handleAgeChange(event)
  {
    var birthdate_input = document.getElementsByClassName("birthdate")[0].value;
    this.setState({ birthdate : birthdate_input });
    var birthday_to = new Date(birthdate_input);
    var converted_age = Math.floor((Date.now() - birthday_to) / (31557600000));
    this.setState({ age : converted_age });
  }

  handleGenderChange(event)
  {
    var change = document.getElementsByClassName("gender")[0].value;
    this.setState({ gender : change });
  }

  handleSexualPreferenceChange(event)
  {
    var change = document.getElementsByClassName("sexual_preference")[0].value;
    this.setState({ sexual_preference : change });
  }

  handleBiographyChange(event)
  {
    var change = document.getElementById("biography").value;
    this.setState({ biography : change });
  }

  handleFirstNameChange(event)
  {
    var change = document.getElementById("first_name").value;
    this.setState({ firstname : change });
  }

  handleLastNameChange(event)
  {
    var change = document.getElementById("last_name").value;
    this.setState({ lastname : change });
  }

  handleLocationChange(event)
  {
    var change = document.getElementById("location").value;
    this.setState({ location : change });
  }

  handleEmailChange(event)
  {
    var change = document.getElementById("email").value;
    this.setState({ email : change });
  }

  handleOldPasswordChange(event)
  {
    var change = document.getElementById("old_password").value;
    this.setState({ old_password : change });
  }

  handleNewPasswordChange(event)
  {
    var change = document.getElementById("new_password").value;
    this.setState({ new_password : change });
  }

  handleTagsChange(event)
  {
    var change = document.getElementById("tags").value;
    this.setState({ tags : change });
  }

  getAllInfo(event)
  {
    if (this.state.login === '')
      return ;
    PostData('profile/get_profile', this.state ).then ((result) => {

      this.setState({ firstname : result['firstname'] });
      this.setState({ lastname : result['lastname'] });
      this.setState({ email : result['email'] });
      if (result['tags'] === undefined)
        this.setState({ tags : '' });
      else
        this.setState({ tags : result['tags'] });
      if (result['biography'] === undefined)
        this.setState({ biography : '' });
      else
        this.setState({ biography : result['biography'] });
        if (result['birthdate'] === undefined)
          this.setState({ birthdate : '' });
        else
          this.setState({ birthdate : result['birthdate'] });
      this.setState({ gender : result['gender'] });
      this.setState({ sexual_preference : result['sexual_preference'] });
      this.setState({ age : result['age'] });
      if (result['location'] === undefined)
        this.setState({ location : '' });
      else
        this.setState({ location : result['location'] });

      let i = 0;
      if (result['pictures'] !== undefined)
      {
      while (result['pictures'][i])
      {
        let name = 'img' + i;
        if (result['pictures'][i].is_main_picture === 1)
          this.setState({ img_main : result['pictures'][i].path });
        else
          this.setState({ [name] : result['pictures'][i].path });
        i++;
      }
    }
          this.setState({ data_loaded : true });
    })
  }

  handleChangeFields(event)
  {
    this.setState({ [event.target.name] : event.target.value });
  }

  removeMe(event)
  {
    event.target.remove();
  }

  render()
  {
    if (this.state.data_loaded === false)
      return (  <div className="progress">
          <div className="indeterminate"></div>
        </div>);
    return (
    <div className="appFlex">
      <div className="row z-depth-4 margin-top-bottom prfile-padding">
        {(this.state.access === 1) ? (
        <div>
          <h4>General Information</h4>
          <p>Thank you for choosing Matcha in your search for the perfect partner.</p>
          <p>Answering the questions takes about 3 - 5 minutes and helps us find the most compatible partners for you.</p>
          <p>Please take your time and answer as honestly as possible.</p>
        </div>
      ) : (<h4>Here you can change your profile</h4>)
      }
     <form onSubmit={this.handleSubmit}>
       <h5>Profile information</h5>
       <div className="col s6">
         <div className="row">
          <label>Gender</label>
           <select value={this.state.gender} onChange={this.handleChangeFields} name="gender" className="gender">
             <option value="male">Male</option>
             <option value="female">Female</option>
           </select>
         </div>
      </div>
      <div className="col s6">
        <div className="row">
          <label>Sexual preference</label>
          <select value={this.state.sexual_preference} onChange={this.handleChangeFields} name="sexual_preference" className="sexual_preference">
            <option value="heterosexual">Heterosexual</option>
            <option value="homosexual">Homosexual</option>
            <option value="bisexual">Bisexual</option>
          </select>
        </div>
     </div>
       <div className="col s12">
        <div className="row">
          <div className="input-field">
            <input type="text" className="birthdate" name="birthdate" value={ this.state.birthdate } onChange={ this.handleChangeFields }/>
            { this.state.birthdate ? ( <label className="active">Birthdate : dd mm yyyy </label> ) : ( <label>Birthdate : dd mm yyyy </label> )}
            {this.state.errors.birthdate && ( <span className="invalidInput">{this.state.errors.birthdate[0]}</span>)}
            {this.state.errors.age && ( <span className="invalidInput">{this.state.errors.age[0]}</span>)}
          </div>
        </div>
      </div>
       <div className="col s12">
        <div className="row">
          <div className="input-field">
            <input type="text" id="biography" name="biography" maxLength="200" value={ this.state.biography } onChange={ this.handleChangeFields }/>
            { this.state.biography ? ( <label className="active">Biography</label> ) : ( <label>Biography</label> )}
            {this.state.errors.biography && ( <span className="invalidInput">{this.state.errors.biography[0]}</span>)}
          </div>
        </div>
      </div>
      <div className="col s12">
        <div className="row">
          <div className="input-field">
          { this.state.tags ? ( <label className="active">Tags (Format: tag1,tag2,tag3...)</label> ) : ( <label>Tags (Format: tag1,tag2,tag3...)</label> )}
            <input type="text" className="tags" id="tags" name="tags" value={this.state.tags} onChange={this.handleChangeFields}/>
            {this.state.errors.tags && ( <span className="invalidInput">{this.state.errors.tags[0]}</span>)}
          </div>
        </div>
      </div>
      <div className="col s12">
        <div className="row">
          <div className="input-field">
            { this.state.location ? ( <label className="active">Address (optional exp: London)</label> ) : ( <label>Address (optional exp: London)</label> )}
            <input type="text" className="location" id="location" name="location" value={this.state.location} onChange={this.handleChangeFields}/>
            {this.state.errors.location && ( <span className="invalidInput">{this.state.errors.location}</span>)}
          </div>
        </div>
      </div>
      <h5>Account information</h5>
      <div className="row">
         <div className="input-field col s6">
            <input type="text" name="firstname" id="first_name" value={ this.state.firstname } onChange={ this.handleChangeFields }/>
          { this.state.firstname ? ( <label className="active">First Name</label> ) : ( <label>First Name</label> )}
          {this.state.errors.firstname && ( <span className="invalidInput">{this.state.errors.firstname[0]}</span>)}
         </div>
         <div className="input-field col s6">
            <input type="text" name="lastname" id="last_name" value={ this.state.lastname } onChange={ this.handleChangeFields }/>
          { this.state.lastname ? ( <label className="active">Last Name</label> ) : ( <label>Last Name</label> )}
          {this.state.errors.lastname && ( <span className="invalidInput">{this.state.errors.lastname[0]}</span>)}
         </div>
         <div className="input-field col s12">
          <input type="text" name="email" id="email" value={ this.state.email } onChange={ this.handleChangeFields }/>
         { this.state.email ? ( <label className="active">Email</label> ) : ( <label>Email</label> )}
         {this.state.errors.email && ( <span className="invalidInput">{this.state.errors.email[0]}</span>)}
         </div>
         { this.state.editProfile === true && ( <span className="alert alert-success">Changes saved!</span>)}
       </div>
       <button type="submit" className="waves-effect waves-light btn-small btn-color">Apply changes</button>
     </form>
     <h5>Main profile photo</h5>
     <form onSubmit={ this.handleChangeMainPictureSubmit }>
     <div className="col s12">
      <div className="row">
        <div className="input-field">
          <div className="file-field input-field">
          <div className="btn">
            <span>Main profile photo</span>
            <input type="file" accept=".png, .jpg, .jpeg" onChange={ (e) => this.handleMainPicture(e.target.files) }/>
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" placeholder="Upload your main profile photo"/>
          </div>
        </div>
        { this.state.errorMainPicture === true && ( <span className="invalidInput">Photo is not selected</span> ) }
         </div>
       </div>
     </div>
     <div id="main_image">
     {this.state.img_main && ( <img src={this.state.img_main} style={{width: 100, height: 100}} className="card profile_picture" alt='Main' onClick={ this.removeMe }/> )}
     </div>
     <div>
     { this.state.editMainPhoto === true && ( <span className="alert alert-success">Changes saved!</span>)}
     </div>
     <button type="submit" className="waves-effect waves-light btn-small btn-color">Change main photo</button>
     </form>
     <h5>Additional profile photos</h5>
     <form onSubmit={ this.handleChangeAdditionalPicturesSubmit }>
     <div className="col s12">
      <div className="row">
        <div className="input-field">
          <div className="file-field input-field">
          <div className="btn">
            <span>Profile pictures</span>
            <input type="file" accept=".png, .jpg, .jpeg" multiple onChange={ (e) => this.handleFiles(e.target.files, 4, 'images') }/>
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" placeholder="Upload your additional photos (max 4)"/>
          </div>
          { this.state.errorAdditionalPhotos === 'main_photo' &&  ( <span className="invalidInput">You must select main photo first</span> )}
          { this.state.errorAdditionalPhotos === 'no_select' &&  ( <span className="invalidInput">No photos selected</span> )}
        </div>
         </div>
       </div>
     </div>
     <div id="images">
       <div className="col s12">
         { this.state.img0 && ( <img src={this.state.img0} style={{width: 100, height: 100, "margin": "0.5%"}} alt='Additional' className="card profile_images" onClick={ this.removeMe }/> ) }
         { this.state.img1 && ( <img src={this.state.img1} style={{width: 100, height: 100, "margin": "0.5%"}} alt='Additional' className="card profile_images" onClick={ this.removeMe }/> ) }
         { this.state.img2 && ( <img src={this.state.img2} style={{width: 100, height: 100, "margin": "0.5%"}} alt='Additional' className="card profile_images" onClick={ this.removeMe }/> ) }
         { this.state.img3 && ( <img src={this.state.img3} style={{width: 100, height: 100, "margin": "0.5%"}} alt='Additional' className="card profile_images" onClick={ this.removeMe }/> ) }
         { this.state.img4 && ( <img src={this.state.img4} style={{width: 100, height: 100, "margin": "0.5%"}} alt='Additional' className="card profile_images" onClick={ this.removeMe }/> ) }
       </div>
     </div>
     <div>
     { this.state.editAdditionalPhotos === true && ( <span className="alert alert-success">Changes saved!</span>)}
     </div>
     <button type="submit" className="waves-effect waves-light btn-small btn-color">Change addtional photos</button>
     </form>
       <h4>Change password</h4>
       <form onSubmit={ this.handleChangePasswordSubmit }>
       <div className="row">
          <div className="input-field col s12">
            <input type="password" name="old_password" id="old_password"/>
            <label>Old password</label>
            {this.state.errors.old_password && ( <span className="invalidInput">Password is wrong</span>)}
          </div>
          <div className="input-field col s12">
            <input type="password" name="new_password" id="new_password"/>
            <label>New password</label>
            {this.state.errors.new_password && ( <span className="invalidInput">{this.state.errors.new_password[0]}</span>)}
          </div>
          { this.state.editPassword === true && ( <span className="alert alert-success">Changes saved!</span>)}
       </div>
       <button type="submit" className="waves-effect waves-light btn-small btn-color">Change password</button>
       </form>
   </div>
  </div>
  )
  }
}

export default Settings
