import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled, { StyleSheetManager } from 'styled-components';

import { usePlayer } from '../../hooks/use-player';

export function IFrame({ head, children }) {
  const selfRef = useRef();
  const { dom } = usePlayer();
  const doc = selfRef.current?.contentDocument;

  useEffect(() => {
    // console.log('dom changed', dom);// && dom.length);
    if (doc) {
      clearDOM();
      if (dom){
        doc.body.insertAdjacentHTML('afterbegin', dom);
      }
    }
  }, [dom]);

  function clearDOM() {
    const children = Array.from(doc.body.children);
    children.pop(); // pop cursor element
    children.forEach(child => doc.body.removeChild(child));
  }

  return (
    <StyledIFrame ref={selfRef}>
      {doc && createPortal(head, doc.head)}
      {doc &&
        createPortal(
          <StyleSheetManager target={doc.head}>{children}</StyleSheetManager>,
          doc.body
        )}
    </StyledIFrame>
  );
}

const StyledIFrame = styled.iframe`
  width: 100%;
  height: 100%;
  border: 0;
  outline: 1px solid grey;
  overflow: hidden;
`;
