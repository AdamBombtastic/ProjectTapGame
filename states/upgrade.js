/**
 * Name: upgrade.js
 * Date: 5/15/2018
 * Programmer: Adam Austin
 * 
 * This state will be the players house and it will be where the player upgrade their skills with weapons
 * 
 * 
 */


function CreateSkillCard(x,y,skill) {
    var myPanel = UIManager.createUIPanel(x,y,200,200);
    myPanel.centerX = x;
    myPanel.centerY = y;

    var myIcon = game.add.sprite(x,y,skill.icon);
    myIcon.width = 188;
    myIcon.height = 188;
    myIcon.centerX = x;
    myIcon.centerY = y;

    var myGroup = game.add.group();
    myGroup.add(myPanel);
    myGroup.add(myIcon);
    addHoverEffect(myIcon);
    myIcon.events.onInputUp.add(function() {
        upgradeState.selectedSkill = skill;
        UIManager.BroadcastEvent("skillSelected");
    },this);

    var levelText = game.add.text(myIcon.x+myIcon.width,myIcon.y+myIcon.height,skill.level + "/" + skill.maxLevel,{font: "24px Arial",fill:"Gray"});
    levelText.x -= levelText.width;
    levelText.y -= levelText.height;
    levelText.UpdateEvent = function() {
        levelText.text = skill.level + "/" + skill.maxLevel;
    }

    UIManager.SubscribeToEvent("pointsChanged",levelText);
    return myGroup;
    
    //TODO: Make this schnazz
}
function CreateInfoPanel() {
    var infoPanel  = UIManager.createUIPanel(0,500,game.world.width,250,0x784212,0xFFFFFF,0.95,0);
    var incButton = UIManager.createUIPanel(infoPanel.x+650,infoPanel.y+20,200,200,0x444444);
    var incText = game.add.text(incButton.x + 5, incButton.y + 5,"+",UIStyles.bigFont);
    incText.centerX = incButton.centerX;
    incText.centerY = incButton.centerY;

    var decButton = UIManager.createUIPanel(infoPanel.x+865,infoPanel.y+20,200,200,0x444444);
    var decText = game.add.text(incButton.x + 5, incButton.y + 5,"-",UIStyles.bigFont);
    decText.centerX = decButton.centerX;
    decText.centerY = decButton.centerY;

    addHoverEffect(incButton);
    addHoverEffect(decButton);

    incButton.events.onInputUp.add(function() {
       if ( PLAYER.skillTree[PLAYER.weapon].points - 1 >= 0 && upgradeState.selectedSkill.TryAddPoint() ) {
        PLAYER.skillTree[PLAYER.weapon].points -= 1;
       }
        pointCounter.text = PLAYER.skillTree[PLAYER.weapon].points;
        UIManager.BroadcastEvent("pointsChanged");
    });
    decButton.events.onInputUp.add(function() {
        if (upgradeState.selectedSkill.TryRemovePoint() ) {
            PLAYER.skillTree[PLAYER.weapon].points += 1;
           }
        pointCounter.text = PLAYER.skillTree[PLAYER.weapon].points;
        UIManager.BroadcastEvent("pointsChanged");
    });


    var pointCounter = game.add.text(infoPanel.x+1200,infoPanel.y,PLAYER.skillTree[PLAYER.weapon].points,UIStyles.bigFont);
    pointCounter.centerY = infoPanel.centerY;

    var nameText =  game.add.text(infoPanel.x + 10, infoPanel.y + 10,"Skill Name",UIStyles.largeFont);
    var descText = game.add.text(infoPanel.x + 10, infoPanel.y + 100,"No skill selected",{font: "22px Arial", fill:"White", wordWrap:true, wordWrapWidth:600});
    descText.text = "This is a test because descriptions can be long and I don't want stuff to get bogged down with stuff. " +
                    "So I'm just making sure that all the text will fit and I'm hoping it does.";

    nameText.UpdateEvent = function() {
        nameText.text = upgradeState.selectedSkill.name;
    }
    descText.UpdateEvent = function() {
        descText.text = upgradeState.selectedSkill.desc;
    }
    var mySkillTree = PLAYER.skillTree[PLAYER.weapon];
    if (mySkillTree.skills.length > 0) {
        for(var i = 0; i < mySkillTree.skills.length; i++) {
            CreateSkillCard(250+(300*i), game.world.centerY-75,mySkillTree.skills[i]);
        }
       
    }

    UIManager.SubscribeToEvent("skillSelected",nameText);
    UIManager.SubscribeToEvent("skillSelected",descText);

    
}
var upgradeState = {
    init : function() {
        
    },
    create : function() {

        game.stage.backgroundColor = 0xd2b48c;

        this.backArrow = game.add.sprite(8,8,"back_arrow");
        this.backArrow.scale.setTo(3,3);
        addHoverEffect(this.backArrow);
        this.backArrow.events.onInputUp.add(function() {
            NavigationManager.popState(false);
        },this);

        var titleText = game.add.text(game.world.centerX, 10,"Upgrades",UIStyles.largeFont);
        titleText.centerX = game.world.centerX;

        CreateInfoPanel();

    },
    update : function() {

    }
}