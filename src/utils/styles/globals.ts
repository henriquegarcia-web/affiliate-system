import styled, { createGlobalStyle } from 'styled-components'

import Colors from './colors'
// import Fonts from "../styles/fonts";

export const responsiveDesktop = '1000px'
export const responsiveTablet = '760px'
export const responsiveMobile = '480px'

export const adminMenuWidth = '220px'
export const adminHeaderHeight = '55px'
export const adminViewHeader = '50px'
export const landingHeaderHeight = '50px'

export const adminViewSupportWrapper = '480px'
export const adminViewDisclosureWrapper = '600px'
export const adminViewInfosWrapper = '600px'
export const adminViewMenuWrapper = '800px'

const GlobalStyle = createGlobalStyle`
  :root {
    font-size: 14px;

    @media screen and (min-width: 1024px) {
      font-size: 16px;
    }
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    border: none;
    outline: none;
    font-family: 'Roboto', sans-serif;
    /* font-family: 'Rubik', sans-serif; */
    text-decoration: none;
    user-select: none;

    -webkit-tap-highlight-color: transparent !important;
  }

  scroll-behavior: smooth;

  html {
    /* overflow: hidden; */
    &::-webkit-scrollbar {
      width: 6px;
      z-index: 1000;
    }

    &::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1);
    }

    &::-webkit-scrollbar-thumb {
      background: #011bcd;
    }
  }

  body {


    &::-webkit-scrollbar {
      width: 6px;
      z-index: 1000;
    }

    &::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1);
    }

    &::-webkit-scrollbar-thumb {
      background: #011bcd;
    }
  }

  .ant-form-item-explain-error {
    font-size: 12px !important;
    padding-top: 5px !important;
  }
 

  // ------------------------- SCROLL BAR

  .ant-picker-time-panel-column, .ant-input {
    &::-webkit-scrollbar {
      width: 3px;
      z-index: 1000;
    }

    &::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
      background: #011bcd;
      border-radius: 10px;
    }
  }
`

export default GlobalStyle

export const Window = styled.main`
  display: flex;
  width: 100%;
  height: 100vh;

  overflow: auto;

  &::-webkit-scrollbar {
    width: 5px;
    z-index: 1000;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.15);
  }

  &::-webkit-scrollbar-thumb {
    background: #011bcd;
    border-radius: 10px;
  }
`

export const View = styled.section`
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  width: 100%;
  height: 100%;
`

export const ViewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: ${adminHeaderHeight};
  border-radius: 8px;
  padding: 0 10px;
`

export const ViewContent = styled.div`
  display: flex;
  width: 100%;
  height: calc(100% - ${adminHeaderHeight});
  border-radius: 8px;
  /* padding: 10px; */

  overflow: auto;

  &::-webkit-scrollbar {
    width: 5px;
    z-index: 1000;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.15);
  }

  &::-webkit-scrollbar-thumb {
    background: #011bcd;
    border-radius: 10px;
  }
`

export const ViewContentFull = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  /* padding: 15px; */

  overflow: auto;

  &::-webkit-scrollbar {
    width: 5px;
    z-index: 1000;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.15);
  }

  &::-webkit-scrollbar-thumb {
    background: #011bcd;
    border-radius: 10px;
  }
`
