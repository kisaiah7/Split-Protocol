# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.


### Features
- Create Expense
- Get number of expense created by an address
- Get created expense of an address
- Get number of debt of an address
- Get debt of an address

### Todo
- asset payment
- asset withdrawal

### Setting up 

- Install dependencies
    
    `npm install` or `yarn `

- Create a .env file and add the following variables

    - ALCHEMY_API_KEY_URL = "Host node url"
    - MUMBAI_PRIVATE_KEY = "polygon mumbai wallet private key"


- Try running some of the following tasks:

    ```shell
    npx hardhat help
    npx hardhat test
    GAS_REPORT=true npx hardhat test
    npx hardhat node
    npx hardhat run scripts/deploy.js --network mumbai
    ```

### Using ABI and contract addresses

Abi and contract address can be found in /abis folder as `<ContractName>.json` where `<ContractName>` is the name of the contract.


### Available contract methods
- Create Expense
    ```
        function createExpense(
            string _name,
            string _description,
            BigNumber _amount,
            string _tokenAddress,
            BigNumber _category,
            timestamp _paymentDue,
            Object _recipient,
            Object _creator,
            Array[] _debtors
        ): void
    ```

 - Get number of expense created by an address
    ```
        getNumberOfCreatedExpenses(string _creatorAddress): BigNumber
    ```
 - Get created expense of an address
    ```
        getNumberOfOwedExpenses(string _debtorAddress): BigNumber
    ```

 - Get number of debt of an address
    ```
        getCreatedExpense(address _creatorAddress, BigNumber index): Array[
            string name,
            string description,
            BigNumber category,
            BigNumber amount,
            string  token,
            BigNumber status,
            BigNumber paymentDue,
            BigNumber createdAt
        ]
    ```

 - Get debt of an address
    ```
        function getOwedExpense(address _debtorAddress, BigNumber index): Array[
            string name ,
            string description ,
            BigNumber category,
            BigNumber amount,
            boolean hasPaid,
            BigNumber paidAt,
            BigNumber status,
            BigNumber paymentDue,
            BigNumber createdA
        ]
    
    ```
