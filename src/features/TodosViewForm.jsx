function TodosViewForm({
  sortDirection,
  setSortDirection,
  sortField,
  setSortField,
  queryString,
  setQueryString,
}) {
  const preventRefresh = e => {
    e.preventDefault();
  };
  return (
    <form onSubmit={preventRefresh}>
      <div>
        <label>Search Todos</label>
        <input
          type="text"
          value={queryString}
          onChange={e => {
            setQueryString(e.target.value);
          }}
        ></input>
        <button
          type="button"
          onClick={e => {
            setQueryString("");
          }}
        >
          Clear
        </button>
      </div>
      <div>
        <label>Sort by</label>
        <select onChange={e => setSortField(e.target.value)} value={sortField}>
          <option value="title">Title</option>
          <option value="createdTime">Time added</option>
        </select>

        <label>Direction</label>
        <select
          onChange={e => setSortDirection(e.target.value)}
          value={sortDirection}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </form>
  );
}
export default TodosViewForm;
