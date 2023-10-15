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
import { useClientAuth } from '@/contexts/ClientAuthContext'
import { useMemo } from 'react'
import { formatCurrency } from '@/utils/functions/formatCurrency'

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

const HomeView = () => {
  const { token } = theme.useToken()

  const { userData, labels, formattedComissions, formattedTotal, userBalance } =
    useClientAuth()

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
            <S.AnalyticWrapperScroll>
              {/* <Chart
                headerLabel="Disponível para saque"
                chartLabel="Disponível"
                headerValue="R$ 500,00"
              />
              <Chart headerLabel="CPA" chartLabel="CPA" headerValue="10" /> */}
              <S.AnalyticHeader
                style={{
                  backgroundColor: token.colorBgLayout,
                  border: `1px solid ${token.colorBorderSecondary}`,
                  color: token.colorTextBase
                }}
              >
                <p style={{ color: token.colorTextSecondary }}>
                  Disponível para saque:{' '}
                  <b style={{ color: token.colorPrimary }}>
                    {formatCurrency(userBalance)}
                  </b>
                </p>
              </S.AnalyticHeader>
              {/* <S.AnalyticHeader
                style={{
                  backgroundColor: token.colorBgLayout,
                  border: `1px solid ${token.colorBorderSecondary}`,
                  color: token.colorTextBase
                }}
              >
                <p style={{ color: token.colorTextSecondary }}>
                  CPA esse mês:{' '}
                  <b style={{ color: token.colorPrimary }}>{'userBalance'}</b>
                </p>
              </S.AnalyticHeader> */}
              <Chart
                headerLabel="Total faturado"
                chartLabel="Faturado"
                headerValue={formatCurrency(formattedTotal?.totalFaturadoAnual)}
                charLabels={labels}
                chartData={labels?.map(
                  (mes) => formattedComissions[mes]?.totalFaturado
                )}
              />
              <Chart
                headerLabel="CPA Total"
                chartLabel="CPA Total"
                headerValue={formattedTotal?.totalComissaoAnual?.toString()}
                charLabels={labels}
                chartData={labels?.map(
                  (mes) => formattedComissions[mes]?.totalComissao
                )}
              />
            </S.AnalyticWrapperScroll>
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
  charLabels?: any
  chartData?: any
}

const Chart = ({
  headerLabel,
  headerValue,
  chartLabel,
  charLabels,
  chartData
}: IChart) => {
  const { token } = theme.useToken()

  const data = {
    labels: charLabels,
    datasets: [
      {
        label: chartLabel,
        data: chartData,
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
