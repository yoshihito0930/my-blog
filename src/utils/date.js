import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(timezone);
dayjs.extend(utc);

export const formatDate = (date) => {
  return dayjs(date).tz("Asia/Tokyo").format("YYYY-MM-DD");
};