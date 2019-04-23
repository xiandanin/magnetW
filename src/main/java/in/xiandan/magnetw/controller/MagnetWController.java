package in.xiandan.magnetw.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.net.SocketTimeoutException;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import in.xiandan.magnetw.model.MagnetInfo;
import in.xiandan.magnetw.model.MagnetPageResponse;
import in.xiandan.magnetw.model.MagnetRule;
import in.xiandan.magnetw.service.MagnetRuleService;
import in.xiandan.magnetw.service.MagnetWService;

/**
 * author  dengyuhan
 * created 2018/3/6 16:03
 */
@Controller
@RequestMapping("")
public class MagnetWController extends BaseController {

    @Autowired
    MagnetRuleService ruleService;

    @Autowired
    MagnetWService magnetWService;

    private List<String> sites;

    @RequestMapping(value = "clear", method = RequestMethod.GET)
    public String clearCache(Model model) {
        magnetWService.clearListCache();
        return "列表缓存清空";
    }

    @RequestMapping(value = "", method = RequestMethod.GET)
    public String searchMagnetPage(Model model, HttpServletRequest request) {
        return "search_result";
    }

    /**
     * 获取源站信息
     *
     * @param model
     * @param request
     * @return
     */
    @RequestMapping(value = "api/source-site", method = {RequestMethod.GET, RequestMethod.POST})
    @ResponseBody
    public List<String> getMagnetSourceSiteList(Model model, HttpServletRequest request) {
        logger(request);
        return ruleService.getSites();
    }

    /**
     * @param model
     * @param keyword
     * @param page
     * @return
     */
    @RequestMapping(value = "api/search", method = {RequestMethod.GET, RequestMethod.POST})
    @ResponseBody
    public MagnetPageResponse getSearchMagnetJson(Model model, HttpServletRequest request, @RequestParam(required = false) String source, @RequestParam(required = false) String keyword, @RequestParam(required = false) String sort, @RequestParam(required = false) Integer page) {
        logger(request);
        MagnetPageResponse response = new MagnetPageResponse();
        List<MagnetInfo> infos = new ArrayList<MagnetInfo>();
        try {
            int newPage = magnetWService.transformPage(page);

            String newSort = StringUtils.isEmpty(sort) ? MagnetPageResponse.SORT_OPTION_DEFAULT : sort;
            if (!StringUtils.isEmpty(keyword)) {
                MagnetRule rule = ruleService.getRuleBySite(source);
                infos = magnetWService.parser(rule, keyword, newSort, newPage);
            }
            response.setCurrentSortOption(newSort);
            response.setCurrentPage(newPage);
            response.setCurrentSourceSite(source);
            response.setResults(infos);
        } catch (Exception e) {
            e.printStackTrace();
            if (e instanceof SocketTimeoutException || e instanceof UnknownHostException) {
                response.setErrorMessage("请求源站超时");
            } else {
                response.setErrorMessage("解析失败");
            }
        }
        return response;
    }

}
