const Searchbar = ({ handleSearch }) => {
    return (
        <div className="searchbar">
            <form onSubmit={handleSearch}>
            <input/>
            <button type="submit">search</button>
            </form> 
        </div>
    )
}

export default Searchbar