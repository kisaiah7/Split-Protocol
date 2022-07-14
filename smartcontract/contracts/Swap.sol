//SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;
pragma abicoder v2;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Swap is Ownable {
    bool _pauseContract = false;

    // set the pool fee to 0.3%.
    uint24 public constant poolFee = 3000;

    // Uniswap router instance
    ISwapRouter public constant swapRouter =
        ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);

    address internal IssuerContract;

    address public constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address public constant WETH9 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address public constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;

    modifier onlyIssuerContract() {
        require(
            msg.sender == IssuerContract,
            "Invalid operation. Not authorized"
        );
        _;
    }

    modifier notPaused() {
        require(!_pauseContract, "Contract is paused");
        _;
    }

    constructor(address _issuerContract) {
        IssuerContract = _issuerContract;
    }

    function swapExactOutputSingle(
        uint amountOut,
        uint amountInMaximum,
        address _depositorAddress,
        address fromAssetAddress,
        address toAssetAddress
    ) external onlyIssuerContract notPaused returns (uint amountUsed) {
        require(isValidAssetAddress(fromAssetAddress), "Invalid asset address");
        require(isValidAssetAddress(toAssetAddress), "Invalid asset address");
        require(_depositorAddress != address(0), "Invalid _depositorAddress");

        // Transfer `amountInMaximum` from `msg.sender`
        TransferHelper.safeTransferFrom(
            fromAssetAddress,
            msg.sender,
            address(this),
            amountInMaximum
        );

        // Approve `swapRouter` to spend `amountInMaximum`
        TransferHelper.safeApprove(
            fromAssetAddress,
            address(swapRouter),
            amountInMaximum
        );

        // Swap configuration struct
        ISwapRouter.ExactOutputSingleParams memory params = ISwapRouter
            .ExactOutputSingleParams({
                tokenIn: fromAssetAddress,
                tokenOut: toAssetAddress,
                fee: poolFee,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountOut: amountOut,
                amountInMaximum: amountInMaximum,
                sqrtPriceLimitX96: 0
            });

        // Execute swap and returned the amount used
        amountUsed = swapRouter.exactOutputSingle(params);

        // if all the amountInMaximum was used up return;
        if (amountUsed == amountInMaximum) {
            return amountUsed;
        }

        //Return remaining amount used to `msg.sender`
        //Remove swapRouter allowance by setting it to 0
        TransferHelper.safeApprove(fromAssetAddress, address(swapRouter), 0);

        //Transfer the amount left to the `_depositorAddress` which sent the tokens to the issuer contract
        TransferHelper.safeTransfer(
            fromAssetAddress,
            _depositorAddress,
            amountInMaximum - amountUsed
        );
    }

    function isValidAssetAddress(address _assetAddress) pure returns (bool) {
        if (
            _assetAddress == DAI ||
            _assetAddress == WETH9 ||
            _assetAddress == USDC
        ) {
            return true;
        }
        return false;
    }

    function setIssuerContract(address _issuerContract) external onlyOwner {
        require(IssuerContract != address(0), "Invalid address");
        IssuerContract = _issuerContract;
    }

    function pauseContract(bool status) external onlyOwner {
        _pauseContract = status;
    }
}
