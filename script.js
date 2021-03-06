// HTML elements
const heroName = prompt('What is your name Warrior?');

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
const restButton = document.getElementById('rest');
const strength = document.getElementById('strength');
const agility = document.getElementById('agility');
const intelligence = document.getElementById('intelligence');
const inventoryContainer = document.getElementById('inventory-container');
const fightUiHelm = document.getElementById('helm');
const fightUiArmor = document.getElementById('armor');
const fightUiSword = document.getElementById('sword');
const fightUiBoots = document.getElementById('boots');
const stats = document.getElementById('stats');
const spells = document.getElementById('spells');
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
    let totalArmor;

    if (
      !isNaN(target.helmArmor.defense) &&
      !isNaN(target.torsoArmor.defense) &&
      !isNaN(target.legArmor.defense)
    ) {
      totalArmor =
        target.torsoArmor.defense +
        target.helmArmor.defense +
        target.legArmor.defense;
    } else if (
      !isNaN(target.helmArmor.defense) &&
      !isNaN(target.torsoArmor.defense) &&
      isNaN(target.legArmor.defense)
    ) {
      totalArmor = target.helmArmor.defense + target.torsoArmor.defense;
    } else if (
      !isNaN(target.helmArmor.defense) &&
      isNaN(target.torsoArmor.defense) &&
      !isNaN(target.legArmor.defense)
    ) {
      totalArmor = target.helmArmor.defense + target.legArmor.defense;
    } else if (
      isNaN(target.helmArmor.defense) &&
      !isNaN(target.torsoArmor.defense) &&
      !isNaN(target.legArmor.defense)
    ) {
      totalArmor = target.torsoArmor.defense + target.legArmor.defense;
    } else if (!isNaN(target.helmArmor.defense)) {
      totalArmor = target.helmArmor.defense;
    } else if (!isNaN(target.torsoArmor.defense)) {
      totalArmor = target.torsoArmor.defense;
    } else if (!isNaN(target.legArmor.defense)) {
      totalArmor = target.legArmor.defense;
    } else if (
      isNaN(target.helmArmor.defense) &&
      isNaN(target.torsoArmor.defense) &&
      isNaN(target.legArmor.defense)
    ) {
      totalArmor = 0;
    }

    if (this.wp !== {}) {
      hitStrength += this.str;
    } else {
      hitStrength += this.str + this.wp.damage;
    }
    if (Math.floor(Math.random() * 2) == 0) {
      hitStrength = hitStrength * 1.4;
    }

    const dodgeChance = target.agl;
    const accuracy = this.agl + 100;
    const hitChance = accuracy - dodgeChance;
    const independentVariable = Math.floor(Math.random() * 101);
    let hitOrMiss;
    if (independentVariable < hitChance.toFixed(0)) {
      hitOrMiss = 1;
    } else {
      hitOrMiss = 0;
    }

    if (hitOrMiss == 0) {
      hitMessage = `${target.name} dodged ${this.name}'s attack. ${this.name} is too slow`;
    } else {
      let enemyAttack = ['head', 'torso', 'legs'];
      this.offense = enemyAttack[Math.floor(Math.random() * 3)];
      if (this.offense == target.defense) {
        const reducredHit = (hitStrength /= 3);
        if (totalArmor > reducredHit) {
          hitMessage = `${target.name}'s armor deflected all damage by ${this.name}`;
        } else {
          hitMessage = `${target.name} blocked ${this.name}'s strike to the ${
            target.defense
          } and reduced its impact to ${reducredHit.toFixed(0) - totalArmor}`;

          target.hp -= hitStrength.toFixed(0);
        }
      } else {
        if (totalArmor > hitStrength) {
          hitMessage = `${target.name}'s armor deflected all damage by ${this.name}`;
        } else {
          target.hp -= hitStrength.toFixed(0) - totalArmor;
          hitMessage = `${this.name} hit ${target.name} to deal ${
            hitStrength.toFixed(0) - totalArmor
          } damage in the ${this.offense}`;
        }
      }
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
    if (this.wp == {}) {
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
    // Dodge defense
    const dodgeChance = enemy.agl;
    const accuracy = this.agl + 100;
    const hitChance = accuracy - dodgeChance;

    const independentVariable = Math.floor(Math.random() * 101);

    let hitOrMiss;
    if (independentVariable < hitChance.toFixed(0)) {
      hitOrMiss = 1;
    } else {
      hitOrMiss = 0;
    }
    if (hitOrMiss == 0) {
      hitMessage = `${enemy.name} is too quick or ${this.name} is too slow. He dodged your attack`;
    } else {
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
    }
    // Enemy defense
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
    this.ap = 160 + this.lvl * 10;
    this.helmArmor = {};
    this.torsoArmor = {};
    this.legArmor = {};
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
const hero1 = new Hero(1, heroName);

const unit1 = new FightingUnit(1, 'Peasant', 'images/characters/peasant.png');
unit1.agl += 2;
const unit2 = new FightingUnit(1, 'Peasant', 'images/characters/peasant.png');
unit1.str += 3;
const unit3 = new FightingUnit(2, 'Peasant', 'images/characters/peasant.png');
unit3.str += 2;
unit3.agl += 2;
const unit4 = new FightingUnit(2, 'Peasant', 'images/characters/peasant.png');
unit4.str += 3;
unit4.agl += 3;
const unit5 = new FightingUnit(
  3,
  'Troll Warrior',
  'images/characters/troll.png'
);
unit5.agl += 8;
const unit6 = new FightingUnit(
  3,
  'Troll Warrior',
  'images/characters/troll.png'
);
unit6.agl += 8;
unit6.str += 6;
const unit7 = new FightingUnit(
  3,
  'Troll Warrior',
  'images/characters/troll.png'
);
unit7.agl += 7;
unit7.str += 7;
const boss1 = new Boss(2, 'Orgrim', 'images/characters/orc-warrior.png');
boss1.str += 10;

const boss2 = new Boss(3, 'Leonidas', 'images/characters/spartan.png');
boss2.str += 5;
boss2.agl += 10;

const boss3 = new Boss(5, 'Centurion', 'images/characters/roman.png');
boss3.str += 5;
boss3.agl += 10;

const boss4 = new Boss(8, 'Grand mage', 'images/characters/wizard1.png');

boss4.str += 20;

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
  'images/equipment/sword1.png'
);
const helm1 = new Equipment(
  5,
  0,
  100,
  1,
  100,
  3,
  1,
  0,
  1,
  -10,
  10,
  0,
  10,
  0,
  'helmet',
  'images/equipment/helm1.gif'
);

const armor1 = new Equipment(
  10,
  0,
  200,
  1,
  100,
  5,
  2,
  0,
  0,
  -10,
  10,
  0,
  0,
  0,
  'armor',
  'images/equipment/arm1.gif'
);

const boots1 = new Equipment(
  5,
  0,
  199,
  1,
  100,
  0,
  4,
  0,
  0,
  0,
  5,
  10,
  0,
  0,
  'boots',
  'images/equipment/boots1.png'
);
const sandBox = [
  hero1,
  unit1,
  unit2,
  boss1,
  unit3,
  unit4,
  boss2,
  unit5,
  unit6,
  unit7,
  boss3,
  boss4
];
const newObjective = document.createElement('div');
newObjective.setAttribute('id', 'new-objective');
objectivesMenu.appendChild(newObjective);
const objectivesList = [
  'Prepare for you first opponent. Choose a body part you want to attack and block',
  'Greate job! You need another tune up fight before your first big test',
  'Time to face the boss! Take out that big green bully',
  'You did well. Rest up, you have more tune up fights coming up',
  'This one was easy. Get another W before the boss fight',
  'Take out this Spartan warrior to solidify your position in the Club',
  'Good job! Now take out those troll warriors',
  'One down. Two to go',
  "These trolls don't stand a chance",
  'Time to face the Roman Centurion! Good luck',
  'This is your final test. Defeat grand wizard for the title of the champion',
  'You are the champion!'
];
hero1.inventory.push(sword1);

hero1.wp = hero1.inventory[0];

const updateInventory = () => {
  document.getElementById('inventory-container').innerHTML = '';

  for (let i = 0; i < hero1.inventory.length; i++) {
    const item = document.createElement('div');
    item.setAttribute('id', 'inventory-slot');
    item.style.backgroundImage = `url(${hero1.inventory[i].url})`;
    document.getElementById('inventory-container').appendChild(item);
  }
};
updateInventory();

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

const updateObjectives = () => {
  switch (sandBox.length) {
    case 12:
      newObjective.innerHTML = objectivesList[0];
      break;
    case 11:
      newObjective.innerText = objectivesList[1];

      break;
    case 10:
      newObjective.innerText = objectivesList[2];
      break;
    case 9:
      newObjective.innerText = objectivesList[3];
      break;
    case 8:
      newObjective.innerText = objectivesList[4];
      break;
    case 7:
      newObjective.innerText = objectivesList[5];
      break;
    case 6:
      newObjective.innerText = objectivesList[6];
      break;
    case 5:
      newObjective.innerText = objectivesList[7];
      break;
    case 4:
      newObjective.innerText = objectivesList[8];
      break;
    case 3:
      newObjective.innerText = objectivesList[9];
      break;
    case 2:
      newObjective.innerText = objectivesList[10];
      break;
    case 1:
      newObjective.innerText = objectivesList[11];
      break;
  }
};
updateObjectives();
const levelUpBonuses = () => {
  hero1.str += 1;
  hero1.agl += 1;
  hero1.int += 1;
  hero1.lck += 1;
  hero1.ap += 10;
  hero1.hp += 20;
  hero1.maxHp += 20;
};

const playerUiUpdate = () => {
  fightUiSword.style.backgroundImage = `url(${hero1.inventory[0].url})`;
  if (hero1.inventory.length == 2) {
    fightUiHelm.style.backgroundImage = `url(${hero1.inventory[1].url})`;
  } else if (hero1.inventory.length == 3) {
    fightUiArmor.style.backgroundImage = `url(${hero1.inventory[2].url})`;
  } else if (hero1.inventory.length == 4) {
    fightUiBoots.style.backgroundImage = `url(${hero1.inventory[3].url})`;
  }

  stats.children[0].innerText = `Strength: ${hero1.str}`;
  stats.children[1].innerText = `Agility: ${hero1.agl}`;
  stats.children[2].innerText = `Intelligence: ${hero1.int}`;
  stats.children[3].innerText = `Weapon Damage: ${hero1.wp.damage}`;

  strength.innerText = `Strength: ${hero1.str}`;
  agility.innerText = `Agility: ${hero1.agl}`;
  intelligence.innerText = `Intelligence: ${hero1.int}`;

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

// Winning conditions
const check4Winner = (hero, enemy) => {
  let winner;

  if (enemy.hp <= 0) {
    battleOverScreen.style.visibility = 'visible';
    fightInProgress = false;
    haveWinner = true;

    winner = hero.name;
    if (sandBox.length == 10) {
      declareWinnerMessage.innerText = `${hero.name} is victorious. Orgrim gave you a gift as a token of respect`;
      hero1.inventory.push(helm1);
      updateInventory();
    } else if (sandBox.length == 7) {
      declareWinnerMessage.innerText = `${hero.name} is victorious. Leonidas left his armor for you.`;
      hero1.inventory.push(armor1);
      updateInventory();
    } else if (sandBox.length == 3) {
      declareWinnerMessage.innerText = `${hero.name} is victorious. Roman centurion dropped his armored boots for you.`;
      hero1.inventory.push(boots1);
      updateInventory();
    } else {
      declareWinnerMessage.innerText = `${hero.name} is victorious.`;
    }
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
  if (sandBox.length == 1) {
    return null;
  } else {
    heroBox.children[0].innerText = `${hero.name}:       Lvl ${hero.lvl}`;

    enemyBox.children[0].innerText = `${enemy[1].name}: Lvl       ${enemy[1].lvl}`;
    heroBox.children[1].innerText = `${hero.hp}/${hero.maxHp}`;
    enemyBox.children[1].innerText = `${enemy[1].hp}/${enemy[1].maxHp}`;
    document
      .querySelectorAll('#fighter-box')[1]
      .children[3].setAttribute('src', enemy[1].url);
  }
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
  if (hero1.hp > 0 && sandBox[1].constructor.name == 'Boss') {
    hero1.coins += sandBox[1].bossGoldBounty;
    hero1.xp += sandBox[1].bossXpBounty;
    sandBox.splice(1, 1);
  } else if (hero1.hp > 0) {
    hero1.coins += sandBox[1].goldBounty;
    hero1.xp += sandBox[1].xpBounty;
    sandBox.splice(1, 1);
  }
  window.scrollTo(0, 0);

  battleOverScreen.style.visibility = 'hidden';
  document.getElementById('move-log').innerHTML = '';
  document.getElementById('fight-ui').style.visibility = 'hidden';
  document.body.style.flexDirection = 'column';
  updateHP(hero1, sandBox);
  document.getElementById('player-ui').style.visibility = 'visible';
  if (sandBox.length == 1) {
    document.getElementById('game-over').classList.remove('hidden');
    document.getElementById('player-ui').style.visibility = 'hidden';
    window.scrollTo({
      top: 1050,
      left: 0,
      behavior: 'smooth'
    });
  }
  if (hero1.xp == levelUps[0]) {
    hero1.lvl = 2;
    levelUpBonuses();
  } else if (hero1.xp == levelUps[1]) {
    hero1.lvl = 3;
    levelUpBonuses();
  } else if (hero1.xp == levelUps[2]) {
    levelUpBonuses();
    hero1.lvl = 4;
  } else if (hero1.xp == levelUps[3]) {
    levelUpBonuses();
    hero1.lvl = 5;
  }

  playerUiUpdate();
});

restButton.addEventListener('mouseover', () => {
  restButton.classList.add('glow');
  document.getElementById('rest-message').style.visibility = 'visible';
});
restButton.addEventListener('mouseout', () => {
  restButton.classList.remove('glow');
  document.getElementById('rest-message').style.visibility = 'hidden';
});
restButton.addEventListener('click', () => {
  hero1.rest();
});

document.getElementById('inventory').addEventListener('click', () => {
  document.getElementById('inventory-wrapper').classList.toggle('hidden');
  const itemDesc = document.createElement('div');
  itemDesc.setAttribute('id', 'item-desc');

  inventoryContainer.children[0].addEventListener('mouseover', () => {
    itemDesc.innerText = `Bouncer sword: Damage ${hero1.inventory[0].damage}`;
    spells.appendChild(itemDesc);
  });
  if (inventoryContainer.children.length == 2) {
    inventoryContainer.children[1].addEventListener('mouseover', () => {
      itemDesc.innerText = `Helmet of doom: Armor ${hero1.inventory[1].defense}`;
      spells.appendChild(itemDesc);
    });
  } else if (inventoryContainer.children.length == 3) {
    inventoryContainer.children[2].addEventListener('mouseover', () => {
      itemDesc.innerText = `Bronze armor: Armor ${hero1.inventory[2].defense}`;
      spells.appendChild(itemDesc);
    });
  } else if (inventoryContainer.children.length == 4) {
    inventoryContainer.children[3].addEventListener('mouseover', () => {
      itemDesc.innerText = `Centurion boots: Armor ${hero1.inventory[3].defense}`;
      spells.appendChild(itemDesc);
    });
  }

  for (let i = 0; i < inventoryContainer.children.length; i++) {
    inventoryContainer.children[i].addEventListener('mouseout', () => {
      spells.innerHTML = '';
    });
  }

  playerUiUpdate();
});

document.getElementById('first-fight').addEventListener('click', () => {
  startFight(hero1, sandBox);
  document.getElementById('next-fight').classList.remove('hidden');
  document.getElementById('first-fight').classList.add('hidden');
});
document.getElementById('next-fight').addEventListener('click', nextFight);
