import React, { Component } from 'react';
import {Modal} from 'semantic-ui-react';
import styles from '../styles/style.scss';


class Loader extends Component {
  render(){
    return(
      <Modal dimmer='blurring' className={ styles.loaderModal } open={ true }>
        <div style={{display:'none'}}/>
          <div className="loader">
            <div className="inner one"></div>
            <div className="inner dot"></div>
            <div className="inner two"></div>
          </div>
          <div style={{display:'none'}}/>
      </Modal>
    );
  }

}
export default Loader;
