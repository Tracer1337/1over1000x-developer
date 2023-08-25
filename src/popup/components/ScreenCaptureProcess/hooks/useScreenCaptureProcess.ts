import { useState, useEffect, useCallback } from 'react';
import { isEvent } from 'shared/bridge';

export function useScreenCaptureProcess() {
  const [progress, setProgress] = useState(1);

  const handleOnMessage = useCallback((event: any) => {
    if (!isEvent(event) || event.type !== 'capture.process') {
      return;
    }
    setProgress(event.data.progress);
  }, []);

  useEffect(() => {
    chrome.runtime.onMessage.addListener(handleOnMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(handleOnMessage);
    };
  }, [handleOnMessage]);

  return progress;
}
