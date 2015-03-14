angular.module("locashopApp",["uiGmapgoogle-maps","llNotifier","cgBusy","ngImgCrop","ui.router","appRoutes","validationAdresseCtrl","ui.tinymce"]),angular.module("appRoutes",[]).config(function(a,b){b.otherwise("/"),a.state("home",{url:"/",templateUrl:"app/home/home.html"}).state("inscription",{url:"/inscription",templateUrl:"app/inscription/inscription.html",controller:"inscriptionController as vm"}).state("login",{url:"/login",templateUrl:"app/home/login.html"}).state("ferme",{url:"/ferme",templateUrl:"app/ferme/ferme.html",controller:"fermeController as vm"}).state("profil",{url:"/profil/:id_profil",templateUrl:"app/profil/profil.html",controller:"profilController as vm"}).state("profil.infos",{url:"/infos",templateUrl:"app/profil/profilInfos.html"}).state("profil.coordonnees",{url:"/coordonnees",templateUrl:"app/profil/profilCoordonnees.html"})}),function(){"use strict";function a(a,b,c,d){function e(){h.userProfil.adresse=d.getPosition(),console.log(h.userProfil.adresse),console.log(d.getPosition())}function f(){h.busy=c.saveProfil({userProfil:h.userProfil}).success(function(){b.notify({template:"Sauvegarde OK"})}).error(function(){b.notify({template:"Erreur à la savegarde",type:"error"})})}function g(){h.busy=c.getProfil().success(function(a){h.userProfil=a})}var h=this;h.saveProfil=f,h.checkAdresse=e,g(),h.options={language:"en",allowedContent:!0,entities:!1}}angular.module("locashopApp").controller("fermeController",a),a.$inject=["$location","notifier","fermeService","mapsService"]}(),function(){"use strict";function a(a){function b(){return a.get("/api/ferme")}function c(b){return a.post("/api/user/profil/save",b)}function d(b){return a.post("/api/user/adresse/save",b)}var e={getProfil:b,saveProfil:c,saveAdresse:d};return e}angular.module("locashopApp").factory("fermeService",a),a.$inject=["$http"]}(),function(){"use strict";function a(){function a(){return c.position}function b(a){c.position=a}var c={position:{},getPosition:a,setPosition:b};return c}angular.module("locashopApp").factory("mapsService",a)}(),angular.module("validationAdresseCtrl",["uiGmapgoogle-maps"]).config(["uiGmapGoogleMapApiProvider",function(a){a.configure({v:"3.16",libraries:"places"})}]).run(["$templateCache",function(a){a.put("searchbox.tpl.html",'<input id="pac-input" class="form-control" type="text" placeholder="Rechercher votre adresse">'),a.put("window.tpl.html",'<div ng-controller="WindowCtrl" ng-init="showPlaceDetails(parameter)">	{{place.name}}	<div class="form-group">            <div class="col-xs-offset-2 ">              <a href="#" id="saveProfilButton" ng-click="saveAdresse()" class="btn btn-sm btn-success">Sauver <span class="glyphicon glyphicon-floppy-save"></span></a>           </div>         </div></div>')}]).controller("WindowCtrl",function(a,b,c){a.place={},a.showPlaceDetails=function(b){a.place=b},a.saveAdresse=function(){console.log(a.place);var b=a.place.geometry.location;c.setPosition(b)}}).controller("SearchBoxController",["$scope","$timeout","uiGmapLogger","$http","uiGmapGoogleMapApi",function(a,b,c,d,e){c.doLog=!0,e.then(function(b){b.visualRefresh=!0,a.defaultBounds=new google.maps.LatLngBounds(new google.maps.LatLng(40.82148,-73.6645),new google.maps.LatLng(40.66541,-74.31715)),a.map.bounds={northeast:{latitude:a.defaultBounds.getNorthEast().lat(),longitude:a.defaultBounds.getNorthEast().lng()},southwest:{latitude:a.defaultBounds.getSouthWest().lat(),longitude:-a.defaultBounds.getSouthWest().lng()}},a.searchbox.options.bounds=new google.maps.LatLngBounds(a.defaultBounds.getNorthEast(),a.defaultBounds.getSouthWest())}),angular.extend(a,{selected:{options:{visible:!1},templateurl:"window.tpl.html",templateparameter:{}},map:{control:{},center:{latitude:47.472955,longitude:-.554351},zoom:10,dragging:!1,bounds:{},markers:[],idkey:"place_id",events:{idle:function(){},dragend:function(b){var c=b.getBounds(),d=c.getNorthEast(),e=c.getSouthWest();a.searchbox.options.bounds=new google.maps.LatLngBounds(e,d)}}},searchbox:{template:"searchbox.tpl.html",position:"top-left",options:{bounds:{}},parentdiv:"searchBoxParent",events:{places_changed:function(b){if(places=b.getPlaces(),0!=places.length){newMarkers=[];for(var c,d=new google.maps.LatLngBounds,e=0;c=places[e];e++){var f={id:e,place_id:c.place_id,name:c.name,latitude:c.geometry.location.lat(),longitude:c.geometry.location.lng(),options:{visible:!1},templateurl:"window.tpl.html",templateparameter:c};newMarkers.push(f),d.extend(c.geometry.location)}a.map.bounds={northeast:{latitude:d.getNorthEast().lat(),longitude:d.getNorthEast().lng()},southwest:{latitude:d.getSouthWest().lat(),longitude:d.getSouthWest().lng()}},a.map.zoom=14,_.each(newMarkers,function(b){b.closeClick=function(){return a.selected.options.visible=!1,b.options.visible=!1,a.$apply()},b.onClicked=function(){a.selected.options.visible=!1,a.selected=b,console.log(b),a.selected.options.visible=!0}}),a.map.markers=newMarkers}}}}})}]),function(){"use strict";function a(a,b,c,d){function e(){h.busy=d.login(h.user.email,h.user.password).success(function(c){a.userInfos=c.user,a.isLoggedIn=!0,b.path("/")}).error(function(a){console.log(a),h.messages=a.messages})}function f(){a.isLoggedIn||(h.busy=d.userInfos().success(function(b){a.userInfos=b,a.isLoggedIn=!0}))}function g(){h.busy=d.logout().success(function(){a.userInfos=null,a.isLoggedIn=!1,b.path("/")})}var h=this;h.login=e,h.logout=g,f()}angular.module("locashopApp").controller("homeController",a),a.$inject=["$rootScope","$location","notifier","homeService"]}(),function(){"use strict";function a(a){function b(){return a.get("/api/home/userInfos")}function c(){return a.get("/api/home/logout")}function d(b,c){return a.post("/api/home/login",{email:b,password:c})}var e={userInfos:b,logout:c,login:d};return e}angular.module("locashopApp").factory("homeService",a),a.$inject=["$http"]}(),function(){"use strict";function a(a,b,c){function d(){g.passwordEquals=g.user.password===g.user.passwordBis}function e(){g.busy=c.checkEmailAvailable(g.user.email).then(function(a){g.emailAvailable=a.data.checkEmailAvailable,g.userForm.email.$setValidity("notAvailable",g.emailAvailable)},function(){})}function f(){g.formSubmitted=!0,d(),g.passwordEquals&&g.userForm.$valid&&(g.busy=c.checkEmailAvailable(g.user.email).then(function(a){g.emailAvailable=a.data.checkEmailAvailable}).then(function(){g.userForm.$valid&&g.emailAvailable&&(g.loadingMessage="Inscription en base",g.busy=c.localSignup(g.user).then(function(){return g.loadingMessage="Envoi d'un email de vérification",c.emailVerification()}).then(function(){b.notify({template:"Nous vous avons envoyé un mail pour confirmer votre inscription"}),a.path("/")},function(){b.notify({template:"Nous n'avons pu vous envoyer un mail, veuillez contactez le support",type:"error"})}))}))}var g=this;g.passwordEquals=!0,g.emailAvailable=!0,g.loadingMessage="loading",g.formSubmitted=!1,g.checkPasswordEqual=d,g.checkEmailAvailable=e,g.localSignup=f}angular.module("locashopApp").controller("inscriptionController",a),a.$inject=["$location","notifier","inscriptionService"]}(),function(){"use strict";function a(a){function b(b){return a.post("/api/inscription/checkEmailAvailable",{email:b}).success(function(a){return console.log(a),a}).error(function(){})}function c(b){return a.post("/api/inscription/localSignup",b)}function d(){return a.get("/api/inscription/emailVerification")}var e={checkEmailAvailable:b,localSignup:c,emailVerification:d};return e}angular.module("locashopApp").factory("inscriptionService",a),a.$inject=["$http"]}(),function(){"use strict";function a(a,b,c,d){function e(){h.userProfil.adresse=d.getPosition(),console.log(h.userProfil.adresse),console.log(d.getPosition())}function f(){h.busy=c.saveProfil({userProfil:h.userProfil}).success(function(){b.notify({template:"Sauvegarde OK"})}).error(function(){b.notify({template:"Erreur à la savegarde",type:"error"})})}function g(){h.busy=c.getProfil().success(function(a){h.userProfil=a})}var h=this;h.saveProfil=f,h.checkAdresse=e,g(),h.options={language:"en",allowedContent:!0,entities:!1}}angular.module("locashopApp").controller("profilController",a),a.$inject=["$location","notifier","fermeService","mapsService"]}();