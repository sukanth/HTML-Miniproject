var shoppingCart;
var productsCount;

var loggedIn = false;
var loggedInAs = "";
var loginDetails;

var categoryInfo;
var booksInfo;

/*
 * Rule:    If oldPrice is 0, newPrice should also be 0 and finalPrice is considered,
 *        else if oldPrice is not 0, newPrice should not be 0 and finalPrice is ignored
 *
 * Possible Categories:
 *    slideShow                 law                         mechanical             italian
 *    bestSellers               medicine                    ageLt3                 chinese
 *    recentReleases            engineering                 ageBtw48              
 *    fiction                   commerce                    ageBtw912
 *    romance                   computer                    india
 *    thriller                  electrical                  abroad
 *    social                    electronics                 traditional
 *
 * Template: {'id':, 'name':'', 'category':'', 'author':'', 'description':'',  'oldPrice':, 'newPrice':, 'finalPrice':, 'slideshow':, 'priority': }
 */
var _categoryInfo={
   "Categories": {
      "Novels": {
         "Fiction": [
            {"id":"1"},
            {"id":"2"}
         ],
         "Romance": [
            {"id":"3"},
            {"id":"4"}
         ],
         "Thriller": [
            {"id":"5"},
            {"id":"6"},
         ],
         "Social": [
            {"id":"2"},
            {"id":"5"},
         ]
      },
      "Academic": {
         "Law": [
            {"id":"6"},
            {"id":"4"}
         ],
         "Medicine": [
            {"id":"1"},
            {"id":"3"}
         ],
         "Engineering": [
            {"id":"2"},
            {"id":"5"}
         ],
         "Commerce": [
            {"id":"1"},
            {"id":"6"}
         ]
      },
      "Technical": {
         "Computer": [
            {"id":"2"},
            {"id":"3"}
         ],
         "Electrical": [
            {"id":"4"},
            {"id":"5"}
         ],
         "Electronics": [
            {"id":"1"},
            {"id":"6"}
         ],
         "Mechanical": [
            {"id":"5"},
            {"id":"4"}
         ]
      },
      "Children": {
         "Age3": [
            {"id":"3"},
            {"id":"2"}
         ],
         "Age48": [
            {"id":"1"},
            {"id":"4"}
         ],
         "Age912": [
            {"id":"5"},
            {"id":"6"}
         ],
         "Comics": [
            {"id":"2"},
            {"id":"3"}
         ]
      },
      "Technical": {
         "Computer": [
            {"id":"5"},
            {"id":"1"}
         ],
         "Electrical": [
            {"id":"2"},
            {"id":"4"}
         ],
         "Electronics": [
            {"id":"3"},
            {"id":"6"}
         ],
         "Mechanical": [
            {"id":"1"},
            {"id":"4"}
         ]
      },
      "Travel": {
         "India": [
            {"id":"3"},
            {"id":"2"}
         ],
         "Abroad": [
            {"id":"1"},
            {"id":"4"}
         ]         
      },
      "Cooking": {
         "Traditional": [
            {"id":"2"},
            {"id":"4"}
         ],
         "Italian": [
            {"id":"1"},
            {"id":"5"}
         ],
         "Chinese": [
            {"id":"3"},
            {"id":"5"}
         ]
      },
      "SlideShow": [
         {"id":"1"},
         {"id":"2"},
         {"id":"3"},
         {"id":"4"},
         {"id":"5"},
         {"id":"6"}
      ],
      "BestSelling": [
         {"id":"1"},
         {"id":"2"},
         {"id":"3"}
      ],
      "RecentRelease": [
         {"id":"6"},
         {"id":"2"},
         {"id":"4"}
      ]
   }
};

var _booksInfo={
   "Books":[
      {"id":"1", "name":"Linux-How To Crack The Job", "author":"Genius G Bhargav", "description":"Basics of Linux", "oldPrice":249, "newPrice":220, "finalPrice":220},
      {"id":"2", "name":"Corn Fact Book From Americas Family", "author":"Mark C Muthu", "description":"Real Facts About Corn", "oldPrice":549, "newPrice":450, "finalPrice":449},
      {"id":"3", "name":"Heal Your Mind, Rewire Your Brain", "author":"Patt Lind-Kyle", "description":"Motivative", "oldPrice":0, "newPrice":7, "finalPrice":349},
      {"id":"4", "name":"Keys To The Da Vinci Code", "author":"Lorenzo Fernandez", "description":"Scientific And Mysterious Facts", "oldPrice":400, "newPrice":356, "finalPrice":356},
      {"id":"5", "name":"Entity FrameWork Tutorial", "author":"Joydip Kanjilal", "description":"Framework Quick Learn", "oldPrice":560, "newPrice":320, "finalPrice":320},
      {"id":"6", "name":"Groovy and Grails Recipies", "author":"Bashar Abdul Jawad", "description":"Tasty Recipies", "oldPrice":300, "newPrice":235, "finalPrice":235}
   ]  
};    

