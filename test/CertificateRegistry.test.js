/* eslint-disable no-undef */
const CertificateRegistry = artifacts.require('./CertificateRegistry.sol')
require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('CertificateRegistry', accounts => {
  const [educator, student, verifier] = accounts;
    // Contract instance
  let certificateRegistryInstance
  const hash1 = '0x94f3e4c13989c51472ce78354b5205c5411f82e83c745b6f675e0c9aeb8ab4d1'
  const hash2 = '0x236d57dcd13712aa216d1f24317c32aaed9032bdd8fa83961a53a21ed95ded2d'
  let block
  let actualBlockNumber
// Create a new instance of the contract before each test
  before('setup contract for test', async () => {
    certificateRegistryInstance = await CertificateRegistry.new()
    // let receipt = await web3.eth.getTransactionReceipt(certificateRegistryInstance.transactionHash);
    // console.log({gasUsage:receipt.gasUsed})
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
      assert.equal(contractOwner, educator, 'has an owner')
    })
  })

  describe('store', async () => {
    let result

    before(async () => {
      result = await certificateRegistryInstance.storeHash(hash1, { from: educator})
      block = await web3.eth.getBlock('latest');

    })

    it('should only allow contract creator to add hash', async () => {
    const event = result.logs[0].args

    const expectedBlockNumber = block.number;
    const expectedTimestamp = block.timestamp;
    actualBlockNumber = event.blockNumber.toNumber()
    const actualTimestamp = event.timeOfIssue.toNumber()
    console.log({expectedBlockNumber,actualBlockNumber})

    // SUCCESS
      assert.equal(event.issuer, educator, 'issuer is correct')
      assert.equal(actualTimestamp, expectedTimestamp, 'time is correct')
      assert.equal(actualBlockNumber, expectedBlockNumber, 'blockNumber is correct')
      assert.equal(event.isStored, true, 'hash is not stored')
    })

    it('should not store empty input', async () => {
      // FAILURE: Hash must have a value
      await certificateRegistryInstance.storeHash('', { from: educator }).should.be.rejected;
    });

    it('should reject a hash if one is already stored for the supplied hash', async () => {
    await certificateRegistryInstance.storeHash(hash1, { from: educator }).should.be.rejected;
    });

   it('should not store hash when user is not owner', async () => {
    await certificateRegistryInstance.storeHash(hash1, { from: student }).should.be.rejected;
    await certificateRegistryInstance.storeHash(hash1, { from: verifier }).should.be.rejected;
    });
 })
  describe('verifyCertificateData', async () => {
    let validHash

    before(async () => {
      const blockNo = await web3.eth.getBlock('latest');
      const blockNumber = blockNo.number;
      validHash = await certificateRegistryInstance.verifyCertificateData(hash1,actualBlockNumber)
      inValidHash = await certificateRegistryInstance.verifyCertificateData(hash2,actualBlockNumber)
      inValidBlockNumber = await certificateRegistryInstance.verifyCertificateData(hash1,blockNumber)
    })
    it('should return true for valid document hash', async () => {
    assert.strictEqual(validHash, true, 'Document hash is valid')
    });
    it('should return false for invalid document hash', async () => {
    assert.strictEqual(inValidHash, false, 'Document hash is invalid')
    });
     it('should return false for invalid block number', async () => {
    assert.strictEqual(inValidBlockNumber, false, 'Block number is invalid')
    });
  })
})