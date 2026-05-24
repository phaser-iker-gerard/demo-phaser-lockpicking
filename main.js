class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    this.add.text(400, 170, 'LOCKPICKING DEMO', {
      fontSize: '42px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(400, 245, 'Prem ENTER per començar', {
      fontSize: '26px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(400, 315, 'Mou-te amb WASD o fletxes', {
      fontSize: '20px',
      color: '#cccccc'
    }).setOrigin(0.5);

    this.add.text(400, 350, 'Prem E davant una porta vermella per obrir-la', {
      fontSize: '20px',
      color: '#cccccc'
    }).setOrigin(0.5);

    this.input.keyboard.on('keydown-ENTER', () => {
      this.scene.start('GameScene');
    });
  }
}

class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    this.isPaused = false;
    this.gameCompleted = false;

    this.player = this.add.circle(130, 300, 18, 0xffffff);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('W,A,S,D,E,ESC');

    this.add.text(20, 20, 'Demo Phaser v3 - Pis amb portes i ganzues', {
      fontSize: '18px',
      color: '#ffffff'
    });

    this.add.text(20, 48, 'E = obrir porta | ESC = pausa', {
      fontSize: '15px',
      color: '#cccccc'
    });

    this.walls = this.physics.add.staticGroup();
    this.doors = [];

    this.createHouse();

    this.physics.add.collider(this.player, this.walls);

    this.nearDoorText = this.add.text(400, 520, '', {
      fontSize: '20px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.completedText = this.add.text(400, 300, 'CASA OCUPADA', {
      fontSize: '56px',
      color: '#00ff66',
      align: 'center',
      backgroundColor: '#000000'
    }).setOrigin(0.5);

    this.completedText.setVisible(false);

    this.pauseText = this.add.text(400, 300, 'PAUSA\nPrem ESC per continuar', {
      fontSize: '36px',
      color: '#ffffff',
      align: 'center',
      backgroundColor: '#000000'
    }).setOrigin(0.5);

    this.pauseText.setVisible(false);

    this.input.keyboard.on('keydown-ESC', () => {
      this.togglePause();
    });

    this.input.keyboard.on('keydown-E', () => {
      const door = this.getNearClosedDoor();

      if (door !== null && !this.isPaused && !this.gameCompleted) {
        this.scene.launch('LockpickingScene', {
          door: door,
          gameScene: this
        });

        this.scene.pause();
      }
    });
  }

  createHouse() {
    this.createWall(400, 80, 680, 22);
    this.createWall(400, 520, 680, 22);
    this.createWall(70, 300, 22, 440);
    this.createWall(730, 300, 22, 440);

    this.createWall(260, 170, 22, 180);
    this.createWall(260, 430, 22, 180);

    this.createWall(520, 170, 22, 180);
    this.createWall(520, 300, 22, 120);
    this.createWall(520, 430, 22, 180);

    this.createWall(625, 300, 210, 22);

    this.createDoor(260, 300, 22, 80);
    this.createDoor(520, 230, 22, 80);
    this.createDoor(520, 370, 22, 80);

    this.add.text(155, 115, 'Entrada', {
      fontSize: '15px',
      color: '#aaaaaa'
    }).setOrigin(0.5);

    this.add.text(390, 300, 'Passadis', {
      fontSize: '15px',
      color: '#aaaaaa'
    }).setOrigin(0.5);

    this.add.text(625, 190, 'Habitacio 1', {
      fontSize: '15px',
      color: '#aaaaaa'
    }).setOrigin(0.5);

    this.add.text(625, 420, 'Habitacio 2', {
      fontSize: '15px',
      color: '#aaaaaa'
    }).setOrigin(0.5);
  }

  createWall(x, y, width, height) {
    const wall = this.add.rectangle(x, y, width, height, 0xffffff);
    this.physics.add.existing(wall, true);
    this.walls.add(wall);
  }

  createDoor(x, y, width, height) {
    const door = this.add.rectangle(x, y, width, height, 0xff0000);
    this.physics.add.existing(door, true);
    door.isOpen = false;

    this.doors.push(door);

    this.physics.add.collider(this.player, door);

    return door;
  }

  getNearClosedDoor() {
    for (let i = 0; i < this.doors.length; i++) {
      const door = this.doors[i];

      if (!door.isOpen) {
        const distance = Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          door.x,
          door.y
        );

        if (distance < 95) {
          return door;
        }
      }
    }

    return null;
  }

  areAllDoorsOpen() {
    for (let i = 0; i < this.doors.length; i++) {
      if (!this.doors[i].isOpen) {
        return false;
      }
    }

    return true;
  }

  checkCompleted() {
    if (this.areAllDoorsOpen()) {
      this.gameCompleted = true;
      this.completedText.setVisible(true);
      this.nearDoorText.setText('');
      this.player.body.setVelocity(0);
    }
  }

  togglePause() {
    if (this.gameCompleted) {
      return;
    }

    this.isPaused = !this.isPaused;
    this.pauseText.setVisible(this.isPaused);

    if (this.isPaused) {
      this.player.body.setVelocity(0);
    }
  }

  update() {
    if (this.isPaused || this.gameCompleted) {
      return;
    }

    this.player.body.setVelocity(0);

    const speed = 200;

    if (this.cursors.left.isDown || this.keys.A.isDown) {
      this.player.body.setVelocityX(-speed);
    } else if (this.cursors.right.isDown || this.keys.D.isDown) {
      this.player.body.setVelocityX(speed);
    }

    if (this.cursors.up.isDown || this.keys.W.isDown) {
      this.player.body.setVelocityY(-speed);
    } else if (this.cursors.down.isDown || this.keys.S.isDown) {
      this.player.body.setVelocityY(speed);
    }

    const door = this.getNearClosedDoor();

    if (door !== null) {
      this.nearDoorText.setText('Prem E per intentar obrir la porta');
    } else {
      this.nearDoorText.setText('');
    }
  }
}

