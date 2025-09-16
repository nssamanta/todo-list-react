import { useState, useEffect } from 'react';
import styled from 'styled-components';

//define style components 
const StyledForm = styled.form`
  padding: 1rem;
  border: 2px solid #89dbe6;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const StyledSelection = styled.div`
  padding: 0.5rem 0;
`;

const StyledLabel = styled.label`
  margin-right: 0.5rem;
`;

const StyledInput = styled.input`
  margin-right: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const StyledSelect = styled.select`
  margin-right: 1rem;
  padding: 0.25rem;
`;

const StyledButton = styled.button`
  border-radius: 5px;
  border: 1px solid black;
  background-color: #89dbe6;
  cursor: pointer;
  margin: 0.4rem;
`;

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
    <StyledForm onSubmit={preventRefresh}>
      <StyledSelection>
        <StyledLabel>Search Todos</StyledLabel>
        <StyledInput
          type="text"
          value={localQueryString}
          onChange={e => {
            console.log('⌨️ User typed:', e.target.value);
            setLocalQueryString(e.target.value);
          }}
        />
        <StyledButton
          type="button"
          onClick={e => {
            console.log('🗑️ Clear button clicked');
            setLocalQueryString("");
          }}
        >
          Clear
        </StyledButton>
      </StyledSelection>
      <StyledSelection>
        <StyledLabel>Sort by</StyledLabel>
        <StyledSelect onChange={e => setSortField(e.target.value)} value={sortField}>
          <option value="title">Title</option>
          <option value="createdTime">Time added</option>
        </StyledSelect>

        <StyledLabel>Direction</StyledLabel>
        <StyledSelect
          onChange={e => setSortDirection(e.target.value)}
          value={sortDirection}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </StyledSelect>
      </StyledSelection>
    </StyledForm>
  );
}
export default TodosViewForm;
