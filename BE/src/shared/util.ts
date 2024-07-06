export const SLEEP = (time = 2000) =>
  new Promise((res) => setTimeout(() => res(true), time));
