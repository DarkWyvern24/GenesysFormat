import React from 'react';
import CardScores from './CardScores';
import '../styles/custom.css';

function DeckRow({ title, cards, onRemove, onHover }) {
  return (
    <div className="deck-row">
      <div className="deck-row-title">{title} ({cards.length})</div>
      <div className="d-flex flex-wrap justify-content-center gap-2">
        {cards.length === 0 ? (
          <p className="text-muted">Vacío</p>
        ) : (
          cards.map((card, index) => {
            const score = CardScores[card.name] || null;
            return (
              <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                {score && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-5px',
                      left: '-5px',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      fontSize: '12px',
                      padding: '2px 5px',
                      borderRadius: '8px',
                      zIndex: 1
                    }}
                  >
                    {score}
                  </span>
                )}
                <img
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
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default DeckRow;
