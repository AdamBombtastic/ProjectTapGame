/**
 * CombatController.js
 * Date: 4/25/2018
 * Programmer: Adam Austin
 * Version 0.1
 * 
 * This class will allow for multiple battles to happen within the same Battle State
 * 
 */
/*
var exampleEnemyParams = {
    name : "",
    isPlayer = false,
    health = 0,
    maxHealth = this.health,
    shieldRegen = 0.3,
    canUseShield = true,
    mana = 0,
    maxMana = this.mana,
    parryAmount = 3,
    currentParryAmount = 0,
    manaRegenRate = 10,
    damage = 10,
    specialDamage = 40,
    reducedSpecialDamage = 40,
    shieldHealth = 0,
    maxShieldHealth = 0,
}*/

 function CombatController() {
    this.player = null;

    this.enemy = null;
    this.enemyController = null;

    this.enemies = []; //Contain Battler definitions {Battler,BeviourParams}

    this.currentEnemyIndex = 0;
    this.BatteLength = function() {return this.enemies.length;}

    this.isBattling = false;

    this.loadEnemies = function() {
        this.enemies.push({stats: firstEnemyParams, params: firstEnemyBehaviorParams});
        this.enemies.push({stats: secondEnemyParams, params: secondEnemyBehaviorParams});
        this.enemies.push({stats: thirdEnemyParams, params: thirdEnemyBehaviorParams});
        this.enemies.push({stats: fourthEnemyParams, params: fourthEnemyBehaviorParams});
        this.enemies.push({stats: fifthEnemyParams, params: fifthEnemyBehaviorParams});
        this.enemies.push({stats: specialEnemyParams, params: specialEnemyBehaviorParams});
        this.enemies.push({stats: sixthEnemyParams, params: sixthEnemyBehaviorParams});

        PLAYER.maxLevel = this.enemies.length;
    }
    //Use for Coliseums
    this.InitBattle = function(enemy,enemyController) {
        this.enemy = enemy;
        this.enemyController = enemyController;

        for (var k in this.enemies[this.currentEnemyIndex].stats) {
            this.enemy[k]=this.enemies[this.currentEnemyIndex].stats[k];
        }
        this.enemy.reward = {gold:randomInt(50,75),exp: randomInt(50,100)}
        console.log(this.enemy);

        this.enemyController.stateStack.generateStatesFromParams(this.enemies[this.currentEnemyIndex].params,10);
    }

    //Random Fighs
    this.InitRandomBattle =  function(enemy,enemyController,options={level:1}) {
        this.enemy = enemy;
        this.enemyController = enemyController;

        var tempEnemy = this.generateEnemy(options);
        for (var k in tempEnemy.stats) {
            this.enemy[k]=tempEnemy.stats[k];
        }
        this.enemyController.stateStack.generateFromParamsList(tempEnemy.params,tempEnemy.params.chanceList)
        
        //generate enemy . . .
    }
    this.generateEnemy = function(options) {
        var tempParams = {stats:{},params:{}}

        //TODO: Add randomness and scaling to stats . . . in a basic way
        tempParams.stats.name = "Random Bozo ";
        tempParams.stats.level = options.level;
        tempParams.stats.shieldRegen = 0.0;
        tempParams.stats.canUseShield = false;
        tempParams.stats.isPlayer = false;
        tempParams.stats.mana = 30;
        tempParams.stats.maxMana = tempParams.mana;
        tempParams.stats.parryAmount = 3;
        tempParams.stats.currentParryAmount = 0;
        tempParams.stats.manaRegenRate = 0;

        tempParams.stats.damage = options.level;
        tempParams.stats.specialDamage = Math.min(options.level*10,40);
        tempParams.stats.reducedSpecialDamage = 10;
        tempParams.stats.shieldHealth = randomInt(30+(options.level*10),80+(options.level*10));
        tempParams.stats.maxShieldHealth = tempParams.stats.shieldHealth;
        tempParams.stats.health = (20*options.level) + randomInt(75,125);
        tempParams.stats.maxHealth = tempParams.stats.health;

        var index = randomInt(0,behaviorMap.length);
        tempParams.params = behaviorMap[index];
        tempParams.stats.name += behaviorMapStrings[index];
        return tempParams;

      
    }
 }
 CombatController.prototype.Update = function() {
     
 }
