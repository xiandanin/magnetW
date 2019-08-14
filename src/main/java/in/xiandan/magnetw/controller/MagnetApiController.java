package in.xiandan.magnetw.controller;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import in.xiandan.magnetw.config.ApplicationConfig;
import in.xiandan.magnetw.response.BaseResponse;
import in.xiandan.magnetw.response.MagnetItem;
import in.xiandan.magnetw.response.MagnetItemDetail;
import in.xiandan.magnetw.response.MagnetPageData;
import in.xiandan.magnetw.response.MagnetPageOption;
import in.xiandan.magnetw.response.MagnetRule;
import in.xiandan.magnetw.response.ReportData;
import in.xiandan.magnetw.response.ReportItem;
import in.xiandan.magnetw.service.MagnetRuleService;
import in.xiandan.magnetw.service.MagnetService;
import in.xiandan.magnetw.service.PermissionService;
import in.xiandan.magnetw.service.ReportService;

/**
 * created 2019/05/05 12:04
 */
@RestController
@RequestMapping("api")
public class MagnetApiController {
    @Autowired
    ApplicationConfig config;

    @Autowired
    PermissionService permissionService;

    @Autowired
    MagnetRuleService ruleService;

    @Autowired
    MagnetService magnetService;

    @Autowired
    ReportService reportService;

    private Logger logger = Logger.getLogger(getClass());


    /**
     * 获取源站列表
     *
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "source", method = RequestMethod.GET)
    public BaseResponse<List<MagnetRule>> source() throws Exception {
        List<MagnetRule> sites = ruleService.getSites();
        return BaseResponse.success(sites, String.format("%d个规则加载成功", sites.size()));
    }

    /**
     * 搜索
     *
     * @param request
     * @param source  源站名称
     * @param keyword 关键词
     * @param sort    排序
     * @param page    页码
     * @return
     * @throws Exception
     */
    @ResponseBody
    @RequestMapping(value = "search", method = RequestMethod.GET)
    public BaseResponse<MagnetPageData> search(HttpServletRequest request, @RequestParam(required = false) String source, @RequestParam(required = false) String keyword,
                                               @RequestParam(required = false) String sort, @RequestParam(required = false) Integer page) throws Exception {
        //是否需要屏蔽关键词
        if (config.reportEnabled && reportService.containsKeyword(keyword)) {
            logger.info("搜索结果被屏蔽--->" + keyword);
            return BaseResponse.error("搜索结果被屏蔽");
        }

        String userAgent = request.getHeader(HttpHeaders.USER_AGENT);

        //默认参数
        MagnetPageOption pageOption = magnetService.transformCurrentOption(source, keyword, sort, page);
        MagnetRule rule = ruleService.getRuleBySite(pageOption.getSite());

        List<MagnetItem> infos = new ArrayList<MagnetItem>();
        infos.addAll(magnetService.parser(rule, pageOption.getKeyword(), pageOption.getSort(), pageOption.getPage(), userAgent));
        int dataCount = infos.size();

        //是否需要屏蔽结果
        String supplement = "";
        if (config.reportEnabled) {
            List<MagnetItem> filterItems = new ArrayList<MagnetItem>();
            for (MagnetItem item : infos) {
                if (reportService.containsUrl(item.getMagnet())) {
                    filterItems.add(item);
                }
            }
            infos.removeAll(filterItems);
            if (filterItems.size() > 0) {
                supplement = String.format("，其中%d个被屏蔽", filterItems.size());
            }
        }

        MagnetPageData data = new MagnetPageData();
        data.setRule(rule);
        data.setTrackersString(ruleService.getTrackersString());
        //如果过期了就重新异步缓存Tracker服务器列表
        if (ruleService.isTrackersExpired()) {
            ruleService.reloadTrackers();
        }
        data.setCurrent(pageOption);
        data.setResults(infos);

        if (config.preloadEnabled && dataCount > 0) {
            magnetService.asyncPreloadNextPage(rule, pageOption, userAgent);
        }
        return BaseResponse.success(data, String.format("搜索到%d条结果%s", dataCount, supplement));
    }


    /**
     * 详情
     *
     * @param request
     * @param source    源站名称
     * @param detailUrl 源站详情url
     * @return
     * @throws Exception
     */
    @ResponseBody
    @RequestMapping(value = "detail", method = RequestMethod.GET)
    public BaseResponse<MagnetItemDetail> search(HttpServletRequest request, @RequestParam String source, @RequestParam("url") String detailUrl) throws Exception {
        String userAgent = request.getHeader(HttpHeaders.USER_AGENT);

        MagnetRule rule = ruleService.getRuleBySite(source);
        MagnetItemDetail detail = magnetService.parserDetail(detailUrl, rule, userAgent);
        return BaseResponse.success(detail, null);
    }

    /**
     * 举报
     *
     * @param name  名称
     * @param value 搜索关键词或磁力链
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "report", method = RequestMethod.POST)
    public BaseResponse<MagnetPageData> report(@RequestParam(required = false) String name, @RequestParam String value) {
        if (StringUtils.isEmpty(value)) {
            return BaseResponse.error("请输入关键词或磁力链");
        } else {
            try {
                reportService.put(name, value);
                return BaseResponse.success(null, "举报成功");
            } catch (Exception e) {
                return BaseResponse.error(e.getMessage());
            }

        }
    }

    @RequestMapping(value = "report-list")
    public BaseResponse<ReportData> reportList() throws Exception {
        List<ReportItem> keywords = reportService.getKeywordList();
        List<ReportItem> urls = reportService.getUrlList();
        ReportData data = new ReportData();
        data.setKeywords(keywords);
        data.setUrls(urls);
        int count = keywords.size() + urls.size();
        return BaseResponse.success(data, String.format("共%d条记录", count));
    }


}
