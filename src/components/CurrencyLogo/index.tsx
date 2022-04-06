import { Currency, ETHER, Token } from '@uniswap/sdk'
import React, { useMemo } from 'react'
import styled from 'styled-components'

import EthereumLogo from '../../assets/images/ethereum-logo.png'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import Logo from '../Logo'

export const getTokenLogoURL = (address: string) => {
  let uri;
  if (address?.toLowerCase() === '0x1785113910847770290f5f840b4c74fc46451201'.toLowerCase()) {
    uri = 'https://assets.coingecko.com/coins/images/20505/small/welt.PNG?1637143324'
  }
  if (address?.toLowerCase() === '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d'.toLowerCase()) {
    uri = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png'
  }
  
  if (address?.toLowerCase() === '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270') {
    address = '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0'
  }
  if (address?.toLowerCase() === '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063') {
    uri = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png'
  }
  if (address === '0x2C89bbc92BD86F8075d1DEcc58C7F4E0107f286b') {
    uri = 'https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png?1604021818'
  }
  if (address === '0xB85517b87BF64942adf3A0B9E4c71E4Bc5Caa4e5') {
    uri = 'https://assets.coingecko.com/coins/images/4001/small/Fantom.png?1558015016'
  }
  if (address?.toLowerCase() === '0xc2132d05d31c914a87c6611c10748aeb04b58e8f') {
    address = '0xdAC17F958D2ee523a2206206994597C13D831ec7'
  }
  if (address?.toLowerCase() === '0x2791bca1f2de4661ed88a30c99a7a9449aa84174') {
    address = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
  }

  if (address?.toLowerCase() === '0xb33eaad8d922b1083446dc23f610c2567fb5180f') {
    address = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'
  }

  if (address?.toLowerCase() === '0xdb3b3b147a030f032633f6c4bebf9a2fb5a882b5') {
    uri = 'https://raw.githubusercontent.com/sameepsi/quickswap-interface/master/assets/easyfi-token.png'
  }

  if (address?.toLowerCase() === '0x831753dd7087cac61ab5644b308642cc1c33dc13') {
    uri = 'https://raw.githubusercontent.com/sameepsi/quickswap-interface/master/public/favicon.jpeg'
  }

  if (address?.toLowerCase() === '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6') {
    address = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
  }

  if (address?.toLowerCase() === '0x385eeac5cb85a38a9a07a70c73e0a3271cfb54a7') {
    uri = 'https://etherscan.io/token/images/AavegotchiGHST_32.png'
  }

  if (address?.toLowerCase() === '0x4ebde54ba404be158262ede801744b92b9878c61') {
    uri = 'https://raw.githubusercontent.com/sameepsi/quickswap-interface/master/assets/easyfi-token.png'
  }

  if (address?.toLowerCase() === '0xa1c09c8f4f5d03fcc27b456475d53d988e98d7c5') {
    uri = 'https://raw.githubusercontent.com/sameepsi/quickswap-interface/master/assets/easyfi-token.png'
  }

  if (address?.toLowerCase() === '0xfc39742fe9420a7af23757fc7e78d1c3ae4a9474') {
    uri = 'https://raw.githubusercontent.com/sameepsi/quickswap-interface/master/assets/easyfi-token.png'
  }

  if (address?.toLowerCase() === '0x9f5755d47fb80100e7ee65bf7e136fca85dd9334') {
    uri = 'https://etherscan.io/token/images/om_32.png'
  }

  if (address?.toLowerCase() === '0x9719d867a500ef117cc201206b8ab51e794d3f82') {
    uri = 'https://aavegotchi.com/images/matokens/maUSDC.svg'
  }

  if (address?.toLowerCase() === '0xE0b22E0037B130A9F56bBb537684E6fA18192341'.toLowerCase()) {
    uri = 'https://aavegotchi.com/images/matokens/maDAI.svg'
  }

  if (address?.toLowerCase() === '0x20D3922b4a1A8560E1aC99FBA4faDe0c849e2142'.toLowerCase()) {
    uri = 'https://aavegotchi.com/images/matokens/maWETH.svg'
  }

  if (address?.toLowerCase() === '0x823CD4264C1b951C9209aD0DeAea9988fE8429bF'.toLowerCase()) {
    uri = 'https://aavegotchi.com/images/matokens/maAAVE.svg'
  }

  if (address?.toLowerCase() === '0x98ea609569bD25119707451eF982b90E3eb719cD'.toLowerCase()) {
    uri = 'https://aavegotchi.com/images/matokens/maLINK.svg'
  }

  if (address?.toLowerCase() === '0xDAE5F1590db13E3B40423B5b5c5fbf175515910b'.toLowerCase()) {
    uri = 'https://aavegotchi.com/images/matokens/maUSDT.svg'
  }

  if (address?.toLowerCase() === '0xF4b8888427b00d7caf21654408B7CBA2eCf4EbD9'.toLowerCase()) {
    uri = 'https://aavegotchi.com/images/matokens/maTUSD.svg'
  }

  if (address?.toLowerCase() === '0xe86E8beb7340659DDDCE61727E500e3A5aD75a90'.toLowerCase()) {
    uri = 'https://s2.gifyu.com/images/zutlogo.jpg'
  }

  if (address?.toLowerCase() === '0x104592a158490a9228070e0a8e5343b499e125d0'.toLowerCase()) {
    uri = 'https://avatars.githubusercontent.com/u/56005256?s=200&v=4'
  }

  if (address?.toLowerCase() === '0x9C78EE466D6Cb57A4d01Fd887D2b5dFb2D46288f'.toLowerCase()) {
    uri = 'https://etherscan.io/token/images/cometh_32.png'
  }

  if (address?.toLowerCase() === '0x127984b5E6d5c59f81DACc9F1C8b3Bdc8494572e'.toLowerCase()) {
    uri = 'https://etherscan.io/token/images/pepedex_32.png?v=2'
  }

  if (address?.toLowerCase() === '0x2a93172c8DCCbfBC60a39d56183B7279a2F647b4'.toLowerCase()) {
    uri = 'https://raw.githubusercontent.com/sameepsi/quickswap-default-token-list/master/assets/dg.jpg'
  }

  if (address?.toLowerCase() === '0x3e121107F6F22DA4911079845a470757aF4e1A1b'.toLowerCase()) {
    uri = 'https://avatars.githubusercontent.com/u/56005256?s=200&v=4'
  }

  if (address?.toLowerCase() === '0x104592a158490a9228070E0A8e5343B499e125D0'.toLowerCase()) {
    uri = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x853d955aCEf822Db058eb8505911ED77F175b99e/logo.png'
  }

  if (address?.toLowerCase() === '0xab0b2ddB9C7e440fAc8E140A89c0dbCBf2d7Bbff'.toLowerCase()) {
    uri = 'https://raw.githubusercontent.com/harvestfi/assets/main/farm-logo.png'
  }

  if (address?.toLowerCase() === '0x034b2090b579228482520c589dbD397c53Fc51cC'.toLowerCase()) {
    uri = 'https://s3-us-west-2.amazonaws.com/acf-uploads/apyvisionlogo200circle.png'
  }

  if (address?.toLowerCase() === '0x7FBc10850caE055B27039aF31bD258430e714c62'.toLowerCase()) {
    uri = 'https://assets.coingecko.com/coins/images/2707/small/UnibrightLogo_colorful_500x500_preview.png?1547036916'
  }

  if (address?.toLowerCase() === '0x0e59D50adD2d90f5111aca875baE0a72D95B4762'.toLowerCase()) {
    uri = 'https://dark-build.app/logo192.png'
  }

  if (address?.toLowerCase() === '0x3809dcDd5dDe24B37AbE64A5a339784c3323c44F'.toLowerCase()) {
    uri = 'https://i.imgur.com/vZnU36G.png'
  }

  if (address?.toLowerCase() === '0x23D29D30e35C5e8D321e1dc9A8a61BFD846D4C5C'.toLowerCase()) {
    uri = 'https://hex.com/favicon.png'
  }

  if (address?.toLowerCase() === '0x8d1566569d5b695d44a9a234540f68D393cDC40D'.toLowerCase()) {
    uri = 'https://i.imgur.com/IIUglm9.png?1'
  }

  if (address?.toLowerCase() === '0x66768ad00746aC4d68ded9f64886d55d5243f5Ec'.toLowerCase()) {
    uri = 'https://rebalancetoken.io/images/logo/logo.png'
  }

  if (address?.toLowerCase() === '0x8c8bdBe9CeE455732525086264a4Bf9Cf821C498'.toLowerCase()) {
    uri = 'https://aavegotchi.com/images/matokens/maUNI.svg'
  }

  if (address?.toLowerCase() === '0xe20f7d1f0eC39C4d5DB01f53554F2EF54c71f613'.toLowerCase()) {
    uri = 'https://aavegotchi.com/images/matokens/maYFI.svg'
  }

  if (address?.toLowerCase() === '0x840195888Db4D6A99ED9F73FcD3B225Bb3cB1A79'.toLowerCase()) {
    uri = 'https://raw.githubusercontent.com/sameepsi/quickswap-default-token-list/master/assets/sx.jpg'
  }

  if (address?.toLowerCase() === '0xe6fc6c7cb6d2c31b359a49a33ef08ab87f4de7ce') {
    uri = 'https://assets.coingecko.com/coins/images/7697/small/N7aEdYrY_400x400.png?1561587437'
  }

  if (address?.toLowerCase() === '0xad684e79CE4b6D464f2Ff7c3FD51646892e24b96'.toLowerCase()) {
    uri = 'https://s2.coinmarketcap.com/static/img/coins/64x64/2151.png'
  }

  if (address?.toLowerCase() === '0xad684e79CE4b6D464f2Ff7c3FD51646892e24b96'.toLowerCase()) {
    address = '0xc813EA5e3b48BEbeedb796ab42A30C5599b01740'
  }

  if (address?.toLowerCase() === '0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39'.toLowerCase()) {
    address = '0x514910771AF9Ca656af840dff83E8264EcF986CA'
  }

  if (address?.toLowerCase() === '0x71b821aa52a49f32eed535fca6eb5aa130085978') {
    address = '0xB6eD7644C69416d67B522e20bC294A9a9B405B31'
  }

  if (address?.toLowerCase() === '0xa1c57f48f0deb89f569dfbe6e2b7f46d33606fd4') {
    address = '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942'
  }

  if (address?.toLowerCase() === '0x8505b9d2254a7ae468c0e9dd10ccea3a837aef5c') {
    address = '0xc00e94Cb662C3520282E6f5717214004A7f26888'
  }

  if (address?.toLowerCase() === '0x313d009888329c9d1cf4f75ca3f32566335bd604') {
    address = '0x80fB784B7eD66730e8b1DBd9820aFD29931aab03'
  }

  if (address?.toLowerCase() === '0xda537104d6a5edd53c6fbba9a898708e465260b6') {
    address = '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e'
  }

  if (address?.toLowerCase() === '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619') {
    address = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
  }

  if (!uri) {
    uri = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;
  }

  return uri;
}

const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

const StyledLogo = styled(Logo) <{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  background-color: ${({ theme }) => theme.white};
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    if (currency === ETHER) return []

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, getTokenLogoURL(currency.address)]
      }
      return [getTokenLogoURL(currency.address)]
    }
    return []
  }, [currency, uriLocations])

  if (currency === ETHER) {
    return <StyledEthereumLogo src={EthereumLogo} size={size} style={style} />
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}
