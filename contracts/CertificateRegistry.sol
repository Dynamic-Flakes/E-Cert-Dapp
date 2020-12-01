pragma solidity >=0.4.22 <0.8.0;

import "./Ownable.sol";

contract CertificateRegistry is Ownable {
    uint256 public certificate_counter;

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
    mapping(uint256 => DocumentInfo) private documentRegistry;

    /**
     * This event is triggered for store hash notification messages and outputs the following:
     * - issuer - owner of the contract
     * - documentHash
     * - timeOfIssue
     */
    event HashAdded(
        uint256 indexed id,
        address indexed issuer,
        bytes32 documentHash,
        uint256 _timeOfIssue
    );

    /*
     * Record a new hash request on behalf of a student
     * The sender of message call is the educator itself
     * @param {string} _document Hash of the sutuednt submitted for storage on-chain
     */
    function storeHash(bytes32 _documentHash) public onlyOwner {
        require(_documentHash.length == 46);
        uint256 lastID = ++certificate_counter;
        DocumentInfo memory docInfo = DocumentInfo({
            documentHash: _documentHash,
            issuer: msg.sender,
            timeOfIssue: block.timestamp,
            exit: true
        });

        documentRegistry[lastID] = docInfo;

        // creates the event, to be used to query all the certificates
        emit HashAdded(lastID, msg.sender, _documentHash, block.timestamp);
    }

    function readHashedCertificate(uint256 _id)
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
            documentRegistry[_id].documentHash,
            documentRegistry[_id].issuer,
            documentRegistry[_id].timeOfIssue,
            documentRegistry[_id].exit
        );
    }
}
