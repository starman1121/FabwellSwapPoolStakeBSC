import { Interface } from '@ethersproject/abi'
import L1_POOL_ABI from './l1-mint.json'
const L1_POOL_ADDRESS = '0xC18032eCC618E9c84154C91EC7ECcAEc248d145f'

const L1_MINT_INTERFACE = new Interface(L1_POOL_ABI)

export default L1_MINT_INTERFACE
export { L1_POOL_ABI, L1_POOL_ADDRESS}
