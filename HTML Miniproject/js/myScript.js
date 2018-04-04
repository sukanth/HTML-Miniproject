var cartButtonHeight, cartButtonWidth, headerHeight;
jQuery(function ($) {

   // Initialize the store medium
   _initStorage();
   
   initializeCart();
   
   var possibleBooks = [];
   var possibleAuthor= [];		
			
    $.each(booksInfo.Books, function(key, val){			
        possibleBooks.push(val.name);		
    });
   
    $.each(booksInfo.Books,function(key, val){
        possibleBooks.push(val.author);
    });
            
    $("#txtSearchField").autocompleteArray(possibleBooks);		
   
   updateCartCount();

   cartButtonHeight = $('#cartButton').height();
   cartButtonWidth = $('#cartButton').width();
   headerHeight = $('#headerWrapper').height();


   $('#leftNavWrapper > ul > li').click(function (e) {      
      var $childUL = $(this).children('ul');      
      if ($($childUL).is(":visible")) {
         slideUpLeftNav(this);
      } else {
         slideDownLeftNav(this);
      }
   });

   // Sticky Header
   $(window).scroll(function (e) {
      if ($(window).scrollTop() > $('#headerWrapper').height()) {
         $('#loginWrapper').addClass('stickyLoginWrapper');
         $('#loginContentWrapper').addClass('stickyLoginContentWrapper');
         $('#loginContent').addClass('stickyLoginContent');
      } else {
         $('#loginWrapper').removeClass('stickyLoginWrapper');
         $('#loginContentWrapper').removeClass('stickyLoginContentWrapper');
         $('#loginContent').removeClass('stickyLoginContent');
      }
   });
   
      
   // Activate the Category
   var selectedCategory = window.location.href.replace(/^.*\?cat=/,''); // Parse GET url
   var $selectedLI = $("#leftNavWrapper ul li ul li:contains('"+selectedCategory+"')");
   var $selectedParentLI = $($selectedLI).parent().parent();
   slideDownLeftNav($selectedParentLI);
   $($selectedLI).css({'background':'#17C5D5'});
   $($selectedLI).children('a').css({'color':'white'});
   
   
    // Should call to validate the input and calculate grand totals
    $('#shoppingCart ').on("blur", ":text", function(event){
   
   
            var $priceElementTd = $(this).parent().next().next();
            var quantity =$(this).val().replace(/\D/gi, '');
        
            //console.log(event.which);
      
      
            quantity = parseInt(quantity);
      
      
            if(isNaN(parseInt(quantity)) || (quantity <= 0)){
                quantity = 1;         
            }
      
            $(this).val(quantity);
      
            //update in localStorage
            var bookId = $(this).parent().prev().prev().prev().prev().text();
            //console.log($(this), bookId, quantity);
            shoppingCart.books[bookId] ={"count": quantity};
            localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
      
            // calculate the price      
            var price = $priceElementTd.text().split("Rs.")[1].split("/-")[0];
            cost = quantity * price;
      
            $priceElementTd.next().text("Rs."+cost+"/-");  
      
            calculateGrandTotal();
            updateCartCount();
        
    });
   
   
   
   $('#shoppingCart .checkOutButton').click(function(e){
		e.preventDefault();
		if(isUserLoggedIn()){			
			location.href="finalcart.html";
		} else {
			$('#shoppingCart').fadeOut('slow',function(){showDialogBox('loginBox');});
		}
   });
   
   $('.deleteProduct').live('click', function(){
      delete shoppingCart.books[$(this).parent().prev().prev().text()];
      //$(this).parent().parent().remove();
      localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
      
      generateCartTable();
      calculateGrandTotal();
      updateCartCount();
   });
   
    
    $('.buyButton').live('click', function(e){   
        
        e.preventDefault();    
        
        addBookToCart($($(this).parent().children()[0]).children().attr('id'));
        updateCartCount();
        showDialogBox('shoppingCart');        
        
    });
    
    $('ul.bookWrapper li').live('mouseenter', function(){
        $(this).animate({'margin-top':20, 'margin-bottom':10});
    });
    
    $('ul.bookWrapper li').live('mouseleave', function(){
        $(this).animate({'margin-top':30, 'margin-bottom':0});
    });

});


function slideDownLeftNav($target){
   $($target).children('ul').slideDown("slow");   
   $($target).children('span.navHeader').addClass('leftNavActive');
}

function slideUpLeftNav($target){
   $($target).children('ul').slideUp("slow");
   $($target).children('span.navHeader').removeClass('leftNavActive');
}

var dragStarted = false;

