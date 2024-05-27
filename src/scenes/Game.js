// @ts-check

import { Scene } from "phaser";
import { Card, COLORS } from "./Card";
import UnoCard from "./UnoCard.js"
import { CONFIG } from "../config";
import Deck from "./Deck.js";
import HandContainer from "./Hand.js";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  // The maximum is exclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


// import { Socket } from 'socket.io';

// const socket = Socket();
// socket.on("connect", () => {
//   console.log("Connected as " + socket.id);
// })

export class Game extends Scene {
  /** @type {Deck} */
  deck
  constructor() {
    super("Game");
  }

  create() {
    //CREATE SOCKET
    // this.socket = io("localhost:3000");
    // this.socket.on("connect", () => console.log("Connected"));
    this.cameras.main.setBackgroundColor(0x00ff00);
    this.playerHands = new HandContainer(this, CONFIG.SCREEN_WIDTH/2, 600)

    this.add.image(512, 384, "background").setAlpha(0.5).setScale(2);

    this.deck = new Deck(this, 600, 300)

    const card = new UnoCard(this, 200, 200, 9999, "2", COLORS.BLUE);
    // const flippedCard = new UnoCard(this, 300, 200, null, null);
    card.setRotation(1.4)
    // // flippedCard.setRotation(0.4)

    // card.setX(500)
    // card.setY(500)

    this.input.on("pointerdown", this.pointerDownHandler, this);
    // this.input.on("pointerup", this.player.pointerUpHandler);
    // this.player.input.on('drag', this.player.dragHandler)

    this.add.line(0, 0, 0, 100, CONFIG.SCREEN_WIDTH, 100, 0x000000).setOrigin(0)
    this.add.line(0, 0, 0, 200, CONFIG.SCREEN_WIDTH, 200, 0xff0000).setOrigin(0)

    this.add.line(0, 0, 0, 400, CONFIG.SCREEN_WIDTH, 400, 0xff0000).setOrigin(0)
    this.add.line(0, 0, 800, 0, 800, CONFIG.SCREEN_HEIGHT, 0x000000).setOrigin(0)
  }

  pointerDownHandler(pointer, targets) {
    if(targets[0]?.name==="deck") {
      console.log(targets)
      const card = this.deck.drawCards();
      if(card)
      this.playerHands?.receiveCard(card);
      return 
    }

    this.input.off('pointerdown', this.pointerDownHandler, this)
    
    if(this.dragObj && this.dragObj.cardStartX!== undefined) {
      this.initialStartX = this.dragObj.cardStartX;
    }

    if(targets[0]?.name === 'card') {
      if(this.selectedCard)
      this.selectedCard.setState("HAND");
      this.selectedCard = targets[0].card;
      this.selectedCard.setState("SELECTED")
    }

    this.input.on('pointermove', this.doDrag, this)
    this.input.on('pointerup', this.stopDrag, this)
  }

  doDrag(pointer) {
    const distance = pointer.x - pointer.downX;
    this.dragObj.cardStartX = this.initialStartX + distance
  }

  stopDrag() {
    this.dragObj = null
    this.input.on('pointerdown', this.pointerDownHandler, this)
    this.input.off('pointermove', this.doDrag, this)
    this.input.off('pointerup', this.stopDrag, this)
  }

  update() {}
}
