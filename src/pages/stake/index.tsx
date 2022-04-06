import React from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { STAKING_REWARDS_INFO, useStakingInfo } from '../../state/stake/hooks'
import { TYPE, ExternalLink } from '../../theme'
import PoolCard from '../../components/earn/PoolCard'

import { RowBetween } from '../../components/Row'
import { CardSection, DataCard, CardNoise, CardBGImage } from '../../components/earn/styled'
import { Countdown } from '../Earn/Countdown'
import Loader from '../../components/Loader'
import { useActiveWeb3React } from '../../hooks'
// import { JSBI } from '@uniswap/sdk'
// import { BIG_INT_ZERO } from '../../constants'
//import { OutlineCard } from '../../components/Card'
//import { ButtonPrimary } from 'components/Button'
//import { useHarvestContract } from '../../hooks/useContract'


const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const TopSection = styled(AutoColumn)`
  max-width: 720px;
  width: 100%;
`
// const PoolData = styled(DataCard)`
//   background: none;
//   border: 1px solid ${({ theme }) => theme.bg4};
//   padding: 1rem;
//   z-index: 1;
// `

const PoolSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  column-gap: 10px;
  row-gap: 15px;
  width: 100%;
  justify-self: center;
`

const DataRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
flex-direction: column;
`};
`

export default function Earn() {
    const { chainId } = useActiveWeb3React()
    // console.log("chainid", chainId);
    // staking info for connected account
    const stakingInfos = useStakingInfo()
    /**
     * only show staking cards with balance
     * @todo only account for this if rewards are inactive
     */
    // const stakingInfosWithBalance = stakingInfos?.filter(s => JSBI.greaterThan(s.stakedAmount.raw, BIG_INT_ZERO))


    // toggle copy if rewards are inactive
    const stakingRewardsExist = Boolean(typeof chainId === 'number' && (STAKING_REWARDS_INFO[chainId]?.length ?? 0) > 0)
    //const harvestContract = useHarvestContract(`0x1E371a553A566f6A4F7da9af34575eF2f4975318`)
    // console.log('harvest',harvestContract)
    // async function onHarvest() {
    //     if (harvestContract)
    //         await harvestContract.harvest({ gasLimit: 500000 })
    // }
    return (
        <PageWrapper justify="center">
            <TopSection gap="md" justify="center">
                {/* <PoolData style={{ width: '55%', float: 'right' }}>
                    <TYPE.body style={{ margin: 0, }}>Auto spyrit Bounty</TYPE.body>
                    {
                      stakingInfos[0]?.harvestCallFee?.toNumber() / 10 ** 5 === 0 || stakingInfos[0]?.harvestCallFee?.toNumber() === undefined ? (
                        <>
                            <br />
                            <TYPE.body fontSize={22} fontWeight={300} >
                                <TYPE.small fontSize={20} fontWeight={300} width="30%" style={{ float: 'left' }} >0</TYPE.small>
                                SPYRIT
                                <ButtonPrimary fontSize={14} padding="8px" style={{ float: 'right', margin: '5px' }} height='30px' width="90px" borderRadius="8px" disabled>
                                    {'Claim'}
                                </ButtonPrimary>
                            </TYPE.body>
     
                        </>
                    ) :
                        <>
                            <br />
                            <TYPE.body fontSize={22} fontWeight={300} >
                                <TYPE.small fontSize={20} fontWeight={300} width="30%" style={{ float: 'left' }} >{stakingInfos[0]?.harvestCallFee?.toNumber() / 10 ** 5}</TYPE.small>
                                SPYRIT
                                <ButtonPrimary fontSize={14} padding="8px" style={{ float: 'right', margin: '5px' }} height='30px' width="90px" onClick={onHarvest} borderRadius="8px">
                                    {'Claim'}
                                </ButtonPrimary>
                            </TYPE.body>
                        </>
                    }
                </PoolData> */}
                <DataCard>
                    <CardBGImage />
                    <CardNoise />

                    <CardSection>
                        <AutoColumn gap="md">
                            <RowBetween>
                                <TYPE.white fontWeight={600}>Staking</TYPE.white>
                            </RowBetween>
                            <RowBetween>
                                <TYPE.white fontSize={14}>
                                    Deposit your WELT tokens to receive WELT.
                                </TYPE.white>
                            </RowBetween>{' '}
                            <ExternalLink
                                style={{ color: 'white', textDecoration: 'underline' }}
                                href=""
                                target="_blank"
                            >
                                {/* <TYPE.white fontSize={14}>Coming Soon</TYPE.white> */}
                            </ExternalLink>
                        </AutoColumn>
                    </CardSection>
                    <CardBGImage />
                    <CardNoise />
                </DataCard>
            </TopSection>

            <AutoColumn gap="lg" style={{ width: '100%', maxWidth: '720px' }}>
                <DataRow style={{ alignItems: 'baseline' }}>
                    <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>Participating Pools</TYPE.mediumHeader>
                    <Countdown exactEnd={stakingInfos?.[0]?.periodFinish} />
                </DataRow>
                {/* // working section staking */}
                <PoolSection>
                    {stakingRewardsExist && stakingInfos?.length === 0 ? (
                        <Loader style={{ margin: 'auto' }} />
                    ) : !stakingRewardsExist ? (
                        'No active rewards'
                    ) : (
                        stakingInfos?.map(stakingInfo => {
                            // need to sort by added liquidity here
                            return (stakingInfo.isTokenOnly ? <PoolCard key={stakingInfo.stakingRewardAddress} stakingInfo={stakingInfo} />
                                : <></>)
                        })
                    )}
                </PoolSection>
                {/* till here akash */}
            </AutoColumn>
        </PageWrapper>
    )
}
