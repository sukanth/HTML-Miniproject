$(document).ready(function(){
   
   if(isUserLoggedIn()){
      showLoginDetails();
   } else {
      showLogoutDetails();
   }

   $('#mask').live('click', function () {
      hideDialogBox();
   });

   $('#cartButton').click(function () {
      showDialogBox('shoppingCart');
      return false;
   });
   
   $('#registerButton').click(function(e){
		if(!isUserLoggedIn()){
			showDialogBox('registerBox');
		} else {
			// show profile page;
		}
      e.preventDefault();
   });
   
   
   
   $('#headerWrapper .loginButton').click(function(e){
      e.preventDefault();
      if(!isUserLoggedIn()){
         showDialogBox('loginBox');
      } else {
         logout();
      }
      return false;
   });
   
   $("#loginBox .loginButton").click(function(e){
      e.preventDefault();
      
      var name = $('#loginBox :text').val();
      var password = $('#loginBox :password').val();
      
      if(isUserRegistered(name,password)){
         $('#loginBox .loginError').text("");
         
         hideDialogBox();
           
         localStorage.loggedIn = true;
         localStorage.loggedInAs = name;
         
         showLoginDetails();
         
      } else {
         $('#loginBox .loginError').text("Invalid User");
      }
   });
   
   $("#registerBox .registerButton").click(function(e){
		e.preventDefault();
		var userName = $('#txtNewUserName').val();
		var password = $('#txtNewPassword').val();
		var rePassword = $('#txtNewRePassword').val();
		
		if(userName.length == 0 || password.length == 0 || rePassword.length == 0){
			$('.registerError').text("All fields are mandatory");
			return;
		}else if(password != rePassword){
			$('.registerError').text("Passwords didn't match");
			return;
		} else {
			var regUsers={};
			if(localStorage.hasOwnProperty("users")){
				regUsers = JSON.parse(localStorage.getItem("users"));
				if(regUsers.hasOwnProperty(userName)){
					$('.registerError').text("Username not available");;
					return;
				}				
			}
			
			regUsers[userName] = password;
			localStorage.setItem("users", JSON.stringify(regUsers));
			
			alert("Registered Successfully");
			
			location.href="index.html";
			
			return;		
		}
   });
});

function showLoginDetails(){
   $('#userDetails').html('<span>Hi, </span><span style="color:#00DFFD; padding:0 10px 0 0;">'+localStorage.loggedInAs+'</span>');
         
   $('#registerButton').text("Profile");
   $('#headerWrapper .loginButton').text("Logout");
}

function showLogoutDetails(){
   $('#userDetails').html('');
         
   $('#registerButton').text("Register");
   $('#headerWrapper .loginButton').text("Login");
}


function logout(){
   localStorage.removeItem('loggedIn');
   localStorage.removeItem('loggedInAs');
   
   //showLogoutDetails();
   
   location.reload();
}


function initiaizeLoginDetails(){
   loginDetails = {"abc":"def","bhargav":"456"};
   
   if(localStorage.hasOwnProperty("users")){
      loginDetails = JSON.parse(localStorage.getItem("users"));
   } else {
      localStorage.setItem("users", JSON.stringify(loginDetails));
   }
}

function isUserRegistered(inputUsername, inputPassword){
   initiaizeLoginDetails();
   return (loginDetails[inputUsername] == inputPassword);
}

function isUserLoggedIn(){   
   return localStorage['loggedIn'];
}

function showDialogBox(elementId) {

   var $divElement = $('#'+elementId);
   var $dialogCloseButton = $($divElement).children('.dialogCloseButton');
   
   $($dialogCloseButton).click(function(){
      hideDialogBox();
   });
   
   var winH = $(window).height();
   var winW = $(window).width(); 
   
   $($divElement).css( {'top': (winH/2 - $($divElement).height()/2), 'left': (winW/2 - $($divElement).width()/2), } );

   
   $('body').css({
      'overflow': 'hidden'
   });
   $('#mask').fadeIn();
   $($divElement).fadeIn();
   $($divElement).addClass('showingDialog');
      
   $('.showingDialog :text').focus();
}

function hideDialogBox() {
   $('body').css({
      'overflow': 'auto'
   });
   
   $('.inputField').val('');
   $('.error').text('');
   
   $('#mask').fadeOut();
   $('.showingDialog').fadeOut();
}