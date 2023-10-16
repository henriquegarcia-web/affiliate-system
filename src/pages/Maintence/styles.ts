import styled from 'styled-components'
import { Window } from '@/utils/styles/globals'

export const Maintence = styled(Window)`
  justify-content: center;
  align-items: center;
`

export const MaintenceContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 25px;

  img {
    width: 160px;
    margin-left: -5px;
  }

  h1 {
    display: flex;
    padding: 10px 16px;
    border-radius: 6px;

    font-size: 20px;
    line-height: 18px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
`
