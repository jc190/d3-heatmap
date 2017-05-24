import React from 'react';

function simpleTooltip (props) {
  if (props.block.active) {
    return (
      <div
        className='simple-tooltip active'
        style={{transform: 'translate(' + (props.block.event.offsetX) + 'px, ' + (props.block.event.offsetY - 50) + 'px)'}}
        >
        <h3 className='text-center'>{props.block.month} - {props.block.year}</h3>
        <h4 className='text-center'>{props.block.temp}&deg;C</h4>
        <p className='text-center'>{props.block.tempVariance}&deg;C</p>
      </div>
    )
  }
  else {
    return (
      <div className='simple-tooltip'></div>
    )
  }
}

export default simpleTooltip;
