import Checkbox from '@mui/material/Checkbox'
import { FunctionComponent } from 'react'
import GridInput from 'src/app/components/GridInput'
import { setOrderedGrid, useOrderedGrid } from 'src/store/legend'

const OrderedGrid: FunctionComponent = () => {
  const orderedGrid = useOrderedGrid()

  return (
    <GridInput before='Ordered Grid:'>
      <Checkbox
        checked={orderedGrid}
        size='small'
        color='default'
        onChange={(e) => setOrderedGrid(e.target.checked)}
      />
    </GridInput>
  )
}

export default OrderedGrid
