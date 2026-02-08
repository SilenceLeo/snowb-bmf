import Input from '@mui/material/Input'
import React, { FunctionComponent } from 'react'
import GridInput from 'src/app/components/GridInput'
import { setPage, usePageCount } from 'src/store/legend'

const Page: FunctionComponent = () => {
  const page = usePageCount()

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

export default Page
