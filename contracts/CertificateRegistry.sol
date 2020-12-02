pragma solidity >=0.4.22 <0.8.0;

import "./Ownable.sol";

contract CertificateRegistry is Ownable {
    /**
     * The Certificate Document info structure: every certificate info is composed of:
     * - documentHash: Hash of the document generated off-chain
     * - issuer: account of the institution that issue the document
     * - timeOfIssue - time the document hash was stored.
     */
    struct DocumentInfo {
        address issuer;
        string documentHash;
        uint256 timeOfIssue;
        bool isStored;
    }

    /*
      A mapping of the hash value to each student documentInfo
      This mapping is used to keep track of every certification document initiated for every student by an educator.
     */
    mapping(string => DocumentInfo) private documentRegistry;

    // event for EVM logging
    event NewHashStored(
        address indexed issuer,
        string documentHash,
        uint256 timeOfIssue,
        bool isStored
    );

    modifier HashAlreadyExist(string memory _docHash) {
        require(
            isHashStored(_docHash),
            "Error: this hash already exists in contract"
        );
        _;
    }

    /*
     * Record a new hash request on behalf of a student
     * The sender of message call is the educator itself
     * @param {string} _document Hash of the sutuednt submitted for storage on-chain
     */
    function storeHash(string memory _documentHash)
        public
        HashAlreadyExist(_documentHash)
    {
        require(bytes(_documentHash).length == 46);

        DocumentInfo memory docInfo = DocumentInfo({
            documentHash: _documentHash,
            issuer: msg.sender,
            timeOfIssue: block.number,
            isStored: true
        });

        documentRegistry[_documentHash] = docInfo;

        // creates the event, to be used to query all the store hash of the certificates
        emit NewHashStored(msg.sender, _documentHash, block.number, true);
    }

    function verifyCertificate(string memory _documenteHash)
        public
        view
        returns (bool)
    {
        require(bytes(_documenteHash).length == 46);

        bool test = stringsEqual(
            documentRegistry[_documenteHash].documentHash,
            _documenteHash
        );
        if (test) {
            return true;
        }
        return false;
    }

    function getCertificateInfo(string memory _hash)
        public
        view
        returns (
            string memory,
            address,
            uint256,
            bool
        )
    {
        return (
            documentRegistry[_hash].documentHash,
            documentRegistry[_hash].issuer,
            documentRegistry[_hash].timeOfIssue,
            documentRegistry[_hash].isStored
        );
    }

    function isHashStored(string memory _documentHash)
        internal
        view
        returns (bool)
    {
        return documentRegistry[_documentHash].isStored == false;
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

    // Note, swithc string to bytes32 to reduce gas cost if the file is hashed with         institutionHash = keccak256(abi.encodePacked(block.number, now, msg.data));
}
