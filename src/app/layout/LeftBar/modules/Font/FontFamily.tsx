import React, { useState, FunctionComponent } from 'react'
import { observer } from 'mobx-react'

import Button from '@material-ui/core/Button'
import FontDownload from '@material-ui/icons/FontDownload'
import CircularProgress from '@material-ui/core/CircularProgress'

import { useFont } from 'src/store/hooks'
import readFile from 'src/utils/readFile'

// eslint-disable-next-line import/no-webpack-loader-syntax
// import ToTtfBufferWorder from 'worker-loader?name=static/js/ToTtfBuffer.[hash].worker.js!src/workers/ToTtfBuffer.worker'

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
          // eslint-disable-next-line no-alert
          window.alert(e.message)
        })

      // const worker = new ToTtfBufferWorder()
      // const postData = { buffer: arrBuf, type: ext[1] }
      // worker.addEventListener('message', (messageEvent) => {
      //   const { data } = messageEvent
      //   const { buffer, name } = data
      //   const url = URL.createObjectURL(new Blob([buffer]))

      //   updateFontFace(name.fullName, url)
      //   setTimeout(() => {
      //     if (setFont) setFont(name.fullName, buffer)
      //     setLoading(false)
      //   }, 200)
      //   worker.terminate()
      // })

      // worker.postMessage(postData, [arrBuf])
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
