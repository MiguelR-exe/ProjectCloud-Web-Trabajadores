const formatter = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

export function formatPrice(amount) {
  return formatter.format(Number(amount) || 0);
}
