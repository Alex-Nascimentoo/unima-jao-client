'use client'

import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js/auto';
import { SelectMonthsOld } from './SelectMonthsOld';
import { MovementList } from '@/_types/movement';
import { getMovements } from '../_actions/movement';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function IncomeOutcomeGraph() {
  const [creditPayments, setCreditPayments] = useState<number[]>([])
  const [debitPayments, setDebitPayments] = useState<number[]>([])
  const [monthsOld, setMonthsOld] = useState<number>(0)
  const [payments, setPayments] = useState<MovementList>({})

  useEffect(() => {
    async function fetchPayments() {
      // Fetch payments
      const newPaymentList = await getMovements({
        monthsOld,
      })

      setPayments(newPaymentList)
    }

    fetchPayments()
  }, [monthsOld])

  useEffect(() => {
    setCreditPayments([])
    setDebitPayments([])

    Object.keys(payments).map((key) => {
      setCreditPayments((prev) => [
        ...prev,
        payments[key].CREDIT
      ])
      setDebitPayments((prev) => [
        ...prev,
        payments[key].DEBIT
      ])
    })
  }, [payments])

  useEffect(() => {
    setMonthsOld(0)
  }, [])

  const sampleData = {
    labels: Object.keys(payments),
    datasets: [
      {
        data: creditPayments,
        backgroundColor: '#31AA62',
        borderColor: '',
        borderWidth: 0
      },
      {
        data: debitPayments,
        backgroundColor: '#E7254F',
        borderColor: '',
        borderWidth: 0
      },
    ],
  }

  const options = {
    canvas: {
      height: 600,
    },
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          min: 0,
          count: 5,
          callback: function (value: string | number, index: number, ticks: {}) {
            const oldValue = parseInt(value.toString())

            if (oldValue < 1000) {
              return (parseInt(value.toString()));
            } else if (oldValue >= 1000 && oldValue < 1000000) {
              return (parseInt(value.toString()) / 1000).toFixed(1) + 'k';
            } else if (oldValue >= 1000000 && oldValue < 1000000000) {
              return ((parseInt(value.toString()) / 1000000)).toFixed(1) + 'M';
            } else {
              return ((parseInt(value.toString()) / 1000000000)).toFixed(1) + 'B';
            }
          },
          font: {
            size: 13,
          }
        },
        border: {
          display: false,
          dash: [7, 10],
          dashOffset: 1
        },
        grid: {
          color: '#C3C6D4',
          tickBorderDash: [0, 10]
        }
      },
      x: {
        display: true,
        grid: {
          display: false,
          tickWidth: 1000,
        },
        ticks: {
          backdropColor: '#F0F2FA',
          showLabelBackdrop: true,
          backdropPadding: {
            top: 5,
            bottom: 5,
            left: 10,
            right: 10,
          },
          backdropBorderRadius: 10,
        },
      }
    },
    plugins: {
      legend: {
        display: false
      },
    },
    elements: {
      bar: {
        borderRadius: 5
      }
    }
  }

  return (
    <div
      className='
      max-w-[97%] mx-auto
      '
    >
      <div
        className="
        mb-4
        flex justify-between items-center
        "
      >
        <div>
          <h2
            className='
            text-xl font-medium
            '
          >Receitas vs Despesas</h2>
          <p
            className='
            text-odin-neutral-8
            '
          >R$</p>
        </div>

        <SelectMonthsOld
          monthsOld={monthsOld.toString()}
          setMonthsOld={(value) => setMonthsOld(Number(value))}
        />
      </div>
      <Bar
        options={options}
        data={sampleData}
        className="max-h-[25rem]"
      />
    </div>
  )
}
