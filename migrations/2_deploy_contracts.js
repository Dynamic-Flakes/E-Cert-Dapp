const CertificateRegistry = artifacts.require('./CertificateRegistry.sol');

// module.exports = (deployer) => {
//     deployer.deploy(CertificateRegistry);
// };

// to deploy on testnet
module.exports = function(deployer, network, accounts) {
 deployer.deploy(CertificateRegistry, {from: accounts[0]});
};