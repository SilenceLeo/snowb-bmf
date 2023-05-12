import React, { FunctionComponent } from 'react'
import { observer } from 'mobx-react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Input from '@material-ui/core/Input'
import Switch from '@material-ui/core/Switch'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import ButtonGroup from '@material-ui/core/ButtonGroup'

import { useStyle } from 'src/store/hooks'
import GridInput from 'src/app/components/GridInput'

import FormFill from 'src/app/layout/common/FormFill'

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

const Stroke: FunctionComponent<unknown> = () => {
  const classes = useStyles()
  const { stroke, useStroke, setUseStroke } = useStyle()
  const {
    setWidth,
    lineJoin,
    setLineJoin,
    lineCap,
    setLineCap,
    strokeType,
    setStrokeType,
  } = stroke

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
          Stroke
        </Typography>
        Off
        <Switch
          size='small'
          checked={useStroke}
          onChange={(e) => setUseStroke(e.target.checked)}
        />
        On
      </Box>
      <div className={useStroke ? '' : classes.disabled}>
        <Box paddingX={2} marginY={4}>
          <GridInput before='Width:' after='px'>
            <Input
              value={stroke?.width || 0}
              fullWidth
              type='number'
              inputProps={{ min: 0 }}
              onChange={(e) => setWidth(Number(e.target.value))}
            />
          </GridInput>
        </Box>

        <Box paddingX={2} marginY={4}>
          <GridInput before='Type:' component='div' childrenWidth={8}>
            <ButtonGroup size='small' color='primary'>
              <Button
                onClick={() => setStrokeType(0)}
                variant={strokeType === 0 ? 'contained' : 'outlined'}
              >
                Outer
              </Button>
              <Button
                onClick={() => setStrokeType(1)}
                variant={strokeType === 1 ? 'contained' : 'outlined'}
              >
                Middle
              </Button>
              <Button
                onClick={() => setStrokeType(2)}
                variant={strokeType === 2 ? 'contained' : 'outlined'}
              >
                Inner
              </Button>
            </ButtonGroup>
          </GridInput>
        </Box>

        <Box paddingX={2} marginY={4}>
          <GridInput before='Line Cap:' component='div' childrenWidth={8}>
            <ButtonGroup size='small' color='primary'>
              <Button
                onClick={() => setLineCap('butt')}
                variant={lineCap === 'butt' ? 'contained' : 'outlined'}
              >
                Butt
              </Button>
              <Button
                onClick={() => setLineCap('round')}
                variant={lineCap === 'round' ? 'contained' : 'outlined'}
              >
                Round
              </Button>
              <Button
                onClick={() => setLineCap('square')}
                variant={lineCap === 'square' ? 'contained' : 'outlined'}
              >
                Square
              </Button>
            </ButtonGroup>
          </GridInput>
        </Box>

        <Box paddingX={2} marginY={4}>
          <GridInput before='Line Join:' component='div' childrenWidth={8}>
            <ButtonGroup size='small' color='primary'>
              <Button
                onClick={() => setLineJoin('miter')}
                variant={lineJoin === 'miter' ? 'contained' : 'outlined'}
              >
                Miter
              </Button>
              <Button
                onClick={() => setLineJoin('round')}
                variant={lineJoin === 'round' ? 'contained' : 'outlined'}
              >
                Round
              </Button>
              <Button
                onClick={() => setLineJoin('bevel')}
                variant={lineJoin === 'bevel' ? 'contained' : 'outlined'}
              >
                Bevel
              </Button>
            </ButtonGroup>
          </GridInput>
        </Box>
        <FormFill config={stroke} />
      </div>
    </>
  )
}

export default observer(Stroke)
