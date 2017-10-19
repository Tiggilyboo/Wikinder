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
    // this.cards = [
    //   {
    //     "pageid":1097314,
    //     "ns":0,
    //     "title":"Chief Cabinet Secretary",
    //     "extract":"The Chief Cabinet Secretary of Japan (\u5185\u95a3\u5b98\u623f\u9577\u5b98, naikaku-kanb\u014d-ch\u014dkan) is a Minister of State who is responsible for directing the Cabinet Secretariat of Japan. The main function of the Chief Cabinet Secretary is to coordinate the policies of ministries and agencies in the executive branch. The Chief Cabinet Secretary serves as the government's press secretary, conducts policy research, prepares materials to be discussed at cabinet meetings, and, in time of national crisis, coordinates ministries and agencies of the executive branch. The Chief Cabinet Secretary is customarily nominated as the first in line to serve as temporary Acting Prime Minister in case the Prime Minister is unable to serve due to death or other grave reasons until a new Prime Minister is appointed. The Chief Cabinet Secretary's office is located on the fifth floor of the Prime Minister's official residence in Tokyo.\nBefore and during World War II, the position was known in Japanese as \u5185\u95a3\u66f8\u8a18\u5b98\u9577 (naikaku-shokikan-ch\u014d). The modern position was created on May 3, 1947, shortly after the passage of the Constitution of Japan, and elevated to ministerial status in 1966. Yasuo Fukuda, who served under Yoshir\u014d Mori and Junichiro Koizumi, is the longest-serving Chief Cabinet Secretary in history, having spent over 1,289 days in office.\nSince 1947, the office of Chief Cabinet Secretary has been regarded as a stepping stone to the post of Prime Minister. The first Chief Cabinet Secretary to become Prime Minister was Ichir\u014d Hatoyama, formerly Chief Cabinet Secretary to Tanaka Giichi. Since then, eight other former Chief Cabinet Secretaries have become Prime Ministers, most recently Shinz\u014d Abe and Yasuo Fukuda.",
    //     "categories":[
    //       {"ns":14,"title":"Category:Cabinet of Japan","sortkey":"2b35372f31042b272937412f4d044b2f2b492f4d274957011b018f818f7f8f0c","sortkeyprefix":""},
    //       {"ns":14,"title":"Category:Government of Japan","sortkey":"2b35372f31042b272937412f4d044b2f2b492f4d274957011b018f818f7f8f0c","sortkeyprefix":""},
    //       {"title": "Category: Tesdbt6"},
    //       {"title": "Category: Testfd7"},
    //       {"title": "Category: Testsd8"},
    //       {"title": "Category: Tesjmjt9"},
    //       {"title": "Category: Testfb10"},
    //     ]
    //   },
    //   {
    //     "pageid":1097112,
    //     "ns":0,
    //     "title":"Raving",
    //     "extract":"Raving may refer to:\nRave, a party\nmental illness\nRaving, Iran, a village in Hormozgan Province, Iran\nOfficial Monster Raving Loony Party, a single-issue, parodical political party in the United Kingdom\nRaving (film), a film\nRayman Raving Rabbids, a Wii video game",
    //     "categories":[
    //       {"ns":14,"title":"Category:Disambiguation pages","sortkey":"492751374133010a018f09","sortkeyprefix":""},
    //       {"title": "Category: Testfb1"},
    //       {"title": "Category: Test2"},
    //       {"title": "Category: Testdf3"},
    //       {"title": "Category: Testdf4"},
    //       {"title": "Category: Tesfdvt5"},
    //       {"title": "Category: Not A fvdTest"},
    //     ]
    //   },
    //   {
    //     "pageid":1095219,
    //     "ns":0,
    //     "title":"(33342) 1998 WT24",
    //     "extract":"(33342) 1998 WT24 is an Aten asteroid with a diameter of about 900 meters, located in Venus's zone of influence that has frequent close encounters with Mercury, Venus, and Earth. It is also one of the best studied potentially hazardous asteroids and was the 10th Aten to be numbered. The asteroid made a close approach to Earth on 11 December 2015, passing at a distance of about 4.2 million kilometers (2.6 million miles, 11 lunar distances) and reaching about apparent magnitude 11.",
    //     "categories":[
    //       {"ns":14,"title":"Category:Astronomical objects discovered in 1998","sortkey":"12842cca1c3703420ab512830c48590ab70412822cc904534d128135010f017e8f8f05","sortkeyprefix":"19981125"},
    //       {"ns":14,"title":"Category:Aten asteroids","sortkey":"12830c485903420ab512830c48590ab70412822cc904534d128135010f017e8f8f05","sortkeyprefix":"033342"},
    //       {"ns":14,"title":"Category:Discoveries by LINEAR","sortkey":"12830c485903420ab512830c48590ab70412822cc904534d128135010f017e8f8f05","sortkeyprefix":"033342"},
    //       {"ns":14,"title":"Category:Near-Earth objects in 2015","sortkey":"12842e241e1b03420ab512830c48590ab70412822cc904534d128135010f017e8f8f05","sortkeyprefix":"20151211"},
    //       {"ns":14,"title":"Category:Numbered minor planets","sortkey":"12830c485903420ab512830c48590ab70412822cc904534d128135010f017e8f8f05","sortkeyprefix":"033342"}
    //     ]
    //   }
    // ];

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
