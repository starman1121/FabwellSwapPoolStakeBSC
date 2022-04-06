import { BigNumber } from '@ethersproject/bignumber'
import { usePairContract } from '../hooks/useContract'
import { useSingleCallResult } from '../state/multicall/hooks'

export function GetRewardTokenPrice(): number | undefined {
  const contract = usePairContract('0xA89A1d1C5D653219B770a800Fc38C597EF22Cd2B', false)
  const reserve  = useSingleCallResult(contract, 'getReserves')?.result
  
  if(reserve !== undefined) {
    // USDC, Decimal = 6
    const reserve0 : BigNumber = reserve?.[0]
    // SPYRIT, Decimal = 18
    const reserve1 : BigNumber = reserve?.[1]
    // useSingleCallResult(contract, 'getReserves')?.result?.[1]
    const decimalRate : BigNumber = BigNumber.from (1000000000)
    const liquidPrice : BigNumber = reserve1.div(reserve0).div(decimalRate)
    return liquidPrice.toNumber() 
  } else {
    return undefined
  }

}