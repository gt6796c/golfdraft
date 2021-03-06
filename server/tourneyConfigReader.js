'use strict';

// Refreshes players, pick order, draft picks, and chat

var _ = require('lodash');
var config = require('./config');
var fs = require('fs');
var utils = require('../common/utils')


function saveConfig(fileName) {
  fileName = fileName || config.tourney_cfg;
  fs.writeFileSync(fileName,JSON.stringify(this,null,2), 'utf8');
}

var _defaults = {
  // Four golfers per player
  draftRounds:4,
  scores: {
    // Only count top two scores
    perDay: 2,
    // Usually start on first day
    startDay: 0,
    // Tournaments are typically 4 days
    numDays:4,
    // refresh scores from reader in minutes
    refreshRate: 10
  },
  commands: {},
  notifications: {}
}

function loadConfig() {
  var cfg = {};
  if (fs.existsSync(config.tourney_cfg))
    cfg = JSON.parse(fs.readFileSync(config.tourney_cfg, 'utf8'));
  var mcfg = utils.mergeDeep(_defaults,cfg);

  _.map(mcfg.commands, function (v,k) {
    if (Array.isArray(v))
      mcfg.commands[k] = v.join(' ');
  });

  mcfg.save = saveConfig.bind(mcfg);
  return mcfg;
}


module.exports = {
  loadConfig: _.once(loadConfig)
};