// SPDX-License-Identifier: Apache-2.0

pragma solidity >=0.4.22 <0.8.0; //locked compiler

import "./zeppelin/ownership/Ownable.sol";

contract CertificateRegistry is Ownable {
    /**
     * The Certificate Document info structure: every certificate info is composed of:
     * - documentHash: Hash of the document generated off-chain
     * - from: account of the institution that issue the document
    * - isStored - a flag to show that a hash is stored or not.

     */
    struct DocumentInfo {
        address issuer;
        uint256 timeOfIssue;
        uint256 blockNumber;
        bool isStored;
    }

    /*
      A mapping of the document hash to the documentinfo that was issued
      This mapping is used to keep track of every certification document initiated for every student by an educator.
     */
    mapping(bytes32 => DocumentInfo) documentRegistry;

    // event for EVM logging
    event LogNewHashStored(
        address indexed issuer,
        uint256 timeOfIssue,
        uint256 blockNumber,
        bool isStored
    );

    modifier onlyNotHashed(bytes32 _documentHash) {
        require(
            !isHashStored(_documentHash),
            "Error: Only hashes that have not been hashed can be stored"
        );
        _;
    }

    modifier onlyHashValueNotEmpty(bytes32 _documentHash) {
        require(
            _documentHash.length > 0,
            "Error: Error: hash value should not be empty"
        );
        _;
    }

    /*
     * Record a new hash request on behalf of a student
     * The sender of message call is the educator itself
     * @param {string} _documentHash: Hash of the sutuednt submitted for storage on-chain
     */
    function storeHash(bytes32 _documentHash)
        public
        onlyOwner
        onlyHashValueNotEmpty(_documentHash)
        onlyNotHashed(_documentHash)
    {
        require(
            msg.sender != address(0x0),
            "Error: ensure owner address exist"
        );
        DocumentInfo memory newDocInfo =
            DocumentInfo({
                issuer: msg.sender,
                timeOfIssue: block.timestamp,
                blockNumber: block.number,
                isStored: true
            });

        documentRegistry[_documentHash] = newDocInfo;

        emit LogNewHashStored(msg.sender, block.timestamp, block.number, true);
    }

    function verifyCertificateData(bytes32 _documenteHash, uint256 _blockNumber)
        external
        view
        returns (bool)
    {
        bool isVerified = false;

        if (documentRegistry[_documenteHash].blockNumber == _blockNumber) {
            // check if hash exists on blocknumber or not
            if (documentRegistry[_documenteHash].isStored) {
                isVerified = true;
                return isVerified;
            }
        }
        return isVerified;
    }

    function isHashStored(bytes32 _documentHash) internal view returns (bool) {
        return documentRegistry[_documentHash].isStored;
    }
}
