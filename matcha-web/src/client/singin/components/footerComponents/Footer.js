import React, { Component } from 'react';

import './Footer.css';

class Footer extends Component {

  render() {
    return (
      <footer className="page-footer footerBackground footer_bottom z-depth-4">
        <div className="footer-copyright footerBackground">
          <div className="container footerTextColor">
          © 2018 Created by vgryshch and ekiriche from Unit Factory
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
