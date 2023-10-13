import { message } from 'antd'
import type { RcFile, UploadFile } from 'antd/es/upload/interface'

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result as string))
  reader.readAsDataURL(img)
}

const onPreview = async (file: UploadFile) => {
  let src = file.url as string
  if (!src) {
    src = await new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(file.originFileObj as RcFile)
      reader.onload = () => resolve(reader.result as string)
    })
  }
  const image = new Image()
  image.src = src
  const imgWindow = window.open(src)
  imgWindow?.document.write(image.outerHTML)
}

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('Você só pode fazer upload de arquivos JPG/PNG!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('O limite máximo de tamanho da imagem é 2MB!')
  }
  return isJpgOrPng && isLt2M
}

export { getBase64, onPreview, beforeUpload }
