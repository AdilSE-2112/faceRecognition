import React, { useState, useEffect, useContext, createContext } from 'react';

const SearchContext = createContext()

const SearchProvider = ({ children }) => {
    const [file, setFile] = useState(null);
    const [iin, setIIN] = useState(null);

    const [lastRequest, setLastRequest] = useState(null);

    return (
        <SearchContext.Provider 
            value={{ file, setFile, iin, setIIN, lastRequest, setLastRequest }} 
        >
            {children}
        </SearchContext.Provider>
    );
};

export default SearchProvider;

export const useSearch = () => {
    return useContext(SearchContext)
}
