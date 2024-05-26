import { GameObjects, Scene } from "phaser";
import { Card, COLORS } from "./Card";
import UnoCard from "./UnoCard.js"
import { CONFIG } from "../config";
import Deck from "./Deck.js";

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

export class Player extends Phaser.GameObjects.Sprite {
  /** @type {Card[]} */
  cards;

  /** @type {string} */
  name;

  cardPosition;

  /**
   *
   * @param {Scene} scene
   * @param {string} name
   */
  constructor(scene, name) {
    super(scene);
    this.handsArea = scene.add
      .rectangle(
        CONFIG.SCREEN_WIDTH / 2,
        CONFIG.SCREEN_HEIGHT - 100,
        CONFIG.SCREEN_WIDTH,
        200,
        0xcecece
      );

      this.handsArea.setInteractive();
      this.handsArea.cardPosition = 0;

    const randomCards = (n) => {
      const cards = [];
      for (let i = 0; i < n; i++) {
        const color = getRandomInt(0, 3);
        const colors = [COLORS.BLUE, COLORS.RED, COLORS.GREEN, COLORS.YELLOW];
        const value = getRandomInt(0, 9);
        const values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((e) => e.toString());
        const card = new Card(scene, colors[color], values[value], 0, CONFIG.SCREEN_HEIGHT-100)
        card.setInteractive()
        cards.push(card);
      }

      return cards;
    };

    this.cards = randomCards(30);
    // const allCardsWidth = this.cards.length * 120) + (this.cards.length - 1)* 5;
    // console.log((CONFIG.SCREEN_WIDTH - allCardsWidth)/2)
    this.handsArea.cardStartX = 0;

    this.name = name;
    scene.events.on("update", this.update, this);
    // scene.input.on("pointermove", this.pointerMoveHandler);

  }

  update() {
    let cardsWidth = (CONFIG.SCREEN_WIDTH - 50) / this.cards.length ;
    if(cardsWidth < 30) cardsWidth = 40
    // console.log(allCardsWidth)
    this.cards.forEach(
      /**
       * 
       * @param {Card} card 
       * @param {number} index 
       */
      (card, index) => {
      card.setX(this.handsArea.cardStartX + (index * cardsWidth)+60);
    });

  }

}

export class Game extends Scene {
  /** @type {Deck} */
  deck
  /** @type {Player} */
  player;
  constructor() {
    super("Game");
  }

  create() {
    //CREATE SOCKET
    // this.socket = io("localhost:3000");
    // this.socket.on("connect", () => console.log("Connected"));
    this.cameras.main.setBackgroundColor(0x00ff00);

    this.add.image(512, 384, "background").setAlpha(0.5).setScale(2);

    this.deck = new Deck(this, 600, 300)

    const card = new UnoCard(this, 200, 200, "2", COLORS.BLUE);
    const flippedCard = new UnoCard(this, 300, 200, null, null);
    card.setRotation(1.4)
    // flippedCard.setRotation(0.4)

    card.setX(500)
    card.setY(500)
    this.player = new Player(this);
    this.player.x = 100;
    this.input.on("pointerdown", this.pointerDownHandler, this);
    // this.input.on("pointerup", this.player.pointerUpHandler);
    // this.player.input.on('drag', this.player.dragHandler)

    this.add.line(0, 0, 0, 100, CONFIG.SCREEN_WIDTH, 100, 0x000000).setOrigin(0)
    this.add.line(0, 0, 0, 200, CONFIG.SCREEN_WIDTH, 200, 0xff0000).setOrigin(0)
  }

  pointerDownHandler(pointer, targets) {
    if(targets[0]?.name==="deck") {
      console.log(targets)
      this.deck.cards.shift()
      return 
    }

    this.input.off('pointerdown', this.pointerDownHandler, this)
    if(targets.length) {
      this.dragObj = this.player.handsArea
    }
    
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
