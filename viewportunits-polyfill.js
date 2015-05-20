document.body.onload = function() {

	function isIos() {
        if (!navigator.userAgent.match(/iPhone|iPad|iPod/i))
        	return false;
        var version = navigator.userAgent.match(/version\/([0-9])/i)[1];
    	return version < 8;
    }

    function isBadSafari() {
    	if (!navigator.userAgent.match(/safari/i))
    		return false;
    	var version = navigator.userAgent.match(/version\/([0-9])/i)[1];
    	return version < 8;
    }

    if (!isIos() && !isBadSafari())
    	return;

	function forall(array, f) {
		for (var i=0 ; i<array.length ; i++)
			f(array[i]);
	}
	function httpGet(url, callback) {
		var xhr = new XMLHttpRequest();
		
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
				callback(xhr.responseText);
			}
		};
		
		xhr.open('GET', url, true);
		xhr.send(null);
	}

	var width = getWidth();
	var height = getHeight();

	var styleSheets = document.querySelectorAll('head link[rel="stylesheet"][vunit-fix]');
	var styleTags = document.querySelectorAll('head style[vunit-fix]');
	var savedCss = [];

	forall(styleTags, function(styleTag) {
		savedCss.push({node:styleTag, text:styleTag.innerHTML});
	});
	handleResize();

	forall(styleSheets, function(styleSheet) {
		(function(styleSheet){
			var url = styleSheet.getAttribute('href');
			httpGet(url, function(data) {
				var cssText = data;
				var fixedCssText = replaceVUnits(cssText);
				var cssStyle = document.createElement('style');
				cssStyle.innerHTML = fixedCssText;
				document.head.insertBefore(cssStyle, styleSheet);
				document.head.removeChild(styleSheet);
				savedCss.push({node:cssStyle, text:cssText});
			});
		})(styleSheet);
	});

	window.setInterval(checkResize, 100);
	window.addEventListener('resize', handleResize);
	window.addEventListener('orientationchange', handleResize);

	function checkResize() {
		var currentWidth = getWidth();
		var currentHeight = getHeight();
		if (width != currentWidth || height != currentHeight) {
			width = currentWidth;
			height = currentHeight;
			console.log('not the same size');
			handleResize();
		}
	}

	function handleResize() {
		forall(savedCss, function(css) {
			css.node.innerHTML = replaceVUnits(css.text);
		});
	}

	function replaceVUnits(cssText) {
		cssText = cssText.replace(/([0-9]+vw)/gi, function(match, n) {
		  var value = parseInt(n);
		  value = Math.round((value*width)/100);
		  return value + 'px';
		});
		cssText = cssText.replace(/([0-9]+vh)/gi, function(match, n) {
		  var value = parseInt(n);
		  value = Math.round((value*height)/100);
		  return value + 'px';
		});
		cssText = cssText.replace(/([0-9]+vmin)/gi, function(match, n) {
		  var value = parseInt(n);
		  var min = Math.min(width, height);
		  value = Math.round((value*min)/100);
		  return value + 'px';
		});
		cssText = cssText.replace(/([0-9]+vmax)/gi, function(match, n) {
		  var value = parseInt(n);
		  var max = Math.max(width, height);
		  value = Math.round((value*max)/100);
		  return value + 'px';
		});
		return cssText;
	}

	function getWidth() {
		return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	}
	function getHeight() {
		return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	}

}