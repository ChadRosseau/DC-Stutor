 "use strict";

 angular.module("myApp")

     .controller('mainCtrl', function($rootScope, $window, $scope, $location, $state, $firebaseObject, $firebaseArray, $sce) {
 
 		// Firebase Reading
     	let ref = database.ref("siteInfo");
        let siteInfo = $firebaseObject(ref);
        siteInfo.$bindTo($scope, 'siteInfo');


        // Firebase Writing
        $scope.createSomething = function(name) {
             var newKey = firebase.database().ref().child('articles').push().key;
             database.ref("articles/" + newKey).set({
             	name: name,


             });

        }

        // LOGIN
        var provider = new firebase.auth.GoogleAuthProvider();
        $scope.login = function() {
            firebase.auth().signInWithRedirect(provider);
            firebase.auth().getRedirectResult().then(function(result) {
              if (result.credential) {
                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = result.credential.accessToken;
                // ...
              }
              // The signed-in user info.
              var user = result.user;
             


            }).catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              // ...
            });
        }
        // CREATE USER
        $scope.createUser = function(newUser) {
             var user = firebase.auth().currentUser;
             var dob = newUser.dob;
             var email = newUser.email;
             firebase.database().ref('users/' + user.uid).set({
                 fullName: newUser.fullName,
                 dob: dob,
                 email: email,
                 role: "user"
             });
         }


        // CHECK USER
         var user = firebase.auth().currentUser;
         firebase.auth().onAuthStateChanged(function(user) {
             if (user) {
                 console.log("I'm logged in!");
                 $rootScope.user = user;

                 let ref = database.ref("users/" + user.uid);
                 let profile = $firebaseObject(ref);
                 $scope.profile = profile;

             } else {
                 console.log("No user");
             }
         });

         // LOGOUT
         $scope.logout = function() {
             firebase.auth().signOut().then(function() {
                 console.log("Signed out");
                 $rootScope.user = null;
                 $state.go("home");
             }).catch(function(error) {
                 console.log("Not signed out");
             });
         }

         // Login page
         $scope.createProfileFormSwitch = function() {
            document.getElementById("createProfilePrompt").style.display = "none";
            document.getElementById("profileForm").style.display = "flex";

         }



     })