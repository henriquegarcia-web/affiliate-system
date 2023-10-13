import * as S from './styles'
import * as G from '@/utils/styles/globals'

import { theme } from 'antd'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { faker } from '@faker-js/faker'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const
    },
    title: {
      display: true,
      text: 'Gráfico de Exemplo'
    }
  }
}

const labels = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho'
]

export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: labels.map(() => faker.datatype.number({ min: 0, max: 2000 })),
      borderColor: '#70dc49',
      backgroundColor: 'rgba(112, 220, 73, 0.5)'
    }
    // {
    //   label: 'Dataset 2',
    //   data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
    //   borderColor: 'rgb(53, 162, 235)',
    //   backgroundColor: 'rgba(53, 162, 235, 0.5)'
    // }
  ]
}

const HomeView = () => {
  const { token } = theme.useToken()

  return (
    <S.HomeView>
      <G.View>
        <G.ViewContent
          style={{
            backgroundColor: token.colorBgContainer,
            border: `1px solid ${token.colorBorderSecondary}`
          }}
        >
          <S.MainDatails>
            <S.MainDatailBlock
              style={{
                backgroundColor: token.colorBgLayout,
                border: `1px solid ${token.colorPrimary}`,
                color: token.colorTextBase
              }}
            >
              <p>
                Total de vendas realizadas:{' '}
                <b style={{ color: token.colorPrimary }}>15 vendas</b>
              </p>
            </S.MainDatailBlock>
            <S.MainDatailBlock
              style={{
                backgroundColor: token.colorBgLayout,
                border: `1px solid ${token.colorPrimary}`,
                color: token.colorTextBase
              }}
            >
              <p>
                Disponível para saque:{' '}
                <b style={{ color: token.colorPrimary }}>R$ 7.500,00</b>
              </p>
            </S.MainDatailBlock>
          </S.MainDatails>
          <S.ChartsContainer>
            <S.Chart
              style={{
                border: `1px solid ${token.colorBorderSecondary}`
              }}
            >
              <Line options={options} data={data} />
            </S.Chart>
            <S.Chart
              style={{
                border: `1px solid ${token.colorBorderSecondary}`
              }}
            >
              <Line options={options} data={data} />
            </S.Chart>
          </S.ChartsContainer>
        </G.ViewContent>
      </G.View>
    </S.HomeView>
  )
}

export default HomeView
