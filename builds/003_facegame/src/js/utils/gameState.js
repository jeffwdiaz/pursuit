import { gameDataManager } from './gameDataManager.js';
import { leaderboardManager } from './leaderboardManager.js';

export default class GameState {
    constructor() {
        this.score = 10;
        this.highScore = this.loadHighScore();
        this.currentFace = null;
        this.nextFace = null;
        this.gameMode = 'easy';
        this.isGameOver = false;
        this.scoreTimer = null;
        this.scoreCallback = null;
    }

    loadHighScore() {
        const savedScore = localStorage.getItem(`highScore_${this.gameMode}`);
        return savedScore ? parseInt(savedScore, 10) : 0;
    }

    saveHighScore() {
        localStorage.setItem(`highScore_${this.gameMode}`, this.highScore.toString());
    }

    startScoreTimer(callback) {
        this.stopScoreTimer();
        this.scoreCallback = callback;
        this.scoreTimer = setInterval(() => {
            this.updateScore(-1); // Decrease score by 1 every 2 seconds
            if (this.scoreCallback) {
                this.scoreCallback(this.score);
            }
            
            if (this.score <= 0) {
                this.endGame();
            }
        }, 2000);
    }

    stopScoreTimer() {
        if (this.scoreTimer) {
            clearInterval(this.scoreTimer);
            this.scoreTimer = null;
        }
    }

    updateScore(points) {
        this.score = Math.max(0, this.score + points);
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
        }
        if (this.scoreCallback) {
            this.scoreCallback(this.score);
        }
    }

    setGameMode(mode) {
        this.gameMode = mode;
        this.highScore = this.loadHighScore();
        gameDataManager.setGameMode(mode);
    }

    resetGame() {
        this.stopScoreTimer();
        this.score = 10;
        this.isGameOver = false;
        this.highScore = this.loadHighScore();
        if (this.scoreCallback) {
            this.scoreCallback(this.score);
        }
    }

    endGame() {
        this.stopScoreTimer();
        this.isGameOver = true;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
        }
        // Save score to leaderboard
        leaderboardManager.addScore(this.gameMode, 'Anonymous', this.score);
    }
}

export const gameState = new GameState(); 