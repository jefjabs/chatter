function ChatController($rootScope, $scope, Users, Messages, $cookies){
    $scope.users = Users.query();
    username = $cookies.get("username");
    $scope.user = (username == "" || username == undefined)?prompt("Please enter your username"):username;
    $cookies.put("username",$scope.user);
    Users.query({id:$scope.user}); // this will create new users
    $scope.receiver = "";
    $scope.newMessage = "";
    $scope.activeReceiver = "";
    $scope.messages = Messages.query({id:$scope.user+"-"+$scope.receiver});

    var ws = new WebSocket("ws://localhost:8080/updates/"+$scope.user);
    ws.onopen = function(){
        console.log("Socket has been opened!");
        ws.send(1);
    };

    ws.onmessage = function(message) {
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
