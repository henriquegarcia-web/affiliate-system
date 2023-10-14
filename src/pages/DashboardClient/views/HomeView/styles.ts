import styled from 'styled-components'

export const HomeView = styled.main`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 10px;
`

export const AnalyticWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
  gap: 15px;
  padding: 10px;
`

export const AnalyticContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  width: calc(50% - 7.5px);
`

export const AnalyticHeader = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 16px;
  border-radius: 8px;
  transition: 0.3s;

  p {
    font-size: 14px;
    line-height: 14px;
    font-weight: 400;
    text-transform: uppercase;

    b {
      font-size: 16px;
      font-weight: 800;
    }
  }

  &:hover {
    border: 1px solid rgba(112, 220, 73, 0.6) !important;
  }
`

export const AnalyticChart = styled.div`
  display: flex;
  /* justify-content: center; */
  width: 100%;
  height: 220px;
  padding: 10px;
  border-radius: 8px;

  background-color: rgba(0, 0, 0, 0.25);
`
