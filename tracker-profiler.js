TrackerProfiler = {};

var profileData = {};
var oldFuncs = {};
var started = false;

TrackerProfiler.start = function () {
  if (started) {
    throw new Error('Profiling is already running.');
  }

  started = true;
  _.each(Tracker._computations, function (c, id) {
    var pd = profileData[id] = {
      aveTime: 0,
      totalTime: 0,
      recomputations: 0,
      funcName: c._func.displayName || c._func.name
    };

    oldFuncs[id] = c._func;
    c._func = function () {
      var start = +(new Date);
      var ret = oldFuncs[id].apply(this, arguments);
      var end = +(new Date);
      var delta = end - start;

      var pd = profileData[id];

      pd.recomputations++;
      pd.totalTime += delta;
      pd.aveTime += (delta - pd.aveTime) / pd.recomputations;

      return ret;
    };
  });
};

TrackerProfiler.stop = function () {
  if (! started) {
    throw new Error('Profiling is not running.');
  }

  started = false;
  var mapping = profileData;

  _.each(oldFuncs, function (f, id) {
    // Is computation already stopped and removed? Skip it.
    if (! _.has(Tracker._computations, id))
      return;

    // Set the original function back.
    Tracker._computations[id]._func = f;
  });
  oldFuncs = {};
  profileData = {};

  var filteredRecords = _.filter(_.map(mapping, function (data, id) {
    return _.extend(data, { _id: id });
  }), function (data) { return !! data.recomputations; });

  return _.sortBy(filteredRecords, 'totalTime').reverse();
};

