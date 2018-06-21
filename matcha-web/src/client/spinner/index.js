import React from 'react';

import styles from './style.css';
import spinner from './hearts.svg';

const Spinner = (props) => (
  <div className={styles.spinner}>
    <img src={spinner} />
  </div>
);

export default Spinner;
