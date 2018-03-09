var keyword = getQueryString("keyword");
var site = getQueryString("site");
var page = getQueryString("page");

$(document).ready(function () {

    $('#keyword').bind('keypress', function (event) {
        if (event.keyCode == 13) {
            requestSearchPage()
        }
    });

    $("#btn_search").click(function () {
        requestSearchPage()
    });

    $("#disclaimer").click(function () {
        var content="本网站完全开源，仅用于技术交流学习，用户使用本工具进行的任何操作，本服务器均不保存。\n\n" +
            "本网站不会存储，不能分享，也不提供任何传播信息与资源的功能, 对此工具的非法使用概不负责。"
        alert(content)
    });

    $("input[name='site']").change(function () {
        requestSearchPage()
    });

    console.log(keyword)
    if (keyword != '') {
        requestSearchInit();
    }
});

var lastRequest = null;

function requestSearchPage() {
    var from_keyword = $('#keyword').val();
    var form_site = $("input[name='site']:checked").val();
    $('#form_keyword').val(from_keyword);
    $('#form_page').val(1);
    $('#form_site').val(form_site);

    $('#form_search').submit();
}

function requestSearchInit() {
    $('#table_content').find("tr[name='content']").remove();
    $('#div_loading').show();
    page = 1;
    requestSearch();
}

function requestSearch(stopLoading) {
    if (lastRequest !== null) {
        lastRequest.abort();
    }
    lastRequest = $.ajax({
        type: 'get',
        url: 'search-json',
        data: {site: site, keyword: keyword, page: page},
        dataType: 'json',
        success: function (reponse) {
            lastRequest = null;
            if (stopLoading != undefined) {
                stopLoading();
            }
            $('#div_loading').hide();
            if (reponse.length > 0) {
                $("#div_btn_request_page").show();
            } else {
                $("#div_btn_request_page").hide();
            }
            page = page + 1;
            for (var i = 0; i < reponse.length; i++) {
                var html = "<tr name='content'>" +
                    "<td style=\"vertical-align:middle\"><a href='" + reponse[i].magnet + "'>" + reponse[i].name + "</a></td>" +
                    "<td class=\"td-center col-md-1\" style=\"vertical-align:middle\">" +
                    reponse[i].size + "</td>" +
                    "<td class=\"td-center col-md-1\" style=\"vertical-align:middle\">" +
                    reponse[i].resolution + "</td>" +
                    "<td class=\"td-center td-count\" style=\"vertical-align:middle\">" +
                    reponse[i].count + "</td>" +
                    "</tr>"
                $("#tr_placeholder").before(html);
            }
        },
        error: function (xhr, type) {
            lastRequest = null;
            if (stopLoading != undefined) {
                stopLoading();
            }
            alert('出错了');
        }
    });
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    var context = "";
    if (r != null)
        context = r[2];
    reg = null;
    r = null;
    var str = context == null || context == "" || context == "undefined" ? "" : context;
    return decodeURI(str);
}
