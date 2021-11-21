// HTML elements
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
const heroBox = document.querySelector('.hero');
const enemyBox = document.querySelector('.enemy');
const nameUI = document.getElementById('name');
const lvlUI = document.getElementById('lvl');
const inventory = document.getElementById('inventory');
const xpUI = document.getElementById('xp');
const goldUI = document.getElementById('gold');
const hpUI = document.getElementById('hp');
const mpUI = document.getElementById('mp');
const sideBar = document.getElementById('side-bar');
const levelUp = document.getElementById('level-up');
const levelUps = [100, 500, 1200, 2100];
const objectivesMenu = document.getElementById('objectives');

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
  constructor(lvl, name, url) {
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
    this.maxMP = this.mp;
    this.url = url;
    this.xpBounty = this.lvl * 50;
    this.goldBounty = Math.floor(Math.random() * (50 - 25) + 25) * this.lvl;
  }
  attackCPU(target) {
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
    if (this.offense == target.defense) {
      const reducredHit = (hitStrength /= 3);
      hitMessage = `${target.name} blocked ${this.name}'s strike to the ${
        target.defense
      } and reduced its impact to ${reducredHit.toFixed(0)}`;

      target.hp -= hitStrength.toFixed(0);
    } else {
      target.hp -= hitStrength;
      hitMessage = `${this.name} hit ${
        target.name
      } to deal ${hitStrength.toFixed(0)} damage in the ${this.offense}`;
    }
    const generateLogMessage = () => {
      const time = new Date();
      const currentTime = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
      const message = document.createElement('div');
      message.classList.add('message-block');
      message.innerText = `${currentTime}: ${hitMessage}. ${target.name} ${target.hp}/${target.maxHp}`;
      document.getElementById('move-log').appendChild(message);
    };
    generateLogMessage();
  }

  attack(enemy, target, type, defense) {
    let hitMessage = '';
    let hitStrength = 0;
    if (enemy.hp <= 0) return;
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

  castSpell(spells) {}
}

class Hero extends FightingUnit {
  constructor(lvl, name) {
    super(lvl, name);
    this.xp = 0;
    this.traits = [];
    this.abilities = [];
    this.inventory = [];
    this.coins = 100;
    this.ap = 150 + this.lvl * 10;
  }
  rest() {
    this.hp = this.maxHp;
    this.mp = this.maxMP;
    playerUiUpdate();
  }
  collectLoot() {}
  equip(item) {
    this.wp = this.inventory[0];
  }
}

class Boss extends FightingUnit {
  constructor(lvl, name, url) {
    super(lvl, name, url);
    this.bossAbilities = [];
    this.bossXpBounty = this.xpBounty + 100;
    this.bossGoldBounty = this.goldBounty + 100;
  }
  dropLoot() {}
}

class Equipment {
  constructor(
    defense,
    damage,
    price,
    minLvl,
    durability,
    str,
    agl,
    int,
    lck,
    accuracy,
    toughness,
    evasion,
    crush,
    spell,
    type,
    url
  ) {
    this.defense = defense;
    this.damage = damage;
    this.price = price;
    this.minLvl = minLvl;
    this.durability = durability;
    this.str = str;
    this.agl = agl;
    this.int = int;
    this.lck = lck;
    this.accuracy = accuracy;
    this.toughness = toughness;
    this.evasion = evasion;
    this.crush = crush;
    this.spell = spell;
    this.type = type;
    this.url = url;
  }
}

const unit1 = new FightingUnit(1, 'Peasant1', 'images/characters/peasant.png');
const unit2 = new FightingUnit(1, 'Peasant2', 'images/characters/peasant.png');
const hero1 = new Hero(1, 'Blademaster');
const boss1 = new Boss(10, 'Grunt', 'images/characters/orc-warrior.png');
const sword1 = new Equipment(
  0,
  15,
  100,
  1,
  100,
  3,
  1,
  0,
  1,
  10,
  10,
  0,
  10,
  0,
  'sword',
  'images/sword1.png'
);
const sandBox = [hero1, unit1, unit2, boss1];
const newObjective = document.createElement('div');
newObjective.setAttribute('id', 'new-objective');
objectivesMenu.appendChild(newObjective);
const objectivesList = [
  'Buy yourself weapon and face your first opponent',
  'Greate job! You need another tune up fight before your first big test',
  'Time to face the boss! Take out that big green bully'
];

const updateObjectives = () => {
  switch (sandBox.length) {
    case 4:
      newObjective.innerText = objectivesList[0];

      break;
    case 3:
      newObjective.innerText = objectivesList[1];
      break;
    case 2:
      newObjective.innerText = objectivesList[2];
      break;
  }
};
updateObjectives();

