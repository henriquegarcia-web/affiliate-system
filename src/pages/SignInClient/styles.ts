import styled from 'styled-components'
import { Window } from '@/utils/styles/globals'

interface ISignIn {
  color: string
  background: string
}

export const SignInClient = styled(Window)<ISignIn>`
  justify-content: center;
  align-items: center;

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-background-clip: text;
    -webkit-text-fill-color: ${({ color }) => color};
    transition: background-color 5000s ease-in-out 0s;
    box-shadow: inset 0 0 20px 20px ${({ background }) => background};
  }
`

export const SignInContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 25px;
  padding: 30px 20px 20px 20px;
  border-radius: 10px;
`

export const SignInHeader = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 15px;
`

export const SignInHeaderLogo = styled.div`
  display: flex;
  justify-content: center;

  img {
    max-width: 140px;
  }
`

export const SignInHeaderTitle = styled.div`
  display: flex;
  justify-content: center;

  font-size: 13px;
  line-height: 13px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

export const SignInForm = styled.form`
  display: flex;
  flex-direction: column;
  row-gap: 10px;
`

export const SignInFormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 5px;
`
