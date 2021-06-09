const HDWalletProvider = require("@truffle/hdwallet-provider");
const fs = require('fs')
const mnemonic = fs.readFileSync('.secret').toString().trim()
const infuraProjectId = '7c5a9afbfcbb49d2b85574729756aa70'

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    live: {
            host: "192.xx.xx.xx",
            port: 8545,
            network_id: "*",
            gas: 4000000,
            from: "0x8xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        },
  mainnet: {
      provider: function() {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          `https://mainnet.infura.io/${process.env.INFURA_API_KEY}`
        )
      },
      gas: 5000000, // Gas limit used for deploys. Default is 4712388.
      gasPrice: 25000000000, //Gas price in Wei
      confirmations: 2,
      network_id: 1
    },
    kovan: {
            provider: () =>
                new HDWalletProvider(mnemonic, `https://kovan.infura.io/v3/${infuraProjectId}`),
            network_id: 42, // Kovan Id
            gas: 3000000,
            gasPrice: 100000000000
        },
    rinkeby: {
            provider: () =>
                new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraProjectId}`),
            network_id: 4, // Rinkeby Id
            gas: 3000000,
            gasPrice: 100000000000
        },

     ropsten: {
            provider: () =>
                new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/${infuraProjectId}`),
            network_id: 3, // Ropsten Id
            gas: 3000000,
            gasPrice: 100000000000
        },
  },
  mocha: {
    reporter: 'eth-gas-reporter',
    reporterOptions: {
      showTimeSpent: true,
      currency: 'USD',
      gasPrice: 2,
    },
  },
    plugins: ["solidity-coverage",'truffle-contract-size'],
  contracts_directory: './contracts/',
  contracts_build_directory: './abis/',
  compilers: {
      solc: {
        version: "0.5.9", // Fetch exact version from solc-bin (default: truffle's version)
        settings: {
          // see the solidity docs for advice about optimization and evmversion
          optimizer: {
            enabled: true,
            runs: 200
          },
          evmVersion: "byzantium" // Current evm on ThunderCore fixed at "byzantium"
        }
      }
    }

}