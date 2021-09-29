const { utils, providers, Wallet, BigNumber } = require('ethers')
const { ethers } = require('hardhat')
const { parseEther } = utils
const { Inbox__factory, Bridge } = require('arb-ts')
//const { arbLog, requireEnvVariables } = require('arb-shared-dependencies')
//require('dotenv').config()

//requireEnvVariables(['DEVNET_PRIVKEY', 'L1RPC', 'L2RPC', 'INBOX_ADDR'])
const { PrivateKey, L1RPC, L2RPC, INBOX_ADDR } = require('./secret.json');
/**
 * Set up: instantiate L1 / L2 wallets connected to providers
 */

//console.log(L2RPC);
//console.log(L1RPC);

const walletPrivateKey = PrivateKey

const l1Provider = new providers.JsonRpcProvider(L1RPC)
const l2Provider = new providers.JsonRpcProvider(L2RPC)
//console.log(l1Provider);
//console.log(l2Provider);

const l1Wallet = new Wallet(walletPrivateKey, l1Provider)
const l2Wallet = new Wallet(walletPrivateKey, l2Provider)
//console.log(l1Wallet);
//console.log(l2Wallet);
/**
 * Set the amount to be depositted in L2 (in wei)
 */
const ethToL2DepositAmount = parseEther('0.1');
console.log(ethToL2DepositAmount.toString());


const main = async () => {
/**
   * Use wallets to create an arb-ts bridge instance
   * We'll use bridge for its convenience methods around checking txn statuses and ETH balances
   */
 const bridge = await Bridge.init(l1Wallet, l2Wallet)

 console.log(bridge);

 /**
  * First, let's check the l2Wallet initial ETH balance (before our deposit)
  */
 const l2WalletInitialEthBalance = await bridge.getL2EthBalance()

 console.log(l2WalletInitialEthBalance.toString());

 const inbox = Inbox__factory.connect(INBOX_ADDR, l1Wallet);

 //console.log(inbox);
/**
 * Below are ways to deposit ether in Arbitrum
 * Method 1: Directly call inbox contract maintained by Arbitrum in Rinkeby
 * Method 2: Call inbox contract from a contract of yours (deposit.sol)
 * Method 3: Direclty using arb-ts module tooling
 */

/**
 * Method 1
   * Call the depositEth() function from the Inbox contract
   * Pass the MaxSubmissionCost as argument: amount of ETH allocated to pay for the base submission fee (we hard code a large value). The value is the amount to forwarded as an L2 deposit
   * Note that depositEth creates a retryable with l2 gas price and l2 gas limit set to zero; we're only using the retryable mechanism to forward the callvalue to our destination
   */
 //const depositTx = await inbox.depositEth(10000000000000, {
 //   value: ethToL2DepositAmount,
 // })
 // const rec = await depositTx.wait()
 // console.log('deposit L1 receipt is:', rec.transactionHash)

 /**
  * Method 2
  * Deploy the contract deposit.sol with parameter of inbox contract address in constructor
  * Call depositEther() with MaxSubmissionCost as argument
  */

  //const L1Deposit = await (
  //  await ethers.getContractFactory('Deposit')
  //).connect(l1Wallet)
  //const l1Deposit = await L1Deposit.deploy(INBOX_ADDR)

//  console.log('Deploying Deposit contract to L1')
//  await l1Deposit.deployed()
//  console.log(`Deposit contract is deployed to ${l1Deposit.address} on L1`)

 // const depositTx = await l1Deposit.depositEther(
 //   BigNumber.from(10000000000000),
//    { value: ethToL2DepositAmount }
//  )
//  const rec = await depositTx.wait()
//  console.warn('deposit L1 receipt is:', rec.transactionHash)

/**
 * Call deposit ether in bridge tooling
 */

 //const depositTx = await bridge.depositETH(ethToL2DepositAmount)
 //const rec = await depositTx.wait()
 //console.warn('deposit L1 receipt is:', rec.transactionHash)

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })