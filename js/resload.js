function resload(url, templateOrJsonContainer, objectName, contentType) // for loading js and css files, and html templates
{
	var prom = $.Deferred();
	if(typeof(templateOrJsonContainer)==='undefined') //it's a css or javascript
	{
		var b=url.split("?")[0];
		if(b.substr(b.lastIndexOf(".")+1).toLowerCase()=='js' || contentType=='js') //probably javascript
		{
			var script = document.createElement("script");
			script.async = "async";
			script.type = "text/javascript";
			script.src = url;
			script.onload = script.onreadystatechange = function (_, isAbort) {
			  	if (!script.readyState || /loaded|complete/.test(script.readyState)) {
			     	if (isAbort)
			     		prom.reject();
			      	else
			          	prom.resolve();
				}
			};
			script.onerror = function () { prom.reject(); };
			$("head")[0].appendChild(script);
		}
		else
		{
			loadStyleSheet( url, function( success, link) {
				if ( success ) {
			        prom.resolve();
				}
				else {
			        prom.resolve(); /* oh well, just css*/
				}
			});
		}
	} else { 									    //it's probably a html template or json
        $.get(url, function(templateOrJson){
            templateOrJsonContainer[objectName]=templateOrJson;
            prom.resolve();
        }).fail(function(error) {
            console.log(error);
            prom.reject();
        });            
    }
	
	//console.log(templateOrJsonContainer,objectName);
	return prom;
}

function rvtload(url, objectContainer, optionalObjectName)
{
	var parts = url.match(/(.*)\.(json|js|css|html)(.*)/i);
	
	if(parts.length>3)
	{
		if(typeof(_rvt_)=='undefined')
			_rvt_='--v1.'+Date.now();

		if(parts[2]=='html' && typeof(optionalObjectName)==='undefined') 
		{
			//if it's a template but no name given, give filename as name
			if(url.indexOf('/')=== -1)
				optionalObjectName=parts[1];
			else
				optionalObjectName=url.match(/.*\/(.*)\.html.*/i)[1];
		}
		if(parts[2]=='json' && typeof(optionalObjectName)==='undefined') 
		{
			//if no name for json result given, give filename as name
			if(url.indexOf('/')=== -1)
				optionalObjectName=parts[1];
			else
				optionalObjectName=url.match(/.*\/(.*)\.json.*/i)[1];
		}
		url=parts[1]+_rvt_+'.'+parts[2]+parts[3];
	}
	
	return resload(url,objectContainer,optionalObjectName);
}

//we have to do all this to ensure the stylesheet is applied (not just downloaded) before we resolve the promise, to ensure 
//http://stackoverflow.com/questions/5537622/dynamically-loading-css-file-using-javascript-with-callback-without-jquery
function loadStyleSheet( path, fn, scope ) {
    var head = document.getElementsByTagName( 'head' )[0], // reference to document.head for appending/ removing link nodes
         link = document.createElement( 'link' );              // create the link node
    link.setAttribute( 'href', path );
    link.setAttribute( 'rel', 'stylesheet' );
    link.setAttribute( 'type', 'text/css' );

    var sheet, cssRules;
	// get the correct properties to check for depending on the browser
    if ( 'sheet' in link ) {
        sheet = 'sheet'; cssRules = 'cssRules';
    }
    else {
        sheet = 'styleSheet'; cssRules = 'rules';
    }

    var logcss= window.location.hostname == "kcity" || window.location.hostname=='dev';
    var timeinterval_id, timeout_id;

    timeinterval_id = setInterval( function() {                            // start checking whether the style sheet has successfully loaded
		try {
			if ( link[sheet] && link[sheet][cssRules] && link[sheet][cssRules].length ) { // SUCCESS! our style sheet has loaded
			     clearInterval( timeinterval_id );                             // clear the counters
			     clearTimeout( timeout_id );
			     fn.call( scope || window, true, link );              // fire the callback with success == true
			     if(logcss)console.log('loaded css',link['href']);
			}
			if(link[sheet] && link[sheet][cssRules]==null)//cross origin/fallback
			{
			 	clearInterval( timeinterval_id );                             // clear the counters
                                clearTimeout( timeout_id );
			 	if (document.createStyleSheet)
			    	document.createStyleSheet(path);
				else
					$('<link rel="stylesheet" type="text/css" href="' + path + '" />').appendTo('head'); 
				fn.call( scope || window, true, link );
				if(logcss)console.log('loaded external css',link['href']);
			}
		} catch( e ) {
            if(e.code === 18) { 			 	
                clearInterval( timeinterval_id );                             // clear the counters
                clearTimeout( timeout_id );
                console.log('Assuming css loaded (Firefox blocks knowing):' + path);
                fn.call( scope || window, true, link );
            }
        } finally {}
	}, 5 );
                                                                     // how often to check if the stylesheet is loaded
    timeout_id = setTimeout( function() {         // start counting down till fail
		clearInterval( timeinterval_id );                 // clear the counters
		clearTimeout( timeout_id );
		head.removeChild( link );                     // since the style sheet didn't load, remove the link node from the DOM
		fn.call( scope || window, false, link ); // fire the callback with success == false
		if(logcss)console.log('failed to load css',link['href']);
	}, 15000 );                                            // how long to wait before failing

    head.appendChild( link );  // insert the link node into the DOM and start loading the style sheet

    return link; // return the link node;
}
