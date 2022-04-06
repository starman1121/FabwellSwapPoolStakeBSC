import React, { useState, useCallback } from 'react'
import useIsArgentWallet from '../../hooks/useIsArgentWallet'
import useTransactionDeadline from '../../hooks/useTransactionDeadline'
import Modal from '../Modal'
import { AutoColumn } from '../Column'
import styled from 'styled-components'
import { RowBetween } from '../Row'
import { TYPE, CloseIcon } from '../../theme'
import { ButtonConfirmed, ButtonError } from '../Button'
import ProgressCircles from '../ProgressSteps'
import CurrencyInputPanel from '../CurrencyInputPanel'
import { TokenAmount, Pair } from '@uniswap/sdk'
import { useActiveWeb3React } from '../../hooks'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { usePairContract, useStakingContract } from '../../hooks/useContract'
import { useApproveCallback, ApprovalState } from '../../hooks/useApproveCallback'
import { splitSignature } from 'ethers/lib/utils'
import { StakingInfo, useDerivedStakeInfo } from '../../state/stake/hooks'
import { wrappedCurrencyAmount } from '../../utils/wrappedCurrency'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { LoadingView, SubmittedView } from '../ModalViews'




const HypotheticalRewardRate = styled.div<{ dim: boolean }>`
  display: flex;
  justify-content: space-between;
  padding-right: 20px;
  padding-left: 20px;

  opacity: ${({ dim }) => (dim ? 0.5 : 1)};
`

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 1rem;
`


interface StakingModalProps {
  isOpen: boolean
  onDismiss: () => void
  stakingInfo: StakingInfo
  userLiquidityUnstaked: TokenAmount | undefined
}


export default function StakingModal({ isOpen, onDismiss, stakingInfo, userLiquidityUnstaked }: StakingModalProps) {
  const { account, chainId, library } = useActiveWeb3React()

  // track and parse user input
  const [typedValue, setTypedValue] = useState('')
  const { parsedAmount, error } = useDerivedStakeInfo(typedValue, stakingInfo.stakedAmount.token, userLiquidityUnstaked)
  const parsedAmountWrapped = wrappedCurrencyAmount(parsedAmount, chainId)

  let hypotheticalRewardRate: TokenAmount = new TokenAmount(stakingInfo.rewardRate.token, '0')
  if (parsedAmountWrapped?.greaterThan('0')) {
    hypotheticalRewardRate = stakingInfo.getHypotheticalRewardRate(
      stakingInfo.stakedAmount.add(parsedAmountWrapped),
      stakingInfo.totalStakedAmount.add(parsedAmountWrapped),
      stakingInfo.totalRewardRate
    )
  }
  console.log('hypotheticalRewardRate',hypotheticalRewardRate)

  // state for pending and submitted txn views
  const addTransaction = useTransactionAdder()
  const [attempting, setAttempting] = useState<boolean>(false)
  const [hash, setHash] = useState<string | undefined>()
  const wrappedOnDismiss = useCallback(() => {
    setHash(undefined)
    setAttempting(false)
    onDismiss()
  }, [onDismiss])

  // pair contract for this token to be staked
    const dummyPair = (stakingInfo.name !== 'WELT-USDC'  ?
      new Pair(new TokenAmount(stakingInfo.tokens[0], '0'), new TokenAmount(stakingInfo.tokens[1], '0')) //add
      :
      new Pair(new TokenAmount(stakingInfo.tokens[0], '0'), new TokenAmount(stakingInfo.baseToken[0], '0')) //add
    )
  
  // const pairContract = usePairContract(dummyPair.liquidityToken.address)
  const pairContract = usePairContract(stakingInfo.lp && stakingInfo.lp !== '' ? stakingInfo.lp : dummyPair.liquidityToken.address)

  // approval data for stake
  const deadline = useTransactionDeadline()
  const [signatureData, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(null)
  const [approval, approveCallback] = useApproveCallback(parsedAmount, stakingInfo.stakingRewardAddress)

  const isArgentWallet = useIsArgentWallet()
  const stakingContract = useStakingContract(stakingInfo.stakingRewardAddress)
  // console.log('signatureData',signatureData)
  async function onStake() {
    setAttempting(true)
    if (stakingContract && parsedAmount && deadline) {
      //  console.log("ApprovalState.APPROVED", approval, ApprovalState.APPROVED);
      if (approval === ApprovalState.APPROVED) {
        //   console.log('amount',parsedAmount.raw.toString(16))
        await stakingContract.stake(`0x${parsedAmount.raw.toString(16)}`, { gasLimit: 6000000 })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Deposit liquidity`
          })
          setHash(response.hash)
        })
        .catch((error: any) => {
          setAttempting(false)
       //   console.log(error)
        })
      //  setHash(`0x${parsedAmount.raw.toString(16)}`)   //it's for remove the modal
      } else if (signatureData) {
        // console.log("ielse", signatureData, stakingContract.address)

        stakingContract
          .stakeWithPermit(
            `0x${parsedAmount.raw.toString(16)}`,
            signatureData.deadline,
            signatureData.v,
            signatureData.r,
            signatureData.s,
            { gasLimit: 6000000 }
          )
          
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: `Deposit liquidity`
            })
            setHash(response.hash)
          })
          .catch((error: any) => {
            setAttempting(false)
         //   console.log(error)
          })
      } else {
        setAttempting(false)
        throw new Error('Attempting to stake without approval or a signature. Please contact support.')
      }
    }
  }

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback((typedValue: string) => {
    setSignatureData(null)
    setTypedValue(typedValue)
  }, [])

  // used for max input button
  const maxAmountInput = maxAmountSpend(userLiquidityUnstaked)
  const atMaxAmount = Boolean(maxAmountInput && parsedAmount?.equalTo(maxAmountInput))
  const handleMax = useCallback(() => {
    maxAmountInput && onUserInput(maxAmountInput.toExact())
  }, [maxAmountInput, onUserInput])

  async function onAttemptToApprove() {
    if (!pairContract || !library || !deadline) throw new Error('missing dependencies')
    const liquidityAmount = parsedAmount
    if (!liquidityAmount) throw new Error('missing liquidity amount')

    if (isArgentWallet || stakingInfo.isTokenOnly) {
      return approveCallback()
    }

    // try to gather a signature for permission
    const nonce = await pairContract.nonces(account)

    const EIP712Domain = [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' }
    ]
    const domain = {
      name: 'Pancake LPs',
      version: '1',
      chainId: chainId,
      verifyingContract: pairContract.address
    }
    const Permit = [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' }
    ]
    const message = {
      owner: account,
      spender: stakingInfo.stakingRewardAddress,
      value: liquidityAmount.raw.toString(),
      nonce: nonce.toHexString(),
      deadline: deadline.toNumber()
    }
    const data = JSON.stringify({
      types: {
        EIP712Domain,
        Permit
      },
      domain,
      primaryType: 'Permit',
      message
    })

    library
      .send('eth_signTypedData_v4', [account, data])
      .then(splitSignature)
      .then(signature => {
        setSignatureData({
          v: signature.v,
          r: signature.r,
          s: signature.s,
          deadline: deadline.toNumber()
        })
      })
      .catch(error => {
        // for all errors other than 4001 (EIP-1193 user rejected request), fall back to manual approve
        if (error?.code !== 4001) {
          approveCallback()
        }
      })
  }

  

  return (
    <Modal isOpen={isOpen} onDismiss={wrappedOnDismiss} maxHeight={90}>
      {!attempting && !hash && (
        <ContentWrapper gap="lg">
          <RowBetween>
            <TYPE.mediumHeader>Deposit</TYPE.mediumHeader>
            <CloseIcon onClick={wrappedOnDismiss} />
          </RowBetween>
          {!stakingInfo.isNftToken ?
            <CurrencyInputPanel
              value={typedValue}
              onUserInput={onUserInput}
              onMax={handleMax}
              showMaxButton={!atMaxAmount}
              currency={stakingInfo.stakedAmount.token}
              pair={stakingInfo.isTokenOnly || stakingInfo.isNftToken ? null : dummyPair}
              label={''}
              disableCurrencySelect={true}
              customBalanceText={'Available to deposit: '}
              id="stake-liquidity-token"
            />
            :
            // <CurrencyInputPanel
            //   value={typedValue}
            //   onUserInput={onUserInput}
            //   onMax={
            //     handleMax
            //   }
            //   showMaxButton={false}
            //   currency={null}
            //   id="add-liquidity-input-tokena"
            //   showCommonBases
            // />
            <ButtonConfirmed>There is no NFT Token
            </ButtonConfirmed>
          }

          <HypotheticalRewardRate dim={!hypotheticalRewardRate.greaterThan('0')}>
            <div>
              <TYPE.black fontWeight={600}>Weekly Rewards</TYPE.black>
            </div>

            <TYPE.black>
              {hypotheticalRewardRate.multiply((60 * 60 * 24 ).toString()).toSignificant(4, { groupSeparator: ',' })}{' '}
              WELT / DAY
            </TYPE.black>
          </HypotheticalRewardRate>

          <RowBetween>
            {!stakingInfo.isNftToken ?
              <ButtonConfirmed
                mr="0.5rem"
                onClick={onAttemptToApprove}
                confirmed={approval === ApprovalState.APPROVED || signatureData !== null}
                disabled={approval !== ApprovalState.NOT_APPROVED || signatureData !== null}
              >
                Approve
              </ButtonConfirmed>
              :
              <></>}
            {!stakingInfo.isNftToken ?
              <ButtonError
                disabled={!!error || (signatureData === null && approval !== ApprovalState.APPROVED)}
                error={!!error && !!parsedAmount}
                onClick={onStake}
              >
                {error ?? 'Deposit'}
              </ButtonError>
              : <></>
            }


          </RowBetween>
          {!stakingInfo.isNftToken ?
            <ProgressCircles steps={[approval === ApprovalState.APPROVED || signatureData !== null]} disabled={true} />
            :
            <></>}

        </ContentWrapper>
      )}
      {attempting && !hash && (
        <LoadingView onDismiss={wrappedOnDismiss}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.largeHeader>Depositing Liquidity</TYPE.largeHeader>
            {!stakingInfo.isTokenOnly ?
              <TYPE.body fontSize={20}>{parsedAmount?.toSignificant(4)}WELT TOKEN</TYPE.body>
              :
              <TYPE.body fontSize={20}>{parsedAmount?.toSignificant(4)} WELT TOKEN</TYPE.body>
            }
          </AutoColumn>
        </LoadingView>
      )}
      {attempting && hash && (
        <SubmittedView onDismiss={wrappedOnDismiss} hash={hash}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.largeHeader>Transaction Submitted</TYPE.largeHeader>
            <TYPE.body fontSize={20}>Deposited {parsedAmount?.toSignificant(4)}WELT TOKEN</TYPE.body>
          </AutoColumn>
        </SubmittedView>
      )}
    </Modal>
  )
}
