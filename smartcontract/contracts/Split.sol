//SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Swap.sol";

contract Split is Ownable {
    using Counters for Counters.Counter;

    event ExpenseCreated(
        uint indexed index,
        uint8 category,
        uint8 status,
        address indexed creator,
        string name,
        string description,
        uint amount
    );

    event DebtorPaid(
        uint indexed index,
        address indexed recipient,
        address indexed debtor,
        uint amountPaid
    );

    event ExpenseCancelled(
        uint indexed index,
        address indexed creator,
        address indexed recipient
    );

    event RecipientPaid(uint indexed index, address indexed recipient);

    //pause contract during emergency
    bool _pauseContract = false;

    address public _swapContractAddress;

    address public _lpTokenContractAddress;

    // mapping creator address to expense id
    mapping(address => mapping(uint => uint)) _creatorExpenses;

    // mapping debtor address to expense id
    mapping(address => mapping(uint => uint)) _debtorExpenses;

    // mapping expense id to creator id
    mapping(uint => address) _expenseCreator;

    // mapping number of creator expenses;
    mapping(address => uint) _createdExpenseOf;

    // mapping number of debtor expenses;
    mapping(address => uint) _owedExpenseOf;

    // All Expense
    mapping(uint => Expense) _allExpenses;

    Counters.Counter _expenseIndex;

    enum ExpenseStatus {
        PENDING,
        PAID,
        CANCELLED
    }

    enum ExpenseCategory {
        ACCOMODATION,
        TRANSPORTATION,
        FOOD,
        MISC
    }

    struct Participant {
        address _address;
    }

    struct DebtParticipant {
        address _address;
        uint amount;
    }

    struct Debtor {
        address _address;
        uint amount;
        uint amountOut;
        bool hasPaid;
        uint paidAt;
    }

    struct Expense {
        string name;
        string description;
        ExpenseCategory category;
        address token;
        uint amount;
        uint amountPaid;
        uint paymentDue;
        uint createdAt;
        ExpenseStatus status;
        Participant creator;
        Participant recipient;
        Debtor[] debtors; //USE MAPPING AND BUBBLE DATA UP
    }

    modifier creatorOf(uint expenseIndex) {
        require(
            _expenseCreator[expenseIndex] == msg.sender,
            "Access denied. Only creator"
        );
        _;
    }

    modifier notPaused() {
        require(!_pauseContract, "Contract is paused");
        _;
    }

    /// creates a new expense
    ///@dev function stack almost too deep
    function createExpense(
        string memory _name,
        string memory _description,
        uint _amount,
        address _tokenAddress,
        ExpenseCategory _category,
        uint _paymentDue,
        Participant memory _recipient,
        Participant memory _creator,
        DebtParticipant[] memory _debtors
    ) public notPaused {
        //data validation
        require(bytes(_name).length > 0, "Expense name is required");
        require(_amount > 0, "amount must be greater than 0");
        require(
            Swap(_swapContractAddress).isValidAssetAddress(_tokenAddress),
            "Invalid token address or ENS names"
        );
        require(
            _recipient._address != address(0),
            "Invalid  recipient address or ENS names"
        );

        uint expenseIndex = _expenseIndex.current();

        //create new Expense
        Expense storage expense = _allExpenses[expenseIndex];
        expense.name = _name;
        expense.description = _description;
        expense.amount = _amount;
        expense.token = _tokenAddress;
        expense.recipient = _recipient;
        expense.creator = _creator;
        expense.createdAt = block.timestamp;
        expense.category = _category;
        expense.status = ExpenseStatus.PENDING;
        expense.paymentDue = _paymentDue;
        expense.amountPaid = 0;

        // assign expense index to creator
        _creatorExpenses[_creator._address][
            _createdExpenseOf[_creator._address] // number of expenses created by `_creator._address`
        ] = expenseIndex;

        // increase the creators number of created expenses
        _createdExpenseOf[_creator._address] += 1;

        // Implicit memory to storage conversion is not supported
        // so we do it manually
        for (uint idx; idx < _debtors.length; idx++) {
            address debtorAddress = _debtors[idx]._address;

            require(
                debtorAddress != address(0),
                "invalid address debtor or ENS name"
            );

            //get number of expense of debtor
            uint numberOfOwedExpense = _owedExpenseOf[debtorAddress];

            // increase the number of debtors owed expenses;
            _owedExpenseOf[debtorAddress] += 1;

            // assign expense index to debtor
            _debtorExpenses[debtorAddress][numberOfOwedExpense] = expenseIndex;

            // append debtor expense list of debtors
            expense.debtors.push(
                Debtor({
                    _address: debtorAddress,
                    amount: _debtors[idx].amount,
                    hasPaid: false,
                    paidAt: 0,
                    amountOut: 0
                })
            );
        }

        _expenseIndex.increment();

        emit ExpenseCreated(
            expenseIndex,
            uint8(_category),
            uint8(expense.status),
            _creator._address,
            _name,
            _description,
            _amount
        );
    }

    function getNumberOfCreatedExpenses(address _creatorAddress)
        external
        view
        notPaused
        returns (uint)
    {
        require(_creatorAddress != address(0), "Invalid address");
        return _createdExpenseOf[_creatorAddress];
    }

    function getNumberOfOwedExpenses(address _debtorAddress)
        external
        view
        notPaused
        returns (uint)
    {
        require(_debtorAddress != address(0), "Invalid address");
        return _owedExpenseOf[_debtorAddress];
    }

    function getCreatedExpense(address _creatorAddress, uint index)
        external
        view
        notPaused
        returns (
            string memory,
            string memory,
            ExpenseCategory,
            address,
            uint,
            uint,
            uint,
            ExpenseStatus,
            address,
            address,
            Debtor[] memory
        )
    {
        uint expenseIndex = _creatorExpenses[_creatorAddress][index];
        Expense storage expense = _allExpenses[expenseIndex];

        return (
            expense.name,
            expense.description,
            expense.category,
            expense.token,
            expense.amount,
            expense.paymentDue,
            expense.createdAt,
            expense.status,
            expense.creator._address,
            expense.recipient._address,
            expense.debtors
        );
    }

    function payDebt(
        address fromAsset,
        uint24 poolFee,
        uint256 amountIn,
        uint index
    ) external {
        require(
            Swap(_swapContractAddress).isValidAssetAddress(fromAsset),
            "Invalid asset address"
        );
        require(poolFee > 0, "Pool fee is not enough");
        require(amountIn > 0, "Amount sent is not enough");

        Swap swapContract = Swap(_swapContractAddress);

        uint expenseIndex = _debtorExpenses[msg.sender][index];
        Expense storage expense = _allExpenses[expenseIndex];
        uint debtIndex = getDebt(expenseIndex, msg.sender);

        Debtor storage debtor = expense.debtors[debtIndex];

        //TODO: check to see required amount is available in the pool

        //swap asset to tagert asset and store on contract
        uint amountOut = swapContract.swapExactInputSingle(
            fromAsset,
            expense.token,
            msg.sender,
            address(this),
            poolFee,
            amountIn
        );

        debtor.amountOut += amountOut;
        expense.amountPaid += amountOut;

        if (debtor.amountOut >= debtor.amount) {
            debtor.hasPaid = true;
        }

        debtor.paidAt = block.timestamp;

        // if full amount has been collected, pay recipient
        if (expense.amountPaid >= expense.amount) {
            // clean paid amount record of all expense debtors
            for (uint idx; idx < expense.debtors.length; idx++) {
                expense.debtors[idx].amountOut = 0;
            }

            uint totalCollectedAmount = expense.amountPaid;
            expense.amountPaid = 0;

            ERC20(expense.token).transfer(
                expense.recipient._address,
                totalCollectedAmount
            );
        }

        emit DebtorPaid(
            expenseIndex,
            expense.recipient._address,
            msg.sender,
            amountOut
        );
    }

    // get owed expenses detail of address
    function getOwedExpense(address _debtorAddress, uint index)
        external
        view
        notPaused
        returns (
            string memory,
            string memory,
            ExpenseCategory,
            address,
            uint,
            uint,
            uint,
            ExpenseStatus,
            address,
            address,
            Debtor[] memory
        )
    {
        uint expenseIndex = _debtorExpenses[_debtorAddress][index];
        Expense storage expense = _allExpenses[expenseIndex];

        return (
            expense.name,
            expense.description,
            expense.category,
            expense.token,
            expense.amount,
            expense.paymentDue,
            expense.createdAt,
            expense.status,
            expense.creator._address,
            expense.recipient._address,
            expense.debtors
        );
    }

    function getDebt(uint expenseId, address _debtorAddress)
        public
        view
        returns (uint)
    {
        Expense storage expense = _allExpenses[expenseId];

        // Doesn't cost gas in a view function.
        // But can stopped by miner if it takes too long
        for (uint idx; idx < expense.debtors.length; idx++) {
            if (expense.debtors[idx]._address == _debtorAddress) {
                return idx;
            }
        }
        return 0;
    }

    function pauseContract(bool status) external onlyOwner {
        _pauseContract = status;
    }

    function setSwapContractAddress(address _address) external onlyOwner {
        require(_address != address(0), "Swap contract address cannot be 0x0");
        _swapContractAddress = _address;
    }
}
