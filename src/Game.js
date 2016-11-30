import React, { Component } from 'react';
import _ from 'lodash';
import yaml from 'js-yaml';

import './Game.css';
import PrintableCards from './PrintableCards.js';


export default class Game extends Component {
  constructor() {
    super()
    this.state = {
      json: null,
      cards: null,
      discards: []
    }
  }

  componentDidMount() {
    this.fetchYaml('/cards/bias-boggle.yaml');
  }

  fetchYaml(yamlFile) {
    fetch(`${process.env.PUBLIC_URL}${yamlFile}`)
      .then((response) => response.text())
      .then((yamlText) => this.parseYaml(yamlText))
      .then(({json, cards}) => this.setState({json, cards}));
  }

  parseYaml(yamlText) {
    var json = {};
    try {
      json = yaml.safeLoad(yamlText, 'utf8');
    } catch (e) {
      console.warn(e);
    }

    return {
      json,
      cards: this.drawCards(json)
    };
  }

  drawCards(json) {
    const batches = Object.keys(json).map((key) => {
      return _.take(_.shuffle(json[key]), 4);
    });
    const cards = _.take(_.shuffle(_.flatten(batches)), 16);
    return {cards};
  }

  render() {
    const {cards} = this.state;

    return (
      <div className="Game">
        {cards && <PrintableCards json={cards} />}
      </div>
    );
  }
}

