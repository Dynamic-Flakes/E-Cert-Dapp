import { Injectable } from '@angular/core';
import { JxToasterService } from 'jx-toaster';
import * as CryptoJS from 'crypto-js';
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

  constructor(public $jx: JxToasterService) {

    if (window.ethereum === undefined) {
      this.$jx.pop("danger", `Non-Ethereum browser detected. Install MetaMask!`, ``, true);
    }

    else {
      if (typeof window.web3 !== 'undefined')
        this.web3 = window.web3.currentProvider;
      else
        this.web3 = new Web3.providers.HttpProvider('http://localhost:8545');

      window.web3 = new Web3(window.ethereum);
      this.enable = this.enableMetaMaskAccount();
    }
  }

  private async enableMetaMaskAccount(): Promise<any> {
    let enable = false;
    await new Promise((resolve, reject) => {
      enable = window.ethereum.enable();
    });
    return Promise.resolve(enable);
  }

  private async getAccount(): Promise<any> {
    if (this.account == null) {
      this.account = await new Promise((resolve, reject) => {
        window.web3.eth.getAccounts((err, retAccount) => {

          if (retAccount.length > 0) {
            this.account = retAccount[0];
            resolve(this.account);
          } else {
            this.$jx.pop("danger", `No accounts found!`, ``, true);
            reject('No accounts found.');
          }
          if (err != null) {
            this.$jx.pop("danger", `Error retrieving account!`, ``, true);
            reject('Error retrieving account');
          }
        });
      }) as Promise<any>;
    }
    return Promise.resolve(this.account);
  }

  public async getUserBalance(): Promise<any> {
    const account = await this.getAccount();

    return new Promise((resolve, reject) => {
      window.web3.eth.getBalance(account, function (err, balance) {

        if (!err) {
          const retVal = {
            account: account,
            balance: balance
          };

          resolve(retVal);
        } else {
          reject({ account: 'error', balance: 0 });
        }
      });
    }) as Promise<any>;
  }

  saveHash(value) {
    const that = this;

    return new Promise((resolve, reject) => {

      const contract = require('@truffle/contract');
      const transferContract = contract(tokenAbi);
      transferContract.setProvider(that.web3);

      transferContract.deployed().then(function (instance) {
        return instance.storeHash(
          value.hash,
          {
            from: that.account,
          });
      }).then(function (data) {
        return resolve(data);
      }).catch(function (error) {
        return reject(error);
      });
    });
  }

  verifyHash(value) {
    const that = this;

    return new Promise((resolve, reject) => {
      const contract = require('@truffle/contract');
      const transferContract = contract(tokenAbi);
      transferContract.setProvider(that.web3);

      transferContract.deployed().then(function (instance) {
        console.log('contractAddress', instance)
        return instance.verifyCertificateData(value.hash, value.blockNumber);
      }).then(function (status) {
        return resolve(status);
      }).catch(function (error) {
        return reject(error);
      });
    });
  }


  async hashing(_file): Promise<any> {
    let hash;
    if (_file) {
      hash = await new Promise((resolve, reject) => {
        let hashdata = CryptoJS.algo.SHA256.create();
        let file = _file;
        if (file) {
          let reader = new FileReader();
          let size = file.size;
          let chunk_size = Math.pow(2, 22);
          let chunks = [];

          let offset = 0;
          let bytes = 0;
          reader.onloadend = (e) => {
            if (reader.readyState == FileReader.DONE) {

              //every chunk read updating hash
              hashdata.update(this.arrayBufferToWordArray(reader.result));

              let chunk: any = reader.result;
              bytes += chunk.length;
              chunks.push(chunk);

              if ((offset < size)) {
                offset += chunk_size;
                let blob = file.slice(offset, offset + chunk_size);
                reader.readAsArrayBuffer(blob);
              } else {
                //use below hash for result
                //finaly generating hash
                let resultingHash = hashdata.finalize().toString();
                resolve(resultingHash);
              };
            }
          };
          let blob = file.slice(offset, offset + chunk_size);
          reader.readAsArrayBuffer(blob);
        }
      }) as Promise<any>;
    }
    return Promise.resolve(hash);
  }

  arrayBufferToWordArray(fileResult) {
    let i8a = new Uint8Array(fileResult);
    return CryptoJS.lib.WordArray.create(i8a, i8a.length);
  }
}
