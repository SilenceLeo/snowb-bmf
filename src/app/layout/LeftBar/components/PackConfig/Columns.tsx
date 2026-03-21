import Input from '@mui/material/Input'
import React, { FunctionComponent } from 'react'
import GridInput from 'src/app/components/GridInput'
import { setColumns, useColumns, useOrderedGrid } from 'src/store/legend'

const Columns: FunctionComponent = () => {
  const columns = useColumns()
  const orderedGrid = useOrderedGrid()

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setColumns(Number(event.target.value))
  }

  return (
    <GridInput before='Columns:'>
      <Input
        value={columns}
        fullWidth
        type='number'
        slotProps={{ input: { min: 1 } }}
        onChange={handleInput}
        disabled={!orderedGrid}
      />
    </GridInput>
  )
}

export default Columns
