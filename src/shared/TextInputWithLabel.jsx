import styled from 'styled-components';
import React from 'react';

//define styled components
const StyledWrapper = styled.div`
  padding: 0.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledLabel = styled.label`
  margin-bottom: 0.25rem;
  font-weight: bold;
`;
const StyledInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-left: 1rem;
`;

const TextInputWithLabel = React.forwardRef(
  ({ elementId, labelText, onChange, value }, ref) => {
    return (
      <StyledWrapper>
        <StyledLabel htmlFor={elementId}>{labelText}</StyledLabel>
        <StyledInput
          type="text"
          id={elementId}
          ref={ref}
          value={value}
          onChange={onChange}
        />
      </StyledWrapper>
    );
  }
);

export default TextInputWithLabel;
