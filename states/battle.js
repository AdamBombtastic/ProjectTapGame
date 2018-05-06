var battleState = {
        valueState : {
            enemy : null,
            player: null,
            enemyController: null,
            healthBar : null,
            playerHealthBar : null,
            playerManaBar : null,
            shield : null,
            enemyNameText : null,
            playerNameText : null,
            monParryBar : null,
            deltaTime: 0,
            background : null,
            globalVersionText : null,
            skillButtons : null,
            pauseBtn : null,
            passedWeapon: null,
            isRandomFight : false,
            battleTime: 0,
            battleTimeText: null,
        },
        
        init : function(bundle) {
                 //Make sure the variables get initialized correctly
                 this.valueState =  {
                    enemy : null,
                    player: null,
                    enemyController: null,
                    healthBar : null,
                    playerHealthBar : null,
                    playerManaBar : null,
                    shield : null,
                    enemyNameText : null,
                    playerNameText : null,
                    monParryBar : null,
                    deltaTime: 0,
                    background : null,
                    globalVersionText : null,
                    skillButtons : null,
                    pauseBtn : null,
                    passedWeapon: null,
                    isRandomFight : false,
                    battleTime: 0,
                    battleTimeText: null,
                }
            if (bundle != null) {
                this.valueState.passedWeapon = bundle.weapon;
                if (bundle.isRandomFight != null) {
                    this.valueState.isRandomFight = bundle.isRandomFight;
                    GAME.isRandomFight = this.valueState.isRandomFight;
                    console.log("Bundle passed with : " + bundle.isRandomFight);
                }
            }
       
        },
        create : function() {

            //Limit the touch. This will be changed later. . .
            game.input.maxPointers = 1;
            
            game.stage.backgroundColor = "#226688";
            
            
            
            this.valueState.background = game.add.sprite(-10,-10,"battle_background");
            this.valueState.background.width = 1354;
            this.valueState.background.height = 770;
            
            this.valueState.globalVersionText = game.add.text(1260,10,GLOBAL_VERSION_STRING,{font: "22px Arial", fill: "White"});
            this.valueState.sizeText = game.add.text(1100,10,clientWidth() +" x " + clientHeight(),{font: "22px Arial", fill: "White"});
            
            this.valueState.battleTimeText = game.add.text(game.world.centerX,15," " + this.valueState.battleTime,{font: "32px Arial", fill: "White"});
            this.valueState.battleTimeText.centerX = game.world.centerX;
            this.valueState.player = createBattler(100,30,1,null);
            this.valueState.player.mana = 0;
            this.valueState.player.name = "Test";
            this.valueState.playerNameText = game.add.text(20,5,"Hero / LvL " + (PLAYER.level + 1),{font: "30px Arial", fill: "White"});
            this.valueState.playerHealthBar = new HealthBar(game,
                                            game.add.sprite(0,0,"plr_health_bar_back"),
                                            game.add.sprite(0,0,"plr_health_bar_front"),
                                        {},20,40);
            this.valueState.playerHealthBar.setSize(460,90);
          
            this.valueState.playerManaBar = new HealthBar(game,
                game.add.sprite(0,0,"plr_mana_bar_back"),
                game.add.sprite(0,0,"plr_mana_bar_front"),
            {},80,55);

            this.valueState.playerManaBar.setSize(400,80);
            this.valueState.player.onDeath.add(NavigationManager.pushState,["lose"],NavigationManager);

            this.valueState.player.shieldHealth = 125;
            this.valueState.player.maxShieldHealth = 125;
            this.valueState.player.isPlayer=true;
            if (this.valueState.passedWeapon == null) {
                this.valueState.player.weapon = new ItemSword(); //default
            }
            else {
                switch (this.valueState.passedWeapon) {
                    case 0:
                        this.valueState.player.weapon = new ItemSword();
                        this.valueState.playerNameText.text += "- Sword";
                        break;
                    case 1:
                        this.valueState.player.weapon = new ItemClub();
                        this.valueState.playerNameText.text += "- Club";
                        break;
                    case 2:
                        this.valueState.player.weapon = new ItemSpear();
                        this.valueState.playerNameText.text += "- Spears";
                        break;
                    default:
                        this.valueState.player.weapon = new ItemSword();
                        this.valueState.playerNameText.text += "- Sword";
                        break;
                }
            }
            

            this.valueState.enemy = createBattler(460,100,1,game.add.sprite(0,0,"ant_monster_all",0));
            this.valueState.enemy.anim.idle = this.valueState.enemy.sprite.animations.add("idle",[0,1,2,1]);
            this.valueState.enemy.anim.attack = this.valueState.enemy.sprite.animations.add("attack",[8,9,10,11,12,13,14,15,8]);
            this.valueState.enemy.anim.special = this.valueState.enemy.sprite.animations.add("special",[29,30,31,32,33,34,35]);
            this.valueState.enemy.anim.interrupt = this.valueState.enemy.sprite.animations.add("interrupt",[16,17,18,19,20,21,22,23]);
            this.valueState.enemy.anim.shield = this.valueState.enemy.sprite.animations.add("shield",[24]);
            this.valueState.enemy.anim.wait = this.valueState.enemy.sprite.animations.add("wait",[25,26,27,28]);

            this.valueState.enemy.anim.attack.onComplete.add(this.valueState.enemy.endAttack,this.valueState.enemy);
            this.valueState.enemy.anim.special.onComplete.add(this.valueState.enemy.endSpecial,this.valueState.enemy);
            this.valueState.enemy.Idle();

            this.valueState.enemy.target = this.valueState.player;
            this.valueState.enemy.name = "Antwon";
            this.valueState.enemy.sprite.inputEnabled = true;
            this.valueState.enemy.sprite.width = 400;
            this.valueState.enemy.sprite.height = 400;
            this.valueState.enemy.reward = {gold:50, exp: 100, win: true}

            this.valueState.player.target =this.valueState.enemy;

            this.valueState.enemy.sprite.x = game.width/2 - (this.valueState.enemy.sprite.width/2);
            this.valueState.enemy.sprite.x += 100;

            this.valueState.enemy.sprite.y = game.height/2 - (this.valueState.enemy.sprite.height/4);
            this.valueState.enemy.sprite.y -= 50;

            this.valueState.enemy.sprite.centerX = 768;
            this.valueState.enemy.sprite.centerY = 420;

           
            this.valueState.enemy.onDeath.add(function() {
                
                battleState.valueState.enemyController.forceInterrupt(false);
                tintSprite(battleState.valueState.enemy.sprite,0x881111);
                createBattleAnimation(game,battleState.valueState.enemy.sprite.centerX,battleState.valueState.enemy.sprite.centerY,"test_skill",3,3,0x992299,0.5);
                game.add.tween(battleState.valueState.enemy.sprite).to({alpha: 0}, 2000, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                    QuestManager.LogAction(QuestRequirements.KILL_MON);
                    NavigationManager.pushState("reward",battleState.valueState.enemy.reward);
                   
                 });
            },[],this);
            this.valueState.enemy.game = game;
            this.valueState.player.game = game;
            this.valueState.shield = new ShieldHandler(this.valueState.player,this.valueState.enemy);


            //TODO: Make the healthbar more easily scalable
            this.valueState.healthBar = new HealthBar(game,
                game.add.sprite(0,0,"mon_health_bar_back"),
                game.add.sprite(0,0,"mon_health_bar_front"),
                game.add.sprite(0,0,"mon_health_bar_skull"),
                this.valueState.enemy.sprite.centerX+20,
                this.valueState.enemy.sprite.y-40,
                true);
            this.valueState.healthBar.bars[1].y+=10;

           

            this.valueState.enemyController = new BattlerController();
            this.valueState.enemyController.me = this.valueState.enemy;
            this.valueState.enemyController.target = this.valueState.player;
            this.valueState.enemyController.game = game;
            this.valueState.enemy.controller = this.valueState.enemyController;
            this.valueState.enemy.shieldHealth = 60;
            this.valueState.enemy.maxShieldHealth = 60;
            
            this.valueState.combatController = new CombatController();
            this.valueState.combatController.loadEnemies();
            this.valueState.combatController.currentEnemyIndex = PLAYER.level;
            if (this.valueState.isRandomFight) {
                this.valueState.combatController.InitRandomBattle(this.valueState.enemy,this.valueState.enemyController,{level:PLAYER.level});
            }
            else this.valueState.combatController.InitBattle(this.valueState.enemy,this.valueState.enemyController);


            this.valueState.monParryBar = new ParryBar(this.valueState.shield,this.valueState.healthBar);
           
            
            this.valueState.enemyNameText = game.add.text(this.valueState.enemy.sprite.x,this.valueState.enemy.sprite.y - 130,this.valueState.enemy.name + " / LvL 2" ,{font: "30px Arial", fill: "White"});
            this.valueState.skillButtons = createSkillButtons(game);
            this.valueState.skillButtons[1].cooldown = 5000;
            this.valueState.skillButtons[1].skill = function(obj) {
                    //TODO: Make skills to handle this
                    battleState.valueState.player.mana += 0.25;
                    if (battleState.valueState.player.mana >= battleState.valueState.player.maxMana) {
                        createBattleAnimation(game,battleState.valueState.enemy.sprite.centerX,battleState.valueState.enemy.sprite.centerY,"test_skill",3,3);
                        battleState.valueState.enemy.TakeDamage(30,true,false,false);
                        QuestManager.LogAction(QuestRequirements.FIRE_MON);
                        battleState.valueState.enemyController.forceInterrupt(true);
                        battleState.valueState.player.mana = 0;
                        return true;
                    }
                    return false;
            }
            this.valueState.skillButtons[0].cooldown = this.valueState.player.weapon.params.cooldown;
            this.valueState.skillButtons[0].skill = function(obj) {
                    var tempWep = battleState.valueState.player.weapon.params;
                    var enemy = battleState.valueState.enemy;
                    battleState.valueState.enemy.TakeDamage(battleState.valueState.player.weapon.params.damage,false,false);
                    if (battleState.valueState.player.weapon.params.interruptChance > Math.random()) {
                        battleState.valueState.enemyController.forceInterrupt(true);
                    }
                    if (enemy.state == BATTLER_STATE_INTERRUPT) {
                        if (enemy.dotManager.Get(0) == null) {
                            enemy.dotManager.Add(tempWep.bleedInterval,tempWep.bleedDuration,tempWep.bleeding);
                        }
                        else{
                            if (enemy.dotManager.Get(0).stacks <= tempWep.maxBleed) {
                                enemy.dotManager.Get(0).Stack();
                            }
                        } 
                    }
                    if (PLAYER.offhand == OFFHAND_IDS.FIREBALL) {
                        //battleState.valueState.player.mana += battleState.valueState.player.weapon.params.damage/2;
                        if(battleState.valueState.player.mana > battleState.valueState.player.maxMana) {
                            battleState.valueState.player.mana = battleState.valueState.player.maxMana;
                        }
                    }
                    return true;
            }
            this.valueState.skillButtons[0].changeToSwipe();
            


            this.valueState.skillButtons[0].setScale(0.65,0.65);
            this.valueState.skillButtons[0].setPos(220,535); 
            this.valueState.skillButtons[0].setIcon(game.add.sprite(0,0,this.valueState.player.weapon.params.icon),0.65,0.65);
            this.valueState.skillButtons[0].skill_icon.angle -= 45;     
            this.valueState.skillButtons[1].setScale(0.4,0.4);
            this.valueState.skillButtons[1].setPos(360,652);
            this.valueState.skillButtons[1].setIcon(game.add.sprite(0,0,"icon_fire"),0.35,0.35);                

            game.input.onTap.add(function(pointer) {
                if (this.valueState.enemy.sprite.getBounds().contains(pointer.x,pointer.y) && !game.paused) {
                    createBattleAnimation(game,pointer.x,pointer.y,"test_attack",2,2);
                    this.valueState.enemy.TakeDamage(1,false,false);

                }
               
                console.log(pointer.x + ", " + pointer.y);


            }, this);

            this.valueState.pauseBtn = new PauseButton(game,1159,40);

            //this.valueState.enemyController.stateStack.generateStatesFromParams(this.valueState.enemyController.behaviourParams);
            var secondaryPosition = {x:this.valueState.shield.sprite.centerX,y:this.valueState.skillButtons[0].sprite.centerY}

            if (!GAME.isRandomFight && PLAYER.level < 1 || PLAYER.offhand != OFFHAND_IDS.FIREBALL)this.valueState.skillButtons[1].disable();
            if (!GAME.isRandomFight && PLAYER.level < 1 || PLAYER.offhand != OFFHAND_IDS.SHIELD)this.valueState.shield.disable();
            if (!GAME.isRandomFight && PLAYER.level < 1 || PLAYER.offhand != OFFHAND_IDS.PARRY)this.valueState.shield.parryButton.disable();

            //this.valueState.playerManaBar.Hide();
            
            //NEW IDEA
            if (PLAYER.offhand == OFFHAND_IDS.FIREBALL) {
                this.valueState.skillButtons[1].setScale(0.65,0.65);
                this.valueState.skillButtons[1].setPos(secondaryPosition.x,this.valueState.skillButtons[0].sprite.centerY,false);
                this.valueState.skillButtons[1].skill_icon.centerX = secondaryPosition.x;
                this.valueState.skillButtons[1].skill_icon.centerY= this.valueState.skillButtons[0].sprite.centerY;
                this.valueState.skillButtons[1].skill_icon.scale.setTo(0.65,0.65);

                this.valueState.player.mana = this.valueState.player.maxMana;
                this.valueState.playerManaBar.Show();
            }
            else if (PLAYER.offhand == OFFHAND_IDS.PARRY) {
                this.valueState.shield.parryButton.setSizeAndScale(secondaryPosition.x,secondaryPosition.y,0.65);
            }
            else if (PLAYER.offhand == OFFHAND_IDS.SHIELD) {
                this.valueState.shield.setPos(secondaryPosition.x,secondaryPosition.y);
            }
            
    },

    update : function() {

        this.valueState.enemy.Update(game.time.elapsed);
        this.valueState.player.Update(game.time.elapsed);

        this.valueState.playerHealthBar.setBarValue(this.valueState.player.health/this.valueState.player.maxHealth);
        if (PLAYER.offhand == OFFHAND_IDS.SHIELD) {
            this.valueState.playerManaBar.setBarValue(this.valueState.player.shieldHealth/this.valueState.player.maxShieldHealth);
        }
        else this.valueState.playerManaBar.setBarValue(this.valueState.player.mana/this.valueState.player.maxMana);
        this.valueState.healthBar.setBarValue(this.valueState.enemy.health/this.valueState.enemy.maxHealth);

        if (this.valueState.enemy.state ==BATTLER_STATE_WAIT) {
            this.valueState.healthBar.bars[1].tint = 0x777777;
        }
        else {
            this.valueState.healthBar.bars[1].tint = 0xFFFFFF;
        }
        this.valueState.deltaTime += game.time.elapsed;
        if (this.valueState.enemy.health > 0)
            this.valueState.battleTime += game.time.elapsed;

        this.valueState.battleTimeText.setText(" " + (this.valueState.battleTime / 1000).toFixed(2));
        this.valueState.battleTimeText.centerX = this.valueState.enemy.sprite.centerX;

       this.valueState.enemyController.NewUpdate(game.time.elapsed);

       this.valueState.shield.Update(game.time.elapsed);

       if (this.valueState.skillButtons[1].isPressed && this.valueState.skillButtons[1].ready) {
            this.valueState.player.state = BATTLER_STATE_WAIT;   
            if (this.valueState.skillButtons[1].skill()) {
                this.valueState.skillButtons[1].doCooldown();
            }
           
       }
       else if (!this.valueState.skillButtons[1].isPressed && this.valueState.skillButtons[1].ready) {
            this.valueState.player.state = (this.valueState.player.state == BATTLER_STATE_WAIT) ? BATTLER_STATE_IDLE : this.valueState.player.state;  
            if (PLAYER.offhand == OFFHAND_IDS.FIREBALL ){this.valueState.player.mana -= 0.075;}
            else if (PLAYER.offhand == OFFHAND_IDS.PARRY){ this.valueState.player.mana -= 0.035;}
           if (this.valueState.player.mana <= 0) {
               this.valueState.player.mana = 0;
           }
       }

       //TODO: Make this cleaner
       if (this.valueState.enemyController.me.weak_point == null) {
        this.valueState.monParryBar.setBarValue(this.valueState.shield.getLoadPercentage());
       }
       else {
        //this.valueState.monParryBar.setBarValue((this.valueState.enemyController.me.weak_point.total-(this.valueState.enemyController.me.weak_point.count-1))/this.valueState.enemyController.me.weak_point.total);
        this.valueState.monParryBar.setBarValue(this.valueState.enemyController.me.weak_point.pointsHit/this.valueState.enemyController.me.weak_point.total);
         }
       this.valueState.enemyNameText.text = this.valueState.enemy.name + " / LvL "+this.valueState.enemy.level+" ---- (" + getStateString(this.valueState.enemy.state)+")";
        
    }
    
    
    
}