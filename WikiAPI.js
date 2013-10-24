//Wikipedia API
$(function () {
 
    //Attaching Juqery UI autocompelete to text box
    $("#txt_search").autocomplete({
        source: function (request, response) {
            console.log(request.term);
            $.ajax({
                url: "http://en.wikipedia.org/w/api.php",
                dataType: "jsonp",
                data: {
                    'action': "opensearch",
                    'format': "json",
                    'search': request.term
                },
                success: function (data) {
                    response(data[1]);
                }
            });
        }
    });

    //Add click event to search button
    $("#btn_search").click(function () {

        var search_value = $("#txt_search").val();

        if (search_value) {

            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'http://en.wikipedia.org/w/api.php?format=json&action=query&titles=' + search_value + '&prop=revisions&rvprop=content&rvsection=0&rvparse=1&callback=parse_data'
            document.body.appendChild(script);

        }

    });

});

function parse_data(data) {



    var entry = data.query.pages
    var en

    for (var name in entry) {
        if (entry.hasOwnProperty(name)) {
            en = entry[name];
        }
    }
    var raw = en.revisions[0]

    //Get Type
    var page_type

    var el = $('<div></div>');
    var jHTML = $('<div/>').append(raw['*'])

    var description = jHTML.find('p').first().html();
    var tmp = document.createElement("DIV");
    tmp.innerHTML = description;

    var picture = jHTML.find('.vcard img:first').attr('src');

    var PageData = new Object();
    PageData.title = en.title;
    PageData.description = tmp.textContent || tmp.innerText || ""; ;
    PageData.picture = picture;
    PageData.year_start = 1969;
    PageData.year_end = 1969;

    //Change front end with new values
    $('.page-header').html('<h1>' + PageData.title + '</h1> <br/> ' + PageData.description + '')
    $(".jumbotron").attr("style", "background: url(" + picture + "); -webkit-background-size: cover; -moz-background-size: cover; -o-background-size: cover; background-size: cover;");
    $('#profile_image').attr("src", picture); 

};
