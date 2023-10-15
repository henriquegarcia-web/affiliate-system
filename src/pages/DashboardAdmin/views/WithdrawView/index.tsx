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

const AccessView = () => {
  const { token } = theme.useToken()

  const { withdrawsList } = useAdminAuth()

  // const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // const showCreateModal = () => setIsCreateModalOpen(true)
  // const handleCreateModalClose = () => setIsCreateModalOpen(false)

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
              <Withdraw key={withdraw.withdrawId} withdraw={withdraw} />
            ))}
          </S.WithdrawWrapper>
        </G.ViewContent>
      </G.View>
    </S.WithdrawView>
  )
}

export default AccessView

interface IWithdrawItem {
  withdraw: IWithdraw
}

const Withdraw = ({ withdraw }: IWithdrawItem) => {
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
        {withdraw.withdrawStatus}
      </p>

      <span>
        {/* <Button onClick={showCreateModal}>Links</Button>
        <Button onClick={showComissionModal}>Comissão</Button> */}
        {/* <Button
          icon={
            <IoTrashBinOutline style={{ fontSize: 16, marginLeft: '7px' }} />
          }
        /> */}
      </span>
    </S.Withdraw>
  )
}
