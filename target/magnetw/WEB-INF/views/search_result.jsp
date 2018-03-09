<%--
  Created by IntelliJ IDEA.
  User: dengyuhan
  Date: 2018/3/7
  Time: 14:18
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page isELIgnored="false" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<html>
<head>
    <%--<c:set var="contextpath" value="http://asset.dyhdyh.com/resources/magnetw"></c:set>--%>
    <c:set var="contextpath" value="resources"></c:set>
    <title>${keyword}</title>
    <link href="http://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.bootcss.com/Ladda/1.0.6/ladda.min.css" rel="stylesheet">
    <link href="${contextpath}/css/base.css" rel="stylesheet">
    <link href="${contextpath}/css/search_result.css" rel="stylesheet">
    <script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
    <script src="https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <script src="https://cdn.bootcss.com/bootstrap/3.2.0/js/button.min.js"></script>
    <script src="${contextpath}/js/search_result.js"></script>
</head>
<body>
<form method="get" id="form_search" hidden>
    <input id="form_keyword" value="${keyword}" name="keyword" type="hidden">
    <input id="form_page" value="${current_page}" name="page" type="hidden">
    <input id="form_site" value="${current_site}" name="site" type="hidden">
</form>

<div class="container container-margin-top">
    <div class="search_form">
        <div class="form-group">
            <div class="col-md-10" style="padding: 0px">
                <input class="form-control" placeholder="" id="keyword" name="keyword"
                       value="${keyword}">
            </div>
            <div class="col-md-2" style="padding-right: 0px;">
                <input class="btn btn-primary btn-block" type="submit" value="搜索" id="btn_search">
            </div>
        </div>
        <div class="btn-group  search_site" id="btn_site_group" data-toggle="buttons">
            <c:forEach items="${site_list}" var="site">
                <c:choose>
                    <c:when test="${current_site==site}">
                        <label class="btn btn-default active">
                            <input type="radio" name="site" autocomplete="off" value="${site}"
                                   checked>${site}
                        </label>
                    </c:when>
                    <c:otherwise>
                        <label class="btn btn-default">
                            <input type="radio" name="site" autocomplete="off"
                                   value="${site}">${site}
                        </label>
                    </c:otherwise>
                </c:choose>
            </c:forEach>
        </div>
    </div>
    <div class="container-margin-bottom">
        <div class="text-center" style="font-size: 22px" id="div_loading" hidden>
            加载中...
        </div>
        <table class="table table-bordered table-hover table-condensed" id="table_content">
            <tr id="tr_placeholder">
            </tr>
            <%--<tr id="tr_load_more">
                <td id="td_load_more" colspan="4" class="text-center">
                </td>
            </tr>--%>
        </table>

        <div hidden id="div_btn_request_page">
            <button class="ladda-button btn-block" data-style="expand-left" data-size="s"
                    id="btn_request_page" data-color="blue">点击加载更多
            </button>
        </div>
    </div>
</div>

<%--<div>
    <table class="table table-bordered table-hover table-condensed" id="table_content">
        <c:forEach items="${infos}" var="info">
            <tr>
                <td style="vertical-align:middle">${info.name}</td>
                <td class="td-center col-md-1" style="vertical-align:middle">${info.size}</td>
                <td class="td-center col-md-1"
                    style="vertical-align:middle">${info.resolution}</td>
                <td class="td-center td-count" style="vertical-align:middle">${info.count}</td>
            </tr>
        </c:forEach>
    </table>

    <form action="search" method="get" id="form_search_page">
        <input type="hidden" name="site" value="${current_site}"/>
        <input type="hidden" name="keyword" value="${keyword}"/>
        <input type="hidden" id="page" name="page" value="${current_page}"/>
        <nav>
            <ul class="pager search_result_pager">
                <c:if test="${current_page > 1}">
                    <li><a id="page_previous" class="td-page-action">上一页</a></li>
                </c:if>
                <li class="td-page-number">${current_page}</li>
                <li><a id="page_next" class="td-page-action">下一页</a></li>
            </ul>
        </nav>
    </form>
</div>--%>

</div>
<script src="https://cdn.bootcss.com/Ladda/1.0.6/ladda.jquery.min.js"></script>
<script src="https://cdn.bootcss.com/Ladda/1.0.6/spin.min.js"></script>
<script src="https://cdn.bootcss.com/Ladda/1.0.6/ladda.min.js"></script>
<script>
    Ladda.bind('#btn_request_page', {
        callback: function (instance) {
            requestSearch(function () {
                instance.stop()
            })
        }
    });
</script>
</body>
</html>
