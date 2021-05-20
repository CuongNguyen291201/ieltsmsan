import { saveAs } from 'file-saver';
import { extension } from 'mime-types';
import moment from 'moment';
import { BAREM_SCORE_SAT_BIO, BAREM_SCORE_SAT_CHEMISTRY, BAREM_SCORE_SAT_MATH, BAREM_SCORE_SAT_PHYSICS, BAREM_SCORE_TOEIC } from '../sub_modules/game/src/gameConfig';
import { ROUTER_GAME } from './router';
moment.locale('vi');

export const formatTimeClock = (time: any) => {
  const sec_num = parseInt(time, 10); // don't forget the second param
  const hours = Math.floor(sec_num / 3600);
  let minutes: number | string = Math.floor((sec_num - (hours * 3600)) / 60);
  let seconds: number | string = sec_num - (hours * 3600) - (minutes * 60);

  if (minutes < 10) minutes = `0${minutes}`;
  if (seconds < 10) seconds = `0${seconds}`;
  return `${hours}h:${minutes}m:${seconds}s`;
}

export const formatDateDMY = (time: any) => {
  const todayTime = new Date(time);
  const mm = todayTime.getMonth() + 1; // getMonth() is zero-based
  const dd = todayTime.getDate();

  return [
    `${dd > 9 ? '' : '0'}${dd}`,
    `${mm > 9 ? '' : '0'}${mm}`,
    todayTime.getFullYear(),
  ].join('/');
}

export const getBrowserSlug = (slug: string, type: number, id: string) => `${encodeURIComponent(slug)}-${type}-${id}`;

export const genUnitScore = (barem: number) => {
  switch (barem) {
    case BAREM_SCORE_SAT_BIO:
    case BAREM_SCORE_SAT_MATH:
    case BAREM_SCORE_SAT_CHEMISTRY:
    case BAREM_SCORE_SAT_PHYSICS:
    case BAREM_SCORE_TOEIC:
      return " điểm"
    default:
      return " %"
  }
}

export const numberFormat = new Intl.NumberFormat();

export const downloadFromURL = (url: string, contentType: string = '', filename: string = 'download') => {
  const fileExtension = extension(contentType);
  return saveAs(url, `${encodeURIComponent(filename)}${fileExtension ? `.${fileExtension}` : ''}`);
}

export const formatTimeHM = (time: number) => {
  const dateTime = new Date(time);
  const hour = dateTime.getHours();
  const min = dateTime.getMinutes();

  return `${hour < 10 ? `0${hour}` : hour}:${min < 10 ? `0${min}` : min}`
}

export const isEqualStringified = (foo: any, bar: any) => String(foo) === String(bar);

export const getGameSlug = (topicId: string) => ({
  pathname: ROUTER_GAME, query: { id: topicId }
});

export const getTimeZeroHour = () => (new Date().setHours(0, 0, 0, 0));

export const getRelativeTime = (time: number) => moment(time).fromNow();

