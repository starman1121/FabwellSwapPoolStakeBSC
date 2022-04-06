import React, { useCallback, useState } from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { JSBI, TokenAmount, ETHER } from '@uniswap/sdk'
import { RouteComponentProps } from 'react-router-dom'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import { useCurrency } from '../../hooks/Tokens'
import { useWalletModalToggle } from '../../state/application/hooks'
import { TYPE } from '../../theme'

import { RowBetween } from '../../components/Row'
import { CardSection, DataCard, CardNoise, CardBGImage } from '../../components/earn/styled'
import { ButtonPrimary, ButtonEmpty } from '../../components/Button'
import StakingModal from '../../components/earn/StakingModal'
import { useStakingInfo } from '../../state/stake/hooks'
import UnstakingModal from '../../components/earn/UnstakingModal'
import ClaimRewardModal from '../../components/earn/ClaimRewardModal'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useActiveWeb3React } from '../../hooks'
import { useColor } from '../../hooks/useColor'
import { CountUp } from 'use-count-up'

import { wrappedCurrency } from '../../utils/wrappedCurrency'
import { currencyId } from '../../utils/currencyId'
import { useTotalSupply } from '../../data/TotalSupply'
import { usePair } from '../../data/Reserves'
import usePrevious from '../../hooks/usePrevious'
import useUSDCPrice from '../../utils/useUSDCPrice'
import { BIG_INT_ZERO } from '../../constants'

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const PositionInfo = styled(AutoColumn) <{ dim: any }>`
  position: relative;
  max-width: 640px;
  width: 100%;
  opacity: ${({ dim }) => (dim ? 0.6 : 1)};
`

const BottomSection = styled(AutoColumn)`
  border-radius: 12px;
  width: 100%;
  position: relative;
`

const StyledDataCard = styled(DataCard) <{ bgColor?: any; showBackground?: any }>`

  z-index: 2;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);

`

const StyledBottomCard = styled(DataCard) <{ dim: any }>`
  background: ${({ theme }) => theme.bg3};
  opacity: ${({ dim }) => (dim ? 0.4 : 1)};
  margin-top: -40px;
  padding: 0 1.25rem 1rem 1.25rem;
  padding-top: 32px;
  z-index: 1;
`

const PoolData = styled(DataCard)`
  background: none;
  border: 1px solid ${({ theme }) => theme.bg4};
  padding: 1rem;
  z-index: 1;
`

const VoteCard = styled(DataCard)`
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #27ae60 0%, #000000 100%);
  overflow: hidden;
`

const DataRow = styled(RowBetween)`
  justify-content: center;
  gap: 12px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    gap: 12px;
  `};