const playerUiUpdate = () => {
  if (hero1.xp == levelUps[0]) {
    hero1.lvl++;
  } else if (hero1.xp == levelUps[1]) {
    hero1.lvl++;
  } else if (hero1.xp == levelUps[2]) {
    hero1.lvl++;
  }

  levelUp.innerText = `${levelUps[hero1.lvl - 1] - hero1.xp} XP for Level Up`;
  nameUI.innerText = hero1.name;
  lvlUI.innerText = `Level: ${hero1.lvl}`;
  xpUI.innerText = `XP: ${hero1.xp}`;
  goldUI.innerHTML = `Gold: ${hero1.coins}`;
  sideBar.children[0].innerText = `Hit Points: ${hero1.hp}/${hero1.maxHp}`;
  sideBar.children[2].innerText = `Mana Points: ${hero1.mp}/${hero1.maxMP}`;
  const percentageHp = (hero1.hp / hero1.maxHp) * 100;
  const percentageMp = (hero1.mp / hero1.maxMP) * 100;
  updateObjectives();
  sideBar.children[1].style.width = `${percentageHp.toFixed(0)}%`;
  sideBar.children[3].style.width = `${percentageMp.toFixed(0)}%`;
};

playerUiUpdate();

hero1.inventory.push(sword1);
console.log(hero1.inventory[0]);
// Winning conditions
const check4Winner = (hero, enemy) => {
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
    enemy.hp = enemy.maxHp;
    enemy.mp = enemy.maxMP;
  }
  return winner;
};

// Event Listners
const updateHP = (hero, enemy) => {
  heroBox.children[0].innerText = `${hero.name}:       Lvl ${hero.lvl}`;
  enemyBox.children[0].innerText = `${enemy[1].name}: Lvl       ${enemy[1].lvl}`;
  heroBox.children[1].innerText = `${hero.hp}/${hero.maxHp}`;
  enemyBox.children[1].innerText = `${enemy[1].hp}/${enemy[1].maxHp}`;
  document
    .querySelectorAll('#fighter-box')[1]
    .children[3].setAttribute('src', enemy[1].url);
};

const startFight = (hero, enemy) => {
  window.scrollTo(0, 0);
  updateHP(hero1, sandBox);
  document.getElementById('player-ui').style.visibility = 'hidden';
  document.querySelector('enemy');
  document.getElementById('fight-ui').style.visibility = 'visible';
  document.body.style.flexDirection = 'column-reverse';
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
        makeMove.value = 'Not enought AP';
      } else {
        apUsedMessage.style.color = 'black';
        makeMove.value = 'Make your move!';
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
            } else if (e.value == 'heavy-attack') {
              e[2].classList.remove('passive');
              e[1].classList.add('passive');
            } else if (e.value == 'off') {
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
      } else {
        return null;
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

      if (hero.int > enemy[1].int) {
        hero.attack(enemy[1], currentTarget, typeOfAttack, currentDefense);

        check4Winner(hero, enemy[1]) !== hero.name
          ? (enemy[1].attackCPU(hero), check4Winner(hero, enemy[1]))
          : null;
        updateHP(hero1, sandBox);
      } else {
        enemy[1].attackCPU(hero);

        check4Winner(hero, enemy[1]) !== enemy[1].name
          ? (hero.attack(enemy[1], currentTarget, typeOfAttack, currentDefense),
            check4Winner(hero, enemy[1]))
          : null;
        updateHP(hero1, sandBox);
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
  }
};

xpUI.addEventListener('mouseover', () => {
  levelUp.style.visibility = 'visible';
});
xpUI.addEventListener('mouseout', () => {
  levelUp.style.visibility = 'hidden';
});

battleOverScreen.addEventListener('click', () => {
  if (hero1.hp > 0) {
    hero1.coins += sandBox[1].goldBounty;
    hero1.xp += sandBox[1].xpBounty;
    sandBox.splice(1, 1);
  } else if (hero1.hp > 0 && sandBox[1].constructor.name == 'Boss') {
    hero1.coins += sandBox[1].bossGoldBounty;
    hero1.xp += sandBox[1].bossXpBounty;
  }

  battleOverScreen.style.visibility = 'hidden';
  document.getElementById('move-log').innerHTML = '';
  document.getElementById('fight-ui').style.visibility = 'hidden';
  document.body.style.flexDirection = 'column';

  updateHP(hero1, sandBox);
  document.getElementById('player-ui').style.visibility = 'visible';
  playerUiUpdate();
});

const nextFight = () => {
  if (hero1.hp !== hero1.maxHp) {
    alert('You need to rest before your next fight!');
  } else {
    updateHP(hero1, sandBox);
    document.getElementById('fight-ui').style.visibility = 'visible';
    document.body.style.flexDirection = 'column-reverse';
    window.scrollTo(0, 0);
  }
};

hero1.str += 100;
// startFight(hero1, sandBox);
