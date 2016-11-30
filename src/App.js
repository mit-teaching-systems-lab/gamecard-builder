import React, { Component } from 'react';
import './App.css';
import yaml from 'js-yaml';
import _ from 'lodash';

const files = [
  '/cards/ethics-a.yaml',
  '/cards/ethics-b.yaml',
  '/cards/committee-of-n.yaml',
  '/cards/bias-boggle.yaml'
];
class App extends Component {
  constructor() {
    super()
    this.state = {
      yamlText: ''
    }
  }

  componentDidMount() {
    this.fetchYaml(files[0]);
  }

  fetchYaml(yamlFile) {
    fetch(`${process.env.PUBLIC_URL}${yamlFile}`)
      .then((response) => response.text())
      .then((yamlText) => this.setState({ yamlText }));
  }

  onFileClicked(file) {
    this.fetchYaml(file);
  }

  onTextChanged(e) {
    this.setState({ yamlText: e.currentTarget.value });
  }

  render() {
    return (
      <div className="App">
        <div className="files no-print">
          <div>
            {files.map((file) => {
              return <button key={file} onClick={this.onFileClicked.bind(this, file)}>{file}</button>;
            })}
          </div>
          <textarea
            className="yaml-textarea"
            onChange={this.onTextChanged.bind(this)}
            value={this.state.yamlText}>
          </textarea>
        </div>
        <div className="printable">{this.renderColumns()}</div>
      </div>
    );
  }

  renderColumns() {
    var json = {};
    try {
      json = yaml.safeLoad(this.state.yamlText, 'utf8');
      if (!json) return null;
    } catch (e) {
      console.warn(e);
    }

    const colors = [
      '#ff9999',
      '#99ff99',
      '#9999ff',
      '#999999',
      '#99ffff',
      '#ffff99',
      '#ff99ff'
    ];

    const cards = _.flatten(Object.keys(json).map((type, index) => {
      return json[type].map((data) => {
        return { type, data, color: colors[index] };
      });
    }));

    // 9 items per page
    // console.log({cards});
    // const nullCard = {
    //   type: 'null',
    //   data: '',
    //   color: 'white'
    // };
    // const doubleSidedCards = _.flatten(_.chunk(cards, 9).map((pageCards) => {
    //   const fullRowCards = _.chunk(pageCards, 3).map((rowCards) => {
    //     const regularCards = rowCards.map((card) => {
    //       return {...card, type: 'r-' + card.type};
    //     });
    //     return regularCards.concat(Array(3 - regularCards.length).fill(nullCard));
    //   });
    //   const reversedRowCards = _.flatten(fullRowCards.reverse(), true);
    //   return pageCards.concat(reversedRowCards);
    // }), true);
    // console.log({doubleSidedCards});

    return (
      <div className="container">
        {cards.map(({type, data, color}) => {
          const text = _.isString(data)
            ? data
            : this.cardText(data);
          const key = (text === '') ? _.uniqueId() : text;
          return <div key={key} style={{ backgroundColor: color }} className="text-card">{text}</div>
        })}
      </div>
    );
  }

  cardText(data) {
    return JSON.stringify(data)
      .replace(/"/g, '')
      .replace(/:/g, ': ')
      .replace(/[\{\}]/g, '')
      .replace(/,/g, '\n');
  }
}

export default App;
