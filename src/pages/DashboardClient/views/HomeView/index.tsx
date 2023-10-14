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
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: false,
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

const HomeView = () => {
  const { token } = theme.useToken()

  return (
    <S.HomeView>
      <G.View>
        <G.ViewContentFull
          style={{
            backgroundColor: token.colorBgContainer,
            border: `1px solid ${token.colorBorderSecondary}`
          }}
        >
          <S.AnalyticWrapper>
            <Chart headerLabel="CPA" chartLabel="CPA" headerValue="10" />
            <Chart
              headerLabel="CPA Total"
              chartLabel="CPA Total"
              headerValue="20"
            />
            <Chart
              headerLabel="Disponível para saque"
              chartLabel="Disponível"
              headerValue="R$ 500,00"
            />
            <Chart
              headerLabel="Total faturado"
              chartLabel="Faturado"
              headerValue="R$ 1.000,00"
            />
          </S.AnalyticWrapper>
        </G.ViewContentFull>
      </G.View>
    </S.HomeView>
  )
}

export default HomeView

// ================================================ CHART

interface IChart {
  headerLabel: string
  headerValue: string
  chartLabel: string
}

const Chart = ({ headerLabel, headerValue, chartLabel }: IChart) => {
  const { token } = theme.useToken()

  const data = {
    labels,
    datasets: [
      {
        label: chartLabel,
        data: labels.map(() => faker.datatype.number({ min: 0, max: 2000 })),
        borderColor: '#70dc49',
        backgroundColor: 'rgba(112, 220, 73, 0.5)',
        borderWidth: 2
      }
    ]
  }

  return (
    <S.AnalyticContainer>
      <S.AnalyticHeader
        style={{
          backgroundColor: token.colorBgLayout,
          border: `1px solid ${token.colorBorderSecondary}`,
          color: token.colorTextBase
        }}
      >
        <p style={{ color: token.colorTextSecondary }}>
          {headerLabel}:{' '}
          <b style={{ color: token.colorPrimary }}>{headerValue}</b>
        </p>
      </S.AnalyticHeader>
      <S.AnalyticChart
        style={{
          border: `1px solid ${token.colorBorderSecondary}`
        }}
      >
        <Line options={options} data={data} />
      </S.AnalyticChart>
    </S.AnalyticContainer>
  )
}
