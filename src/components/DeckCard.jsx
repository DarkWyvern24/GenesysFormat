import React from 'react';

function DeckCard({ card, onRemove }) {
  return (
    <div className="card h-100">
      <img
        src={card.card_images[0].image_url_small}
        className="card-img-top"
        alt={card.name}
        onClick={onRemove}
        style={{ cursor: 'pointer' }}
      />
    </div>
  );
}

export default DeckCard;
