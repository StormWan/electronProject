import { typeOf } from "@/utils";
const duration = 5 * 60;

const isInFiveTime = (curTime, baseTime) => {
  return Math.abs(curTime - baseTime) <= duration;
};

export const addTimeDivider = (list, baseTime = 0) => {
  if (typeOf(list) !== "array") return;
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
