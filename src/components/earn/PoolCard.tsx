import React from 'react'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import styled from 'styled-components'
import CurrencyLogo from 'components/CurrencyLogo'
import { TYPE, StyledInternalLink } from '../../theme'
import DoubleCurrencyLogo from '../DoubleLogo'
import { ETHER, JSBI, TokenAmount } from '@uniswap/sdk'
import { ButtonPrimary } from '../Button'
import { StakingInfo } from '../../state/stake/hooks'
import { useColor } from '../../hooks/useColor'
import { currencyId } from '../../utils/currencyId'
import { Break, CardNoise, CardBGImage } from './styled'
// import { unwrappedToken } from '../../utils/wrappedCurrency'
import { useTotalSupply } from '../../data/TotalSupply'
// import { GetRewardTokenPrice } from '../../data/RewardTokenPrice'
import { usePair } from '../../data/Reserves'
import useUSDCPrice from '../../utils/useUSDCPrice'
// import { BIG_INT_SECONDS_IN_WEEK } from '../../constants'

import BackgroundLogo from '../../assets/images/NFTtest.png'

const StatContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 1rem;
  margin-right: 1rem;
  margin-left: 1rem;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  display: none;
`};
`

const Wrapper = styled(AutoColumn) <{ showBackground: boolean; bgColor: any }>`
  border-radius: 12px;
  width: 100%;
  overflow: hidden;
  position: relative;
  opacity: ${({ showBackground }) => (showBackground ? '1' : '1')};
  background: radial-gradient(91.85% 100% at 1.84% 0%,rgba(33,114,229,0.2) 0%,#1A1F28 100%);

  color: ${({ theme, showBackground }) => (showBackground ? theme.white : theme.text1)} !important;

  ${({ showBackground }) =>
    showBackground &&
    `  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);`}
`

const TopSection = styled.div`
  display: grid;
  grid-template-columns: 48px 1fr 120px;
  grid-gap: 0px;
  align-items: center;
  padding: 1rem;
  z-index: 1;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: 48px 1fr 96px;
  `};
`

const BottomSection = styled.div<{ showBackground: boolean }>`
  padding: 12px 16px;
  opacity: ${({ showBackground }) => (showBackground ? '1' : '0.4')};
  border-radius: 0 0 12px 12px;
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
  z-index: 1;
`

export default function PoolCard({ stakingInfo }: { stakingInfo: StakingInfo }) {
  const token0 = stakingInfo.tokens[0]
  const token1 = stakingInfo.tokens[1]
  const currency2 =  stakingInfo.baseToken[0]

  const currency0 = token0
  const currency1 = token1



  const isStaking = Boolean(stakingInfo.stakedAmount.greaterThan('0'))

  // get the color of the token
  const token = currency0 === ETHER ? token1 : token0
  const WETH = currency0 === ETHER ? token0 : token1
  const backgroundColor = useColor(token)

  const totalSupplyOfStakingToken = useTotalSupply(stakingInfo.stakedAmount.token)
  const [, stakingTokenPair] = usePair(...stakingInfo.tokens)

  // let returnOverMonth: Percent = new Percent('0')
  let valueOfTotalStakedAmountInWETH: TokenAmount | undefined
  if (totalSupplyOfStakingToken && stakingTokenPair && !stakingInfo.isTokenOnly) {
    // take the total amount of LP tokens staked, multiply by ETH value of all LP tokens, divide by all LP tokens
    valueOfTotalStakedAmountInWETH = new TokenAmount(
      WETH,
      JSBI.divide(
        JSBI.multiply(
          JSBI.multiply(stakingInfo.totalStakedAmount.raw, stakingTokenPair.reserveOf(WETH).raw),
          JSBI.BigInt(2) // this is b/c the value of LP shares are ~double the value of the WETH they entitle owner to
        ),
        totalSupplyOfStakingToken.raw
      )
    )
  }
  else if (stakingInfo.isTokenOnly) {
    valueOfTotalStakedAmountInWETH = new TokenAmount(
      token0,
      stakingInfo.totalStakedAmount.raw
    )
  }

  var show = isStaking || !stakingInfo.ended;
  // get the USD value of staked WETH
  const USDPrice = useUSDCPrice(WETH)
  const rewardTokenPrice = useUSDCPrice(token0)
  const valueOfTotalStakedAmountInUSDC =
    valueOfTotalStakedAmountInWETH && (stakingInfo.isTokenOnly ? rewardTokenPrice : USDPrice)?.quote(valueOfTotalStakedAmountInWETH)
  var valueofApy: string | undefined
  if (rewardTokenPrice !== undefined && valueOfTotalStakedAmountInUSDC !== undefined && !valueOfTotalStakedAmountInUSDC?.equalTo(JSBI.BigInt(0))) {
    valueofApy = (stakingInfo.totalRewardRate?.multiply(`${60 * 60 * 24 * 365}`)
      ?.divide(`${10000}`)
      ?.multiply(`${Math.ceil(parseFloat(rewardTokenPrice.toFixed(6)) * 1000000)}`)
      ?.multiply(`${1000000}`)
      ?.multiply(`${1000000}`)
      ?.multiply(`${1000000}`)
      ?.divide(`${valueOfTotalStakedAmountInUSDC?.raw}`)
      ?.toFixed(10).toString()
    )
  } else {
    valueofApy = undefined
  }
  console.log('valueOfTotalStakedAmountInUSDC', stakingInfo.totalRewardRate?.toFixed(4, { groupSeparator: ',' }),
  rewardTokenPrice?.toFixed(4, { groupSeparator: ',' }),
  valueOfTotalStakedAmountInUSDC?.toFixed(4, { groupSeparator: ',' }))
  const IconWrapper = styled.div<{ size?: number }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  width:200px;
  & > img,
  span {
    height: ${({ size }) => (size ? size + 'px' : '180px')};
    width: ${({ size }) => (size ? size + 'px' : '200px')};
    border-radius:10px;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: flex-end;
  `};
