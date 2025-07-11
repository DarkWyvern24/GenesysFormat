import React from 'react';
import '../styles/custom.css';

function CardResultItem({ card, onHover, onAddMainOrExtra, onAddSide }) {
  return (
    <div className="card-result-item" onMouseEnter={() => onHover(card)}>
      <img
        src={card.card_images[0].image_url_small}
        alt={card.name}
        style={{ width: '50px', height: '72px', objectFit: 'cover', marginRight: '8px' }}
        className="rounded border"
      />
      <div className="flex-grow-1">
        <strong>{card.name}</strong>
        <div className="d-flex flex-wrap gap-1 mt-1">
          <button className="btn btn-sm btn-outline-light" onClick={() => onAddMainOrExtra(card)}>+ Main/Extra</button>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => onAddSide(card)}>+ Side</button>
        </div>
      </div>
    </div>
  );
}

export default CardResultItem;
