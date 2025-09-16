import React, { useLayoutEffect, useRef } from 'react';

export const useAutoscroll = <T extends HTMLElement>(
  dependency: any,
  enabled: boolean,
): React.RefObject<T> => {
  const ref = useRef<T>(null);
  const isScrolledToBottom = useRef(true);

  useLayoutEffect(() => {
    const el = ref.current;
    if (el) {
      const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = el;
        const atBottom = scrollHeight - scrollTop - clientHeight < 1;
        isScrolledToBottom.current = atBottom;
      };
      el.addEventListener('scroll', handleScroll, { passive: true });
      return () => el.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useLayoutEffect(() => {
    if (enabled && isScrolledToBottom.current && ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [dependency, enabled]);

  return ref;
};
