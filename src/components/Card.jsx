import React from 'react';

function Card({ card, onAddMainOrExtra, onAddSide }) {
  return (
    <div className="card h-100">
      <img
        src={card.card_images[0].image_url_small}
        className="card-img-top"
        alt={card.name}
      />
      <div className="card-body">
        <h5 className="card-title">{card.name}</h5>
        <div className="d-grid gap-2">
          <button
            className="btn btn-tech btn-sm"
            onClick={() => onAddMainOrExtra(card)}
          >
            Añadir al Main/Extra
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onAddSide(card)}
          >
            Añadir al Side Deck
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;
