
//Global Functions & Settings

var IMAGE_ASSET_PATH = ".\\graphics\\";
var GLOBAL_SETTINGS = {
    version: 3.4,
    name: "Tap Game Demo",
    alpha: "a"
}
var PLAYER = {
    name : "Hero",
    level : 0,
    gold : 0,
    fans: 0,
    weapon: 0, //change this back to -1 later
    offhand: -1,
    mail: [],
    skillTree: {},
    items: [],
}
var GAME = {
    isRandomFight: false,
    isFirstMail : true,
    isFirstUpgrade : true,
}

console.log(GLOBAL_SETTINGS.name + " Version: " + GLOBAL_SETTINGS.version);
var GLOBAL_VERSION_STRING = "v" + GLOBAL_SETTINGS.version + GLOBAL_SETTINGS.alpha; 


var directionsToCoordOffset = {
    "UP" : {x: 0, y: -1 },
    "RIGHTUP" : {x: 1, y: -1 },
    "LEFTUP" : {x: -1, y: -1 },
    "DOWN" : {x: 0,y: 1},
    "RIGHTDOWN" : {x: 1,y: 1},
    "LEFTDOWN" : {x: -1,y: 1},
    "LEFT" : {x: -1, y: 0 },
    "RIGHT" : {x: 1, y: 0 },
}
var directionArray = ["UP","RIGHTUP","LEFTUP","DOWN","RIGHTDOWN","LEFTDOWN","LEFT","RIGHT"];

var directionsToOppositeDirection = {
    "UP" : "DOWN",
    "DOWN" : "UP",
    "LEFT" : "RIGHT",
    "RIGHT" : "LEFT",
    "RIGHTUP" : "LEFTDOWN",
    "LEFTDOWN" : "RIGHTUP",
    "RIGHTDOWN" : "LEFTUP",
    "LEFTUP" : "RIGHTDOWN"
}
function createBattleText(x,y,sprite_key,anim_speed=12,scaleX=1,scaleY=1) {
    var parryText = game.add.sprite(0,0,sprite_key,0);
    parryText.scale.setTo(scaleX,scaleY);
    parryText.centerX = x
    parryText.centerY = y
    var parryTextAnim = parryText.animations.add("go");
    return parryTextAnim.play(anim_speed,false).onComplete.add(function() {
        game.add.tween(parryText).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            //ribbon.kill();
         });
    },this);
}

//Healthbar Object
function HealthBar(game,s1,s2,s3,x,y,center=false) {
    this.bars = [s1,s2,s3];

    this.bars[1].setCropEnabled = true;
    this.cropRect = new Phaser.Rectangle(0,0,this.bars[1].width,this.bars[1].height);
    //Weird use of ._frame to fix resizing issues
    this.maxWidth=this.bars[1].width;
    this.bars[1].crop(this.cropRect,false);

    this.setPos = function(x,y,center=false) {
        for (var i = 0; i < this.bars.length;i++){
            this.bars[i].x = x;
            this.bars[i].y = y;
            if (center) {
                this.bars[i].x-=this.bars[i].width/2;
                this.bars[i].y-=this.bars[i].height/2;
            }
        }
    }
    this.setSize = function(w,h) {
        for (var i = 0; i < this.bars.length;i++){
            this.bars[i].width = w;
            this.bars[i].height = h;
        }
    }
    this.setBarValue = function(ratio) {
        this.cropRect.width = ratio * this.maxWidth;
        if (this.cropRect.width < 0) this.cropRect.width = 0;
        this.bars[1].updateCrop();
    }
    this.Hide = function() {
        for (var i = 0; i < this.bars.length;i++){
            this.bars[i].visible = false;
        }
    }
    this.Show = function() {
        for (var i = 0; i < this.bars.length;i++){
            this.bars[i].visible = true;
        }
    }
    this.setPos(x,y,center);

}
function getInputEnabledSprites(world) {
    spriteCache = [];
    for (var i = 0; i < world.children.length; i++) {
        var tmpSprite = world.children[i];
        if (tmpSprite.inputEnabled) {
            spriteCache.push(tmpSprite);
        }
    }
    return spriteCache;
}
function setInput(spriteList,val=false) {
    for (var i = 0; i < spriteList.length; i++) {
        spriteList[i].inputEnabled = val;
    }
}
function PauseButton(game,x,y) {

    //used to fix the pause issue
    this.inputSpriteCache = null;

    this.sprites = [game.add.sprite(x,y,"btn_pause"),game.add.sprite(x,y,"btn_play")];
    this.game = game;

    this.pauseText = game.add.text(0,0,"- PAUSED -",{font: "100px Arial", fill: "White"})
    this.pauseText.centerX = game.width/2;
    this.pauseText.centerY = game.height/2;
    this.pauseText.alpha = 0;
    this.sprites[1].alpha = 0;

    for (var i = 0; i < this.sprites.length; i++) {
        this.sprites[i].inputEnabled = true;
        this.sprites[i].scale.setTo(0.75,0.75);
    }
    this.sprites[1].alpha = 0;
    this.sprites[1].events.onInputUp.add(function() {
        this.sprites[0].alpha = !this.sprites[0].alpha;
        this.sprites[1].alpha = !this.sprites[1].alpha;
        this.game.paused = !this.game.paused;
        if (this.game.paused && this.inputSpriteCache == null) {
            this.inputSpriteCache = getInputEnabledSprites(this.game.world);
            setInput(this.inputSpriteCache); 
            this.sprites[1].inputEnabled = true;
        }
        else if (!this.game.paused && this.inputSpriteCache != null) {
            setInput(this.inputSpriteCache,true); 
            this.inputSpriteCache = null;
        }

        //this.pauseText.alpha = !this.pauseText.alpha;
    },this);
}

