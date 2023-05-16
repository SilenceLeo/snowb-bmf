import { ThemeOptions } from '@mui/material/styles'

const components: ThemeOptions['components'] = {
  MuiCssBaseline: {
    styleOverrides: {
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
        fontSize: '0.8125rem',
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
    styleOverrides: {
      input: {
        '&[type=number]': {
          textAlign: 'right',
        },
      },
    },

    defaultProps: {
      size: 'small',
      margin: 'dense',
    },
  },
  MuiSlider: {
    styleOverrides: {
      root: {
        verticalAlign: 'top',
        '&.Mui-disabled': {
          opacity: 0.2,
        },
      },
    },
    defaultProps: {
      size: 'small',
    },
  },

  MuiButton: {
    defaultProps: {
      size: 'small',
    },
  },
  MuiButtonBase: {
    defaultProps: {
      disableRipple: true,
    },
  },
  MuiFilledInput: {
    defaultProps: {
      margin: 'dense',
    },
  },
  MuiFormControl: {
    defaultProps: {
      margin: 'dense',
    },
  },
  MuiFormHelperText: {
    defaultProps: {
      margin: 'dense',
    },
  },
  MuiIconButton: {
    defaultProps: {
      size: 'small',
    },
  },
  MuiInputLabel: {
    defaultProps: {
      margin: 'dense',
    },
  },
  MuiListItem: {
    defaultProps: {
      dense: true,
    },
  },
  MuiOutlinedInput: {
    defaultProps: {
      margin: 'dense',
    },
  },
  MuiFab: {
    defaultProps: {
      size: 'small',
    },
  },
  MuiTable: {
    defaultProps: {
      size: 'small',
    },
  },
  MuiTextField: {
    defaultProps: {
      size: 'small',
      margin: 'dense',
    },
  },
  MuiToolbar: {
    defaultProps: {
      variant: 'dense',
    },
  },
}

export default components
