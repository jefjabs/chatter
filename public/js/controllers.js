function ChatController($rootScope, $scope, Users, Messages){
    $scope.users = Users.query();
    $scope.user = prompt("Please enter your username");
    Users.query({id:$scope.user});
    $scope.receiver = "";
    $scope.newMessage = "";
    $scope.activeReceiver = "";
    $scope.messages = Messages.query({id:$scope.user+"-"+$scope.receiver});

    var ws = new WebSocket("ws://localhost:8080/updates/jeff");
    ws.onopen = function(){
        console.log("Socket has been opened!");
    };

    ws.onmessage = function(message) {
        console.log(message);
    };

    $scope.Send = function(){
        newMessage = new Messages({id:$scope.receiver,From:$scope.user,Name:$scope.receiver,Body:$scope.newMessage,Time:Date.now().toString()});
        newMessage.$save();
        $scope.messages = Messages.query(
            {id:$scope.user+"-"+$scope.receiver},
            function(){
                $('.bubble-wrap').scrollTop($('.bubble-wrap').height()*2.5);
            }
        );
        $scope.newMessage = "";
        setTimeout(function(){
            $('.bubble-wrap').scrollTop($('.bubble-wrap').height()*2.5);
        },400);
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
