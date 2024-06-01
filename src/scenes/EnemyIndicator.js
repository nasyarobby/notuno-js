// @ts-check

export default class EnemyIndicator extends Phaser.GameObjects.Sprite {
    /** @type {Phaser.Scene} */
    scene;

    /**
     * 
     * @param {Phaser.Scene} scene 
     * @param {number} x 
     * @param {number} y
     */
  constructor(scene, x, y) {
    super(scene, x, y, "enemy");

    this.scene = scene;
    this.playerName = "Test"
    this.scene.add.rexRoundRectangle(this.x, this.y, 300, 140, 10, 0xFFFFFF).setOrigin(0)
    this.scene.add.rexRoundRectangle(this.x+5, this.y+5, 290, 130, 10, 0x004080).setOrigin(0)
    this.nameObj = this.scene.add.text(this.x+10, this.y+10, this.playerName, {
        fontSize: 32,
        color: "#000000"
    })
  }

  onCreate() {

  }

  onUpdate() {
    this.nameObj.text = this.playerName
  }
}
