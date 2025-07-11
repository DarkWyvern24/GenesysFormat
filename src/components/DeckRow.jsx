import React from 'react';
import '../styles/custom.css';

function DeckRow({ title, cards, onRemove, onHover }) {
  return (
    <div className="deck-row">
      <div className="deck-row-title">{title} ({cards.length})</div>
      <div className="d-flex flex-wrap justify-content-center gap-2">
        {cards.length === 0 ? (
          <p className="text-muted">Vacío</p>
        ) : (
          cards.map((card, index) => (
            <img
                key={index}
                src={card.card_images[0].image_url_small}
                alt={card.name}
                title={card.name}
                onClick={() => onRemove(index)}
                onMouseEnter={() => onHover(card)}
                style={{
                    width: '50px',
                    height: '72px',
                    objectFit: 'cover'
                }}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default DeckRow;
