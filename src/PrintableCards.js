import React, { Component } from 'react';
import _ from 'lodash';

import './PrintableCards.css';


export default class PrintableCards extends Component {
  render() {
    return (
      <div className="PrintableCards">
        <div className="printable">{this.renderColumns()}</div>
      </div>
    );
  }

  renderColumns() {
    const {json} = this.props;
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
      <div className="PrintableCards-container">
        {cards.map(({type, data, color}) => {
          const text = _.isString(data)
            ? data
            : this.cardText(data);
          const key = (text === '') ? _.uniqueId() : text;
          return <div key={key} style={{ backgroundColor: color }} className="PrintableCards-card">{text}</div>
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

PrintableCards.propTypes = {
  json: React.PropTypes.object.isRequired
}