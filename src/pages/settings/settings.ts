import { Component } from '@angular/core';
import { ModalController, ViewController } from 'ionic-angular';

import { HistoryPage } from '../../pages/history/history';
import { BookmarksPage } from '../../pages/bookmarks/bookmarks';

import { Wiki } from '../../providers/wiki';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  chanceRandom: number;
  language: string;

  constructor(
    public view: ViewController,
    public modal: ModalController,
    public wiki: Wiki
  ) {
    let that = this;
    this.view.onDidDismiss(() => {
      that.dismiss();
    })
  }

  ionViewDidLoad() {
    this.chanceRandom = this.wiki.chanceRandom * 100;
    this.language = this.wiki.language;
  }

  history(){
    this.modal.create(HistoryPage).present();
    this.dismiss();
  }

  bookmarks(){
    this.modal.create(BookmarksPage).present();
    this.dismiss();
  }

  dismiss(){
    this.wiki.setLanguage(this.language);
    this.wiki.setChanceRandom(this.chanceRandom / 100);
    this.wiki.saveSettings();
    this.view.dismiss();
  }
}
