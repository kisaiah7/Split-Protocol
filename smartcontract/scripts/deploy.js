const {ethers} = require('hardhat');
require("dotenv").config({path: ".env"});

async function main(){
  const splitContract = await ethers.getContractFactory("Split");
  const swapContract = await ethers.getContractFactory("Swap");

  const deployedSplitContract = await splitContract.deploy();
  await deployedSplitContract.deployed();

  const deployedSwapContract = await swapContract.deploy(deployedSplitContract.address);
  await deployedSwapContract.deployed();

  deployedSplitContract.setSwapContractAddress(deployedSwapContract.address);


  storeContractData(deployedSplitContract, "Split");
  storeContractData(deployedSwapContract, "Swap");
}

// auto write contract abi.json after deployment
const storeContractData = (contract, contractName) => {
  const fs = require("fs");
  const contractDir = `${__dirname}/../abis`;

  if (!fs.existsSync(contractDir)) {
    fs.mkdirSync(contractDir);
  }

  const contractArtiacts = artifacts.readArtifactSync(contractName);

  console.log("Split contract deployed to:", contract.address)
  
  fs.writeFileSync(
    contractDir + `/${contractName}.json`,
    JSON.stringify({ address: contract.address, ...contractArtiacts }, null, 2)
  );
};


main().then( () => process.exit(0))
.catch( error => {
  console.log(error);
  process.exit(1);
})