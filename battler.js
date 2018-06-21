/** 
 * battler.js
 * Programmer: Adam Austin
 * Date: 3/8/2018 (Was made earlier than this, but I messed up)
 * 
 * 
*/
var WEAK_POINT_MODE_RANDOM = 0;
var WEAK_POINT_MODE_PATH = 1;

var sampleCoordinate = {x : 0, y : 0}


function WeakPoint(x,y,count,time,game) {

    this.battler = null;

    this.slashDir = "UP";
   
    //this.sprite = game.add.sprite(x,y,"tap_point",0);
    //this.anim = this.sprite.animations.add("spin");
    //this.anim.play(10,true);

    this.sprite = game.add.sprite(x,y,"mana_ball",0);
    this.anim_spawn = this.sprite.animations.add("spawn",[0,1,2,3,4,5]);
    this.anim_idle = this.sprite.animations.add("idle",[6,7,8,9,10,11,12]);
    this.anim_death = this.sprite.animations.add("death",[14,15,16,17,18,19,20]);

    this.anim_death.onComplete.add(function() {
        this.anim_idle.play(12,true);
    },this);
    this.anim_spawn.onComplete.add(function() {
        this.anim_idle.play(12,true);
    },this);


    //Damage required to kill it -- Not yet implemented
    this.health = 1;

    //If this weakpoint can be hit
    this.ready = true; 
    //The amount to spawn before the callback happens.
    this.count = count;
    this.total = count;
    this.pointsHit = 0;

    /* TODO: Maybe add number to the weak_point  to show the count
    this.countText = game.add.text(x,y,this.count);
    this.countText.centerX = this.sprite.centerX;
    this.countText.centerY = this.sprite.centerY;
    */

    //The amount of time the player has to hit this point before failure
    this.time = time;
    this.initTime = time;
    //Do they spawn randomly, or on a predetermined list of coordinates?
    this.mode = WEAK_POINT_MODE_RANDOM; //WEAK_POINT_MODE_PATH

    //An array of coordinates see 'sampleCoordinates', will loop if 'count' is longer than array.
    this.path = new Array();

    this.done = false;

    this.Next = function(x,y,time) {
        console.log("Weak Point: " + "X: " + x + " Y: " + y);

        this.anim_spawn.play(12,false);
        this.sprite.centerX = x;
        this.sprite.centerY = y;

        this.time = time;
        this.ready = true;
    }

    this.Update = function(delta) {
        if (this.ready) {
            this.time -= delta;
            if (this.time <= 0){
                this.ready = false;
                this.count -= 1;
                this.DoNext();
            }
            else {
                //TODO: Still have time
            }
        }
    }
    this.DoNext = function () {
        if (this.count <= 0) {
            //TODO: WE INTERRUPTED IT -- ALL IS NOT LOST.
            if (this.pointsHit == this.total) {
                //this.battler.Interrupt(true);
                this.battler.controller.forceInterrupt(false);
            }
            else if (this.pointsHit >= (this.total * 0.65)) {
                this.battler.Attack(1,1);
            }
            else {
                this.battler.Special(this.pointsHit/this.total);
            }
            this.sprite.destroy();
            this.done=true;
        }
        else {
            if (this.mode == WEAK_POINT_MODE_PATH) {
                if (this.count-1 < this.path.length) {
                  this.Next(this.path[this.count-1].x,this.path[this.count-1].y,this.initTime);
                }
                else { //Code to basically loop through the path 
                    this.Next(this.path[(this.count-1) % this.path.length].x,this.path[(this.count-1)% this.path.length].y,this.initTime);
                }
            }
            else /*this.mode ==WEAK_POINT_MODE_RANDOM */ {
                var tempArray = directionArray.slice();
                tempArray.splice(tempArray.indexOf(this.slashDir),1);
                this.slashDir = tempArray[randomInt(0,tempArray.length-1)];
                this.Next(this.battler.sprite.centerX + (this.battler.sprite.width/(2.5))*directionsToCoordOffset[this.slashDir].x,
                          this.battler.sprite.centerY + (this.battler.sprite.height/(2.5))*directionsToCoordOffset[this.slashDir].y,
                                                                                                                            this.initTime);
            }
        }
    }
    this.Hit = function() {
        console.log("Weak Point hit")
        console.log(this);
        this.ready = false;
        this.count-=1;
        this.pointsHit += 1;
        //createBattleAnimation(game,this.sprite.centerX,this.sprite.centerY,"test_skill",1,1);
        this.anim_death.play(12,false).onComplete.add(function() {
            this.DoNext();
        },this);
        
       
    }

    //init code
    this.sprite.inputEnabled = true;

    console.log("Created and Initialized the WeakPoint Object")

}


var BATTLER_STATE_IDLE = 0;
var BATTLER_STATE_ATTACK = 1;
var BATTLER_STATE_HURT = 2;
var BATTLER_STATE_SPECIAL = 3;
var BATTLER_STATE_WAIT = 4; /* Waiting for user defensive actions */
var BATTLER_STATE_INTERRUPT = 5;
var BATTLER_STATE_SHIELD = 6;
var BATTLER_STATE_PARRY = 7;


