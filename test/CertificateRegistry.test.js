const CertificateRegistry = artifacts.require('./CertificateRegistry.sol')
const truffleAssert = require('truffle-assertions');
require('chai')
  .use(require('chai-as-promised'))
  .should()

// const [deployer, student, verifier] = accounts;

contract('CertificateRegistry', ([deployer, student, verifier]) => {
    // Contract instance
  let certificateRegistryInstance

  const hash1 = '93920e3267341a720b3ff1560435893456044b651ccb98538a52fbaf3ca6bce2'
  const hash2 = '9dcaede8fd07cf1a3dfcd72e45278abe5a5cdf1ea6d6c80fc2bf4d9d365e14e5'
  const _timeOfIssue = 1542652349;
  const _isStored = false

// Create a new instance of the contract before each test
  beforeEach('setup contract for each test', async () => {
    certificateRegistryInstance = await CertificateRegistry.deployed()
  })

describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await certificateRegistryInstance.address
      assert.ok(address)
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('should have an owner', async () => {
      const contractOwner = await certificateRegistryInstance.owner()
      assert.equal(contractOwner, deployer, 'has an owner')
    })
  })

  describe('certificates', async () => {
    let result

    before(async () => {
      result = await certificateRegistryInstance.storeHash(hash1, { from: deployer })
    })

    it('store certificate hash', async () => {
      // SUCCESS
      const event = result.logs[0].args
      console.log(event)
      assert.equal(event.issuer, deployer, 'issuer is correct')
      assert.equal(event.documentHash, hash1, 'hash1 is correct')
      assert.equal(event._timeOfIssue, block.number, 'time is correct')
      assert.equal(event.isStored, true, 'isStored is correct')

      // FAILURE: Hash must have a value
      await certificateRegistryInstance.storeHash('', { from: deployer }).should.be.rejected;
    })

    it('get hash store on-chain', async () => {
      const foundHash = await certificateRegistryInstance.getCertificateInfo(hash1)
      console.log({foundHash})
      assert.equal(foundHash.issuer, deployer, 'issuer is correct')
      assert.equal(foundHash.documentHash, hash1, 'hash1 is correct')
      assert.equal(foundHash._timeOfIssue, _timeOfIssue, 'time is correct')
      assert.equal(foundHash.isStored, true, 'isStored is correct')
    })

    it('should not add hash when hash already exists', async () => {
      await certificateRegistryInstance.storeHash(hash1);
      await truffleAssert.fails(
        certificateRegistryInstance.add(hash1),
        truffleAssert.ErrorType.REVERT,
        "this hash already exists in contract"
      );
    });

   it('should not store hash when user is not owner', async () => {
      await truffleAssert.fails(
        certificateRegistryInstance.storeHash(hash1, {from: deployer}),
        truffleAssert.ErrorType.REVERT,
        "Access Denied"
      );
    });

    it('should verify hash to be valid or not', async () => {
    const validHash = await certificateRegistryInstance.verifyCertificate(hash1)
    assert.equal(validHash, true, 'hash1 is verified')
    });
  })
})