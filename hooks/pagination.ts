import { useEffect, useState } from 'react';

type PaginationData<R> = {
  totalPages: number;
  data: { [page: number]: R[] };
  currentPage: number;
}

export function usePaginationState<R>(args: {
  keys: string[];
  keyName: string;
  fetchFunction: (args: { lastRecord?: R; skip?: number } & any) => Promise<{ total: number; data: Array<R> }>
  itemsPerPage?: number;
  filters?: any;
}) {
  const { keys, keyName, filters = {}, itemsPerPage = 10, fetchFunction } = args;
  const [isInit, setInit] = useState(false);
  const [pages, setPages] = useState<{
    [key: string]: PaginationData<R>
  }>({});

  const init = async () => {
    const initData: { [key: string]: PaginationData<R> } = {};
    const initRes = await Promise.all(keys.map(async (key) => {
      const { total, data } = await fetchFunction({ [keyName]: key, ...filters });
      const totalPages = Math.ceil((total || 1) / itemsPerPage);
      return { key, totalPages, data };
    }));
    initRes.map(({ key, totalPages, data }) => {
      Object.assign(initData, { [key]: { totalPages, data: { 1: data }, currentPage: 1 } });
    });
    setPages(initData);
  }

  const onChangePage = (args: { page: number; key: string; }) => {
    const { page, key } = args;
    if (!pages.hasOwnProperty(key)) return;
    const currentKey = pages[key];
    if (page > currentKey.totalPages) return;
    if (page === currentKey.currentPage) return;
    if (currentKey.data.hasOwnProperty(page)) {
      setPages({ ...pages, [key]: { ...currentKey, currentPage: page } });
    } else if (currentKey.data.hasOwnProperty(page - 1)) {
      const [lastRecord] = currentKey.data[page - 1].slice(-1);
      fetchFunction({ lastRecord, [keyName]: key, ...filters })
        .then(({ data }) => setPages({ ...pages, [key]: { ...currentKey, currentPage: page, data: { ...currentKey.data, [page]: data } } }));
    } else {
      const skip = (page - 1) * itemsPerPage;
      fetchFunction({ skip, [keyName]: key, ...filters })
        .then(({ data }) => setPages({ ...pages, [key]: { ...currentKey, currentPage: page, data: { ...currentKey.data, [page]: data } } }));
    }
  }

  useEffect(() => {
    if (!isInit) init().then(() => setInit(true));
  }, [isInit]);

  return { pages, onChangePage };
}