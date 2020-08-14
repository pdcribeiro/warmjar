import React from 'react';
import styled from 'styled-components';

import { PlayerContent } from './PlayerContent';
import { PlayerControls } from './PlayerControls';

const Styled = styled.div`
  width: 50%;
  height: 0;
  margin-top: 20px;

  @media (max-width: 768px) {
    width: 100%;
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
