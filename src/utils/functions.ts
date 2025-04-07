export function maskCurrency(value: number) {

  const result = new Intl.NumberFormat("pt-br", {
    style: "currency",
    currency: "BRL"
  }).format(
    value,
  )

  return result
}
