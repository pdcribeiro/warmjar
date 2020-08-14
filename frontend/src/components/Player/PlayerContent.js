import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { usePlayer } from '../../hooks/use-player';
import cursor from './cursor.svg';

const Styled = styled.div`
  width: 100%;
  padding-top: 56.25%;
  margin-bottom: 20px;
  outline: 1px solid grey;
  position: relative;
  overflow: hidden;

  > div {
    width: ${props => props.size.width}px;
    height: ${props => props.size.height}px;
    background-color: #eee;
    position: absolute;
    top: ${props => props.margin.y}px;
    left: ${props => props.margin.x}px;
    transform: scale(${props => props.scale});
    transform-origin: left top;
  }
`;

const Cursor = styled.div`
  width: 20px;
  height: 20px;
  background-image: url('${cursor}');
  position: absolute;
  top: ${props => props.position.y + 'px'};
  left: ${props => props.position.x + 'px'};

  &::after {
    display: block;
    width: 1px;
    height: 1px;
    border-radius: 50%;
    content: '';
    /* position: absolute; */
    z-index: -1;
    ${'' /* transition: 0.1s; */}

    ${props =>
      props.down &&
      `
      background-color: #f005;
      transform: scale(40);
      transition: 0s;
    `}
  }
`;

export function PlayerContent() {
  const selfRef = useRef();
  const [layout, setLayout] = useState({
    size: { width: 1366, height: 642 }, //TODO
    scale: 0,
    margin: { x: 0, y: 0 },
  });
  const { mouse } = usePlayer();

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function handleResize() {
    if (selfRef.current) {
      const frameWidth = selfRef.current.offsetWidth;
      const frameHeight = selfRef.current.offsetHeight;

      setLayout(({ size, scale }) => ({
        size,
        scale: frameWidth / size.width,
        margin: { x: 0, y: (frameHeight - size.height * scale) / 2 },
      }));
    }
  }

  useEffect(handleResize, [selfRef.current]);

  return (
    <Styled {...layout} ref={selfRef}>
      <div>
        <Cursor {...mouse} />
      </div>
    </Styled>
  );
}
