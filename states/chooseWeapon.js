/** 
 * mainMenu.js
 * Date:4/6/2016
 * Programmer: Adam Austin
 * 
 * 
 * 
*/


function createScroll(x,y,friend) {
    var tempScroll = game.add.sprite(game.world.x,game.world.y,"icon_scroll");
    tempScroll.centerX = x;
    tempScroll.centerY = y;

    var anims = {
        play : tempScroll.animations.add("go"),
        first : tempScroll.animations.add("temp",[0,1]),
        second : tempScroll.animations.add("second",[2,3,4,5,6,7,8,9,10,11]),
        reverse : tempScroll.animations.add("reverse",[11,10,9,8,7,6,5,4,3,2]),
        end : tempScroll.animations.add("end",[1,0]),
    }
    
    return {sprite: tempScroll, anims: anims};
}
function createChoiceIcon(x,y,sprite_key,weapon,offhand) {
    var icon_scale = 0.65
    var tempScroll = createScroll(350,y,null);
    var iconImage =  game.add.sprite(x,y,sprite_key);
    iconImage.scale.setTo(icon_scale,icon_scale);
    iconImage.centerX = x;
    iconImage.centerY = y;

    iconImage.inputEnabled=true;
    var returnObj = {isSelected: false, scrollSprite: tempScroll}
    iconImage.events.onInputDown.add(function(item) {
        if (weapon > -1)PLAYER.weapon = weapon;
        if (offhand > -1)PLAYER.offhand = offhand;
    },this);
    
    iconImage.events.onInputOver.add(function(item) {
        item.tint=0x333333;
    },this);
    iconImage.events.onInputOut.add(function(item) {
        item.tint=0xFFFFFF;
    },this);

    setScroll(tempScroll,iconImage);
    return returnObj;
}

function setScroll(scroll,friend) {
    scroll.sprite.scale.setTo(0.45,0.45);
    scroll.sprite.centerX = friend.centerX;
    scroll.sprite.centerY = friend.centerY;

    scroll.anims.first.onComplete.add(function () {
        friend.visible = false;
        scroll.anims.second.play(14,false);
    },this);
    scroll.anims.reverse.onComplete.add(function() {
        friend.visible = true;
        friend.tint=0xFFFFFF;
        scroll.anims.end.play(14,false);
    });
    scroll.anims.second.onComplete.add(function () {
        if (PLAYER.weapon != -1 && PLAYER.offhand != -1) {
            //deprecated
            game.state.start("battle",true,false,{weapon:PLAYER.weapon,isRandomFight:chooseWeaponState.isRandomFight});
            console.log("Passed to batle with value of: " + chooseWeaponState.isRandomFight);
        }
    });


}
var chooseWeaponState = {

    mainText: null,
    offText: null,
    fightText : null,
    clubText : null,
    swordText:null,
    SpearText:null,
    swordImage:null,
    lastWeaponSelection:0,
    lastOffhandSelection:0,
    weaponChoices:[],
    offHandChoices:[],
    firstWeaponSelect:true,
    firstOffSelect:true,
    isRandomFight:false,
    init : function(bundle) {
        //setGameScale();
        PLAYER.weapon = -1;
        PLAYER.offhand = -1;
        this.firstOffSelect = true;
        this.firstWeaponSelect = true;
        if (bundle != null && bundle.isRandom != null) {
            this.isRandomFight = bundle.isRandom;
        }
    },
    create : function() {

        var icon_scale = 0.5
        
        game.stage.backgroundColor = 0x555555;

        this.mainText = game.add.text(game.world.centerX,game.world.centerY,"Choose a Weapon", {font: "55px Arial", fill: "White"});
        this.mainText.centerX = game.world.centerX-50;
        this.mainText.centerY = game.world.centerY-325;

        this.offText = game.add.text(game.world.centerX,game.world.centerY,"Choose a Secondary", {font: "55px Arial", fill: "White"});
        this.offText.centerX = game.world.centerX-50;
        this.offText.centerY = game.world.centerY+45;

        var weaponIcons = ["icon_sword","icon_club","icon_spear"];
        this.weaponChoices = [];
        for (var i = -1; i < 2; i++) {
            this.weaponChoices.push(createChoiceIcon((game.world.centerX-50)+(i*350),game.world.centerY-150,weaponIcons[i+1],i+1,-1));
        }
        var offHandIcons = ["icon_shield","icon_dagger","icon_fire"];
        this.offHandChoices = [];
        for (var i = -1; i < 2; i++) {
            this.offHandChoices.push(createChoiceIcon((game.world.centerX-50)+(i*350),game.world.centerY+225,offHandIcons[i+1],-1,i+1));
        }

        
    },
    update : function() {
        //setGameScale();

        if (this.lastWeaponSelection != PLAYER.weapon) {
            for (var i = 0; i < this.weaponChoices.length; i++) {
                if(i == PLAYER.weapon) {
                    this.weaponChoices[i].scrollSprite.anims.first.play(20,false);
                }
                else if (i== this.lastWeaponSelection && !this.firstWeaponSelect) {
                    this.weaponChoices[i].scrollSprite.anims.reverse.play(20,false);
                } 
            }
            this.lastWeaponSelection = PLAYER.weapon;
            this.firstWeaponSelect = false;
        }
        if (this.lastOffhandSelection != PLAYER.offhand) {
            for (var i = 0; i < this.offHandChoices.length; i++) {
                if(i == PLAYER.offhand) {
                    this.offHandChoices[i].scrollSprite.anims.first.play(20,false);
                }
                else if (i== this.lastOffhandSelection && !this.firstOffSelect) {
                    this.offHandChoices[i].scrollSprite.anims.reverse.play(20,false);
                } 
            }
            this.lastOffhandSelection = PLAYER.offhand;
            this.firstOffSelect = false;
        }
    }
}
