import React, { useEffect, useState } from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { createTheme, SxProps, ThemeProvider } from '@mui/material';
import { createPortal } from 'react-dom';
import { useLocation } from 'wouter';
import {
  BaseLocationHook,
  navigate,
  useLocationProperty,
} from 'wouter/use-location';
import { StorageKeys, useStorageValue } from './storage';

export async function waitForSelector<T extends HTMLElement>(
  selector: string,
  timeout = 5,
) {
  let result: T | null = null;
  const startTime = Date.now();
  while (!result) {
    result = document.querySelector(selector);
    if (Date.now() - startTime > timeout * 1000) {
      throw new Error(`Element with selector '${selector}' could not be found`);
    }
    await new Promise(requestAnimationFrame);
  }
  return result;
}

const handledElements = new Set<Element>();

export function shouldHandleElement(element: Element) {
  const hasElemement = handledElements.has(element);
  handledElements.add(element);
  return !hasElemement;
}

export function resetHandledElementMarkers() {
  document
    .querySelectorAll('[is-handled]')
    .forEach((element) => element.removeAttribute('is-handled'));
}

export function getOrCreateContainer(
  id: string,
  parentSelector = 'body',
  method: 'appendChild' | 'prepend' = 'appendChild',
) {
  const parent = document.querySelector(parentSelector);
  if (!parent) {
    throw new Error(
      `Element with selector '${parentSelector}' could not be found`,
    );
  }
  let container = document.getElementById(id);
  if (!container) {
    container = document.createElement('div');
    container.setAttribute('id', id);
    parent[method](container);
  }
  return container;
}

export function mergeSxProps(...sxProps: (SxProps | undefined)[]) {
  return sxProps
    .reduce(
      (merged, sx) => merged.concat(...(Array.isArray(sx) ? sx : [sx])),
      [] as SxProps[],
    )
    .flat();
}

export function withShadowRoot(
  container: HTMLElement,
  children: React.ReactNode,
): React.ReactNode {
  const shadowContainer = container.attachShadow({ mode: 'open' });
  const emotionRoot = document.createElement('style');
  const shadowRootElement = document.createElement('div');
  shadowContainer.appendChild(emotionRoot);
  shadowContainer.appendChild(shadowRootElement);

  const cache = createCache({
    key: 'css',
    prepend: true,
    container: emotionRoot,
  });

  const theme = createTheme({
    components: {
      MuiPopover: {
        defaultProps: {
          container: shadowRootElement,
        },
      },
      MuiPopper: {
        defaultProps: {
          container: shadowRootElement,
        },
      },
      MuiModal: {
        defaultProps: {
          container: shadowRootElement,
        },
      },
    },
  });

  return createPortal(
    React.createElement(
      CacheProvider,
      { value: cache },
      React.createElement(ThemeProvider, { theme }, children),
    ),
    shadowContainer,
  );
}

export function useMutationObserver(
  callback: () => void,
  element: Element | null,
  config: MutationObserverInit = {
    attributes: true,
    childList: true,
    subtree: true,
  },
) {
  useEffect(() => {
    if (!element) {
      return;
    }
    const observer = new MutationObserver(callback);
    observer.observe(element, config);
    return () => {
      observer.disconnect();
    };
  }, [callback, element]);
}

export function getHost() {
  const hostParts = location.host.split('.');
  if (hostParts.length < 2) {
    return hostParts[0];
  }
  return `${hostParts[hostParts.length - 2]}.${
    hostParts[hostParts.length - 1]
  }`;
}

export function useSavedLocation(storageKey: StorageKeys) {
  const [location, setLocation] = useLocation();
  const [savedLocation, setSavedLocation] = useStorageValue(storageKey);
  const [hasRedirected, setHasRedirected] = useState(false);

  if (savedLocation && typeof savedLocation !== 'string') {
    throw new Error('Saved location is not of type string');
  }

  const saveLocation = () => {
    setSavedLocation(location);
  };

  const clearSavedLocation = () => {
    setSavedLocation('/');
  };

  const goToSavedLocation = () => {
    useEffect(() => {
      if (savedLocation && !hasRedirected) {
        setLocation(savedLocation);
        setHasRedirected(true);
      }
    }, [savedLocation, hasRedirected]);
  };

  const isSavedLocation = location === savedLocation;

  return {
    saveLocation,
    clearSavedLocation,
    goToSavedLocation,
    isSavedLocation,
  };
}

export function useHashLocation(): ReturnType<BaseLocationHook> {
  const location = useLocationProperty(
    () => window.location.hash.replace(/^#/, '') || '/',
  );
  return [location, (to: string) => navigate(`#${to}`)];
}

export function useDebouncedEffect(
  callback: React.EffectCallback,
  deps: React.DependencyList,
  timeout: number,
) {
  useEffect(() => {
    let destructor: (() => void) | void;

    const id = setTimeout(() => {
      destructor = callback();
    }, timeout);

    return () => {
      clearTimeout(id);
      destructor?.();
    };
  }, deps);
}
