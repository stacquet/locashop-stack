var request = require('request');
describe('angularjs homepage', function() {
	var firstNumber = element(by.model('first'));
	var secondNumber = element(by.model('second'));
	var loginLink = element(by.id('loginLink'));
	var baseUrl = 'http://localhost:3000';

	browser.get(baseUrl);
	
	afterEach(function() {
		console.log('rafraichissement de l\'interface');		
		element(by.id('menuAutenticated')).isDisplayed().then(function(isDisplayed){
			if(isDisplayed){
				element(by.id('menuAutenticated')).click();
				element(by.id('logoutLink')).click();
				console.log('logout');
			}
			else{
				element(by.id('homeLink')).click();
			}
		});
		//browser.sleep(1000);
	});
    
	it('click on login should lead to login page', function() {
		loginLink.click();
		expect(browser.getCurrentUrl()).toEqual(baseUrl+'/auth/login');
	});
	it('enter an wrong login email should let login button disabled', function() {
		loginLink.click();
		element(by.model('user.email')).sendKeys('sylvain.tacquetgmail.com');
		expect(element(by.id('loginButton')).isEnabled()).toBe(false);
	});
	
	it('enter a valid login and password should let login button enabled', function() {
		loginLink.click();
		element(by.model('user.email')).clear();
		element(by.model('user.email')).sendKeys('sylvain.tacquet@gmail.com');
		element(by.model('user.password')).sendKeys('tagisy6');
		expect(element(by.id('loginButton')).getWebElement().isEnabled()).toBe(true);
	});
	
	it('enter a valid login and password and click login should autenticate and lead to home page', function() {
		loginLink.click();
		element(by.model('user.email')).clear();
		element(by.model('user.email')).sendKeys('sylvain.tacquet@gmail.com');
		element(by.model('user.password')).sendKeys('tagisy6');
		element(by.id('loginButton')).click();
		expect(browser.getCurrentUrl()).toEqual(baseUrl+'/');
	});

	it('enter a wrong login and password and click login should show error message', function() {
		loginLink.click();
		element(by.model('user.email')).clear();
		element(by.model('user.email')).sendKeys('sylvain.tacquet@gmail.com');
		element(by.model('user.password')).sendKeys('azerazrgfd');
		element(by.id('loginButton')).click();
		expect(element.all(by.repeater('loginMessage in loginMessages')).count()).toEqual(1);
	});

});