function getStateString(s) {
    switch (s) {
        case BATTLER_STATE_IDLE:
            return "Idle";
        case BATTLER_STATE_ATTACK:
            return "Attack";
        case BATTLER_STATE_HURT:
            return "Hurt";
        case BATTLER_STATE_SPECIAL:
            return "Special";
        case BATTLER_STATE_WAIT:
             return "Wait";
        case BATTLER_STATE_INTERRUPT:
             return "Interrupt";
        case BATTLER_STATE_SHIELD:
             return "Shield";
        case BATTLER_STATE_PARRY:
            return "Parry";
        default:
            return "null";
    }
}
function Battler() {
    this.name = "";
    this.target = null;

    this.isPlayer = false;
    this.health = 0;
    this.maxHealth = this.health;
    
    this.shieldRegen = 0.0;
    this.canUseShield = true;

    this.mana = 0;
    this.maxMana = this.mana;

    this.parryAmount = 3;
    this.currentParryAmount = 0;

    this.manaRegenRate = 10;

    this.wasParried = false;

    this.damage = 10;
    this.specialDamage = 40;
    this.reducedSpecialDamage = 40;

    this.shieldHealth = 0;
    this.maxShieldHealth = 0;

    this.weapon = new ItemClub();

    this.level = 1;
    this.sprite = null;

    this.dotManager = new DOTManager(this);

    //for later
    this.anim = {
        idle : null,
        attack : null,
        wait : null,
        interrupt : null,
        special : null,
        shield : null
    }

    this.skills = [];

    this.weak_point = null;
    
    this.state = BATTLER_STATE_IDLE;

    this.reward = null;
    
    this.onDeath = new mobileEvent();
    this.onTakeDamage = new mobileEvent();
    this.onAttack = new mobileEvent();

    this.game = null;

    this.anim_attack_fps = 9;
    
    //Use this to check if the current animation is playing
    this.isAnimationPlaying= function() {
        if (this.sprite !== null) {
            return this.sprite.animations.currentAnim.isPlaying;
        }
        return false;
    }

    //Use this to handle if the BattlerController needs to wait before updating again.
    this.isAnimating = false;

    this.Shield = function () {
        this.state = BATTLER_STATE_SHIELD;
        if (this.anim.shield !== null) {
            console.log("I have a shield animation");
            this.anim.shield.play(1,true);
        }
    }
    this.Parry = function () {
        this.state = BATTLER_STATE_PARRY;
    }
    this.Attack = function (attackSpeedMod=1,damageMod=1,attackAgain=false,isCombo=false) {
        //OnAttack();
        //TODO
        this.damageMod = damageMod;
        this.wasParried = false;
        if (attackAgain) {
            this.controller.pushAttackWithParams({speedMod: 1.75, damageMod: 1, attackAgain: false})
        }
        if (isCombo) {
            this.controller.pushAttackWithParams({speedMod: 0.75, damageMod: 1.35, attackAgain: false});
            this.controller.pushAttackWithParams({speedMod: 1.75, damageMod: .5, attackAgain: false});
            this.controller.pushAttackWithParams({speedMod: 2, damageMod: .75, attackAgain: false})
        }
        console.log(this.name + "Attack() called");
        this.state = BATTLER_STATE_ATTACK;
        this.isAnimating = true;
        this.anim.attack.play(this.anim_attack_fps*attackSpeedMod,false);
        this.OnAttack();
    }
    this.endAttack = function () {
        console.log(this.name + "endAttack() called");
        this.game.camera.shake(0.008,300,);
        if (!this.wasParried){
            this.target.TakeDamage(this.damage*this.damageMod);
        }
        else this.target.TakeDamage(0);
        this.damageMod = 1;
        this.isAnimating = false;
        this.wasParried = false;

    }
    this.Special = function (reductionPercent) {
        //The reduction doesn't actually happen
        this.state = BATTLER_STATE_SPECIAL;
        this.isAnimating = true;
        //TODO: Make it max at half or all
        this.reducedSpecialDamage = this.specialDamage;
        this.anim.special.play(7,false);
    }
    this.endSpecial = function() {
        console.log("Special Damage: " + this.reducedSpecialDamage);
        this.game.camera.shake(0.02,350);
        this.target.TakeDamage(this.reducedSpecialDamage,true);
        createScreenCrackAnimation(this.game,0,0);
        this.isAnimating = false;
    }
    this.Idle = function(override=false) {
        console.log(this.name + " Idle() called");
        if (this.state !== BATTLER_STATE_INTERRUPT || override===true)  {  
            this.state = BATTLER_STATE_IDLE;
            this.anim.idle.play(9,true);
            console.log(this.name + " Idle() state changed!");
        }
        this.isAnimating = false;

    }
    this.Wait =  function() {
        this.state = BATTLER_STATE_WAIT;
        this.anim.wait.play(10,true);
    }
    this.Interrupt =  function (fromWeak=false) {
        if (!this.isPlayer) {
            QuestManager.LogAction(QuestRequirements.INTERRUPT_MON);
        }
        this.anim.interrupt.play(12,true);
        if (this.weak_point != null) {
            this.weak_point.sprite.kill();
            this.weak_point = null;
        }
        this.state = BATTLER_STATE_INTERRUPT;
        console.log(this.name + " Interrupt() called");
    }
    this.TakeDamage = function (amount,isSpecial=false,isDoT=false,text=false) {
        

        var damageToTake = 0;
        if (isDoT) {
            console.log("It's a dot!");
            damageToTake = amount;
        }
        else if (this.state == BATTLER_STATE_SHIELD) {
            //FIX THIS
            if (!this.isPlayer && !isSpecial) {
                var piercing = this.target.weapon.params.piercing + PLAYER.GetCurrentSkillTree().GetStat("piercing");
                amount *= piercing;
            }
            if (!this.isPlayer && !isSpecial) {
                var smashing = this.target.weapon.params.smashing+PLAYER.GetCurrentSkillTree().GetStat("smashing");
                damageToTake = smashing*amount;
            }
            if (this.shieldHealth > amount) {
                this.shieldHealth -= amount;
                if (this.isPlayer) {
                    QuestManager.LogAction(QuestRequirements.BLOCK_MON);
                }
            }
            else {
                if (!this.isPlayer) {
                    this.controller.forceInterrupt(false);
                    this.shieldHealth = this.maxShieldHealth;
                    
                }else {
                    
                    damageToTake = amount-this.shieldHealth;
                    this.shieldHealth = 0;
                    this.canUseShield = false;
                }
                
            }
        }
        else if (this.state == BATTLER_STATE_INTERRUPT) {
            if (battleState.valueState.player === this.target && !isSpecial) {
                damageToTake = amount*battleState.valueState.player.weapon.params.extraDamagePercent;
            }
            else damageToTake = amount;
        }
        else if (this.state == BATTLER_STATE_WAIT)
        {
             if (!this.isPlayer)damageToTake = 0;
             else {
                 if (this.mana > 0) {
                    this.mana -= amount;
                    this.mana = (this.mana < 0)? 0 : this.mana;
                    damageToTake = amount/2;
                 }
                 else damageToTake = amount;
             }
        }
        else {
            damageToTake = amount;
        }
        //doesn't factor in shielding
        if (damageToTake > 0) {
            //QUEST CALLBACK
            if (this.isPlayer){
                QuestManager.LogAction(QuestRequirements.TAKE_HIT);
            }
            else if (!this.isPlayer && !isDoT) QuestManager.LogAction(QuestRequirements.ATTACK_MON);
            tintSprite(this.sprite,0xFF0000)
            this.game.time.events.add(200,function () {
                tintSprite(this.sprite,0xFFFFFF);
            },this);
        }
        this.health -= damageToTake;

        console.log(this.name +": "+ this.health + " / " + this.maxHealth + ": -" + damageToTake);
        this.OnTakeDamage();
        if (this.health <= 0) {
            this.OnDeath();
        }

    }
    this.UseSkill = function (target) {
        //OnUseSkill();
        //TODO
    }
     this.OnAttack = function() {
        console.log(this.name + "< - - - OnAttack() called - - - >");
        this.onAttack.call();
    }
    this.OnTakeDamage = function() {
        this.onTakeDamage.call();
    }
    this.OnDeath = function() {
        if (!this.isPlayer) {
            //QuestManager.LogAction(QuestRequirements.KILL_MON);
        }
        else QuestManager.LogAction(QuestRequirements.DIE);
        this.onDeath.call();
    }
    this.OnUseSkill = function() {
        //TODO
    }
    this.createWeakPoint = function(game) {
        //TODO fix weak point weirdness
        var weak_point = new WeakPoint(randomInt(this.sprite.x,this.sprite.x+5),this.sprite.y,randomInt(5,10),1500,game);
        weak_point.battler = this;
        weak_point.sprite.width =100;
        weak_point.sprite.height = 100;
        weak_point.slashDir = directionArray[randomInt(0,directionArray.length-1)];
        weak_point.Next(weak_point.battler.sprite.centerX + (weak_point.battler.sprite.width/3)*directionsToCoordOffset[weak_point.slashDir].x,
                    weak_point.battler.sprite.centerY + (weak_point.battler.sprite.height/3)*directionsToCoordOffset[weak_point.slashDir].y,
                                                                                                                    weak_point.initTime);
        this.weak_point = weak_point;
    }

    this.Update = function(delta) {
        this.dotManager.Update(delta);
    }
}

function createBattler(health,mana,level,sprite) {
    returnObj = new Battler();
    returnObj.health = health;
    returnObj.mana = mana;
    returnObj.level = level;
    returnObj.sprite = sprite;
    
    returnObj.maxHealth = health;
    returnObj.maxMana = mana;
    
    return returnObj;
}


