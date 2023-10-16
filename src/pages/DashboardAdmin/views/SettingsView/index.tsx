import { useEffect, useMemo, useState } from 'react'

import * as S from './styles'
import * as G from '@/utils/styles/globals'
import {} from 'react-icons/io5'
import { PlusOutlined } from '@ant-design/icons'

import { Button, ColorPicker, Switch, Upload, theme } from 'antd'
import ImgCrop from 'antd-img-crop'

import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'
import type { UploadChangeParam } from 'antd/es/upload'

import { beforeUpload, onPreview } from '@/utils/functions/imageUpload'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import {
  handleUpdateApplicationColor,
  handleUpdateApplicationMaintanceStatus,
  handleUpdateApplicationPics
} from '@/firebase/admin'

import firebase from '@/firebase/firebase'

const SettingsView = () => {
  const { token } = theme.useToken()

  const { applicationData } = useAdminAuth()

  const [updatingCompany, setUpdatingCompany] = useState(false)

  const [applicationColor, setApplicationColor] = useState<string>('#FFFFFF')

  const [tempCompanyImage, setTempCompanyImage] = useState<string>('')
  const [companyImageUploaded, setTempCompanyImageUploaded] = useState<RcFile>()

  const [tempCompanyFlaticon, setTempCompanyFlaticon] = useState<string>('')
  const [companyBannerUploaded, setTempCompanyFlaticonUploaded] =
    useState<RcFile>()

  const handleChangeCompanyImage: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status !== 'uploading' && !!info.file.originFileObj) {
      const file = info.file.originFileObj as RcFile

      const reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onload = () => {
        const dataURL = reader.result
        setTempCompanyImage(dataURL as string)
        setTempCompanyImageUploaded(file)
      }
    }
  }

  const handleChangeCompanyFlaticon: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status !== 'uploading' && !!info.file.originFileObj) {
      const file = info.file.originFileObj as RcFile

      const reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onload = () => {
        const dataURL = reader.result
        setTempCompanyFlaticon(dataURL as string)
        setTempCompanyFlaticonUploaded(file)
      }
    }
  }

  const handleUpdate = async () => {
    try {
      setUpdatingCompany(true)

      const companyInfo = applicationData.appPics

      let logoUrl = ''
      let bannerUrl = ''

      if (companyImageUploaded) {
        const uniqueFileName = `${Date.now()}_${companyImageUploaded.name}`

        const storageRef = firebase
          .storage()
          .ref(`/companyInfos/${uniqueFileName}`)
        await storageRef.put(companyImageUploaded)

        logoUrl = await storageRef.getDownloadURL()

        if (companyInfo && companyInfo?.companyLogo) {
          const storageRef = firebase
            .storage()
            .refFromURL(companyInfo?.companyLogo)
          storageRef.delete().catch((error) => {
            console.error('Erro ao excluir imagem anterior:', error)
          })
        }
      }

      if (companyBannerUploaded) {
        const uniqueFileName = `${Date.now()}_${companyBannerUploaded.name}`

        const storageRef = firebase
          .storage()
          .ref(`/companyInfos/${uniqueFileName}`)
        await storageRef.put(companyBannerUploaded)

        bannerUrl = await storageRef.getDownloadURL()

        if (companyInfo && companyInfo.companyBanner) {
          const storageRef = firebase
            .storage()
            .refFromURL(companyInfo.companyBanner)
          storageRef.delete().catch((error) => {
            console.error('Erro ao excluir imagem anterior:', error)
          })
        }
      }

      await handleUpdateApplicationPics({
        companyLogo: logoUrl || tempCompanyImage,
        companyFlaticon: bannerUrl || tempCompanyFlaticon
      })
    } finally {
      setUpdatingCompany(false)
    }
  }

  const onChange = async (checked: boolean) => {
    await handleUpdateApplicationMaintanceStatus({
      appMaintanceStatus: checked
    })
  }

  const handleChangeAppColor = async () => {
    await handleUpdateApplicationColor({
      appColor: applicationColor
    })
  }

  useEffect(() => {
    if (applicationData?.appPics) {
      const companyPics = applicationData?.appPics
      setTempCompanyImage(companyPics?.companyLogo || '')
      setTempCompanyFlaticon(companyPics?.companyFlaticon || '')
    }
    setApplicationColor(applicationData?.appColor)
  }, [applicationData])

  return (
    <S.SettingsView>
      <G.View>
        <G.ViewContentFull
          style={{
            backgroundColor: token.colorBgContainer,
            border: `1px solid ${token.colorBorderSecondary}`
          }}
        >
          <S.SettingsWrapper>
            {/* <S.SettingsContainer
              style={{
                backgroundColor: token.colorBgElevated,
                border: `1px solid ${token.colorBorderSecondary}`
              }}
            >
              <S.SettingsHeader
                style={{
                  color: token.colorText
                }}
              >
                Editar imagens
              </S.SettingsHeader>
              <S.SettingsImagesWrapper>
                <ImgCrop rotationSlider aspectSlider minZoom={0} maxZoom={10}>
                  <Upload
                    name="company-image"
                    listType="picture-card"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={handleChangeCompanyImage}
                    onPreview={onPreview}
                    className="company_image"
                  >
                    {tempCompanyImage ? (
                      <img
                        src={tempCompanyImage}
                        alt="avatar"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8, fontSize: 13 }}>
                          Add. logo
                        </div>
                      </div>
                    )}
                  </Upload>
                </ImgCrop>
                <ImgCrop rotationSlider>
                  <Upload
                    name="company-banner"
                    listType="picture-card"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={handleChangeCompanyFlaticon}
                    onPreview={onPreview}
                    className="company_banner"
                  >
                    {tempCompanyFlaticon ? (
                      <img
                        src={tempCompanyFlaticon}
                        alt="avatar"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8, fontSize: 13 }}>
                          Add. flaticon
                        </div>
                      </div>
                    )}
                  </Upload>
                </ImgCrop>
                <Button
                  type="primary"
                  onClick={handleUpdate}
                  // loading={creatingAgreementLoading}
                  // disabled={!isValid}
                >
                  Editar
                </Button>
              </S.SettingsImagesWrapper>
            </S.SettingsContainer> */}

            <S.SettingsContainer
              style={{
                backgroundColor: token.colorBgElevated,
                border: `1px solid ${token.colorBorderSecondary}`
              }}
            >
              <S.SettingsHeader
                style={{
                  color: token.colorText
                }}
              >
                Editar cores
              </S.SettingsHeader>
              <S.SettingsColorWrapper>
                <ColorPicker
                  value={applicationColor}
                  onChange={(color) => setApplicationColor(color.toHexString())}
                  showText={(color) => (
                    <span>Cor Principal ({color.toHexString()})</span>
                  )}
                />
                <Button
                  type="primary"
                  onClick={handleChangeAppColor}
                  // loading={creatingAgreementLoading}
                  // disabled={!isValid}
                >
                  Editar
                </Button>
              </S.SettingsColorWrapper>
            </S.SettingsContainer>

            <S.SettingsContainer
              style={{
                backgroundColor: token.colorBgElevated,
                border: `1px solid ${token.colorBorderSecondary}`
              }}
            >
              <S.SettingsHeader
                style={{
                  color: token.colorText
                }}
              >
                Status do cliente
              </S.SettingsHeader>
              <S.SettingsStatusWrapper>
                <span
                  style={{
                    color: token.colorText
                  }}
                >
                  <p>Website em manutenção:</p>
                  <Switch
                    size="small"
                    checked={applicationData?.appMaintanceStatus}
                    onChange={onChange}
                  />
                </span>
              </S.SettingsStatusWrapper>
            </S.SettingsContainer>
          </S.SettingsWrapper>
        </G.ViewContentFull>
      </G.View>
    </S.SettingsView>
  )
}

export default SettingsView
