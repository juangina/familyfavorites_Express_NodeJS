$(document).ready(() =>{

const _reset = document.getElementById('_reset');
const _hint = document.getElementById('_hint');
 
_reset.addEventListener('click', () => {
  if(_hint.style.display === 'block'){
    _hint.style.display = 'none';
  }
  });

  $('.hint-box').on('click', () => {
    $('.hint').slideToggle(500);
  });


  $('.wrong-answer-one').on('click', () => {
    $('.wrong-text-one').fadeOut(500);
    $('.emoticon').hide();
    $('.frown').show();
  });
  $('.wrong-answer-two').on('click', () => {
    $('.wrong-text-two').fadeOut(500);
    $('.emoticon').hide();
    $('.frown').show();
  }); 
  $('.wrong-answer-three').on('click', () => {
    $('.wrong-text-three').fadeOut(500);
    $('.emoticon').hide();
    $('.frown').show();
  });   
  $('.wrong-answer-four').on('click', () => {
    $('.wrong-text-four').fadeOut(500);
    $('.emoticon').hide();
    $('.frown').show();
  }); 



 $('.correct-answer').on('click', () => {
    $('.frown').hide();
    $('.emoticon').hide();
    $('.smiley').show();
    $('.wrong-text-one').fadeOut(500);
    $('.wrong-text-two').fadeOut(500);
    $('.wrong-text-three').fadeOut(500);
    $('.wrong-text-four').fadeOut(500);
  });



  $('.reset-box').on('click', () => {
    $('.frown').hide();
    $('.smiley').hide();
    $('.emoticon').show();
    $('.wrong-text-one').show();
    $('.wrong-text-two').show();
    $('.wrong-text-three').show();
    $('.wrong-text-four').show();

  });






});