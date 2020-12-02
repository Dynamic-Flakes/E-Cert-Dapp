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
      A mapping each student document to their ID
      This mapping is used to keep track of every certification document initiated for every student by an educator.
     */
    mapping(string => DocumentInfo) private documentRegistry;

    // event for EVM logging
    event HashAdded(
        address indexed issuer,
        string documentHash,
        uint256 _timeOfIssue,
        bool isStored
    );

    modifier noHashExistsYet(string memory _docHash) {
        require(
            isHashStored(_docHash),
            "Error: this hash already exists in contract"
        );
        _;
    }
    modifier doesHashExist(string memory _docHash) {
        require(
            documentRegistry[_docHash].isStored == true,
            "Error: this hash does not exist in contract"
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
        noHashExistsYet(_documentHash)
    {
        DocumentInfo memory docInfo = DocumentInfo({
            documentHash: _documentHash,
            issuer: msg.sender,
            timeOfIssue: block.timestamp,
            isStored: true
        });

        documentRegistry[_documentHash] = docInfo;

        // creates the event, to be used to query all the store hash of the certificates
        emit HashAdded(msg.sender, _documentHash, block.timestamp, true);
    }

    function verifyCertificate(string memory _documenteHash)
        public
        view
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

    function getCertificateInfo(string memory _hash)
        public
        view
        doesHashExist(_hash)
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
}
