import React, { FunctionComponent } from 'react'
import { observer } from 'mobx-react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Input from '@material-ui/core/Input'
import Switch from '@material-ui/core/Switch'

import { useStyle } from 'src/store/hooks'
import GridInput from 'src/app/components/GridInput'
import FormColor from '../../../common/FormColor'

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

const Shadow: FunctionComponent<unknown> = () => {
  const { shadow, useShadow, setUseShadow } = useStyle()
  const { setOffsetX, setOffsetY, setBlur, setColor } = shadow
  const classes = useStyles()

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
          Shadow
        </Typography>
        Off
        <Switch
          size='small'
          checked={useShadow}
          onChange={(e) => setUseShadow(e.target.checked)}
        />
        On
      </Box>
      <div className={useShadow ? '' : classes.disabled}>
        <Box paddingX={2} marginY={4}>
          <GridInput before='Offset X:' after='px'>
            <Input
              value={shadow?.offsetX || 0}
              fullWidth
              type='number'
              disabled={!useShadow}
              onChange={(e) => setOffsetX(Number(e.target.value))}
            />
          </GridInput>
        </Box>
        <Box paddingX={2} marginY={4}>
          <GridInput before='Offset Y:' after='px'>
            <Input
              value={shadow?.offsetY || 0}
              fullWidth
              type='number'
              disabled={!useShadow}
              onChange={(e) => setOffsetY(Number(e.target.value))}
            />
          </GridInput>
        </Box>
        <Box paddingX={2} marginY={4}>
          <GridInput before='Blur:' after='px'>
            <Input
              value={shadow?.blur || 0}
              fullWidth
              type='number'
              disabled={!useShadow}
              inputProps={{ style: { textAlign: 'right' }, min: 0 }}
              onChange={(e) => setBlur(Number(e.target.value))}
            />
          </GridInput>
        </Box>
        <Box paddingX={2} marginY={4}>
          <FormColor color={shadow?.color || ''} onChange={setColor} />
        </Box>
      </div>
    </>
  )
}
export default observer(Shadow)
