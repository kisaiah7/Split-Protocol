require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config({path: ".env"});

// import '@nomiclabs/hardhat-ethers'
// import '@nomiclabs/hardhat-waffle'
// import '@nomiclabs/hardhat-etherscan'
// import { task } from "hardhat/config"
// import { BigNumber } from "ethers"
// import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"

// task("accounts", "Prints the list of accounts", async (args, hre): Promise<void> => {
//   const accounts: SignerWithAddress[] = await hre.ethers.getSigners()
//   accounts.forEach((account: SignerWithAddress): void => {
//     console.log(account.address)
//   })
// })

// task("balances", "Prints the list of AVAX account balances", async (args, hre): Promise<void> => {
//   const accounts: SignerWithAddress[] = await hre.ethers.getSigners()
//   for(const account of accounts){
//     const balance: BigNumber = await hre.ethers.provider.getBalance(
//       account.address
//     );
//     console.log(`${account.address} has balance ${balance.toString()}`);
//   }
// })

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  mocha:{
    timeout: 100000000
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.POLYGON_FORK_URL
      },
    },
    mumbai: {
      url: process.env.ALCHEMY_API_KEY_URL,
      accounts: [process.env.MUMBAI_WALLET_PRIVATE_KEY]
    }
  }
};



