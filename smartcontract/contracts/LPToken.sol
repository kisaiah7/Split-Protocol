//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LPToken is ERC20, Ownable{

    bool _pauseContract = false;

    address internal IssuerContract;

    modifier onlyIssuerContract{
        require(msg.sender == IssuerContract, "Invalid operation. Not authorized");
        _;
    }

    modifier notPaused {
        require(!_pauseContract, "Contract is paused");
        _;
    }

    
    constructor(address _issuerContract) ERC20("Liquidity Pool Token", "LPT"){
        IssuerContract = _issuerContract;
    }

    function mintTokens(address _account, uint _amount) external onlyIssuerContract notPaused {
        require(_account != address(0), "Invalid address");
        _mint(_account, _amount);
    }

    function burn(address _account, uint _amount) external onlyIssuerContract notPaused {
        require(_account != address(0), "Invalid address");
        _burn(_account, _amount);
    }

    function setIssuerContract(address _issuerContract) external onlyOwner{
        require(IssuerContract != address(0), "Invalid address");
        IssuerContract = _issuerContract;
    }

    function pauseContract(bool status) external onlyOwner {
        _pauseContract = status;
    }
}