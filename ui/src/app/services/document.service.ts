import { Injectable } from '@angular/core';
const Web3 = require('web3');

declare let require: any;
declare let window: any;
const tokenAbi = require('../../../../abis/CertificateRegistry.json');

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private account: any = null;
  private readonly web3: any;
  private enable: any;

  constructor() {
    if (window.ethereum === undefined) {
      alert('Non-Ethereum browser detected. Install MetaMask');
    } else {
      if (typeof window.web3 !== 'undefined') {
        this.web3 = window.web3.currentProvider;
      } else {
        this.web3 = new Web3.providers.HttpProvider('http://localhost:8545');
      }
      window.web3 = new Web3(window.ethereum);
      this.enable = this.enableMetaMaskAccount();
    }
  }

  private async enableMetaMaskAccount(): Promise<any> {
    let enable = false;
    await new Promise((resolve, reject) => {
      enable = window.ethereum.enable();
    });

    const account = await this.getAccount();
    return Promise.resolve(enable);
  }

  private async getAccount(): Promise<any> {
    if (this.account == null) {
      this.account = await new Promise((resolve, reject) => {
        window.web3.eth.getAccounts((err, retAccount) => {

          console.log(retAccount)

          if (retAccount.length > 0) {
            this.account = retAccount[0];
            resolve(this.account);
          } else {
            alert('document.service :: getAccount :: no accounts found.');
            reject('No accounts found.');
          }
          if (err != null) {
            alert('document.service :: getAccount :: error retrieving account');
            reject('Error retrieving account');
          }
        });
      }) as Promise<any>;
    }
    return Promise.resolve(this.account);
  }

  hashCertificate(data) {

  }

  saveHash(value) {
    const that = this;
    console.log(this)
    console.log('document.service :: transferEther to: ' +
      value.hash + ', from: ' + that.account);

    return new Promise((resolve, reject) => {
      console.log(tokenAbi);

      const contract = require('@truffle/contract');
      const transferContract = contract(tokenAbi);
      transferContract.setProvider(that.web3);

      console.log(transferContract);

      transferContract.deployed().then(function (instance) {
        return instance.storeHash(value.hash);
      }).then(function (status) {
        if (status) {
          return resolve({ status: true });
        }
      }).catch(function (error) {
        console.log(error);
        return reject('document.service error');
      });
    });
  }


}