/** Enemy Behavior Section */

 var firstEnemyParams = {
    name : "Dummy",
    level :1,
    isPlayer : false,
    health: 20,
    maxHealth: 20,
    shieldRegen: 0.0,
    canUseShield: false,
    mana: 0,
    maxMana: 0,
    parryAmount: 3,
    currentParryAmount: 0,
    manaRegenRate: 0,
    damage: 0,
    specialDamage: 0,
    reducedSpecialDamage: 40,
    shieldHealth: 0,
    maxShieldHealth: 0,
}
var firstEnemyBehaviorParams = {
    updateInterval:800, //MS per decision
    minUpdateInterval:200,
    maxUpdateInterval:800,
    decisionFreq: 1, //Every tick -- Make a decision
    attackFreq : 99,
    shieldFreq: 99, //Priority
    devastatingFreq: 99, //Priority
    doubleAttackChance: 0,
    comboChance: 0,
    fastAttackChance: 0,
    slowAttackChance: 0,
    interruptTime: 1350,
    shieldTime: 0,
}
var secondEnemyParams = {
    name : "Antakin",
    level : 2,
    isPlayer: false,
    health: 100,
    maxHealth: 100,
    shieldRegen: 0.3,
    canUseShield: true,
    mana: 0,
    maxMana: 0,
    parryAmount: 3,
    currentParryAmount: 0,
    manaRegenRate: 10,
    damage: 3,
    specialDamage: 0,
    reducedSpecialDamage: 0,
    shieldHealth: 20,
    maxShieldHealth: 20,
}
var secondEnemyBehaviorParams = {
    updateInterval:800, //MS per decision
    minUpdateInterval:200,
    maxUpdateInterval:800,
    decisionFreq: 1, //Every tick -- Make a decision
    attackFreq : 3,
    shieldFreq: 99, //Priority
    devastatingFreq: 99, //Priority
    doubleAttackChance: 0,
    comboChance: 0,
    fastAttackChance: 0,
    slowAttackChance: 0,
    interruptTime: 1350,
    shieldTime: 0,
}
var thirdEnemyParams = {
    name : "Antimus",
    level : 3,
    isPlayer: false,
    health: 120,
    maxHealth: 120,
    shieldRegen: 0.3,
    canUseShield: true,
    mana: 0,
    maxMana: 0,
    parryAmount: 3,
    currentParryAmount: 0,
    manaRegenRate: 10,
    damage: 3,
    specialDamage: 0,
    reducedSpecialDamage: 0,
    shieldHealth: 40,
    maxShieldHealth: 40,
}
var thirdEnemyBehaviorParams = {
    updateInterval:800, //MS per decision
    minUpdateInterval:200,
    maxUpdateInterval:800,
    decisionFreq: 1, //Every tick -- Make a decision
    attackFreq : 2,
    shieldFreq: 5, //Priority
    devastatingFreq: 99, //Priority
    doubleAttackChance: 0,
    comboChance: 0,
    fastAttackChance: 0,
    slowAttackChance: 0,
    interruptTime: 1350,
    shieldTime: 3000,
}
var fourthEnemyParams = {
    name : "Antimus Prime",
    level : 4,
    isPlayer: false,
    health: 180,
    maxHealth: 180,
    shieldRegen: 0.3,
    canUseShield: true,
    mana: 0,
    maxMana: 0,
    parryAmount: 3,
    currentParryAmount: 0,
    manaRegenRate: 10,
    damage: 6,
    specialDamage: 0,
    reducedSpecialDamage: 0,
    shieldHealth: 50,
    maxShieldHealth: 50,
}
var fourthEnemyBehaviorParams = {
    updateInterval:800, //MS per decision
    minUpdateInterval:200,
    maxUpdateInterval:800,
    decisionFreq: 1, //Every tick -- Make a decision
    attackFreq : 2,
    shieldFreq: 5, //Priority
    devastatingFreq: 99, //Priority
    doubleAttackChance: 0.5,
    comboChance: 0,
    fastAttackChance: 0.3,
    slowAttackChance: 0.4,
    interruptTime: 1350,
    shieldTime: 3000,
}
var fifthEnemyParams = {
    name : "Antonym",
    level : 5,
    isPlayer: false,
    health: 260,
    maxHealth: 260,
    shieldRegen: 0.3,
    canUseShield: true,
    mana: 0,
    maxMana: 0,
    parryAmount: 3,
    currentParryAmount: 0,
    manaRegenRate: 10,
    damage: 6,
    specialDamage: 20,
    reducedSpecialDamage: 0,
    shieldHealth: 50,
    maxShieldHealth: 50,
}
var fifthEnemyBehaviorParams = {
    updateInterval:800, //MS per decision
    minUpdateInterval:300,
    maxUpdateInterval:1000,
    decisionFreq: 1, //Every tick -- Make a decision
    attackFreq : 2,
    shieldFreq: 4, //Priority
    devastatingFreq: 6, //Priority
    doubleAttackChance: 0.3,
    comboChance: 0.2,
    fastAttackChance: 0.2,
    slowAttackChance: 0.6,
    interruptTime: 2000,
    shieldTime: 2000,
}
var specialEnemyParams = {
    name : "Antlanta",
    level : 6,
    isPlayer: false,
    health: 100,
    maxHealth: 100,
    shieldRegen: 0.3,
    canUseShield: true,
    mana: 0,
    maxMana: 0,
    parryAmount: 3,
    currentParryAmount: 0,
    manaRegenRate: 10,
    damage: 40,
    specialDamage: 80,
    reducedSpecialDamage: 0,
    shieldHealth: 270,
    maxShieldHealth: 270,
}
var specialEnemyBehaviorParams = {
    updateInterval:800, //MS per decision
    minUpdateInterval:300,
    maxUpdateInterval:1000,
    decisionFreq: 1, //Every tick -- Make a decision
    attackFreq : 99,
    shieldFreq: 1, //Priority
    devastatingFreq: 4, //Priority
    doubleAttackChance: 0,
    comboChance: 0.0,
    fastAttackChance: 0.0,
    slowAttackChance: 0.0,
    interruptTime: 750,
    shieldTime: 2000,
}
var sixthEnemyParams = {
    name : "Antwon",
    level : 7,
    isPlayer: false,
    health: 300,
    maxHealth: 330,
    shieldRegen: 0.3,
    canUseShield: true,
    mana: 0,
    maxMana: 0,
    parryAmount: 3,
    currentParryAmount: 0,
    manaRegenRate: 10,
    damage: 8,
    specialDamage: 25,
    reducedSpecialDamage: 0,
    shieldHealth: 60,
    maxShieldHealth: 60,
}
var sixthEnemyBehaviorParams = {
    updateInterval:800, //MS per decision
    minUpdateInterval: 400,
    maxUpdateInterval: 800,
    decisionFreq: 1, //Every tick -- Make a decision
    attackFreq : 2,
    shieldFreq: 5, //Priority
    devastatingFreq: 9, //Priority
    doubleAttackChance: 0.4,
    comboChance: 0.2,
    fastAttackChance: 0.6,
    slowAttackChance: 0.3,
    interruptTime: 2500,
    shieldTime: 1000,
}

