const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("LPToken", function () {
    let LPTokenContract;
    let owner;
    let issuerContract;
    let acc1;

    this.beforeEach(async function () {
        [owner, issuerContract, acc1] = await ethers.getSigners();
        const contract = await ethers.getContractFactory("LPToken");
        LPTokenContract = await contract.deploy(issuerContract.address);


        await LPTokenContract.deployed();
    });

	it("Should mint tokens", async function () {
		expect(await LPTokenContract.balanceOf(acc1.address)).to.equal(0);

		await LPTokenContract.connect(issuerContract).mintTokens(acc1.address, 100);

		expect(await LPTokenContract.balanceOf(acc1.address)).to.equal(100);
	});

	it("Should burn tokens", async function () {
		expect(await LPTokenContract.balanceOf(acc1.address)).to.equal(0);
		
		await LPTokenContract.connect(issuerContract).mintTokens(acc1.address, 100);
		
		expect(await LPTokenContract.balanceOf(acc1.address)).to.equal(100);
		
		await LPTokenContract.connect(issuerContract).burnTokens(acc1.address, 100);

		expect(await LPTokenContract.balanceOf(acc1.address)).to.equal(0);
	});

	it("Should revert with 'Invalid operation. Not authorized'", async function (){
		expect(await LPTokenContract.balanceOf(acc1.address)).to.equal(0);

		await expect(LPTokenContract.connect(owner).mintTokens(acc1.address, 100)).to.revertedWith("Invalid operation. Not authorized");
	})

	it("Should revert with 'Contract is paused' ", async function(){
		await LPTokenContract.connect(owner).pauseContract(true);

		await expect(LPTokenContract.connect(issuerContract).mintTokens(acc1.address, 100)).to.revertedWith("Contract is paused");
		await expect(LPTokenContract.connect(issuerContract).burnTokens(acc1.address, 100)).to.revertedWith("Contract is paused");
	});
	
	it("Should revert with 'Ownable: caller is not the owner' ", async function(){
		
		await expect(LPTokenContract.connect(issuerContract).pauseContract(true)).to.revertedWith("Ownable: caller is not the owner");
	});


});
