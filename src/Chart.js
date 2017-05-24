import React, { Component } from 'react';
import * as d3 from 'd3';
import SimpleTooltip from './simpleTooltip';
import './Chart.css';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const tempColors = ['#253494', '#2c7fb8', '#41b6c4', '#a1dab4', '#ffffcc', '#fed98e', '#fe9929', '#d95f0e', '#993404']; // cold to hot

class Chart extends Component {
  constructor (props) {
    super(props);
    this.state = {
      currentBlock: { active: false }
    }
    this.data = null;
    this.elContainer = null;
    this.elSVG = null;
    this.margin = this.props.margin ? this.props.margin : null;
    this.width = null;
    this.height = null;
    this.x = null;
    this.y = null;
    this.xAxis = null;
    this.yAxis = null;
    this.renderChartSVG = this.renderChartSVG.bind(this);
    this.getJSON = this.getJSON.bind(this);
    this.setDimensions = this.setDimensions.bind(this);
  }
  componentDidMount () {
    this.elContainer = document.querySelector('.chart--container');
    this.elSVG = document.querySelector('.chart--svg');
    this.setDimensions(this.elContainer.clientWidth, 500);
    if (localStorage._jc190HeatMap) {
      this.data = JSON.parse(localStorage._jc190HeatMap);
      this.renderChartSVG();
    } else {
      this.getJSON(this.props.dataURL, this.renderChartSVG);
    }
  }
  renderChartSVG () {
    // Bar width
    this.barWidth = Math.floor(this.width / (this.data.monthlyVariance.length / 12));
    // Color
    this.colors = d3.scaleQuantize()
      .domain([Math.floor(d3.min(this.data.monthlyVariance, (d) => this.data.baseTemperature + d.variance)), d3.max(this.data.monthlyVariance, (d) => this.data.baseTemperature + d.variance)])
      .range(tempColors);
    // console.log(this.colors(8))
    // X Axis
    this.x = d3.scaleLinear()
      .domain([
        d3.min(this.data.monthlyVariance, (d) => d.year),
        d3.max(this.data.monthlyVariance, (d) => d.year) + 1
      ])
      .range([0, this.width]);
    this.xAxis = d3.axisBottom(this.x).ticks(20, 'f');
    // Y Axis
    this.y = d3.scaleBand()
      .domain(months)
      .rangeRound([0, this.height]);
    this.yAxis = d3.axisLeft(this.y).ticks(12);
    // Chart
    this.chart = d3.select('.chart--svg')
      .attr('width', this.width + this.margin.right + this.margin.left)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + this.margin.left + ', ' + this.margin.top + ')');
    // Append X Axis
    this.chart.append('g')
      .attr('transform', 'translate(0, ' + this.height + ')')
      .call(this.xAxis);
    this.chart.append('text')
      .attr('transform', 'translate(' + (this.width / 2) + ', ' + (this.height + this.margin.bottom) + ')')
      .style('text-anchor', 'middle')
      .text('Years');
    // Append Y Axis
    this.chart.append('g')
      .call(this.yAxis);
    this.chart.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - this.margin.top)
      .attr('x', 0 - (this.height / 2))
      .style('text-anchor', 'middle')
      .text('Months');
    // Bars
    this.bars = this.chart.selectAll('.bar')
      .data(this.data.monthlyVariance)
      .enter().append('g');
    this.bars.append('rect')
      .attr('x', (d) => this.x(d.year))
      .attr('y', (d) => this.y(months[d.month - 1]))
      .attr('height', (d) => this.height / 12)
      .attr('width', (d) => this.barWidth)
      .attr('fill', (d) => this.colors(this.data.baseTemperature + d.variance))
      .on('mouseover', (d) => {
        const e = d3.event;
        this.setState ({
          currentBlock: {
            year: d.year,
            month: months[d.month - 1],
            temp: (this.data.baseTemperature + d.variance).toFixed(3),
            tempVariance: d.variance.toFixed(3),
            event: e,
            active: true
          }
        });
      })
      .on('mouseleave', (d) => {
        this.setState ({
          currentBlock: {
            active: false
          }
        });
      })
      .on('mousemove', (d) => {
        const e = d3.event;
        this.setState({
          currentBlock: {
            year: d.year,
            month: months[d.month - 1],
            temp: (this.data.baseTemperature + d.variance).toFixed(3),
            tempVariance: d.variance.toFixed(3),
            event: e,
            active: true
          }
        })
      });
  }
  setDimensions (w, h) {
    this.width = w - this.margin.left - this.margin.right;
    this.height = h - this.margin.top - this.margin.bottom;
  }
  getJSON (url, callback) {
    // Json request
    d3.json(url, (data) => {
      localStorage.setItem('_jc190HeatMap', JSON.stringify(data));
      this.data = JSON.parse(localStorage._jc190HeatMap);
      callback();
    });
  }
  render() {
    return (
      <div className='chart--container'>
        <h1 className='chart--title text-center'>
          {this.props.title}
          <br/>
          <small>{this.props.subTitle}</small>
        </h1>
        <hr />
        <svg className='chart--svg'></svg>
        <hr />
        <p className='chart--footer text-center'>
          {this.props.footerText}
        </p>
        <SimpleTooltip block={this.state.currentBlock}/>
      </div>
    );
  }
}

export default Chart;
