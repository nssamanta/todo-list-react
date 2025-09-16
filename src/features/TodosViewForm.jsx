import { useState, useEffect } from 'react';

function TodosViewForm({
  sortDirection,
  setSortDirection,
  sortField,
  setSortField,
  queryString,
  setQueryString,
}) {
  const [localQueryString, setLocalQueryString] = useState(queryString);

  useEffect(()=>{
    console.log('🔄 useEffect triggered, localQueryString:', localQueryString);
    const debounce = setTimeout(()=> {
      console.log(
        '⏰ Timer executed! Setting queryString to:',
        localQueryString
      );
      setQueryString(localQueryString)},500);

    console.log('🔁 New timer set for 500ms');

    return () => {
      console.log('🧹 Cleanup: clearing timeout (timer reset)', debounce);
      clearTimeout(debounce);
      };
  }, [localQueryString, setQueryString]);

  const preventRefresh = e => {
    e.preventDefault();
  };


  return (
    <form onSubmit={preventRefresh}>
      <div>
        <label>Search Todos</label>
        <input
          type="text"
          value={localQueryString}
          onChange={e => {
            console.log('⌨️ User typed:', e.target.value);
            setLocalQueryString(e.target.value);
          }}
        />
        <button
          type="button"
          onClick={e => {
            console.log('🗑️ Clear button clicked');
            setLocalQueryString("");
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
