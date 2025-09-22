import React from 'react';
import CardScores from './CardScores';
import '../styles/custom.css';

function CardPreview({ card }) {
  if (!card) {
    return (
      <div className="card-preview">
        <p className="text-muted">Select or hover over a card to preview it here.</p>
      </div>
    );
  }

  const img = card.card_images?.[0]?.image_url || '';
  const atk = card.atk != null ? `ATK: ${card.atk}` : '';
  const def = card.def != null ? ` / DEF: ${card.def}` : '';
  const level = card.level ? `★${card.level}` : '';
  const score = CardScores[card.name] || null;

  return (
    <div className="card-preview">
      <img src={img} alt={card.name} className="img-fluid mb-2" />
      <h5>
        {card.name}
        {score !== null && (
          <span
            style={{
              marginLeft: '8px',
              fontSize: '12px',
              padding: '2px 6px',
              borderRadius: '6px',
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: 'white'
            }}
          >
            {score}
          </span>
        )}
      </h5>
      <p className="small">{card.type} {level}</p>
      {(atk || def) && <p className="small">{atk}{def}</p>}
      <div
        className="small text-muted"
        style={{ maxHeight: '120px', overflowY: 'auto' }}
      >
        {card.desc}
      </div>
    </div>
  );
}

export default CardPreview;
