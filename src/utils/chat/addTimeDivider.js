import { isArray } from "lodash-es";
const duration = 5 * 60;

const isInFiveTime = (curTime, baseTime) => {
  return Math.abs(curTime - baseTime) <= duration;
};

export const getBaseTime = (list) => {
  return list?.length > 0 ? list.find((t) => t.isTimeDivider).time : 0;
};

export const addTimeDivider = (list, baseTime = 0) => {
  if (!isArray(list)) return;
  return list.reduce((acc, cur) => {
    const curTime = cur.clientTime;
    if (isInFiveTime(curTime, baseTime)) {
      return [...acc, cur];
    } else {
      baseTime = curTime;
      return [...acc, { isTimeDivider: true, time: curTime }, cur];
    }
  }, []);
};
