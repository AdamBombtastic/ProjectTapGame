function Quest() {
    this.title = "";
    this.from = "";
    this.message = "";
    this.actions = {};
    this.reward = {};
    this.requirements = [];
    this.done = false;

    this.AddRequirement = function(aname, amount) {
        this.requirements.push({action: aname,amount:amount});
        this.actions[aname] = 0;
        return this;
    }

    this.Update = function() {
        var checkDone = true;
        for (var i = 0; i < this.requirements.length; i++) {
            var tempReq = this.requirements[i];

            if (this.actions[tempReq.action] < tempReq.amount) {
                checkDone = false;
                break;
            }
        }
        this.done = checkDone;
    }
    this.GetText = function() {
        var returnStr = "";
        for (var i = 0; i < this.requirements.length; i++) {
            var tempReq = this.requirements[i];
            returnStr += requirementToText(tempReq.action) + " : " + tempReq.amount + "\n";
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
    AddRequirements: function(q,rList) {
        for (var i = 0; i < rList.length; i++) {
            q.AddRequirement(rList[i].action,rList[i].amount);
        }
        return q;
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
        if (this.actions[action_name] == null) {
            this.actions[action_name] = 0;
        }
        this.actions[action_name] += 1;
        for (var i = 0; i < this.quests.length; i++) {
            var currentQuest = this.quests[i];
            if (currentQuest.actions[action_name] != null) {
                currentQuest.actions[action_name] += 1;
                currentQuest.Update();
            }
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