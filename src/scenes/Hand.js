import { Scene } from "phaser";
import Card from "./UnoCard.js";
import { CONFIG } from "../config.js";

export default class Hand extends Phaser.GameObjects.Sprite {
  /** @type {Card[]} */
  cards;

  /**
   *
   * @param {Scene} scene
   * @param {number} x
   * @param {number} y
   */
  constructor(scene, x, y) {
    super(scene, x, y);
    scene.add
      .rectangle(
        CONFIG.SCREEN_WIDTH / 2,
        650,
        CONFIG.SCREEN_WIDTH,
        150,
        0xcecece
      )
      .setOrigin(0.5);
    this.cards = [];
    scene.events.on("update", this.update, this);
  }

  /**
   *
   * @param {Card} card
   */
  receiveCard(card) {
    if (this.cards.findIndex((c) => c.id === card.id) === -1) {
      this.cards.push(card);
      console.log("Receive card " + card.id, card);
    //   card.flingTo(this.x, this.y)
    //   card.setRotation(-Math.PI/2)
    } else {
      throw new Error("Card already received.");
    }
  }

  /**
   *
   * @param {number} cardId
   */
  playCard(cardId) {
    // find the card by id
    const card = this.cards.find((c) => c.id === cardId);

    if (!card) {
      throw new Error("Card not found");
    }

    this.cards = this.cards.filter((c) => c.id !== cardId);
    return card;
  }

  update() {
    
  }
}
