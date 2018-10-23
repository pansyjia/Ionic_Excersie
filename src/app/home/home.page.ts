import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { MoleHole } from '../../models/button-model';
import { Observable } from 'rxjs';

import { DataService } from '../data.service';
import { Storage } from '@ionic/storage';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-home',  ////updated
  templateUrl: 'home.page.html',   ////updated
  styleUrls: ['home.page.scss']
})
export class HomePage {

  moleHoles: MoleHole[] = [];
  showHitMessage: Boolean = false;
  gameDriver: any;
  gameTimer: any;
  timeLeft: number = 0;
  timerObserver: any;
  scoreUpdate: any;
  scoreObserver: any;
  score: 0;


  constructor( 
    public navCtrl: NavController,
    public storage: Storage,
    public dataService: DataService,
    public router: RouterModule
    ) {

    /**
     * Create an observer to be passed to the new MoleHoles
     */
    this.scoreUpdate = Observable.create(observer => {
			this.scoreObserver = observer;
		});

    /**
     * Subscribe to the observer created above to update the score
     */

    this.scoreUpdate.subscribe(() => {
      this.score ++;
      // console.log(this.score);
      this.storage.set('score', this.score);

    });

    
    for(let i = 0; i<9; i++) {
      this.moleHoles.push(new MoleHole(i, this.scoreObserver));
      /*Pass the observer created to the new MoleHoles*/
    }

    let timerUpdate = Observable.create(observer => {
      this.timerObserver = observer;
    });

    timerUpdate.subscribe(val => {
      this.timeLeft = val;
    })

    this.startGame()
  }



  startGame(){
    const that = this;
    this.score = 0;

    this.gameDriver = setInterval(() => {
      let randomMole = Math.floor(Math.random() * 9)
      this.moleHoles[randomMole].showMole(700);
    }, 800);

    this.timeLeft = 10;

    this.gameTimer = setInterval(() => {
      that.timeLeft = that.timeLeft - 1;
      that.timerObserver.next(that.timeLeft);
      if(that.timeLeft <= 0) {
        clearInterval(that.gameTimer);
        this.stopGame();
        this.saveScore();
      }
    }, 1000)

  }

  stopGame() {
    clearInterval(this.gameDriver);
    clearInterval(this.gameTimer);
    this.timerObserver.next(0);
  }

  saveScore() {
    //This is the old ionic 3.9 syntax, get rid of it.
    //use ionic 4; use Angular routing across the project.
    this.storage.set('score', this.score);
    this.navCtrl.navigateForward('/leaderboard');
  }

  resetGame() {
    this.stopGame();
    this.startGame();
  }

  hit(hole: MoleHole) {
    const success = hole.hit();
    if(success) {
      this.showHitMessage = true;
      setTimeout(() => {
        this.showHitMessage = false;
      }, 300);
    }
  }

  stateToClass(state: number) {
    switch(state) {
      /**
       * What should this function do?
       * Hint: Look in the home.scss file
       */
      case 0: return "hid hydrated button button-md button-clear button-clear-md activated";
      case 1: return "out hydrated button button-md button-clear button-clear-md activated";
      case 2: return "hit hydrated button button-md button-clear button-clear-md activated";
    }
}

}
