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

const AccessView = () => {
  const { token } = theme.useToken()

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
          {/* {affiliatesList?.map((affiliate) => (
            <User
              key={affiliate.userId}
              affiliate={affiliate}
              showLinksModal={showLinksModal}
              showComissionModal={showComissionModal}
            />
          ))} */}
        </G.ViewContent>
      </G.View>
    </S.WithdrawView>
  )
}

export default AccessView
