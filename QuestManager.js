function Quest() {
    this.actions = {};
    this.reward = {};
    this.requirements = [];
    this.done = false;

    this.AddRequirement = function(aname, amount) {
        this.requirements.push({action: aname,amount:amount});
        this.actions[aname] = 0;
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
        //TODO: 
    },

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