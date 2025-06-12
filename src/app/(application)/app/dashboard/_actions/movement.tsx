import dayjs from 'dayjs'

import { api } from '@/lib/api'
import { getMonthsBetweenDates, organizeDays } from '@/utils/functions'
import { Movement, MovementList } from '@/_types/movement'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.locale('pt-br')

interface Props {
  monthsOld: number
  isShortDate?: boolean
}

export async function getMovements({
  monthsOld,
  isShortDate = false,
}: Props): Promise<MovementList> {
  let startDate = ''

  const today = dayjs()
  if (monthsOld === 0) {
    startDate = today.subtract(30, 'day').utc().startOf('day').toISOString()
  } else {
    startDate = today.subtract(monthsOld, 'month').utc().startOf('month').toISOString()
  }

  const endDate = today.utc().endOf('day').toDate().toISOString()

  const monthInterval = getMonthsBetweenDates({startDate, endDate, isShortDate})
  console.log('monthInterval is: ', monthInterval)
  let payments = {} as MovementList

  const pmResponse = await api.get(
    // `/payment-method/list/?start_date=${startDate}&end_date=${endDate}`
    `/transacoes?inicio=${startDate}&fim=${endDate}`
  )

  // For each month, fetch values for CREDIT and DEBIT
  for (let i = 0; i < monthInterval.length; i++) {
    console.log('first of all, interval is: ', monthInterval[i])

    // Initialize month with 0 values
    payments = {
      ...payments,
      [monthInterval[i]]: {
        CREDIT: 0,
        DEBIT: 0
      }
    }

    // Map API response and fetch 'payments' data
    pmResponse.data.Transacoes && pmResponse.data.Transacoes.map((payment: Movement) => {
      // console.log('current payment is: ', payment)
      let paymentDate = ''
      if (monthInterval.length < 13) {
        console.log('interval is less than 13')
        paymentDate = dayjs(payment.data).format(isShortDate ? 'MMM/YY' : 'MMM/YYYY')
      } else {
        console.log('interval is greater than 13')
        paymentDate = dayjs(payment.data).format('YYYY-MM-DD')
      }

      // If match current month, than add payment amount to the respective operation
      if (paymentDate === monthInterval[i]) {
        console.log('inside interval')
        // console.log('paymentDate is: ', paymentDate)
        // console.log('monthInterval[i] is: ', monthInterval[i])

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

  console.log('init payments are: ', payments)

  // If days, organize payments in three-day ranges
  if (monthInterval.length > 13) {
    // Organize payments in three-day ranges
    const threeDayRanges: MovementList = organizeDays(pmResponse, isShortDate)

    payments = threeDayRanges
  }

  console.log('payments are: ', payments)

  return payments
}
