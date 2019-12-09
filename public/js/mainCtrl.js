 "use strict";

 angular.module("myApp")

     .controller('mainCtrl', function($rootScope, $window, $scope, $location, $state, $firebaseObject, $firebaseArray, $sce) {

         $scope.changeProfile = function(user) {
             if ($location.$$path == '/profile' && !user) {

                 $window.location.href = "/#/login";
             }
         }




         // Rootscopes
         $rootScope.filter = "all";

         // Firebase Reading
         let ref = database.ref("siteInfo");
         let siteInfo = $firebaseObject(ref);
         siteInfo.$bindTo($scope, 'siteInfo');


         // Firebase Reading
         let ref2 = database.ref("tickets");
         let tickets = $firebaseObject(ref2);
         tickets.$bindTo($scope, 'tickets');

         // Firebase Writing
         $scope.createSomething = function(name) {
             var newKey = firebase.database().ref().child('articles').push().key;
             database.ref("articles/" + newKey).set({
                 name: name,
             });
         }


         $scope.createProfile = function(newProfile, user) {

             // DATE OF BIRTH:
             var date = new Date(newProfile.bday);
             var day = date.getDate();
             var month = date.getMonth();
             var year = date.getFullYear();
             date = `${day}/${month}/${year}`;

             database.ref("users/" + user.uid).set({
                 fullName: newProfile.fullName,
                 description: newProfile.description,
                 bday: date,
                 subjects: newProfile.subjects,
                 photo: user.photoURL,
                 uid: user.uid

             });

             getProfile(user);

         }

         $scope.createTicket = function(newTicket, user) {

             var newKey = firebase.database().ref().child('tickets').push().key;

             var date = new Date(newTicket.deadline);
             var day = date.getDate();
             var month = date.getMonth();
             var year = date.getFullYear();
             date = `${day}/${month}/${year}`;

             database.ref("tickets/" + newKey).set({
                 ticketTitle: newTicket.title,
                 description: newTicket.description,
                 deadline: date,
                 subject: newTicket.subject,
                 uid: user.uid,
                 name: user.displayName,
                 email: user.email,
                 taken: false,
                 takenName: false,
                 takenEmail: false,
                 takenImage: false,
                 image: user.photoURL,
                 ticketKey: newKey,
                 completed: false
             });

         }

         $scope.deleteTicket = function(ticket, user) {
             database.ref("tickets/" + ticket.ticketKey).remove();

         }

         $scope.helpPerson = function(ticket, user) {
             database.ref("tickets/" + ticket.ticketKey).set({
                 ticketTitle: ticket.ticketTitle,
                 description: ticket.description,
                 deadline: ticket.deadline,
                 subject: ticket.subject,
                 uid: ticket.uid,
                 name: ticket.name,
                 email: ticket.email,
                 taken: true,
                 takenName: user.displayName,
                 takenEmail: user.email,
                 takenImage: user.photoURL,
                 takenUid: user.uid,
                 image: ticket.image,
                 ticketKey: ticket.ticketKey,
                 completed: false
             });
         }

         $scope.unHelpPerson = function(ticket, user) {
             database.ref("tickets/" + ticket.ticketKey).set({
                 ticketTitle: ticket.ticketTitle,
                 description: ticket.description,
                 deadline: ticket.deadline,
                 subject: ticket.subject,
                 uid: ticket.uid,
                 name: ticket.name,
                 email: ticket.email,
                 taken: false,
                 takenName: false,
                 takenEmail: false,
                 takenImage: false,
                 takenUid: false,
                 image: ticket.image,
                 ticketKey: ticket.ticketKey,
                 completed: false
             });
         }

         $scope.completeTicket = function(ticket, user) {
             var newKey = firebase.database().ref().child("users/" + ticket.takenUid + "/completed/").push().key;
             var newKey2 = firebase.database().ref().child("users/" + user.uid + "/finished/").push().key;

             database.ref("tickets/" + ticket.ticketKey).set({
                 ticketTitle: ticket.ticketTitle,
                 description: ticket.description,
                 deadline: ticket.deadline,
                 subject: ticket.subject,
                 uid: ticket.uid,
                 name: ticket.name,
                 email: ticket.email,
                 taken: true,
                 takenName: ticket.takenName,
                 takenEmail: ticket.takenEmail,
                 takenImage: ticket.takenImage,
                 takenUid: ticket.takenUid,
                 image: ticket.image,
                 ticketKey: ticket.ticketKey,
                 completed: true
             });
             // UPDATE helper with a completed task
             database.ref("users/" + ticket.takenUid + "/completed/" + newKey).set(ticket);
             // UPDATE user with a finished task
             database.ref("users/" + user.uid + "/finished/" + newKey2).set(ticket);
         }

         const getProfile = (user) => {
             console.log("workling")
             // Firebase Reading
             let ref = database.ref("users/" + user.uid);
             let profile = $firebaseObject(ref);
             $rootScope.profile = profile;
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
                 $rootScope.profile = profile;

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

         $scope.goFilter = function(subject) {
             $rootScope.filter = subject;
             window.location.replace("/#/tickets");
         }



     })