function tintSprite(s,c) {
    if (s != null)
        s.tint = c;
}
function addHoverEffect(s,c=0x555555) {
    s.inputEnabled = true;
    s.events.onInputOver.add(function() {
        tintSprite(s,c);
    },this);
    s.events.onInputOut.add(function() {
        tintSprite(s,0xFFFFFF);
    },this);
    s.events.onInputDown.add(function() {
        tintSprite(s,c);
    },this);
    s.events.onInputUp.add(function() {
        tintSprite(s,0xFFFFFF);
    },this);
}
//Utility Functions
function checkCorrectOrientation(w,h) {
    if (h > w) {
        return false;
    }
    return true;
}

function createDamageText(game,x,y,amount) {
    var tempText =  game.add.text(x,y,"-"+amount,{font: "40px Arial", fill: "Red"});
    game.add.tween(tempText).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true).onComplete.add(function() {
        tempText.kill();
    });

}

function createScreenCrackAnimation(game,x,y) {
    var screenCrack = game.add.sprite(x,y,"screen_crack");
    screenCrack.width = 1334;
    screenCrack.height = 750;

    game.add.tween(screenCrack).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
        screenCrack.kill();
    });
    

}

function createBattleAnimation(game,x,y,sprite_key="test_attack",scaleX = 1, scaleY = 1,color = 0xFFFFFF,alpha = 1) {
    //Creates the explosion effect at the specified point.
    
    var explosion = game.add.sprite(x,y,sprite_key,);
    
    explosion.tint = color;
    explosion.width *= scaleX;
    explosion.height *= scaleY;
    explosion.alpha = alpha;
    
    explosion.x-=explosion.width/2;
    explosion.y-=explosion.height/2;
    
    
    var do_anim = explosion.animations.add('go');
    do_anim.onComplete.add(
        function (sprite, ani) {
            sprite.kill();
        },this);
    do_anim.play(10);
    return explosion;
}

function createButton(game,x,y,sprite_key="test_nfight_btn",width=300,height=50) {
    var btn = game.add.sprite(x,y,sprite_key);
    btn.inputEnabled = true;
    btn.width = width;
    btn.height = height;
    btn.events.onInputDown.add( function(obj,pointer) {
           obj.tint = 0x696969;
        }, this);
    btn.events.onInputUp.add( function(obj,pointer) {
           obj.tint = 0xFFFFFF;
        }, this);
    return btn;
}
function randomInt(min,max) {
    return Math.floor(Math.random() * (max-min)) + min;
}

//Utility Classes
function mobileEvent() {
    this.funcs = [];
    this.args = [];
    this.context = [];
    this.add = function(o,a,c) {
        this.funcs.push(o);
        this.args.push(a);
        this.context.push(c);
        
    }
    this.call = function() {
        for (var i = 0; i < this.funcs.length; i++) {
            this.funcs[i].apply(this.context[i],this.args[i]);
        }
    }
}
function DOTManager(me) {
    this.dots = [];
    this.me = me;

    this.Get = function(index) {
       return this.dots[index];
    }
    this.Count = function() {
        return this.dots.length;
    }
    this.Add = function(interval,totalTime,damage,flag = {}) {
        var tempDot = new DamageOverTime(this.me, interval, totalTime, damage, flag);
        this.dots.push(tempDot);
        return tempDot;
    }
    this.Update = function(delta) {
        /***Apply damage and remove Dots that are done  ***/
        var removeList = [];
        for (var i = 0; i < this.dots.length; i++) {
            var tempDot = this.dots[i];
            if (tempDot.done) removeList.push(tempDot);
            else {
                tempDot.Update(delta);
            }
        }

        for (var i = 0; i < removeList.length; i++) {
            var tempIndex = this.dots.indexOf(removeList[i]);
            if (tempIndex != -1) {
                this.dots.splice(tempIndex,1);
            }
        }
    }
}
function DamageOverTime(me, interval, totalTime, damage, flags={}) {
    this.me = me;
    this.interval = 0;
    this.totalInterval = interval;
    this.totalTime = totalTime;
    this.timeLeft = totalTime;
    this.damage = damage;
    this.origDamage = damage;
    this.flags = flags;
    this.done = false;
    this.stacks = 1;

    this.anim = null;
    
    this.Stack = function() {
        this.timeLeft = totalTime;
        this.damage += this.origDamage;
        this.stacks += 1;
        this.done = false;
    }

    this.Update = function(delta) {
        this.interval += delta;
        if (this.interval >= this.totalInterval) {
            
            me.TakeDamage(damage,false,true,false);
            if (this.anim != null) {
                //Insert Bleeding animation here
            }
            this.timeLeft -= this.interval;
            if (this.timeLeft <= 0) this.done = true;
            else this.interval = 0;
        }
    }
    this.Cancel = function() {
        this.done = true;
        this.interval = this.totalInterval;
    }
    
}

//More utility 
function StringFormat(tempString) {
    var args = arguments;
    var mod = tempString;
    var returnStr = "";
    while (mod.length > 0 && mod.indexOf("{") > -1) {
        var iLoc = mod.indexOf("{");
        returnStr += mod.substr(0,iLoc);
        var iArg = parseInt(mod.substr(iLoc+1,1))+1;
        returnStr += args[iArg];
        mod = mod.substr(iLoc+3,(mod.length-(iLoc+3)));
    }
    returnStr += mod;
    return returnStr;
}