import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { JxToasterService } from 'jx-toaster';
import { DocumentService } from 'src/app/services/document.service';
import { DynamicFormComponent } from 'src/app/shared/dynamic-form/dynamic-form.component';
import { FieldConfig } from 'src/app/shared/dynamic-form/models/field-config';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  user = {
    address: 0x0,
    balance: 0
  }

  busy = false;
  float_style = true;

  config: FieldConfig[] = [
    {
      type: 'input',
      label: 'Enter block number',
      placeholder: 'Enter block number',
      name: 'blockNumber',
      validation: [Validators.required]
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
      label: 'Verify',
      name: 'submit',
      type: 'button'
    }
  ];
  // myFunc;

  constructor(private $doc: DocumentService, private $jx: JxToasterService) {
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
    this.busy = true;
    console.log(data)

    let _hash1 = await this.$doc.hashing(data.certificate[0]);
    let _hash2 = `0x${_hash1}`

    if (_hash2 && data['blockNumber']) {
      let value = {
        hash: _hash2,
        blockNumber: data['blockNumber']
      }
      console.log(value)

      this.$doc.verifyHash(value).
        then((status) => {
          if (status == true)
            this.$jx.pop(
              "success",
              `Certificate Verified!`,
              `Certificate exist on the blockchain!`,
              true
            )
          else
            this.$jx.pop(
              "danger",
              `Certificate Does Not Exist!`,
              `Certificate does not exist on the blockchain!`,
              true
            )
        }).catch((error) => {
          this.errorManager(error);
        });
    }
  }

  errorManager(error) {
    console.log(error);

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
}
