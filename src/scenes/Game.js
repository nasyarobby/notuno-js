// @ts-check

import { Scene } from "phaser";
import { CONFIG } from "../config";
import Deck from "./Deck.js";
import HandContainer from "./Hand.js";
import EventDispatcher from "./EventDispatcher.js";
import EnemyIndicator from "./EnemyIndicator.js";
import Player from "./Player.js";
import { timer } from "./helpers.js";

// import { Socket } from 'socket.io';

// const socket = Socket();
// socket.on("connect", () => {
//   console.log("Connected as " + socket.id);
// })

export class Game extends Scene {
  /** @type {Deck} */
  deck;
  /** @type {EventDispatcher} */
  e;
  /** @type {Player[]} */
  players;

  constructor() {
    super("Game");
    this.e = EventDispatcher.getE();
    this.e.on("GAME_START", this.onGameStart.bind(this));
    this.players = [];
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

    this.players = [
      new Player(this, "player", 0),
      new Player(this, "not-active", 1),
      new Player(this, "not-active", 2),
      new Player(this, "not-active", 3),
    ];

    this.input.on("pointerdown", this.onPointerDown, this);

    // horizontal line for each 50px
    for (let i = 0; i < CONFIG.SCREEN_WIDTH; i += 100) {
      this.add.line(0, 0, 0, i, CONFIG.SCREEN_WIDTH, i, 0x000).setOrigin(0);
    }

    for (let i = 0; i < CONFIG.SCREEN_WIDTH; i += 100) {
      this.add.line(0, 0, i, 0, i, CONFIG.SCREEN_HEIGHT, 0x000).setOrigin(0);
    }

    // this.start();

    timer(1000).then(() => {
      this.players[2].setPlayerName("Bayu", "online");
    });

    timer(4000).then(() => {
      this.players[1].setPlayerName("April", "online");
    });

    timer(2000).then(() => {
      this.players[1].setPlayerName("Lia", "online");
    });

    timer(12000).then(() => {
      this.start();
    });
  }

  start() {
    this.e.emit("GAME_START", { game: "start" });
    EventDispatcher.getE().on(
      "SHUFFLING_ENDED",
      this.onFinishedShuffling.bind(this)
    );
  }

  onGameStart(params) {
    console.log(params);
    this.deck.animateShuffling(
      this.players.filter((e) => e.type !== "not-active").length
    );
  }

  onFinishedShuffling(params) {
    this.deck.animateDrawCards(
      this.players.filter((e) => e.type !== "not-active").length
    );
  }

  update() {
    this.players.reduce((prev, current) => {
      let newPos = prev;
      if (current.type !== "not-active" && current.type !== "player") {
        newPos += 1;
        current.setPlayerPosition(newPos);
      }
      return newPos;
    }, 0);
  }

  onPointerDown(pointer, targets) {
    if (targets.length && targets[0].name === "playerNameInput") {
      console.log(targets[0].name);
      /**  @type {HTMLDivElement | null}        */
      const playerNameModal = document.querySelector("div#playerNameModal");
      /**  @type {HTMLButtonElement | null}        */
      const playerNameSaveBtn = document.querySelector(
        "div#playerNameModal button"
      );
      /**  @type {HTMLInputElement | null}        */
      const playerNameTextInput = document.querySelector("#playerName");

      if (playerNameModal && playerNameTextInput && playerNameSaveBtn) {
        playerNameModal.style.display = "block";
        playerNameTextInput.value = this.players[0].playerName;
        playerNameSaveBtn.onclick = (e) => {
          this.players[0].setPlayerName(playerNameTextInput?.value);
          playerNameModal.style.display = "none";
        };
      }
    }

    if(targets.length && targets[0].name === "playerIsReadyInput") {
      this.players[0].ready = true;
    }

    if(targets.length && targets[0].name === "playerIsNotReadyInput") {
      this.players[0].ready = false;
    }
  }
}
