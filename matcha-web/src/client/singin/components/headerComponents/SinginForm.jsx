import React from 'react';

function SinginForm () {
  return (
    <div className="row">
      <form>
        <div className="row">
          <div className="input-field col s2">
            <label htmlFor="icon_prefix">Sing in</label>
          </div>
          <div className="input-field col s4">
            <input id="icon_prefix" type="text" className="validate"/>
            <label htmlFor="icon_prefix">Login</label>
          </div>
          <div className="input-field col s4">
            <input id="icon_telephone" type="password" className="validate"/>
            <label htmlFor="icon_telephone">Password</label>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SinginForm;
