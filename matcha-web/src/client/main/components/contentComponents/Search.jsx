import React, { Component } from 'react';
import InputRange from 'react-input-range';
import jwtDecode from 'jwt-decode';
import { NavLink } from 'react-router-dom';

import './css/Search.css'
import 'react-input-range/lib/css/index.css';
import { PostData } from '../library/PostData';

class Search extends Component
{
  constructor(props) {
    super(props);
    this.state = {
      valueAge: { min: 19, max: 50 },
      valueDistance: 1500,
      valueRating: { min: 0, max: 1500 },
      tags: '',
      user_id: this.props.id,
      getData: false,
      userData: '',
      isAgeChecked: false,
      isDistanceChecked: false,
      isTagsChecked: false,
      isRatingChecked: false
    };
    this.handleStartSearch = this.handleStartSearch.bind(this);
    this.handleTagsChange = this.handleTagsChange.bind(this);
    this.ageChange = this.ageChange.bind(this);
    this.distanceChange = this.distanceChange.bind(this);
    this.tagsChange = this.tagsChange.bind(this);
    this.ratingChange = this.ratingChange.bind(this);


  }

  componentWillMount() {
    let token =  localStorage.getItem('accessToken');
    let id = jwtDecode(token);
    PostData('auth/create_access_token', { username: id.uid, expireTime: 3600 }).then ((result) => {
      localStorage.setItem('accessToken', result);
    })
    PostData('browse/ultimate_search', {
                                        minAge: this.state.valueAge.min,
                                        maxAge: this.state.valueAge.max,
                                        minFame: this.state.valueRating.min,
                                        maxFame: this.state.valueRating.max,
                                        maxDistance: this.state.valueDistance,
                                        tags: this.state.tags,
                                        user_id: this.state.user_id
   }).then ((result) => {
      this.setState({
        userData: result,
        getData: true
      });
    })
  }

  handleStartSearch(event) {
    event.preventDefault();
    this.setState({getData: false});
    PostData('browse/ultimate_search', {
                                        minAge: this.state.valueAge.min,
                                        maxAge: this.state.valueAge.max,
                                        minFame: this.state.valueRating.min,
                                        maxFame: this.state.valueRating.max,
                                        maxDistance: this.state.valueDistance,
                                        tags: this.state.tags,
                                        user_id: this.state.user_id
   }).then ((result) => {
    if (this.state.isAgeChecked === true)
      this.sortByAgeAsc(result);
    else if (this.state.isDistanceChecked === true)
      this.sortByDistanceAsc(result);
    else if (this.state.isTagsChecked === true)
      this.sortByTagsAsc(result);
    else if (this.state.isRatingChecked === true)
      this.sortByRatingAsc(result)
    this.setState({
        userData: result,
        getData: true
      });
    })

  }
  handleTagsChange(event) {
    this.setState({tags: event.target.value})
  }

  sortByAgeAsc(result)
  {
    result.sort(function(a, b) {
        return a['age'] > b['age'] ? 1 : -1;
    });
  }

  sortByDistanceAsc(result)
  {
    result.sort(function(a, b) {
        return a['distance'] > b['distance'] ? 1 : -1;
    });
  }

  sortByTagsAsc(result)
  {
    result.sort(function(a, b) {
        return a['identical_tags'] > b['identical_tags'] ? 1 : -1;
    });
  }

  sortByRatingAsc(result)
  {
    result.sort(function(a, b) {
        return a['fame_rating'] < b['fame_rating'] ? 1 : -1;
    });
  }

  ageChange() {
    if (this.state.isDistanceChecked)
      this.setState({ isDistanceChecked: !this.state.isDistanceChecked});
    if (this.state.isTagsChecked)
      this.setState({ isTagsChecked: !this.state.isTagsChecked});
    if (this.state.isRatingChecked)
      this.setState({ isRatingChecked: !this.state.isRatingChecked});

    this.setState({ isAgeChecked: !this.state.isAgeChecked });
  }

