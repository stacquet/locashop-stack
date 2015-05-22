var Promise 		= require("bluebird");
var should 			= require('should-promised');
var imageFactory	= require(process.env.PWD+'/app/modules/imageFactory');
var models   		= require(process.env.PWD+'/app/models/');
var logger			= require(process.env.PWD+'/app/util/logger');


describe('imageFactory Unit Test', function(){
    it('#imageFactory.getImageById() should be rejected', function(){
		return imageFactory
		.getImageById()
		.should
		.rejected;
	});    
	it('#imageFactory.getImageById(1) should be fulfilled with photo', function(){
		return imageFactory.getImageById(1).should.fulfilled;
	});
	it('#imageFactory.createImage() should be rejected', function(){
		return imageFactory.createImage().should.rejected;
	});
});