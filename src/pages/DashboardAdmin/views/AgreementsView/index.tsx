import { useEffect, useMemo, useState } from 'react'

import * as S from './styles'
import * as G from '@/utils/styles/globals'
import { IoSearchSharp, IoCloseCircleOutline, IoLink } from 'react-icons/io5'

import { Button, Input, Modal, Popconfirm, theme } from 'antd'

import { Controller, useForm } from 'react-hook-form'

import { useAdminAuth } from '@/contexts/AdminAuthContext'

import { IAgreement } from '@/@types/Admin'
import { handleAddAgreement, handleDeleteAgreement } from '@/firebase/admin'
import { formatCurrency } from '@/utils/functions/formatCurrency'

const AgreementsView = () => {
  const { token } = theme.useToken()

  const { agreementList } = useAdminAuth()

  const [agreementSearch, setAgreementsSearch] = useState('')

  const [isAgreementModalOpen, setIsAgreementModalOpen] = useState(false)

  const handleSearch = (value: string) => setAgreementsSearch(value)

  const showAgreementModal = () => setIsAgreementModalOpen(true)
  const handleAgreementModalClose = () => setIsAgreementModalOpen(false)

  const filteredAgreements = useMemo(() => {
    if (!agreementSearch) {
      return agreementList
    }

    return agreementList.filter((media) => {
      const objectAsString = JSON.stringify(media).toLowerCase()
      return objectAsString.includes(agreementSearch.toLowerCase())
    })
  }, [agreementList, agreementSearch])

  return (
    <S.AgreementsView>
      <G.View>
        <G.ViewHeader
          style={{
            backgroundColor: token.colorBgContainer,
            border: `1px solid ${token.colorBorderSecondary}`
          }}
        >
          <Input
            style={{ width: '100%', maxWidth: '280px' }}
            addonAfter={
              <IoSearchSharp style={{ fontSize: 16, marginBottom: '-3px' }} />
            }
            placeholder="Pesquise aqui..."
            onChange={(e) => handleSearch(e.target.value)}
            value={agreementSearch}
          />
          <Button type="default" onClick={showAgreementModal}>
            Novo acordo
          </Button>
        </G.ViewHeader>
        <G.ViewContent
          style={{
            backgroundColor: token.colorBgContainer,
            border: `1px solid ${token.colorBorderSecondary}`
          }}
        >
          <S.LinkWrapper>
            <S.LinkWrapperHeader
              style={{
                color: token.colorTextTertiary
              }}
            >
              <S.LinkLine>Nome do acordo</S.LinkLine>
              <S.LinkLine>CTA</S.LinkLine>
            </S.LinkWrapperHeader>
            <S.LinkWrapperContent>
              {agreementList?.length > 0 ? (
                filteredAgreements?.map((agreement: IAgreement) => (
                  <Link key={agreement.agreementId} agreement={agreement} />
                ))
              ) : (
                <S.EmptyAgreements
                  style={{ color: token.colorTextDescription }}
                >
                  Não há acordos registrados
                </S.EmptyAgreements>
              )}
            </S.LinkWrapperContent>
          </S.LinkWrapper>
        </G.ViewContent>
      </G.View>

      <CreateAgreementModal
        isModalOpen={isAgreementModalOpen}
        handleModalClose={handleAgreementModalClose}
      />
    </S.AgreementsView>
  )
}

export default AgreementsView

// ======================================================= MEDIA ITEM

interface ILinkItem {
  agreement: IAgreement
}

const Link = ({ agreement }: ILinkItem) => {
  const { token } = theme.useToken()

  const handleDelete = async () => {
    const deleteAgreementResponse = await handleDeleteAgreement(
      agreement.agreementId
    )
  }

  return (
    <S.Link
      style={{
        backgroundColor: token.colorBgElevated,
        border: `1px solid ${token.colorBorderSecondary}`,
        color: token.colorTextSecondary
      }}
    >
      <S.LinkLine>
        <p>{agreement.agreementLabel}</p>
      </S.LinkLine>
      <S.LinkLine>
        <p>{formatCurrency(agreement.agreementCta)}</p>
      </S.LinkLine>

      <span>
        <Popconfirm
          title="Deletar acordo"
          description="Você tem certeza que deseja excluir esse acordo?"
          onConfirm={handleDelete}
          okText="Sim"
          cancelText="Não"
        >
          <Button
            size="small"
            danger
            icon={
              <IoCloseCircleOutline
                style={{ fontSize: 18, marginTop: '2px' }}
              />
            }
          />
        </Popconfirm>
      </span>
    </S.Link>
  )
}

// ======================================================= AGREEMENTS MODAL

interface ICreateAgreement {
  agreementCta: number
  agreementLabel: string
}

interface ICreateAgreementModal {
  isModalOpen: boolean
  handleModalClose: () => void
}

const CreateAgreementModal = ({
  isModalOpen,
  handleModalClose
}: ICreateAgreementModal) => {
  const { token } = theme.useToken()

  const [creatingAgreementLoading, setCreatingAgreementLoading] =
    useState(false)

  const { control, handleSubmit, reset, formState } =
    useForm<ICreateAgreement>()

  const { isValid } = formState

  const handleCreateAgreement = async (data: ICreateAgreement) => {
    setCreatingAgreementLoading(true)

    const createAgreementResponse = await handleAddAgreement({
      agreementCta: data.agreementCta,
      agreementLabel: data.agreementLabel
    })

    setCreatingAgreementLoading(false)

    if (createAgreementResponse) {
      reset()
      handleModalClose()
    }
  }

  return (
    <Modal
      title="Criar acordo"
      open={isModalOpen}
      onOk={handleModalClose}
      onCancel={handleModalClose}
      footer={null}
      destroyOnClose
      afterClose={handleModalClose}
    >
      <S.CreateAgreementForm onSubmit={handleSubmit(handleCreateAgreement)}>
        <Controller
          name="agreementLabel"
          control={control}
          rules={{ required: 'Este campo é obrigatório' }}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Nome do acordo"
              style={{ flex: 1 }}
            />
          )}
        />
        <Controller
          name="agreementCta"
          control={control}
          rules={{ required: 'Este campo é obrigatório' }}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              min={0}
              placeholder="Porcentagem CTA do acordo"
              style={{ flex: 1 }}
            />
          )}
        />
        <S.CreateAgreementFormFooter>
          <Button
            type="primary"
            htmlType="submit"
            loading={creatingAgreementLoading}
            disabled={!isValid}
          >
            Cadastrar acordo
          </Button>
        </S.CreateAgreementFormFooter>
      </S.CreateAgreementForm>
    </Modal>
  )
}
