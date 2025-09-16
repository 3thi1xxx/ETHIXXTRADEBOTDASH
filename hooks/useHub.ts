import { useEffect } from 'react';
import { hub } from '../lib/hub';
import { useOGStoreActions } from '../store/useOG';

export const useHub = () => {
  const { ingest, setStatus, clearData } = useOGStoreActions();

  useEffect(() => {
    // Subscribe the store's ingest function to the hub
    hub.subscribe(ingest);
    
    // Start the hub, providing the store's setStatus action as a callback
    hub.start(setStatus);

    return () => {
      // Cleanup on unmount
      hub.unsubscribe(ingest);
      hub.stop();
      clearData();
    };
  }, [ingest, setStatus, clearData]);
};
