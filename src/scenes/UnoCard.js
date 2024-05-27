import { Scene } from "phaser";
import RoundRectangle from "phaser3-rex-plugins/plugins/gameobjects/shape/roundrectangle/RoundRectangle";

const CORNER_FACE_1_OFFSET_X = 45;

export const COLORS = {
  GREEN: 0,
  RED: 1,
  YELLOW: 2,
  BLUE: 3,
};

export const COLORS_ARR = [0x00e743,
   0xdd0019,
   0xfff920,
   0x264fce,
];

export default class Card extends Phaser.GameObjects.Sprite {
  BASE_FILL_COLOR = 0xefefef;

  /** @type {RoundRectangle} */
  base;

  /** @type {boolean} */
  flipped;

  /**
   * @param {Scene} scene
   * @param {number} x
   * @param {number} y
   * @param {string} value
   * @param {number} baseColor
   * @param {boolean} flipped
   */
  constructor(scene, x, y, value, baseColor, flipped = false) {
    super(scene);
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.rotatingSpeed = 0;
    this.rotatingR = -0.0005;
    this.flipped = flipped || false;
    const color = COLORS_ARR[baseColor]

    this.base = scene.add
      .rexRoundRectangle(this.x, this.y, 120, 160, 10, this.BASE_FILL_COLOR)
      .setOrigin(0.5);

    if (this.flipped === false) {
      this.suitBase = scene.add
        .rexRoundRectangle(this.x, this.y, 115, 155, 10, color)
        .setOrigin(0.5);

      this.faceBg = scene.add
        .ellipse(this.x, this.y, 75, 120, 0xffffff)
        .setOrigin(0.5)
        .setRotation(Math.PI / 4);

      this.corner1 = scene.add
        .text(this.x - CORNER_FACE_1_OFFSET_X, this.y - 60, value, {
          color: "#000",
          // strokeThickness: 1,
          // stroke: "#000",
        })
        .setOrigin(0.5);
      this.corner2 = scene.add
        .text(this.x + CORNER_FACE_1_OFFSET_X, this.y + 60, value, {
          color: "#000",
          // strokeThickness: 1,
          // stroke: "#000",
        })
        .setOrigin(0.5);
      this.corner2.rotation = Math.PI;

      this.face = scene.add
        .text(this.x, this.y, value, {
          fontSize: 64,
          color: "#000",
          strokeThickness: 3,
          stroke: "#000",
        })
        .setOrigin(0.5);
    } else {
      this.corner1 = null;
      this.corner2 = null;

      this.suitBase = scene.add
        .rexRoundRectangle(this.x, this.y, 115, 155, 10, 0x000000)
        .setOrigin(0.5);
      this.face = scene.add
        .rectangle(this.x, this.y, 40, 40, 0x777777)
        .setOrigin(0.5);
    }

    scene.events.on("update", this.update, this);
  }

  create() {}

  setInteractive(name) {
    this.base.setInteractive();
    this.base.name = name;
  }

  setX(x) {
    this.x = x;
    this.base.x = x;
    this.suitBase.x = x;
    this.face.x = x;
    if (this.faceBg) this.faceBg.x = x;
    if (this.corner1) this.corner1.x = x;
    if (this.corner2) this.corner2.x = x;
    // this.corner2.x = x + 45;
  }

  setY(y) {
    this.y = y;
    this.base.y = y;
    this.suitBase.y = y;
    this.face.y = y;
    if (this.faceBg) this.faceBg.y = y;
    if (this.corner1) this.corner1.y = y;
    if (this.corner2) this.corner2.y = y;
    // this.corner2.x = x + 45;
  }

  setRotation(rad) {
    this.rotation = rad;
    this.base.setRotation(rad);
    this.suitBase.setRotation(rad);

    if (this.face) {
      this.face.setRotation(rad);
    }

    if (this.faceBg) this.faceBg.setRotation(Math.PI / 4 + rad);

    if (this.corner1) {
      this.corner1.setRotation(rad);
      const corner1NewXy = Phaser.Math.RotateAround(
        { x: this.x - CORNER_FACE_1_OFFSET_X, y: this.y - 60 },
        this.x,
        this.y,
        rad
      );
      this.corner1.setX(corner1NewXy.x);
      this.corner1.setY(corner1NewXy.y);
    }

    if (this.corner2) {
      this.corner2.rotation = Math.PI + rad;
      const corner2NewXy = Phaser.Math.RotateAround(
        { x: this.x + CORNER_FACE_1_OFFSET_X, y: this.y + 60 },
        this.x,
        this.y,
        rad
      );
      this.corner2.setX(corner2NewXy.x);
      this.corner2.setY(corner2NewXy.y);
    }
  }

  update(time, delta) {
    this.rotatingSpeed += this.rotatingR;
    if (this.rotatingSpeed < 0) {
      this.rotatingSpeed = 0;
    }
    this.setRotation(this.rotation + (delta * this.rotatingSpeed));

    if (this.speed?.x) {
      this.setX(this.x + (this.speed.x * delta));
      if(this.speed.x > 0) { // right  
        if(this.x >= this.destination.x) {
          this.setX(this.destination.x)
          this.speed.x = 0;
          this.rotatingSpeed = 0
        }
      }

      if(this.speed.x < 0) { // right  
        if(this.x <= this.destination.x) {
          this.setX(this.destination.x)
          this.speed.x = 0;
          this.rotatingSpeed = 0
        }
      }
    }

    if (this.speed?.y) {
      this.setY(this.y + (this.speed.y * delta));
      if(this.speed.y > 0) { // right  
        if(this.y >= this.destination.y) {
          this.setY(this.destination.y)
          this.speed.y = 0;
          this.rotatingSpeed = 0
        }
      }


      if(this.speed.y < 0) { // right  
        if(this.y <= this.destination.y) {
          this.setY(this.destination.y)
          this.speed.y = 0;
          this.rotatingSpeed = 0
        }
      }
    }
  }

  flingTo(x, y) {
    this.destination = { x, y };
    const directionRad = Phaser.Math.Angle.Between(this.x, this.y, x, y);
    console.log({ directionRad });

    this.speed = Phaser.Math.Rotate({ x: 3, y: 0 }, directionRad);
    this.rotatingSpeed = 0.018
    console.log({ directionRad, ...this.speed });
  }

  readd() {
    const base = Phaser.Utils.Objects.Clone(this.base)
    this.base.destroy()
    this.base = this.scene.add(base)
    this.suitBase.destroy()
    this.face.destroy()
  }
}
