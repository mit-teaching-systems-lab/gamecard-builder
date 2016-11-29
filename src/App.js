import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import yaml from 'js-yaml';

class App extends Component {
  constructor() {
    super()
    this.state = {
      yamlText: ''
    }
  }

  componentDidMount() {
    fetch(process.env.PUBLIC_URL + '/cards/ethics.yaml')
      .then((response) => response.text())
      .then((yamlText) => this.setState({ yamlText }));
  }

  onTextChanged(e) {
    this.setState({ yamlText: e.currentTarget.value });
  }

  render() {
    return (
      <div className="App">
        <div className="no-print">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
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
    const data = yaml.safeLoad(this.state.yamlText, 'utf8');
    if (!data) return null;

    return (
      <div className="container">
        <div className="container">{this.renderTextCards(data.principles, { backgroundColor: '#ff9999' })}</div>
        <div className="container">{this.renderTextCards(data.settings, { backgroundColor: '#9999ff' })}</div>
      </div>
    );
  }

  renderTextCards(textCards, style) {
    if (!textCards || textCards.length === 0) return null;

    return (
      <div className="container">{textCards.map((text) => {
        return <div key={text} style={style} className="text-card">{text}</div>
      })}
      </div>
    );
  }
}

export default App;
