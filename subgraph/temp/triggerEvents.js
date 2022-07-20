
// const accounts = await hre.ethers.getSigners()

// FOR CONSOLE: npx hardhat console --network localhost
const Split = await ethers.getContractFactory('Split');
const split = await Split.attach('0xC10DFcc06b37660446cB99a7A2800469F8D58fE5')

const setResult1 = await split.setSwapContractAddress('0x04Cd8B3e384e7bBB01109bc8b6708fCAeD5e9eB0')


const expense = await split.createExpense(
    'testName', 
    'testDescription', 
    1000000000,
    '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    0,
    500000000,
    ('0x2559fF0F61870134a1d75cE3F271878DCDb0eEE1'),
    ('0x6ada131794388B83c2b3e5b8A24A4677b3aD2E39'),
    [('0x6ada131794388B83c2b3e5b8A24A4677b3aD2E39', 100000000)])

