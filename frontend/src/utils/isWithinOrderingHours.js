export function isWithinOrderingHours() {
  const now = new Date();

  const isMonday = now.getDay() === 1;
  if (isMonday) return false;

  const startHours = 18;
  const startMinutes = 0;
  const endHours = 23;
  const endMinutes = 0;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;

  return (
    currentMinutes >= startTotalMinutes && currentMinutes <= endTotalMinutes
  );
}
