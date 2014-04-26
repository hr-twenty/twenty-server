window.test = function(data){
  $.get('/user', data, function(err, user){
    console.log(err)
    console.log(user)
  });
};

window.test2 = function(data){
  $.post('/user', data, function(err, user){
    console.log(err)
    console.log(user)
  });
};