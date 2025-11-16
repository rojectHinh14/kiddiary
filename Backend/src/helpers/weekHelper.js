export const startOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay(); // Sunday = 0
  const diff = d.getDate() - day + 1; // Monday = start
  return new Date(d.setDate(diff));
};

export const endOfWeek = (date) => {
  const start = startOfWeek(date);
  return new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
};
