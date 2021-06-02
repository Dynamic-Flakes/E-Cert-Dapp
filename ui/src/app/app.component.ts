import { Component } from '@angular/core';
import { ToasterConfig } from 'jx-toaster';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ui';
  _mainConfig: ToasterConfig;

  config: ToasterConfig = {
    singleton: false,
    duration: 5000,
    position: "toast-bottom-center",
    animation: "fadeIn",
    maxToast: 5
  };

  ngOnInit(): void {
    this._mainConfig = this.config;
  }
}