function dragDefine(ev) {

   console.log("Drag Started");
   
   dragStarted = true;
   
   expandDropTarget();

   ev.dataTransfer.effectAllowed = 'move';
   ev.dataTransfer.setData("text/plain", ev.target.id);
   ev.dataTransfer.setDragImage(ev.target, 0, 0);
   return true;
}

function dragOver(ev) {
   console.log("Drag Over");
   ev.preventDefault();
}

function dragEnd(ev) {
   console.log("Drag End");   
   
   contractDropTarget();
   
   return true;
}

function dragDrop(ev) {

    var bookId = ev.dataTransfer.getData("text/plain");
    console.log("Drag Drop");
   
   
    ev.preventDefault();
   
    contractDropTarget();       
   
    if(dragStarted){
        dragStarted = false;
        addBookToCart(ev.dataTransfer.getData("text/plain"));
        updateCartCount();
        showDialogBox('shoppingCart');  
    }
    
}


function contractDropTarget(){
   $('#cartButton').html("Drop Item Here <br/> Cart: " + productsCount);
   $('#cartButton').animate({
      'width': cartButtonWidth,
      'height': cartButtonHeight,
      'font-size':10
   });
}

function expandDropTarget(){
   //$('#cartButton').html('<span style="font-size:12px; overflow:hidden;">Drop Item Here</span>');
   $('#cartButton').animate({
      'width': 180,
      'height': 50,      
      'font-size':15
   }, 500 );
}

function addBookToCart( bookId){
   
   //initializeCart();
   
   if(shoppingCart.books.hasOwnProperty(bookId)){
      shoppingCart.books[bookId].count++;
   } else {
      shoppingCart.books[bookId] ={"count": 1};
   }
   
   localStorage.setItem("shoppingCart",JSON.stringify(shoppingCart));
   
   generateCartTable();
}

function initializeCart(){
   var stringified = JSON.stringify({"books":{}});
   
   if(localStorage.hasOwnProperty("shoppingCart")){
      stringified = localStorage.getItem("shoppingCart");
   }
   
   shoppingCart = JSON.parse(stringified);
   
   updateCartCount();

}

function generateCartTable(){

   //initializeCart();

   //Create table   
   $("#shoppedProducts table tr:not(:first)").remove();
   var tableHtml = "";
   var index = 1;
   var total = 0;
   $.each(shoppingCart.books, function(id, value){
      var currentBook = getBookInfo(id);
      var currentBookPrice = getBookFinalPrice(id);
      total += currentBookPrice * value.count;
      tableHtml += "<tr>"+
                     "<td style='display:none;'>"+id+"</td>"+
                     "<td>"+index+"</td>"+
                     "<td style='border-right:none;'><span class='deleteProduct'></span></td>" + 
                     "<td style='border-left:none; text-align:left;'><span style='text-align:left; display:inline-block;width:200px;'>"+currentBook.name+"</span></td>"+
                     "<td  style='padding:5px 0 5px 10px; border-right:none;'>"+
                     "   <input type='text' value='"+value.count+"'/>"+
                     "</td>"+
                     "<td style='padding:5px 5px 5px 5px; border-right:none; border-left:none; font-size:15px'>"+
                     "   &#215;"+
                     "</td>"+
                     "<td style='padding:5px 10px 5px 0; border-left:none;'>"+
                     "   <span> Rs."+currentBookPrice+"/- </span>"+
                     "</td>"+
                     "<td>"+
                     "   Rs."+(currentBookPrice * value.count)+"/-"+
                     "</td>"+
                  "</tr>";
      index++;
   });
   
   tableHtml += "<tr><td style='display:none;'>&nbsp</td><td style='border:none;'>&nbsp;</td><td  style='border:none;'>&nbsp;</td><td  style='border:none;'>&nbsp;</td><td colspan='3' style='text-align:right;'>Total</td><td>Rs."+total+"/-</td></tr>";
   
   $("#shoppedProducts table tr:first").after(tableHtml);
}

function calculateGrandTotal(){
   var total = 0;
   $('#shoppedProducts tr td:last-child:not(":last")').each(function (key, val){
      console.log(getEncodedPrice($(val).text()));
      total +=parseInt(getEncodedPrice($(val).text()));
   });
   
   $('#shoppedProducts tr:last td:last').text("Rs."+total+"/-");
}

function getEncodedPrice(encodedPrice){
   return encodedPrice.split("Rs.")[1].split("/-")[0];
}

function updateCartCount(){
	productsCount = 0;
	
	$.each(shoppingCart.books, function(key, val){
		productsCount += val.count;
	});
	$('#cartButton').html('Drop Items Here <br/> Cart: ' + productsCount);
}