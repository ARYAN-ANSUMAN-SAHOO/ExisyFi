import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'USD');

    useEffect(() => {
        localStorage.setItem('currency', currency);
    }, [currency]);

    const getSymbol = () => {
        if (currency === 'EUR') return '€';
        if (currency === 'INR') return '₹';
        return '$';
    };

    const convertNumber = (amountInUSD) => {
        let rate = 1;
        if (currency === 'EUR') rate = 0.92;
        if (currency === 'INR') rate = 83.0;
        return amountInUSD * rate;
    };

    const formatAmount = (amountInUSD) => {
        return convertNumber(amountInUSD).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, symbol: getSymbol(), convertNumber, formatAmount }}>
            {children}
        </CurrencyContext.Provider>
    );
};
