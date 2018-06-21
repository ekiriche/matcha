import React, { Component } from 'react';

import Input from '../library/Input';
import { PostData } from '../library/PostData';
import history from '../../../history/history';

class FormSignIn extends Component  {

  constructor(props) {
    super(props);
    this.state = {
      login: '',
      password: '',
      loginFalse: '',
      loginIn: false
    };
    this.handleLoginChange = this.handleLoginChange.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    PostData('auth/signin', this.state).then ((result) => {
      if (result === false) {
        this.setState({ loginFalse: 'invalid login or password' });
      } else if (result.level.is_authorised === 1) {
        localStorage.setItem('accessToken', result.jwtAccess);
        this.setState({loginIn: true});
        history.push('/settings');
      } else if (result.level.is_authorised === 2) {
        localStorage.setItem('accessToken', result.jwtAccess);
        this.setState({loginIn: true});
        history.push('/search');
      }
    })
  }

  /*
      const token = localStorage.getItem("refreshToken");
      if (jwtDecode(token).exp < Date.now() / 1000) {
        localStorage.clear();
      }

      console.log(jwtDecode(token).exp);
      console.log(Date.now() / 1000);
  */

  handleLoginChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }


  handlePassword(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  render() {
    const { loginFalse } = this.state

    return (
      <form className="card-content" onSubmit={this.handleSubmit.bind(this)}>
        <div className="row">
          <div className="input-field col s12">
            <Input type="text" name="login" required className="validate" id="login" value={this.state.login} onChange={this.handleLoginChange}/>
            <label htmlFor="login">Login</label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <Input type="password" name="password" required className="validate" id="singInPassword" value={this.state.password} onChange={this.handlePassword}/>
            <label htmlFor="password">Password</label>
          </div>
        </div>
        <div className="row registrationFormError">
          <button type="submit" className="waves-effect waves-light btn-small btn-color">Sign in</button>
          { loginFalse && ( <span className="alert alert-danger">{this.state.loginFalse}</span>)}
        </div>
    </form>
    );
  }
}
export default FormSignIn;