`
//  console.log('valueOfTotalStakedAmountInUSDC', valueOfTotalStakedAmountInUSDC?.toFixed(4, { groupSeparator: ',' }))
  return (
    show ?
      <Wrapper showBackground={isStaking} bgColor={backgroundColor}>
        <CardBGImage desaturate />
        <CardNoise />

        <TopSection style={{ alignItems: 'start' }}>
          {
            stakingInfo.isNftToken ?
              <>
                {/* <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={24} /> */}
                <IconWrapper>
                  <img src={BackgroundLogo} alt={'wallet connect logo'} />
                </IconWrapper>
                <TYPE.white fontWeight={150} fontSize={24} style={{ textAlign: 'center', marginLeft: '60px' }}>
                  {'NFT'} ({currency0.symbol})
                </TYPE.white>
              </>
              :
              !stakingInfo.isTokenOnly && !stakingInfo.isNftToken ?
                stakingInfo.name === 'WELT-WMATIC' ?
                  <>
                    <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={24} />
                    <TYPE.white fontWeight={600} fontSize={24} style={{ marginLeft: '8px' }}>
                      {currency0.symbol}-{currency1.symbol}
                    </TYPE.white>
                  </>
                  :
                  <>
                    <DoubleCurrencyLogo currency0={currency0} currency1={currency2} size={24} />
                    <TYPE.white fontWeight={600} fontSize={24} style={{ marginLeft: '8px' }}>
                      {stakingInfo.name}
                    </TYPE.white>
                  </>
                :
                stakingInfo.name === 'vault' ?
                  <>
                    <DoubleCurrencyLogo currency0={currency0} size={24} />
                    <TYPE.white fontWeight={600} fontSize={24} style={{ marginLeft: '8px' }}>
                      {currency0.symbol} {'(vault)'}
                    </TYPE.white>
                  </>
                  :
                  <>
                    <CurrencyLogo currency={currency0} size={'24px'} />
                    <TYPE.white fontWeight={600} fontSize={24} style={{ marginLeft: '8px' }}>
                      {currency0.symbol} (Manual)
                    </TYPE.white>
                  </>
          }
          <StyledInternalLink to={`/WELT/${currencyId(currency0)}/${currencyId(currency1)}/${stakingInfo.stakingRewardAddress}`} style={{ width: '100%' }}>
            <ButtonPrimary padding="8px" borderRadius="8px">
              {isStaking ? 'Manage' : 'Deposit'}
            </ButtonPrimary>
          </StyledInternalLink>


          {stakingInfo.isNftToken ?
            <StatContainer style={{ width: '60%', position: 'absolute', left: '210px', top: '100px' }}>
              <RowBetween>
                <TYPE.white> Total deposited</TYPE.white>
                <TYPE.white>
                  {valueOfTotalStakedAmountInUSDC
                    ? Math.ceil(parseFloat(valueOfTotalStakedAmountInUSDC.toFixed(6)) * 1000000) / 1000000 !== 0
                      ? `$${valueOfTotalStakedAmountInUSDC.toFixed(4, { groupSeparator: ',' })}`
                      : `$${valueOfTotalStakedAmountInUSDC.toFixed(0, { groupSeparator: ',' })}`
                    : `$${valueOfTotalStakedAmountInWETH?.toSignificant(4, { groupSeparator: ',' }) ?? '-'}`}
                </TYPE.white>
              </RowBetween>
              <RowBetween>

                <TYPE.white> Pool rate </TYPE.white>
                <TYPE.white>{`${stakingInfo.totalRewardRate
                  ?.multiply(`${60 * 60 * 24}`)
                  ?.toFixed(0, { groupSeparator: ',' })} WELT / day`}</TYPE.white>
              </RowBetween>
              <RowBetween>
                <TYPE.white> APY </TYPE.white>
                <TYPE.white>
                  {valueofApy !== undefined
                    ? valueofApy !== '0.000'
                      ? `${parseFloat(valueofApy).toFixed(10)} %`
                      : `0 %`
                    : `---`}
                </TYPE.white>
              </RowBetween>
            </StatContainer>
            :
            <></>}

        </TopSection>

        {!stakingInfo.isNftToken ?
          <StatContainer>
            <RowBetween>
              <TYPE.white> Total deposited</TYPE.white>
              <TYPE.white>
                {valueOfTotalStakedAmountInUSDC
                  ? Math.ceil(parseFloat(valueOfTotalStakedAmountInUSDC.toFixed(6)) * 1000000) / 1000000 !== 0
                    ? `$${valueOfTotalStakedAmountInUSDC.toFixed(4, { groupSeparator: ',' })}`
                    : `$${valueOfTotalStakedAmountInUSDC.toFixed(0, { groupSeparator: ',' })}`
                  : `$${valueOfTotalStakedAmountInWETH?.toSignificant(4, { groupSeparator: ',' }) ?? '-'}`}
              </TYPE.white>
            </RowBetween>
            <RowBetween>

              <TYPE.white> Pool rate </TYPE.white>
              <TYPE.white>{`${stakingInfo.totalRewardRate
                ?.multiply(`${60 * 60 * 24}`)
                ?.toFixed(0, { groupSeparator: ',' })} WELT / day`}</TYPE.white>
            </RowBetween>
            <RowBetween>
              <TYPE.white> APY </TYPE.white>
              <TYPE.white>
                {valueofApy !== undefined
                  ? valueofApy !== '0.000'
                    ? `${parseFloat(valueofApy).toFixed(3)} %`
                    : `0 %`
                  : `---`}
              </TYPE.white>
            </RowBetween>
          </StatContainer>
          :
          <></>}



        {isStaking && (
          <>
            <Break />
            <BottomSection showBackground={true}>
              <TYPE.black color={'white'} fontWeight={500}>
                <span>Your rate</span>
              </TYPE.black>

              <TYPE.black style={{ textAlign: 'right' }} color={'white'} fontWeight={500}>
                <span role="img" aria-label="wizard-icon" style={{ marginRight: '0.5rem' }}>
                  ⚡
                </span>
                {/* {stakingInfo
                ? stakingInfo.active
                  ? `${stakingInfo.rewardRate
                    ?.multiply(BIG_INT_SECONDS_IN_WEEK)
                    ?.toSignificant(4, { groupSeparator: ',' })} UNI / week`
                  : '0 UNI / week'
                : '-'} */}
                {`${stakingInfo.rewardRate
                  ?.multiply(`${60 * 60 * 24}`)
                  ?.toSignificant(4, { groupSeparator: ',' })} WELT / day`}
              </TYPE.black>
            </BottomSection>
          </>
        )}
      </Wrapper> : <span style={{ width: 0, display: "none" }}></span>
  )
}
