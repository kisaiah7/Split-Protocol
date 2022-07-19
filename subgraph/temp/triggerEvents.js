
// const accounts = await hre.ethers.getSigners()
const Split = await ethers.getContractFactory('Split');
// let splitContract = new ethers.Contract(Split.address, Split.interface, accounts[0]);
const split = await Split.attach('0x5FbDB2315678afecb367f032d93F642f64180aa3')


const expense = await split.createExpense(
    'testName', 
    'testDescription', 
    1000000000,
    '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    0,
    500000000,
    '0x2559fF0F61870134a1d75cE3F271878DCDb0eEE1',
    '0x6ada131794388B83c2b3e5b8A24A4677b3aD2E39',
    [['0x6ada131794388B83c2b3e5b8A24A4677b3aD2E39', 100000000]])