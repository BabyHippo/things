 /****************************************
	Barebones Lightbox Template
	by Kyle Schaeffer
	kyleschaeffer.com
	* requires jQuery
****************************************/
jQuery.fn.highlight = function(pat) {
 function innerHighlight(node, pat) {
  var skip = 0;
  if (node.nodeType == 3) {
   var pos = node.data.toUpperCase().indexOf(pat);
   if (pos >= 0) {
    var spannode = document.createElement('span');
    spannode.className = 'highlight';
    var middlebit = node.splitText(pos);
    var endbit = middlebit.splitText(pat.length);
    var middleclone = middlebit.cloneNode(true);
    spannode.appendChild(middleclone);
    middlebit.parentNode.replaceChild(spannode, middlebit);
    skip = 1;
   }
  }
  else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
   for (var i = 0; i < node.childNodes.length; ++i) {
    i += innerHighlight(node.childNodes[i], pat);
   }
  }
  return skip;
 }
 return this.each(function() {
  innerHighlight(this, pat.toUpperCase());
 });
};

jQuery.fn.removeHighlight = function() {
 return this.find("span.highlight").each(function() {
  this.parentNode.firstChild.nodeName;
  with (this.parentNode) {
   replaceChild(this.firstChild, this);
   normalize();
  }
 }).end();
};
// display the lightbox
function lightbox(insertContent, ajaxContentUrl){

	// add lightbox/shadow <div/>'s if not previously added
	if($('#lightbox').size() == 0){
		var theLightbox = $('<div id="lightbox"/>');
		var theShadow = $('<div id="lightbox-shadow"/>');
		$(theShadow).click(function(e){
			closeLightbox();
		});
		$('body').append(theShadow);
		$('body').append(theLightbox);
	}

	// remove any previously added content
	$('#lightbox').empty();

	// insert HTML content
	if(insertContent != null){
		$('#lightbox').append(insertContent);
	}

	// insert AJAX content
	if(ajaxContentUrl != null){
		// temporarily add a "Loading..." message in the lightbox
		$('#lightbox').append('<p class="loading">Loading...</p>');

		// request AJAX content
		$.ajax({
			type: 'GET',
			url: ajaxContentUrl,
			success:function(data){
				// remove "Loading..." message and append AJAX content
				$('#lightbox').empty();
				$('#lightbox').append(data);
			},
			error:function(){
				alert('AJAX Failure!');
			}
		});
	}

	// move the lightbox to the current window top + 100px
	$('#lightbox').css('top', $(window).scrollTop() + 100 + 'px');

	// display the lightbox
	$('#lightbox').show();
	$('#lightbox-shadow').show();

}

// close the lightbox
function closeLightbox(){

	// hide lightbox and shadow <div/>'s
	$('#lightbox').hide();
	$('#lightbox-shadow').hide();

	// remove contents of lightbox in case a video or other content is actively playing
	$('#lightbox').empty();
}

var globalTimeout = null;
var xhr;
function searchThings(){
    lightbox('<div id="gridloading" class="site-loading"><h2 style="text-align: center">Loading please wait: </h2><p>(press esc to stop loading, or click anyware in the gray)<p><div id="loadingimage"></div></div>');
    $("#things").removeHighlight();
    globalTimeout = null; 
    $grid = $('#things');

    if( $("#input").val().length > 0){
        xhr = $.ajax({
            url: '/api/things/search/' + $("#input").val(),
            dataType: 'json',
            async: true,
            success: function(features) {
                if($grid.length > 0 && $grid.data().kendoGrid) {
                    var thisKendoGrid = $grid.data().kendoGrid;

                    if(thisKendoGrid.dataSource) {//}&& thisKendoGrid._refreshHandler) {
                        //thisKendoGrid.dataSource.unbind(CHANGE, thisKendoGrid._refreshHandler);
                        $grid.removeData('kendoGrid');
                        $grid.empty();
                    }
                }
                $("#things").kendoGrid({
                    columns: features[0],
                    dataSource: { data: features[1] },
                    resizable: true,
                    scrollable: {
                        virtual: true
                    },
                    sortable: true
                });

                closeLightbox();
                $('#things').show();
                jQuery.each($("#input").val().split(" "), function(idx, val) { jQuery('#things').highlight(val); });
                //$('#things').highlight();
            },
            error: function(jqXHR, exception) {
                if(jqXHR.status === 0) {
                    // alert('Not connect.\n Verify Network.');
                } else if(jqXHR.status == 404) {
                    alert('Requested page not found. [404]');
                } else if(jqXHR.status == 500) {
                    alert('Internal Server Error [500].');
                } else if(exception === 'parsererror') {
                    alert('Requested JSON parse failed.');
                } else if(exception === 'timeout') {
                    alert('Time out error.');
                } else if(exception === 'abort') {
                    alert('Ajax request aborted.');
                } else {
                    alert('Uncaught Error.\n' + jqXHR.responseText);
                }
                closeLightbox();
            }
        });
    };

}

$(document).ready(function() {
    $("#input").bind('keyup change', function(e) {
        if(!($.isEmptyObject(xhr))) {
            xhr.abort();

        }
        if(e.which == 27) {
            this.value = "";
            $('#things').hide();
            return;
            closeLightbox();
        }

        if(e.which == 13) {
            searchThings()
            clearTimeout(globalTimeout);
        } else {
            if(globalTimeout != null) clearTimeout(globalTimeout);
            globalTimeout = setTimeout(function() { searchThings() }, 1000);
        }
    });

    $('#things').hide();
}); 
