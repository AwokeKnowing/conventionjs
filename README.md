# conventionjs
Not sure you want to commit your soul to Angular (or similar)? You might like a convention (not framework) for HTML5/AJAX  web apps. 

What's the differece? A framework locks you in, and provides you limited ways to swap out functionality and components.  That's helpful if the framework does exactly what you want.  But if you're uneasy about getting locked into a framework, and are thinking about writing your code from "scratch", then what you need is a "convention" to follow.  A design pattern that will give you many of the benefits of a framework, while freeing you to write normal javascript/html5.

###Note: under development.
The repository is under development.  Soon we'll have a simple example, and a more in depth example.  The goal of this repository is to help you follow basic conventions for html5/ajax structure, leaving you free to replace each component with another library or code of your own.  You don't have to start with a big framework like Angular (nothing against frameworks), but you do need to build in enough structure to your code to make it grow well, and these are some conventions to follow.

#The convention

###HTML

```html
    <!doctype html>
    <html>
    <head>
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    </head>
    <body>
    </body>
      <script src="js/resload.js"></script>
      <script src="js/start.js"></script>
    </body>
    </html>
```
Each of your pages (if you're doing all single-page app, then only 1) will have this identical code.  If you have an index.html page, that will have the above code.  And by convention, to make an "about" page, you just copy this same code and call it `about.html`.  

###JS
You just need 2 things. First, put any resources that you need in start.js.  Second, create a template and js file for each page.

`js/start.js`
```js
  pageName=location.pathname.split('/').pop().split('.')[0]||'index';
  siteTpl={};
  $.when(
    resload('css/style.css'),
    resload('js/siteapi.js'),
    resload('js/sitecontroller.js'),
    resload('js/pages/'+pageName+'.js'),
    resload('templates/header.html', siteTpl),
    resload('templates/'+pageName+'.html', siteTpl),
    resload('templates/footer.html', siteTpl)
  ).then(function(){
        siteApi = new SiteApi();
        siteCtl = new SiteController(siteApi,siteTpl);
        siteCtl.renderPage(pageName);
  });
```

If you don't have any other libraries, json files, css files, then you don't need to change start.js at all.  So again, what it does is load your resources, then start up the sitecontroller and tell it to render the current page.

For each page in your site, you'll want an html template that has the main structure of your page, and a javascript file that will do any initialization, dynamica item insertion, and event handling for that page.  So for index.html in the root folder, we need to add:

- templates/index.html
- js/pages/index.js

If we're adding an about page, then (in addition to putting the about.html page with the landing page code), we need to add:

- templates/about.html
- js/pages/about.js

The code in start.js will take care of loading the right template and js file, by looking in the browser location to see which page it's on.

The html in templates/index.html can be as simple as

```html
    <div id="index-page">Hello World</div>
```

The code in js/pages/index.js could just be blank.  Generally, you will setup click handlers for all your items, as well as pull more data via ajax and build the page.

###sitecontroller
Now lets take a look at sitecontroller (loaded by start.js once resources are loaded).  It's job is to insert the header, insert the template for the current page, insert the footer, and wire up any site-wide events.

```js
var SiteController = (function () {
  function SiteController(api,templateContainer) {
    this.siteApi=api;
    this.tplContainer=templateContainer;
  }

  SiteController.prototype.renderPage = function (pageName){ 
  	var _this=this;
  	this.renderHeader(pageName);
  	$('body').append(this.tplContainer[pageName]);
  	this.renderFooter(pageName);
  	this.addSiteEvents();
  	this.siteApi.getSession().then(function(){
    $(document).trigger(pageName+'PageReady');
  };

  SiteController.prototype.renderHeader = function (pageName){ 
  	$('body').append(this.tplContainer.header);
  };

	SiteController.prototype.renderFooter = function (pageName){ 
		$('body').append(this.tplContainer.footer);
	};
  
  SiteController.prototype.addSiteEvents = function (){
  	var _this=this;
  	$(document).on('apiSessionUpdated',function(e){});
  	//add any events here that will happen o$(document).on('apiSessionUpdated',function(e){_this.updateHeaderItems()});$(document).on('apiSessionUpdated',function(e){_this.updateHeaderItems()});n all pages, such as menu clicks
  };
 
  return SiteController;
})();
```

###siteapi.js
Finally, you'll want some sort of site api to handle any loading/saving of data.  It should handle checking if the user is logged in, and giving you basic session information, and it should also be the gateway through which you load data.  So if you're loading data from twitter, you should make siteapi have a light wrapper around the twitter api.  That way you can use test data, and handle any twitter api changes without searching through your code for references to the api.

```js
var SiteApi = (function () {
  function SiteApi(initially) 
	{
		this._defaultsession={
			isLoggedIn:'',
		};
		this.session=$.extend({},this._defaultsession);
		this.json={}; 
	}
	
	SiteApi.prototype.getSession=function(){
		_this=this;
		var prom = $.Deferred();
		setTimeout(function(){//simulate getting data from somewhere (eg a $.post)
	    _this.session.isLoggedIn=true;
	    $(document).trigger('apiSessionUpdated');
		  prom.resolve();
	  },1000);
	
		return prom;
	};

	return SiteApi;
})();
```

### What you get
So again, what you have here is some boilerplate code, but it's written in a way that it separates each of the main things you'll need in your own awesome from scratch code, and lets you update them as needed, without feeling bound by a lot of framework-specific items.  

So in general, we think by convention you'll want the following in your html5/javascript app

-Simple "landing page" code that provides an entry point to your site/app
-Resource loader that handles css, js, json, and html, with asnc (promise) syntax
-Basic Site controller that handles putting the header and footer on each page, and loads page content templates
-No frills javascript files to run along with each page, adding events and data
-A siteapi (data provider) that your app will talk with for any data

Even if you don't use any code here, we want to provide you with a convention to follow, so that you build all the elements that you'll need (and not the ones you don't need!) into your initial design.
