import { ChainId, CurrencyAmount, JSBI, Token, TokenAmount, Pair } from '@uniswap/sdk'
import { useMemo } from 'react'
import {
  UNI,
  WELT,
  USDC
} from '../../constants'
import { STAKING_REWARDS_INTERFACE, VAULT_INTERFACE } from '../../constants/abis/staking-rewards'
import { useActiveWeb3React } from '../../hooks'
import { NEVER_RELOAD, useMultipleContractSingleData } from '../multicall/hooks'
import { tryParseAmount } from '../swap/hooks'

export const STAKING_GENESIS = 1614531600;

export const REWARDS_DURATION_DAYS = 7;

// TODO add staking rewards addresses here
export const STAKING_REWARDS_INFO: {
  [chainId in ChainId]?: {
    tokens: [Token, Token]
    stakingRewardAddress: string
    ended: boolean
    name: string
    lp: string
    baseToken: [Token]
    isTokenOnly?: boolean
    isNftToken?: boolean
  }[]
} = {//Bluesky
  [ChainId.BSC]: [//TODO: MATIC

    // {
    //   tokens: [WELT, WMATIC],
    //   stakingRewardAddress: '0x44A8E1e56F5c56f601F55c1B5AFEcC7BeB3A8392',  //0x0BA25dFFB326e89E83fDbc1995C1a12E7F929D6f
    //   ended: false,

    //   name: 'WELT-MATIC',
    //   lp: '0xe273d3925f6dc6ffedf7aa082594653376a2d38d',
    //   baseToken: [WMATIC]
    //   //STAKINGREWARDSFACTORY- 0x5D490e48417Dd2F6165CEB3b2c04352675278998
    // },

// //    {
// //      tokens: [WELT, USDC],
// //      stakingRewardAddress: '0x57E9ab6c5126895FDb5ED6d6A593369559251cdA',  //0x0BA25dFFB326e89E83fDbc1995C1a12E7F929D6f
// //      ended: false,
//
//       name: 'WELT-USDC',
//       lp: '0xf1686f87d4c7bc935651f694492edb87f208a6be',
//       baseToken: [USDC]
//       //STAKINGREWARDSFACTORY- 0x5D490e48417Dd2F6165CEB3b2c04352675278998
//     },

    // {
    //   tokens: [WELT, WMATIC],
    //   stakingRewardAddress: '0xBD445F98736389F6Df6fCEfAb92c29272B17bF35',  //0x0BA25dFFB326e89E83fDbc1995C1a12E7F929D6f
    //   ended: false,

    //   name: 'WELT-DAI',
    //   lp: '0xaac32d2ac5647776c4896da319697d0b6e6012c0',
    //   baseToken: [DAI]
    //   //STAKINGREWARDSFACTORY- 0x5D490e48417Dd2F6165CEB3b2c04352675278998
    // },
    // {
    //   tokens: [WELT, WMATIC],
    //   stakingRewardAddress: '0x5269a75C942A5aC7556FF20dBc96D2257bD08C2D',  //0x0BA25dFFB326e89E83fDbc1995C1a12E7F929D6f
    //   ended: false,

    //   name: 'WELT-ETHER',
    //   lp: '0x61bdfa009a7b3ab35dea70320e01b6352a88068d',
    //   baseToken: [ETHER]
    //   //STAKINGREWARDSFACTORY- 0x5D490e48417Dd2F6165CEB3b2c04352675278998
    // },
    // {
    //   tokens: [WELT, WMATIC],
    //   stakingRewardAddress: '0xF3F5Ba5d084B01A1319Df033408EEf827FDD7802',  //0x0BA25dFFB326e89E83fDbc1995C1a12E7F929D6f
    //   ended: false,

    //   name: 'WELT-AVAX',
    //   lp: '0x4298ea463296752de37735581ab114de280eefe3',
    //   baseToken: [AVAX]
    //   //STAKINGREWARDSFACTORY- 0x5D490e48417Dd2F6165CEB3b2c04352675278998
    // },
    // {
    //   tokens: [WELT, WMATIC],
    //   stakingRewardAddress: '0x90f791F7f1CeE13B0F29234ff9F4C0b7F429A310',  //0x0BA25dFFB326e89E83fDbc1995C1a12E7F929D6f
    //   ended: false,

    //   name: 'WELT-FTM',
    //   lp: '0x5b9bba5ec49b67bae2f65df814b779fc108d4cb4',
    //   baseToken: [FTM]
    //   //STAKINGREWARDSFACTORY- 0x5D490e48417Dd2F6165CEB3b2c04352675278998
    // },



/////////////////////

    {
      tokens: [WELT, USDC],
      stakingRewardAddress: '0x4eCcD82879Be9C1B1cE874C6E9850561E732C2F8',
      ended: false,
      isTokenOnly:true,

      name: 'WELT',
      lp: '0x4eCcD82879Be9C1B1cE874C6E9850561E732C2F8',
      baseToken: [WELT]
      //STAKINGREWARDSFACTORY- 0x5D490e48417Dd2F6165CEB3b2c04352675278998
    },
    {
      tokens: [WELT, USDC],
      stakingRewardAddress: '0x92A9d2054dc8cBc915498912E9cE724EfDe20A65',
      ended: true,
      isTokenOnly:true,

      name: 'vault',
      lp: '0x1785113910847770290f5f840b4c74fc46451201',
      baseToken: [WELT]
      //STAKINGREWARDSFACTORY- 0x5D490e48417Dd2F6165CEB3b2c04352675278998
    },
 ////////////////////////////
    // NFT test
    // {
    //   tokens: [SPYRIT, WMATIC],
    //   stakingRewardAddress: '0x60795Bc5B04c340208a1eAf14fED50957c208661',
    //   ended: false,
    //   isNftToken :true,

    //   name: 'NFT(SPYRIT)',
    //   lp: '0x35dB0dfb42Dfe164A3e4d39F91459878D564fa5B',
    //   baseToken: SPYRIT
    //   //STAKINGREWARDSFACTORY- 0x5D490e48417Dd2F6165CEB3b2c04352675278998
    // },
    // {
    //   tokens: [WMATIC, SPYRIT],
    //   stakingRewardAddress: '0x60795Bc5B04c340208a1eAf14fED50957c208661',
    //   ended: false,
    //   isNftToken :true,

    //   name: 'NFT(MATIC)',
    //   lp: '0x0000000000000000000000000000000000001010',
    //   baseToken: SPYRIT
    //   //STAKINGREWARDSFACTORY- 0x5D490e48417Dd2F6165CEB3b2c04352675278998
    // },

    // {
    //   tokens: [$L1, USDC],
    //   stakingRewardAddress: '0x91BDD1979889D86c8882dD8eb4e45A42d82e02b8',
    //   ended: false,

    //   name: '',
    //   lp: '',
    //   baseToken: USDC
    //   //STAKINGREWARDSFACTORY- 0x5D490e48417Dd2F6165CEB3b2c04352675278998
    // },

    // {
    //   tokens: [SPYRIT, WMATIC],
    //   stakingRewardAddress: '0x91BDD1979889D86c8882dD8eb4e45A42d82e02b8',
    //   ended: false,

    //   name: '',
    //   lp: '',
    //   baseToken: WMATIC
    //   //STAKINGREWARDSFACTORY- 0x5D490e48417Dd2F6165CEB3b2c04352675278998
    // },

    // {
    //   tokens: [LT, USDC],
    //   stakingRewardAddress: '0x7A318B03E6a319Ae17200e5ebF98Ef9D3c72DD94',
    //   ended: false,

    //   name: 'LT-USDC',
    //   lp: '0xe649Adb69E3631BA6359903feFe369fF418CaC7f',
    //   baseToken: USDC
    //   //STAKINGREWARDSFACTORY- 0x5D490e48417Dd2F6165CEB3b2c04352675278998
    // },

    // {
    //   tokens: [WMATIC, USDC],
    //   stakingRewardAddress: '0x2D79Ed676da698FC74162A5f522b73053fE9C9c3',
    //   ended: false,

    //   name: 'WMATIC-USDC',
    //   lp: '0x6e7a5FAFcec6BB1e78bAE2A1F0B612012BF14827',
    //   baseToken: WMATIC
    //   //STAKINGREWARDSFACTORY- 0x5D490e48417Dd2F6165CEB3b2c04352675278998
    // },
  ]
}

