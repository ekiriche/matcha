import React from 'react';
import Typist from 'react-typist';
import './header.css';

function Nav () {
  return (
    <div className="col s12 headerBackground z-depth-2">
      <div className="container">
        <nav className="navBoxshadow-none">
          <div className="nav-wrapper headerBackground">
            <a href="#!" className="brand-logo titleAnimation">Matcha</a>
              <Typist className="cursor textMainPosition " >
                <Typist.Delay ms={500} />
                <Typist.Backspace count={8} delay={200} />
                  <p className="typist-margin">love is found...</p>
              </Typist>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Nav;
