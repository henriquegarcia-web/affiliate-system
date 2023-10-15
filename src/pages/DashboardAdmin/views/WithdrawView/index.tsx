import { useState } from 'react'

import * as S from './styles'
import * as G from '@/utils/styles/globals'
import {
  IoSearchSharp,
  IoTrashBinOutline,
  IoCreateOutline
} from 'react-icons/io5'

import { Button, Form, Input, Modal, theme } from 'antd'

import { Controller, useForm } from 'react-hook-form'

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { IWithdraw } from '@/@types/Admin'
import { handleUpdateWithdrawStatus } from '@/firebase/admin'
import { timestampToDate } from '@/utils/functions/convertTimestamp'
import { formatCurrency } from '@/utils/functions/formatCurrency'

const AccessView = () => {
  const { token } = theme.useToken()

  const { withdrawsList } = useAdminAuth()

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const [withdrawOpenData, setWithdrawOpenData] = useState<IWithdraw | null>(
    null
  )

  const showWithdrawModal = (withdraw: IWithdraw) => {
    setIsWithdrawModalOpen(true)
    setWithdrawOpenData(withdraw)
  }
  const handleWithdrawModalClose = () => {
    setIsWithdrawModalOpen(false)
    setWithdrawOpenData(null)
  }

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
          />
          {/* <Button type="default" onClick={showCreateModal}>
            Novo acesso
          </Button> */}
        </G.ViewHeader>
        <G.ViewContent
          style={{
            backgroundColor: token.colorBgContainer,
            border: `1px solid ${token.colorBorderSecondary}`
          }}
        >
          <S.WithdrawWrapper>
            {withdrawsList?.map((withdraw: IWithdraw) => (
              <Withdraw
                key={withdraw.withdrawId}
                withdraw={withdraw}
                showWithdrawModal={showWithdrawModal}
              />
            ))}
          </S.WithdrawWrapper>
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
      <p>
        <b>{withdraw.withdrawAmount}</b> / {withdraw.withdrawUsdt} /{' '}
        {withdraw.withdrawStatus} / {withdraw?.withdrawUser?.userName}
      </p>

      <span>
        <Button onClick={() => showWithdrawModal(withdraw)}>Status</Button>
        {/* <Button onClick={showComissionModal}>Comissão</Button> */}
        {/* <Button
          icon={
            <IoTrashBinOutline style={{ fontSize: 16, marginLeft: '7px' }} />
          }
        /> */}
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
    >
      <S.WithdrawDetails
        style={{
          backgroundColor: token.colorBgContainer,
          border: `1px solid ${token.colorBorderSecondary}`,
          color: token.colorTextSecondary
        }}
      >
        <span>
          <p>Solicitado por: </p>
          <b>{withdrawOpenData?.withdrawUser?.userName}</b>
        </span>
        <span>
          <p>Solicitado em:</p>
          <b>{timestampToDate(withdrawOpenData?.withdrawRegisteredAt)}</b>
        </span>
        <span>
          <p>Chave USDT:</p> <b>{withdrawOpenData?.withdrawUsdt}</b>
        </span>
        <span>
          <p>Valor do saque:</p>
          <b>{formatCurrency(withdrawOpenData?.withdrawAmount)}</b>
        </span>
        <span>
          <p>Status atual:</p> <b>{withdrawOpenData?.withdrawStatus}</b>
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
            <Input {...field} placeholder="Digite o nome" />
          )}
        />
        <S.WithdrawEditStatusFormFooter>
          <Button
            type="primary"
            htmlType="submit"
            loading={editingWithdrawLoading}
            disabled={!isValid}
          >
            Editar Status
          </Button>
        </S.WithdrawEditStatusFormFooter>
      </S.WithdrawEditStatusForm>
    </Modal>
  )
}
