
// const accounts = await hre.ethers.getSigners()

// FOR CONSOLE: npx hardhat console --network localhost
const abi = [
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "_spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    }
]

let signer = await ethers.provider.getSigner()

const wmatic20 = new ethers.Contract('0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', abi, signer);

const wmatic = await ethers.getContractAt(abi,'0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', signer);

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
    ['0x2559fF0F61870134a1d75cE3F271878DCDb0eEE1'],
    ['0x6ada131794388B83c2b3e5b8A24A4677b3aD2E39'],
    [['0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',100000000]])



//     const Factory = await ethers.getContractFactory('UniswapV3Factory');
// const Factory1 = await Factory.attach('0x1F98431c8aD98523631AE4a59f267346ea31F984')

// let signer = await ethers.provider.getSigner()

// // const Factory1 = await ethers.getContractAt('UniswapV3Factory','0x1F98431c8aD98523631AE4a59f267346ea31F984', signer);

// let factory = Factory1.connect(signer)


