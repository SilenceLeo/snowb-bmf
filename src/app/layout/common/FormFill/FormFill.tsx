import React, { FunctionComponent } from 'react'
import { observer } from 'mobx-react'
import Box from '@mui/material/Box'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'

import { FontStyleConfig, FillType } from 'src/store'

import FormColor from '../FormColor'
import FormGradient from '../FormGradient'
import FormImage from '../FormImage'

interface FormFillProps {
  config: FontStyleConfig
}

const FormFill: FunctionComponent<FormFillProps> = (props: FormFillProps) => {
  const {
    config: { type, color, gradient, patternTexture, setType, setColor },
  } = props

  return (
    <>
      <Box paddingX={2} marginY={4}>
        <RadioGroup
          row
          name='type'
          value={type}
          onChange={(e) => setType(Number(e.target.value))}
        >
          <FormControlLabel
            value={FillType.SOLID}
            control={<Radio size='small' color='default' />}
            label='Solid'
          />
          <FormControlLabel
            value={FillType.GRADIENT}
            control={<Radio size='small' color='default' />}
            label='Gradient'
          />
          <FormControlLabel
            value={FillType.IMAGE}
            control={<Radio size='small' color='default' />}
            label='Image'
          />
        </RadioGroup>
      </Box>
      {type === 0 ? (
        <Box paddingX={2} marginY={4}>
          <FormColor color={color} onChange={setColor} />
        </Box>
      ) : null}
      {type === 1 ? <FormGradient gradient={gradient} /> : null}
      {type === 2 ? (
        <FormImage
          patternTexture={patternTexture}
          src={patternTexture.src}
          scale={patternTexture.scale}
          // onChangeImage={patternTexture.setImage}
          // onChangeScale={patternTexture.setScale}
        />
      ) : null}
    </>
  )
}

export default observer(FormFill)
