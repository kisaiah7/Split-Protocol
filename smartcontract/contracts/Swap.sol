//SPDX-License-Identifier: MIT
pragma solidity >=0.7.6;
pragma abicoder v2;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Swap is Ownable {
    bool _pauseContract = false;

    // Uniswap router instance
    ISwapRouter public constant swapRouter =
        ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);

    address internal IssuerContract;

    address USDT_MUMBAI=
        0x3813e82e6f7098b9583FC0F33a962D02018B6803;
    address USDC_MUMBAI =
        0xe11A86849d99F524cAC3E7A0Ec1241828e332C62;
    address DAI_MUMBAI = 0xd393b1E02dA9831Ff419e22eA105aAe4c47E1253;
    address WMATIC_MUMBAI = 0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889;
    address WETH_MUMBAI = 0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa;
    // address WBTC_POLYGON = 0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6;

    modifier onlyIssuerContract() {
        require(
            msg.sender == IssuerContract,
            "Invalid operation. Not Issuer"
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

    function swapExactInputSingle(
        address fromAsset,
        address toAsset,
        address sender,
        address recipient,
        uint24 poolFee,
        uint256 amountIn
    ) external onlyIssuerContract notPaused returns (uint amountOut) {
        // Transfer the specified amount of fromAsset to this contract
        TransferHelper.safeTransferFrom(
            fromAsset,
            sender,
            address(this),
            amountIn
        );

        // Approve the router to spend fromAsset
        TransferHelper.safeApprove(fromAsset, address(swapRouter), amountIn);

        // Naively set amountOutMinimum to 0. In production, use an oracle or other data source to choose a safer value for amountOutMinimum.
        // We also set the sqrtPriceLimitx96 to be 0 to ensure we swap our exact input amount. This can be  used to set the limit for the price the swap will push the pool to,
        // which can help protect against price impact or for setting up logic in a variety of price-relevant mechanisms
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: fromAsset,
                tokenOut: toAsset,
                fee: poolFee,
                recipient: recipient,
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        // The call to `exactInputSingle` executes the swap.
        amountOut = swapRouter.exactInputSingle(params);
    }

    function isValidAssetAddress(address _assetAddress)
        public
        view
        returns (bool)
    {
        if (
            _assetAddress == USDT_MUMBAI||
            _assetAddress == USDC_MUMBAI ||
            _assetAddress == DAI_MUMBAI||
            _assetAddress == WMATIC_MUMBAI ||
            _assetAddress ==WETH_MUMBAI // ||
            // _assetAddress == WBTC_POLYGON
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
