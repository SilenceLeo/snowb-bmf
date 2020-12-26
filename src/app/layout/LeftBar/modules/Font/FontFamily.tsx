import React, { useState, FunctionComponent } from 'react'
import { observer } from 'mobx-react'

import Button from '@material-ui/core/Button'
import FontDownload from '@material-ui/icons/FontDownload'
import CircularProgress from '@material-ui/core/CircularProgress'

import { useFont } from 'src/store/hooks'
import readFile from 'src/utils/readFile'

const FontFamily: FunctionComponent<unknown> = () => {
  const [loading, setLoading] = useState(false)
  const { setFont } = useFont()

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

      setFont(arrBuf)
        .then(() => setLoading(false))
        .catch((e) => {
          setLoading(false)
          window.alert(e.message)
        })
    })
  }

  return (
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
  )
}

export default observer(FontFamily)
