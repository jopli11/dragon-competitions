export function getEffectivePrice(raffle: {
  ticketPricePence: number;
  discountActive?: boolean;
  discountPercent?: number;
}) {
  const discountPercent = raffle.discountActive
    ? Math.max(0, Math.min(100, raffle.discountPercent ?? 0))
    : 0;
  const isFree = discountPercent === 100;
  const discountedPence = Math.round(
    raffle.ticketPricePence * ((100 - discountPercent) / 100),
  );
  const effectivePence = isFree ? 0 : Math.max(1, discountedPence);

  return {
    discountPercent,
    effectivePence,
    isDiscounted: discountPercent > 0,
    isFree,
  };
}
