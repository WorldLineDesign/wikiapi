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

    var PageData = new Object();
    PageData.id = "";
    PageData.title = "";
    PageData.description = "";
    PageData.picture = "";
    PageData.date = ""
    PageData.year_start = "";
    PageData.year_end = "";
    PageData.population = "";
    PageData.population_value = "";
    PageData.total_deaths = "";
    PageData.total = "";

    //Break down returned object
    var entry = data.query.pages

    //Get PageID
    var en
    for (var name in entry) {
        if (entry.hasOwnProperty(name)) {
            en = entry[name];
            PageData.id = en.pageid
        }
    }
    var raw = en.revisions[0]

    //Get Title
    PageData.title = en.title;

    //Get Type
    var page_type

    //Attach HTML or Text from API response to DOM, which 
    //allows you to serach with jquery as opposed to parsing HTML as a string.
    var el = $('<div></div>');
    var jHTML = $('<div/>').append(raw['*'])

    //Get Descripition
    PageData.description = jHTML.find('p').first().html();
    var tmp = document.createElement("DIV");
    tmp.innerHTML = PageData.description;
    PageData.description = tmp.textContent || tmp.innerText || "";

    //Get Image
    PageData.picture = jHTML.find('.vcard img:first').attr('src');
    if (!PageData.picture) {
        PageData.picture = jHTML.find('.vevent img:first').attr('src')
    }

    //Get Date
    PageData.date = jHTML.find('.vevent th:contains(Date)').next("td").html();
    var tmp2 = document.createElement("DIV");
    tmp2.innerHTML = PageData.date;
    PageData.date = tmp2.textContent || tmp2.innerText || "";


    //Get Population
    PageData.population = jHTML.find('th:contains(Population)').parent().next('tr').find('th:contains(City)').next('td').html();

    if (!PageData.population) {
        PageData.population = jHTML.find('th:contains(Population)').parent().next('tr').find('td:contains(census)').next('td').html()//.next('td').html();
    };
    if (!PageData.population) {
        PageData.population = jHTML.find('th:contains(Population)').parent().next('tr').next('tr').find('td:contains(census)').next('td').html()//.next('td').html();
    };
    if (!PageData.population) {
        PageData.population = jHTML.find('th:contains(Population)').parent().next('tr').find('td:contains(estimate)').next('td').html()//.next('td').html();
    }
    if (!PageData.population) {
        PageData.population = jHTML.find('th:contains(Population)').parent().next('tr').next('tr').find('td:contains(estimate)').next('td').html()//.next('td').html();
    }

    var tmp3 = document.createElement("DIV");
    tmp3.innerHTML = PageData.population;
    PageData.population = tmp3.textContent || tmp3.innerText || "";

    if (PageData.population.indexOf('(') !== -1) {
        PageData.population = PageData.population.substring(0, PageData.population.indexOf('('));
    }
    if (PageData.population.indexOf('[') !== -1) {
        PageData.population = PageData.population.substring(0, PageData.population.indexOf('['));
    }

    PageData.population = PageData.population.replace(' ', '').replace(',', '').replace(',', '').replace(',', '')
    PageData.population = Math.round(((Number(PageData.population) / 7046000000) * 1) * 100)








    //Change front end with new values
    $('.page-header').html('<h1>' + PageData.title + '</h1> <br/> ' + PageData.description + '')
    $(".jumbotron").attr("style", "background: url(" + PageData.picture + "); -webkit-background-size: cover; -moz-background-size: cover; -o-background-size: cover; background-size: cover;");
    $('#profile_image').attr("src", PageData.picture);
    $('#Profile').attr("class", "panel-collapse");
    $('#page_date').html(PageData.date);
    $('#page_population_progressbar').css('width', PageData.population)
};
