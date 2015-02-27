var request = require('request');
describe('Page de profil', function() {

	var inscriptionLink = element(by.id('inscriptionLink'));
	var inscriptionButton = element(by.id('inscriptionButton'))
	var baseUrl = 'http://localhost:3000';

	browser.get(baseUrl);
	browser.waitForAngular();
	
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
    
	it('enter an email that exists should lead to error message', function() {
		inscriptionLink.click();
		expect(browser.getCurrentUrl()).toEqual(baseUrl+'/inscription/inscription');
		element(by.model('vm.user.email')).sendKeys('sylvain.tacquet@gmail.comd');
		element(by.model('vm.user.password')).sendKeys('tatata');
		element(by.model('vm.user.passwordBis')).sendKeys('tatata');
		element(by.id('inscriptionButton')).click();
		expect($('[ng-show="!vm.emailAvailable && vm.formSubmitted"]').isDisplayed()).toBeTruthy();
	});
	
	it('enter 2 != password should lead to error message', function() {
		inscriptionLink.click();
		expect(browser.getCurrentUrl()).toEqual(baseUrl+'/inscription/inscription');
		element(by.model('vm.user.email')).sendKeys('sylvain.tacquet@gmail.comd');
		element(by.model('vm.user.password')).sendKeys('tatata');
		element(by.model('vm.user.passwordBis')).sendKeys('tatatat');
		element(by.id('inscriptionButton')).click();
		expect($('[ng-show="vm.formSubmitted && !vm.passwordEquals"]').isDisplayed()).toBeTruthy();
	});
});