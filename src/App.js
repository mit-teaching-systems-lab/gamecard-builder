import React, { Component } from 'react';
import './App.css';
import yaml from 'js-yaml';
import _ from 'lodash';

const files = [
  '/cards/ethics-a.yaml',
  '/cards/ethics-b.yaml',
  '/cards/committee-of-n.yaml'
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
    var data = {};
    try {
      data = yaml.safeLoad(this.state.yamlText, 'utf8');
      if (!data) return null;
    } catch (e) {
      console.warn(e);
    }

    const colors = [
      '#ff9999',
      '#99ff99',
      '#9999ff',
      '#999999'
    ];
    return (
      <div className="container">
        {Object.keys(data).map((key, index) => {
          return <div key={key} className="container">{this.renderPlainCards(data[key], { backgroundColor: colors[index] })}</div>;
        })}
      </div>
    );
  }

  renderPlainCards(plainCards, style) {
    if (!plainCards || plainCards.length === 0) return null;

    return (
      <div className="container">{plainCards.map((card) => {
        const text = _.isString(card)
          ? card
          : this.cardText(card);
        return <div key={text} style={style} className="text-card">{text}</div>
      })}
      </div>
    );
  }

  cardText(card) {
    return JSON.stringify(card)
      .replace(/\"/g, '')
      .replace(/:/g, ': ')
      .replace(/[\{\}]/g, '')
      .replace(/,/g, '\n');
  }
}

export default App;
