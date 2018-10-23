import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { DataService } from '../data.service';
import { Storage } from '@ionic/storage';
import { RouterModule } from '@angular/router';

/**
 * Generated class for the LeaderboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.page.html',  ////updated
  styleUrls: ['./leaderboard.page.scss'],
})

export class LeaderboardPage implements OnInit {

  score: number;
  scoreList: any[] = [];

  constructor(
    public navCtrl: NavController, 
    public dataService: DataService,
    public storage: Storage,
    public router: RouterModule) {
      this.storage.get('score').then((val) => {
        this.score = val;
      });
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad LeaderboardPage');
    // Platform.ready isn't required in the new Ionic

    ngOnInit() {
      // this.platform.ready().then(() => {
      /*Storage get*/
      this.storage.get('score').then((val) => {
        if (val==null){
          this.score = 0;
        }
        else {
          this.score = val;
        }

        this.storage.get('leaderboard').then((result) => {
         
          let res;
          if(!result) {
            res = [];
          } else {
            res = JSON.parse(result);
          }

          res.push({
            score: this.score,
            time: Date.now()
          })

          console.log(res);

          this.scoreList = res.sort(function(a, b) {
            if(a.score > b.score) {
              return -1;
            } else {
              return 1;
            }
          });

        /*Storage set*/
        this.storage.set('leaderboard', JSON.stringify(this.scoreList));
      });
    });
  }
}