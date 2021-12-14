window.addEventListener("load", initialize, false);

var scanInterval = 1000;

function fetchAnchors() {
    var anchors = jQuery(".location-field-component--address");
    console.log("anchors why", anchors)
    replaceAnchors(anchors);

}

function replaceAnchors(anchors) {
    anchors.each(function () {
        // var phoneNo = $(this).attr('href').replace("callto:", "").replace("tel:", "");;
        // var linkNew="https://mergecall.com/call?to="+phoneNo;
        // $(this).attr('href', linkNew);
        // $(this).attr('target', '_blank');
        var url =$(this).text();
        console.log("dataatat",url)
        if(url){ 
            u =  "http://www.zillow.com/homes/"+url.toString().replace(',','').split(' ').join('-') +"_rb"
           $(this).after(`<a href=${u}>Zillow</a>` );
    }
         

    });
}

function initialize() {
    var jsInitChecktimer = setTimeout(function () {
        fetchAnchors();
    }, scanInterval);

    
}

