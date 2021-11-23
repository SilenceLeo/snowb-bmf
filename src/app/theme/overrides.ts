import { Overrides } from '@material-ui/core/styles/overrides'

const overrides: Overrides = {
  MuiCssBaseline: {
    '@global': {
      'html,body,#root': {
        width: '100%',
        height: '100%',
      },
      html: {
        fontSize: '14px',
      },
      body: {
        margin: 0,
        // fontFamily: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        userSelect: 'none',
      },
      '#root': {
        minWidth: 900,
      },
      'input::-webkit-inner-spin-button': {
        marginLeft: '10px',
      },
      'input:enabled:read-write:-webkit-any(:focus,:hover)::-webkit-inner-spin-button':
        {
          opacity: 0.3,
        },
      '::-webkit-scrollbar': {
        width: '4px',
        height: '4px',
      },
      '::-webkit-scrollbar-thumb': {
        background: 'rgba(255, 255, 255, 0.2)',
      },
      '::-webkit-scrollbar-track': {
        background: 'rgba(0, 0, 0, 0.1)',
      },
    },
  },
  MuiInputBase: {
    input: {
      '&[type=number]': {
        textAlign: 'right',
      },
    },
  },
  MuiSlider: {
    root: {
      verticalAlign: 'top',
      '&.Mui-disabled': {
        opacity: 0.2,
      },
    },
  },
}

export default overrides
