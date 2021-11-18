// Variables

// Classes

class FightingUnit {
  constructor(lvl) {
    this.lvl = lvl;
    this.wp = {};
    this.ar = {};
    this.str = 9 + this.lvl;
    this.agl = 9 + this.lvl;
    this.int = 9 + this.lvl;
    this.lck = 1;
    this.bonus = {};
    this.hp = this.str * 20;
    this.mp = this.int * 10;
  }
  attack(enemy) {
    if (this.wp !== {}) {
      enemy.hp -= this.str;
    } else {
      enemy.hp -= this.str + this.wp.damage;
    }
  }
  defend() {}
  castSpell(spells) {}
}

class Hero extends FightingUnit {
  constructor(lvl) {
    super(lvl);
    this.xp = 0;
    this.traits = [];
    this.abilities = [];
    this.inventory = [];
    this.coins = [];
  }
  rest() {
    // this.hp = maxHP;
  }
  collectLoot() {}
}

class Boss extends FightingUnit {
  constructor(lvl) {
    super(lvl);
    this.bossAbilities = [];
    this.levelReq = 3;
  }
  dropLoot() {}
}

const unit1 = new FightingUnit(1);
const hero1 = new Hero(1);
const boss1 = new Boss(1);
console.log(unit1);
console.log(hero1);

hero1.attack(boss1);
console.log(boss1);
// Event Listners
