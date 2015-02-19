describe('angularjs homepage', function() {
  var firstNumber = element(by.model('first'));
  var secondNumber = element(by.model('second'));
  var loginLink = element(by.id('loginLink'));
  var baseUrl = 'http://localhost:3000';

  browser.get(baseUrl);

  function logout(){
  		browser.get(baseUrl+'/api/logout');
  		browser.get(baseUrl);
  };

  it('should have a title', function() {
    expect(browser.getTitle()).toEqual('Locashop : la vente direct réellement communautaire !');
  });
  
  it('click on login should lead to login page', function() {
    loginLink.click();
    expect(browser.getCurrentUrl()).toEqual(baseUrl+'/auth/login');
  });
  it('enter correct login and password should enable login button and after click lead to homepage', function() {
    element(by.model('user.email')).sendKeys('sylvain.tacquet@gmail.com');
    element(by.model('user.password')).sendKeys('tagisy6');
    expect(element(by.id('loginButton')).getWebElement().isEnabled());
	element(by.id('loginButton')).click();
    expect(browser.getCurrentUrl()).toEqual(baseUrl+'/');
  });
  it('enter wrong login and password should lead to error message', function() {
    element(by.model('user.email')).sendKeys('sylvain.tacquet@gmail.com');
    element(by.model('user.password')).sendKeys('tagisy6');
    expect(element(by.id('loginButton')).getWebElement().isEnabled());
	element(by.id('loginButton')).click();
    expect(browser.getCurrentUrl()).toEqual(baseUrl+'/');
  });
  it('enter only login should let login button disabled', function() {
  	logout();
  	loginLink.click();
  	browser.get(baseUrl+'/auth/login');
    element(by.model('user.email')).sendKeys('sylvain.tacquet@gmail.com');
    expect(element(by.id('loginButton')).getWebElement().isEnabled());
	element(by.id('loginButton')).click();
    expect(browser.getCurrentUrl()).toEqual(baseUrl+'/');
  });
});