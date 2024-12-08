
function Search({ onSearchChange, searchData }) {
  // console.log('>>>check searchData', searchData);

  return (
    <div className="search-container">  
          <i className="search-icon bi bi-search"></i> 

      <input
        type="text"
        className="search-input"  
        placeholder="Search theo kiểu"
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}

export default Search;