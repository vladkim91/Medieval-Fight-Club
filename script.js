// Variables
const headAttack = document.getElementById('head-attack');
const torsoAttack = document.getElementById('torso-attack');
const legAttack = document.getElementById('leg-attack');
const headDefend = document.getElementById('head-defend');
const torsoDefend = document.getElementById('torso-defend');
const legDefend = document.getElementById('leg-defend');
const apUsedMessage = document.getElementById('ap-used');
const makeMove = document.getElementById('submit-choice');
const everyBattleOption = [
  headAttack,
  torsoAttack,
  legAttack,
  headDefend,
  torsoDefend,
  legDefend
];

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
  attack(enemy, target, type, defense) {
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
  let currentTarget = [];
  let typeOfAttack = [];
  let currentDefense = [];

  const bodyParts = ['head', 'torso', 'legs'];

  const bodyPartChoice = () => {
    const calculateApCost = () => {
      let totalApCost = 0;
      // returns sum of every selection that doesn't have passive class
      for (let i = 0; i < everyBattleOption.length; i++) {
        for (let n = 0; n < everyBattleOption[i].length; n++) {
          if (!everyBattleOption[i][n].classList.contains('passive')) {
            totalApCost += parseInt(everyBattleOption[i][n].dataset.apcost);
          }
        }
      }
      apUsedMessage.innerText = `Action points used: ${totalApCost}/${hero.ap}`;
      if (totalApCost > hero.ap) {
        apUsedMessage.style.color = 'red';
      } else {
        apUsedMessage.style.color = 'black';
      }
      console.log(totalApCost);
      return totalApCost;
    };
    // Detect passive and active selections
    everyBattleOption.forEach((e) => {
      e.addEventListener('change', () => {
        for (let i = 0; i < e.length; i++) {
          if (e.value == 'normal-attack') {
            e[1].classList.remove('passive');
            e[2].classList.add('passive');
            // console.log(e.value, 'normal+');
          } else if (e.value == 'heavy-attack') {
            e[2].classList.remove('passive');
            e[1].classList.add('passive');
            // console.log(e.value, 'heavy+');
          } else if (e.value == 'off') {
            // console.log(e.value, 'empty+');
            e[1].classList.add('passive');
            e[2].classList.add('passive');
          } else if (e.value == 'defend') {
            e[1].classList.remove('passive');
          } else if (e.value == 'def') {
            e[1].classList.add('passive');
          }
        }
        calculateApCost(everyBattleOption);
      });
    });
    // Detect targeted body parts
    everyBattleOption.forEach((e) => {
      e.addEventListener('change', () => {
        for (let i = 0; i < 3; i++) {
          if (everyBattleOption[i].value !== 'off') {
            // console.log(everyBattleOption[i]);
            everyBattleOption[i].classList.add('targeted');
          } else {
            everyBattleOption[i].classList.remove('targeted');
          }
          // console.log(everyBattleOption[i].value);
        }
        for (let i = 3; i < 6; i++) {
          if (everyBattleOption[i].value !== 'def') {
            // console.log(everyBattleOption[i].getAttribute('id'));
            everyBattleOption[i].classList.add('defended');
          } else {
            everyBattleOption[i].classList.remove('defended');
          }
        }
      });
    });
    // Check for targeted and defended body parts and push them to the array
  };

  makeMove.addEventListener('click', () => {
    // Extract ap cost fron apUsedMessage
    const getNum = (str) => {
      let newStr = '';
      for (let i = 0; i < str.length - 4; i++) {
        if (!isNaN(str[i]) && isFinite(str[i])) {
          newStr += str[i];
        }
      }

      return parseInt(newStr);
    };
    const apUsed = getNum(apUsedMessage.textContent);
    if (apUsed < hero.ap) {
      for (let i = 0; i < 6; i++) {
        if (everyBattleOption[i].classList.contains('targeted')) {
          currentTarget.push(everyBattleOption[i].getAttribute('id'));
        } else if (everyBattleOption[i].classList.contains('defended')) {
          currentDefense.push(everyBattleOption[i].getAttribute('id'));
        }
      }
    }
    // Target and deal damage to enemy
    if (hero.int >= enemy.int) {
      if (currentTarget.includes('head-attack')) {
        if (everyBattleOption[0][1].classList.length == 0) {
          typeOfAttack.push(everyBattleOption[0][1].value);
        } else if (everyBattleOption[0][2].classList.length == 0) {
          typeOfAttack.push(everyBattleOption[0][2].value);
        }
      }
      if (currentTarget.includes('torso-attack')) {
        if (everyBattleOption[1][1].classList.length == 0) {
          typeOfAttack.push(everyBattleOption[1][1].value);
        } else if (everyBattleOption[1][2].classList.length == 0) {
          typeOfAttack.push(everyBattleOption[1][2].value);
        }
      }
      if (currentTarget.includes('leg-attack')) {
        if (everyBattleOption[2][1].classList.length == 0) {
          typeOfAttack.push(everyBattleOption[2][1].value);
        } else if (everyBattleOption[2][2].classList.length == 0) {
          typeOfAttack.push(everyBattleOption[2][2].value);
        }
      }
      hero.attack(enemy, currentTarget, typeOfAttack);

      console.log(typeOfAttack);
      console.log(currentTarget);
      console.log(currentDefense);
    }

    // console.log(apUsed);
    // console.log(currentTarget);
    // console.log(currentDefense);
  });
  bodyPartChoice();

  console.log(hero.name, hero.hp);
  console.log(enemy.name, enemy.hp);
};

startFight(hero1, unit1);
