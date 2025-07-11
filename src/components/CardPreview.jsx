import React from 'react';
import '../styles/custom.css';

function CardPreview({ card }) {
  if (!card) {
    return (
      <div className="card-preview">
        <p className="text-muted">Selecciona o pasa el mouse por una carta para verla aquí.</p>
      </div>
    );
  }

  const img = card.card_images?.[0]?.image_url || '';
  const atk = card.atk != null ? `ATK: ${card.atk}` : '';
  const def = card.def != null ? ` / DEF: ${card.def}` : '';
  const level = card.level ? `★${card.level}` : '';

  return (
    <div className="card-preview">
      <img src={img} alt={card.name} className="img-fluid mb-2" />
      <h5>{card.name}</h5>
      <p className="small">{card.type} {level}</p>
      {(atk || def) && <p className="small">{atk}{def}</p>}
      <div className="small text-muted" style={{ maxHeight: '120px', overflowY: 'auto' }}>
        {card.desc}
      </div>
    </div>
  );
}

export default CardPreview;
