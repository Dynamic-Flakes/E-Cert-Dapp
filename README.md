# E-Cert-Dapp
 ## Introduction

 ### Checks:
 - Only registered user (educator/ verifier) can register certificates , issue certificates, be issued certificates or view certificates.
 - The certificate which is to be issued, must be registered first.
 - No single user can register twice.

 ### Users:
There are 3 types of users the system provides support to:

 - Educator: This is the certifying authority, which registers new certificates, then issues the desired student that certificate.
 - Student: This is the recipient of the certificate. It first registers itself in the system. He request for a certificate after a course is finished and the stored on-chain
 - Verifier: This can be any anonymous user, which wants to verify the student's certificate.

 ### Events:
Events are the logs of all the transactions done in the blockchain. So for every function of the smart contract, we log its details in events. Our system tracks these events:

 - HashAdded: Ths event is triggered when a hashed is stored on-chain. It logs details of every hash added to an address registered.
 - HashVerified: This Event is triggered when when a document is verified

### Process Flow:
 - Certificate will be received on the ui, a unique hash will be generated
 - The generated hash will be stored in the blockchain
 - The certificate data can be read and verified by the blockchain
 - The verifier can simple access the certifications of the student for verification.

## Technology stack:

 - Truffle - ( development framework for dapps based on the Ethereum blockchain: https://truffleframework.com/),
 - Ganache - ( A personal blockchain for Ethereum development that can be used to deploy contracts, develop applications, and run tests: https://truffleframework.com/ganache),
 - Solidity - (contract-oriented programming language for writing smart contracts: https://solidity.readthedocs.io/en/v0.4.24/),
 - Web3.js - (Ethereum JavaScript API: https://github.com/ethereum/web3.js/)

 - MetaMask - (A browser plugin which allows users to make transactions to Ethereum or other networks through browsers, eliminating the need for dedicated user interfaces for Ethereum or other networks: https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en)

 - NodeJS - (An open source and cross-platform runtime environment for executing JavaScript code outside of a browser: https://nodejs.org/en/),
 - Angular - (TypeScript-based open-source web application framework led by the Angular Team at Google and by a community of individuals and corporations: https://angular.io/).

 ## Set Up
 ### Install truffle
  - Run the command `npm install -g truffle`
  - Git clone the E-cert-Dapp repo
  - Cd into the directory and run ` yarn install`
  - Run ` yarn run compile` to compile the smart contract
  - Run `yarn run migrate` to migrate the contract. `truffle deploy` is an alias for `truffle migrate`. They both do the same thing.
  - Run `yarn run console` to interact with the smart contract on the ganache ethereum blockchain

  ### Install Ganache
 - Go to https://truffleframework.com/ganache and download a version dedicated to your operating system.
 - Install by a double click, then run.
 - Ganache runs with default values which should be the same or similar to these on-screen. The crucial part is a section defining RPC Server.
 - Leave it running.

 ### Install Nodejs
 - To download Nodejs, navigate to  navigate to https://nodejs.org/en/download/ and click the version that suits your machine
 - After downloading it, click the installer to get it installed on your machine
 - Verify installation by running the command on your CLI ` node -v`
 - You can use npm or yarn for package management
