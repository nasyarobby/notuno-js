import { Scene } from "phaser";
import { CONFIG } from "../config";

export class JoinGame extends Scene {
  constructor() {
    super("JoinGame");
    this.cards = [];
  }

  create() {
    this.add
      .image(CONFIG.SCREEN_WIDTH / 2, CONFIG.SCREEN_HEIGHT / 2, "background")
      .setOrigin(0.5);

    this.add
      .text(200, CONFIG.SCREEN_HEIGHT / 2, "Join Code", {
        fontFamily: "Arial Black",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setInteractive()
      .setName("CreateGame");

    this.add
      .text(
        CONFIG.SCREEN_WIDTH / 2,
        CONFIG.SCREEN_HEIGHT / 2 + 70,
        "Join Game",
        {
          fontFamily: "Arial Black",
          fontSize: 38,
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 8,
          align: "center",
        }
      )
      .setOrigin(0.5)
      .setInteractive()
      .setName("JoinGame");

    this.input.once("pointerdown", (pointer, targets) => {
        /**
         * @type {string[]}
         */
        const names = targets.map(e => e.name);
        if(names.includes("CreateGame")) {
            this.scene.start("Game")
        }

        if(names.includes("JoinGame")) {
            this.scene.start("JoinGame")
        }
    });
  }

  update() {}
}
