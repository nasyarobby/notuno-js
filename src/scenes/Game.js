// @ts-check

import { Scene } from "phaser";
import { CONFIG } from "../config";
import Deck from "./Deck.js";
import HandContainer from "./Hand.js";
import { timer } from "./helpers.js";
import EventDispatcher from "./EventDispatcher.js";

// import { Socket } from 'socket.io';

// const socket = Socket();
// socket.on("connect", () => {
//   console.log("Connected as " + socket.id);
// })

export class Game extends Scene {
  /** @type {Deck} */
  deck;
  constructor() {
    super("Game");
  }

  create() {
    //CREATE SOCKET
    // this.socket = io("localhost:3000");
    // this.socket.on("connect", () => console.log("Connected"));

    // SETUP
    this.cameras.main.setBackgroundColor(0x00ff00);
    this.playerHands = new HandContainer(this, CONFIG.SCREEN_WIDTH / 2, 600);

    this.add.image(512, 384, "background").setAlpha(0.5).setScale(2);

    this.deck = new Deck(this, 1150, 350);

    // horizontal line for each 50px
    for (let i = 0; i < CONFIG.SCREEN_WIDTH; i += 100) {
      this.add.line(0, 0, 0, i, CONFIG.SCREEN_WIDTH, i, 0x000).setOrigin(0);
    }

    for (let i = 0; i < CONFIG.SCREEN_WIDTH; i += 100) {
      this.add.line(0, 0, i, 0, i, CONFIG.SCREEN_HEIGHT, 0x000).setOrigin(0);
    }

    this.deck.shuffleanimation(4);

    EventDispatcher.getE().on("SHUFFLING_ENDED", () => console.log("Finished shuffling"))
  }

  update() {}
}
