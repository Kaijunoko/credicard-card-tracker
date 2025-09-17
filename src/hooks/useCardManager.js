import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function useCardManager() {
  const [cards, setCards] = useState([]);

  const addCard = (card) => {
    const newCard = {
      ...card,
      id: uuidv4(),
      spent: 0,
    };
    setCards((prev) => [...prev, newCard]);
  };

  const updateCard = (id, updatedData) => {
    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, ...updatedData } : card))
    );
  };

  const deleteCard = (id) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
  };

  const updateSpent = (id, amount) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, spent: Number(amount) } : card
      )
    );
  };

  return { cards, addCard, updateCard, deleteCard, updateSpent };
}