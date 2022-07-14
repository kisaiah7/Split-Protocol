//SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Split is Ownable{

    event ExpenseCreated(uint indexed index, address indexed creator, address indexed recipient, uint amount);
    event DebtorPaid(uint indexed index, address indexed recipient, address indexed debtor, uint amount);
    event ExpenseCancelled(uint indexed index, address indexed creator, address indexed recipient, uint amount);

    //pause contract during emergency
    bool _pauseContract = false;

    // mapping creator address to expense id
    mapping(address => mapping(uint => uint)) _creatorExpenses;

    // mapping debtor address to expense id
    mapping(address => mapping(uint => uint)) _debtorExpenses;

    // mapping recipient address to expense id
    mapping(address => mapping (uint => uint)) _recipientExpenses;

    // mapping expense id to creator id
    mapping(uint => address ) _expenseCreator;

    // mapping expense id to recipient id
    mapping(uint => address) _expenseRecipient;
    
    // mapping expense id to debtor id
    mapping(uint => address) _expenseDebtor;

    // mapping number of creator expenses;
    mapping(address => uint) _createdExpenseOf;

    // mapping number of recipient expenses;
    mapping(address => uint) _receivingExpenseOf;

    // mapping number of debtor expenses;
    mapping(address => uint) _owedExpenseOf;

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

    struct Participant{
        string name;
        string avatarURL;
    }

    struct Debtor {
        string name;
        string avatarURL;
        uint amount;
        bool hasPayed;
        uint paidAt;
    }

    struct Expense{
        string name;
        string description;
        ExpenseCategory category;
        address token;
        uint amount;
        uint paymentDue;
        uint createdAt;
        ExpenseStatus status;
        Participant creator;
        Participant recipient;
        Debtor[] debtors;
    }

    // All Expense
    Expense[] _expenses; 

    modifier onlyCreator(uint expenseIndex){
        require(_expenseCreator[expenseIndex] == msg.sender, "Access denied. Only creator");
        _;
    }

    modifier onlyRecipient(uint expenseIndex){
        require(_expenseRecipient[expenseIndex] == msg.sender,"Access denied. Only recipient");
        _;
    }

    modifier onlyDebtor(uint expenseIndex){
        require(_expenseDebtor[expenseIndex] == msg.sender, "Access denied. Only debtor");
        _;
    }

    modifier notPaused {
        require(!_pauseContract, "Contract is paused");
        _;
    }

    function pauseContract(bool status) external onlyOwner {
        _pauseContract = status;
    }
}