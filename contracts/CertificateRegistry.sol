// SPDX-License-Identifier: Apache-2.0

pragma solidity >=0.4.22 <0.8.0;

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
        bool isStored;
    }

    /*
      A mapping of the document hash to the documentinfo that was issued
      This mapping is used to keep track of every certification document initiated for every student by an educator.
     */
    mapping(bytes32 => DocumentInfo) public documentRegistry;

    // event for EVM logging
    event LogNewHashStored(
        address indexed issuer,
        uint timeOfIssue,
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
            "Error: ensure educator address exist"
        );
        DocumentInfo memory docInfo = DocumentInfo({
            issuer: msg.sender,
            timeOfIssue: block.timestamp,
            isStored: true
        });

        documentRegistry[_documentHash] = docInfo;

        // creates the event, to be used to query all the store hash of the certificates
        emit LogNewHashStored(msg.sender, block.timestamp, true);
    }

    function verifyHash(bytes32 _documenteHash)
        public
        pure
        returns (bool)
    {
        bool valid = _documenteHash.length > 0;
        if (valid) {
            return true;
        }
        return false;
    }

    function isHashStored(bytes32 _documentHash)
        internal
        view
        returns (bool)
    {
        return documentRegistry[_documentHash].isStored == true;
    }
}
