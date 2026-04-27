import './styles.css';
import { Game } from './game/Game.js';

const canvas = document.querySelector('#game-canvas');
const game = new Game({ canvas });

game.boot();
