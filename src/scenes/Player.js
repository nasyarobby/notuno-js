// @ts-check

import { CONFIG } from "../config";

export default class Player extends Phaser.GameObjects.Sprite {
  /** @typedef {"not-active" | "player" | "other-player" | "online" | "com"} PlayerType */
  /** @type {PlayerType} */
  type;

  /** @type {boolean} */
  ready

  /** @type {string} */
  playerName;

  /** @type {number} */
  playerPos;

  /** @type {Phaser.GameObjects.Text} */
  nameObj

  /**
   *
   * @param {Phaser.Scene} scene
   * @param {PlayerType} type
   * @param {number} pos
   */
  constructor(scene, type, pos) {
    super(scene, 0, 0, "player");

    this.type = type;
    this.ready = false;

    this.playerName = this.type;

    this.setPlayerPosition(pos)

    this.box1 = this.scene.add.rexRoundRectangle(this.x, this.y, 300, 140, 10, 0xFFFFFF).setOrigin(0)
    this.box2 = this.scene.add.rexRoundRectangle(this.x+5, this.y+5, 290, 130, 5, 0x004080).setOrigin(0)
    this.nameObj = this.scene.add.text(this.x+10, this.y+10, this.playerName, {
        fontSize: 32,
        color: "#FFFFFF"
    })

    if(this.type === "player") {
        this.nameObj.setInteractive();
        this.nameObj.setName("playerNameInput")
    }

    scene.events.on("update", this.update, this);
    
    
  }

  /**
   *
   * @param {string} name
   * @param {PlayerType | undefined} type
   * @returns {Player}
   */
  setPlayerName(name, type=undefined) {
    this.playerName = name;
    if(type) {
        this.setPlayerType(type);
    }
    return this;
  }

  /**
   *
   * @param {number} pos
   * @returns {Player}
   */
  setPlayerPosition(pos) {
    this.playerPos = pos;

    if(this.type === "player") {
        this.x = 10
        this.y = 580
    }
    else {
        this.x = 10 + ((pos-1) * 320)
        this.y = 20
    }
    return this;
  }

  /**
   * 
   * @param {PlayerType} type 
   * @returns {Player}
   */
  setPlayerType(type) {
    this.type = type;
    return this
  }

  update() {
    this.nameObj.text = this.playerName;

    if(this.type === "not-active") {
        this.setVisible(false)
    }
    else {
        this.setVisible(true);
        this.setPlayerPosition(this.playerPos)
        this.box1.setPosition(this.x, this.y)
        this.box2.setPosition(this.x+5, this.y+5)
        this.nameObj.setPosition(this.x+10, this.y+10)
    }

  }

  /**
   * 
   * @param {boolean} visible 
   */
  setVisible(visible) {
    this.box1.setVisible(visible)
    this.box2.setVisible(visible)
    this.nameObj.setVisible(visible)
    return this;
  }
}
