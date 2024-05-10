import { assert } from "chai";

function plantsAndZombies(lawn, zombies) {
  return new Lawn(lawn, zombies).gameLoop();
}

class Lawn {
  constructor(lawn, zombies) {
    this.plants = [];
    this.sPlanst = [];
    this.createLawn(lawn);
    this.zombies = zombies.reduce((acc, zombieStat) => {
      const zombieRow = zombieStat[1];
      acc[zombieRow] = acc[zombieRow] || [];

      acc[zombieRow].push(new Zombie(this, ...zombieStat));
      return acc;
    }, {});
    Object.values(this.zombies).forEach((zombies) =>
      zombies.sort((a, b) => a.position.col - b.position.col),
    );
  }

  gameLoop() {
    for (var i = 0; true; i++) {
      Object.values(this.zombies).forEach((zombies) =>
        zombies.forEach((zombie) => zombie.move()),
      );
      this.destroyPlants();
      this.plants.forEach((plant) => plant.shoot());
      this.sPlanst.forEach((plant) => plant.shoot());
      this.destroyZombies();

      if (this.isAllZombiesDead()) {
        return null;
      }

      for (let row in this.zombies) {
        const hasPassed = this.zombies[row].some((zombie) =>
          zombie.hasPassed(),
        );

        if (hasPassed) {
          return i;
        }
      }
    }
  }

  isAllZombiesDead() {
    return Object.values(this.zombies).every((zombies) => zombies.length === 0);
  }

  destroyPlants() {
    this.plants = this.plants.filter((plant) => {
      return !this.zombies[plant.position.row].some(
        (zombie) => zombie.position.col === plant.position.col,
      );
    });
    this.sPlanst = this.sPlanst.filter((plant) => {
      return !this.zombies[plant.position.row].some(
        (zombie) => zombie.position.col === plant.position.col,
      );
    });
  }

  destroyZombies() {
    Object.keys(this.zombies).forEach((row) => {
      this.zombies[row] = this.zombies[row].filter((zombie) =>
        zombie.isAlive(),
      );
    });
  }

  createLawn(lawn) {
    this.rows = lawn.length;
    this.cols = lawn[0].length;
    for (let row = 0; row < this.rows; row++) {
      for (let col = this.cols; col >= 0; col--) {
        const cell = lawn[row][col];
        if (cell === "S") {
          this.sPlanst.push(new SPlant(this, row, col));
        }
      }
    }

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const cell = lawn[row][col];
        const power = parseInt(cell);
        if (!Number.isNaN(power)) {
          this.plants.push(new Plant(this, row, col, power));
        }
      }
    }
  }
}

class Plant {
  constructor(lawn, row, col, power) {
    this.position = {
      row,
      col,
    };
    this.power = power;
    this.lawn = lawn;
  }

  shoot() {
    let remainingDamage = this.power;
    for (let zombie of this.lawn.zombies[this.position.row]) {
      if (!zombie.isOnLawn()) break;
      remainingDamage = zombie.takeDamage(remainingDamage);
      if (remainingDamage === 0) break;
    }
  }
}

class SPlant extends Plant {
  constructor(lawn, row, col) {
    super(lawn, row, col, 1);
    this.topDiagonalPoints = [];
    this.bottomDiagonalPoints = [];
    for (let i = 0; i < lawn.rows; i++) {
      if (i === row) continue;
      const diff = Math.abs(row - i);
      const pCol = col + diff;
      if (pCol < 0) {
        continue;
      }
      if (i < row) {
        this.topDiagonalPoints.push({
          row: i,
          col: pCol,
        });
      } else {
        this.bottomDiagonalPoints.push({
          row: i,
          col: pCol,
        });
      }
    }

    this.topDiagonalPoints.sort((a, b) => a.col - b.col);
    this.bottomDiagonalPoints.sort((a, b) => a.col - b.col);
  }

  shoot() {
    super.shoot();
    this.shootDiagonal(this.topDiagonalPoints);
    this.shootDiagonal(this.bottomDiagonalPoints);
  }

  shootDiagonal(points) {
    for (let point of points) {
      const zombieRow = this.lawn.zombies[point.row];
      const zombie = zombieRow.find(
        (zombie) => zombie.position.col === point.col,
      );

      if (zombie) {
        const res = zombie.takeDamage(1);
        if (res === 0) {
          break;
        }
      }
    }
  }
}

class Zombie {
  constructor(lawn, col, row, hp) {
    this.position = {
      row,
      col: col + lawn.cols,
    };
    this.hp = hp;
    this.lawn = lawn;
  }

  move() {
    this.position.col -= 1;
  }

  isAlive() {
    return this.hp > 0;
  }

  takeDamage(power) {
    if (!this.isAlive()) return power;
    this.hp -= power;

    if (!this.isAlive()) {
      return Math.abs(this.hp);
    }

    return 0;
  }

  isOnLawn() {
    return this.position.col < this.lawn.cols;
  }

  hasPassed() {
    return this.position.col < 0;
  }
}

