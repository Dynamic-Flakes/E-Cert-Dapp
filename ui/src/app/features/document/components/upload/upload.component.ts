import { Component, OnInit, ViewChild } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { Validators } from '@angular/forms';
import { JxToasterService } from 'jx-toaster';
import { DocumentService } from 'src/app/services/document.service';
import { DynamicFormComponent } from 'src/app/shared/dynamic-form/dynamic-form.component';
import { FieldConfig } from 'src/app/shared/dynamic-form/models/field-config';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  user = {
    address: 0x0,
    balance: 0
  }

  email_script_url = 'http://dynamicflakes.com/ecert/jx-simple-mailer.php';
  private emailFormat = {
    'toemail': null,
    'subject': 'Saved Hash and Block Number',
    'appname': 'E-Cert App',
    'fromemail': 'hello@dynamicflakes.com',
    'hash': null,
    'blocknumber': null,
    'txid': null,
  };

  transactionInfo = {
    blockNumber: '',
    tx: '',
    fileHash: ''
  }

  busy = false;
  float_style = true;

  config: FieldConfig[] = [
    {
      type: 'input',
      label: 'Enter your email',
      placeholder: 'Enter your email',
      name: 'email',
      validation: [Validators.required, Validators.email]
    },
    {
      type: 'filechooser',
      label: 'Drag and Drop Files',
      name: 'certificate',
      valueType: 'doc',
      size: '',
      validation: [Validators.required]
    },
    {
      label: 'Hash & Save',
      name: 'submit',
      type: 'button'
    }
  ];
  // myFunc;

  constructor(private $doc: DocumentService, private $jx: JxToasterService, private http: HttpClient,) {
    this.getAccountAndBalance();

    // Binding this keeps this at the class level
    // Preventing callbacks from making this undefined
    this.submit = this.submit.bind(this);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    //setTimeout Prevent Change Detection Error
    setTimeout(() => {
      let previousValid = this.form.valid;
      this.form.changes.subscribe(() => {
        if (this.form.valid !== previousValid) {
          previousValid = this.form.valid;
          this.form.setDisabled('submit', !previousValid);
        }
      });

      this.form.setDisabled('submit', true);
    });
  }

  ngOnDestroy() {
  }

  getAccountAndBalance = () => {
    const that = this;
    this.$doc.getUserBalance().
      then(function (retAccount: any) {
        that.user.address = retAccount.account;
        that.user.balance = retAccount.balance;
      }).catch(function (error) {

      });
  }

  async submit(data: { [name: string]: any }) {
    console.log(data);
    this.busy = true;

    let _hash1 = await this.$doc.hashing(data.certificate[0]);
    let _hash2 = `0x${_hash1}`

    // Update file hash
    this.transactionInfo.fileHash = _hash2;

    if (_hash2) {
      let value = {
        hash: _hash2
      }

      console.log(_hash2)

      this.$doc.saveHash(value).
        then((res: any) => {
          console.log(res)
          this.transactionInfo.tx = res.tx;
          this.transactionInfo.blockNumber = res.receipt.blockNumber;

          this.$jx.pop(
            "success",
            `Hashed and Saved!`,
            `Certificate was hashed and saved successfully!`,
            true
          );

          if ('blockNumber' in res.receipt && data['email']) {
            this.emailFormat.toemail = data['email'];
            this.emailFormat.hash = `${res.receipt.blockHash}`;
            this.emailFormat.blocknumber = `${res.receipt.blockNumber}`;
            this.emailFormat.txid = `${res.receipt.transactionHash}`;

            console.log(this.emailFormat)

            this.sendEmail();
          }

          // Get Balance
          this.getAccountAndBalance();
        }).catch((error) => {
          this.errorManager(error);
        });
    }
  }

  errorManager(error) {
    if (error.message.includes('Only hashes that have not been hashed can be stored'))
      this.$jx.pop(
        "danger",
        `Cerificate Already Exists!`,
        `File has been previously Hashed and Saved!`,
        true
      );
    else if (error.message.includes("must provide an Ethereum address.") || error.message.includes("Access Denied"))
      this.$jx.pop(
        "danger",
        `Access Denied!`,
        `You are not permitted to access this resource!`,
        true
      );
    else
      this.$jx.pop(
        "danger",
        `Terminated!`,
        `Something went wrong`,
        true
      );
  }

  sendEmail() {
    if (this.emailFormat.toemail) {
      this.http.post(`${this.email_script_url}`, this.emailFormat).subscribe((res: any) => {

        if (res.status == 200) {
          console.log('res', res)
          setTimeout(() => {
            this.$jx.pop(
              "success",
              `Hash and Block Number Sent!`,
              `The hash and block number has been sent to the provided email successfully!`,
              true
            )
          }, 10)
        }

        else {
          setTimeout(() => {
            this.$jx.pop(
              "danger",
              `Could Not Send Hash and Block Number!`,
              `The hash and block number could not be sent to the provided email!`,
              true
            )
          }, 10)
        }

      }, (err: any) => {
        console.log('err', err)

        if (err.status == 200) {
          setTimeout(() => {
            this.$jx.pop(
              "success",
              `Hash and Block Number Sent!`,
              `The hash and block number has been sent to the provided email successfully!`,
              true
            )
          }, 10)
        }

        else {
          setTimeout(() => {
            this.$jx.pop(
              "danger",
              `Could Not Send Hash and Block Number!`,
              `The hash and block number could not be sent to the provided email!`,
              true
            )
          }, 10)
        }
      });
    }
  }

}
