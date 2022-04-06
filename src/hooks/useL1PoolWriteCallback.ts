import { MaxUint256 } from '@ethersproject/constants'
import { useCallback } from 'react'
import { calculateGasMargin } from '../utils'
import { useL1PoolContract } from './useContract'
import { useActiveWeb3React } from './index'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'utils/bigNumber'


// This config is required for number formatting
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})


export function useSetFeeCallback(
  mintingFee?: number,
  redemptionFee?: number
): [() => Promise<void>] {
  const { account } = useActiveWeb3React()
  const l1PoolContract = useL1PoolContract(true)

  const setFee = useCallback(async (): Promise<void> => {

    if (!l1PoolContract) {
      console.error('l1PoolContract is null')
      return
    }

    if(account !== '0x5c35Ae532E9276aec5F8657aeC477585e411802a') {
      console.log('account is not owner')
      return
    }

    if (!mintingFee) {
      console.error('no mintingFee')
      return
    }

    if (!redemptionFee) {
      console.error('no redemptionFee')
      return
    }

    const estimatedGas = await l1PoolContract.estimateGas.setFee(MaxUint256, MaxUint256).catch(() => {
      // general fallback for tokens who restrict approval amounts
      return l1PoolContract.estimateGas.setFee(mintingFee, redemptionFee)
    })

    return l1PoolContract
      .setFee(mintingFee, redemptionFee, {
        gasLimit: calculateGasMargin(estimatedGas),
        gasPrice: 5000000000
      })
      .catch((error: Error) => {
        console.debug('Failed to set Fee', error)
        throw error
      })
  }, [l1PoolContract, ])

  return [setFee]
}

export function useMintCallback(
  _mintAmount?: number
): [() => Promise<void>] {
  const l1PoolContract = useL1PoolContract(true)
  
  const setMint = useCallback(async (): Promise<void> => {

    if (!l1PoolContract) {
      console.error('l1PoolContract is null')
      return
    }
    
    if (!_mintAmount) {
      console.error('no mintAmount', _mintAmount)
      return
    }

    const estimatedGas = await l1PoolContract.estimateGas.mint(_mintAmount, false).catch(() => {
      // general fallback for tokens who restrict approval amounts
      return l1PoolContract.estimateGas.mint(_mintAmount, false)
    })

    return l1PoolContract
      .mint(_mintAmount, false, {
        gasLimit: calculateGasMargin(estimatedGas),
        gasPrice: 5000000000
      })
      .catch((error: Error) => {
        console.debug('Failed to set Fee', error)
        throw error
      })
  }, [l1PoolContract, _mintAmount])

  return [setMint]
}

export function useRedeemCallback(
  _redeemAmount?: BigNumber
): [() => Promise<void>] {
  const l1PoolContract = useL1PoolContract(true)

  const setRedeem = useCallback(async (): Promise<void> => {
    
    if (!l1PoolContract) {
      console.error('l1PoolContract is null')
      return
    }

    if (!_redeemAmount) {
      console.error('no redeemAmount', _redeemAmount)
      return
    }
    
    // const redeemAmount = new BigNumber(_redeemAmount).times(BIG_TEN.pow(18))
    const redeemAmount = new BigNumber(_redeemAmount).multipliedBy(BIG_TEN.pow(18))
    // console.log("debug redeem amount after", redeemAmount, typeof(redeemAmount))

    const estimatedGas = await l1PoolContract.estimateGas.redeem(redeemAmount.toString()).catch(() => {
      // general fallback for tokens who restrict approval amounts
      return l1PoolContract.estimateGas.redeem(redeemAmount.toString())
    })

    return l1PoolContract
      .redeem(redeemAmount.toString(), {
        gasLimit: calculateGasMargin(estimatedGas),
        gasPrice: 5000000000
      })
      .catch((error: Error) => {
        console.debug('Failed to set Fee', error)
        throw error
      })
  }, [l1PoolContract, _redeemAmount])

  return [setRedeem]
}