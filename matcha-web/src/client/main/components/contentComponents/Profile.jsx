import React, { Component } from 'react';
import { Button, Modal, Chip } from 'react-materialize';
import jwtDecode from 'jwt-decode';
import history from '../../../history/history';

import './css/Profile.css'
import { PostData } from '../library/PostData';

import Slider from './Slider';
import Map from './Map';

class Profile extends Component
{
  constructor(props) {
    super(props);

    this.state = {
      firstname: '',
      lastname: '',
      age: '',
      sexual_preference: '',
      gender: '',
      tags: '',
      fame_rating: '',
      biography: '',
      latitude: '',
      longitude: '',
      getData: false,
      getView: false,
      getLikes: false,
      getLike: false,
      isLikeSet: false,
      socialBlock: false /*div Likes && Visits hide*/
    }
    this.handleLikeSet = this.handleLikeSet.bind(this);
    this.handleReportSet = this.handleReportSet.bind(this);
    this.handleBlockSet = this.handleBlockSet.bind(this);
  }

  componentWillMount() {
    let token =  localStorage.getItem('accessToken');
    let id = jwtDecode(token);
    PostData('auth/create_access_token', { username: id.uid, expireTime: 3600 }).then ((result) => {
      localStorage.setItem('accessToken', result);
    })
    this.conn = new WebSocket('ws://localhost:3001');
    this.conn.handleLikeSet = this.handleLikeSet.bind(this);
    this.setState({currentUser: id.user_id});
      if (parseInt(id.user_id, 10) === parseInt(this.props.match.params.id, 10))
      this.setState({socialBlock: true});
    PostData('profile/get_profile_by_user_id', {user_id: this.props.match.params.id, column: 'all' }).then ((result) => {
      if ( result === false) {
        history.push('/search');
      } else {
        this.setState({
          firstname: result.firstname,
          lastname: result.lastname,
          age: result.age,
          sexual_preference: result.sexual_preference,
          gender: result.gender,
          tags: result.tags.split(","),
          fame_rating: result.fame_rating,
          biography: result.biography,
          latitude: result.latitude,
          longitude: result.longitude,
          location: result.location,
          is_connected: result.is_connected,
          last_visit: result.last_visit,
          img: result.pictures,
          getData: true
        });
      }
    })
    PostData('profile/get_profile_by_user_id', {user_id: id.user_id, column: 'all' }).then ((result) => {
        this.setState({
          fromWhy_firstname: result.firstname,
          fromWhy_lastname: result.lastname
        });
    })

    PostData('likes_views/get_views', {user_id: this.props.match.params.id }).then ((result) => {
      this.setState({
        view: result,
        getView: true
      });
    })

    PostData('likes_views/is_likes', {user_id: id.user_id, target: this.props.match.params.id}).then ((result) => {
      if (result === true) {
        this.setState({isLikeSet: true, getLike: true}) /*fix func isLiked in php*/
      } else {
        this.setState({isLikeSet: false, getLike: true})
      }
    });
    PostData('likes_views/get_likes', {user_id: id.user_id}).then ((result) => {
      this.setState({
        Like: result,
        getLikes: true
      });
    });
    PostData('likes_views/is_reported', {user_id: id.user_id, target: this.props.match.params.id}).then ((result) => {
      if (result === true)
      {
        this.setState({isReportSet: true})
      } else {
        this.setState({isReportSet: false})
      }
    });
    PostData('likes_views/is_blocked', {user_id: id.user_id, target: this.props.match.params.id}).then ((result) => {
      if (result === true)
      {
        this.setState({isBlockSet: true})
      } else {
        this.setState({isBlockSet: false})
      }
    });
  }

  handleLikeSet() {
    PostData('likes_views/handle_like', {user_id: this.state.currentUser, target: this.props.match.params.id}).then ((result) => {
      if (result === 'INSERTED')
      {
        let newfameRating = this.state.fame_rating + 10;
        this.setState({isLikeSet: true, fame_rating: newfameRating })
        this.conn.send(JSON.stringify({ /*set in line 72 for socket*/
            event: 'setLike',
            payload: 'Like you',
            user_id: this.state.currentUser,
            fromWhy_firstname: this.state.fromWhy_firstname,
            fromWhy_lastname: this.state.fromWhy_lastname,
            target_id: this.props.match.params.id
        }))
      } else {
        this.conn.send(JSON.stringify({ /*set in line 72 for socket*/
            event: 'desLike',
            payload: 'Like you',
            user_id: this.state.currentUser,
            fromWhy_firstname: this.state.fromWhy_firstname,
            fromWhy_lastname: this.state.fromWhy_lastname,
            target_id: this.props.match.params.id
        }))
        let newfameRating = this.state.fame_rating - 10;
        this.setState({isLikeSet: false, fame_rating: newfameRating })
      }
    })
  }

