import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { MainPage } from '../pages/main/main';

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class Wikinder {
  rootPage = MainPage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}