var behaviorMapStrings = ["- D", "- A", "- M"];

var BEHAVIOR_STEREOTYPES = {
    defender : {
        updateInterval:800, //MS per decision
        minUpdateInterval: 400,
        maxUpdateInterval: 800,
        doubleAttackChance: 0.0,
        comboChance: 0.0,
        fastAttackChance: 0.2,
        slowAttackChance: .7,
        interruptTime: 1000,
        shieldTime: 3000,

        chanceList : [BATTLER_STATE_SHIELD,BATTLER_STATE_SHIELD,BATTLER_STATE_ATTACK,BATTLER_STATE_SHIELD,BATTLER_STATE_SPECIAL,BATTLER_STATE_IDLE]
    },
    attacker : {
        updateInterval:800, //MS per decision
        minUpdateInterval: 400,
        maxUpdateInterval: 800,
        doubleAttackChance: .5,
        comboChance: 0.1,
        fastAttackChance: 0.2,
        slowAttackChance: 0.2,
        interruptTime: 2000,
        shieldTime: 1000,

        chanceList : [BATTLER_STATE_ATTACK,BATTLER_STATE_IDLE,BATTLER_STATE_ATTACK,BATTLER_STATE_IDLE,BATTLER_STATE_SHIELD,BATTLER_STATE_SPECIAL,BATTLER_STATE_IDLE]
    },
    mixed : {
        updateInterval:800, //MS per decision
        minUpdateInterval: 400,
        maxUpdateInterval: 800,
        doubleAttackChance: .2,
        comboChance: 0.2,
        fastAttackChance: 0.2,
        slowAttackChance: 0.5,
        interruptTime: 2000,
        shieldTime: 2000,

        chanceList : [BATTLER_STATE_SHIELD,BATTLER_STATE_ATTACK,BATTLER_STATE_IDLE,BATTLER_STATE_SPECIAL,BATTLER_STATE_IDLE]
    }
}
var behaviorMap = [BEHAVIOR_STEREOTYPES.defender,BEHAVIOR_STEREOTYPES.attacker,BEHAVIOR_STEREOTYPES.mixed];