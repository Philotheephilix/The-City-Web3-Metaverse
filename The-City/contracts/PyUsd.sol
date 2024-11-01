pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PYUSD is ERC20, Ownable {
    uint8 private constant _decimals = 6;

    constructor(address initialOwner) 
        ERC20("PayPal USD", "PYUSD") 
        Ownable(initialOwner)
    {
        // Mint 1000 PYUSD to contract deployer for testing
        _mint(msg.sender, 1000 * 10**_decimals);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function decimals() public pure override returns (uint8) {
        return _decimals;
    }
}
