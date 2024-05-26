import RoundRectangle from "phaser3-rex-plugins/plugins/gameobjects/shape/roundrectangle/RoundRectangle";
import { CONFIG } from "../config";

export const COLORS = {
  GREEN: 0x00e743,
  RED: 0xdd0019,
  YELLOW: 0xfff920,
  BLUE: 0x264fce,
};
export class Card extends Phaser.GameObjects.Sprite {
  /** @type {RoundRectangle} */
  base;
    /** @type {RoundRectangle} */
    shadow;

  /** @type {RoundRectangle} */
  colorOverlay;

  /** @type {Text} */
  face;
  constructor(scene, color, value, x, y) {
    super(scene);
    this.x = x;
    this.y = y;
    
    this.shadow = scene.add
    .rexRoundRectangle(this.x+4, this.y+4, 122, 162, 10, 0x333333)
    .setOrigin(0.5);

    this.base = scene.add
    .rexRoundRectangle(this.x, this.y, 120, 160, 10, 0xefefef)
    .setOrigin(0.5);

    this.base.name = "card"
    this.base.card = this;

    this.colorOverlay = scene.add
      .rexRoundRectangle(this.x, this.y, 110, 150, 10, color)
      .setOrigin(0.5);
    this.subface = scene.add
      .text(this.x-10, this.y-10, value, {
        fontFamily: "Arial Black",
        fontSize: 24,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 0,
        align: "center",
      })
      .setOrigin(0.5);

    this.face = scene.add
      .text(this.x-10, this.y-10, value, {
        fontFamily: "Arial Black",
        fontSize: 64,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 2,
        align: "center",
      })
      .setOrigin(0.5);

    scene.events.on("update", this.update, this);
  }

  setInteractive() {
    this.base.setInteractive();
  }

  update(time, delta) {
    // if(this.selected) {
    //     this.base.fillColor = 0x00ff00
    // }
    // else this.base.fillColor = 0xefefef

    if(this.selected)
    this.y = this.y > CONFIG.SCREEN_HEIGHT-200 ? CONFIG.SCREEN_HEIGHT-200 : this.y+1

    this.base.setX(this.x);
    this.base.setY(this.y);
    
    this.shadow.setX(this.x+1);
    this.shadow.setY(this.y+1);

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
