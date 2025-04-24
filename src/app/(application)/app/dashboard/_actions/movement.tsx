import dayjs from 'dayjs'

import { api } from '@/lib/api'
import { getMonthsBetweenDates, organizeDays } from '@/utils/functions'
import { Movement, MovementList } from '@/_types/movement'

interface Props {
  monthsOld: number
  isShortDate?: boolean
}

export async function getMovements({
  monthsOld,
  isShortDate = false,
}: Props): Promise<MovementList> {
  let startDate = ''

  if (monthsOld === 0) {
    startDate = dayjs().subtract(30, 'day').utc().startOf('day').toISOString()
  } else {
    startDate = dayjs().subtract(monthsOld, 'month').utc().startOf('month').toISOString()
  }

  const endDate = dayjs().utc().endOf('day').toDate().toISOString()

  const monthInterval = getMonthsBetweenDates({startDate, endDate, isShortDate})
  let payments = {} as MovementList

  const pmResponse = await api.get(
    // `/payment-method/list/?start_date=${startDate}&end_date=${endDate}`
    `/transacoes`
  )

  // For each month, fetch values for CREDIT and DEBIT
  for (let i = 0; i < monthInterval.length; i++) {
    // Initialize month with 0 values
    payments = {
      ...payments,
      [monthInterval[i]]: {
        CREDIT: 0,
        DEBIT: 0
      }
    }

    // Map API response and fetch 'payments' data
    pmResponse.data.paymentMethods && pmResponse.data.paymentMethods.map((payment: Movement) => {
      let paymentDate = ''
      if (monthInterval.length < 13) {
        paymentDate = dayjs(payment.data).format(isShortDate ? 'MMM/YY' : 'MMM/YYYY')
      } else {
        paymentDate = dayjs(payment.data).format('YYYY-MM-DD')
      }

      // If match current month, than add payment amount to the respective operation
      if (paymentDate === monthInterval[i]) {
        payments = {
          ...payments,
          [monthInterval[i]]: {
            ...payments[monthInterval[i]],
            [payment.tipo_id === 1 ? 'CREDIT' : 'DEBIT']: (payments[monthInterval[i]]?.[payment.tipo_id === 1 ? 'CREDIT' : 'DEBIT'] || 0) + (payment.valor / 100)
          }
        }
      }
    })
  }

  // If days, organize payments in three-day ranges
  if (monthInterval.length > 13) {
    // Organize payments in three-day ranges
    const threeDayRanges: MovementList = organizeDays(pmResponse, isShortDate)

    payments = threeDayRanges
  }

  return payments
}
