/***
 * battlerController.js
 * Programmer: Adam Austin
 * Original Date: 3/2/2018
 * Last Modifed: 4/14/2018
 * Version: 2.0
 * 
 * OLD:
 * The purpose of this class is to take control of a battler and provide a simple AI
 * An important part of the class is the behaviorParams 
 * Currently: decisionFreq is how many seconds it takes for the AI to make a decision
 *            The other Freq values are how often those attacks happen.
 * 
 * NEW:
 * Implementing a State Stack to allow dynamic combat events to occur.
 */
function StateStack() {
    this.controller = null;
    this.states = [];
    this.baseStates = [];
    this.oldParams = null;
    this.push = function(o) {
        this.states.push(o);
    }
    this.pop = function() {
        if (this.states.length < 1) {
            this.generateStatesFromParams(this.oldParams);
        }
        return this.states.pop();
    }
    this.generateStatesFromParams = function(params,turns=10) {
        this.oldParams = params;
        this.baseStates = [];
        this.states = [];
        monster = this.controller.me;
        for (var i = 1; i < turns+1; i++) {
            console.log(monster);
            stateToAdd = new StateItem();
            if (i % params.devastatingFreq == 0) {
                stateToAdd.state = BATTLER_STATE_IDLE;
                stateToAdd.action = function() {
                    monster.Wait();
                    monster.createWeakPoint(game);
                }
                stateToAdd.duration = 1000;
                stateToAdd.context = this;
               
            }
            else if (i % params.shieldFreq == 0) {
                stateToAdd.state = BATTLER_STATE_SHIELD;
                stateToAdd.action = function() {
                    monster.Shield();
                }
                stateToAdd.context = this;
                stateToAdd.duration = 3000;
            }
            else if (i % params.attackFreq == 0) {
                stateToAdd.state = BATTLER_STATE_ATTACK;
                isDouble = params.doubleAttackChance > Math.random();
                isCombo = params.comboChance > Math.random();
                stateToAdd.action = function() {
                    if (params.fastAttackChance > Math.random()) {
                        monster.Attack(1,1,isDouble,isCombo);
                    }
                    else if (params.slowAttackChance > Math.random()) {
                        var aparams = getAttackParams("slow");
                        monster.Attack(aparams.speedMod,aparams.damageMod,isDouble,isCombo);
                    }
                    else monster.Attack(1,1,isDouble,isCombo);
                 }
                 stateToAdd.duration = 0;
                 stateToAdd.context = this;  
            }
            else {
                stateToAdd.action = function() {monster.Idle();}
                stateToAdd.context = this;
                stateToAdd.duration = randomInt(500,1200);
            }
            this.baseStates.push(stateToAdd);
        }
        console.log("BattleController: Added (" + this.baseStates.length + ") combat states.");
        console.log(this.baseStates);
        this.states = this.baseStates.slice();
        this.states.reverse();
        console.log(this.states);
    }
}
function StateItem(state=BATTLER_STATE_IDLE,action=null,context=null,duration=0) {
    this.state = state;
    this.action = action;
    this.context = context;

    this.duration = duration; //Not always applicable
}

var BattlerControllerDefaultBehaviorParams = {
    updateInterval:800, //MS per decision
    minUpdateInterval:200,
    maxUpdateInterval:800,
    decisionFreq: 1, //Every tick -- Make a decision
    attackFreq : 2,
    shieldFreq: 3, //Priority
    devastatingFreq: 6, //Priority
    doubleAttackChance: 0.4,
    comboChance: 0.3,
    fastAttackChance: 0.3,
    slowAttackChance: 0.3,
    interruptTime: 1350,
    shieldTime: 3000,
}

function getAttackParams(type="none") {
    var speeds = [0.75,1,1.25,1.5,1.75,2.0];
    var damage = [2.0,1.75,1.5,1.25,1,0.75];
    var mod = { "fast" : 0, "slow" : 0};
    mod[type] = 2;
    var index = randomInt(0+mod["fast"],5-mod["slow"]);

    if (type=="superfast") {
        return {speedMod:2.0, damageMod: 0.75};
    }
    return {speedMod: speeds[index], damageMod: damage[index]};
}
function BattlerController() {
    this.me = new Battler(); //Set these to something
    this.target = new Battler(); //Just for code compeletion
    this.behaviourParams = BattlerControllerDefaultBehaviorParams;

    this.stateStack = new StateStack();
    this.stateStack.controller = this;
    //this.stateStack.generateStatesFromParams(this.behaviourParams);

    this.currentState = null;

    this.turnCounter = 0;
    this.decisionCounter = 0;
    this.deltaTime = 0;

    this.otherTime = 0;

    this.game = null;

    this.clearWeakPoints = function() {
        if (this.me.weak_point != null) {
            this.me.weak_point.sprite.kill();
            this.me.weak_point = null;
        }
    }
    this.forceInterrupt = function(isParry=false) {
        //Forces a state change
        var iTime = this.behaviourParams.interruptTime;
        iTime = (isParry) ? iTime : iTime * 2;
        this.forceState(new StateItem(BATTLER_STATE_INTERRUPT,function() {
            if (this.me.health > 0)createBattleText(this.me.sprite.centerX,this.me.sprite.centerY,"battle_text_break");
            this.me.Interrupt(true);
        },this,iTime));
    }
    this.forceAttack = function(type="none",attackAgain=false) {
        this.forceState(new StateItem(BATTLER_STATE_ATTACK,function() {
            var aparams = getAttackParams(this.type);
            monster.Attack(aparams.speedMod,aparams.damageMod,attackAgain);
        },this,0));
    }
    this.pushAttack = function(type="none",attackAgain=false) {
        this.stateStack.push(new StateItem(BATTLER_STATE_ATTACK,function() {
            var aparams = getAttackParams(this.type);
            monster.Attack(aparams.speedMod,aparams.damageMod,attackAgain);
        },this,0));
    }
    this.pushAttackWithParams = function(p) {
        this.stateStack.push(new StateItem(BATTLER_STATE_ATTACK,function() {
            monster.Attack(p.speedMod,p.damageMod,p.attackAgain);
        },this,0));
    }
    this.forceState = function(newState) {
        this.me.isAnimating = false;
        this.stateStack.push(newState);
        this.currentState = null;
        this.clearWeakPoints();
    }
    this.forceNext = function() {
        this.currentState = null;
        this.clearWeakPoints();
    }
}


BattlerController.prototype.NewUpdate = function(delta) {
    //TODO: Change how weak points work
    if (this.me.weak_point != null) {
        this.me.weak_point.Update(delta);
        if (this.me.weak_point.done) {
            this.me.weak_point = null;
        }
    }
    else if (!this.me.isAnimating){
        //Make sure that the stack has a state
        if (this.currentState == null || this.currentState.duration <= 0) {
            
            this.currentState = this.stateStack.pop();
            console.log(this.currentState);
            this.currentState.action.apply(this.currentState.context,[]);
        }
        else {
            this.currentState.duration -= delta;
        }
    }

}
