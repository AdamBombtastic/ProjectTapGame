
function Quest() {
    this.title = "";
    this.from = "";
    this.message = "";
    this.actions = {};
    this.reward = {};
    this.requirements = [];
    this.done = false;

    this.GetConditionsForAction = function(action_name) { //Should be requirements for action
        var rCond = [];
        for (var i = 0; i < this.requirements.length; i++) {
            //If the requirement is linked to the action and there are conditions involved.
            if (this.requirements[i].action == action_name) {
                rCond.push(this.requirements[i]);
            }
        }
        return rCond;
    }
    this.CheckConditions = function(req,obj) {
        var cond = req.conditions;
        if (req.conditions == null) return true;
            for (var i = 0; i < cond.length; i++) {
                var tempCond = cond[i];
                if (obj[tempCond.name] != tempCond.value) {
                    return false;
                }
            }
            return true;
    }
    this.CheckAction = function(action, obj) {
        //Probably should rewrite this later (assuming it works)
        if (this.actions[action] != null) {
            var req = this.GetConditionsForAction(action);
            var increment = true;
            for (var i = 0; i < req.length; i++) {
                var tempReq = req[i];
                tempReq.count += (this.CheckConditions(tempReq,obj)) ? 1 : 0;
            }
            this.actions[action] += 1;
        }
    }
    this.AddRequirement = function(aname, amount,conditions = null,text="") {
        this.requirements.push(
            {action: aname,amount:amount, 
            conditions:conditions,count:0,text:text,
        });
        this.actions[aname] = 0;
        return this.requirements[this.requirements.length-1];
    }

    this.Update = function() {
        var checkDone = true;
        for (var i = 0; i < this.requirements.length; i++) {
            var tempReq = this.requirements[i];

            if (tempReq.count < tempReq.amount) {
                checkDone = false;
                break;
            }
        }
        this.done = checkDone;
    }
    this.GetText = function(showCount=false) {
        var returnStr = "";
        for (var i = 0; i < this.requirements.length; i++) {
            var tempReq = this.requirements[i];
            var countText = this.requirements[i].count + " / ";
            if (tempReq.text.length == 0) {
                returnStr +=(showCount)?requirementToText(tempReq.action) +" : " +countText+ tempReq.amount + "\n" : requirementToText(tempReq.action) +" : " + tempReq.amount + "\n";
            }
           else returnStr += (showCount) ? tempReq.text + ": " + countText+ tempReq.amount + "\n":tempReq.text + ": " + tempReq.amount + "\n";
        }
        return returnStr;
    }
}
var QuestFactory = {
    CreateQuest : function(title="",message="",from="") {
        var tempQ = new Quest();
        tempQ.title = title;
        tempQ.message = message;
        tempQ.from = from;
        return tempQ;
    },
    CreateConditionList : function(conds) {
        var c = [];
        for (var k in conds) {
            if (QuestConditions[k] != null) {
                c.push({name: k, value: conds[k]});
            }
        }
        return c;
    },
    AddRequirements: function(q,rList) {
        for (var i = 0; i < rList.length; i++) {
            q.AddRequirement(rList[i].action,rList[i].amount);
        }
        return q;
    },
    AddRequirement: function(q,r,amount,conds,text="") {
        var c = this.CreateConditionList(conds);
        q.AddRequirement(r,amount,c,text);
        console.log(c);
    },
    AddKillRequirement: function(q,amount,conds,text="") {
        this.AddRequirement(q,QuestRequirements.KILL_MON,amount,conds,text);
    },
    AddAttackRequirement: function (q, amount, conds,text="") {
        this.AddRequirement(q,QuestRequirements.ATTACK_MON,amount,conds,text);
    },
    SetReward: function(q,bundle) {
        q.reward = bundle;
        return q;
    }
}
var QuestManager = {
    quests: [],
    actions: {}, //Use actions to keep track of all stats
    LogAction: function(action_name) {
        var obj = this.GenerateBattleCondtions(); //This is bad, probably gonna have to change this.

        if (this.actions[action_name] == null) {
            this.actions[action_name] = 0;
        }
        this.actions[action_name] += 1;
        for (var i = 0; i < this.quests.length; i++) {
            var currentQuest = this.quests[i];
            currentQuest.CheckAction(action_name,obj);
            currentQuest.Update();
        }
    },
    AddQuest: function(newQuest) {
        this.quests.push(newQuest);
        return newQuest;
    },
    RemoveQuest: function(tempQuest) {
        var tempIndex = this.quests.indexOf(tempQuest);
        if (tempIndex > -1) {
            return this.quests.splice(tempIndex,1)[0];
        }
    },
    GetCompleted: function() {
        var cQuests = []
        for (var i = 0; i < this.quests.length; i++) {
            var tempQuest = this.quests[i];
            if (tempQuest.done) {
                cQuests.push(tempQuest);
            }
        }
        for (var i = 0; i < cQuests.length; i++) {
            var tempQuest = cQuests[i];
            this.RemoveQuest(tempQuest);
        }
        return cQuests;
    },
    GenerateBattleCondtions: function() {
        var rObj = {}
        //TODO: Add more of these
        rObj.PLAYER_WEAPON = PLAYER.weapon;
        rObj.PLAYER_OFFHAND = PLAYER.offhand;
        
        rObj.ENEMY_LEVEL = battleState.valueState.enemy.level;
        rObj.ENEMY_NAME = battleState.valueState.enemy.name;

        return rObj;
    }

}
var QuestRequirements = {
    ATTACK_MON : "attack_mon",
    KILL_MON : "kill_mon",
    PARRY_MON : "parry_mon",
    BLOCK_MON : "block_mon",
    FIRE_MON : "fire_mon",
    TAKE_HIT : "take_hit",
    INTERRUPT_MON : "interrupt_mon",
    DIE : "die",
}
var QuestConditions = {
    PLAYER_WEAPON : "player_weapon",
    PLAYER_OFFHAND : "player_offhand",
    ENEMY_LEVEL : "enemy_level",
    ENEMY_NAME : "enemy_name",
}
function conditionsToText(c) {
    switch (c) {
        case QuestConditions.PLAYER_OFFHAND:
        return "Using the ";
        case QuestConditions.PLAYER_WEAPON:
        return "With the ";
        case QuestConditions.ENEMY_LEVEL:
        return "Enemy is at least level ";
        case QuestConditions.ENEMY_NAME:
        return "Enemy is named ";
        default:
        return "None"
    }
}
function requirementToText(r) {
    switch (r) {
        case QuestRequirements.ATTACK_MON:
        return "Attack an enemy";
        case QuestRequirements.KILL_MON:
        return "Defeat an enemy";
        case QuestRequirements.PARRY_MON:
        return "Parry an attack";
        case QuestRequirements.BLOCK_MON:
        return "Block an attack";
        case QuestRequirements.FIRE_MON:
        return "Hit the enemy with a fireball";
        case QuestRequirements.TAKE_HIT:
        return "Take damage from an attack";
        case QuestManager.INTERRUPT_MON:
        return "Daze an enemy";
        case QuestManager.DIE:
        return "Lose a battle";
        default:
        return "Unknown";
    }
}