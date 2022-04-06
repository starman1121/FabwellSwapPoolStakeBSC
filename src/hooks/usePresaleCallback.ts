import { useMemo } from 'react'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useActiveWeb3React } from './index'
import { usePresaleContract } from './useContract'
export enum SwapCallbackState {
  INVALID,
  LOADING,
  VALID
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function usePresaleCallback(
    parsedAmount: string | undefined
): { state: SwapCallbackState; callback: null | (() => Promise<string>); error: string | null } {
  const { account, chainId, library } = useActiveWeb3React()

  const addTransaction = useTransactionAdder()

  const presaleContract = usePresaleContract('0xf6d28A051AA6E7BCDe0fE4D7E8D332Ef058A4B57')
  const rate = presaleContract?.rate({})
  if(presaleContract)
  console.log('presalec',rate)
  return useMemo(() => {
    if (!library || !account || !chainId) {
      return { state: SwapCallbackState.INVALID, callback: null, error: 'Missing dependencies' }
    }

    return {
      state: SwapCallbackState.VALID,
      callback: async function onSwap() {
        if(presaleContract)
            return presaleContract.buytokens({ value: parsedAmount ?? 0, gasLimit: 300000 })
            .then((response : any) => {
                addTransaction(response, {summary: 'baught WELT token'})
            })
        else
            return null
      },
      error: null
    }

  }, [library, account, chainId, parsedAmount,addTransaction])
}
