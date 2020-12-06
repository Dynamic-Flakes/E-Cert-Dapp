const CertificateRegistry = artifacts.require('./CertificateRegistry.sol')
require('chai')
  .use(require('chai-as-promised'))
  .should()

// const [deployer, student, verifier] = accounts;

contract('CertificateRegistry', ([deployer, student, verifier]) => {
    // Contract instance
  let certificateRegistryInstance

  const hash1 = '93920e3267341a720b3ff1560435893456044b651ccb98538a52fbaf3ca6bce2'
  const _timeOfIssue = 1542652349;
  const _isStored = false

// Create a new instance of the contract before each test
  beforeEach('setup contract for each test', async () => {
    certificateRegistryInstance = await CertificateRegistry.deployed()
  })

describe('deployment', async () => {
    it('should deploys successfully', async () => {
      const address = await certificateRegistryInstance.address
      assert.ok(address)
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('should sets the owner properly', async () => {
      const contractOwner = await certificateRegistryInstance.contractOwner()
      assert.equal(contractOwner, deployer, 'has an owner')
    })
  })

  describe('store', async () => {
    let result

    before(async () => {
      result = await certificateRegistryInstance.storeHash(hash1, { from: deployer })
    })

    it('store certificate hash', async () => {
      // SUCCESS
      const event = result.logs[0].args
      assert.equal(event.issuer, deployer, 'issuer is correct')
      assert.equal(event.documentHash, hash1, 'hash1 is correct')
      // assert.equal(event._timeOfIssue, _timeOfIssue, 'time is correct')
      assert.equal(event.isStored, true, 'hash is not stored')

      // FAILURE: Hash must have a value
      await certificateRegistryInstance.storeHash('', { from: deployer }).should.be.rejected;
    })

    it('should not add hash when hash already exists', async () => {
    await certificateRegistryInstance.storeHash(hash1, { from: deployer }).should.be.rejected;

    });

   it('should not store hash when user is not owner', async () => {
    await certificateRegistryInstance.storeHash(hash1, { from: student }).should.be.rejected;
    await certificateRegistryInstance.storeHash(hash1, { from: verifier }).should.be.rejected;
    });
 })
  describe('verifyHash', async () => {
    let validHash

    before(async () => {
      validHash = await certificateRegistryInstance.verifyCertificate(hash1)
    })
    it('should return true for valid document hash', async () => {
    assert.strictEqual(validHash, true, 'Document hash is valid')
    });
  })

})