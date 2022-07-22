
// const accounts = await hre.ethers.getSigners()

// FOR CONSOLE: npx hardhat console --network localhost
const Split = await ethers.getContractFactory('Split');
const Swap = await ethers.getContractFactory('Swap');

const split = await Split.attach('0x566ac8344a7cbBC4879e5692F32A9ebdED002e7f')
const swap = await Split.attach('0x6134C0C7D655CfF2F225CFeB0c06799B588a7E61')

const setSwapAddressOnSplit = await split.setSwapContractAddress('0x6134C0C7D655CfF2F225CFeB0c06799B588a7E61')


const expense = await split.createExpense(
    'testName', 
    'testDescription', 
    1000000000,
    '0x3813e82e6f7098b9583FC0F33a962D02018B6803',
    0,
    500000000,
    ['0x2559fF0F61870134a1d75cE3F271878DCDb0eEE1'],
    ['0x6ada131794388B83c2b3e5b8A24A4677b3aD2E39'],
    [['0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',100000000]])


