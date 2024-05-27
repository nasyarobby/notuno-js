import { Scene } from "phaser";
import RoundRectangle from "phaser3-rex-plugins/plugins/gameobjects/shape/roundrectangle/RoundRectangle";

const CORNER_FACE_1_OFFSET_X = 45;

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

  /** @type {{x: number, y: number}[]} */
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

    this.front = [
      this.suitBase,
      this.faceBg,
      this.corner1,
      this.corner2,
      this.face,
    ];
    this.back = [this.backColor, this.backEllipse, this.backText];

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
    this.back.forEach((node) => (node.x = x));
    this.front.forEach((node, index) => {
      if (index === 2) {
        const corner1NewXy = Phaser.Math.RotateAround(
          { x: this.x - CORNER_FACE_1_OFFSET_X, y: this.y - 60 },
          this.x,
          this.y,
          this.rotation
        );
        this.corner1.setX(corner1NewXy.x);
        // this.corner1.setY(corner1NewXy.y);
      } else if (index === 3) {
      } else return (node.x = x);
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
      const corner2NewXy = Phaser.Math.RotateAround(
        { x: this.x + CORNER_FACE_1_OFFSET_X, y: this.y + 60 },
        this.x,
        this.y,
        rad
      );
      this.corner2.setX(corner2NewXy.x);
      this.corner2.setY(corner2NewXy.y);
      this.corner2.rotation = Math.PI + rad;
    }

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
      const directionRad = Phaser.Math.Angle.Between(
        this.x,
        this.y,
        destination.x,
        destination.y
      );
      this.speed = Phaser.Math.Rotate({ x: 2, y: 0 }, directionRad);

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
    if ((this.speed.y === 0) & (this.speed.x === 0)) {
      this.state = "idle";
      console.log("Card " + this.id + " is now idle");
      this.destination.shift();
    }
  }

  flingTo(x, y, state) {
    this.destination.push({ x, y });

    this.rotatingSpeed = 0.003;
    this.state = state;
  }
}
