function generateSlideshowBoxes($contentWrapper){
   var imagesList = getBooksInCatFromLocal('SlideShow');
   var booksInfo = getBooksInfo(imagesList);
      
   
      
   console.log($contentWrapper);
   
   
   $($contentWrapper).html('');
   
   
   $.each(booksInfo, function(key, imageId){
      
      var $priceElement;
      
      if(imageId.oldPrice == 0){
         $priceElement = '<span class="finalPrice">Rs.' + imageId.finalPrice+'/-</span>';
      } else{
         $priceElement = '<span class="oldPrice">Rs.' + imageId.oldPrice+'/-</span>'+
                        '<span class="newPrice">Rs.' + imageId.newPrice+'/-</span>';
      }
      
      var htmlContent = ''+
         '<li>'+
            '<div class="slideContent">'+
               '<p class="slideImage">'+
                  '<img src="images/books/thumbs/' + imageId.id + '.jpg" width="146" height="110" draggable="true" id="' + imageId.id + '" ondragstart="return dragDefine(event)" ondragend="dragEnd(event)"/>'+
               '</p>'+
               '<h3 class="slideBookName bookName">'+
                  imageId.name+
               '</h3>'+
               '<h4 class="slideAuthor bookAuthor">'+
                  'By '+ imageId.author +
               '</h4>'+
               $priceElement+ 
               '<a href="#" class="buyButton">'+
                  '<img src="images/cart.png" />'+
               '</a>'+
            '</div>'+
         '</li>';
         
         $($contentWrapper).append(htmlContent);
   });
}


function generateProductThumbBoxes($sectionWrapper, category){
   
   var imagesList = getBooksInCatFromLocal(category);
   var booksInfo = getBooksInfo(imagesList);
   
   $sectionWrapper = $($sectionWrapper).children('.boxContent');
   
   console.log(imagesList, booksInfo, $sectionWrapper, category);
   
   //$($sectionWrapper).children('.boxHeader').text(category);
   
   //var $contentWrapper = $($sectionWrapper).children('.bookWrapper');
   
   //$($contentWrapper).html('');
      
   
   var htmlContent = '<h2 class="boxHeader">'+category+'</h2><ul class="bookWrapper">';
   
   
   $.each(booksInfo, function(key, imageId){
      
      var $priceElement;
      
      if(imageId.oldPrice == 0){
         $priceElement = '<span class="finalPrice">Rs.' + imageId.finalPrice+'/-</span>';
      } else{
         $priceElement = '<span class="oldPrice">Rs.' + imageId.oldPrice+'/-</span>'+
                        '<span class="newPrice">Rs.' + imageId.newPrice+'/-</span>';
      }
      
      htmlContent += ''+
         '<li>' + 
            '<p class="bookThumb">' + 
               '<img src="images/books/thumbs/'+imageId.id+'.jpg" width="146" height="110" draggable="true" id="'+imageId.id+'" ondragstart="return dragDefine(event)" ondragend="dragEnd(event)"/>'+
            '</p>'+
            '<h3 class="bookName">' +
               imageId.name + 
            '</h3>' + 
            '<h4 class="bookAuthor">' + 
               imageId.author + 
            '</h4>' + 
            $priceElement+ 
            '<a href="#" class="buyButton">'+
                  '<img src="images/cart.png" />'+
               '</a>'+
         '</li>'; 
         
   });
   htmlContent += '</ul>';
   
   //$($sectionWrapper).html(htmlContent);
   $($sectionWrapper).append(htmlContent);
}

function generateSearchResult($sectionWrapper, bookName){

   var htmlContent = '<h2 class="boxHeader">Search Results</h2><ul class="bookWrapper">';
   
   var $priceElement;
      
   if(bookName.oldPrice == 0){
      $priceElement = '<span class="finalPrice">Rs.' + bookName.finalPrice+'/-</span>';
   } else{
      $priceElement = '<span class="oldPrice">Rs.' + bookName.oldPrice+'/-</span>'+
                      '<span class="newPrice">Rs.' + bookName.newPrice+'/-</span>';
   }

   htmlContent += ''+
         '<li>' + 
            '<p class="bookThumb">' + 
               '<img src="images/books/thumbs/'+bookName.id+'.jpg" width="146" height="110" draggable="true" id="'+bookName.id+'" ondragstart="return dragDefine(event)" ondragend="dragEnd(event)"/>'+
            '</p>'+
            '<h3 class="bookName">' +
               bookName.name + 
            '</h3>' + 
            '<h4 class="bookAuthor">' + 
               bookName.author + 
            '</h4>' + 
            $priceElement+ 
            '<a href="#" class="buyButton">'+
                '<img src="images/cart.png" />'+
            '</a>'+
         '</li></ul>';   
   
   $($sectionWrapper).append(htmlContent);
 
}