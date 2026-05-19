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

    this.player = this.add.circle(120, 120, 18, 0xffffff);
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

    this.createWall(400, 50, 700, 20);
    this.createWall(400, 550, 700, 20);
    this.createWall(50, 300, 20, 500);
    this.createWall(750, 300, 20, 500);

    this.createWall(250, 190, 20, 260);
    this.createWall(550, 410, 20, 260);
    this.createWall(400, 220, 300, 20);
    this.createWall(400, 420, 300, 20);

    this.door = this.add.rectangle(400, 320, 90, 20, 0xff0000);
    this.physics.add.existing(this.door, true);
    this.door.isOpen = false;

    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.player, this.door);

    this.nearDoorText = this.add.text(400, 520, '', {
      fontSize: '20px',
      color: '#ffffff'
    }).setOrigin(0.5);

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
      if (this.isNearDoor() && !this.door.isOpen && !this.isPaused) {
        this.scene.launch('LockpickingScene', {
          door: this.door
        });

        this.scene.pause();
      }
    });
  }

  createWall(x, y, width, height) {
    const wall = this.add.rectangle(x, y, width, height, 0xffffff);
    this.physics.add.existing(wall, true);
    this.walls.add(wall);
  }

  isNearDoor() {
    const distance = Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      this.door.x,
      this.door.y
    );

    return distance < 95;
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    this.pauseText.setVisible(this.isPaused);

    if (this.isPaused) {
      this.player.body.setVelocity(0);
    }
  }

  update() {
    if (this.isPaused) {
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

    if (this.isNearDoor() && !this.door.isOpen) {
      this.nearDoorText.setText('Prem E per intentar obrir la porta');
    } else if (this.door.isOpen) {
      this.nearDoorText.setText('Porta oberta');
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
  }

  create() {
    this.rotationIndex = 0;
    this.totalPositions = 12;
    this.attempts = 0;

    this.gaps = [1, 4, 7, 10];
    this.pickShape = [0, 3, 6, 9];

    this.add.rectangle(400, 300, 650, 480, 0x000000, 0.95);

    this.add.text(400, 80, 'MINIJOC DE GANZUES', {
      fontSize: '32px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(400, 118, 'Gira la peça fins que totes les puntes encaixin amb els buits', {
      fontSize: '16px',
      color: '#cccccc'
    }).setOrigin(0.5);

    this.add.text(400, 145, 'Inspirat en la roda de ganzues de Starfield', {
      fontSize: '15px',
      color: '#888888'
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
      this.resultText.setText('Correcte! Totes les puntes encaixen i la porta s obre.');

      this.door.isOpen = true;
      this.door.setFillStyle(0x00ff00);
      this.door.body.enable = false;

      this.time.delayedCall(1200, () => {
        this.closeLockpicking();
      });
    } else {
      this.resultText.setText(
        'No encaixa. Alguna punta no coincideix amb cap buit.\n' +
        'Intents: ' + this.attempts
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
