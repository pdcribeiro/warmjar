import React from 'react';
import styled from 'styled-components';

import { usePlayer } from '../../hooks/use-player';
import { PlayerContent } from './PlayerContent';
import { PlayerControls } from './PlayerControls';

export function Player() {
  const { visit } = usePlayer();

  if (visit === null) {
    return null;
  }

  return (
    <StyledDiv>
      <PlayerControls />
      <PlayerContent />
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  width: 100%;
  height: 0;
  margin-top: 20px;

  @media (min-width: 768px) {
    width: 50%;
  }
`;
