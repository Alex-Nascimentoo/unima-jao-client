import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import IsBetween from 'dayjs/plugin/isBetween'
import 'dayjs/locale/pt-br'
import { ActionList, Movement, MovementList } from '@/_types/movement'

dayjs.extend(utc)
dayjs.extend(IsBetween)
dayjs.locale('pt-br')

interface GetMonthsIntervalProps {
  startDate: string,
  endDate: string,
  isShortDate?: boolean,
}

export function getMonthsBetweenDates({
  startDate,
  endDate,
  isShortDate = false,
}: GetMonthsIntervalProps): string[] {
  // console.log('inside getMonthsBetweenDates funciton')
  const start = dayjs(startDate.split('T')[0]).startOf('month')
  const end = dayjs(endDate).endOf('day')
  const dates = []

  // console.log('start date is: ', start)
  // console.log('end date is: ', end)

  let current = start

  while (current.isBefore(end, 'month') || current.isSame(end, 'month')) {
    dates.push(current.format(isShortDate ? 'MMM/YY' : 'MMM/YYYY'))

    current = current.add(1, 'month')
  }

  if (dates.length <= 2) {
    dates.length = 0
    current = dayjs(startDate.split('T')[0]).startOf('day')

    while (current.isBefore(end, 'day') || current.isSame(end, 'day')) {
      console.log('current is: ', current)
      dates.push(current.format('YYYY-MM-DD'))
      current = current.add(1, 'day')
    }
  }

  // console.log('dates are: ', dates)
  return dates
}

/**
 * Organize payments from the last 30 days in three-day ranges of payments
 *
 * @param pmResponse response from API route '/payment-method/list/:organizationId'
 * @returns threeDayRanges of type MovementList
 */
export function organizeDays(
  pmResponse: any,
  isShortDate: boolean = false,
): MovementList {
  // Organize payments in three-day ranges
  const threeDayRanges: MovementList = {}

  const daysToReduce = isShortDate ? 5 : 3

  // For each range of day, fetch values for CREDIT and DEBIT
  for (let day = 30; day >= 0; day -= daysToReduce) {
    // Define range start and end (3 days)
    const rangeStart = dayjs().subtract(day, 'day').startOf('day')
    let rangeEnd = rangeStart.add(daysToReduce - 1, 'day').endOf('day')
    // console.log('range start: ', rangeStart)
    // console.log('range end: ', rangeEnd)
    // console.log('============================')

    // If range end is greater than today, set it to today
    if (rangeEnd.isAfter(dayjs())) {
      rangeEnd = dayjs().endOf('day')
    }

    // If start and end of range are the same, only display one value
    let rangeKey = ''
    if (isShortDate) {
      rangeKey = rangeStart.isSame(rangeEnd, 'day')
        ? `${rangeStart.format('DD/MM')}`
        : `${rangeStart.format('DD/MM')} - ${rangeEnd.format('DD/MM')}`
    } else {
      rangeKey = rangeStart.isSame(rangeEnd, 'day')
        ? `${rangeStart.format('DD/MMM')}`
        : `${rangeStart.format('DD/MMM')} - ${rangeEnd.format('DD/MMM')}`
    }

    // Initialize range with 0 values
    threeDayRanges[rangeKey] = { CREDIT: 0, DEBIT: 0 }

    // Map API response and fetch 'payments' data
    pmResponse.data.Transacoes?.forEach((payment: Movement) => {
      const paymentDate = dayjs(payment.data)

      // If payment date is between range, than add payment amount to the respective operation
      // console.log('range start: ', rangeStart)
      // console.log('paymentDate, ', paymentDate)
      // console.log('rangeEnd: ', rangeEnd)
      // console.log('payment date is BETWEEN? ', paymentDate.isBetween(rangeStart, rangeEnd, null, '[]'))
      if (paymentDate.isBetween(rangeStart, rangeEnd, null, '[]')) {
        threeDayRanges[rangeKey][payment.tipo_id === 1 ? 'CREDIT' : 'DEBIT'] += payment.valor / 100
        return
      }
    })
  }

  return threeDayRanges
}

export function organizeDaysMovement(
  response: any,
  isShortDate: boolean = false,
): ActionList {
  // Organize payments in three-day ranges
  const threeDayRanges: ActionList = {}

  const daysToReduce = isShortDate ? 5 : 3

  // For each range of day, fetch values
  for (let day = 0; day <= 30; day += daysToReduce) {
    // Define range start and end (3 days)
    const rangeStart = dayjs().add(day, 'day').startOf('day')
    let rangeEnd = rangeStart.add(daysToReduce - 1, 'day').endOf('day')

    // If start and end of range are the same, only display one value
    let rangeKey = ''
    if (isShortDate) {
      rangeKey = rangeStart.isSame(rangeEnd, 'day')
        ? `${rangeStart.format('DD/MM')}`
        : `${rangeStart.format('DD/MM')} - ${rangeEnd.format('DD/MM')}`
    } else {
      rangeKey = rangeStart.isSame(rangeEnd, 'day')
        ? `${rangeStart.format('DD/MMM')}`
        : `${rangeStart.format('DD/MMM')} - ${rangeEnd.format('DD/MMM')}`
    }

    // Initialize range with 0 values
    threeDayRanges[rangeKey] = 0

    // Map API response and fetch 'payments' data
    response.data.movements?.forEach((movement: Movement) => {
      const paymentDate = dayjs(movement.data)

      // If payment date is between range, than add payment amount to the result
      if (paymentDate.isBetween(rangeStart, rangeEnd, null, '[]')) {
        threeDayRanges[rangeKey] += movement.valor / 100
        return
      }
    })
  }

  return threeDayRanges
}
