/**
 * Shield.js
 * Programmer: Adam Austin
 * Date: 3/15/2018
 * 
 *  */
function createPerfectRibbon(handler) {
    var ribbon = game.add.sprite(0,0,"btn_shield_perfect");
    
    ribbon.scale.setTo(0.7,0.7);
    
    ribbon.centerX = handler.sprite.centerX;
    ribbon.centerY = handler.sprite.centerY;
    game.add.tween(ribbon).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
       ribbon.kill();
    });
    /*var parryText = game.add.sprite(0,0,"battle_text_parry",0);
    parryText.scale.setTo(2,2);
    parryText.centerX = handler.target.sprite.centerX;
    parryText.centerY = handler.target.sprite.centerY;
    var parryTextAnim = parryText.animations.add("go");
    parryTextAnim.play(34,false).onComplete.add(function() {
        game.add.tween(parryText).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            ribbon.kill();
         });
    },this);*/
    //handler.me.mana += handler.me.manaRegenRate;
    //handler.me.mana = (handler.me.mana > handler.me.maxMana) ? handler.me.maxMana : handler.me.mana;

   
}
function ParryBar(handler,healthBar) {
    //TODO: Make this more clear
    this.sprite = game.add.sprite(healthBar.bars[0].x+10,healthBar.bars[0].y+60,"mon_parry_bar");
    this.cropRect = new Phaser.Rectangle(0,0,this.sprite.width,this.sprite.height);   
    this.maxWidth=this.sprite.width;
    this.sprite.crop(this.cropRect,false);

    handler.me.game.world.bringToTop(healthBar.bars[2]);

    this.setBarValue = function(ratio) {
        this.cropRect.width = ratio * this.maxWidth;
        this.sprite.updateCrop();
    }
}
function ShieldOverlay(handler) {

    //this is bad but I'm doing it anyways
    this.deltaTime = 0;
    this.chargeRate = 100; //ms to wait before mana is regen

    this.handler = handler;

    this.sprite = game.add.sprite(0,0,"shield_overlay");
    this.sprite.scale.setTo(0.75,0.75);
    this.sprite.centerX = 1334/2 //Screen_width
    this.sprite.centerY = 750/2; //screen_height

    this.sprite.visible = false;
    this.sprite.alpha = .5;
    this.Toggle = function(arg=null) {
        handler.me.game.world.bringToTop(this.sprite);
        if (arg === null) {
            this.sprite.visible = !this.sprite.visible;
        }
        else {this.sprite.visible = arg;}
    }
        //TODO: Add red when shield is hit
    
}
function ShieldShine(handler) {
    this.handler = handler;
    this.sprite = game.add.sprite(0,0,"shield_shine",0);

    this.sprite.centerX = handler.sprite.centerX+20;
    this.sprite.centerY = handler.sprite.y+10;
    this.anim = this.sprite.animations.add("go");
    this.anim.play(40,false).onComplete.add(function() {
        this.sprite.kill();
        this.handler.shine = null;
    },this);


} 
function ParryButton(me,target) {
    this.me = me;
    this.target = target;
    this.targetController = target.controller;
    
    this.canParry = true;

    this.sprite=game.add.sprite(1076,495,"btn_shield",0);
    this.anim_pressed = this.sprite.animations.add("pressed",[1]);
    this.anim_normal = this.sprite.animations.add("normal",[0]);

    this.icon_sprite = game.add.sprite(0,0,"icon_dagger");

    
    this.sprite.scale.setTo(0.45,0.45);
    this.icon_sprite.scale.setTo(0.45,0.45);

    this.sprite.centerX = 1029;
    this.sprite.centerY = 649;

    this.icon_sprite.centerX = this.sprite.centerX;
    this.icon_sprite.centerY = this.sprite.centerY;

    this.ready = true;

    this.sprite.inputEnabled = true;

    this.cooldown = 7000;

    this.doCooldown = function() {
        this.ready = false;
        this.sprite.alpha=1;
        var sprite_overlay = game.add.sprite(1076,495,"btn_shield",0);
        
        sprite_overlay.width = this.sprite.width;
        sprite_overlay.height = this.sprite.height;
        sprite_overlay.anchor.setTo(0.5,0.5);
        tintSprite(sprite_overlay,0x111111);
        sprite_overlay.centerX = this.sprite.centerX;
        sprite_overlay.centerY = this.sprite.centerY;
        sprite_overlay.alpha = 0.5
        this.anim_pressed.play(1,true);
        game.add.tween(sprite_overlay).to({height: 0}, this.cooldown, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            sprite_overlay.kill();
            this.anim_normal.play(1,true);
            this.ready = true;
        },this);
}
    this.setSizeAndScale = function(x,y,scale) {

        this.sprite.scale.setTo(scale,scale);
        this.icon_sprite.scale.setTo(scale,scale);

        this.icon_sprite.centerX = x;
        this.icon_sprite.centerY = y;

        this.sprite.centerX = x;
        this.sprite.centerY = y;
        
    }

    this.disable = function() {
        this.sprite.visible = false;
        this.icon_sprite.visible = false;
        this.sprite.inputEnabled = false;
        //this.sprite_overlay.visible = false;
       // this.barSprite.visible = false;
    }
    this.tryParry = function() {
        var player = this.me;
        console.log("TryParry: My state is " + this.me.state);
        if (this.target.state == BATTLER_STATE_ATTACK && this.target.anim.attack._frameIndex > 6 && this.canParry & this.ready) {
            this.canParry = false;
            this.me.state = BATTLER_STATE_PARRY;
            this.target.wasParried=true;
            //Parry amount changes
            var a = ((this.target.currentParryAmount + this.me.weapon.params.parryAmount) > 3) ? 3 : this.target.currentParryAmount + this.me.weapon.params.parryAmount;
            player.mana += player.maxMana *0.4;
            if (player.mana >= player.maxMana) {
                this.doCooldown();
                this.target.controller.forceInterrupt(true);
                player.mana = 0;
                
            } 
            else {
                this.target.controller.forceNext();
            }
            createPerfectRibbon(this);

            return true;
        }
        return false;
    }
    this.sprite.events.onInputDown.add(function() {
        if (this.ready)this.anim_pressed.play(1,true);
        if (this.tryParry()) { 
            console.log("Parry on Down");
            this.canParry = false;
        }
        else this.canParry = true;
        

    },this);
    this.sprite.events.onInputUp.add(function() {
        
        if (this.me.state != BATTLER_STATE_PARRY) {
            console.log("Parry: My state is " + this.me.state);
            this.me.state = BATTLER_STATE_IDLE;
        }
        //Player shields -- check for parry
        if (this.ready)this.anim_normal.play(1,true);
        this.buttonDown = false;
        if (this.tryParry()) {
            console.log("Parry on Up");
        }
        this.canParry = true;
    },this);

    
}
function enemyShieldBar(me) {
    this.me = me;
    this.sprite = game.add.sprite(me.sprite.centerX,me.sprite.centerY,"btn_shield_load",64);
    this.sprite.centerX = me.sprite.centerX;
    this.sprite.centerY = me.sprite.centerY;
    this.sprite.visible = false;
    this.anim_load = this.sprite.animations.add("go");

    this.anim_load.play(0,false);
    this.anim_load.setFrame(0);

    this.overlay = game.add.sprite(0,0,"shield_overlay");
    this.overlay.width = this.sprite.width/2;
    this.overlay.height = this.sprite.height/2;
    this.overlay.centerX = this.sprite.centerX;
    this.overlay.centerY = this.sprite.centerY;

    this.overlay.alpha = 0.5

    this.Update = function(delta) {
        this.anim_load.setFrame(Math.floor(63 * (this.me.shieldHealth/this.me.maxShieldHealth)));
        if (this.me.shieldHealth == 0) {
            this.anim_load.setFrame(64);
        }
        this.sprite.visible = (me.state == BATTLER_STATE_SHIELD);
        this.overlay.visible = (me.state == BATTLER_STATE_SHIELD);
    }
}
function ShieldHandler(me,target) {

    //setUp the sprite
    this.me = me;
    this.target = target;

    this.sprite=game.add.sprite(1076,395,"btn_shield",0);
    this.anim_pressed = this.sprite.animations.add("pressed",[1]);
    this.anim_normal = this.sprite.animations.add("normal",[0]);

    this.icon_sprite = game.add.sprite(0,0,"shield_overlay_sheet",0);

    this.icon_anims = [this.icon_sprite.animations.add("1",[0]),
                       this.icon_sprite.animations.add("1",[1]),
                       this.icon_sprite.animations.add("1",[2]),
                       this.icon_sprite.animations.add("1",[3])];

    this.load_sprite = game.add.sprite(1076,395,"btn_shield_load",64);

    this.setPos = function(x,y) {
        this.sprite.centerX = x;
        this.sprite.centerY = y;
        this.icon_sprite.centerX = x;
        this.icon_sprite.centerY = y;
        this.load_sprite.centerX = x;
        this.load_sprite.centerY = y;
    }
    
    this.buttonDown = false;
    
    this.parryButton = new ParryButton(me,target);
   

    this.shine = null;
    this.overlay = new ShieldOverlay(this);

    this.anim_load = this.load_sprite.animations.add("load");

    this.disable = function() {
        this.sprite.visible = false;
        this.icon_sprite.visible = false;
        this.sprite.inputEnabled = false;
        //this.sprite_overlay.visible = false;
        this.load_sprite.visible = false;
    }


    this.icon_sprite.scale.setTo(0.7,0.7);
    this.sprite.scale.setTo(0.7,0.7);
    this.load_sprite.scale.setTo(0.7,0.7);

    this.sprite.inputEnabled = true;

    this.sprite.events.onInputDown.add(function() {
        this.anim_pressed.play(1,true);
        this.me.state = BATTLER_STATE_SHIELD;
        this.buttonDown = true;

    },this);
    this.sprite.events.onInputUp.add(function() {
        
        if (this.me.state != BATTLER_STATE_PARRY) {
            this.me.state = BATTLER_STATE_IDLE;
        }
        //Player shields -- check for parry
        this.anim_normal.play(1,true);
        this.buttonDown = false;
       
        
    },this);
    

    this.getFPSForFrameData = function() {
        return (this.target.anim_attack_fps*(this.anim_load.frameTotal-3)) / (this.target.anim.attack.frameTotal-3); //Change the 9 and the 6 to reference monster fps and frames respectively
    }
    this.getLoadPercentage = function() {
        var amnt = this.target.anim.attack._frameIndex/7;
        return (amnt > 1) ? 0 : amnt;
    }
    /*this.CheckAnimLoad = function() {
        if (this.anim_load._frameIndex==54) { //TODO: Make frame measurements more exact
            this.shine = new ShieldShine(this);
            var otherShine = new ShieldShine(this);
            otherShine.sprite.centerX = this.target.sprite.centerX;
            otherShine.sprite.centerY = this.target.sprite.centerY - otherShine.sprite.height;
        }
    }*/

    this.anim_load.play(0,false);
    this.anim_load.setFrame(0);

    this.icon_sprite.scale.setTo(0.5,0.5);
    this.icon_sprite.centerX = this.sprite.centerX;
    this.icon_sprite.centerY = this.sprite.centerY;

    this.enemyHandler = new enemyShieldBar(this.target);

    this.regenRate = 0;
    this.deltaTime = 0;
    this.Update = function(delta) {

        var healthPercentage = (this.me.shieldHealth/this.me.maxShieldHealth);
        if (healthPercentage > 0.75) {
            this.icon_anims[0].play(1,true);
        }
        else if (healthPercentage > 0.5) {
            this.icon_anims[1].play(1,true);
        }
        else if (healthPercentage > 0.25) {
            this.icon_anims[2].play(1,true);
        }
        else if (healthPercentage >= 0) {
            this.icon_anims[3].play(1,true);
        }
        if (this.me.shieldHealth < this.me.maxShieldHealth && this.me.state != BATTLER_STATE_SHIELD) {
            this.deltaTime += delta;
            
            if (this.deltaTime >= this.regenRate) {
                this.me.shieldHealth += this.me.shieldRegen;
                if (this.me.shieldHealth > this.me.maxShieldHealth) {
                    this.me.shieldHealth = this.me.maxShieldHealth;
                    this.me.canUseShield = true;
                }
                this.deltaTime = 0;
            }
        }
        if (!this.me.canUseShield) {
            this.sprite.tint = 0x555555;
            this.anim_pressed.play(1,true);
            if (this.me.state == BATTLER_STATE_SHIELD) {
                this.me.state = BATTLER_STATE_IDLE;
            }
        }
        else {
            //this.deltaTime = 0;
            this.sprite.tint = 0xFFFFFF;
        }
        this.sprite.inputEnabled = this.me.canUseShield;
        
        this.anim_load.setFrame(Math.floor(63 * (this.me.shieldHealth/this.me.maxShieldHealth)));
        if (this.me.shieldHealth == 0) {
            this.anim_load.setFrame(64);
        }

        this.enemyHandler.Update(delta);
        
        //Handle player shielding
        if (this.me.state == BATTLER_STATE_SHIELD && this.me.canUseShield) {
            this.overlay.Toggle(true);
        }
        else {
            this.overlay.Toggle(false);
            if (this.me.state == BATTLER_STATE_SHIELD && !this.me.canUseShield) {
                this.me.state = BATTLER_STATE_IDLE;
            }
            
        }

    }
 }