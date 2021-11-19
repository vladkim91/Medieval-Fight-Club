// Variables
const headAttack = document.getElementById('head-attack');
const torsoAttack = document.getElementById('torso-attack');
const legAttack = document.getElementById('leg-attack');
const headDefend = document.getElementById('head-defend');
const torsoDefend = document.getElementById('torso-defend');
const legDefend = document.getElementById('leg-defend');
const apUsedMessage = document.getElementById('ap-used');
const makeMove = document.getElementById('submit-choice');
const declareWinnerMessage = document.getElementById('declare-winner');
const battleOverScreen = document.getElementById('battle-over');
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
    this.maxHp = this.hp;
  }
  attackCPU(hero) {
    let hitStrength = 0;
    let hitMessage = '';

    if (this.wp !== {}) {
      hitStrength += this.str;
    } else {
      hitStrength += this.str + this.wp.damage;
    }
    if (Math.floor(Math.random() * 2) == 0) {
      hitStrength = hitStrength * 1.4;
    }

    let enemyAttack = ['head', 'torso', 'legs'];
    this.offense = enemyAttack[Math.floor(Math.random() * 3)];
    if (this.offense == hero.defense) {
      const reducredHit = (hitStrength /= 3);
      hitMessage = `${hero.name} blocked ${this.name}'s strike to the ${
        hero.defense
      } and reduced its impact to ${reducredHit.toFixed(0)}`;

      hero.hp -= hitStrength.toFixed(0);
    } else {
      hero.hp -= hitStrength;
      hitMessage = `${this.name} hit ${hero.name} to deal ${hitStrength} damage in the ${this.offense}`;
    }
    const generateLogMessage = () => {
      const time = new Date();
      const currentTime = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
      const message = document.createElement('div');
      message.classList.add('message-block');
      message.innerText = `${currentTime}: ${hitMessage}. ${hero.name} ${hero.hp}/${hero.maxHp}`;
      document.getElementById('move-log').appendChild(message);
    };
    generateLogMessage();
    console.log(hero.hp, hero.name, hitStrength);
  }

  attack(enemy, target, type, defense) {
    let hitMessage = '';
    let hitStrength = 0;

    if (this.wp !== {}) {
      hitStrength += this.str;
    } else {
      hitStrength += this.str + this.wp.damage;
    }

    if (target[0] == 'head-attack') {
      this.offense = 'head';
      if (type[0] == 'normal-attack') {
        hitStrength = hitStrength;
      } else {
        hitStrength = hitStrength * 1.4;
        hitStrength = parseInt(hitStrength.toFixed(0));
      }
    }
    if (target[0] == 'torso-attack') {
      this.offense = 'torso';
      if (type[0] == 'normal-attack') {
        hitStrength = hitStrength;
      } else {
        hitStrength = hitStrength * 1.4;
        hitStrength = parseInt(hitStrength.toFixed(0));
      }
    }
    if (target[0] == 'leg-attack') {
      this.offense = 'legs';
      if (type[0] == 'normal-attack') {
        hitStrength = hitStrength;
      } else {
        hitStrength = hitStrength * 1.4;
        hitStrength = parseInt(hitStrength.toFixed(0));
      }
    }
    if (defense[0] == 'head-defend') {
      this.defense = 'head';
    } else if (defense[0] == 'torso-defend') {
      this.defense = 'torso';
    } else if (defense[0] == 'leg-defend') {
      this.defense = 'legs';
    }

    console.log(this.offense, hitStrength);
    // Enemy defense
    const enemyDefense = ['head', 'torso', 'legs'];
    enemy.defense = enemyDefense[Math.floor(Math.random() * 3)];
    if (this.offense !== '') {
      if (this.offense == enemy.defense) {
        const reducredHit = (hitStrength /= 3);
        hitMessage = `${enemy.name} blocked ${this.name}'s strike to the ${
          enemy.defense
        } and reduced its impact to ${reducredHit.toFixed(0)}`;

        enemy.hp -= hitStrength.toFixed(0);
      } else {
        enemy.hp -= hitStrength;
        hitMessage = `${this.name} hit ${enemy.name} to deal ${hitStrength} damage in the ${this.offense}`;
      }
      console.log(enemy.hp, enemy.name, hitStrength);
    }
    const generateLogMessage = () => {
      const time = new Date();
      const currentTime = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
      const message = document.createElement('div');
      message.classList.add('message-block');
      message.innerText = `${currentTime}: ${hitMessage}. ${enemy.name} ${enemy.hp}/${enemy.maxHp}`;
      document.getElementById('move-log').appendChild(message);
    };
    generateLogMessage();
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
    this.ap = 150 + this.lvl * 10;
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

const unit1 = new FightingUnit(1, 'Peasant1');
const unit2 = new FightingUnit(2, 'Peasant2');
const hero1 = new Hero(9, 'Blademaster');
const boss1 = new Boss();

// Event Listners

const startFight = (hero, enemy) => {
  document.getElementById('fight-ui').style.visibility = 'visible';
  // Choose body part => attack / defend => check if hp < 0 => declare winner
  let fightTurn = 1;
  let haveWinner = false;
  let currentTarget = [];
  let typeOfAttack = [];
  let currentDefense = [];
  fightInProgress = true;
  if (fightInProgress && haveWinner == false) {
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

      return totalApCost;
    };

    const bodyPartChoice = () => {
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
              everyBattleOption[i].classList.add('targeted');
            } else {
              everyBattleOption[i].classList.remove('targeted');
            }
          }
          for (let i = 3; i < 6; i++) {
            if (everyBattleOption[i].value !== 'def') {
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
      // Winning conditions
      const check4Winner = () => {
        let winner;
        if (enemy.hp <= 0) {
          battleOverScreen.style.visibility = 'visible';
          fightInProgress = false;
          haveWinner = true;
          winner = hero.name;
          declareWinnerMessage.innerText = `${hero.name} is victorious`;
        } else if (hero.hp <= 0) {
          battleOverScreen.style.visibility = 'visible';
          fightInProgress = false;
          haveWinner = true;
          winner = enemy.name;
          declareWinnerMessage.innerText = `${enemy.name} is victorious`;
        }
        return winner;
      };
      if (hero.int > enemy.int) {
        hero.attack(enemy, currentTarget, typeOfAttack, currentDefense);
        check4Winner();
        check4Winner() !== hero.name
          ? (enemy.attackCPU(hero), check4Winner())
          : null;
      } else {
        enemy.attackCPU(hero);
        check4Winner();
        check4Winner() !== enemy.name
          ? (hero.attack(enemy, currentTarget, typeOfAttack, currentDefense),
            check4Winner())
          : null;
      }
      hero.offense = '';
      // Reset the game selection and AP cost
      for (let i = 0; i < 3; i++) {
        everyBattleOption[i].value = 'off';
      }
      for (let i = 3; i < 6; i++) {
        everyBattleOption[i].value = 'def';
      }
      for (let i = 1; i < 4; i++) {
        document
          .getElementById('attack-bodyparts')
          .children[i].classList.remove('targeted');
      }
      for (let i = 0; i < 3; i++) {
        for (let n = 0; n < 3; n++) {
          everyBattleOption[i][n].classList.add('passive');
        }
      }
      for (let i = 3; i < 6; i++) {
        for (let n = 0; n < 2; n++) {
          everyBattleOption[i][n].classList.add('passive');
        }
      }
      calculateApCost(everyBattleOption);
      currentTarget = [];
      typeOfAttack = [];
      currentDefense = [];
      fightTurn++;
    });
    bodyPartChoice();
  } else {
    sandBox.pop();
  }
};

battleOverScreen.addEventListener('click', () => {
  battleOverScreen.style.visibility = 'hidden';
  document.getElementById('move-log').innerHTML = '';
  document.getElementById('fight-ui').style.visibility = 'hidden';
  sandBox.pop();
});
unit1.str += 200;
unit1.int += 10;
const sandBox = [hero1, unit1];

startFight(...sandBox);
