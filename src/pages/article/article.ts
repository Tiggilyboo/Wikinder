import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-article',
  templateUrl: 'article.html'
})
export class ArticlePage {
  article: any;

  constructor(public navCtrl: NavController) {
    this.article = {
      title: '',
      content: ''
    };
  }

  launch(){
    
  }

  dismiss(){
    this.navCtrl.pop();
  }
}
