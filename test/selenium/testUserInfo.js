var request = require('request');
var path = require('path');

describe('User info page', function() {

	var loginLink = element(by.id('loginLink'));
	var profilLink = element(by.id('userInfoLink'));
	var saveProfilButton = element(by.id('saveUserInfoButton'))
	var baseUrl = 'http://localhost:3000';

	
	
	/*afterEach(function() {
		element(by.id('menuAutenticated')).isDisplayed().then(function(isDisplayed){
			if(isDisplayed){
				element(by.id('menuAutenticated')).click();
				element(by.id('logoutLink')).click();
			}
			else{
				element(by.id('homeLink')).click();
			}
		});
	});*/
	
	
    
	/*it('login and fill the profil form', function() {
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
	});*/
	it('work with userInfo form', function() {
		browser.get(baseUrl+"/#/user/1/infos");
		expect(element(by.id('userInfoEmail')).getText()).toEqual('sylvain.tacquet@gmail.com');
		element(by.model('vmUserInfo.user.nom')).clear();
		element(by.model('vmUserInfo.user.prenom')).clear();
		element(by.model('vmUserInfo.user.age')).clear();
		element(by.model('vmUserInfo.user.nom')).sendKeys('tacquet');
		element(by.model('vmUserInfo.user.prenom')).sendKeys('sylvain');
		element(by.model('vmUserInfo.user.age')).sendKeys('26');
		/*var fileToUpload = '20140829_142035.jpg';
		var absolutePath = path.resolve(__dirname, fileToUpload);
		element(by.id('userInfoUploadButtonModify')).click();
		$('input[type="file"]').sendKeys(absolutePath);
		element(by.id('userInfoUploadButtonOK')).click();
		browser.sleep(5000);
		*/
		expect(browser.getCurrentUrl()).toEqual(baseUrl+'/#/user/1/adresse');

	});
});