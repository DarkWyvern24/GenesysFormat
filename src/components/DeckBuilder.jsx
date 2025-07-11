import React, { useState, useEffect, useCallback } from 'react';
import CardPreview from './CardPreview';
import CardResultItem from './CardResultItem';
import DeckRow from './DeckRow';
import '../styles/custom.css';

function DeckBuilder() {
  const LOCAL_KEY = 'allDecks';

  const [allDecks, setAllDecks] = useState({});
  const [currentDeckName, setCurrentDeckName] = useState('');
  const [mainDeck, setMainDeck] = useState([]);
  const [extraDeck, setExtraDeck] = useState([]);
  const [sideDeck, setSideDeck] = useState([]);
  const [newDeckName, setNewDeckName] = useState('');

  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Memorized loadDeck to satisfy ESLint dependencies
  const loadDeck = useCallback((name, decks = allDecks) => {
    if (!decks[name]) return;
    setMainDeck(decks[name].main || []);
    setExtraDeck(decks[name].extra || []);
    setSideDeck(decks[name].side || []);
    setCurrentDeckName(name);
  }, [allDecks]);

  // ✅ Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAllDecks(parsed);
        const firstDeck = Object.keys(parsed)[0] || '';
        if (firstDeck) {
          loadDeck(firstDeck, parsed);
        }
      } catch (err) {
        console.error('Error parsing localStorage:', err);
      }
    }
  }, [loadDeck]);

  // ✅ Save allDecks to localStorage on change
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(allDecks));
  }, [allDecks]);

  // ✅ Sync current deck with allDecks
  useEffect(() => {
    if (currentDeckName) {
      setAllDecks(prev => ({
        ...prev,
        [currentDeckName]: {
          main: mainDeck,
          extra: extraDeck,
          side: sideDeck
        }
      }));
    }
  }, [mainDeck, extraDeck, sideDeck, currentDeckName]);

  // ✅ Deck management functions
  const saveDeck = () => {
    if (!currentDeckName) {
      alert('El deck necesita un nombre.');
      return;
    }
    setAllDecks(prev => ({
      ...prev,
      [currentDeckName]: {
        main: mainDeck,
        extra: extraDeck,
        side: sideDeck
      }
    }));
    alert('¡Deck guardado!');
  };

  const saveAsDeck = () => {
    const name = prompt('Nombre para el nuevo deck:');
    if (!name) return;
    if (allDecks[name]) {
      alert('Ya existe un deck con ese nombre.');
      return;
    }
    setAllDecks(prev => ({
      ...prev,
      [name]: {
        main: mainDeck,
        extra: extraDeck,
        side: sideDeck
      }
    }));
    setCurrentDeckName(name);
  };

  const renameDeck = () => {
    const newName = prompt('Nuevo nombre del deck:', currentDeckName);
    if (!newName || newName === currentDeckName) return;
    if (allDecks[newName]) {
      alert('Ya existe un deck con ese nombre.');
      return;
    }
    const updatedDecks = { ...allDecks };
    updatedDecks[newName] = updatedDecks[currentDeckName];
    delete updatedDecks[currentDeckName];
    setAllDecks(updatedDecks);
    setCurrentDeckName(newName);
  };

  const createNewDeck = () => {
    if (!newDeckName.trim()) {
      alert('Ponle un nombre al nuevo deck.');
      return;
    }
    if (allDecks[newDeckName]) {
      alert('Ya existe un deck con ese nombre.');
      return;
    }
    const updatedDecks = {
      ...allDecks,
      [newDeckName]: { main: [], extra: [], side: [] }
    };
    setAllDecks(updatedDecks);
    loadDeck(newDeckName, updatedDecks);
    setNewDeckName('');
  };

  const countTotalCopies = (cardId) => {
    return (
      mainDeck.filter(c => c.id === cardId).length +
      extraDeck.filter(c => c.id === cardId).length +
      sideDeck.filter(c => c.id === cardId).length
    );
  };

  const isExtraType = (type) => {
    if (!type) return false;
    const lower = type.toLowerCase();
    return ['fusion', 'synchro', 'xyz', 'link'].some(t => lower.includes(t));
  };

  const addToMainOrExtra = (card) => {
    if (countTotalCopies(card.id) >= 3) {
      alert('No puedes tener más de 3 copias.');
      return;
    }
    if (isExtraType(card.type)) {
      if (extraDeck.length >= 15) {
        alert('Extra Deck lleno.');
        return;
      }
      setExtraDeck([...extraDeck, card]);
    } else {
      if (mainDeck.length >= 60) {
        alert('Main Deck lleno.');
        return;
      }
      setMainDeck([...mainDeck, card]);
    }
  };

  const addToSide = (card) => {
    if (countTotalCopies(card.id) >= 3) {
      alert('No puedes tener más de 3 copias.');
      return;
    }
    if (sideDeck.length >= 15) {
      alert('Side Deck lleno.');
      return;
    }
    setSideDeck([...sideDeck, card]);
  };

  const removeFromDeck = (deck, index) => {
    const newDeck = [...deck];
    newDeck.splice(index, 1);
    if (deck === mainDeck) setMainDeck(newDeck);
    else if (deck === extraDeck) setExtraDeck(newDeck);
    else if (deck === sideDeck) setSideDeck(newDeck);
  };

  const sortDeck = () => {
    const sortFunction = (a, b) => {
      if (a.type < b.type) return -1;
      if (a.type > b.type) return 1;
      return a.name.localeCompare(b.name);
    };
    setMainDeck([...mainDeck].sort(sortFunction));
    setExtraDeck([...extraDeck].sort(sortFunction));
    setSideDeck([...sideDeck].sort(sortFunction));
  };

  // ✅ Fetch cards from API
  useEffect(() => {
    if (search.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${encodeURIComponent(search)}`)
      .then(res => {
        if (res.ok) return res.json();
        if (res.status === 400) return { data: [] };
        throw new Error('Error en la API');
      })
      .then(data => {
        setSearchResults(data.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Error al conectar con la API.');
        setLoading(false);
      });
  }, [search]);

  return (
    <div
      className="container-fluid my-3"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + '/background.jpg'})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        minHeight: '100vh'
      }}
    >
      <div className="text-center mb-3">
        <img
          src="/logo.png"
          alt="Logo"
          style={{
            maxHeight: '120px',
            marginBottom: '10px'
          }}
        />
        <h2>Deck Builder</h2>
      </div>

      <div className="row">
        {/* Preview Izquierda */}
        <div className="col-md-3 mb-3">
          <CardPreview card={selectedCard} />
        </div>

        {/* Editor de Deck al Centro */}
        <div className="col-md-6 mb-3">
          <div className="p-2 rounded bg-dark">
            <div className="d-flex flex-wrap gap-2 mb-2">
              <select
                className="form-select flex-grow-1"
                value={currentDeckName}
                onChange={(e) => loadDeck(e.target.value)}
              >
                {Object.keys(allDecks).map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
              <button className="btn btn-tech btn-sm" onClick={saveDeck}>Guardar</button>
              <button className="btn btn-tech btn-sm" onClick={saveAsDeck}>Guardar como</button>
              <button className="btn btn-tech btn-sm" onClick={renameDeck}>Renombrar</button>
              <button className="btn btn-tech btn-sm" onClick={sortDeck}>Ordenar</button>
            </div>

            <div className="d-flex flex-wrap gap-2 mb-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Nombre del nuevo deck"
                value={newDeckName}
                onChange={(e) => setNewDeckName(e.target.value)}
              />
              <button className="btn btn-outline-success btn-sm" onClick={createNewDeck}>Crear</button>
            </div>

            <DeckRow title="Main Deck" cards={mainDeck} onRemove={(i) => removeFromDeck(mainDeck, i)} onHover={setSelectedCard} />
            <DeckRow title="Extra Deck" cards={extraDeck} onRemove={(i) => removeFromDeck(extraDeck, i)} onHover={setSelectedCard} />
            <DeckRow title="Side Deck" cards={sideDeck} onRemove={(i) => removeFromDeck(sideDeck, i)} onHover={setSelectedCard} />
          </div>
        </div>

        {/* Buscador Derecha */}
        <div className="col-md-3 mb-3">
          <div className="results-container">
            <input
              type="text"
              className="form-control form-control-sm mb-2"
              placeholder="Buscar cartas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {loading ? (
              <p className="text-center">Cargando...</p>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : (
              searchResults.length === 0 ? (
                <p className="text-muted text-center">No se encontraron resultados.</p>
              ) : (
                searchResults.map(card => (
                  <CardResultItem
                    key={card.id}
                    card={card}
                    onHover={setSelectedCard}
                    onAddMainOrExtra={addToMainOrExtra}
                    onAddSide={addToSide}
                  />
                ))
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeckBuilder;