export interface StakingInfo {
  // the address of the reward contract
  stakingRewardAddress: string
  // the tokens involved in this pair
  tokens: [Token, Token]
  // the amount of token currently staked, or undefined if no account
  stakedAmount: TokenAmount
  // the amount of reward token earned by the active account, or undefined if no account
  earnedAmount: TokenAmount
  // the total amount of token staked in the contract
  totalStakedAmount: TokenAmount
  // the amount of token distributed per second to all LPs, constant
  totalRewardRate: TokenAmount
  // the current amount of token distributed to the active account per second.
  // equivalent to percent of total supply * reward rate
  rewardRate: TokenAmount
  // when the period ends
  periodFinish: Date | undefined

  baseToken : [Token]

  ended: boolean

  name: string

  lp: string
  isTokenOnly?: boolean

  isNftToken ?:boolean
  harvestCallFee?: any
  // calculates a hypothetical amount of token distributed to the active account per second.
  getHypotheticalRewardRate: (
    stakedAmount: TokenAmount,
    totalStakedAmount: TokenAmount,
    totalRewardRate: TokenAmount
  ) => TokenAmount
}

// gets the staking info from the network for the active chain id
export function useStakingInfo(pairToFilterBy?: Pair | null): StakingInfo[] {
  const { chainId, account } = useActiveWeb3React()


  const info = useMemo(
    () =>
      chainId
        ? STAKING_REWARDS_INFO[chainId]?.filter(stakingRewardInfo =>
          pairToFilterBy === undefined
            ? true
            : pairToFilterBy === null
              ? false
              : pairToFilterBy.involvesToken(stakingRewardInfo.tokens[0]) &&
              pairToFilterBy.involvesToken(stakingRewardInfo.tokens[1])
        ) ?? []
        : [],
    [chainId, pairToFilterBy]
  )


  const uni = chainId ? UNI[chainId] : undefined

  const rewardsAddresses = useMemo(() => info.map(({ stakingRewardAddress }) => stakingRewardAddress), [info])

  const vaultAddresses = useMemo(() => info.filter((e) => e.name === 'vault').map(({ stakingRewardAddress }) => stakingRewardAddress), [info])

  const accountArg = useMemo(() => [account ?? undefined], [account])

  // get all the info from the staking rewards contracts
  const balances = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE, 'balanceOf', accountArg)
  const earnedAmounts = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE, 'earned', accountArg)
  const totalSupplies = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE, 'totalSupply')

  // console.log('debug->chain', chainId, account,pairToFilterBy,rewardsAddresses,balances, earnedAmounts,totalSupplies)

  // tokens per second, constants
  const rewardRates = useMultipleContractSingleData(
    rewardsAddresses,
    STAKING_REWARDS_INTERFACE,
    'rewardRate',
    undefined,
    NEVER_RELOAD
  )
  const periodFinishes = useMultipleContractSingleData(
    rewardsAddresses,
    STAKING_REWARDS_INTERFACE,
    'periodFinish',
    undefined,
    NEVER_RELOAD
  )

  const harvestCallFee = useMultipleContractSingleData(vaultAddresses, VAULT_INTERFACE, 'calculateHarvestWeltRewards')
  return useMemo(() => {
    if (!chainId || !uni) return []

    return rewardsAddresses.reduce<StakingInfo[]>((memo, rewardsAddress, index) => {
      // these two are dependent on account
      const balanceState = balances[index]
      const earnedAmountState = earnedAmounts[index]

      // these get fetched regardless of account
      const totalSupplyState = totalSupplies[index]
      const rewardRateState = rewardRates[index]
      const periodFinishState = periodFinishes[index]

      const harvestCallFeeState = harvestCallFee[0]

      if (
        // these may be undefined if not logged in
        !balanceState?.loading &&
        !earnedAmountState?.loading &&
        // always need these
        totalSupplyState &&
        !totalSupplyState.loading &&
        rewardRateState &&
        !rewardRateState.loading &&
        periodFinishState &&
        !periodFinishState.loading &&
        harvestCallFeeState &&
        !harvestCallFeeState.loading
      ) {
        if (
          balanceState?.error ||
          earnedAmountState?.error ||
          totalSupplyState.error ||
          rewardRateState.error ||
          periodFinishState.error
        ) {
          console.log("addy", balanceState?.error,
            earnedAmountState?.error,
            totalSupplyState.error,
            rewardRateState.error,
            periodFinishState.error)
          console.error('Failed to load staking rewards info')
          return memo
        }


        // check for account, if no account set to 0
        const lp = info[index].lp;

        const tokens = info[index].tokens
        const dummyPair = new Pair(new TokenAmount(tokens[0], '0'), new TokenAmount(tokens[1], '0'))


        const stakedAmount = new TokenAmount(
        lp && lp !== '' ?
        info[index].isTokenOnly ?
        info[index].tokens[0]
        : new Token(56, lp, 18, "SLP", "Staked LP")
        : dummyPair.liquidityToken, JSBI.BigInt(balanceState?.result?.[0] ?? 0))
        const totalStakedAmount = new TokenAmount(lp && lp !== '' ? info[index].isTokenOnly ? info[index].tokens[0] : new Token(56, lp, 18, "SLP", "Staked LP") : dummyPair.liquidityToken, JSBI.BigInt(totalSupplyState.result?.[0]))

        const totalRewardRate = new TokenAmount(uni, JSBI.BigInt(rewardRateState.result?.[0]))

        const getHypotheticalRewardRate = (
          stakedAmount: TokenAmount,
          totalStakedAmount: TokenAmount,
          totalRewardRate: TokenAmount
        ): TokenAmount => {
          return new TokenAmount(
            uni,
            JSBI.greaterThan(totalStakedAmount.raw, JSBI.BigInt(0))
              ? JSBI.divide(JSBI.multiply(totalRewardRate.raw, stakedAmount.raw), totalStakedAmount.raw)
              : JSBI.BigInt(0)
          )
        }

        const individualRewardRate = getHypotheticalRewardRate(stakedAmount, totalStakedAmount, totalRewardRate)

        const periodFinishMs = periodFinishState.result?.[0]?.mul(1000)?.toNumber()

        memo.push({
          stakingRewardAddress: rewardsAddress,
          tokens: info[index].tokens,
          ended: info[index].ended,
          name: info[index].name,
          lp: info[index].lp,
          periodFinish: periodFinishMs > 0 ? new Date(periodFinishMs) : undefined,
          earnedAmount: new TokenAmount(uni, JSBI.BigInt(earnedAmountState?.result?.[0] ?? 0)),
          rewardRate: individualRewardRate,
          totalRewardRate: totalRewardRate,
          stakedAmount: stakedAmount,
          totalStakedAmount: totalStakedAmount,
          isTokenOnly: info[index].isTokenOnly,
          isNftToken: info[index].isNftToken,
          harvestCallFee: harvestCallFeeState?.result?.[0],
          baseToken : info[index].baseToken,
          getHypotheticalRewardRate
        })
      }
      console.log("=====>memo",memo)
      return memo
    }, [])
  }, [balances, chainId, earnedAmounts, info,  periodFinishes, rewardRates, rewardsAddresses, totalSupplies, uni])
}

