import React, { useState, useEffect } from 'react';

const ApkInfo = ({onSelectApk , onUploads }) => {
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [error, setError] = useState([]);
  const [SelectedApk, setSelectedHidden] = useState(true);
  const [apk, setPkg] = useState([]);
  
  const handleChange = (event) => {
    const value = event.target.value;
    setQuery(value);
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (query) {
        try {
          const response = await fetch(`http://localhost:5000/search?q=${query}`);
          if (response.ok) {
            const data = await response.json();
            setSearchResult(data);
            setSelectedHidden(true);
            setError('');
          } else {
            throw new Error('Failed to fetch search results');
          }
        } catch (error) {
          setError('Error fetching search results');
          setSearchResult([]);
        }
      } else {
        setSearchResult([]);
      }
    };

    const timeoutId = setTimeout(fetchSearchResults, 300);
    return () => {
      clearTimeout(timeoutId);
      setSearchResult([]);
    };
  }, [query]);

  const handleSearch = (index) => {
    const selectedApk = searchResult[index];
    setPkg((prevPkg) => {
      // Access the previous state value to ensure accuracy
      const newPkg = selectedApk;
      setSelectedHidden(false);
      return newPkg;
    });
    setQuery('');
    setSearchResult([]);
    onSelectApk(selectedApk);
  };

  return (
    <div className='search-container'>
      <input
        className='search-bar'
        type="text"
        placeholder="Select App..."
        value={query}
        onChange={handleChange}
      />
      {!SelectedApk && (
        <div className='Selected-apk'>
          <img src={apk.icon} alt="App Icon" />
          <h3>{apk.title}</h3>
          <h6>Version {apk.version}</h6>
        </div>
      )}
      {searchResult.length > 0 && (
        <div className='result-container'>
          <div></div>
          {searchResult.map((result, index) => (
            <div key={index} className='search-result' onClick={() => handleSearch(index)}>
              <img src={result.icon} alt="App Icon" className='image' />
              <div>
                <h3>{result.title}</h3>
              </div>
              <div>
                <h6>{`Version ${result.version}`}</h6>
              </div>
            </div>
          ))}
        </div>
      )}
      {error && <div>{error}</div>}
    </div>
  );
};

export default ApkInfo;
