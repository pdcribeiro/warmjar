import React from 'react';
import styled from 'styled-components';

import { PlayerContent } from './PlayerContent';
import { PlayerControls } from './PlayerControls';

const Styled = styled.div`
  width: 100%;
  height: 0;
  margin-top: 20px;

  @media (min-width: 768px) {
    width: 50%;
  }
`;

export function Player() {
  return (
    <Styled>
      <PlayerControls />
      <PlayerContent />
    </Styled>
  );
}
