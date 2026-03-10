import React, { createContext, useState, useEffect } from 'react';

// Create Context
export const TransactionContext = createContext();

// Provider Component
export const TransactionProvider = ({ children }) => {
    const [transactions, setTransactions] = useState(() => {
        // Load from local storage on initial render
        const saved = localStorage.getItem('transactions');
        return saved ? JSON.parse(saved) : [];
    });

    // Save to local storage whenever transactions change
    useEffect(() => {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }, [transactions]);

    // Actions
    const addTransaction = (transaction) => {
        setTransactions((prev) => [
            { id: Date.now(), ...transaction }, // Add unique ID
            ...prev
        ]);
    };

    const deleteTransaction = (id) => {
        setTransactions((prev) => prev.filter(t => t.id !== id));
    };

    return (
        <TransactionContext.Provider value={{
            transactions,
            addTransaction,
            deleteTransaction
        }}>
            {children}
        </TransactionContext.Provider>
    );
};