/*
 * checks whether localStorage is supported or not
 *
 * returns: true/false
 */
 
function isLocalStorageSupported(){
   if(window.localStorage)
      return true;
   else
      return false;
}


/*
 * Initialize the storage medium
 *
 */
function _initStorage(){
   // Get the type of storage to use
   // storageUsing =_typeOfStorageToUse();
   storageUsing = isLocalStorageSupported() ? "localStorage" : "";
   
   if(storageUsing == 'localStorage'){ // If the storage is localStorage
      _saveCategoriesToLocalStorage();
      _saveBooksToLocalStorate();
      
      _getCategoriesFromLocalStorage();
      _getBooksFromLocalStorage();
      
   } 
   
}

/*
 * Saves Category into LocalStorage
 */
function _saveCategoriesToLocalStorage(){   
   var stringified = JSON.stringify(_categoryInfo);
   
   if(!localStorage.categoryInfo || (localStorage.categoryInfo != stringified)){
      console.log("categoryInfo not found in localStorage... So creating a new categoryInfo");
      var categoryInfoString = stringified;
      localStorage.setItem('categoryInfo', categoryInfoString);
   } else {
      console.log("localStorage already has categoryInfo");
   }
}

/*
 * Saves Books to localStorage
 */
function _saveBooksToLocalStorate(){   
   var stringified = JSON.stringify(_booksInfo);
   if(!localStorage.booksInfo || (localStorage.booksInfo != stringified)){
      console.log("booksInfo not found in localStorage... So creating a new booksInfo");
      var booksInfoString = stringified;
      localStorage.setItem('booksInfo', booksInfoString);
   } else {
      console.log("localStorage already has booksInfo");
   }
}

/*
 * Get Categories from localStorage
 */
function _getCategoriesFromLocalStorage(){
   var fromLocalStorage = localStorage.getItem('categoryInfo');
   categoryInfo = JSON.parse(localStorage.getItem('categoryInfo'));
}

/*
 * Get Books from localStorage
 */
function _getBooksFromLocalStorage(){
   var fromLocalStorage = localStorage.getItem('booksInfo');
   booksInfo = JSON.parse(localStorage.getItem('booksInfo'));
}


/*
 * Get the books in a particular category from localStorage
 *
 * params: required category name
 */
function getBooksInCatFromLocal(reqCategory){
   var booksListInCat = new Array();

   $.each(categoryInfo.Categories, function(key, val){ _recurseFind(key, val, reqCategory, booksListInCat);});
   
   return booksListInCat;
}

function _recurseFind(key, val, reqCategory, booksListInCat){
   if(val instanceof Object){      
      if( key != reqCategory){
         $.each(val, function(key, val){
            _recurseFind(key, val, reqCategory, booksListInCat);
         });
      } else {
         $.each(val, function(key,val){
            booksListInCat.push(val.id);
         });
      }
   }
}

/*
 *
 */
function getBooksInfo(booksId){
   var selectedBooksInfo = [];
   $.each(booksId, function(i, selectedBookId){
      $.each(booksInfo.Books, function(j, currentBook){
         if(selectedBookId == currentBook.id){
            selectedBooksInfo.push(currentBook);
         }
      });
   });
   return selectedBooksInfo;
}

function getBookInfo(bookId){
   var bookInfo = {};
   
   $.each(booksInfo.Books, function(j, currentBook){
      if(bookId == currentBook.id){
         bookInfo=currentBook;
      }
   });
   
   return bookInfo;
}

function getBookFinalPrice(bookId){
   var price = 0;
   $.each(booksInfo.Books, function(j, currentBook){
      if(bookId == currentBook.id){
         if(currentBook.oldPrice == 0){
            price = currentBook.finalPrice;
         } else {
            price = currentBook.newPrice;
         }
      }
   });
   return price;
}

function isValidBookId(bookId){
    var validity = false;
    
    $.each(booksInfo.Books, function(key, bookInfo){
        if(bookInfo.id == bookId){
            validity = true;
        }
    });
    
    return validity;
}