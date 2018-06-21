import React, { Component } from 'react';
import { Modal, Button} from 'react-materialize';
import jwtDecode from 'jwt-decode';

import './css/Chat.css'
import { PostData } from '../library/PostData';

class Chat extends Component
{
  constructor(props) {
    super(props);
    this.state = {
      accessChat: false,
      sendUser: '',
      currentUser: '',
      message: '',
      messages: [],
      chat_history: []
    }
  }

  componentWillMount() {
    let token =  localStorage.getItem('accessToken');
    let id = jwtDecode(token);
    PostData('auth/create_access_token', { username: id.uid, expireTime: 3600 }).then ((result) => {
      localStorage.setItem('accessToken', result);
    })
    this.conn = new WebSocket('ws://localhost:3001');
    this.setState({currentUser: id.user_id});
    this.conn.onmessage = this.onMessage.bind(this);
    PostData('likes_views/get_connected', { user_id: id.user_id }).then ((result) => {
      this.setState({withWhoUserCanChat: result, accessChat: true});
    })
    PostData('profile/get_profile_by_user_id', {user_id: id.user_id, column: 'all' }).then ((result) => {
        this.setState({
          fromWhy_firstname: result.firstname,
          fromWhy_lastname: result.lastname
        });
    })
  }

  onMessage(event) {
    const data = JSON.parse(event.data)
    if (data.type === 'text' ) {
      const messages = this.state.messages
      //let sender = data.target_id;
      //let reciver = data.user_id;
      messages.push(data.payload)
      this.setState({messages, reciver: data.user_id, sender: data.target_id})
    }
    setTimeout(function() {
      PostData('profile/get_chat_history', this.state).then ((result) => {
        this.setState({ chat_history : result });
      });
    }.bind(this), 100);
  }

  onSubmit(event) {
    event.preventDefault();
    let tmp = this.state.sendUser;
    const message = this.refs[tmp].value.trim();
    this.refs[tmp].value = '';
      this.setState({ message : message });
      this.conn.send(JSON.stringify({
        event: this.state.sendUser,
        payload: message,
        user_id: this.state.currentUser,
        target_id: this.state.sendUser,
        fromWhy_firstname: this.state.fromWhy_firstname,
        fromWhy_lastname: this.state.fromWhy_lastname
    }))
    setTimeout(function() {
        PostData('profile/add_to_chat_history', this.state).then ((result) => {
      });
    }.bind(this), 50);
    setTimeout(function() {
      PostData('profile/get_chat_history', this.state).then ((result) => {
        this.setState({ chat_history : result });
      });
    }.bind(this), 100);
  }

  handleClick = (event) => {
      let target = event.target;
      let id = target.id
      if (id !== '')
        this.setState({sendUser: id});
        setTimeout(function() {
          PostData('profile/get_chat_history', this.state).then ((result) => {
            this.setState({ chat_history : result });
          });
        }.bind(this), 10);
      }

  render()
  {
    if (this.state.accessChat === false) { /*Preloader*/
      return (
        <div className="progress">
          <div className="indeterminate"></div>
        </div>
      )
    }
    const users = this.state.withWhoUserCanChat
    const chatList = users.map((users, i) =>
    <li key={i} className="collection-item avatar" onClick={this.handleClick}>
      <img src={users.path} alt="" className="circle"/>
      <span className="title">{users.firstname}</span>
      <p>{users.lastname}</p>
        <Modal header="Chatroom" fixedFooter trigger={<Button className='profileButtomWidth' id={users.target}>Begin chat</Button>}>
          <div>
            <ul className="MessageList">
              {this.state.chat_history.map((message, i) => (
                <div key={i}>
                  <label>{message.firstname} {message.lastname}</label>
                  <li className="MessageItem">{message.message}</li>
                </div>
              ))}
            </ul>
            <form className="Form" onSubmit={this.onSubmit.bind(this)}>
              <input ref={users.target} />
            </form>
          </div>
        </Modal>
    </li>
    )

    return (
      <div className="row">
        <div className="col s12 m5">
          <div className="chat-width">
            <ul className="collection">
              {chatList}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}
/*
{this.state.messages.map((message, i) => (
  <li className={"MessageItem"} >{message}</li>
))}*/

export default Chat
