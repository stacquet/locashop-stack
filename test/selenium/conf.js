exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
	// Spec patterns are relative to the location of the spec file. They may
  // include glob patterns.
  suites: {
    /*login: 'testLogin.js',
    inscription: 'testInscription.js',*/
    userInfo : 'testUserInfo.js'
  },

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true, // Use colors in the command line report.
  }
}
