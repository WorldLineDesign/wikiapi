//Wikipedia API
$(function () {

    //Add Jquery UI Autocomplete & Handle Enter Key
    var search_box = $("#txt_search");
    search_box.autocomplete({
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
    })
   .keyup(function (event) {
       if (event.keyCode == 13) {

           if (search_box.val()) {
               loading();
               get_data(search_box.val());
           }
       }

   });

    //Add click event to search button
    $("#btn_search").click(function () {

        var search_value = $("#txt_search").val();
        if (search_value) {
            loading();
            get_data(search_value);
        }

    });

});





function get_data(search_term) {


    if (search_term) {
      
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'http://en.wikipedia.org/w/api.php?format=json&action=query&titles=' + search_term + '&prop=revisions&rvprop=content&rvsection=0&rvparse=1&callback=parse_data'
        document.body.appendChild(script);

    }

};
function parse_data(data) {

    function parse_bits() { 
    
    
    
    
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
    };
    if (!PageData.population) {
        PageData.population = jHTML.find('th:contains(Population)').parent().next('tr').next('tr').find('td:contains(estimate)').next('td').html()//.next('td').html();
    };
    if (!PageData.population) {
        PageData.population = jHTML.find('th:contains(Population)').parent().next('tr').find('th:contains(Total)').next('td').html()//.next('td').html();
    }
    if (!PageData.population) {
        PageData.population = jHTML.find('th:contains(Population)').parent().next('tr').next('tr').find('td:contains(Total)').next('td').html()//.next('td').html();
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
    PageData.population_value = PageData.population;
    PageData.population = Math.round(((Number(PageData.population) / 7046000000) * 1) * 100)

    return PageData

};
    var PageData = parse_bits();


    //Your custom code:
    $('#page_title').html(PageData.title)
    $(".jumbotron").attr("style", "background: url(" + PageData.picture + "); -webkit-background-size: cover; -moz-background-size: cover; -o-background-size: cover; background-size: cover;");
    $('#profile_image').attr("src", PageData.picture);
    $('#Profile').attr("class", "panel-collapse");
    $('#page_date').html(PageData.date);
    $('#page_population_progressbar').css('width', PageData.population)
    $('#Description').html(PageData.description);
    $('#population_number').html(PageData.population_value);
    $('#description_header').html('Description');
};


function loading() {

    $('#page_title').html('<img src="http://www.calgaryparking.com/html/themes/CPA_09/images/progress_bar/loading_animation.gif" /> Loading')
    $('#Profile').attr("class", "panel-collapse collapse");
    $('#Description').attr("class", "panel-collapse collapse")
    $('#description_header').html('');
}