  handleReportSet() {
    PostData('likes_views/report_user', {user_id: this.state.currentUser, target: this.props.match.params.id}).then ((result) => {
      if (result === 'REPORTED' )
      {
        this.conn.send(JSON.stringify({ /*set in line 72 for socket*/
            event: 'REPORTED',
            payload: 'Reported you',
            user_id: this.state.currentUser,
            fromWhy_firstname: this.state.fromWhy_firstname,
            fromWhy_lastname: this.state.fromWhy_lastname,
            target_id: this.props.match.params.id
        }))
        this.setState({isReportSet: true});
      }
    })
  }
  handleBlockSet() {
    PostData('likes_views/block_user', {user_id: this.state.currentUser, target: this.props.match.params.id}).then ((result) => {
      if (result === 'BLOCKED' )
      {
        this.conn.send(JSON.stringify({ /*set in line 72 for socket*/
            event: 'BLOCKED',
            payload: 'Blocked you',
            user_id: this.state.currentUser,
            fromWhy_firstname: this.state.fromWhy_firstname,
            fromWhy_lastname: this.state.fromWhy_lastname,
            target_id: this.props.match.params.id
        }))
        this.setState({isBlockSet: true});
      }
    })
  }

  render()
  {
    if (this.state.getData === false || this.state.getView === false || this.state.getLike === false || this.state.getLikes === false) { /*Preloader*/
      return (
        <div className="progress">
          <div className="indeterminate"></div>
        </div>
      )
    }

    if (this.state.socialBlock === false ) { /*Set guests*/
      PostData('likes_views/handle_view', {user_id: this.state.currentUser, target: this.props.match.params.id}).then ((result) => {
        if (result !== "ALREADY VIEWED") {
          this.conn.send(JSON.stringify({ /*set in line 72 for socket*/
              event: 'view',
              user_id: this.state.currentUser,
              fromWhy_firstname: this.state.fromWhy_firstname,
              fromWhy_lastname: this.state.fromWhy_lastname,
              target_id: this.props.match.params.id
          }))
        }
      })
    }

    const numbers = this.state.view /*List of users who view profile*/
    const listItems = numbers.map((number, i) =>
        <li key={i}>
          <Chip className="chips-profile-view">
            <img src={number.path} alt="user"/>
            <a >{number.firstname} {number.lastname}</a>
          </Chip>
        </li>
      )

    const numbersImg = this.state.img /*List of img current profile*/
    const listImg = numbersImg.map((numbersImg, i) =>
        <div key={i}>
          <img src={numbersImg.path} alt="user" className="img-slider"/>
        </div>
      )

    const Likes = this.state.Like /*List of img current profile*/
    const listLike = Likes.map((Likes, i) =>
      <li key={i}>
        <Chip className="chips-profile-view">
          <img src={Likes.path} alt="user"/>
          <a >{Likes.firstname} {Likes.lastname}</a>
        </Chip>
      </li>
      )

    const tags = this.state.tags /*Tags */
    const listTags = tags.map((tags, i) =>
        <div key={i} className="chip">
          {tags}
        </div>
      )
    return (

      <div className="row">
        <div className="row">
          <div className="col s1 m0 l4"></div>
          <div className="col s12 m10 l5 xl5">
            <div className="card">
              <div className="card-image">
                <Slider id="dude">
                  {listImg}
                </Slider>
                { this.state.socialBlock === false && (
                <a className="btn-floating btn-large waves-effect waves-light red likes-position" onClick={ this.handleLikeSet }>
                  {(this.state.isLikeSet === true)
                     ? <i className="large material-icons">clear</i>
                     : <i className="large material-icons like">check</i>
                   }
                </a>
              )}
              </div>
              <div className="card-content">
                  {this.state.socialBlock === true && (
                    <div className="row">
                      <div className="col l6">
                        <Modal header="Likes" fixedFooter trigger={<Button className='profileButtomWidth'>Likes</Button>}>
                          <ul>{listLike}</ul>
                        </Modal>
                      </div>
                      <div className="col l6">
                        <Modal header="Visits" fixedFooter trigger={<Button className='profileButtomWidth'>Visits</Button>}>
                          <ul>{listItems}</ul>
                        </Modal>
                      </div>
                    </div>
                  )}
                <h5>{this.state.firstname} {this.state.lastname} </h5>
                <p>Age :<span> {this.state.age} </span></p>
                <p><span>{this.state.sexual_preference}</span>, <span>{this.state.gender}</span></p>
                <p>Location :<span> {this.state.location} </span></p>
                <div>Interests : {listTags}</div>
                <p>Popularity : <span className="popularity">{this.state.fame_rating}</span></p>
                {this.state.is_connected ? ( <span className="connected">Connected</span> ) : ( <span className="disconnected">Disconnected</span> )}
                { this.state.is_connected === false && ( <p>Last visit : {this.state.last_visit}</p> ) }
                <p>Biography: {this.state.biography}</p>
              </div>
              <Map
                latitude={this.state.latitude}
                longitude={this.state.longitude}
                />
              {this.state.socialBlock === false && (
                    <div className="row profile-report-btn-margin">
                      {(this.state.isBlockSet !== false)
                        ? <a className="btn disabled btn-small-profile btn-disabled"><i className="material-icons left">check</i>blocked</a>
                        : <a className="btn-small btn-small-profile btn-report waves-effect waves-light" onClick={ this.handleBlockSet }><i className="material-icons left">block</i>block</a>
                      }
                      {(this.state.isReportSet !== false  )
                        ?   <a className="btn disabled btn-small-profile btn-disabled"><i className="material-icons left">mood_bad</i>report</a>
                        :   <a className="btn-small btn-small-profile btn-report waves-effect waves-light" onClick={ this.handleReportSet }><i className="material-icons left">mood_bad</i>report</a>
                      }
                    </div>
                )}
            </div>
          </div>
          <div className="col s1 m0 l3"></div>
        </div>
      </div>
    )
  }
}

export default Profile
