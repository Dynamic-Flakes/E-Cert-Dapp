pragma solidity >=0.4.22 <0.8.0;

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 * Provides onlyOwner modifier, which prevents function from running if it is called by anyone other than the owner.
 */
contract Ownable {
    address private contractOwner;
    address private student;
    address private verifier;

    uint256 public value;

    // event for EVM logging
    event OwnerSet(address indexed oldOwner, address indexed newOwner);

    /**
     * @dev The Ownable constructor sets the original `owner` of the contract to the sender
     * account.
     */
    constructor() {
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

    modifier onlyStudent() {
        require(isStudent(), "Only student can call this.");
        _;
    }

    function isOwner() public view returns (bool) {
        return msg.sender == contractOwner;
    }

    function isStudent() public view returns (bool) {
        return msg.sender == student;
    }

    function isVerifier() public view returns (bool) {
        return msg.sender == verifier;
    }
    /*
     * @dev Allows the current owner to transfer control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
      function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0));
       emit  OwnershipTransferred(contractOwner, newOwner);
        contractOwner = newOwner;
      }
}