export function useTotalUniEarned(): TokenAmount | undefined {
  const { chainId } = useActiveWeb3React()
  const uni = chainId ? UNI[chainId] : undefined
  const stakingInfos = useStakingInfo()

  return useMemo(() => {
    if (!uni) return undefined
    return (
      stakingInfos?.reduce(
        (accumulator, stakingInfo) => accumulator.add(stakingInfo.earnedAmount),
        new TokenAmount(uni, '0')
      ) ?? new TokenAmount(uni, '0')
    )
  }, [stakingInfos, uni])
}

// based on typed value
export function useDerivedStakeInfo(
  typedValue: string,
  stakingToken: Token,
  userLiquidityUnstaked: TokenAmount | undefined
): {
  parsedAmount?: CurrencyAmount
  error?: string
} {
  const { account } = useActiveWeb3React()

  const parsedInput: CurrencyAmount | undefined = tryParseAmount(typedValue, stakingToken)

  const parsedAmount =
    parsedInput && userLiquidityUnstaked && JSBI.lessThanOrEqual(parsedInput.raw, userLiquidityUnstaked.raw)
      ? parsedInput
      : undefined

  let error: string | undefined
  if (!account) {
    error = 'Connect Wallet'
  }
  if (!parsedAmount) {
    error = error ?? 'Enter an amount'
  }

  return {
    parsedAmount,
    error
  }
}

// based on typed value
export function useDerivedUnstakeInfo(
  typedValue: string,
  stakingAmount: TokenAmount
): {
  parsedAmount?: CurrencyAmount
  error?: string
} {
  const { account } = useActiveWeb3React()

  const parsedInput: CurrencyAmount | undefined = tryParseAmount(typedValue, stakingAmount.token)

  const parsedAmount = parsedInput && JSBI.lessThanOrEqual(parsedInput.raw, stakingAmount.raw) ? parsedInput : undefined

  let error: string | undefined
  if (!account) {
    error = 'Connect Wallet'
  }
  if (!parsedAmount) {
    error = error ?? 'Enter an amount'
  }

  return {
    parsedAmount,
    error
  }
}
