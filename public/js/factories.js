function UsersFactory($resource){
    return $resource('users/:id',{id:'@id'}, {
        query  : {
            method:'GET',
            isArray:true
        },
    });
}

function MessageFactory($resource){
    return $resource('messages/:id', {id:'@id'}, {
        query  : {
            method:'GET',
            isArray:true
        },
        save   : {
            method:'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }
    });
}
