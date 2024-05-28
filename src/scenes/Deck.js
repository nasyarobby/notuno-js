// @ts-check
import { Scene } from "phaser";
import Card, { COLORS } from "./UnoCard.js";
import EventDispatcher from "./EventDispatcher.js";
import { timer } from "./helpers.js";

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
      card.setRotation(randomFloat(-0.2, 0.2));
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
      card.flingTo({x: randomFloat(790, 820), y: randomFloat(380, 400)});
      card.flipped = false
    }
    return card;
  }

  async shuffleanimation(n) {
    if(n===0) {
      EventDispatcher.getE().emit("SHUFFLING_ENDED");
      return;
    };

    const NUMBER_OF_CARDS = 20

    const cards = this.cards.slice(0, NUMBER_OF_CARDS).map(c => {
      c.flingTo({x: this.x+100, y: this.y-250});
      return c;
    });

    await new Promise(res => {
      EventDispatcher.getE().on("CARD_FINISHED_MOVING", (params) => {
        if(params.id === cards[cards.length-1].id) {
          EventDispatcher.getE().off("CARD_FINISHED_MOVING");
          res(null)
        }
      })
    })

    this.cards = [...this.cards.slice(NUMBER_OF_CARDS)]
    // console.log(this.cards.map(c =>c.id))
    
    await cards.reduce(async (p,c) => {
      await p;
      this.cards.push(c);
      return new Promise(res => setTimeout(() => {
        c.flingTo({x:this.x, y: this.y});
        this.lastDepth++;
        c.setDepth(this.lastDepth)
        return res(null);
      }, 10))
    }, Promise.resolve(null))

    EventDispatcher.getE().on("CARD_FINISHED_MOVING", async (params) => {
      if(params.id === cards[cards.length-1].id) {
        EventDispatcher.getE().off("CARD_FINISHED_MOVING");
        await timer(300);
        this.shuffleanimation(n-1);
      }
    })
  }
}
