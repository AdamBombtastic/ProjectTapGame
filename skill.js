/****
 * Skill.js
 * Programmer: Adam Austin
 * Date: 3/16/2018
 *  
 */


 //TODO consolidate the commonalities into a Button class and then extend it for the different types
 function SkillButton() {

        //TODO: eventually link this up with different skills and cooldowns, but for now it's manually.

        this.cooldown = 1500; //ms time for cooldown
        this.isPressed = false;

        this.swipe = {
            start : {x: null,y : null},
            end : {x: null , y : null},
            getDirection : function() {
                returndir = "";
                //This shouldn't work, gotta change it to something better
                if (this.start.x > this.end.x && (this.start.x - this.end.x) > 45) {
                    returndir = "LEFT";
                }
                else if (this.start.x < this.end.x && (this.end.x - this.start.x) > 45) {
                    returndir = "RIGHT";
                }
                if (this.start.y < this.end.y && (this.end.y - this.start.y) > 45) {
                    returndir += "DOWN";
                }
                else if (this.start.y > this.end.y && (this.start.y - this.end.y) > 45){
                    returndir += "UP";
                }
                return returndir;
            },
            getNewDirection : function () {
                var pointCompare = new Phaser.Point(this.start.x,this.start.y);
                var changeTolerance = pointCompare.distance(this.end)/2;
                returndir = "";
                var changeX = Math.abs(this.start.x - this.end.x);
                var changeY = Math.abs(this.start.y - this.end.y);
                if (changeX >= changeTolerance) {
                    if (this.end.x < this.start.x) {
                        returndir = "LEFT";
                    }
                    else if (this.end.x > this.start.x) {
                        returndir = "RIGHT"
                    }
                }
                if (changeY >= changeTolerance) {
                    if (this.end.y < this.start.y) {
                        returndir += "UP";
                    }
                    else if (this.end.y > this.start.y) {
                        returndir += "DOWN"
                    }
                }
                return returndir;
            }
        }

        this.ready = true;

        this.sprite=game.add.sprite(40,495,"skill_btn",0);
        this.sprite_overlay = game.add.sprite(40,495,"skill_overlay");
        this.anim_pressed = this.sprite.animations.add("pressed",[1]);
        this.anim_normal = this.sprite.animations.add("normal",[0]);

        //TODO: change this later
        this.skill_icon = null;

        this.sprite.inputEnabled = true;

        this.sprite.scale.setTo(0.7,0.7);

        this.sprite_overlay.width = this.sprite.width;
        this.sprite_overlay.height = this.sprite.height;
        this.sprite_overlay.alpha = 0;

        this.sprite.anchor.setTo(0.5,0.5);
        this.sprite_overlay.anchor.setTo(0.5,0.5);

        this.sprite.angle=-45;
        this.sprite_overlay.angle=-45;

        this.setPos = function(nx,ny) {
            this.sprite.centerX = nx;
            this.sprite.centerY = ny;
            this.sprite_overlay.centerX = nx;
            this.sprite_overlay.centerY = ny;
            
        }
        this.setScale = function(sw,sh) {
            this.sprite.scale.setTo(sw,sh);
            this.sprite_overlay.width = this.sprite.width;
            this.sprite_overlay.height = this.sprite.height;

        }
        this.disable = function() {
            this.sprite.visible = false;
            this.skill_icon.visible = false;
            this.sprite.inputEnabled = false;
            this.sprite_overlay.visible = false;
        }
        this.skill = function() {
            //stub
            //This will eventually be replaced with a class
        }
        this.setIcon = function(new_icon,scalex=1,scaley=1) {
            this.skill_icon = new_icon;
            this.skill_icon.scale.setTo(scalex,scaley);
            this.skill_icon.anchor.setTo(0.5,0.5);
            this.skill_icon.centerX = this.sprite.centerX;
            this.skill_icon.centerY = this.sprite.centerY;
        }
        this.doCooldown = function() {
                    this.ready = false;
                    this.sprite.alpha=1;
                    this.sprite_overlay.alpha=0.3;
                    this.sprite_overlay.height = this.sprite.height;
                    game.add.tween(this.sprite_overlay).to({height: 0}, this.cooldown, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                        this.sprite_overlay.alpha=0;
                        this.anim_normal.play(1,true);
                        this.ready = true;
                    },this);
        }
        this.sprite.events.onInputDown.add(function(){
            if (this.ready) {
                this.isPressed = true;
                this.anim_pressed.play(1,true);
                if (this.skill()) {
                    this.ready = false;
                    this.sprite.alpha=1;
                    this.sprite_overlay.alpha=0.3;
                    this.sprite_overlay.height = this.sprite.height;
                    game.add.tween(this.sprite_overlay).to({height: 0}, this.cooldown, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                        this.sprite_overlay.alpha=0;
                        this.anim_normal.play(1,true);
                        this.ready = true;
                    },this);
                }
             }
               
        },this);

        this.sprite.events.onInputUp.add(function(){
            if (this.ready) {
                
                this.anim_normal.play(1,true);
            }
            this.isPressed = false;
        },this);

        this.changeToSwipe = function() {
            this.sprite.events.onInputDown.removeAll();
            this.sprite.events.onInputUp.removeAll();
            this.sprite.events.onInputDown.add(function(object,pointer) {
                if (this.ready) {
                    console.log("btn Down"+pointer.x + " " + pointer.y);
                    this.swipe.start.x = pointer.x;
                    this.swipe.start.y = pointer.y;
                }
            },this);
            this.sprite.events.onInputOver.add(function(object,pointer) {
                if (this.ready) {
                    console.log("btn Down"+pointer.x + " " + pointer.y);
                    this.swipe.start.x = pointer.x;
                    this.swipe.start.y = pointer.y;
                }
            },this);
            this.sprite.events.onInputUp.add(function(object,pointer) {
                    //todo rewrite this to make something betterhappen
                    if (this.ready) {
                        this.ready = false;
                        console.log("btn Up"+pointer.x + " " + pointer.y);
                        this.swipe.end.x = pointer.x;
                        this.swipe.end.y = pointer.y;
                       
                        var battleAnim = battleState.valueState.player.weapon.params.animation;
                        var tempDir = this.swipe.getNewDirection();
                        console.log("btn: "+tempDir);
                        var tempBattleAnim = createBattleAnimation(game,battleState.valueState.enemy.sprite.centerX,battleState.valueState.enemy.sprite.centerY,battleAnim,.75,0.75);
                        this.skill(); //do this better later
                    
                        tempBattleAnim.anchor.setTo(0.5,0.5);
                        tempBattleAnim.centerX = battleState.valueState.enemy.sprite.centerX;
                        tempBattleAnim.centerY = battleState.valueState.enemy.sprite.centerY;

                       
                        if (tempDir.includes("UP")) {
                            tempBattleAnim.angle = 90;
                        if (tempDir.includes("RIGHT")) {
                            tempBattleAnim.angle += 45;
                        }
                        else if (tempDir.includes("LEFT")){tempBattleAnim.angle -= 45;}
                        }
                        else if (tempDir.includes("DOWN")) {
                            tempBattleAnim.angle = 270;
                            if (tempDir.includes("RIGHT")) {
                                tempBattleAnim.angle -= 45;
                            }
                            else if (tempDir.includes("LEFT")) {tempBattleAnim.angle += 45;}

                        }
                        if (tempDir == "RIGHT") {
                            tempBattleAnim.angle = 180;
                        }
                        //if (battleAnim != "attack_sword") tempBattleAnim.angle -=15;
                        if (battleState.valueState.enemy.weak_point != null && battleState.valueState.enemy.weak_point.ready ) {
                            var tmpPoint = battleState.valueState.enemy.weak_point;
                            console.log("Slash: " + tmpPoint.slashDir + " | " + tempDir);
                            if (tmpPoint.slashDir == tempDir || tmpPoint.slashDir == directionsToOppositeDirection[tempDir]) {
                                console.log("Slash: it's a hit!");
                                tmpPoint.Hit();
                                //battleState.valueState.player.mana += 15;
                            }
                            else console.log("Slash: miss");
                        }

                        this.sprite.alpha=1;
                        this.sprite_overlay.alpha=0.3;
                        this.sprite_overlay.height = this.sprite.height;
                        game.add.tween(this.sprite_overlay).to({height: 0}, this.cooldown, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                            this.sprite_overlay.alpha=0;
                            this.anim_normal.play(1,true);
                            this.ready = true;
                        },this);
                        console.log("btn " + tempBattleAnim.angle);
                
                // }
                }
            },this);
            this.sprite.events.onInputOut.add(function(object,pointer) {
                //todo rewrite this to make something betterhappen
                if (this.ready) {
                    this.ready = false;
                    console.log("btn Up"+pointer.x + " " + pointer.y);
                    this.swipe.end.x = pointer.x;
                    this.swipe.end.y = pointer.y;
                   
                    var battleAnim = battleState.valueState.player.weapon.params.animation;
                    var tempDir = this.swipe.getNewDirection();
                    console.log("btn: "+tempDir);
                    var tempBattleAnim = createBattleAnimation(game,battleState.valueState.enemy.sprite.centerX,battleState.valueState.enemy.sprite.centerY,battleAnim,0.75,0.75);
                    this.skill(); //do this better later
                    tempBattleAnim.anchor.setTo(0.5,0.5);
                    tempBattleAnim.centerX = battleState.valueState.enemy.sprite.centerX;
                    tempBattleAnim.centerY = battleState.valueState.enemy.sprite.centerY;

                    //Temporary
                   
                    
                    if (tempDir.includes("UP")) {
                        tempBattleAnim.angle = 90;
                    if (tempDir.includes("RIGHT")) {
                        tempBattleAnim.angle += 45;
                    }
                    else if (tempDir.includes("LEFT")){tempBattleAnim.angle -= 45;}
                    }
                    else if (tempDir.includes("DOWN")) {
                        tempBattleAnim.angle = 270;
                        if (tempDir.includes("RIGHT")) {
                            tempBattleAnim.angle -= 45;
                        }
                        else if (tempDir.includes("LEFT")) {tempBattleAnim.angle += 45;}

                    }
                    if (tempDir == "RIGHT") {
                        tempBattleAnim.angle = 180;
                    }
                   // if (battleAnim != "attack_sword") tempBattleAnim.angle -= 15;
                    if (battleState.valueState.enemy.weak_point != null && battleState.valueState.enemy.weak_point.ready ) {
                        var tmpPoint = battleState.valueState.enemy.weak_point;
                        console.log("Slash: " + tmpPoint.slashDir + " | " + tempDir);
                        if (tmpPoint.slashDir == tempDir || tmpPoint.slashDir == directionsToOppositeDirection[tempDir]) {
                            console.log("Slash: it's a hit!");
                            tmpPoint.Hit();
                            //battleState.valueState.player.mana += 15;
                        }
                        else console.log("Slash: miss");
                    }

                    
                    this.sprite.alpha=1;
                    this.sprite_overlay.alpha=0.3;
                    this.sprite_overlay.height = this.sprite.height;
                    game.add.tween(this.sprite_overlay).to({height: 0}, this.cooldown, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                        this.sprite_overlay.alpha=0;
                        this.anim_normal.play(1,true);
                        this.ready = true;
                    },this);
                    console.log("btn " + tempBattleAnim.angle);
            
            // }
            }
        },this);
        }
 }
 function createSkillButtons(game) {
    var buttons = [];
    
    for (var i = 0; i < 2; i++) {
        var tempBtn = new SkillButton();
        buttons.push(tempBtn);
       
    }
    console.log(buttons);
    return buttons;
}