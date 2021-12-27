import { saveAs } from 'file-saver';
import { ServerResponse } from "http";
import { extension } from 'mime-types';
import moment from 'moment';
import { formatDuration } from "../sub_modules/common/utils/timeFormat";
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
  return moment(time).format("DD/MM/YYYY");
}

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

export const getRelativeTime = (time: number) => {
  const timeNow = moment();
  const diffTimeSeconds = Math.abs(moment(time).diff(timeNow, "seconds"));
  if (diffTimeSeconds < 60) return 'Vài giây trước'; // after 10 seconds
  else if (diffTimeSeconds < 3600) return `${Math.abs(moment(time).diff(timeNow, "minutes"))} phút trước`;
  else if (diffTimeSeconds < 86400) return `${Math.abs(moment(time).diff(timeNow, "hours"))} giờ trước`;
  else if (diffTimeSeconds < 604800) return `${Math.abs(moment(time).diff(timeNow, "days"))} ngày`;
  else if (diffTimeSeconds < 31556926) return `${Math.abs(moment(time).diff(timeNow, "weeks"))} tuần`;
  return moment(time).format("DD/MM/yyyy");
};

export const formatFullDateTime = (time: number) => moment(time).format('HH:mm:ss DD/MM/YYYY');

export const formatTimeHMS = (time: number) => moment(time).format('HH:mm:ss');

export const removeServerSideCookie = (res: ServerResponse) => {
  res.setHeader('Set-Cookie', 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT');
}