`

export default function Manage({
  match: {
    params: { currencyIdA, currencyIdB, rewardsAddress }
  }
}: RouteComponentProps<{ currencyIdA: string; currencyIdB: string, rewardsAddress: string }>) {
  const { account, chainId } = useActiveWeb3React()

  console.log('account',account)

  // get currencies and pair
  const [currencyA, currencyB] = [useCurrency(currencyIdA), useCurrency(currencyIdB)]
  const tokenA = wrappedCurrency(currencyA ?? undefined, chainId)
  const tokenB = wrappedCurrency(currencyB ?? undefined, chainId)

  const [, stakingTokenPair] = usePair(tokenA, tokenB)

  // let stakingTokenPair: Pair = {
  //   "liquidityToken": {
  //     "decimals": 18,
  //     "symbol": "UNI-V2",
  //     "name": "Uniswap V2",
  //     "chainId": 137,
  //     "address": "0xEc3ac6F749FE878ebb33bDB545e302D8062B7856"
  //   },
  //   "tokenAmounts": [
  //     {
  //       "numerator": [
  //         -285275255,
  //         2
  //       ],
  //       "denominator": [
  //         1000000
  //       ],
  //       "currency": {
  //         "decimals": 6,
  //         "symbol": "USDC",
  //         "name": "USD Coin (PoS)",
  //         "chainId": 137,
  //         "address": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
  //         "tokenInfo": {
  //           "chainId": 137,
  //           "address": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
  //           "name": "USD Coin (PoS)",
  //           "symbol": "USDC",
  //           "decimals": 6,
  //           "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"
  //         },
  //         "tags": []
  //       },
  //       "token": {
  //         "decimals": 6,
  //         "symbol": "USDC",
  //         "name": "USD Coin (PoS)",
  //         "chainId": 137,
  //         "address": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
  //         "tokenInfo": {
  //           "chainId": 137,
  //           "address": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
  //           "name": "USD Coin (PoS)",
  //           "symbol": "USDC",
  //           "decimals": 6,
  //           "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"
  //         },
  //         "tags": []
  //       }
  //     },
  //     {
  //       "numerator": [
  //         456426026
  //       ],
  //       "denominator": [
  //         10000
  //       ],
  //       "currency": {
  //         "decimals": 4,
  //         "symbol": "SPYRIT",
  //         "name": "Autonio",
  //         "chainId": 137,
  //         "address": "0xad684e79CE4b6D464f2Ff7c3FD51646892e24b96",
  //         "tokenInfo": {
  //           "chainId": 137,
  //           "address": "0xad684e79CE4b6D464f2Ff7c3FD51646892e24b96",
  //           "name": "Autonio",
  //           "symbol": "SPYRIT",
  //           "decimals": 4,
  //           "logoURI": "https://s2.coinmarketcap.com/static/img/coins/64x64/2151.png"
  //         },
  //         "tags": []
  //       },
  //       "token": {
  //         "decimals": 4,
  //         "symbol": "SPYRIT",
  //         "name": "Autonio",
  //         "chainId": 137,
  //         "address": "0xad684e79CE4b6D464f2Ff7c3FD51646892e24b96",
  //         "tokenInfo": {
  //           "chainId": 137,
  //           "address": "0xad684e79CE4b6D464f2Ff7c3FD51646892e24b96",
  //           "name": "Autonio",
  //           "symbol": "SPYRIT",
  //           "decimals": 4,
  //           "logoURI": "https://s2.coinmarketcap.com/static/img/coins/64x64/2151.png"
  //         },
  //         "tags": []
  //       }
  //     }
  //   ]
  // }
 // console.log("debugStaking", stakingTokenPair)
  const stakingInfos = useStakingInfo(stakingTokenPair)
  let stakingInfo = stakingInfos?.reduce<any>((memo, staking) => {
    if (staking.stakingRewardAddress === rewardsAddress) {
      return staking;
    }
    else {
      return memo;
    }

  }, []);

  if (stakingInfo.length === 0) {
    stakingInfo = undefined;
  }

  // detect existing unstaked LP position to show add button if none found
  const userLiquidityUnstaked = useTokenBalance(account ?? undefined, stakingInfo?.stakedAmount?.token)
  const showAddLiquidityButton = Boolean(stakingInfo?.stakedAmount?.equalTo('0') && userLiquidityUnstaked?.equalTo('0'))

  // toggle for staking modal and unstaking modal
  const [showStakingModal, setShowStakingModal] = useState(false)
  const [showUnstakingModal, setShowUnstakingModal] = useState(false)
  const [showClaimRewardModal, setShowClaimRewardModal] = useState(false)

  // fade cards if nothing staked or nothing earned yet
  const disableTop = !stakingInfo?.stakedAmount || stakingInfo.stakedAmount.equalTo(JSBI.BigInt(0))

  const token = currencyA === ETHER ? tokenB : tokenA
  const WETH = currencyA === ETHER ? tokenA : tokenB
  const backgroundColor = useColor(token)

  // get WETH value of staked LP tokens
  const totalSupplyOfStakingToken = useTotalSupply(stakingInfo?.stakedAmount?.token)
  let valueOfTotalStakedAmountInWETH: TokenAmount | undefined
  let valueOfMyStakedAmountInWETH: TokenAmount | undefined

  if (totalSupplyOfStakingToken && stakingTokenPair && stakingInfo && WETH) {
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
    valueOfMyStakedAmountInWETH = new TokenAmount(
      WETH,
      JSBI.divide(
        JSBI.multiply(
          JSBI.multiply(stakingInfo.stakedAmount.raw, stakingTokenPair.reserveOf(WETH).raw),
          JSBI.BigInt(2) // this is b/c the value of LP shares are ~double the value of the WETH they entitle owner to
        ),
        totalSupplyOfStakingToken.raw
      )
    )
  }
  // if (totalSupplyOfStakingToken && stakingTokenPair && !stakingInfo.isTokenOnly) {
  //   // take the total amount of LP tokens staked, multiply by ETH value of all LP tokens, divide by all LP tokens
  //   valueOfTotalStakedAmountInWETH = new TokenAmount(
  //     WETH,
  //     JSBI.divide(
  //       JSBI.multiply(
  //           JSBI.multiply(stakingInfo.totalStakedAmount.raw, stakingTokenPair.reserveOf(WETH).raw),
  //         JSBI.BigInt(2) // this is b/c the value of LP shares are ~double the value of the WETH they entitle owner to
  //       ),
  //       totalSupplyOfStakingToken.raw
  //     )
  //   )
  //   valueOfMyStakedAmountInWETH = new TokenAmount(
  //     WETH,
  //     JSBI.divide(
  //       JSBI.multiply(
  //         JSBI.multiply(stakingInfo.stakedAmount.raw, stakingTokenPair.reserveOf(WETH).raw),
  //         JSBI.BigInt(2) // this is b/c the value of LP shares are ~double the value of the WETH they entitle owner to
  //       ),
  //       totalSupplyOfStakingToken.raw
  //     )
  //   )
  // }
  // else if(stakingInfo.isTokenOnly) {
  //   valueOfTotalStakedAmountInWETH = new TokenAmount(
  //     token0,
  //     stakingInfo.totalStakedAmount.raw
  //   )
  //   valueOfMyStakedAmountInWETH = new TokenAmount(
  //     token0,
  //     stakingInfo.totalStakedAmount.raw
  //   )
  // }

  const countUpAmount = stakingInfo?.earnedAmount?.toFixed(4) ?? '0'
  const countUpAmountPrevious = usePrevious(countUpAmount) ?? '0'
  /**var stakedToken:any = 0;
  if(stakingInfo && stakingInfo.totalStakedAmount){
    let stakedToken09 = JSBI.toNumber(stakingInfo.totalStakedAmount.raw);
    stakedToken09 = Number(stakedToken09)/ Math.pow(10, 18);
    stakedToken = Number(stakedToken09).toFixed(5);
  }*/


  // get the USD value of staked WETH
    // const token0 = stakingInfo.tokens[0]
  const USDPrice = useUSDCPrice(WETH)
  console.log('price',USDPrice)
  // const rewardTokenPrice = useUSDCPrice(token0)
  const valueOfTotalStakedAmountInUSDC =
     valueOfTotalStakedAmountInWETH && USDPrice?.quote(valueOfTotalStakedAmountInWETH)
    //valueOfTotalStakedAmountInWETH && (stakingInfo.isTokenOnly ? rewardTokenPrice : USDPrice)?.quote(valueOfTotalStakedAmountInWETH)

  const valueOfMyStakedAmountInUSDC =
    valueOfMyStakedAmountInWETH && USDPrice?.quote(valueOfMyStakedAmountInWETH)

  const toggleWalletModal = useWalletModalToggle()

  const handleDepositClick = useCallback(() => {
    if (account) {
      setShowStakingModal(true)
    } else {
      toggleWalletModal()
    }
  }, [account, toggleWalletModal])

  return (
    <PageWrapper gap="lg" justify="center">
      <RowBetween style={{ gap: '24px' }}>
        <TYPE.mediumHeader style={{ margin: 0 }}>
          {!stakingInfo?.isTokenOnly ?
            <>
              {/* {stakingInfo?.name && stakingInfo?.name !== '' ? stakingInfo?.name : ((currencyA?.symbol ? currencyA?.symbol : '') + '-' + (currencyB?.symbol ? currencyB?.symbol : ''))} Liquidity Mining */}
            </>
            :
            <>
              {stakingInfo?.name && stakingInfo?.name !== '' ? stakingInfo?.name : ((currencyA?.symbol ? currencyA?.symbol : '') )} Liquidity Mining
            </>
          }

        </TYPE.mediumHeader>
        {!stakingInfo?.isTokenOnly ?
          // <DoubleCurrencyLogo currency0={currencyA ?? undefined} currency1={currencyB ?? undefined} size={24} />
          <></>
          :
          <DoubleCurrencyLogo currency0={currencyA ?? undefined} size={24} />
        }

      </RowBetween>

      <DataRow style={{ gap: '24px' }}>
        <PoolData>
          <AutoColumn gap="sm">
            <TYPE.body style={{ margin: 0 }}>Total deposits</TYPE.body>
            <TYPE.body fontSize={24} fontWeight={500}>
              {valueOfTotalStakedAmountInUSDC
                ? Math.ceil(parseFloat(valueOfTotalStakedAmountInUSDC.toFixed(6)) * 10000000) / 10000000 !== 0
                  ? `$${valueOfTotalStakedAmountInUSDC.toFixed(4, { groupSeparator: ',' })}`
                  : `$${valueOfTotalStakedAmountInUSDC.toFixed(0, { groupSeparator: ',' })}`
                : `$${valueOfTotalStakedAmountInWETH?.toSignificant(4, { groupSeparator: ',' }) ?? '-'}`}
            </TYPE.body>
          </AutoColumn>
        </PoolData>
        <PoolData>
          <AutoColumn gap="sm">
            <TYPE.body style={{ margin: 0 }}>Pool Rate</TYPE.body>
            <TYPE.body fontSize={24} fontWeight={500}>
              {stakingInfo?.totalRewardRate
                ?.multiply((60 * 60 * 24).toString())
                ?.toFixed(0, { groupSeparator: ',' }) ?? '-'}
              {' WELT / day'}
            </TYPE.body>
          </AutoColumn>
        </PoolData>
      </DataRow>

      {showAddLiquidityButton && (
        <VoteCard>
          <CardBGImage />
          <CardNoise />
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={600}>Step 1. Get {(stakingInfo?.name && stakingInfo?.name !== "" ? stakingInfo.name : "WELT LP")} Liquidity tokens</TYPE.white>
              </RowBetween>
              <RowBetween style={{ marginBottom: '1rem' }}>
                <TYPE.white fontSize={14}>
                  {(stakingInfo?.name && stakingInfo?.name !== "" ? stakingInfo.name : "WELT LP") + " tokens are required. Once you've added liquidity to the " + currencyA?.symbol + "-" + currencyB?.symbol + " pool you can stake your liquidity tokens on " + (stakingInfo?.lp && stakingInfo?.lp !== "" ? "the Aavegotchi page" : "this page.")}

                </TYPE.white>
              </RowBetween>
              <ButtonPrimary
                padding="8px"
                borderRadius="8px"
                width={'fit-content'}
                as={Link}
                to={`/add/${currencyA && currencyId(currencyA)}/${currencyB && currencyId(currencyB)}`}
              >
                {`Add ${currencyA?.symbol}-${currencyB?.symbol} liquidity`}
              </ButtonPrimary>
            </AutoColumn>
          </CardSection>
          <CardBGImage />
          <CardNoise />
        </VoteCard>
      )}

      {stakingInfo && (
        <>
          <StakingModal
            isOpen={showStakingModal}
            onDismiss={() => setShowStakingModal(false)}
            stakingInfo={stakingInfo}
            userLiquidityUnstaked={userLiquidityUnstaked}
          />
          <UnstakingModal
            isOpen={showUnstakingModal}
            onDismiss={() => setShowUnstakingModal(false)}
            stakingInfo={stakingInfo}
          />
          <ClaimRewardModal
            isOpen={showClaimRewardModal}
            onDismiss={() => setShowClaimRewardModal(false)}
            stakingInfo={stakingInfo}
          />
        </>
      )}

      <PositionInfo gap="lg" justify="center" dim={showAddLiquidityButton}>
        <BottomSection gap="lg" justify="center">
          <StyledDataCard disabled={disableTop} bgColor={backgroundColor} showBackground={!showAddLiquidityButton}>
            <CardSection>
              <CardBGImage desaturate />
              <CardNoise />
              <AutoColumn gap="md">
                <RowBetween>
                  <TYPE.white fontWeight={600}>Your liquidity deposits</TYPE.white>
                </RowBetween>
                <RowBetween style={{ alignItems: 'baseline' }}>
                  <TYPE.white fontSize={36} fontWeight={600}>
                    {valueOfMyStakedAmountInUSDC
                      ? `$${valueOfMyStakedAmountInUSDC.toFixed(0, { groupSeparator: ',' })}`
                      : `$${valueOfMyStakedAmountInWETH?.toSignificant(4, { groupSeparator: ',' }) ?? ' - '}`}
                  </TYPE.white>
                  <TYPE.white>
                    {!stakingInfo?.isTokenOnly ?
                      <>
                        {/* {stakingInfo?.name && stakingInfo?.name && stakingInfo.name !== '' ? stakingInfo.name : 'WELT LP ' + ((currencyA?.symbol !== undefined ? currencyA?.symbol : '') + '-' + (currencyB?.symbol !== undefined ? currencyB?.symbol : ''))} */}

                      </>
                      :
                      <>
                        {stakingInfo?.name && stakingInfo?.name && stakingInfo.name !== '' ? stakingInfo.name : '' + ((currencyA?.symbol !== undefined ? currencyA?.symbol : ''))}

                      </>
                    }
                  </TYPE.white>
                </RowBetween>
              </AutoColumn>
            </CardSection>
          </StyledDataCard>
          <StyledBottomCard dim={stakingInfo?.stakedAmount?.equalTo(JSBI.BigInt(0))}>

            {stakingInfo?.name !== 'vault' ?
              <>
                <CardBGImage desaturate />
                <CardNoise />
                <AutoColumn gap="sm">
                  <RowBetween>
                    <div>
                      <TYPE.black>Your unclaimed WELT</TYPE.black>
                      <TYPE.black>(1% Claim Fee)</TYPE.black>
                    </div>
                    {stakingInfo?.earnedAmount && JSBI.notEqual(BIG_INT_ZERO, stakingInfo?.earnedAmount?.raw) && (
                      <ButtonEmpty
                        padding="8px"
                        borderRadius="8px"
                        width="fit-content"
                        onClick={() => setShowClaimRewardModal(true)}
                      >
                        Claim
                      </ButtonEmpty>
                    )}
                  </RowBetween>
                  <RowBetween style={{ alignItems: 'baseline' }}>
                    <TYPE.largeHeader fontSize={36} fontWeight={600}>
                      <CountUp
                        key={countUpAmount}
                        isCounting
                        decimalPlaces={4}
                        start={parseFloat(countUpAmountPrevious)}
                        end={parseFloat(countUpAmount)}
                        thousandsSeparator={','}
                        duration={1}
                      />
                    </TYPE.largeHeader>
                    {!stakingInfo?.ended &&
                      <TYPE.black fontSize={16} fontWeight={500}>
                        <span role="img" aria-label="wizard-icon" style={{ marginRight: '8px ' }}>
                          ⚡
                        </span>
                        {stakingInfo?.rewardRate
                          ?.multiply((60 * 60 * 24).toString())
                          ?.toSignificant(4, { groupSeparator: ',' }) ?? '-'}
                        {' WELT / day'}
                      </TYPE.black>
                    }
                  </RowBetween>
                </AutoColumn>
              </>
              :
              <>

              </>
            }
          </StyledBottomCard>
        </BottomSection>
        <TYPE.main style={{ textAlign: 'center' }} fontSize={14}>
          <span role="img" aria-label="wizard-icon" style={{ marginRight: '8px' }}>
            ⭐️
          </span>
          When you withdraw, the contract will automatically claim WELT on your behalf!
        </TYPE.main>

        {!showAddLiquidityButton && (
          <DataRow style={{ marginBottom: '1rem' }}>
            { !stakingInfo?.ended &&
              <ButtonPrimary padding="8px" borderRadius="8px" width="160px" onClick={handleDepositClick}>
                  {stakingInfo?.stakedAmount?.greaterThan(JSBI.BigInt(0)) ? 'Deposit' : stakingInfo && stakingInfo?.name !== '' ? 'Deposit ' + stakingInfo?.name + " Tokens" : 'Deposit WELT Token'}
              </ButtonPrimary>
            }

            {stakingInfo?.stakedAmount?.greaterThan(JSBI.BigInt(0)) && (
              <>
                <ButtonPrimary
                  padding="8px"
                  borderRadius="8px"
                  width="160px"
                  onClick={() => setShowUnstakingModal(true)}
                >
                  Withdraw
                </ButtonPrimary>
              </>
            )}
          </DataRow>
        )}
        {!userLiquidityUnstaked ? null : userLiquidityUnstaked.equalTo('0') ? null : (
          <TYPE.main>{userLiquidityUnstaked.toSignificant(6)} {stakingInfo?.name !== '' ? stakingInfo?.name : 'WELT LP'} tokens available</TYPE.main>
        )}
      </PositionInfo>
    </PageWrapper>
  )
}
