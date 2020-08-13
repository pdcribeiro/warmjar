import { navigate } from '@reach/router';
import { useEffect } from 'react';

export function useAnchorElements() {
  useEffect(() => {
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  function handleClick(event) {
    const anchor = event.target.closest('a');
    if (anchor) {
      event.preventDefault();
      navigate(anchor.href);
    }
  }
}