class LockpickingScene extends Phaser.Scene {
  constructor() {
    super('LockpickingScene');
  }

  init(data) {
    this.door = data.door;
    this.gameScene = data.gameScene;
  }

  create() {
    this.rotationIndex = 0;
    this.totalPositions = 12;
    this.attempts = 0;
    this.currentRound = 1;
    this.totalRounds = 3;

    this.add.rectangle(400, 300, 650, 480, 0x000000, 0.95);

    this.titleText = this.add.text(400, 78, 'MINIJOC DE GANZUES', {
      fontSize: '32px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.roundText = this.add.text(400, 118, '', {
      fontSize: '18px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.instructionText = this.add.text(400, 145, 'Gira la peça fins que totes les puntes encaixin amb els buits', {
      fontSize: '15px',
      color: '#cccccc'
    }).setOrigin(0.5);

    this.wheelGraphics = this.add.graphics();
    this.pickGraphics = this.add.graphics();

    this.resultText = this.add.text(400, 520, '', {
      fontSize: '21px',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);

    this.helpText = this.add.text(400, 560, 'Fletxes = girar | ENTER = provar | ESC = sortir', {
      fontSize: '17px',
      color: '#cccccc'
    }).setOrigin(0.5);

    this.generateRound();
    this.drawWheel();
    this.drawPick();

    this.input.keyboard.on('keydown-LEFT', () => {
      this.rotationIndex--;

      if (this.rotationIndex < 0) {
        this.rotationIndex = this.totalPositions - 1;
      }

      this.drawPick();
    });

    this.input.keyboard.on('keydown-RIGHT', () => {
      this.rotationIndex++;

      if (this.rotationIndex >= this.totalPositions) {
        this.rotationIndex = 0;
      }

      this.drawPick();
    });

    this.input.keyboard.on('keydown-ENTER', () => {
      this.tryOpen();
    });

    this.input.keyboard.on('keydown-ESC', () => {
      this.closeLockpicking();
    });
  }

  generateRound() {
    this.rotationIndex = 0;

    const gapAmount = Phaser.Math.Between(2, 5);
    const correctRotation = Phaser.Math.Between(0, this.totalPositions - 1);

    this.gaps = this.generateRandomIndexes(gapAmount);
    this.pickShape = [];

    for (let i = 0; i < this.gaps.length; i++) {
      let pickIndex = this.gaps[i] - correctRotation;

      while (pickIndex < 0) {
        pickIndex += this.totalPositions;
      }

      this.pickShape.push(pickIndex % this.totalPositions);
    }

    this.roundText.setText('Ronda ' + this.currentRound + ' / ' + this.totalRounds);
    this.resultText.setText('');
  }

  generateRandomIndexes(amount) {
    const indexes = [];

    while (indexes.length < amount) {
      const value = Phaser.Math.Between(0, this.totalPositions - 1);

      if (!indexes.includes(value)) {
        indexes.push(value);
      }
    }

    indexes.sort((a, b) => a - b);

    return indexes;
  }

  drawWheel() {
    this.wheelGraphics.clear();

    const centerX = 400;
    const centerY = 320;
    const radius = 140;

    this.wheelGraphics.lineStyle(8, 0x88ccff, 1);
    this.wheelGraphics.strokeCircle(centerX, centerY, radius);

    this.wheelGraphics.lineStyle(8, 0x88ccff, 0.65);
    this.wheelGraphics.strokeCircle(centerX, centerY, 100);

    this.wheelGraphics.lineStyle(8, 0x88ccff, 0.4);
    this.wheelGraphics.strokeCircle(centerX, centerY, 60);

    for (let i = 0; i < this.totalPositions; i++) {
      const angle = this.indexToAngle(i);

      const x1 = centerX + Math.cos(angle) * 112;
      const y1 = centerY + Math.sin(angle) * 112;
      const x2 = centerX + Math.cos(angle) * 132;
      const y2 = centerY + Math.sin(angle) * 132;

      this.wheelGraphics.lineStyle(3, 0xffffff, 0.25);
      this.wheelGraphics.lineBetween(x1, y1, x2, y2);
    }

    for (let i = 0; i < this.gaps.length; i++) {
      const gapIndex = this.gaps[i];
      const angle = this.indexToAngle(gapIndex);

      this.wheelGraphics.lineStyle(22, 0x000000, 1);
      this.wheelGraphics.beginPath();
      this.wheelGraphics.arc(centerX, centerY, radius, angle - 0.12, angle + 0.12);
      this.wheelGraphics.strokePath();

      const gapX = centerX + Math.cos(angle) * radius;
      const gapY = centerY + Math.sin(angle) * radius;

      this.wheelGraphics.fillStyle(0xff4444, 1);
      this.wheelGraphics.fillCircle(gapX, gapY, 7);
    }
  }

  drawPick() {
    this.pickGraphics.clear();

    const centerX = 400;
    const centerY = 320;
    const radius = 140;

    this.pickGraphics.fillStyle(0xffffff, 1);
    this.pickGraphics.fillCircle(centerX, centerY, 11);

    for (let i = 0; i < this.pickShape.length; i++) {
      const finalIndex = (this.pickShape[i] + this.rotationIndex) % this.totalPositions;
      const angle = this.indexToAngle(finalIndex);

      const innerX = centerX + Math.cos(angle) * 42;
      const innerY = centerY + Math.sin(angle) * 42;

      const outerX = centerX + Math.cos(angle) * radius;
      const outerY = centerY + Math.sin(angle) * radius;

      this.pickGraphics.lineStyle(9, 0xffff66, 1);
      this.pickGraphics.lineBetween(innerX, innerY, outerX, outerY);

      this.pickGraphics.fillStyle(0xffff66, 1);
      this.pickGraphics.fillCircle(outerX, outerY, 11);
    }

    this.resultText.setText(
      'Rotacio de la peça: ' + (this.rotationIndex + 1) + ' / ' + this.totalPositions
    );
  }

  indexToAngle(index) {
    return Phaser.Math.DegToRad(index * (360 / this.totalPositions) - 90);
  }

  doesPickFit() {
    for (let i = 0; i < this.pickShape.length; i++) {
      const finalIndex = (this.pickShape[i] + this.rotationIndex) % this.totalPositions;

      if (!this.gaps.includes(finalIndex)) {
        return false;
      }
    }

    return true;
  }

  tryOpen() {
    this.attempts++;

    if (this.doesPickFit()) {
      if (this.currentRound >= this.totalRounds) {
        this.resultText.setText('Correcte! Has superat les 3 rodes i la porta s obre.');

        this.door.isOpen = true;
        this.door.setFillStyle(0x00ff00);
        this.door.body.enable = false;

        this.gameScene.checkCompleted();

        this.time.delayedCall(1200, () => {
          this.closeLockpicking();
        });
      } else {
        this.resultText.setText('Correcte! Passes a la roda següent.');

        this.currentRound++;

        this.time.delayedCall(900, () => {
          this.generateRound();
          this.drawWheel();
          this.drawPick();
        });
      }
    } else {
      this.resultText.setText(
        'No encaixa. Alguna punta no coincideix amb cap buit.\n' +
        'Intents totals: ' + this.attempts
      );
    }
  }

  closeLockpicking() {
    this.scene.stop();
    this.scene.resume('GameScene');
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#222222',
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scene: [MenuScene, GameScene, LockpickingScene]
};

const game = new Phaser.Game(config);
