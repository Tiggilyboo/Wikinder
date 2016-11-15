import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Events, NavController, ModalController, PopoverController } from 'ionic-angular';
import { Wiki } from '../../providers/wiki';
import { Cache } from '../../providers/cache';

import { SettingsPage } from '../settings/settings';
import { ArticlePage } from '../article/article';

import {
  StackConfig, DragEvent,
  SwingStackComponent, SwingCardComponent
} from 'angular2-swing';

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
    public events: Events,
    public navCtrl: NavController,
    public popover: PopoverController,
    public modal: ModalController,
    public cache: Cache,
    public wiki: Wiki
  ){
    var that = this;
    this.events.subscribe('loadMore', (data) => {
      this.cards.pop();
      that.wiki.getArticles(1).then((a) => {
        if(!!a && a.length > 0){
          that.cards = that.cards.concat(a);
        }
      });
    });

    this.cards = [];
    
    this.stackConfig = {
      minThrowOutDistance: 150,
      throwOutConfidence: (offset, element) => {
        let w = offset - element.offsetHeight / 2;
        let h = offset - element.offsetWidth / 2;
        if(w > 150 || w < 150) return 1;
        else if(h > 100 || h < 100) return -1;
        else return 0;
      },
      transform: (el, x, y, r) => {
        var c = '', ax = Math.abs(x);
        let m = Math.trunc(Math.min(256 - ax / 2, 256));
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
    let el = c.length > 500 ? "..." : "";
    return c.substring(0, 500) + el;
  }

  trackByArticle(index: number, article: any){
    return article['pageid'];
  }

  ionViewDidLoad() {
    var that = this;

    this.swingStack.throwin.subscribe((event: DragEvent) => {
      event.target.style.background = '#fff';
    });

    this.wiki.getArticles(4).then((a) => {
      that.cards = a;
    });
  }

  like(actually: boolean){
    let card = this.cards.pop();
    let id: string = card['pageid'];
    let categories = card['categories'];
    var that = this;

    this.wiki.addHistory(id);
    if(!!categories){
      for(let i = 0; i < categories.length; i++){
        if(!categories[i]['title']) continue;
        this.wiki.vote(categories[i]['title'], id, actually);
      }
    }

    this.wiki.getArticles(1).then((a) => {
      if(!!a && a.length > 0){
        that.cards = that.cards.concat(a);
      }
    });
  }

  bookmark(){
    let card = this.cards.pop();
    let id: string = card['pageid'];
    var that = this;

    this.wiki.addHistory(id);
    this.cache.getBookmarks().then((b) => {
      that.cache.setBookmarks(b.concat(card));
    });

    this.wiki.getArticles(1).then((a) => {
      if(!!a && a.length > 0){
        that.cards = that.cards.concat(a);
      }
    });
  }

  menu(e: any){
    this.popover.create(SettingsPage).present({ ev: e });
  }

  noCards(): boolean {
    return this.cards.length == 0;
  }

  view(card: any){
    this.modal.create(ArticlePage, {
      article: card
    }).present();
  }
}
