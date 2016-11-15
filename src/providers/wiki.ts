import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { ToastController, Platform } from 'ionic-angular';
import { Cache } from '../providers/cache';

@Injectable()
export class Wiki {
  public language: string;
  public categoryLimit: number;
  public chanceRandom: number;

  wikiAPI: string = "https://{lang}.wikipedia.org/w/api.php?format=json&action=query";
  wiki: string = "https://{lang}.m.wikipedia.org/?curid={id}";
  requestHeader: any;
  history: Set<string> = new Set([]);

  constructor(
    public toast: ToastController,
    public http: Http,
    public platform: Platform,
    public cache: Cache
  ){
    var that = this;
    that.language = 'en';
    this.categoryLimit = 5;
    that.chanceRandom = 0.3;
    that.requestHeader = {
      'Api-User-Agent': 'Wikinder/2.0'
    };

    this.platform.ready().then(() => {
      that.cache.getSettings().then((s) => {
        if(!!s) {
          if(!!s['language']) that.language = s['language'];
          if(!!s['random']) that.chanceRandom = s['random'];
        }
      });
    });
  }

  setLanguage(lang: string){
    this.language = lang;
  }
  setCategoryLimit(limit: number){
    this.categoryLimit = limit;
  }
  setChanceRandom(chance: number){
    this.chanceRandom = chance;
  }
  saveSettings(){
    this.cache.saveSettings(this.language, this.chanceRandom);
  }

  hasHistory(pageId: string){
    return this.history.has(pageId);
  }
  addHistory(pageId: string){
    this.history.add(pageId);
  }
  clearHistory(){
    this.history.clear();
  }
  clearInterests(){
    this.cache.clear();
  }

  private constructQuery(): string {
    return this.wikiAPI.replace("{lang}", this.language);
  }

  private getRandom(category: string = null): Promise<any> {
    var that = this;
    var url = this.constructQuery();
    if(!!category || category == null){
      url += "&list=random&rnnamespace=0&rnlimit=1&continue";
    } else {
      url += "&list=categorymembers&prop=info&cmprop=ids&cmtitle="
      url += encodeURI(category) + "&continue";
    }

    return this.http.get(url, this.requestHeader)
      .map((d) => { return d.json() }).toPromise()
      .then(function(d){
        if(!!d && !!d['query'] && !!d['query']['random'] && !!d['query']['random']){
          return that.getExtract(d['query']['random'][0]['id']);
        } else if(!!d && !!d['query'] && !!d['query']['categorymembers'] && d['query']['categorymembers'].length > 0){
          let r = Math.floor(Math.random() * d['query']['categorymembers'].length);
          return that.getExtract(d['query']['categorymembers'][r]['pageid']);
        } else return {
          title: 'Error',
          extract: 'Error: Bad response from Wikipedia Servers. '
        };
      }, function(e){
        return {
          title: 'Error',
          extract: 'Error: ' + JSON.stringify(e)
        };
      });
  }

  getExtract(pageId: string): Promise<any> {
    var url = this.constructQuery();
    url += "&prop=extracts|categories&exintro&explaintext&clprop=sortkey&clshow=!hidden&cllimit=";
    url += this.categoryLimit;
    url += "&pageids=" + pageId;

    return this.http.get(url, this.requestHeader)
      .map((d) => { return d.json() }).toPromise()
      .then(function(d){
        if(!!d && !!d['query'] && !!d['query']['pages']){
          return d['query']['pages'][pageId];
        } else {
         return {
           title: 'Error',
           extract: 'Bad Response from Wikipedia Servers'
         };
        }
      }, function(e){
        return {
          title: 'Error',
          extract: 'getExtract: ' + JSON.stringify(e)
        };
      });
  }

  getPage(pageId: string): string {
    return this.wiki
      .replace("{lang}", this.language)
      .replace("{id}", pageId);
  }

  getArticles(n: number): Promise<any> {
    var that = this;
    var articles = [];
    var interests = [];

    return this.cache.getTopInterests(n).then((i) => {
      interests = interests.concat(i);

      return new Promise(function(resolve, reject){
        var requests = 0;

        while(requests < n){
          if(interests.length == 0 || Math.random() > that.chanceRandom){
            that.getRandom().then((r) => {
              articles.push(r);
              if(articles.length == n){ resolve(articles) };
            }).catch((e) => { reject(e) });
          } else {
            let r = Math.floor(Math.random() * interests.length);
            var interest = interests[r];

            that.getRandom(interest['interest']).then((r) => {
              articles.push(r);
              if(articles.length == n){ resolve(articles) };
            }).catch((e) => { reject(e) });
          }
          requests++;
        }
      });
    }).catch((e) => {
      return [{
        title: 'Error!',
        extract: 'Error: ' + JSON.stringify(e)
      }];
    });
  }

  vote(interest: string, referral: string, like: boolean): Promise<void> {
    return this.cache.updateRank(
      interest, referral, like
    );
  }
}
