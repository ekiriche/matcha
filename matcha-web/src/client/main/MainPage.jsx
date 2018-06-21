import React, { Component } from 'react';
import { Router, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PostData } from './components/library/PostData';
import jwtDecode from 'jwt-decode';
import history from '../history/history';

import './MainPage.css';

//components
import Header from './components/headerComponents/Header';
import Profile from './components/contentComponents/Profile';
import Settings from './components/contentComponents/Settings';
import Chat from './components/contentComponents/Chat';
import InteractiveMap from './components/contentComponents/GlobalMap';
import Search from './components/contentComponents/Search';
import Footer from './components/footerComponents/Footer';

class MainPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentUser: '',
      currentUserId: '',
      access: false,
      mainPreloader: false,
      profileFull: false,
      container: ''
    }
    this.someMethod = this.someMethod.bind(this);
  }

  componentWillMount() {
    let token =  localStorage.getItem('accessToken');
    let id = jwtDecode(token);
    this.setState({currentUser: id.uid, currentUserId: id.user_id});
    PostData('profile/get_access_level', {user_id: id.user_id}).then ((result) => {
      if (result === 1) {
        this.setState({access: false });
      } else if (result === 2) {
        this.setState({access: true });
      }
      this.conn = new WebSocket('ws://localhost:3001');
      this.conn.onmessage = this.onMessage.bind(this);
      this.setState({mainPreloader: true});
    })
    PostData('auth/create_access_token', { username: id.uid, expireTime: 3600 }).then ((result) => {
      localStorage.setItem('accessToken', result);
    })
  }

  onMessage(event) {
    const data = JSON.parse(event.data);
      if (parseInt(data.target_id, 10) === parseInt(this.state.currentUserId, 10) && parseInt(data.target_id, 10) !== parseInt(data.user_id, 10))
      {
          PostData('likes_views/is_blocked', {user_id: data.target_id, target: data.user_id}).then ((result) => {
            if (result === false)
            {
              if (data.event === 'setLike')
                toast(`${data.fromWhy_firstname} ${data.fromWhy_lastname} liked you`);
              else if (data.event === 'desLike')
                toast(`${data.fromWhy_firstname} ${data.fromWhy_lastname} disliked you`);
              else if (data.event === 'BLOCKED')
                toast(`${data.fromWhy_firstname} ${data.fromWhy_lastname} blocked you`);
              else if (data.event === 'REPORTED')
                toast(`${data.fromWhy_firstname} ${data.fromWhy_lastname} reported you`);
              else if (data.event === 'view')
                toast(`${data.fromWhy_firstname} ${data.fromWhy_lastname} viewed your profile`);
              else if ( data.event > 0 )
                toast(`${data.fromWhy_firstname} ${data.fromWhy_lastname} sent you message`);
            }
          })
      }
  }

  someMethod() {
    window.location.reload();
    history.push('/search');
  }

  render()
  {
    if (this.state.mainPreloader === false) {
      return (
        <div className="preloader-wrapper big active preloader-position">
          <div className="spinner-layer spinner-blue">
            <div className="circle-clipper left">
              <div className="circle"></div>
            </div><div className="gap-patch">
              <div className="circle"></div>
            </div><div className="circle-clipper right">
              <div className="circle"></div>
            </div>
          </div>
        </div>
      )
    }
    else if (this.state.access !== true && this.state.mainPreloader === true) {
      return (
        <Router history={history}>
          <div className="appFlex">
            <Header />
            <Route exact path="/settings" component={(props) => (<Settings login={this.state.currentUser} parentMethod={this.someMethod}/>)}/>
            <Footer />
          </div>
        </Router>
      )
    } else if (this.state.access === true && this.state.mainPreloader === true ) {
      return (
        <Router history={history}>
          <div className="appFlex">
            <Header />
            <ToastContainer autoClose={8000} />
            <Route path="/settings" component={(props) => (<Settings login={this.state.currentUser}/>)}/>
            <Route path="/profile/:id" component={Profile} />
            <Route path="/search" component={(props) => (<Search id={this.state.currentUserId}/>)} />
            <Route path="/chat" component={Chat}/>
            <Route path="/map" component={InteractiveMap}/>
            <Footer />
          </div>
        </Router>
      );
    }
  }
}
export default MainPage
