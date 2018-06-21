import React from 'react';
import { Route, Redirect } from "react-router-dom";
import jwtDecode from 'jwt-decode';
import { PostData } from '../singin/components/library/PostData';


export const PrivateRoute = ({ component: Component, ...rest}) => (
  <Route {...rest} render={props => (
      localStorage.getItem('accessToken')
          ? <Component {...props} />
        : <Redirect to={{ pathname: '/', state: { from: props.location } }} />
  )} />
)

export const SingInRoute = ({ component: Component, ...rest}) => (
  <Route {...rest} render={props => {
      if (localStorage.getItem('accessToken')) {
        let token =  localStorage.getItem('accessToken');
        let id = jwtDecode(token)
        PostData('profile/get_access_level', {user_id: id.user_id}).then ((result) => {
          if (result === 1) {
            return (<Redirect to={{ pathname: '/settings', state: { from: props.location } }} />);
          } else if (result === 2) {
            return (<Redirect to={{ pathname: '/Search', state: { from: props.location } }} />);
          }
        })
      } else {
        return (<Component {...props} />);
      }
  }} />
)

/*
export const SingInRoute = ({ component: Component, ...rest}) => (
  <Route {...rest} render={props => (
      localStorage.getItem('accessToken')
          ? <Redirect to={{ pathname: '/Search', state: { from: props.location } }} />
          : <Component {...props} />
  )} />
)


*/
/*
export const SingInRoute = ({ component: Component, ...rest}) => (
  <Route {...rest} render={props => {
      if (localStorage.getItem('accessToken')) {
        let token =  localStorage.getItem('accessToken');
        let id = jwtDecode(token)
        PostData('profile/get_access_level', {user_id: id.user_id}).then ((result) => {
          if (result === 1) {
            return (<Redirect to={{ pathname: '/settings', state: { from: props.location } }} />);
          } else if (result === 2) {
            return (<Redirect to={{ pathname: '/Search', state: { from: props.location } }} />);
          }
        })
      } else {
        return (<Component {...props} />);
      }
  }} />
)
*/
