import React, { Component } from 'react';
import Chart from './Chart';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className='App'>
        <div className='container'>
          <div className='row'>
            <div className='col-xs-12'>
              <Chart
                title='Monthly Global Land-Surface Temperature'
                subTitle='1753 - 2015'
                footerText='Temperatures are in Celsius and reported as anomalies relative to the Jan 1951-Dec 1980 average.'
                dataURL='https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json'
                margin={{ left: 50, right: 30, top: 30, bottom: 50 }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
