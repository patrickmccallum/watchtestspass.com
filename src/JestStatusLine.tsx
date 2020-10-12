import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
`;

const Label = styled.div`
  flex: 0;
  min-width: 100px;
`;

const Value = styled.div`
  flex: 1;
`;

interface JestStatusLineProps {
  label: string;
  content: Node | Element | JSX.Element;
}

export const JestStatusLine = ({ label, content }: JestStatusLineProps) => {
  return (
    <Container>
      <Label>{label}</Label>
      <Value>{content}</Value>
    </Container>
  );
};
