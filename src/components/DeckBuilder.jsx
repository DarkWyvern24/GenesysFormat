import React, { useState, useEffect, useCallback } from 'react';
import CardPreview from './CardPreview';
import CardResultItem from './CardResultItem';
import DeckRow from './DeckRow';
import CardScores from './CardScores';
import '../styles/custom.css';

function DeckBuilder() {
  const LOCAL_KEY = 'allDecksData';

  const [deckState, setDeckState] = useState({
    allDecks: {},
    currentDeckName: ''
  });

  const [mainDeck, setMainDeck] = useState([]);
  const [extraDeck, setExtraDeck] = useState([]);
  const [sideDeck, setSideDeck] = useState([]);
  const [newDeckName, setNewDeckName] = useState('');

  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { allDecks, currentDeckName } = deckState;

  // ✅ Load decks from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const names = Object.keys(parsed);
        let firstDeck = names[0] || '';

        setDeckState({
          allDecks: parsed,
          currentDeckName: firstDeck
        });

        if (firstDeck && parsed[firstDeck]) {
          const deck = parsed[firstDeck];
          setMainDeck(deck.main || []);
          setExtraDeck(deck.extra || []);
          setSideDeck(deck.side || []);
        } else {
          setMainDeck([]);
          setExtraDeck([]);
          setSideDeck([]);
        }

      } catch (err) {
        console.error('Error parsing localStorage:', err);
      }
    }
  }, []);

  // ✅ Save allDecks to localStorage on change
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(allDecks));
  }, [allDecks]);

  const loadDeck = useCallback((name, decks = allDecks) => {
    if (!decks[name]) return;
    setMainDeck(decks[name].main || []);
    setExtraDeck(decks[name].extra || []);
    setSideDeck(decks[name].side || []);
    setDeckState(prev => ({ ...prev, currentDeckName: name }));
  }, [allDecks]);

  const createNewDeck = () => {
    if (!newDeckName.trim()) {
      alert('Please enter a name for the new deck.');
      return;
    }
    if (allDecks[newDeckName]) {
      alert('A deck with that name already exists.');
      return;
    }

    if (!window.confirm(`Create deck "${newDeckName}" with the current cards?`)) {
      return;
    }

    const updatedDecks = {
      ...allDecks,
      [newDeckName]: {
        main: mainDeck,
        extra: extraDeck,
        side: sideDeck
      }
    };

    localStorage.setItem(LOCAL_KEY, JSON.stringify(updatedDecks));
    setDeckState({
      allDecks: updatedDecks,
      currentDeckName: newDeckName
    });
    setNewDeckName('');
    alert('New deck created with the current progress!');
  };

  const saveDeck = () => {
    if (!currentDeckName) {
      alert('No deck is currently loaded to save.');
      return;
    }

    if (!window.confirm(`Save changes to "${currentDeckName}"?`)) {
      return;
    }

    const updatedDecks = {
      ...allDecks,
      [currentDeckName]: {
        main: mainDeck,
        extra: extraDeck,
        side: sideDeck
      }
    };

    localStorage.setItem(LOCAL_KEY, JSON.stringify(updatedDecks));
    setDeckState(prev => ({
      ...prev,
      allDecks: updatedDecks
    }));
    alert('Deck saved!');
  };

  const saveAsDeck = () => {
    if (!currentDeckName) {
      alert('You need to have a deck open to use Save As.');
      return;
    }

    const name = prompt('Name for the copy of the deck:');
    if (!name) return;
    if (allDecks[name]) {
      alert('A deck with that name already exists.');
      return;
    }

    if (!window.confirm(`Save a copy as "${name}"?`)) {
      return;
    }

    const updatedDecks = {
      ...allDecks,
      [name]: {
        main: mainDeck,
        extra: extraDeck,
        side: sideDeck
      }
    };

    localStorage.setItem(LOCAL_KEY, JSON.stringify(updatedDecks));
    setDeckState({
      allDecks: updatedDecks,
      currentDeckName: name
    });
    alert(`Deck saved as "${name}"!`);
  };

  const renameDeck = () => {
    if (!currentDeckName) {
      alert('No deck is currently loaded to rename.');
      return;
    }

    const newName = prompt('New name for the deck:', currentDeckName);
    if (!newName || newName === currentDeckName) return;
    if (allDecks[newName]) {
      alert('A deck with that name already exists.');
      return;
    }

    if (!window.confirm(`Rename "${currentDeckName}" to "${newName}"?`)) {
      return;
    }

    const updatedDecks = { ...allDecks };
    updatedDecks[newName] = updatedDecks[currentDeckName];
    delete updatedDecks[currentDeckName];

    localStorage.setItem(LOCAL_KEY, JSON.stringify(updatedDecks));
    setDeckState({
      allDecks: updatedDecks,
      currentDeckName: newName
    });
    alert(`Deck renamed to "${newName}"!`);
  };

  const deleteDeck = () => {
    if (!currentDeckName) {
      alert('No deck is currently selected to delete.');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete the deck "${currentDeckName}"? This action cannot be undone.`)) {
      return;
    }

    const updatedDecks = { ...allDecks };
    delete updatedDecks[currentDeckName];

    const remainingNames = Object.keys(updatedDecks);
    const newCurrentName = remainingNames[0] || '';

    localStorage.setItem(LOCAL_KEY, JSON.stringify(updatedDecks));
    setDeckState({
      allDecks: updatedDecks,
      currentDeckName: newCurrentName
    });

    if (newCurrentName && updatedDecks[newCurrentName]) {
      const deck = updatedDecks[newCurrentName];
      setMainDeck(deck.main || []);
      setExtraDeck(deck.extra || []);
      setSideDeck(deck.side || []);
    } else {
      setMainDeck([]);
      setExtraDeck([]);
      setSideDeck([]);
    }

    alert(`Deck deleted!`);
  };

  // ✅ Clear deck
  const clearDeck = () => {
    if (!window.confirm("Are you sure you want to clear all cards from the current deck?")) {
      return;
    }
    setMainDeck([]);
    setExtraDeck([]);
    setSideDeck([]);
  };

  const countTotalCopies = (cardId) => (
    mainDeck.filter(c => c.id === cardId).length +
    extraDeck.filter(c => c.id === cardId).length +
    sideDeck.filter(c => c.id === cardId).length
  );

  const isExtraType = (type) => {
    if (!type) return false;
    const lower = type.toLowerCase();
    return ['fusion', 'synchro', 'xyz', 'link'].some(t => lower.includes(t));
  };

  const isBannedType = (card) => {
    const type = (card.type || '').toLowerCase();
    return type.includes('link') || type.includes('pendulum');
  };

  const addToMainOrExtra = (card) => {
    if (isBannedType(card)) {
      alert('Link and Pendulum cards are not allowed in this format.');
      return;
    }
    if (countTotalCopies(card.id) >= 3) {
      alert('You cannot have more than 3 copies of the same card.');
      return;
    }
    if (isExtraType(card.type)) {
      if (extraDeck.length >= 15) {
        alert('Extra Deck is full.');
        return;
      }
      setExtraDeck([...extraDeck, card]);
    } else {
      if (mainDeck.length >= 60) {
        alert('Main Deck is full.');
        return;
      }
      setMainDeck([...mainDeck, card]);
    }
  };

  const addToSide = (card) => {
    if (isBannedType(card)) {
      alert('Link and Pendulum cards are not allowed in this format.');
      return;
    }
    if (countTotalCopies(card.id) >= 3) {
      alert('You cannot have more than 3 copies of the same card.');
      return;
    }
    if (sideDeck.length >= 15) {
      alert('Side Deck is full.');
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

  const getDeckScore = () => {
    const allCards = [...mainDeck, ...extraDeck, ...sideDeck];
    return allCards.reduce((sum, card) => {
      const score = CardScores[card.name] || 0;
      return sum + score;
    }, 0);
  };

  // 🔎 Search with debounce
  useEffect(() => {
    if (search.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const controller = new AbortController();
    const delayDebounce = setTimeout(() => {
      setLoading(true);
      setError(null);

      fetch(
        `https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${encodeURIComponent(search)}`,
        { signal: controller.signal }
      )
        .then(res => {
          if (res.ok) return res.json();
          if (res.status === 400) return { data: [] };
          throw new Error('API error');
        })
        .then(data => {
          setSearchResults(data.data || []);
          setLoading(false);
        })
        .catch(err => {
          if (err.name === 'AbortError') return;
          console.error(err);
          setError('Error connecting to the API.');
          setLoading(false);
        });
    }, 300);

    return () => {
      clearTimeout(delayDebounce);
      controller.abort();
    };
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
        <h2>Genesys Format Deck Builder</h2>
      </div>

      <div className="row">
        <div className="col-md-3 mb-3">
          <CardPreview card={selectedCard} />
        </div>

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
              <button className="btn btn-tech btn-sm" onClick={saveDeck}>Save</button>
              <button className="btn btn-tech btn-sm" onClick={saveAsDeck}>Save As</button>
              <button className="btn btn-tech btn-sm" onClick={renameDeck}>Rename</button>
              <button className="btn btn-tech btn-sm" onClick={sortDeck}>Sort</button>
              <button className="btn btn-warning btn-sm" onClick={clearDeck}>Clear</button>
              <button className="btn btn-danger btn-sm" onClick={deleteDeck}>Delete</button>
            </div>

            <div className="d-flex flex-wrap gap-2 mb-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="New deck name"
                value={newDeckName}
                onChange={(e) => setNewDeckName(e.target.value)}
              />
              <button className="btn btn-outline-success btn-sm" onClick={createNewDeck}>Create</button>
            </div>

            {/* Total Score */}
            <div className="text-center text-light mb-2">
              Deck Score: {getDeckScore()}
            </div>

            <DeckRow title="Main Deck" cards={mainDeck} onRemove={(i) => removeFromDeck(mainDeck, i)} onHover={setSelectedCard} />
            <DeckRow title="Extra Deck" cards={extraDeck} onRemove={(i) => removeFromDeck(extraDeck, i)} onHover={setSelectedCard} />
            <DeckRow title="Side Deck" cards={sideDeck} onRemove={(i) => removeFromDeck(sideDeck, i)} onHover={setSelectedCard} />
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="results-container">
            <input
              type="text"
              className="form-control form-control-sm mb-2"
              placeholder="Search cards..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : (
              searchResults.length === 0 ? (
                <p className="text-muted text-center">No results found.</p>
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
