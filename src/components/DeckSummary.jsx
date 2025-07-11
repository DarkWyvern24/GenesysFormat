import React, { useState } from 'react';
import DeckCard from './DeckCard';

function DeckSummary({ title, cards, onRemove, max, onUpdate }) {
  const [sorted, setSorted] = useState(false);

  // 👉 Clasificación por familia y subtipo
  const classify = (type) => {
    const t = type?.toLowerCase() || '';
    if (t.includes('monster')) return '1-monster';
    if (t.includes('spell')) return '2-spell';
    if (t.includes('trap')) return '3-trap';
    return '4-other';
  };

  const handleSort = () => {
    const sortedDeck = [...cards].sort((a, b) => {
      // 1️⃣ Por familia principal
      const famA = classify(a.type);
      const famB = classify(b.type);
      if (famA < famB) return -1;
      if (famA > famB) return 1;

      // 2️⃣ Por subtipo (type alfabético)
      if (a.type < b.type) return -1;
      if (a.type > b.type) return 1;

      // 3️⃣ Por nombre
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;

      return 0;
    });

    // ✅ Notificar al padre para actualizar el estado del deck
    onUpdate(sortedDeck);
    setSorted(true);
  };

  return (
    <div className="deck-section">
      <div className="deck-header d-flex justify-content-between align-items-center">
        <h5>{title}</h5>
        <span>{cards.length} / {max}</span>
      </div>

      {cards.length === 0 ? (
        <p className="text-muted">No hay cartas aquí</p>
      ) : (
        <>
          <button className="btn btn-tech btn-sm mb-2" onClick={handleSort}>
            Ordenar Deck
          </button>
          <div className="row">
            {cards.map((card, index) => (
              <div key={index} className="col-4 col-md-2 mb-2">
                <DeckCard
                  card={card}
                  onRemove={() => onRemove(card, index)}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default DeckSummary;
