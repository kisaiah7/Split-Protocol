const { ethers } = require("hardhat");
const { expect } = require("chai");
require("dotenv").config({ path: ".env" });

describe("Swap", function () {
    let SwapContract;
    let token0Contract;
    let token1Contract;

    let owner;
    let issuer;
    let sender;
    let recipient;

    const token0 = process.env.WMATIC_POLYGON;
    const token1 = process.env.USDC_POLYGON_CROSSCHAIN;
    const fee = 3000;

    before(async function () {
        token0Contract = await ethers.getContractAt("IWTK", token0);
        token1Contract = await ethers.getContractAt("IERC20", token1);

        [owner, issuer, sender, recipient] = await ethers.getSigners();

        const swapContract = await ethers.getContractFactory("Swap");
        SwapContract = await swapContract.deploy(issuer.address);
        await SwapContract.deployed();
    });

    it("Should swap mamtic for dai", async function () {
        const amountIn = 100n * 10n ** 18n;

        expect(await token0Contract.balanceOf(SwapContract.address)).to.equal(
            0
        );

        await token0Contract.connect(sender).deposit({ value: amountIn });
        await token0Contract
            .connect(sender)
            .approve(SwapContract.address, amountIn);

       await SwapContract.connect(issuer).swapExactInputSingle(
            token0,
            token1,
            sender.address,
            recipient.address,
            fee,
            amountIn
        );

        const amountOut = await token1Contract.balanceOf(recipient.address);

        expect(amountOut).to.greaterThan(0);
    });

    it("Should revert with 'Invalid operation. Not Issuer'", async function () {
        const amountIn = 100n * 10n ** 18n;

        expect(await token0Contract.balanceOf(SwapContract.address)).to.equal(
            0
        );

        await token0Contract.connect(sender).deposit({ value: amountIn });
        await token0Contract
            .connect(sender)
            .approve(SwapContract.address, amountIn);

       await expect( SwapContract.connect(owner).swapExactInputSingle(
            token0,
            token1,
            sender.address,
            recipient.address,
            fee,
            amountIn
        )).to.revertedWith('Invalid operation. Not Issuer')
    });

    it("Should revert with 'Contract is paused'", async function () {
        const amountIn = 100n * 10n ** 18n;

        await SwapContract.pauseContract(true);

        expect(await token0Contract.balanceOf(SwapContract.address)).to.equal(
            0
        );

        await token0Contract.connect(sender).deposit({ value: amountIn });
        await token0Contract
            .connect(sender)
            .approve(SwapContract.address, amountIn);

       await expect( SwapContract.connect(issuer).swapExactInputSingle(
            token0,
            token1,
            sender.address,
            recipient.address,
            fee,
            amountIn
        )).to.revertedWith('Contract is paused')
    });
});
