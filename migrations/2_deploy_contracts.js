const CertificateRegistry = artifacts.require('./CertificateRegistry.sol');

module.exports = (deployer) => {
    deployer.deploy(CertificateRegistry);
};
