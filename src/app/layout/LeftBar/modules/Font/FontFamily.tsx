import React, { useState, FunctionComponent } from 'react'
import { observer } from 'mobx-react'

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import FontDownload from '@material-ui/icons/FontDownload'
import CircularProgress from '@material-ui/core/CircularProgress'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'

import { useFont } from 'src/store/hooks'
import readFile from 'src/utils/readFile'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    clear: {
      padding: theme.spacing(0.5),
      cursor: 'pointer',
      display: 'block',
    },
  }),
)

const FontFamily: FunctionComponent<unknown> = () => {
  const classes = useStyles()
  const [loading, setLoading] = useState(false)
  const { hasFont, setFont, clearFont } = useFont()

  const hanleUploadFile = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    if (
      !event ||
      !event.target ||
      !event.target.files ||
      !event.target.files[0]
    )
      return

    const file = event.target.files[0]
    const ext = file.name.match(/\.([A-Z0-9]+)$/i)
    if (!ext) return

    setLoading(true)

    readFile(file).then((arrBuf) => {
      if (!(arrBuf instanceof ArrayBuffer)) {
        setLoading(false)
        return
      }

      event.target.value = ''

      setFont(arrBuf)
        .then(() => setLoading(false))
        .catch((e) => {
          setLoading(false)
          window.alert(e.message)
        })
    })
  }

  return (
    <Grid container spacing={2} alignItems='center'>
      <Grid item xs={true}>
        <Button
          component='label'
          variant='contained'
          color='primary'
          fullWidth
          size='large'
          startIcon={
            loading ? (
              <CircularProgress size={22} color='inherit' />
            ) : (
              <FontDownload />
            )
          }
          disabled={loading}
        >
          Select Font File
          <input
            hidden
            type='file'
            onChange={hanleUploadFile}
            accept='.ttf,.otf,.woff'
          />
        </Button>
      </Grid>
      {hasFont ? (
        <Grid item xs='auto'>
          <HighlightOffIcon className={classes.clear} onClick={clearFont} />
        </Grid>
      ) : null}
    </Grid>
  )
}

export default observer(FontFamily)
