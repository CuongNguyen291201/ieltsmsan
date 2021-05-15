export type TypeSort = 'score' | 'lastUpdate';

export const SortingOpts: { [x: string]: { key: string; value: { field: TypeSort; asc: boolean } } } = {
  SCORE_DESC: { key: '0', value: { field: 'score', asc: false } },
  SCORE_ASC: { key: '1', value: { field: 'score', asc: true } },
  LATEST: { key: '2', value: { field: 'lastUpdate', asc: false } },
  EARLIEST: { key: '3', value: { field: 'lastUpdate', asc: true } }
}
