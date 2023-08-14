import { useEffect, useState } from 'react';
import { StorageKeys } from 'shared/storage';

export function useCache() {
  const [content, setContent] = useState('');

  const loadCache = () => {
    chrome.storage.local
      .get([StorageKeys.TAB_GROUP_TITLES])
      .then((localStorage) => {
        const parsed = Object.fromEntries(
          Object.entries(localStorage).map(([key, value]) => [
            key,
            JSON.parse(value),
          ]),
        );
        setContent(JSON.stringify(parsed, null, 2));
      });
  };

  const clearCache = () => {
    chrome.storage.local
      .set({ [StorageKeys.TAB_GROUP_TITLES]: JSON.stringify({}) })
      .then(() => loadCache());
  };

  useEffect(() => loadCache(), []);

  return { content, clearCache };
}
