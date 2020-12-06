// SPDX-License-Identifier: Apache-2.0

pragma solidity >=0.4.22 <0.8.0;

import "./zeppelin/ownership/Ownable.sol";

contract CertificateRegistry is Ownable {
    /**
     * The Certificate Document info structure: every certificate info is composed of:
     * - documentHash: Hash of the document generated off-chain
     * - issuer: account of the institution that issue the document
     * - timeOfIssue - time the document hash was stored.
    * - isStored - a flag to show that a hash is stored or not.

     */
    struct DocumentInfo {
        address issuer;
        string documentHash;
        uint256 timeOfIssue;
        bool isStored;
    }

    /*
      A mapping of the document hash to the documentinfo that was issued
      This mapping is used to keep track of every certification document initiated for every student by an educator.
     */
    mapping(string => DocumentInfo) public documentRegistry;

    // event for EVM logging
    event LogNewHashStored(
        address indexed issuer,
        string documentHash,
        uint256 timeOfIssue,
        bool isStored
    );

    modifier onlyNotHashed(string memory _documentHash) {
        require(
            !isHashStored(_documentHash),
            "Error: Only hashes that have not been hashed can be stored"
        );
        _;
    }

    modifier onlyHashValueNotEmpty(string memory _documentHash) {
        require(
            bytes(_documentHash).length > 0,
            "Error: Error: hash value should not be empty"
        );
        _;
    }

    /*
     * Record a new hash request on behalf of a student
     * The sender of message call is the educator itself
     * @param {string} _documentHash: Hash of the sutuednt submitted for storage on-chain
     */
    function storeHash(string memory _documentHash)
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
            documentHash: _documentHash,
            issuer: msg.sender,
            timeOfIssue: block.timestamp,
            isStored: true
        });

        documentRegistry[_documentHash] = docInfo;

        // creates the event, to be used to query all the store hash of the certificates
        emit LogNewHashStored(msg.sender, _documentHash, block.number, true);
    }

    function verifyCertificate(string memory _documenteHash)
        public
        view
        onlyHashValueNotEmpty(_documenteHash)
        returns (bool)
    {
        bool test = stringsEqual(
            documentRegistry[_documenteHash].documentHash,
            _documenteHash
        );
        if (test) {
            return true;
        }
        return false;
    }

    function isHashStored(string memory _documentHash)
        internal
        view
        returns (bool)
    {
        return documentRegistry[_documentHash].isStored == true;
    }

    function stringsEqual(string storage _a, string memory _b)
        internal
        view
        returns (bool)
    {
        bytes storage a = bytes(_a);
        bytes memory b = bytes(_b);
        if (a.length != b.length) {
            return false;
        }
        return true;
    }

    // Note, swithc string to bytes32 to reduce gas cost if the file is hashed with institutionHash = keccak256(abi.encodePacked(block.number, now, msg.data));
}
