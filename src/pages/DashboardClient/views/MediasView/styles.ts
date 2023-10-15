import { responsiveMobile } from '@/utils/styles/globals'
import styled from 'styled-components'

const linkWrapperHeader = '20px'

export const MediasView = styled.main`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 10px;
`

export const SearchInput = styled.div`
  display: flex;
  width: 100%;
  max-width: 280px;

  @media screen and (max-width: ${responsiveMobile}) {
    max-width: 100%;
  }
`

export const LinkWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  width: 100%;
  height: 100%;
  padding: 10px;
`

export const LinkWrapperHeader = styled.div`
  display: flex;
  align-items: center;
  column-gap: 10px;
  width: 100%;
  height: ${linkWrapperHeader};
  padding: 0 10px;

  font-size: 14px;
  line-height: 14px;
  font-weight: 400;
`

export const LinkWrapperContent = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  width: 100%;
  height: calc(100% - ${linkWrapperHeader});
`

export const EmptyLinks = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: calc(100% - ${linkWrapperHeader});

  font-size: 14px;
  line-height: 14px;
  font-weight: 400;
`

export const Link = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 12px;
  padding: 7px 8px;
  border-radius: 8px;
  transition: 0.3s;

  &:hover {
    border: 1px solid rgba(112, 220, 73, 0.4) !important;

    p {
      color: rgba(112, 220, 73, 0.8);
    }
  }
`

export const LinkLine = styled.div`
  display: flex;

  font-size: 11px;
  line-height: 11px;
  text-transform: uppercase;

  button {
    font-size: 12px !important;
    line-height: 12px !important;
  }

  p {
    font-size: 13px;
    line-height: 15px;
    font-weight: 400;
    text-transform: none;

    b {
      font-weight: 500;
    }
  }

  &:nth-of-type(1) {
    width: 80px;
  }

  &:nth-of-type(2) {
    flex: 1;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

export const OpenLink = styled.a`
  display: flex;
  padding: 2px;
  cursor: pointer;

  svg {
    transition: 0.3s;
    font-size: 18px;
  }

  &:hover {
    svg {
      color: white !important;
    }
  }
`
