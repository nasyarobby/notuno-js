import RoundRectangle from "phaser3-rex-plugins/plugins/gameobjects/shape/roundrectangle/RoundRectangle";
import { CONFIG } from "../config";
import { Scene } from "phaser";

export const COLORS = {
  GREEN: 0x00e743,
  RED: 0xdd0019,
  YELLOW: 0xfff920,
  BLUE: 0x264fce,
};

/** @typedef {"SELECTED" | "HAND"} States*/

export class Card extends Phaser.GameObjects.Sprite {
  /** @type {RoundRectangle} */
  base;
  /** @type {RoundRectangle} */
  shadow;

  /** @type {RoundRectangle} */
  colorOverlay;

  /** @type {Text} */
  face;

  /** @type {States} */
  state;

  /**
   * @param {Scene} scene
   */
  constructor(scene, color, value, x, y) {
    super(scene);
    this.x = x;
    this.y = y;
    this.STATE_SELECTED_Y = y - 140;
    this.STATE_HAND_Y = y;

    this.shadow = scene.add
      .rexRoundRectangle(this.x + 4, this.y + 4, 122, 162, 10, 0x333333)
      .setOrigin(0.5);

    this.base = scene.add
      .rexRoundRectangle(this.x, this.y, 120, 160, 10, 0xefefef)
      .setOrigin(0.5);

    this.base.name = "card";
    this.base.card = this;

    this.state = "HAND";

    this.colorOverlay = scene.add
      .rexRoundRectangle(this.x, this.y, 110, 150, 10, color)
      .setOrigin(0.5);

    this.face = scene.add
      .text(this.x, this.y, value, {
        fontFamily: "Arial Black",
        fontSize: 64,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 2,
        align: "center",
      })
      .setOrigin(0.5);

    this.subface = scene.add
      .text(this.x, this.y, value, {
        fontFamily: "Arial Black",
        fontSize: 24,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 0,
        align: "center",
      })
      .setOrigin(0.5); 

    scene.events.on("update", this.update, this);
  }

  setX(x) {
    this.x = x;
  }

  setInteractive() {
    this.base.setInteractive();
  }

  /**
   *
   * @param {States} state
   */
  setState(state) {
    this.state = state;
  }

  update(time, delta) {
    if (this.state === "SELECTED") {
      if (this.y > this.STATE_SELECTED_Y) {
        this.y -= 1 * delta;
      } else {
        this.y = this.STATE_SELECTED_Y;
      }
    } else if (this.state === "HAND") {
      this.y = this.STATE_HAND_Y;
    }
    // this.y = this.y > CONFIG.SCREEN_HEIGHT-200 ? CONFIG.SCREEN_HEIGHT-200 : this.y+1

    this.base.setX(this.x);
    this.base.setY(this.y);
    // this.base.rotation = Math.PI / 1.5
    // this.shadow.rotation = Math.PI / 1.5
    // this.colorOverlay.rotation = Math.PI / 1.5
    // this.subface.rotation = Math.PI / 1.5
    // this.face.rotation = Math.PI / 1.5

    this.shadow.setX(this.x + 1);
    this.shadow.setY(this.y + 1);

    this.subface.setX(this.x - 42);
    this.subface.setY(this.y - 50);

    this.face.setX(this.x);
    this.face.setY(this.y);

    this.colorOverlay.setX(this.x);
    this.colorOverlay.setY(this.y);

    this.base.setScale(this.scale);
    this.shadow.setScale(this.scale);
    this.colorOverlay.setScale(this.scale);
    this.subface.setScale(this.scale);
    this.face.setScale(this.scale);
  }
}
