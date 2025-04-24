'use client'

import { CaretDown } from '@phosphor-icons/react'
import * as Select from '@radix-ui/react-select'

const valueList = [
  {
    text: 'Último mês',
    value: '0',
  },
  {
    text: 'Últimos 3 meses',
    value: '2',
  },
  {
    text: 'Últimos 6 meses',
    value: '5',
  },
  {
    text: 'Últimos 12 meses',
    value: '11',
  },
]

type SelectMonthsOldProps = {
  monthsOld: string
  setMonthsOld: (value: string) => void
  isForecast?: boolean
}

export function SelectMonthsOld({
  monthsOld,
  setMonthsOld,
  isForecast,
}: SelectMonthsOldProps) {

  return (
    <label className="flex flex-col gap-3">
      <Select.Root value={monthsOld} onValueChange={setMonthsOld}>
        <Select.Trigger className="flex h-10 w-full min-w-[200px] items-center px-4 justify-between rounded-lg bg-odin-neutral-12 border border-odin-neutral-11 text-lg data-[placeholder]:text-odin-neutral-8">
          <Select.Value placeholder="Selecione um item na lista" />
          <Select.Icon>
            <CaretDown size={24} className="text-odin-neutral-3" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            position="popper"
            sideOffset={4}
            className="z-20 min-w-[200px]"
          >
            <Select.Viewport className="flex max-h-80 flex-col gap-[10px] overflow-y-auto rounded-lg bg-odin-neutral-12 border border-odin-neutral-11 p-3 shadow-box">
              {valueList &&
                valueList.map((value) => (
                  <Select.Item
                    value={value.value}
                    key={value.value}
                    className="cursor-pointer data-[operation=false]:hidden"
                  >
                    <Select.ItemText className="text-lg leading-6 capsize">
                      { isForecast ?
                      value.text
                       .replace('Últimos', 'Próximos')
                       .replace('Último', 'Próximo')
                      : value.text }
                    </Select.ItemText>
                  </Select.Item>
                ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </label>
  )
}
