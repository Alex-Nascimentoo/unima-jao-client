import dayjs from 'dayjs'

export function formatDate(
  value: string,
  isFormatted: boolean = false
) {
  if (!value) return null

  const formattedValue = dayjs(value).format('DD/MM/YYYY')

  if (dayjs(value).isValid()) {
    if (isFormatted) return formattedValue

    return dayjs(formattedValue, 'DD/MM/YYYY').toISOString()
  }

  return null
}

export function maskCurrency(value: number) {

  const result = new Intl.NumberFormat("pt-br", {
    style: "currency",
    currency: "BRL"
  }).format(
    value,
  )

  return result
}
