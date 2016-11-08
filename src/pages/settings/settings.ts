import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Wiki } from '../../providers/wiki';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  chanceRandom: number;
  historyCleared: boolean;
  interestsCleared: boolean;
  language: string;

  constructor(
    public navCtrl: NavController,
    public wiki: Wiki
  ) {}

  ionViewDidLoad() {
    this.chanceRandom = this.wiki.chanceRandom * 100;
    this.language = this.wiki.language;
    this.historyCleared = false;
    this.interestsCleared = false;
  }

  clearHistory(){
    this.historyCleared = true;
    this.wiki.clearHistory();
  }

  clearInterests(){
    this.interestsCleared = true;
    this.wiki.clearInterests();
  }

  dismiss(){
    this.wiki.setLanguage(this.language);
    this.wiki.setChanceRandom(this.chanceRandom / 100);
    this.wiki.saveSettings();
    this.navCtrl.pop();
  }
}
