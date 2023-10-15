import { useMemo, useState } from 'react'

import * as S from './styles'
import * as G from '@/utils/styles/globals'
import {
  IoSearchSharp,
  IoTrashBinOutline,
  IoCreateOutline,
  IoChevronDownOutline
} from 'react-icons/io5'

import { Button, Dropdown, Form, Input, Modal, theme } from 'antd'

import { Controller, useForm } from 'react-hook-form'

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { handleUpdateWithdrawStatus } from '@/firebase/admin'

import { timestampToDate } from '@/utils/functions/convertTimestamp'
import { formatCurrency } from '@/utils/functions/formatCurrency'

import { IWithdraw } from '@/@types/Admin'
import type { MenuProps } from 'antd'

const AccessView = () => {
  const { token } = theme.useToken()

  const { withdrawsList } = useAdminAuth()

  const [withdrawSearch, setWithdrawSearch] = useState('')

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const [withdrawOpenData, setWithdrawOpenData] = useState<IWithdraw | null>(
    null
  )

  const handleSearch = (value: string) => setWithdrawSearch(value)

  const showWithdrawModal = (withdraw: IWithdraw) => {
    setIsWithdrawModalOpen(true)
    setWithdrawOpenData(withdraw)
  }
  const handleWithdrawModalClose = () => {
    setIsWithdrawModalOpen(false)
    setWithdrawOpenData(null)
  }

  const filteredWithdraws = useMemo(() => {
    if (!withdrawSearch) {
      return withdrawsList
    }

    return withdrawsList.filter((withdraw) => {
      const objectAsString = JSON.stringify(withdraw).toLowerCase()
      return objectAsString.includes(withdrawSearch.toLowerCase())
    })
  }, [withdrawsList, withdrawSearch])

  return (
    <S.WithdrawView>
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
            value={withdrawSearch}
          />
        </G.ViewHeader>
        <G.ViewContent
          style={{
            backgroundColor: token.colorBgContainer,
            border: `1px solid ${token.colorBorderSecondary}`
          }}
        >
          <S.WithdrawList>
            <S.WithdrawHeader style={{ color: token.colorTextDisabled }}>
              <S.WithdrawLine>
                <p>Valor do saque</p>
              </S.WithdrawLine>
              <S.WithdrawLine>
                <p>Solicitado por</p>
              </S.WithdrawLine>
              <S.WithdrawLine>
                <p>Solicitado em</p>
              </S.WithdrawLine>
            </S.WithdrawHeader>
            <S.WithdrawWrapper>
              {withdrawSearch?.length > 0 ? (
                filteredWithdraws?.map((withdraw: IWithdraw) => (
                  <Withdraw
                    key={withdraw.withdrawId}
                    withdraw={withdraw}
                    showWithdrawModal={showWithdrawModal}
                  />
                ))
              ) : (
                <S.EmptyWithdraw style={{ color: token.colorTextDescription }}>
                  Não há solicitações de saque
                </S.EmptyWithdraw>
              )}
            </S.WithdrawWrapper>
          </S.WithdrawList>
        </G.ViewContent>
      </G.View>

      <WithdrawChangeStatusModal
        isModalOpen={isWithdrawModalOpen}
        handleModalClose={handleWithdrawModalClose}
        withdrawOpenData={withdrawOpenData}
      />
    </S.WithdrawView>
  )
}

export default AccessView

// ======================================================= WITHDRAW ITEM

interface IWithdrawItem {
  withdraw: IWithdraw
  showWithdrawModal: (withdraw: IWithdraw) => void
}

const Withdraw = ({ withdraw, showWithdrawModal }: IWithdrawItem) => {
  const { token } = theme.useToken()

  return (
    <S.Withdraw
      style={{
        backgroundColor: token.colorBgElevated,
        border: `1px solid ${token.colorBorderSecondary}`,
        color: token.colorTextSecondary
      }}
    >
      <S.WithdrawLine>
        {formatCurrency(withdraw?.withdrawAmount)}
      </S.WithdrawLine>
      <S.WithdrawLine>{withdraw?.withdrawUser?.userName}</S.WithdrawLine>
      <S.WithdrawLine>
        {timestampToDate(withdraw?.withdrawRegisteredAt)}
      </S.WithdrawLine>

      <span>
        <S.WithdrawLabel type={withdraw?.withdrawStatus}>
          {getStatusLabel(withdraw?.withdrawStatus)}
        </S.WithdrawLabel>
        <Button onClick={() => showWithdrawModal(withdraw)}>Status</Button>
      </span>
    </S.Withdraw>
  )
}

