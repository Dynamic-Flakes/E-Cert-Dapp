pragma solidity >=0.4.22 <0.8.0;

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 * Provides onlyOwner modifier, which prevents function from running if it is called by anyone other than the owner.
 */
contract Ownable {
    address public contractOwner;

    // event for EVM logging
    event OwnerSet(address indexed oldOwner, address indexed newOwner);

    /**
     * @dev The Ownable constructor sets the original `owner` of the contract to the sender
     * account.
     */
    constructor() public {
        contractOwner = msg.sender;
        emit OwnerSet(address(0), contractOwner);
    }

    // Events
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(isOwner(), "Access Denied");
        _;
    }

    function isOwner() public view returns (bool) {
        return msg.sender == contractOwner;
    }
}
