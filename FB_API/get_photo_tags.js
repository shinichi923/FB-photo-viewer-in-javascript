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

window.fbAsyncInit = function() {
  FB.init({
        appId      : '361824873952147', // App ID
        channelUrl : '//people.cs.nctu.edu.tw/~stlin/channel.html', // Channel File
        status     : true, // check login status
        cookie     : true, // enable cookies to allow the server to access the session
        xfbml      : true, // parse XFBML
        oauth      : true
      });

  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      createDiv();
      testAPI();
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