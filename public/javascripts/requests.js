
$(document).ready(function() {
    $("form").submit(function(){
        alert("Submitted");
      });
    $('#send-button').on('click', function(e) {
      path = $('#path').val();
      if (path.charAt(0) === '/') {
        path = path.substring(1);
      }
      const method = $('#verb').val();
      if (method === 'POST' || method === 'PUT') {
        const body = {
          rank: $('#rank').val(),
          suit: $('#suit').val()
        };
        $.ajax({
          method: method,
          url: path,
          data: JSON.stringify(body),
          contentType: 'application/json',
          success: handleSuccess,
          error: function(jqxhr) {
            $('#status-code').text(jqxhr.status);
            $('#response-body').text('');
          }
        });
      } else {
        $.ajax({
          method: method,
          url: path,
          success: handleSuccess,
          error: function(jqxhr) {
            $('#status-code').text(jqxhr.status);
            $('#response-body').text('');
          }
        });
      }
      e.preventDefault();
    });    
  });
  
  function handleSuccess(response, status, jqxhr) {
    $('#status-code').text(jqxhr.status);
    $('#response-body').text(JSON.stringify(response, null, 4));
  }

  const myForm = document.getElementById('login-form');
  myForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const FormData = new FormData(this);
    fetch('/login', {
      method: 'post',
      body: FormData
    }).then(response => {
      return response.text();
    }).then(text => {
      console.log(text);
    }).catch( error => {
      console.log(error);
    })
  })




  

