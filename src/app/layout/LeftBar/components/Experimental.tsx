import Box from '@mui/material/Box'
import Input from '@mui/material/Input'
import Typography from '@mui/material/Typography'
import { observer } from 'mobx-react-lite'
import { FunctionComponent } from 'react'
import ConfigSection from 'src/app/components/ConfigSection'
import GridInput from 'src/app/components/GridInput'
import { useProject } from 'src/store/hooks'

const Experimental: FunctionComponent<unknown> = () => {
  const { ui } = useProject()
  const { xFractional, setXFractional } = ui

  return (
    <ConfigSection title='Experimental'>
      <Box sx={{ px: 2, my: 4 }}>
        <GridInput before='xFractional:' after='bits'>
          <Input
            value={xFractional}
            fullWidth
            type='number'
            slotProps={{ input: { min: 0, max: 7, step: 1 } }}
            onChange={(e) => setXFractional(Number(e.target.value))}
          />
        </GridInput>
      </Box>
      <Box sx={{ px: 2, mb: 4 }}>
        <Typography variant='body2' color='text.secondary'>
          Fixed-point format for fractional advance and kerning fields in BMFont
          export.
        </Typography>
      </Box>
    </ConfigSection>
  )
}

export default observer(Experimental)
