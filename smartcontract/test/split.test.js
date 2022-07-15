const { ethers } = require("hardhat");
const { expect } = require("chai");

const USDT = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
const DAI = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"; 
const WFIL = "0xEde1B77C0Ccc45BFa949636757cd2cA7eF30137F";
const WMATIC = "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889";
const WETH9 = "0x35Fda92346497D4fBF2dB20fe856374f9E7f69a1";
const USDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const TWENTY_FOUR_HRS = 24 * 60 * 60 * 1000;

const ExpenseCategory = {
    ACCOMODATION: 0,
    TRANSPORTATION: 1,
    FOOD: 2,
    MISC: 3,
};

describe("Split Contract", function () {
    let SplitContract;
    let owner;
    let issuerContract;
    let creator;
    let recipient;
    let debtor1;
    let debtor2;
    let debtor3;
    let debtor4;
    let debtor5;

    beforeEach(async function () {
        [
            owner,
            issuerContract,
            recipient,
            creator,
            debtor1,
            debtor2,
            debtor3,
            debtor4,
            debtor5,
        ] = await ethers.getSigners();
        const contract = await ethers.getContractFactory("Split");
        SplitContract = await contract.deploy();

        await SplitContract.deployed();
    });

    it("Should create an expense", async function () {
        const expenseObj = {
            name: "Test Bar expense",
            description: "Spliting expenses among 5 people",
            amount: 1000,
            tokenAddress: DAI,
            paymentDue: Date.now() + TWENTY_FOUR_HRS,
            category: ExpenseCategory.ACCOMODATION,
            recipient: {
                _address: recipient.address,
                name: "recipient",
                avatarURL: "",
            },
            creator: {
                _address: creator.address,
                name: "creator",
                avatarURL: "",
            },
            debtors: [
                {
                    _address: debtor1.address,
                    amount: 200,
                    tokenAddress: DAI,
                    name: "debtor1",
                    avatarURL: "",
                    hasPaid: false,
                    paidAt: 0
                },
                {
                    _address: debtor2.address,
                    amount: 200,
                    tokenAddress: WETH9,
                    name: "debtor2",
                    avatarURL: "",
                    hasPaid: false,
                    paidAt: 0
                },
                {
                    _address: debtor3.address,
                    amount: 200,
                    tokenAddress: USDC,
                    name: "debtor3",
                    avatarURL: "",
                    hasPaid: false,
                    paidAt: 0
                },
                {
                    _address: debtor4.address,
                    amount: 200,
                    tokenAddress: DAI,
                    name: "debtor4",
                    avatarURL: "",
                    hasPaid: false,
                    paidAt: 0
                },
                {
                    _address: debtor5.address,
                    amount: 200,
                    tokenAddress: WETH9,
                    name: "debtor5",
                    avatarURL: "",
                    hasPaid: false,
                    paidAt: 0
                },
            ],
        };

        await SplitContract.connect(creator).createExpense(
            expenseObj.name,
            expenseObj.description,
            expenseObj.amount,
            expenseObj.tokenAddress,
            expenseObj.category,
            expenseObj.paymentDue,
            expenseObj.recipient,
            expenseObj.creator,
            expenseObj.debtors
        );

        expect(
            await SplitContract.getNumberOfCreatedExpenses(creator.address)
        ).to.equal(1);
        expect(
            await SplitContract.getNumberOfOwedExpenses(debtor1.address)
        ).to.equal(1);
        expect(
            await SplitContract.getNumberOfOwedExpenses(debtor2.address)
        ).to.equal(1);
        expect(
            await SplitContract.getNumberOfOwedExpenses(debtor3.address)
        ).to.equal(1);
        expect(
            await SplitContract.getNumberOfOwedExpenses(debtor4.address)
        ).to.equal(1);
        expect(
            await SplitContract.getNumberOfOwedExpenses(debtor5.address)
        ).to.equal(1);
    });

    it("Should revert expense creation with 'Expense name is required'", async function () {
        const expenseObj = {
            name: "",
            description: "Spliting expenses among 5 people",
            amount: 1000,
            tokenAddress: DAI,
            paymentDue: Date.now() + TWENTY_FOUR_HRS,
            category: ExpenseCategory.ACCOMODATION,
            recipient: {
                _address: recipient.address,
                name: "recipient",
                avatarURL: "",
            },
            creator: {
                _address: creator.address,
                name: "creator",
                avatarURL: "",
            },
            debtors: [
                {
                    _address: debtor1.address,
                    amount: 200,
                    tokenAddress: DAI,
                    name: "debtor1",
                    avatarURL: "",
                    hasPaid: false,
                    paidAt: 0
                },
                {
                    _address: debtor2.address,
                    amount: 200,
                    tokenAddress: WETH9,
                    name: "debtor2",
                    avatarURL: "",
                    hasPaid: false,
                    paidAt: 0
                },
                {
                    _address: debtor3.address,
                    amount: 200,
                    tokenAddress: USDC,
                    name: "debtor3",
                    avatarURL: "",
                    hasPaid: false,
                    paidAt: 0
                },
                {
                    _address: debtor4.address,
                    amount: 200,
                    tokenAddress: DAI,
                    name: "debtor4",
                    avatarURL: "",
                    hasPaid: false,
                    paidAt: 0
                },
                {
                    _address: debtor5.address,
                    amount: 200,
                    tokenAddress: WETH9,
                    name: "debtor5",
                    avatarURL: "",
                    hasPaid: false,
                    paidAt: 0
                },
            ],
        };

        await expect(
            SplitContract.connect(creator).createExpense(
                expenseObj.name,
                expenseObj.description,
                expenseObj.amount,
                expenseObj.tokenAddress,
                expenseObj.category,
                expenseObj.paymentDue,
                expenseObj.recipient,
                expenseObj.creator,
                expenseObj.debtors
            )
        ).to.revertedWith("Expense name is required");

        expect(
            await SplitContract.getNumberOfCreatedExpenses(creator.address)
        ).to.equal(0);
        expect(
            await SplitContract.getNumberOfOwedExpenses(debtor1.address)
        ).to.equal(0);
        expect(
            await SplitContract.getNumberOfOwedExpenses(debtor2.address)
        ).to.equal(0);
        expect(
            await SplitContract.getNumberOfOwedExpenses(debtor3.address)
        ).to.equal(0);
        expect(
            await SplitContract.getNumberOfOwedExpenses(debtor4.address)
        ).to.equal(0);
        expect(
            await SplitContract.getNumberOfOwedExpenses(debtor5.address)
        ).to.equal(0);
    });

    it("Should revert expense creation with 'amount must be greater than 0'", async function () {
        const expenseObj = {
            name: "Test Bar expense",
            description: "Spliting expenses among 5 people",
            amount: 0,
            tokenAddress: DAI,
            paymentDue: Date.now() + TWENTY_FOUR_HRS,
            category: ExpenseCategory.ACCOMODATION,
            recipient: {
                _address: recipient.address,
                name: "recipient",
                avatarURL: "",
            },
            creator: {
                _address: creator.address,
                name: "creator",
                avatarURL: "",
            },
            debtors: [
                {
                    _address: debtor1.address,
                    amount: 200,
                    tokenAddress: DAI,
                    name: "debtor1",
                    avatarURL: "",
                    hasPaid: false,
                    paidAt: 0
                },
                {
                    _address: debtor2.address,
                    amount: 200,
                    tokenAddress: WETH9,
                    name: "debtor2",
                    avatarURL: "",
                    hasPaid: false,
                    paidAt: 0
                },
                {
                    _address: debtor3.address,
                    amount: 200,
                    tokenAddress: USDC,
                    name: "debtor3",
                    avatarURL: "",
                    hasPaid: false,
                    paidAt: 0
                },
                {
                    _address: debtor4.address,
                    amount: 200,
                    tokenAddress: DAI,
                    name: "debtor4",
                    avatarURL: "",
                    hasPaid: false,
                    paidAt: 0
                },
                {
                    _address: debtor5.address,
                    amount: 200,
                    tokenAddress: WETH9,
                    name: "debtor5",
                    avatarURL: "",
                    hasPaid: false,
                    paidAt: 0
                },
            ],
        };

        await expect(
            SplitContract.connect(creator).createExpense(
                expenseObj.name,
                expenseObj.description,
                expenseObj.amount,
                expenseObj.tokenAddress,
                expenseObj.category,
                expenseObj.paymentDue,
                expenseObj.recipient,
                expenseObj.creator,
                expenseObj.debtors
            )
        ).to.revertedWith("amount must be greater than 0");

        expect(
            await SplitContract.getNumberOfCreatedExpenses(creator.address)
        ).to.equal(0);
        expect(
            await SplitContract.getNumberOfOwedExpenses(debtor1.address)
        ).to.equal(0);
        expect(
            await SplitContract.getNumberOfOwedExpenses(debtor2.address)
        ).to.equal(0);
        expect(
            await SplitContract.getNumberOfOwedExpenses(debtor3.address)
        ).to.equal(0);
        expect(
            await SplitContract.getNumberOfOwedExpenses(debtor4.address)
        ).to.equal(0);
        expect(
            await SplitContract.getNumberOfOwedExpenses(debtor5.address)
        ).to.equal(0);
    });

    it("should get created expenses", async function () {
        const expenseObj = {
            name: "Test Bar expense",
            description: "Spliting expenses among 5 people",
            amount: 1000,
            tokenAddress: DAI,
            paymentDue: Date.now() + TWENTY_FOUR_HRS,
            category: ExpenseCategory.ACCOMODATION,
            recipient: {
                _address: recipient.address,
                name: "recipient",
                avatarURL: "",
            },
            creator: {
                _address: creator.address,
                name: "creator",
                avatarURL: "",
            },
            debtors: [
                {
                    _address: debtor1.address,
                    amount: 200,
                    tokenAddress: DAI,
                    name: "debtor1",
                    avatarURL: "",
                    hasPaid: false,
                    paidAt: 0
                },
                {
                    _address: debtor2.address,
                    amount: 200,
                    tokenAddress: WETH9,
                    name: "debtor2",
                    avatarURL: "",
                    hasPaid: false,
                    paidAt: 0
                },
                {
                    _address: debtor3.address,
                    amount: 200,
                    tokenAddress: USDC,
                    name: "debtor3",
                    avatarURL: "",
                    hasPaid: false,
                    paidAt: 0
                },
                {
                    _address: debtor4.address,
                    amount: 200,
                    tokenAddress: DAI,
                    name: "debtor4",
                    avatarURL: "",
                    hasPaid: false,
                    paidAt: 0
                },
                {
                    _address: debtor5.address,
                    amount: 200,
                    tokenAddress: WETH9,
                    name: "debtor5",
                    avatarURL: "",
                    hasPaid: false,
                    paidAt: 0
                },
            ],
        };

        await SplitContract.connect(creator).createExpense(
            expenseObj.name,
            expenseObj.description,
            expenseObj.amount,
            expenseObj.tokenAddress,
            expenseObj.category,
            expenseObj.paymentDue,
            expenseObj.recipient,
            expenseObj.creator,
            expenseObj.debtors
        );

        const numberOfCreatedExpenses =
            await SplitContract.getNumberOfCreatedExpenses(creator.address);

        for (let idx = 0; idx < numberOfCreatedExpenses; idx++) {
            result = await SplitContract.getCreatedExpense(creator.address, idx);

            expect(result).to.include("Test Bar expense");
            expect(result).to.include("Spliting expenses among 5 people");
            expect(result).to.include(DAI);
        }
    });

    it("should get owed expenses", async function () {
        const expenseObj = {
            name: "Test Bar expense",
            description: "Spliting expenses among 5 people",
            amount: 1000,
            tokenAddress: DAI,
            paymentDue: Date.now() + TWENTY_FOUR_HRS,
            category: ExpenseCategory.ACCOMODATION,
            recipient: {
                _address: recipient.address,
                name: "recipient",
                avatarURL: "",
            },
            creator: {
                _address: creator.address,
                name: "creator",
                avatarURL: "",
            },
            debtors: [
                {
                    _address: debtor1.address,
                    amount: 200,
                    tokenAddress: DAI,
                    name: "debtor1",
                    avatarURL: "",
                    hasPaid: false,
                    paidAt: 0
                },
                {
                    _address: debtor2.address,
                    amount: 200,
                    tokenAddress: WETH9,
                    name: "debtor2",
                    avatarURL: "",
                    hasPaid: false,
                    paidAt: 0
                },
                {
                    _address: debtor3.address,
                    amount: 200,
                    tokenAddress: USDC,
                    name: "debtor3",
                    avatarURL: "",
                    hasPaid: false,
                    paidAt: 0
                },
                {
                    _address: debtor4.address,
                    amount: 200,
                    tokenAddress: DAI,
                    name: "debtor4",
                    avatarURL: "",
                    hasPaid: false,
                    paidAt: 0
                },
                {
                    _address: debtor5.address,
                    amount: 200,
                    tokenAddress: WETH9,
                    name: "debtor5",
                    avatarURL: "",
                    hasPaid: false,
                    paidAt: 0
                },
            ],
        };

        await SplitContract.connect(creator).createExpense(
            expenseObj.name,
            expenseObj.description,
            expenseObj.amount,
            expenseObj.tokenAddress,
            expenseObj.category,
            expenseObj.paymentDue,
            expenseObj.recipient,
            expenseObj.creator,
            expenseObj.debtors
        );

        const numberOfOwedExpenses =
            await SplitContract.getNumberOfOwedExpenses(debtor1.address);

        for (let idx = 0; idx < numberOfOwedExpenses; idx++) {
            result = await SplitContract.getOwedExpense(debtor1.address, idx);

            expect(result).to.include("Test Bar expense");
            expect(result).to.include("Spliting expenses among 5 people");
        }
    });

    it("Should puase contract", async function () {
        await SplitContract.connect(owner).pauseContract(true);
    });

    it("Should revert with 'Ownable: caller is not the owner' ", async function () {
        await expect(
            SplitContract.connect(issuerContract).pauseContract(true)
        ).to.revertedWith("Ownable: caller is not the owner");
    });
});
