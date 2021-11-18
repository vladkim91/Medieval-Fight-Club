// Variables
const headAttack = document.getElementById('head-attack');
const torsoAttack = document.getElementById('torso-attack');
const legAttack = document.getElementById('leg-attack');
const headDefend = document.getElementById('head-defend');
const torsoDefend = document.getElementById('torso-defend');
const legDefend = document.getElementById('leg-defend');

const apUsedMessage = document.getElementById('ap-used');

const everyAttackOption = [
  headAttack,
  torsoAttack,
  legAttack,
  headDefend,
  torsoDefend,
  legDefend
];

const calculateApCost = () => {
  let totalApCost = 0;
  for (let i = 0; i < everyAttackOption.length; i++) {
    for (let n = 0; n < everyAttackOption[i].length; n++) {
      if (!everyAttackOption[i][n].classList.contains('passive')) {
        totalApCost += parseInt(everyAttackOption[i][n].dataset.apcost);
      }
    }
  }
  console.log(totalApCost);
  return totalApCost;
};

everyAttackOption.forEach((e) => {
  e.addEventListener('change', () => {
    for (let i = 0; i < e.length; i++) {
      if (e.value == 'normal-attack') {
        e[1].classList.remove('passive');
        e[2].classList.add('passive');
        console.log(e.value, 'normal+');
      } else if (e.value == 'heavy-attack') {
        e[2].classList.remove('passive');
        e[1].classList.add('passive');
        console.log(e.value, 'heavy+');
      } else if (e.value == 'off') {
        console.log(e.value, 'empty+');
        e[1].classList.add('passive');
        e[2].classList.add('passive');
      } else if (e.value == 'defend') {
        e[1].classList.remove('passive');
      } else if (e.value == 'def') {
        e[1].classList.add('passive');
      }
    }
    calculateApCost(everyAttackOption);
  });
});
let fightInProgress = false;
// Classes

class FightingUnit {
  constructor(lvl, name) {
    this.name = name;
    this.lvl = lvl;
    this.wp = {};
    this.ar = {};
    this.str = 9 + this.lvl;
    this.agl = 9 + this.lvl;
    this.int = 9 + this.lvl;
    this.lck = 1 + this.lvl;
    this.bonus = {};
    this.hp = this.str * 20;
    this.mp = this.int * 10;
  }
  attack(enemy) {
    let hitStrength = 0;
    if (this.wp !== {}) {
      hitStrength += this.str;
    } else {
      hitStrength += this.str + this.wp.damage;
    }
    if (this.offense == enemy.defense) {
      hitStrength /= 3;
      enemy.hp -= hitStrength.toFixed(0);
    } else {
      // console.log(hitStrength);
      enemy.hp -= hitStrength.toFixed(0);
    }
  }
  defend() {}
  castSpell(spells) {}
}

class Hero extends FightingUnit {
  constructor(lvl, name) {
    super(lvl, name);
    this.xp = 0;
    this.traits = [];
    this.abilities = [];
    this.inventory = [];
    this.coins = [];
    this.ap = 190 + this.lvl * 10;
  }
  rest() {
    this.hp = this.str * 20;
  }
  collectLoot() {}
}

class Boss extends FightingUnit {
  constructor(lvl, name) {
    super(lvl, name);
    this.bossAbilities = [];
    this.levelReq = 3;
    this.ap = 190 + this.lvl * 10;
  }
  dropLoot() {}
}

const unit1 = new FightingUnit(1, 'Peasant');
const hero1 = new Hero(3, 'Blademaster');
const boss1 = new Boss(3);

// Event Listners

const startFight = (hero, enemy) => {
  // Choose body part => attack / defend => check if hp < 0 => declare winner
  let fightTurn = 1;
  let haveWinner = false;

  const bodyParts = ['head', 'torso', 'legs'];
  const bodyPartChoice = (unit, arr) => {
    unit.offense = arr[0];
    unit.defense = arr[0];
  };
  bodyPartChoice(hero, bodyParts);
  bodyPartChoice(enemy, bodyParts);

  if (hero.int >= enemy.int) {
    hero.attack(enemy);
    enemy.attack(hero);
  }

  console.log(hero.name, hero.hp);
  console.log(enemy.name, enemy.hp);
};

startFight(hero1, unit1);
