Package.describe({
  name: 'slava:tracker-profiler',
  version: '0.0.1',
  summary: 'Collects the information about Tracker computations in the given period of time.',
  documentation: null,
  debugOnly: true
});

Package.onUse(function(api) {
  api.export('TrackerProfiler');
  api.use('tracker');
  api.use('underscore');
  api.addFiles('tracker-profiler.js');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('slava:tracker-profiler');
  api.addFiles('tracker-profiler-tests.js');
});
