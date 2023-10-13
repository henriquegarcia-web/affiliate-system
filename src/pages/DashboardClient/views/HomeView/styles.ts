import styled from 'styled-components'

export const HomeView = styled.main`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 10px;
`

export const MainDatails = styled.div`
  display: flex;
  width: 100%;
  column-gap: 10px;
  margin-bottom: 20px;
`

export const MainDatailBlock = styled.div`
  display: flex;
  justify-content: center;
  width: calc(50% - 5px);
  padding: 20px;
  border-radius: 8px;

  p {
    font-size: 16px;
    line-height: 16px;
    font-weight: 300;

    b {
      font-size: 20px;
      font-weight: 800;
    }
  }
`

export const ChartsContainer = styled.div`
  display: flex;
  width: 100%;
  height: 300px;
  column-gap: 10px;
`

export const Chart = styled.div`
  display: flex;
  width: calc(50% - 5px);
  padding: 10px;
  border-radius: 8px;
`
