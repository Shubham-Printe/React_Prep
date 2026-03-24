'use client';

import * as React from 'react';
import createCache, { Options } from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider as DefaultCacheProvider } from '@emotion/react';

export type NextAppDirEmotionCacheProviderProps = {
  /** This is the options passed to the `cache` function. */
  options: Options;
  /** By default, we inject the style tags in the head of the document.
   * But if you want to inject them at the end of the body, you can set this to true. */
  injectAt?: 'first' | 'end';
  children: React.ReactNode;
};

// Adapted from https://github.com/garronej/tss-react/blob/main/src/nextAppDirEmotionCache.tsx
export default function NextAppDirEmotionCacheProvider(props: NextAppDirEmotionCacheProviderProps) {
  const { options, injectAt, children } = props;

  const [EmotionCache] = React.useState(() => {
    let cache = createCache(options);
    cache.compat = true;
    if (injectAt) {
      cache = createCache({ 
        ...options, 
        insertionPoint: document.querySelector(injectAt) as HTMLElement ?? undefined 
      });
    }
    return cache;
  });

  useServerInsertedHTML(() => {
    const serialized = EmotionCache.inserted;
    if (!serialized) {
      return null;
    }

    const names = Object.keys(serialized).join(' ');
    return (
      <style
        data-emotion={`${EmotionCache.key} ${names}`}
        dangerouslySetInnerHTML={{
          __html: Object.values(serialized).join(' '),
        }}
      />
    );
  });

  return <DefaultCacheProvider value={EmotionCache}>{children}</DefaultCacheProvider>;
}
