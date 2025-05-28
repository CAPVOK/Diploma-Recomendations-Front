export function toDatetimeLocalString(date: Date) {
  const pad = (n: number, len = 2) => n.toString().padStart(len, "0");
  return `${pad(date.getFullYear(), 4)}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
