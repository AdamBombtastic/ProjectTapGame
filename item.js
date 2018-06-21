/***
 * item.js
 * Date: 4/6/2018
 * Programmer: Adam Austin.
 *
 * This file controls all the functions for different items and item containers; 
 * 
 * TODO: Redo item system to create an array of all created items, their id will be their position in the array.
 * TODO: Create the Offhand Weapon parameters
 * 
 */
var WEAPON_IDS = { //Should be weapon type id's
    SWORD : 0,
    CLUB : 1,
    SPEAR : 2,
}
var OFFHAND_IDS = {
    SHIELD : 0,
    PARRY : 1,
    FIREBALL : 2,
}
var ITEM_RARITY = {
    COMMON : 0,
    RARE : 1,
    SUPER_RARE: 2,
    EPIC: 3,
    LEGENDARY : 4 

}
var ITEM_WEAPON_PARAMS =  {
    damage : 1,
    cooldown : 290, //ms
    piercing : 1, //percentage damage increase 1=Nothing
    interruptChance : 0, //chance of a mini-interrupt
    extraDamagePercent: 1.65,//extraDamageDone when enemy is interrupted.
    icon : null, //sprite
    animation : null, //attack animation
    parryAmount : 3 //Amount of 'balls' (lul) that this weapon parries
}

 var ITEM_TYPES = {
     NONE : 0,
     WEAPON : 1,
     OFFHAND : 2,
     ARMOR : 3,
     SKILLBOOK : 4,
     KEY : 5,
 }
var ITEM_FLAGS = {
    EQUIPPABLE : 0,
    SELLABLE : 1,
}

function Item() {
    this.type = ITEM_TYPES.NONE;
    /**
     * Different types have different parameters.
     * 
     */
    this.params = {};
    this.flags = [];
}

function createNewItem(type,params,flags) {
    var newItem = new Item();
    newItem.flags = flags;
    newItem.params = params;
    newItem.type = type;
    return newItem;
}
function createNewWeapon(params,flags) {
    var newWeapon = createNewItem(ITEM_TYPES.WEAPON,params,flags);
    return newWeapon;
}

/**
 * Temporary until loading from a json dataStore
 * 
 */

function ItemSword() {
    this.rarity = ITEM_RARITY.COMMON;
    this.type = ITEM_TYPES.WEAPON;
    this.weaponType = WEAPON_IDS.SWORD;
    this.id = 0
    this.name =  "Sword";
    this.desc = "A basic Sword";
    this.params = {
       
        damage : 4,
        cooldown : 330, //ms
        piercing : 1, //percentage damage increase
        smashing: 0, //Percentage of damage that goes through shield
        bleeding: 1, //bleed damage during interrupts
        maxBleed: 5, //maximum bleed stacks
        bleedDuration: 5000, //How long the bleed lasts ms
        bleedInterval: 500, //The interval for bleed damage
        interruptChance : 0, //chance of a mini-interrupt
        extraDamagePercent: 1.8,
        icon : "icon_sword", //sprite
        animation : "attack_sword", //attack animation
        parryAmount : 2,
    }
    this.flags = [ITEM_FLAGS.EQUIPPABLE, ITEM_FLAGS.SELLABLE];
    this.sellPrice = 20; //If sellable, must contain sellprice
}
function ItemClub() {
    this.rarity = ITEM_RARITY.COMMON;
    this.type = ITEM_TYPES.WEAPON;
    this.weaponType = WEAPON_IDS.CLUB;
    this.id = 1;
    this.name= "Club";
    this.desc = "A basic Club";
    this.params = {
        
        damage : 13,
        cooldown : 900, //ms
        piercing : 1, //percentage damage increase
        smashing: .3, //Percentage of damage that goes through shield
        bleeding: 0, //bleed damage during interrupts
        maxBleed: 0, //maximum bleed stacks
        bleedDuration: 0, //How long the bleed lasts ms
        bleedInterval: 0, //The interval for bleed damage
        interruptChance : 0.00, //chance of a mini-interrupt
        extraDamagePercent: 2.2,
        icon : "icon_club", //sprite
        animation : "attack_club", //attack animation
        parryAmount : 3,
    }
    this.flags = [ITEM_FLAGS.EQUIPPABLE, ITEM_FLAGS.SELLABLE];
    this.sellPrice = 40; //If sellable, must contain sellprice
}
function ItemSpear() {
    this.rarity = ITEM_RARITY.COMMON;
    this.type = ITEM_TYPES.WEAPON;
    this.weaponType = WEAPON_IDS.SPEAR;
    this.id = 2;
    this.name = "Spear";
    this.desc = "A basic spear";
    this.params = {
        
        damage : 2,
        cooldown : 160, //ms
        piercing : 3, //percentage damage increase
        smashing: 0, //Percentage of damage that goes through shield
        bleeding: 0, //bleed damage during interrupts
        maxBleed: 0, //maximum bleed stacks
        bleedDuration: 0, //How long the bleed lasts ms
        bleedInterval: 0, //The interval for bleed damage
        interruptChance : 0, //chance of a mini-interrupt
        extraDamagePercent: 1.5,
        icon : "icon_spear", //sprite
        animation : "attack_spear", //attack animation
        parryAmount : 3,
    }
    this.flags = [ITEM_FLAGS.EQUIPPABLE, ITEM_FLAGS.SELLABLE];
    this.sellPrice = 40; //If sellable, must contain sellprice
}
var ItemManager = {
    items : [],
    GetItemById : function(id) {
        return this.items[id];
    },
    GetCopy: function(item) {
        var newItem = this._GetCopy(item);
        this.AddItem(newItem);
        return newItem;
    },
    _GetCopy: function(item) {
        var newItem = {};
        for (var k in item) {
            if (k == "params" || k == "flags") {
                newItem[k] = this._GetCopy(item[k]);
            }
            newItem[k] = item[k];
        }
        return newItem;
    },
    GetRarityColor : function(item) {
        switch (item.rarity) {
            case ITEM_RARITY.COMMON:
                return 0x996633;
            case ITEM_RARITY.RARE:
                return 0xff9900;
            case ITEM_RARITY.SUPER_RARE:
                return 0xC0C0C0;
            case ITEM_RARITY.EPIC:
                return 0xffcc00;
            case ITEM_RARITY.LEGENDARY:
                return 0x33ccff;
            default:
                return 0x996633;
        }
    },
    AddItem : function(tempItem) {
        tempItem.id = this.items.length;
        this.items.push(tempItem);
    }

}
PLAYER.HasItem = function(item) {
    //TODO: change this up
    for (var i = 0; i < PLAYER.items.length; i++) {
        if (item.name == PLAYER.items[i].name) {
           return true;
        }
    }
    return false;
}
PLAYER.GetWeapon = function() {
    return ItemManager.GetItemById(PLAYER.weapon);
}
PLAYER.AddItem = function(item) {
    PLAYER.items.push(item);
}
ItemManager.AddItem(new ItemSword());
ItemManager.AddItem(new ItemClub());
ItemManager.AddItem(new ItemSpear());