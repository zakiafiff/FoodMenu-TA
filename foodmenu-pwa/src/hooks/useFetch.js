import { useCallback, useEffect, useRef, useState } from 'react';

// fetcher harus mengembalikan Promise<{ data, fromCache }>
export default function useFetch(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null, fromCache: false });
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const run = useCallback(() => {
    let active = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    fetcherRef.current()
      .then(({ data, fromCache }) => active && setState({ data, loading: false, error: null, fromCache }))
      .catch((error) => active && setState({ data: null, loading: false, error, fromCache: false }));
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => run(), [run]);
  return { ...state, reload: run };
}
