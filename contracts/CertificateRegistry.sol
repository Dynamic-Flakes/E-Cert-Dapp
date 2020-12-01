pragma solidity >=0.4.22 <0.8.0;

import "./Ownable.sol";

contract CertificateRegistry is Ownable {
    /**
     * The Certificate Document info structure: every certificate info is composed of:
     * - documentHash: Hash of the document generated off-chain
     * - issuer: institution that issue the document
     * - timeOfIssue - time the document hash was generated.
     */
    struct DocumentInfo {
        address issuer;
        bytes32 documentHash;
        uint256 timeOfIssue;
        bool exit;
    }

    /*
      A mapping each student document to their ID
      This mapping is used to keep track of every certification document initiated for every student by an educator.
     */
    mapping(bytes32 => DocumentInfo) private documentRegistry;

    /**
     * This event is triggered for store hash notification messages and outputs the following:
     * - issuer - owner of the contract
     * - documentHash
     * - timeOfIssue
     */
    event HashAdded(
        address indexed issuer,
        bytes32 documentHash,
        uint256 _timeOfIssue
    );

    modifier noHashExistsYet(bytes32 _documentHash) {
        require(
            documentRegistry[_documentHash].exist == false,
            "Error: this hash already exists in contract"
        );
        _;
    }

    /*
     * Record a new hash request on behalf of a student
     * The sender of message call is the educator itself
     * @param {string} _document Hash of the sutuednt submitted for storage on-chain
     */
    function storeHash(bytes32 _documentHash)
        public
        onlyOwner
        noHashExistsYet(_documentHash)
    {
        require(_documentHash.length == 46);
        DocumentInfo memory docInfo = DocumentInfo({
            documentHash: _documentHash,
            issuer: msg.sender,
            timeOfIssue: block.timestamp,
            exit: true
        });

        documentRegistry[_documentHash] = docInfo;

        // creates the event, to be used to query all the certificates
        emit HashAdded(msg.sender, _documentHash, block.timestamp);
    }

    function readHashedCertificate(bytes32 _hash)
        public
        view
        returns (
            bytes32,
            address,
            uint256,
            bool
        )
    {
        return (
            _hash,
            documentRegistry[_hash].documentHash,
            documentRegistry[_hash].issuer,
            documentRegistry[_hash].timeOfIssue,
            documentRegistry[_hash].exit
        );
    }
}
