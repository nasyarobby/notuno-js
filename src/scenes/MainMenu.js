import { Scene } from "phaser";
import { CONFIG, SCREEN_CENTER } from "../config";

export class MainMenu extends Scene {
  constructor() {
    super("MainMenu");
    this.cards = [];
  }

  create() {
    this.add
      .image(CONFIG.SCREEN_WIDTH / 2, CONFIG.SCREEN_HEIGHT / 2, "background")
      .setOrigin(0.5);

    this.add
      .image(CONFIG.SCREEN_WIDTH / 2, CONFIG.SCREEN_HEIGHT / 2 - 100, "logo")
      .setOrigin(0.5);

    this.add
      .text(CONFIG.SCREEN_WIDTH / 2, CONFIG.SCREEN_HEIGHT / 2, "Create Game", {
        fontFamily: "Arial Black",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5)
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
