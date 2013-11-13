// this file can show the {photo_size} photos
// <img/> is dynamically created

var photo_size=100;

function print_img(size){
  var str="";
  for(var i=0;i<size;i++){
    str+='<div>';
    str+='<img id=\"photo'+(i+1).toString()+'\" />';
    str+='<div id=\"from'+(i+1).toString()+'\">'+'</div>';
    str+='<div id=\"tag'+(i+1).toString()+'\">'+'</div>';
    str+='<div id=\"link'+(i+1).toString()+'\">'+'</div>';
    str+='</div>';
  }
  return str;
}

function createDiv()
    {
        var divTag = document.createElement("div");
        
        divTag.id = "div_img";
        
        divTag.setAttribute("align","center");
        
        divTag.style.margin = "0px auto";
        
        divTag.className ="dynamicDiv";
        
        divTag.innerHTML = print_img(photo_size);
        
        document.body.appendChild(divTag);

    }
var access_token;
window.fbAsyncInit = function() {
  FB.init({
        appId      : 'xxxx', // App ID
        channelUrl : 'xxxx', // Channel File
        status     : true, // check login status
        cookie     : true, // enable cookies to allow the server to access the session
        xfbml      : true, // parse XFBML
        oauth      : true
      });

  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      
      testAPI();

      access_token = response.authResponse.accessToken;
      
      // var img_url="xxxx";
      // var text="beautiful scene3";
      // post_photo_from_url(img_url, text);
      
      createDiv();
      get_photos();
    } else if (response.status === 'not_authorized') {
      facebookLogin();
    } else {
      facebookLogin();
    }
  });
};

// Load the SDK asynchronously
(function(d){
 var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
 if (d.getElementById(id)) {return;}
 js = d.createElement('script'); js.id = id; js.async = true;
 js.src = "//connect.facebook.net/en_US/all.js";
 ref.parentNode.insertBefore(js, ref);
}(document));


function testAPI() {
  console.log('Welcome!  Fetching your information.... ');
  FB.api('/me', function(user) {
    if(user != null) {
        var image = document.getElementById('image');
        image.src = 'http://graph.facebook.com/' + user.id + '/picture';
        var name = document.getElementById('name');
        name.innerHTML = user.name;
        var email= document.getElementById('email');
        email.innerHTML= user.email;
    }
  });
}
function post_photo_from_url(img_url, text){
  FB.api("/me/photos", 'post', { access_token:access_token, message: text, url: img_url, privacy: {"value":"SELF"}}, function(response) {
    if (!response || response.error) {
      alert('Fail!');
    }else{
      alert('Success! Post ID: ' + response);
    }
 
  });
}

function fileUpload() {
  FB.api('/me/albums', function(response) {
    var album = response.data[0]; // Now, upload the image to first found album for easiness.
    var action_url = 'https://graph.facebook.com/' + album.id + '/photos?access_token=' +  access_token + "&privacy={'value':'SELF'}";
    alert(action_url);
    var form = document.getElementById('upload-photo-form');
    form.setAttribute('action', action_url);

    // This does not work because of security reasons. Choose the local file manually.
    // var file = document.getElementById('upload-photo-form-file');
    // file.setAttribute('value', "/Users/nseo/Desktop/test_title_03.gif")

    form.submit();
  });
}

function get_photos(){
  var url = '/me/photos?fields=source, tags.fields(name), link, place, from';
  FB.api(url, {limit:photo_size}, function(response){
    if(!response || response.error){
      alert('Error occured: '+response.error.message);
    }else{
      //alert(response.data.length);
      var len=response.data.length;
      for (var i=0;i<len;i++){
        //PHOTO FROM:
        var from=response.data[i].from.name;
        var from_str='from'+(i+1).toString();
        var from_div=document.getElementById(from_str);
        from_div.innerHTML="from: "+from;

        //PHOTO SRC:
        var tmp=response.data[i].source;
        var str='photo'+(i+1).toString();
        var photo=document.getElementById(str);
        photo.src=tmp;
        
        //TAG:
        var tag_str='tag'+(i+1).toString();
        var tag_div=document.getElementById(tag_str);
        var tag_len=response.data[i].tags.data.length;
        var tag_list="";
        for(var j=0;j<tag_len;j++){
          var tag=response.data[i].tags.data[j].name;
          //alert(tag);
          if(tag!=from){
            tag_list+=tag;
          }
        }

        //LINK:
        var link=response.data[i].link;
        var link_str='link'+(i+1).toString();
        var link_div=document.getElementById(link_str);
        link_div.innerHTML=link;

        //PLACE:
        if(response.data[i].place!=null){
          var place=response.data[i].place.name;
          tag_list+=place;
        }

        tag_div.innerHTML=tag_list;

        
        

        
      }
    }
  });    
}

function facebookLogin()
{
  FB.login(function(response){

    }, {scope: 'email,publish_actions,user_photos,friends_photos'});
}

function facebookLogout()
{
  FB.logout();
}

function print_photos(){
  for (var i=0;i<my_phpotos.length;i++){
    document.write(my_phpotos[i]+"--");
  }
}

document.writeln("Welcome to Photo Viewer!!");