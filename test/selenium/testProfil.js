var request = require('request');
describe('Page de profil', function() {

	var loginLink = element(by.id('loginLink'));
	var profilLink = element(by.id('profilLink'));
	var saveProfilButton = element(by.id('saveProfilButton'))
	var baseUrl = 'http://localhost:3000';

	browser.get(baseUrl);
	
	afterEach(function() {
		element(by.id('menuAutenticated')).isDisplayed().then(function(isDisplayed){
			if(isDisplayed){
				element(by.id('menuAutenticated')).click();
				element(by.id('logoutLink')).click();
			}
			else{
				element(by.id('homyeLink')).click();
			}
		});
		//browser.sleep(1000);
	});
    
	it('login and fill the profil form', function() {
		loginLink.click();
		element(by.model('user.email')).clear();
		element(by.model('user.email')).sendKeys('sylvain.tacquet@gmail.com');
		element(by.model('user.password')).sendKeys('tagisy6');
		element(by.id('loginButton')).click();
		profilLink.click();
		element(by.model('userProfil.nom')).sendKeys('tacquet');
		element(by.model('userProfil.Fermes[0].presentation_ferme')).sendKeys('voici ma belle ferme');
		browser.sleep(500);
		element(by.id('pac-input')).sendKeys('7 rue lauz');
		saveProfilButton.click();
	});
});