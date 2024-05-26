import { GameObjects, Scene } from "phaser";
import { Card, COLORS } from "./Card";
import { CONFIG } from "../config";

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
        const card = new Card(scene, colors[color], values[value])
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
      card.setY(CONFIG.SCREEN_HEIGHT - 100);
      // card.setScale(1.5)
    });

  }

}

export class Game extends Scene {
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

    this.player = new Player(this);
    this.player.x = 100;
    this.input.on("pointerdown", this.pointerDownHandler, this);
    // this.input.on("pointerup", this.player.pointerUpHandler);
    // this.player.input.on('drag', this.player.dragHandler)
  }

  pointerDownHandler(pointer, targets) {
    this.input.off('pointerdown', this.pointerDownHandler, this)
    this.dragObj = this.player.handsArea
    if(this.dragObj && this.dragObj.cardStartX!== undefined) {
      this.initialStartX = this.dragObj.cardStartX;
      console.log("Down", pointer.x, this.dragObj, targets[0])
    }

    if(targets[0]?.name === 'card') {
      if(this.selectedCard)
      this.selectedCard.selected = false;
      this.selectedCard = targets[0].card;
      this.selectedCard.selected = true;
    }

    this.input.on('pointermove', this.doDrag, this)
    this.input.on('pointerup', this.stopDrag, this)
  }

  doDrag(pointer) {
    const distance = pointer.x - pointer.downX;
    console.log(this.initialStartX, distance)
    this.dragObj.cardStartX = this.initialStartX + distance
  }

  stopDrag() {
    this.input.on('pointerdown', this.pointerDownHandler, this)
    this.input.off('pointermove', this.doDrag, this)
    this.input.off('pointerup', this.stopDrag, this)
  }

  update() {}
}
