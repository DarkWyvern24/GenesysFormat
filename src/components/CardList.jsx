import React, { useState, useEffect } from 'react';

function CardList() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedCards = localStorage.getItem('yugiohCards');

    if (storedCards) {
      // Si hay en localStorage, usarlos
      setCards(JSON.parse(storedCards));
      setLoading(false);
      console.log('Cargando desde localStorage');
    } else {
      // Si no hay, llamar a la API
      fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php')
        .then((response) => {
          if (!response.ok) {
            throw new Error('Error en la respuesta de la API');
          }
          return response.json();
        })
        .then((data) => {
          const cardsData = data.data.slice(0, 20);
          setCards(cardsData);
          localStorage.setItem('yugiohCards', JSON.stringify(cardsData));
          setLoading(false);
          console.log('Datos guardados en localStorage');
        })
        .catch((err) => {
          console.error(err);
          setError('No se pudieron cargar las cartas');
          setLoading(false);
        });
    }
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Cargando cartas...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center mt-5">{error}</div>;
  }

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Yu-Gi-Oh! Cards</h2>
      <div className="row">
        {cards.map((card) => (
          <div key={card.id} className="col-md-3 mb-4">
            <div className="card h-100">
              <img
                src={card.card_images[0].image_url_small}
                className="card-img-top"
                alt={card.name}
              />
              <div className="card-body">
                <h5 className="card-title">{card.name}</h5>
                <p className="card-text text-truncate">{card.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CardList;
