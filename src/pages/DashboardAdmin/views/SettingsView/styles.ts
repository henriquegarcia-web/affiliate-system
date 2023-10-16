// import { Form } from 'antd'

import styled from 'styled-components'

export const SettingsView = styled.main`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 10px;
`

export const SettingsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
  height: 100%;
  padding: 10px;
`

export const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 15px;
  width: calc((100% / 3) - (20px / 3));
  height: fit-content;
  border-radius: 8px;
  padding: 10px;
`

export const SettingsHeader = styled.div`
  display: flex;

  font-size: 13px;
  line-height: 13px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

export const SettingsImagesWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  column-gap: 5px;
  width: fit-content;

  button {
    margin: 0 0 10px 0;
  }
`

export const SettingsColorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 10px;

  button {
    width: fit-content;
    margin-left: auto;
  }
`

export const SettingsStatusWrapper = styled.div`
  display: flex;

  span {
    display: flex;
    align-items: center;
    column-gap: 6px;

    p {
      margin-bottom: -1px;

      font-size: 12px;
      line-height: 12px;
      font-weight: 400;
      text-transform: uppercase;
    }
  }
`
