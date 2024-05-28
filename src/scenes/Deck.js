// @ts-check
import { Scene } from "phaser";
import Card, { COLORS } from "./UnoCard.js";

function randomFloat(min, max) {
  // Ensure min <= max for valid range
  if (min > max) {
    [min, max] = [max, min]; // Swap values if min is greater than max
  }

  return min + (max - min) * Math.random();
}

export default class Deck extends Phaser.GameObjects.Sprite {
  /** @type {Card[]} */
  cards = [];

  /**
   * @param {Scene} scene
   * @param {number} x
   * @param {number} y
   */
  constructor(scene, x, y) {
    super(scene, x, y, "deck");
    this.lastDepth = 0;
    for (let i = 120; i > 0; i--) {
      const card = new Card(
        scene,
        this.x + randomFloat(-10, 10),
        this.y + randomFloat(-8, 12),
        i,
        Math.round(randomFloat(0, 9)).toString(),
        Math.round(randomFloat(0, 3)),
        true
      );
      card.setRotation(randomFloat(-0.5, 0.5));
      card.setInteractive("deck");
      this.cards.push(card);
    }

    this.cardsLeftlabel = scene.add
      .text(this.x, this.y - 120, this.cards.length.toString(), {
        fontSize: 34,
      })
      .setOrigin(0.5);

    scene.events.on("update", this.update, this);
  }

  update() {
    this.cardsLeftlabel.setText(this.cards.length.toString());
  }

  drawCards() {
    const card = this.cards.pop();

    if (this.lastDepth === undefined) this.lastDepth = 0;
    this.lastDepth++;
    if (card) {
      card.setDepth(this.lastDepth)
      card.flingTo(randomFloat(790, 820), randomFloat(380, 400));
      card.flipped = false
    }
    return card;
  }
}
