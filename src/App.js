import React, { Component } from 'react';
import _ from 'lodash';
import yaml from 'js-yaml';

import './App.css';
import PrintableCards from './PrintableCards.js';


const files = [
  '/cards/ethics-a.yaml',
  '/cards/ethics-b.yaml',
  '/cards/committee-of-n.yaml',
  '/cards/bias-boggle.yaml',
  '/cards/bias-behaviors.yaml'
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

    return <PrintableCards json={json} />
  }
}

export default App;
