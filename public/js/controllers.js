function ChatController($rootScope, $scope, Users, Messages, $cookies){
    $scope.users = Users.query();
    $scope.receiver = "";
    $scope.newMessage = "";
    $scope.activeReceiver = "";
    $scope.isSignedIn=false;
    $scope.messages = Messages.query({id:$scope.user+"-"+$scope.receiver});

    $scope.onSignIn = function(){
        console.log($scope.user);
        Users.query({id:$scope.user}); // this will create new users
        var ws = new WebSocket("wss://localhost/updates/"+$scope.user);
        ws.onopen = function(){
            console.log("Socket has been opened!");
            ws.send(1);
        };

        ws.onmessage = function(message) {
            console.log("new message");
            $scope.users = Users.query();
            $scope.messages = Messages.query(
                {id:$scope.user+"-"+$scope.receiver},
                function(){
                    setTimeout(function(){
                        $('.bubble-wrap').scrollTop($('.bubble-wrap').height()*2.5);
                    },400);
                }
            );
        };
    }

    $scope.signOut = function(){
        console.log("Signing Out");
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            window.location.reload();
        });
    }

    $scope.getDate = function(time){
        sentDate = new Date(parseInt(time,10));
        return sentDate.getFullYear()+"-"+sentDate.getMonth()+"-"+sentDate.getDate()+" "+sentDate.getHours()+":"+sentDate.getMinutes()+":"+sentDate.getSeconds();
    }

    $scope.Send = function(){
        if($scope.newMessage==""){
            return;
        }
        newMessage = new Messages({id:$scope.receiver,From:$scope.user,Name:$scope.receiver,Body:$scope.newMessage,Time:Date.now().toString()});
        newMessage.$save();
        $scope.newMessage = "";
    }

    $scope.changeActiveResponder = function(user){
        $scope.receiver=user.username;
        $scope.activeReceiver=user.username;
        $scope.messages = Messages.query(
            {id:$scope.user+"-"+user.username},
            function(){
                setTimeout(function(){
                    $('.bubble-wrap').scrollTop($('.bubble-wrap').height()*2.5);
                },400);
            }
        );
    }
}

function onSignIn(googleUser){
    var auth2 = gapi.auth2.getAuthInstance();
    if (auth2.isSignedIn.get()) {
        console.log("signedin")
        var profile = auth2.currentUser.get().getBasicProfile();
        console.log('ID: ' + profile.getId());
        console.log('Full Name: ' + profile.getName());
        console.log('Given Name: ' + profile.getGivenName());
        console.log('Family Name: ' + profile.getFamilyName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());

        var scope = angular.element(document.getElementById('wrapper')).scope();
        scope.user=profile.getGivenName();
        scope.isSignedIn=true;
        scope.$apply();
        scope.onSignIn();
    }
}

function onLoadCallback(){
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.isSignedIn.listen(onSignIn());
    window.setTimeout(function(){
        //auth2.signIn();
    },1000);
}