  distanceChange() {
    if (this.state.isAgeChecked)
      this.setState({ isAgeChecked: !this.state.isAgeChecked});
    if (this.state.isTagsChecked)
      this.setState({ isTagsChecked: !this.state.isTagsChecked});
    if (this.state.isRatingChecked)
      this.setState({ isRatingChecked: !this.state.isRatingChecked});

    this.setState({ isDistanceChecked: !this.state.isDistanceChecked });
  }

  tagsChange() {
    if (this.state.isAgeChecked)
      this.setState({ isAgeChecked: !this.state.isAgeChecked});
    if (this.state.isDistanceChecked)
      this.setState({ isDistanceChecked: !this.state.isDistanceChecked});
    if (this.state.isRatingChecked)
      this.setState({ isRatingChecked: !this.state.isRatingChecked});

    this.setState({ isTagsChecked: !this.state.isTagsChecked });
  }
  ratingChange() {
    if (this.state.isAgeChecked)
      this.setState({ isAgeChecked: !this.state.isAgeChecked});
    if (this.state.isDistanceChecked)
      this.setState({ isDistanceChecked: !this.state.isDistanceChecked});
    if (this.state.isTagsChecked)
      this.setState({ isTagsChecked: !this.state.isTagsChecked});

    this.setState({ isRatingChecked: !this.state.isRatingChecked });
  }

  render()
  {
    if (this.state.getData === false) { /*Preloader*/
      return (
        <div className="progress">
          <div className="indeterminate"></div>
        </div>
      )
    }
    const users = this.state.userData /*List of users*/
    const listUsers = users.map((users, i) =>
      <div key={i}>
        <div className="col s12 m6">
          <div className="card">
            <div className="card-image">
              <img src={users.path} alt="Profile"/>
              <span className="card-title">{users.firstname} {users.lastname}</span>
              <NavLink to={"profile/" + users.id} className="btn-floating halfway-fab waves-effect waves-light red">
                <i className="material-icons">visibility</i></NavLink>
            </div>
            <div className="card-content">
              <p>From: {users.location}</p>
              <p>Age: {users.age}</p>
              <p>Gender: {users.gender}</p>
            </div>
          </div>
        </div>
      </div>
      )


    return (
      <div className="row">
        <div className="col s12 m12 l12 xl12">
          <div className="card card-yellow darken-1">
            <div className="card-content white-text">
              <span className="card-title">Search new friends</span>
              <label htmlFor="tags-input">Filter by age:</label>
              <InputRange
                maxValue={115}
                minValue={18}
                value={this.state.valueAge}
                onChange={value => this.setState({ valueAge : value })}/>
              <label htmlFor="tags-input">Filter by distance:</label>
              <InputRange
                maxValue={10000}
                minValue={0}
                value={this.state.valueDistance}
                onChange={value => this.setState({ valueDistance : value })}/>
              <label htmlFor="tags-input">Filter by rating:</label>
              <InputRange
                maxValue={10000}
                minValue={-100}
                value={this.state.valueRating}
                onChange={value => this.setState({ valueRating : value })}/>
              <label htmlFor="tags-input">Filter by tags</label>
              <input type="text" id="tags-input" className="autocomplete" onChange={this.handleTagsChange}/>
              <label htmlFor="tags-input">Sort by :</label>
                <div className="sort-table ">
                  <label>
                    <input type="checkbox" id="age" checked={this.state.isAgeChecked} onChange={this.ageChange}/>
                    <span>Age</span>
                  </label>
                  <label>
                    <input type="checkbox" id="distance" checked={this.state.isDistanceChecked} onChange={this.distanceChange}/>
                    <span>Distance</span>
                  </label>
                  <label>
                    <input type="checkbox" id="tags" checked={this.state.isTagsChecked} onChange={this.tagsChange}/>
                    <span>Tags</span>
                  </label>
                  <label>
                  <input type="checkbox" id="tags" checked={this.state.isRatingChecked} onChange={this.ratingChange}/>
                  <span>Rating</span>
                  </label>
                </div>
              <div className="row btn-center">
                <form onSubmit={ this.handleStartSearch }>
                  <button className="btn waves-effect waves-light" type="submit">Search
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div>
          {listUsers}
        </div>
      </div>

    )
  }
}

export default Search
/*                formatLabel={value => `${value} rating`}*/
