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

describe("Integrated Testing", function () {
    let SplitContract;
    let SwapContract;
    let mockSwapContract;
    let LPTokenContract;
    let wrappedMaticContract;

    let owner;
    let issuer;
    let creator;
    let recipient;
    let debtor1;
    let debtor2;
    let debtor3;
    let debtor4;
    let debtor5;

    let recipientTokenContract;
    let debtor1TokenContract;
    let debtor2TokenContract;
    let debtor3TokenContract;
    let debtor4TokenContract;
    let debtor5TokenContract;

    const WMATIC_TOKEN = process.env.WMATIC_POLYGON;
    const recipientToken = process.env.USDC_POLYGON_CROSSCHAIN;
    const debtor1Token = process.env.USDT_POLYGON_CROSSCHAIN;
    const debtor2Token = process.env.DAI_POLYGON;
    const debtor3Token = process.env.WMATIC_POLYGON;
    const debtor4Token = process.env.WETH_POLYGON;
    const debtor5Token = process.env.WBTC_POLYGON;

    const fee = 3000;

    beforeEach(async function () {
        [
            owner,
            issuer,
            recipient,
            creator,
            debtor1,
            debtor2,
            debtor3,
            debtor4,
            debtor5,
        ] = await ethers.getSigners();

        const splitContract = await ethers.getContractFactory("Split");
        const lpTokenContract = await ethers.getContractFactory("LPToken");
        const swapContract = await ethers.getContractFactory("Swap");

        SplitContract = await splitContract.deploy();
        await SplitContract.deployed();

        LPTokenContract = await lpTokenContract.deploy(SplitContract.address);
        await LPTokenContract.deployed();

        SwapContract = await swapContract.deploy(SplitContract.address);
        await SwapContract.deployed();

        mockSwapContract = await swapContract.deploy(issuer.address);
        await mockSwapContract.deployed();

        SplitContract.setSwapContractAddress(SwapContract.address);
        SplitContract.setlpTokenContractAddress(LPTokenContract.address);

        recipientTokenContract = await ethers.getContractAt(
            "IERC20",
            recipientToken
        );

        wrappedMaticContract = await ethers.getContractAt("IWTK", WMATIC_TOKEN);

        [
            debtor1TokenContract,
            debtor2TokenContract,
            debtor3TokenContract,
            debtor4TokenContract,
            debtor5TokenContract,
        ] = await Promise.all([
            ethers.getContractAt("IWTK", debtor1Token),
            ethers.getContractAt("IWTK", debtor2Token),
            ethers.getContractAt("IWTK", debtor3Token),
            ethers.getContractAt("IWTK", debtor4Token),
            ethers.getContractAt("IWTK", debtor5Token),
        ]);
    });

    it("Should create an expense", async function () {
        const expenseObj = {
            name: "Test Bar expense",
            description: "Spliting expenses among 5 people",
            amount: 1000,
            tokenAddress: recipientToken,
            paymentDue: Date.now() + TWENTY_FOUR_HRS,
            category: ExpenseCategory.ACCOMODATION,
            recipient: {
                _address: recipient.address,
            },
            creator: {
                _address: creator.address,
            },
            debtors: [
                {
                    _address: debtor1.address,
                    amount: 200,
                    tokenAddress: debtor1Token,
                    hasPaid: false,
                    paidAt: 0,
                },
                {
                    _address: debtor2.address,
                    amount: 200,
                    tokenAddress: debtor2Token,
                    hasPaid: false,
                    paidAt: 0,
                },
                {
                    _address: debtor3.address,
                    amount: 200,
                    tokenAddress: debtor3Token,
                    hasPaid: false,
                    paidAt: 0,
                },
                {
                    _address: debtor4.address,
                    amount: 200,
                    tokenAddress: debtor4Token,
                    hasPaid: false,
                    paidAt: 0,
                },
                {
                    _address: debtor5.address,
                    amount: 200,
                    tokenAddress: debtor5Token,
                    hasPaid: false,
                    paidAt: 0,
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

        const [
            creator_exp_count,
            debtor1_exp_count,
            debtor2_exp_count,
            debtor3_exp_count,
            debtor4_exp_count,
            debtor5_exp_count,
        ] = await Promise.all([
            SplitContract.getNumberOfCreatedExpenses(creator.address),
            SplitContract.getNumberOfOwedExpenses(debtor1.address),
            SplitContract.getNumberOfOwedExpenses(debtor2.address),
            SplitContract.getNumberOfOwedExpenses(debtor3.address),
            SplitContract.getNumberOfOwedExpenses(debtor4.address),
            SplitContract.getNumberOfOwedExpenses(debtor5.address),
        ]);

        expect(creator_exp_count).to.equal(1);
        expect(debtor1_exp_count).to.equal(1);
        expect(debtor2_exp_count).to.equal(1);
        expect(debtor3_exp_count).to.equal(1);
        expect(debtor4_exp_count).to.equal(1);
        expect(debtor5_exp_count).to.equal(1);
    });

    it("Should revert expense creation with 'Expense name is required'", async function () {
        const expenseObj = {
            name: "",
            description: "Spliting expenses among 5 people",
            amount: 1000,
            tokenAddress: recipientToken,
            paymentDue: Date.now() + TWENTY_FOUR_HRS,
            category: ExpenseCategory.ACCOMODATION,
            recipient: {
                _address: recipient.address,
            },
            creator: {
                _address: creator.address,
            },
            debtors: [
                {
                    _address: debtor1.address,
                    amount: 200,
                    tokenAddress: debtor1Token,
                    hasPaid: false,
                    paidAt: 0,
                },
                {
                    _address: debtor2.address,
                    amount: 200,
                    tokenAddress: debtor2Token,
                    hasPaid: false,
                    paidAt: 0,
                },
                {
                    _address: debtor3.address,
                    amount: 200,
                    tokenAddress: debtor3Token,
                    hasPaid: false,
                    paidAt: 0,
                },
                {
                    _address: debtor4.address,
                    amount: 200,
                    tokenAddress: debtor4Token,
                    hasPaid: false,
                    paidAt: 0,
                },
                {
                    _address: debtor5.address,
                    amount: 200,
                    tokenAddress: debtor5Token,
                    hasPaid: false,
                    paidAt: 0,
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
            tokenAddress: recipientToken,
            paymentDue: Date.now() + TWENTY_FOUR_HRS,
            category: ExpenseCategory.ACCOMODATION,
            recipient: {
                _address: recipient.address,
            },
            creator: {
                _address: creator.address,
            },
            debtors: [
                {
                    _address: debtor1.address,
                    amount: 200,
                    tokenAddress: debtor1Token,
                    hasPaid: false,
                    paidAt: 0,
                },
                {
                    _address: debtor2.address,
                    amount: 200,
                    tokenAddress: debtor2Token,
                    hasPaid: false,
                    paidAt: 0,
                },
                {
                    _address: debtor3.address,
                    amount: 200,
                    tokenAddress: debtor3Token,
                    hasPaid: false,
                    paidAt: 0,
                },
                {
                    _address: debtor4.address,
                    amount: 200,
                    tokenAddress: debtor4Token,
                    hasPaid: false,
                    paidAt: 0,
                },
                {
                    _address: debtor5.address,
                    amount: 200,
                    tokenAddress: debtor5Token,
                    hasPaid: false,
                    paidAt: 0,
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
            tokenAddress: recipientToken,
            paymentDue: Date.now() + TWENTY_FOUR_HRS,
            category: ExpenseCategory.ACCOMODATION,
            recipient: {
                _address: recipient.address,
            },
            creator: {
                _address: creator.address,
            },
            debtors: [
                {
                    _address: debtor1.address,
                    amount: 200,
                    tokenAddress: debtor1Token,
                    hasPaid: false,
                    paidAt: 0,
                },
                {
                    _address: debtor2.address,
                    amount: 200,
                    tokenAddress: debtor2Token,
                    hasPaid: false,
                    paidAt: 0,
                },
                {
                    _address: debtor3.address,
                    amount: 200,
                    tokenAddress: debtor3Token,
                    hasPaid: false,
                    paidAt: 0,
                },
                {
                    _address: debtor4.address,
                    amount: 200,
                    tokenAddress: debtor4Token,
                    hasPaid: false,
                    paidAt: 0,
                },
                {
                    _address: debtor5.address,
                    amount: 200,
                    tokenAddress: debtor5Token,
                    hasPaid: false,
                    paidAt: 0,
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
            result = await SplitContract.getCreatedExpense(
                creator.address,
                idx
            );

            expect(result).to.include("Test Bar expense");
            expect(result).to.include("Spliting expenses among 5 people");
            expect(result).to.include(recipientToken);
        }
    });

    it("should get owed expenses", async function () {
        const expenseObj = {
            name: "Test Bar expense",
            description: "Spliting expenses among 5 people",
            amount: 1000,
            tokenAddress: recipientToken,
            paymentDue: Date.now() + TWENTY_FOUR_HRS,
            category: ExpenseCategory.ACCOMODATION,
            recipient: {
                _address: recipient.address,
            },
            creator: {
                _address: creator.address,
            },
            debtors: [
                {
                    _address: debtor1.address,
                    amount: 200,
                    tokenAddress: debtor1Token,
                    hasPaid: false,
                    paidAt: 0,
                },
                {
                    _address: debtor2.address,
                    amount: 200,
                    tokenAddress: debtor2Token,
                    hasPaid: false,
                    paidAt: 0,
                },
                {
                    _address: debtor3.address,
                    amount: 200,
                    tokenAddress: debtor3Token,
                    hasPaid: false,
                    paidAt: 0,
                },
                {
                    _address: debtor4.address,
                    amount: 200,
                    tokenAddress: debtor4Token,
                    hasPaid: false,
                    paidAt: 0,
                },
                {
                    _address: debtor5.address,
                    amount: 200,
                    tokenAddress: debtor5Token,
                    hasPaid: false,
                    paidAt: 0,
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
            SplitContract.connect(debtor1).pauseContract(true)
        ).to.revertedWith("Ownable: caller is not the owner");
    });

    it("Should use debtor tokens  pay recipient tokens", async function () {
        const amountIn = 1000n * 10n ** 18n;

        const expenseObj = {
            name: "Test Bar expense",
            description: "Spliting expenses among 5 people",
            amount: 1000,
            tokenAddress: recipientToken,
            paymentDue: Date.now() + TWENTY_FOUR_HRS,
            category: ExpenseCategory.ACCOMODATION,
            recipient: {
                _address: recipient.address,
            },
            creator: {
                _address: creator.address,
            },
            debtors: [
                {
                    _address: debtor1.address,
                    amount: 200,
                    tokenAddress: debtor1Token,
                    hasPaid: false,
                    paidAt: 0,
                },
                {
                    _address: debtor2.address,
                    amount: 200,
                    tokenAddress: debtor2Token,
                    hasPaid: false,
                    paidAt: 0,
                },
                {
                    _address: debtor3.address,
                    amount: 200,
                    tokenAddress: debtor3Token,
                    hasPaid: false,
                    paidAt: 0,
                },
                {
                    _address: debtor4.address,
                    amount: 200,
                    tokenAddress: debtor4Token,
                    hasPaid: false,
                    paidAt: 0,
                },
                {
                    _address: debtor5.address,
                    amount: 200,
                    tokenAddress: debtor5Token,
                    hasPaid: false,
                    paidAt: 0,
                },
            ],
        };

        // create expense
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

        //check for created expense
        const [
            creator_expenses,
            debtor1_debts,
            debtor2_debts,
            debtor3_debts,
            debtor4_debts,
            debtor5_debts,
        ] = await Promise.all([
            SplitContract.getNumberOfCreatedExpenses(creator.address),
            SplitContract.getNumberOfOwedExpenses(debtor1.address),
            SplitContract.getNumberOfOwedExpenses(debtor2.address),
            SplitContract.getNumberOfOwedExpenses(debtor3.address),
            SplitContract.getNumberOfOwedExpenses(debtor4.address),
            SplitContract.getNumberOfOwedExpenses(debtor5.address),
        ]);

        expect(creator_expenses).to.equal(1);
        expect(debtor1_debts).to.equal(1);
        expect(debtor2_debts).to.equal(1);
        expect(debtor3_debts).to.equal(1);
        expect(debtor4_debts).to.equal(1);
        expect(debtor5_debts).to.equal(1);

        // deposit wrapped tokens into WMATIC contract
        await Promise.all([
            wrappedMaticContract.connect(debtor1).deposit({ value: amountIn }),
            wrappedMaticContract.connect(debtor2).deposit({ value: amountIn }),
            wrappedMaticContract.connect(debtor3).deposit({ value: amountIn }),
            wrappedMaticContract.connect(debtor4).deposit({ value: amountIn }),
            wrappedMaticContract.connect(debtor5).deposit({ value: amountIn }),
        ]);

        // approve wrapped `mockSwapContract` to spend allowance
        await Promise.all([
            wrappedMaticContract
                .connect(debtor1)
                .approve(mockSwapContract.address, amountIn),
            wrappedMaticContract
                .connect(debtor2)
                .approve(mockSwapContract.address, amountIn),
            wrappedMaticContract
                .connect(debtor3)
                .approve(mockSwapContract.address, amountIn),
            wrappedMaticContract
                .connect(debtor4)
                .approve(mockSwapContract.address, amountIn),
            wrappedMaticContract
                .connect(debtor5)
                .approve(mockSwapContract.address, amountIn),
        ]);

        // swap matic tokens for various debtor tokens (USDT|DAI|WMATIC|WETH|WBTC)
        await Promise.all([
            mockSwapContract
                .connect(issuer)
                .swapExactInputSingle(
                    WMATIC_TOKEN,
                    debtor1Token,
                    debtor1.address,
                    debtor1.address,
                    fee,
                    amountIn
                ),
            mockSwapContract
                .connect(issuer)
                .swapExactInputSingle(
                    WMATIC_TOKEN,
                    debtor2Token,
                    debtor2.address,
                    debtor2.address,
                    fee,
                    amountIn
                ),
            //debtor3 works with wmatic token so no need to convert
            // await mockSwapContract.connect(issuer).swapExactInputSingle(WMATIC_TOKEN,debtor3Token,debtor3.address,debtor3.address,fee,amountIn);
            mockSwapContract
                .connect(issuer)
                .swapExactInputSingle(
                    WMATIC_TOKEN,
                    debtor4Token,
                    debtor4.address,
                    debtor4.address,
                    fee,
                    amountIn
                ),
            mockSwapContract
                .connect(issuer)
                .swapExactInputSingle(
                    WMATIC_TOKEN,
                    debtor5Token,
                    debtor5.address,
                    debtor5.address,
                    fee,
                    amountIn
                ),
        ]);

        // check if debtor account got various tokens (USDT|DAI|WMATIC|WETH|WBTC)
        const [
            debtor1_tokens,
            debtor2_tokens,
            debtor3_tokens,
            debtor4_tokens,
            debtor5_tokens,
        ] = await Promise.all([
            debtor1TokenContract.balanceOf(debtor1.address),
            debtor2TokenContract.balanceOf(debtor2.address),
            debtor3TokenContract.balanceOf(debtor3.address),
            debtor4TokenContract.balanceOf(debtor4.address),
            debtor5TokenContract.balanceOf(debtor5.address),
        ]);

        expect(debtor1_tokens).to.greaterThan(0);
        expect(debtor2_tokens).to.greaterThan(0);
        expect(debtor3_tokens).to.greaterThan(0);
        expect(debtor4_tokens).to.greaterThan(0);
        expect(debtor5_tokens).to.greaterThan(0);

        // use various tokens to pay for split expenses (USDT|DAI|WMATIC|WETH|WBTC)
        // approve swap contract allowance
        await Promise.all([
            debtor1TokenContract
                .connect(debtor1)
                .approve(SwapContract.address, debtor1_tokens),
            debtor2TokenContract
                .connect(debtor2)
                .approve(SwapContract.address, debtor2_tokens),
            debtor3TokenContract
                .connect(debtor3)
                .approve(SwapContract.address, debtor3_tokens),
            debtor4TokenContract
                .connect(debtor4)
                .approve(SwapContract.address, debtor4_tokens),
            debtor5TokenContract
                .connect(debtor5)
                .approve(SwapContract.address, debtor5_tokens),
        ]);

        // issue payments
        await Promise.all([
            SplitContract.connect(debtor1).payDebt(
                debtor1Token,
                fee,
                debtor1_tokens,
                0
            ),
            SplitContract.connect(debtor2).payDebt(
                debtor2Token,
                fee,
                debtor2_tokens,
                0
            ),
            SplitContract.connect(debtor3).payDebt(
                debtor3Token,
                fee,
                debtor3_tokens,
                0
            ),
            SplitContract.connect(debtor4).payDebt(
                debtor4Token,
                fee,
                debtor4_tokens,
                0
            ),
            SplitContract.connect(debtor5).payDebt(
                debtor5Token,
                fee,
                debtor5_tokens,
                0
            ),
        ]);

        const amountReceived = await recipientTokenContract.balanceOf(
            recipient.address
        );

        expect(amountReceived ).to.greaterThan(0);
    });
});
