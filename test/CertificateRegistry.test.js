const CertificateRegistry = artifacts.require('./CertificateRegistry.sol')
require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('CertificateRegistry', accounts => {
  const [deployer, student, verifier] = accounts;
    // Contract instance
  let certificateRegistryInstance

  const hash1 = '0x94f3e4c13989c51472ce78354b5205c5411f82e83c745b6f675e0c9aeb8ab4d1'
  let _timeOfIssue = Math.floor((new Date).getTime() / 1000);

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
      assert.equal(event.timeOfIssue, _timeOfIssue, 'time is correct')
      assert.equal(event.isStored, true, 'hash is not stored')
    })

    it('should not store empty input', async () => {
      // FAILURE: Hash must have a value
      await certificateRegistryInstance.storeHash('', { from: deployer }).should.be.rejected;
    });

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
      validHash = await certificateRegistryInstance.verifyHash(hash1)
    })
    it('should return true for valid document hash', async () => {
    assert.strictEqual(validHash, true, 'Document hash is valid')
    });
  })
})