import { Scene } from "phaser";
import RoundRectangle from "phaser3-rex-plugins/plugins/gameobjects/shape/roundrectangle/RoundRectangle";
import EventDispatcher from "./EventDispatcher";

export const COLORS = {
  RED: 0,
  GREEN: 1,
  BLUE: 2,
  YELLOW: 3,
};

export const COLORS_ARR = [
  0xdd0019, // r
  0x00e743, // g
  0x264fce, // b
  0xfff920, // y
];

export default class Card extends Phaser.GameObjects.Sprite {
  BASE_FILL_COLOR = 0xefefef;

  /**
   * @type {"draw" | "moving" | "idle"}
   */
  state;

  /**
   * @type {number}
   */
  id;

  /** @type {RoundRectangle} */
  base;

  /** @type {RoundRectangle} */
  suitBase;

  /** @type {boolean} */
  flipped;

  /** @type {{x: number, y: number}} */
  speed;

  /** @type {{x: number, y: number, speed: number, rotatingSpeed: number}[]} */
  destination;

  /**
   * @param {Scene} scene
   * @param {number} x
   * @param {number} y
   * @param {number} id
   * @param {string} value
   * @param {number} baseColor
   * @param {boolean} flipped
   */
  constructor(scene, x, y, id, value, baseColor, flipped = false) {
    super(scene);
    this.scene = scene;
    this.id = id;
    this.state = "idle";
    this.x = x;
    this.y = y;
    this.speed = { x: 0, y: 0 };
    this.rotatingSpeed = 0;
    this.rotatingR = -0.0005;
    this.flipped = flipped || false;
    const color = COLORS_ARR[baseColor];
    this.destination = [];

    this.base = scene.add
      .rexRoundRectangle(this.x, this.y, 120, 160, 10, this.BASE_FILL_COLOR)
      .setOrigin(0.5);

    this.suitBase = scene.add
      .rexRoundRectangle(this.x, this.y, 115, 155, 10, color)
      .setOrigin(0.5);

    this.faceBg = scene.add
      .ellipse(this.x, this.y, 75, 120, 0xffffff)
      .setOrigin(0.5)
      .setRotation(Math.PI / 4);

    this.faceCorner = scene.add.image(this.x, this.y, value).setOrigin(0.5).setTintFill(0xFFFFFF);

    this.face = scene.add
      .image(this.x, this.y, value)
      .setOrigin(0.5)
      .setCrop(30, 40, 50, 50);

    this.face.setTintFill(color)

    this.backColor = scene.add
      .rexRoundRectangle(this.x, this.y, 115, 155, 10, 0x000000)
      .setOrigin(0.5);
    this.backEllipse = scene.add
      .ellipse(this.x, this.y, 75, 120, COLORS_ARR[0])
      .setOrigin(0.5)
      .setRotation(Math.PI / 4);
    this.backText = scene.add
      .text(this.x, this.y, "NOTUNO", {
        fontSize: 20,
        color: "#FFF",
        strokeThickness: 1,
        stroke: "#000",
      })
      .setOrigin(0.5);

    this.front = [this.suitBase, this.faceBg, this.faceCorner, this.face];
    this.back = [this.backColor, this.backEllipse, this.backText];

    scene.events.on("update", this.update, this);
  }

  create() {}

  setInteractive(name) {
    this.base.setInteractive();
    this.base.playerName = name;
  }

  setX(x) {
    this.x = x;
    this.base.x = x;
    this.back.forEach((node) => (node.x = x));
    this.front.forEach((node, index) => {
      return (node.x = x);
    });
  }

  setY(y) {
    this.y = y;
    this.base.y = y;
    this.back.forEach((node) => (node.y = y));
    this.front.forEach((node) => (node.y = y));
  }

  setRotation(rad) {
    this.rotation = rad;
    this.base.setRotation(rad);
    this.suitBase.setRotation(rad);

    this.face.setRotation(rad);
    this.faceCorner.setRotation(rad);

    if (this.faceBg) this.faceBg.setRotation(Math.PI / 4 + rad);

    this.back.forEach((node, index) => {
      if (index === 1) node.setRotation(Math.PI / 4 + rad);
      else node.setRotation(rad);
    });
  }

  setDepth(depth) {
    this.base.depth = depth;
    this.front.forEach((e) => e.setDepth(depth));
    this.back.forEach((e) => e.setDepth(depth));
  }

  update(time, delta) {
    if (this.flipped) {
      this.back.forEach((e) => (e.visible = true));
      this.front.forEach((e) => (e.visible = false));
    } else {
      this.back.forEach((e) => (e.visible = false));
      this.front.forEach((e) => (e.visible = true));
    }

    this.rotatingSpeed += this.rotatingR;
    if (this.rotatingSpeed < 0) {
      this.rotatingSpeed = 0;
    }
    this.setRotation(this.rotation + delta * this.rotatingSpeed);

    const destination = this.destination[0];

    if (destination) {
      this.state = "moving"
      this.rotatingSpeed = destination.rotatingSpeed;
      const directionRad = Phaser.Math.Angle.Between(
        this.x,
        this.y,
        destination.x,
        destination.y
      );
      this.speed = Phaser.Math.Rotate({ x: destination.speed, y: 0 }, directionRad);

      if (this.speed?.x) {
        this.setX(this.x + this.speed.x * delta);
        if (this.speed.x > 0) {
          // right
          if (this.x >= destination.x) {
            this.setX(destination.x);
            this.speed.x = 0;
            this.rotatingSpeed = 0;
          }
        }

        if (this.speed.x < 0) {
          // right
          if (this.x <= destination.x) {
            this.setX(destination.x);
            this.speed.x = 0;
            this.rotatingSpeed = 0;
          }
        }
      }

      if (this.speed.y) {
        this.setY(this.y + this.speed.y * delta);
        if (this.speed.y > 0) {
          // right
          if (this.y >= destination.y) {
            this.setY(destination.y);
            this.speed.y = 0;
            this.rotatingSpeed = 0;
          }
        }

        if (this.speed.y < 0) {
          // right
          if (this.y <= destination.y) {
            this.setY(destination.y);
            this.speed.y = 0;
            this.rotatingSpeed = 0;
          }
        }
      }
    }
    if (this.state ==="moving" && (this.speed.y === 0) & (this.speed.x === 0)) {
      // console.log("Card " + this.id + " is now idle");
      this.destination.shift();
      EventDispatcher.getE().emit("CARD_FINISHED_MOVING", {
        id: this.id
      })
      this.state = "idle"
    }
  }

  /**
   * 
   * @param {{x: number, y: number, speed?: number, rotatingSpeed?: number}} param0 
   */
  flingTo({
    x,
    y,
    speed,
    rotatingSpeed,
  }) {
    if(!rotatingSpeed) rotatingSpeed = 0;
    if(!speed) speed = 2;
    this.destination.push({ x, y, speed, rotatingSpeed});
  }
}
