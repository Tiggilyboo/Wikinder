import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Wiki } from '../../providers/wiki';

import { SettingsPage } from '../settings/settings';
import { ArticlePage } from '../article/article';

import {
  StackConfig, DragEvent,
  SwingStackComponent, SwingCardComponent
} from 'angular2-swing';

/*
  Generated class for the Main page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
  entryComponents: [SwingStackComponent, SwingCardComponent]
})
export class MainPage {
  @ViewChild('stack') swingStack: SwingStackComponent;
  @ViewChildren('cards') swingCards: QueryList<SwingCardComponent>;

  cards: Array<any>;
  stackConfig: StackConfig;

  constructor(
    public navCtrl: NavController,
    public wiki: Wiki,
    public modal: ModalController
  ){
    this.cards = [
      {
        title: 'Welcome!',
        extract: 'Hey there, welcome to Wikinder, swipe <ion-icon name="left" color="danger"></ion-icon> to dislike \
           and swipe <ion-icon name="right" color="secondary"></ion-icon> to like the article. You can also read the whole \
           article by tapping it.',
        categories: [{
          title: "Introduction"
        }]
      }
    ];
    this.stackConfig = {
      throwOutDistance: (d) => { return 256; },
      throwOutConfidence: (offset, element) => {
        return Math.min(Math.abs(offset) / (element.offsetWidth/2, 1));
      },
      transform: (el, x, y, r) => {
        var c = '', ax = Math.abs(x);
        let m = Math.trunc(Math.min(256 - ax, 256));
        let hc = Number(m).toString(16);
        while(hc.length < 2){ hc = "0" + hc; }
        if(x < 0) c = '#FF' + hc + hc;
        else c = '#' + hc + 'FF' + hc;

        el.style.background = c;
        el.style['transform'] = `translate3d(0,0,0) translate(${x}px, ${y}px) rotate(${r}deg)`;
      }
    };
  }

  trim(c: string): string {
    return c.substring(0, 500);
  }

  ionViewDidLoad() {
    var that = this;

    this.swingStack.throwin.subscribe((event: DragEvent) => {
      event.target.style.background = '#fff';
    });

    this.wiki.getArticles(5).then((a) => {
      that.cards = that.cards.concat(a);
    });
  }

  like(actually: boolean){
    let card = this.cards.pop();
    let id = card['pageid'];
    let categories = card['categories'];
    var that = this;

    this.wiki.addHistory(id);
    if(!!categories){
      for(let i = 0; i < categories.length; i++){
        this.wiki.vote(categories[i], actually);
      }
    }

    this.wiki.getArticles(1).then((a) => {
      that.cards = that.cards.concat(a);
    });
  }

  settings(){
    this.modal.create(SettingsPage).present();
  }

  noCards(): boolean {
    return this.cards.length == 0;
  }

  view(pageId: string){
    this.modal.create(ArticlePage).present();
  }
}
