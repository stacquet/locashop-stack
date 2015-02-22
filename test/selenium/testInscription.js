var request = require('request');
describe('Page de profil', function() {

	var inscriptionLink = element(by.id('inscriptionLink'));
	var inscriptionButton = element(by.id('inscriptionButton'))
	var baseUrl = 'http://localhost:3000';

	browser.get(baseUrl);
	
	afterEach(function() {
		element(by.id('menuAutenticated')).isDisplayed().then(function(isDisplayed){
			if(isDisplayed){
				element(by.id('menuAutenticated')).click();
				element(by.id('logoutLink')).click();
			}
			else{
				element(by.id('homeLink')).click();
			}
		});
		//browser.sleep(1000);
	});
    
	it('enter a valid email + password should lead to email validation', function() {
		inscriptionLink.click();
		expect(browser.getCurrentUrl()).toEqual(baseUrl+'/auth/inscription');
		element(by.model('user.email')).sendKeys('toto@gmail.com');
		element(by.model('user.password')).sendKeys('tagisy6');
		element(by.model('user.passwordBis')).sendKeys('tagisy6');
		element(by.id('inscriptionButton')).click();
		expect(browser.getCurrentUrl()).toEqual(baseUrl+'/user/emailValidation');

	});
});