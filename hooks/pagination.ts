import { useEffect, useState } from 'react';

type PaginationData<R> = {
  data: { [page: number]: R[] };
  currentPage: number;
}

export function usePaginationState<R>(args: {
  keys: string[];
  keyName: string;
  fetchFunction: (args: { lastRecord?: R; skip?: number, [x: string]: any }) => Promise<Array<R>>
  itemsPerPage?: number;
  filters?: any;
}) {
  const { keys, keyName, itemsPerPage = 10, fetchFunction } = args;
  const filters = { ...args.filters, limit: itemsPerPage };
  const [isInit, setInit] = useState(false);
  const [pages, setPages] = useState<{
    [key: string]: PaginationData<R>
  }>({});

  const init = async () => {
    const initData: { [key: string]: PaginationData<R> } = {};
    const initRes = await Promise.all(keys.map(async (key) => {
      const data = await fetchFunction({ [keyName]: key, ...filters });
      return { key, data };
    }));
    initRes.map(({ key, data }) => {
      Object.assign(initData, { [key]: { data: { 1: data }, currentPage: 1 } });
    });
    setPages(initData);
  }

  const onChangePage = (args: { page: number; key: string; }) => {
    const { page, key } = args;
    if (!pages.hasOwnProperty(key)) return;
    const currentKey = pages[key];
    if (page === currentKey.currentPage) return;
    if (currentKey.data.hasOwnProperty(page)) {
      setPages({ ...pages, [key]: { ...currentKey, currentPage: page } });
    } else if (currentKey.data.hasOwnProperty(page - 1)) {
      const [lastRecord] = currentKey.data[page - 1].slice(-1);
      fetchFunction({ lastRecord, [keyName]: key, ...filters })
        .then((data) => setPages({ ...pages, [key]: { ...currentKey, currentPage: page, data: { ...currentKey.data, [page]: data } } }));
    } else {
      const skip = (page - 1) * itemsPerPage;
      fetchFunction({ skip, [keyName]: key, ...filters })
        .then((data) => setPages({ ...pages, [key]: { ...currentKey, currentPage: page, data: { ...currentKey.data, [page]: data } } }));
    }
  }

  useEffect(() => {
    if (!isInit) init().then(() => setInit(true));
  }, [isInit]);

  useEffect(() => {
    if (isInit) {
      setPages({});
      setInit(false);
    }
  }, [itemsPerPage, filters['field'], filters['asc']]);

  return { pages, onChangePage };
}

export function useTotalPagesState(args: {
  keys: string[];
  keyName: string;
  api: (filter: any) => Promise<{ total: number }>;
  filters?: any;
  itemPerPages?: number;
}) {
  const [isLoaded, setLoaded] = useState(false);
  const [mapTotal, setMapTotal] = useState<{ [x: string]: number }>({});
  const [mapTotalPages, setMapTotalPages] = useState<{ [x: string]: number }>({});
  const { keys, keyName, api, filters = {}, itemPerPages = 10 } = args;

  const init = async () => {
    const initData: { [x: string]: number } = {};
    const initPage: { [x: string]: number } = {};
    const initRes = await Promise.all(keys.map(async (key) => {
      const { total } = await api({ ...filters, [keyName]: key });
      return { key, total }
    }));
    initRes.map(({ key, total }) => {
      Object.assign(initData, { [key]: Math.ceil((total || 1) / itemPerPages) });
      Object.assign(initPage, { [key]: total });
    });
    setMapTotalPages(initData);
    setMapTotal(initPage);
    setLoaded(true);
  }

  useEffect(() => {
    if (!isLoaded) {
      init();
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      Object.keys(mapTotalPages).map((key) => {
        mapTotalPages[key] = Math.ceil((mapTotal[key] || 1) / itemPerPages);
      });
    }
  }, [itemPerPages]);

  return { mapTotalPages, mapTotal };
}