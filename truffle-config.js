
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
  },
    plugins: ["solidity-coverage"],
  contracts_directory: './contracts/',
  contracts_build_directory: './abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}