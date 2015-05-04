angular.module("locashopApp",["llNotifier","cgBusy","ngImgCrop","ui.router","angularFileUpload","appRoutes","ui.tinymce","ngResource"]),angular.module("appRoutes",[]).config(function(a,b){b.otherwise("/"),a.state("home",{url:"/",templateUrl:"app/home/home.html"}).state("inscription",{url:"/inscription",templateUrl:"app/inscription/inscription.html",controller:"inscriptionController as vm"}).state("login",{url:"/login",templateUrl:"app/home/login.html"}).state("ferme",{url:"/ferme",templateUrl:"app/ferme/ferme.html",controller:"fermeController as vm"}).state("itineraire",{url:"/itineraire",templateUrl:"app/itineraire/itineraire.html",controller:"itineraireController as vmItineraire"}).state("user",{url:"/user/:id_user",templateUrl:"app/user/user.html"}).state("user.infos",{url:"/infos",templateUrl:"app/user/userInfo.html",controller:"userInfoController as vmUserInfo"}).state("user.adresse",{url:"/adresse",templateUrl:"app/user/userMaps.html",controller:"userMapsController as vmUserMaps"}).state("user.mobile",{url:"/mobile",templateUrl:"app/user/userMobile.html",controller:"userMobileController as vmUserMobile"})}),function(){"use strict";function a(a,b,c,d,e){function f(){a.busy=e.login(i.user.email,i.user.password).success(function(b){a.userInfos=b.user,a.isLoggedIn=!0,c.go("home")}).error(function(a){console.log(a),i.messages=a.messages})}function g(){a.isLoggedIn||(i.busy=e.userInfos().success(function(b){a.userInfos=b,a.isLoggedIn=!0}))}function h(){a.busy=e.logout().success(function(){a.userInfos=null,a.isLoggedIn=!1,c.go("home")})}var i=this;i.login=f,i.logout=h,g()}angular.module("locashopApp").controller("homeController",a),a.$inject=["$rootScope","$location","$state","notifier","homeService"]}(),function(){"use strict";function a(a){function b(){return a.get("/api/home/userInfos")}function c(){return a.get("/api/home/logout")}function d(b,c){return a.post("/api/home/login",{email:b,password:c})}var e={userInfos:b,logout:c,login:d};return e}angular.module("locashopApp").factory("homeService",a),a.$inject=["$http"]}(),function(){"use strict";function a(a,b,c){function d(){g.passwordEquals=g.user.password===g.user.passwordBis}function e(){g.busy=c.checkEmailAvailable(g.user.email).then(function(a){g.emailAvailable=a.data.checkEmailAvailable,g.userForm.email.$setValidity("notAvailable",g.emailAvailable)},function(){})}function f(){g.formSubmitted=!0,d(),g.passwordEquals&&g.userForm.$valid&&(g.busy=c.checkEmailAvailable(g.user.email).then(function(a){g.emailAvailable=a.data.checkEmailAvailable}).then(function(){g.userForm.$valid&&g.emailAvailable&&(g.loadingMessage="Inscription en base",g.busy=c.localSignup(g.user).then(function(){return g.loadingMessage="Envoi d'un email de vérification",c.emailVerification()}).then(function(){b.notify({template:"Nous vous avons envoyé un mail pour confirmer votre inscription"}),a.path("/")},function(){b.notify({template:"Nous n'avons pu vous envoyer un mail, veuillez contactez le support",type:"error"})}))}))}var g=this;g.passwordEquals=!0,g.emailAvailable=!0,g.loadingMessage="loading",g.formSubmitted=!1,g.checkPasswordEqual=d,g.checkEmailAvailable=e,g.localSignup=f}angular.module("locashopApp").controller("inscriptionController",a),a.$inject=["$location","notifier","inscriptionService"]}(),function(){"use strict";function a(a){function b(b){return a.post("/api/inscription/checkEmailAvailable",{email:b}).success(function(a){return console.log(a),a}).error(function(){})}function c(b){return a.post("/api/inscription/localSignup",b)}function d(){return a.get("/api/inscription/emailVerification")}var e={checkEmailAvailable:b,localSignup:c,emailVerification:d};return e}angular.module("locashopApp").factory("inscriptionService",a),a.$inject=["$http"]}(),function(){"use strict";function a(a,b,c){function d(){c.$apply(function(a){a.showModal=!a.showModal})}function e(){var b=new google.maps.LatLng(f.start.geometry.location.A,f.start.geometry.location.F),c=new google.maps.LatLng(f.arrival.geometry.location.A,f.arrival.geometry.location.F);a.calcRoute(b,c)}var f=this;f.place={},f.start={},f.arrival={},f.calcRoute=e,c.showModal=!1,b.$on("start_click",function(a,b){console.log("start_click"),f.start=b,d()}),b.$on("arrival_click",function(a,b){console.log("arrival_click"),f.arrival=b,d()}),a.init(b)}angular.module("locashopApp").controller("itineraireController",a),a.$inject=["Map","$rootScope","$scope"]}(),function(){"use strict";angular.module("locashopApp").service("Map",function(a){function b(a){var b=[],c=document.getElementById("pac-input-start"),d=document.getElementById("pac-input-arrival"),e=new google.maps.places.SearchBox(c),f=new google.maps.places.SearchBox(d),h={center:new google.maps.LatLng(40.7127837,-74.00594130000002),zoom:13,disableDefaultUI:!0};g.map=new google.maps.Map(document.getElementById("map"),h),g.places=new google.maps.places.PlacesService(g.map),google.maps.event.addListener(e,"places_changed",function(){var c=e.getPlaces();if(0!=c.length){for(var d,f=0;d=b[f];f++)d.setMap(null);b=[];for(var h,i=new google.maps.LatLngBounds,f=0;h=c[f];f++){console.log(h);var j={url:h.icon,size:new google.maps.Size(71,71),origin:new google.maps.Point(0,0),anchor:new google.maps.Point(17,34),scaledSize:new google.maps.Size(25,25)},d=new google.maps.Marker({map:g.map,icon:j,name:h.name,position:h.geometry.location,animation:google.maps.Animation.DROP}),k=h;google.maps.event.addListener(d,"click",function(){console.log("me"),console.log(k),a.$broadcast("start_click",k)}),b.push(d),i.extend(h.geometry.location)}g.map.fitBounds(i)}}),google.maps.event.addListener(f,"places_changed",function(){var c=f.getPlaces();if(0!=c.length){for(var d,e=0;d=b[e];e++)d.setMap(null);b=[];for(var h,i=new google.maps.LatLngBounds,e=0;h=c[e];e++){console.log(h);var j={url:h.icon,size:new google.maps.Size(71,71),origin:new google.maps.Point(0,0),anchor:new google.maps.Point(17,34),scaledSize:new google.maps.Size(25,25)},d=new google.maps.Marker({map:g.map,icon:j,name:h.name,position:h.geometry.location,animation:google.maps.Animation.DROP}),k=h;google.maps.event.addListener(d,"click",function(){console.log("me"),console.log(k),a.$broadcast("arrival_click",k)}),b.push(d),i.extend(h.geometry.location)}g.map.fitBounds(i)}}),google.maps.event.addListener(g.map,"bounds_changed",function(){g.map.getBounds()})}function c(a,b){var c=new google.maps.DirectionsRenderer;c.setMap(g.map);var d=new google.maps.DirectionsService,e={origin:a,destination:b,travelMode:google.maps.TravelMode.DRIVING};d.route(e,function(a,b){b==google.maps.DirectionsStatus.OK&&c.setDirections(a)})}function d(b){var c=a.defer();return g.places.textSearch({query:b},function(a,b){"OK"==b?c.resolve(a[0]):c.reject(b)}),c.promise}function e(a){g.marker&&g.marker.setMap(null),g.marker=new google.maps.Marker({map:g.map,position:a.geometry.location,animation:google.maps.Animation.DROP}),g.map.setCenter(a.geometry.location)}function f(){return g.current_marker}var g={init:b,search:d,addMarker:e,getCurrentMarker:f,calcRoute:c};return g})}(),function(){"use strict";function a(a){function b(a){e.scope=a,e.markers=[];var b=document.getElementById("pac-input"),d=new google.maps.places.SearchBox(b),f={center:new google.maps.LatLng(40.7127837,-74.00594130000002),zoom:13,disableDefaultUI:!0};e.map=new google.maps.Map(document.getElementById("map"),f),e.places=new google.maps.places.PlacesService(e.map),google.maps.event.addListener(d,"places_changed",function(){var a=d.getPlaces();if(0!=a.length){for(var b,f=0;b=e.markers[f];f++)b.setMap(null);e.markers=[],e.bounds=new google.maps.LatLngBounds;for(var g,f=0;g=a[f];f++)console.log(g),c(g,!0),e.markers.push(b),e.bounds.extend(g.geometry.location);e.map.fitBounds(e.bounds)}}),google.maps.event.addListener(e.map,"bounds_changed",function(){var a=e.map.getBounds();d.setBounds(a)}),console.log("carte charg�e")}function c(a,b){var c=new google.maps.Marker({map:e.map,name:a.name,position:a.geometry.location,animation:google.maps.Animation.DROP});if(b){var d=a;google.maps.event.addListener(c,"click",function(){e.scope.$broadcast("marker_click",d)})}console.log("ajout marker"),e.markers.push(c)}function d(){return e.current_marker}var e={init:b,addMarker:c,getCurrentMarker:d};return e}angular.module("locashopApp").service("MapsService",a),a.$inject=["$q"]}(),function(){"use strict";function a(a){var b={};return b.entity=a("/api/user/:id_user/mobile"),b.verify=a("/api/user/:id_user/mobile/verify"),b}angular.module("locashopApp").factory("mobileService",a),a.$inject=["$resource"]}(),function(){"use strict";function a(){function a(a,b,c){a.title=c.title,a.$watch(c.visible,function(a){$(b).modal(1==a?"show":"hide")}),$(b).on("shown.bs.modal",function(){a.$apply(function(a){a[c.visible]=!0})}),$(b).on("hidden.bs.modal",function(){a.$apply(function(a){a[c.visible]=!1})})}var b={template:'<div class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">{{ title }}</h4></div><div class="modal-body" ng-transclude></div></div></div></div>',restrict:"E",transclude:!0,replace:!0,scope:!1,link:a};return b}angular.module("locashopApp").directive("modal",a)}(),function(){"use strict";function a(a,b,c,d,e,f,g,h,i){function j(){c.showModal=!c.showModal}function k(){a.busy=m().then(function(){e.go("user.adresse")},function(a){h.notify({template:a,type:"error"})})}function l(){a.busy=i.get({id:d.id_user}).$promise.then(function(a){q.user=a,a.Photo&&(q.profilImage=a.Photo.chemin_webapp+"/"+a.Photo.uuid+".jpg")})["finally"](function(){q.initDone=!0})}function m(){var a=g.defer(),b=q.profilImageChanged?p(q.profilImage):!1,c={url:"/api/user/"+d.id_user,fields:{user:q.user},file:b};return f.upload(c).success(function(){a.resolve()}).error(function(b){console.log("pas bon"),a.reject("error : "+b)}),a.promise}function n(){if(q.files){console.log(q.files);var a=q.files[0],b=new FileReader;b.onload=function(a){c.$apply(function(){q.uploadedImage=a.target.result,c.showModal=!0})},b.readAsDataURL(a)}}function o(){q.profilImage=q.croppedImage,q.profilImageChanged=!0,j(),console.log(q.user)}function p(a){for(var b=atob(a.split(",")[1]),c=a.split(",")[0].split(":")[1].split(";")[0],d=[],e=0;e<b.length;e++)d.push(b.charCodeAt(e));return new Blob([new Uint8Array(d)],{type:c})}var q=this;q.uploadedImage="",q.croppedImage="",q.profilImage="",q.profilImageChanged=!1,q.saveProfil=k,q.upload=m,q.crop=n,q.dataURItoBlob=p,q.toggleModal=j,q.updateProfilImage=o,q.user={},q.initDone=!1,c.showModal=!1,l(),q.options={language:"en",allowedContent:!0,entities:!1},c.$watch("vmUserInfo.files",function(){q.crop()})}angular.module("locashopApp").controller("userInfoController",a),a.$inject=["$rootScope","$timeout","$scope","$stateParams","$state","$upload","$q","notifier","userService"]}(),function(){"use strict";function a(a,b,c,d,e,f,g,h){function i(){k(),l.editMode="read",console.log(l.place.formatted_address),l.user.Adresse.formatted_address=l.place.formatted_address,l.user.Adresse.latitude=l.place.geometry.location.lat(),l.user.Adresse.longitude=l.place.geometry.location.lng(),a.busy=l.user.Adresse.$save({id_user:c.id_user}).then(function(){d.go("user.mobile"),l.place_changed=!1})}function j(){g.init(a),a.busy=h.get({id_user:c.id_user}).$promise.then(function(a){if(l.user.Adresse=a,l.user.Adresse){l.editMode="read";var b=new google.maps.LatLng(l.user.Adresse.latitude,l.user.Adresse.longitude),c={name:l.user.Adresse.formatted_address,geometry:{location:b}};g.bounds=new google.maps.LatLngBounds,g.bounds.extend(b),g.addMarker(c,!1),g.map.fitBounds(g.bounds),g.map.setZoom(10)}})["catch"](function(){l.user.Adresse=new h,l.editMode="new"})["finally"](function(){l.initDone=!0})}function k(){e(function(){b.showModal=!b.showModal})}var l=this;b.showModal=!1,l.place_changed=!1,l.saveAdresse=i,l.editMode="edit",l.initDone=!1,l.place={},l.user={id_user:c.id_user,Adresse:{}},j(),a.$on("marker_click",function(a,b){console.log("marker_click"),l.place=b,k()})}angular.module("locashopApp").controller("userMapsController",a),a.$inject=["$rootScope","$scope","$stateParams","$state","$timeout","$http","MapsService","UserMapsService"]}(),function(){"use strict";function a(a){var b=a("/api/user/:id_user/adresse");return b}angular.module("locashopApp").factory("UserMapsService",a),a.$inject=["$resource"]}(),function(){"use strict";function a(a,b,c,d,e,f,g,h,i){function j(){var b=new i.entity({mobile:m.user.mobile});a.busy=b.$save({id_user:d.id_user}).then(function(){m.editMode="read",m.user.mobile_verified=!1})}function k(){var b=new i.verify({tokenEntered:m.tokenEntered});a.busy=b.$save({id_user:d.id_user}).then(function(a){m.user.mobile_verified=a.verify,m.editMode="read"})}function l(){a.busy=i.entity.get({id_user:d.id_user}).$promise.then(function(a){m.user=a,console.log(m.user),m.user.mobile&&(m.editMode="read")})["catch"](function(){m.user=new i.entity,m.editMode="new"})["finally"](function(){m.initDone=!0})}var m=this;m.user={},m.initDone=!1,m.editMode="edit",m.saveMobile=j,m.verifyMobile=k,m.tokenEntered="",l()}angular.module("locashopApp").controller("userMobileController",a),a.$inject=["$rootScope","$timeout","$scope","$stateParams","$state","$upload","$q","notifier","mobileService"]}(),function(){"use strict";function a(a){var b=a("/api/user/:id");return b}angular.module("locashopApp").factory("userService",a),a.$inject=["$resource"]}();