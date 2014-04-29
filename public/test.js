window.getUser = function(data){
  $.get('/user', data, function(err, user){
    console.log(err)
    console.log(user)
  });
};

window.postUser = function(data){
  $.post('/user', data, function(err, user){
    console.log(err)
    console.log(user)
  });
};

window.deleteUser = function(data){
  $.ajax({
    url: '/user',
    data: data,
    type: 'DELETE'
    })
  .done(function(err, user){
    console.log(err)
    console.log(user)
  });
};

window.retrieveStack = function(data){
  $.get('/userStack', data, function(err, user){
    console.log(err)
    console.log(user)
  });
};

window.reject = function(data){
  $.post('/userStack/reject', data, function(err, user){
    console.log(err)
    console.log(user)
  });
};

window.approve = function(data){
  $.post('/userStack/approve', data, function(err, user){
    console.log(err)
    console.log(user)
  });
};

window.sendMsg = function(data){
  $.post('/conversations/one', data, function(err, user){
    console.log(err)
    console.log(user)
  });
};

window.getAllMsg = function(data){
  $.get('/conversations/all', data, function(err, user){
    console.log(err)
    console.log(user)
  });
};

window.getOneMsg = function(data){
  $.get('/conversations/one', data, function(err, user){
    console.log(err)
    console.log(user)
  });
};

