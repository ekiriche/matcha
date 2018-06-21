import React, { Component } from 'react';
import jwtDecode from 'jwt-decode';
import { NavLink } from 'react-router-dom';
import history from '../../../history/history';
import { PostData } from '../library/PostData';
import './header.css'

class Nav extends Component {

constructor (props) {
  super(props);
  this.state = {
    test: '',
    user_login: '',
    access: false
  }
}
/* Get user profile id for nav link*/
componentWillMount () {
  let token =  localStorage.getItem('accessToken');
  let id = jwtDecode(token);
  this.setState({test: '/profile/' + id.user_id, user_login: id.uid});
  this.setState({ user_login : id.uid });
  PostData('profile/get_access_level', {user_id: id.user_id}).then ((result) => {
    if (result === 1) {
      this.setState({access: false });
    } else if (result === 2) {
      this.setState({access: true });
    }
  })
}

logOut() {
  let token =  localStorage.getItem('accessToken');
  let id = jwtDecode(token);
  PostData('auth/create_access_token', { username: id.uid, expireTime: 0 }).then ((result) => {
    localStorage.removeItem('accessToken');
    history.push('/');
  })
}
toProfile() {
  window.location.reload();
}

render() {

  if (this.state.access === false) {
    return (
      <div className="col s12 headerBackground z-depth-2">
        <div className="container">
          <nav className="navBoxshadow-none">
            <div className="nav-wrapper headerBackground">
              <p className="brand-logo titleAnimation nav-fix">Matcha</p>
                <ul className="right">
                  <li><NavLink to="/settings" activeStyle={{color:"#431c5d"}}>Settings</NavLink></li>
                  <li><NavLink to="/" onClick={this.logOut}>Logout</NavLink></li>
                </ul>
            </div>
          </nav>
          <ul className="sidenav" id="mobile-demo">
              <li><NavLink to="/settings" activeClassName="linkActive">Settings</NavLink></li>
              <li><NavLink to="/" onClick={this.logOut}>Logout</NavLink></li>
            </ul>
        </div>
      </div>
    )
  } else if (this.state.access === true) {
  return (
    <div className="col s12 headerBackground z-depth-2">
      <div className="container">
        <nav className="navBoxshadow-none">
          <div className="nav-wrapper headerBackground">
            <a className="brand-logo titleAnimation nav-fix">Matcha</a>
              <ul className="right">
                <li><NavLink to="/settings" activeStyle={{color:"#431c5d"}}>Settings</NavLink></li>
                <li><NavLink to={this.state.test} onClick={this.toProfile} activeStyle={{color:"#431c5d"}}>Profile</NavLink></li>
                <li><NavLink to="/search" activeStyle={{color:"#431c5d"}}>Search</NavLink></li>
                <li><NavLink to="/chat" activeStyle={{color:"#431c5d"}}>Chat</NavLink></li>
                <li><NavLink to="/map" activeStyle={{color:"#431c5d"}}>Map</NavLink></li>
                <li><a onClick={this.logOut} >Logout</a></li>
              </ul>
          </div>
        </nav>
        <ul className="sidenav" id="mobile-demo">
            <li><NavLink to="/settings" activeClassName="linkActive">Settings</NavLink></li>
            <li><NavLink to={this.state.test} onClick={this.toProfile}activeClassName="linkActive">Profile</NavLink></li>
            <li><NavLink to="/search" activeClassName="linkActive">Search</NavLink></li>
            <li><NavLink to="/chat" activeClassName="linkActive">Chat</NavLink></li>
            <li><NavLink to="/" onClick={this.logOut}>Logout</NavLink></li>
          </ul>
      </div>
    </div>
  );
  }
}

}

export default Nav;
