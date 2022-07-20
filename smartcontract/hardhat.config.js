require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config({path: ".env"});

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
