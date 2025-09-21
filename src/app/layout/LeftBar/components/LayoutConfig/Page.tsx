import Input from '@mui/material/Input'
import { observer } from 'mobx-react-lite'
import React, { FunctionComponent } from 'react'
import GridInput from 'src/app/components/GridInput'
import { useLayout } from 'src/store/hooks'

const Page: FunctionComponent<unknown> = () => {
  const { page, setPage } = useLayout()

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setPage(Number(event.target.value))
  }

  return (
    <GridInput before='Pages:' after=''>
      <Input
        value={page}
        fullWidth
        type='number'
        slotProps={{ input: { min: 1 } }}
        onChange={handleInput}
      />
    </GridInput>
  )
}

export default observer(Page)
