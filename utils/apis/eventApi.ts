import { GET_API } from '../../sub_modules/common/api';

export const getEventByTime = async (startTime: number, endTime: number) => {
    let res = await GET_API(`get-events?startTime=${startTime}&endTime=${endTime}`);
    let data: any = null;
    if (res.status === 200) {
        data = res.data
    }
    return data;
}

export const getCurrentDateTests = async (courseId: string) => {
    let res = await GET_API(`get-current-date-tests?courseId=${courseId}`);
    let data: any = null;
    if (res.status === 200) {
        data = res.data
    }
    return data;
}