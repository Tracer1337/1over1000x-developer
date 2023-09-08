import { useState, useEffect, useCallback } from 'react';
import { isEvent } from 'shared/bridge';

export function useScreenCaptureProcess() {
  const [loading, setLoading] = useState(false);

  const handleOnMessage = useCallback((event: any) => {
    if (!isEvent(event) || event.type !== 'capture.process') {
      return;
    }
    setLoading(event.data.loading);
  }, []);

  useEffect(() => {
    chrome.runtime.onMessage.addListener(handleOnMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(handleOnMessage);
    };
  }, [handleOnMessage]);

  return loading;
}
