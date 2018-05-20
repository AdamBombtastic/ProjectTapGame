/**
 * SkillTree.js
 * Date: 5/15/2018
 * Programmer: Adam Austin
 * 
 * This file will handle the masteries and different skill levels
 * 
 * TODO: Add a way to render these trees out (Int a tree like fashion)
 */
function Skill() {
    this.type = WEAPON_IDS.SWORD; //The weapon or item it's associated with
    this.name = ""; //Name of the skill
    this.desc = ""; //Description of skill

    this.level = 0; //Current level of the skill;
    this.maxLevel = 0; //Maximum level the skill can be.

    this.points = 0; //The amount of skill points it needs to level up.
    this.progression = []; //This will store the benefits and mechanics that the skill offers (based on level)

    this.requirements = []; //Skills and other conditions that the player needs to invest skill points

    this.icon = ""; //String denoting the icon to display    

    this.GetStat = function(statName) {
        var prog = this.progression[this.level-1];
        if (prog != null && prog[statName] != null) {
            return prog[statName];
        }
        return 0;
    }
    this.TryAddPoint = function() {
        if ((this.level + 1) <= this.maxLevel) {
            this.level+=1;
            return true;
        }
        return false;
    }
    this.TryRemovePoint = function() {
        if ((this.level - 1) >= 0) {
            this.level-=1;
            return true;
        }
        return false;
    }
}
 function SkillTree() {

    //NOT SURE HOW I WANT DO TO THIS FOR NOW, I don't want to waste time writing a system I wont use.
    this.type = WEAPON_IDS.SWORD;
    this.level = 0;
    this.tnl = 0; //exp with the weapon that is required to level up.
    this.maxLevel = 10;
    this.points = 5;
    
    this.skills = []; //All the skills contained in the tree;

    this.GetPointsSpent = function() {
        var count = 0;
        for (var i = 0; i < this.skills.length; i++) {
            var tempSkill = this.skills[i];
            count += tempSkill.level; //Currently just do this
        }
        return count;
    }

    this.GetStat = function (statName) {
        var count = 0;
        for (var i = 0; i < this.skills.length; i++) {
            var tempSkill = this.skills[i];
            count += tempSkill.GetStat(statName); //Currently just do this
        }
        return count;
    }
 }

 var SwordTree = new SkillTree();
 var basicSwordSkill = new Skill();

 //Tempoary skill stuff. We need to be loading this from a database of some sort.
 //Deep Wounds
 basicSwordSkill.name = "Deep Wounds";
 basicSwordSkill.desc = "Increases the amount of time enemies will bleed when wounded."
 basicSwordSkill.icon = "temp_bleed_icon";
 basicSwordSkill.maxLevel = 5;
 for (var i = 1; i <= basicSwordSkill.maxLevel; i++) {
      basicSwordSkill.progression.push({
        bleedDuration: i*500, //Increases that stat by amount listed
    });
 }
 SwordTree.skills.push(basicSwordSkill);

 basicSwordSkill = new Skill();
  //SwordMastery
  basicSwordSkill.name = "Sword Mastery I";
  basicSwordSkill.desc = "Increases your prowess with the sword resulting in higher damage when using a sword."
  basicSwordSkill.icon = "icon_sword";
  basicSwordSkill.maxLevel = 3;
  for (var i = 1; i <= basicSwordSkill.maxLevel; i++) {
       basicSwordSkill.progression.push({
         damage: i, //Increases that stat by amount listed
     });
  }
  SwordTree.skills.push(basicSwordSkill);
  //-----------------------
  basicSwordSkill = new Skill();
  //Disarm
  basicSwordSkill.name = "Disarm";
  basicSwordSkill.desc = "Skilled swordsman have a chance to disable enemies when making succesful attacks. Sword attacks have the chance to stun enemies";
  basicSwordSkill.icon = "icon_parry";
  basicSwordSkill.maxLevel = 1;
  for (var i = 1; i <= basicSwordSkill.maxLevel; i++) {
       basicSwordSkill.progression.push({
         interruptChance : 0.01, //Increases that stat by amount listed
     });
  }
  SwordTree.skills.push(basicSwordSkill);
 

 PLAYER.skillTree[WEAPON_IDS.CLUB] = new SkillTree();
 PLAYER.skillTree[WEAPON_IDS.SPEAR] = new SkillTree();
 PLAYER.skillTree[WEAPON_IDS.SWORD] = SwordTree;
 