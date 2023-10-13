import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

import * as S from './styles'

import { Button, Input, theme } from 'antd'

import { Controller, useForm } from 'react-hook-form'

import { handleSigninUser, handleGetUserDataByEmail } from '@/firebase/auth'
interface ISigninForm {
  userEmail: string
  userPassword: string
}

const SignInClient = () => {
  const { token } = theme.useToken()

  const navigate = useNavigate()

  const [signinIsLoading, setSigninIsLoading] = useState(false)

  const { control, handleSubmit, reset, formState } = useForm<ISigninForm>()

  const { isValid } = formState

  const handleSignin = async (data: ISigninForm) => {
    setSigninIsLoading(true)

    const signupAdminResponse = await handleSigninUser({
      userEmail: data.userEmail,
      userPassword: data.userPassword,
      userAdmin: false
    })

    setSigninIsLoading(false)

    if (signupAdminResponse) {
      reset()
      navigate('/dashboard')
    }
  }

  return (
    <S.SignInClient
      style={{ backgroundColor: token.colorBgContainer }}
      color={token.colorText}
      background={token.colorBgContainer}
    >
      <S.SignInContainer
        style={{
          backgroundColor: token.colorBgElevated,
          border: `1px solid ${token.colorBorderSecondary}`
        }}
      >
        <S.SignInHeader>
          <S.SignInHeaderLogo>
            <img src="/logo_full.png" alt="" />
          </S.SignInHeaderLogo>
          <S.SignInHeaderTitle style={{ color: token.colorText }}>
            Entrar
          </S.SignInHeaderTitle>
        </S.SignInHeader>
        <S.SignInForm onSubmit={handleSubmit(handleSignin)}>
          <Controller
            name="userEmail"
            control={control}
            rules={{ required: 'Este campo é obrigatório' }}
            render={({ field }) => <Input {...field} placeholder="E-mail" />}
          />
          <Controller
            name="userPassword"
            control={control}
            rules={{ required: 'Este campo é obrigatório' }}
            render={({ field }) => (
              <Input.Password {...field} placeholder="Senha" />
            )}
          />
          <S.SignInFormFooter>
            <Button
              type="primary"
              htmlType="submit"
              loading={signinIsLoading}
              disabled={!isValid}
            >
              Entrar
            </Button>
          </S.SignInFormFooter>
        </S.SignInForm>
      </S.SignInContainer>
    </S.SignInClient>
  )
}

export default SignInClient
