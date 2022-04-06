
import { BigNumber } from 'ethers'
import { useSingleCallResult } from '../state/multicall/hooks'
import { useL1PoolContract } from './useContract'

// gets the current ratio from the L1 Pool contract, ratio = L1/USDC
export default function useL1PoolGetRatio(): BigNumber {
  const contract = useL1PoolContract(false)
  
  const ratio : BigNumber = useSingleCallResult(contract as any, 'ratio').result?.[0]
  
  return ratio
}

export function useL1PoolGetReseveBalance(): BigNumber | undefined {
  const contract = useL1PoolContract(false)

  const reserveBalance = useSingleCallResult(contract, 'getReseveBalance')?.result?.[0]
  
  return reserveBalance
}

// gets the SpyritCoin Holder ratio from the L1 Pool contract, ratio = L1/USDC
export function useL1PoolIsHolder(address?: string | undefined): Boolean {
  const contract = useL1PoolContract(false)

  const isHolder = useSingleCallResult(contract, 'isHolder', [address])?.result?.[0]
  
  return isHolder
}

export function useL1PoolMintPaused(): Boolean {
  const contract = useL1PoolContract(false)

  const mintPaused = useSingleCallResult(contract, 'mintPause')?.result?.[0]

  return mintPaused
}

export function useL1PoolMintingFee(): BigNumber {
  const contract = useL1PoolContract(false)

  const mintFee = useSingleCallResult(contract, 'mintingFee')?.result?.[0]

  return mintFee
}

export function useL1PoolRedeemPaused(): Boolean {
  const contract = useL1PoolContract(false)

  const redeemPaused = useSingleCallResult(contract, 'redeemPaused')?.result?.[0]

  return redeemPaused
}

export function useL1PoolRedemptionFee(): BigNumber {
  const contract = useL1PoolContract(false)

  const redemptionFee = useSingleCallResult(contract, 'redemptionFee')?.result?.[0]

  return redemptionFee
}