// ======================================================= WITHDRAW ITEM

interface IWithdrawChangeStatus {
  withdrawStatus: 'concluded' | 'pending' | 'finished'
}

interface IWithdrawChangeStatusModal {
  isModalOpen: boolean
  handleModalClose: () => void
  withdrawOpenData: IWithdraw
}

const WithdrawChangeStatusModal = ({
  isModalOpen,
  handleModalClose,
  withdrawOpenData
}: IWithdrawChangeStatusModal) => {
  const { token } = theme.useToken()

  const [editingWithdrawLoading, setEditingWithdrawLoading] = useState(false)

  const { control, handleSubmit, reset, formState } =
    useForm<IWithdrawChangeStatus>()

  const { isValid } = formState

  const handleChangeWithdrawStatus = async (data: IWithdrawChangeStatus) => {
    setEditingWithdrawLoading(true)

    const updateWithdrawResponse = await handleUpdateWithdrawStatus({
      withdrawId: withdrawOpenData.withdrawId,
      newStatus: data.withdrawStatus
    })

    setEditingWithdrawLoading(false)

    if (updateWithdrawResponse) {
      reset()
      handleModalClose()
    }
  }

  return (
    <Modal
      title="Editar status de saque"
      open={isModalOpen}
      onOk={handleModalClose}
      onCancel={handleModalClose}
      footer={null}
      destroyOnClose
      afterClose={handleModalClose}
    >
      <S.WithdrawDetails
        style={{
          backgroundColor: token.colorBgContainer,
          border: `1px solid ${token.colorBorderSecondary}`,
          color: token.colorTextSecondary
        }}
      >
        <span style={{ backgroundColor: token.colorBgElevated }}>
          <p>Solicitado por: </p>
          <b>{withdrawOpenData?.withdrawUser?.userName}</b>
        </span>
        <span style={{ backgroundColor: token.colorBgElevated }}>
          <p>Solicitado em:</p>
          <b>{timestampToDate(withdrawOpenData?.withdrawRegisteredAt)}</b>
        </span>
        <span style={{ backgroundColor: token.colorBgElevated }}>
          <p>Chave USDT:</p> <b>{withdrawOpenData?.withdrawUsdt}</b>
        </span>
        <span style={{ backgroundColor: token.colorBgElevated }}>
          <p>Valor do saque:</p>
          <b>{formatCurrency(withdrawOpenData?.withdrawAmount)}</b>
        </span>
        <span style={{ backgroundColor: token.colorBgElevated }}>
          <p>Status atual:</p>
          <b>{getStatusLabel(withdrawOpenData?.withdrawStatus)}</b>
        </span>
      </S.WithdrawDetails>
      <S.WithdrawEditStatusForm
        onSubmit={handleSubmit(handleChangeWithdrawStatus)}
      >
        <Controller
          name="withdrawStatus"
          control={control}
          rules={{ required: 'Este campo é obrigatório' }}
          render={({ field }) => (
            <Dropdown.Button
              menu={{
                items,
                onClick: (e) => field.onChange(e.key),
                style: { width: '100%' }
              }}
              icon={
                <IoChevronDownOutline
                  style={{ fontSize: 16, marginBottom: '-4px' }}
                />
              }
              trigger={['click']}
            >
              {field.value
                ? getStatusLabel(field.value.toString())
                : getStatusLabel(withdrawOpenData?.withdrawStatus)}
            </Dropdown.Button>
          )}
        />
        <Button
          type="primary"
          htmlType="submit"
          loading={editingWithdrawLoading}
          disabled={!isValid}
        >
          Editar Status
        </Button>
      </S.WithdrawEditStatusForm>
    </Modal>
  )
}

const getStatusLabel = (key: string): string | null => {
  const item: any = items.find((item) => item.key === key)
  return item ? item.label : null
}

const items: MenuProps['items'] = [
  {
    key: 'pending',
    label: 'Pendente'
  },
  {
    key: 'concluded',
    label: 'Concluído'
  },
  {
    key: 'finished',
    label: 'Cancelado'
  }
]
