require("@nomiclabs/hardhat-waffle");
const { PrivateKey, L1RPC, L2RPC } = require('./secret.json');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.7.4",
  networks: {
    l1: {
      url: L1RPC,
      accounts: [PrivateKey],
    },
    l2: {
      gasPrice: 0,
      url: L2RPC,
      accounts: [PrivateKey],
    },
  },
};
