import React, { FunctionComponent } from 'react'
import { observer } from 'mobx-react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import Switch from '@material-ui/core/Switch'
import GridInput from '../../../../components/GridInput'
import Input from '@material-ui/core/Input'
import FormFill from '../../../common/FormFill'
import { useStyle } from '../../../../../store/hooks'
import { invertColor } from '../../../../../utils/supports/color'
import { createStyles, makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() =>
  createStyles({
    disabled: {
      opacity: 0.3,
      pointerEvents: 'none',
    },
    title: {
      flex: 1,
    },
  }),
)

const BgFill: FunctionComponent<unknown> = () => {
  const classes = useStyles()
  const { useBgFill, bgFill, setUseBgFill, fill } = useStyle()
  const {
    lPadding,
    rPadding,
    vPadding,
    setLPadding,
    setRPadding,
    setVPadding,
    setColor,
  } = bgFill

  return (
    <>
      <Box
        component='label'
        display='flex'
        alignItems='center'
        paddingX={2}
        marginY={4}
      >
        <Typography component='div' className={classes.title}>
          Background Color
        </Typography>
        Off
        <Switch
          size='small'
          checked={useBgFill}
          onChange={(e) => {
            if (e.target.checked) setColor(invertColor(fill.color))
            setUseBgFill(e.target.checked)
          }}
        />
        On
      </Box>

      <div className={useBgFill ? '' : classes.disabled}>
        <Box paddingX={2} marginY={4}>
          <GridInput before='L-Padding:' after='px'>
            <Input
              value={lPadding || 0}
              fullWidth
              type='number'
              inputProps={{ min: 0 }}
              onChange={(e) => setLPadding(Number(e.target.value))}
            />
          </GridInput>
        </Box>

        <Box paddingX={2} marginY={4}>
          <GridInput before='R-Padding:' after='px'>
            <Input
              value={rPadding || 0}
              fullWidth
              type='number'
              inputProps={{ min: 0 }}
              onChange={(e) => setRPadding(Number(e.target.value))}
            />
          </GridInput>
        </Box>

        <Box paddingX={2} marginY={4}>
          <GridInput before='V-Padding:' after='px'>
            <Input
              value={vPadding || 0}
              fullWidth
              type='number'
              inputProps={{ min: 0 }}
              onChange={(e) => setVPadding(Number(e.target.value))}
            />
          </GridInput>
        </Box>

        <FormFill config={bgFill} />
      </div>
    </>
  )
}

export default observer(BgFill)
