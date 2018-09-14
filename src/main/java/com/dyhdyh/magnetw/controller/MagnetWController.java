package com.dyhdyh.magnetw.controller;

import com.dyhdyh.magnetw.model.MagnetInfo;
import com.dyhdyh.magnetw.model.MagnetPageResponse;
import com.dyhdyh.magnetw.model.MagnetRule;
import com.dyhdyh.magnetw.service.MagnetWService;
import com.dyhdyh.magnetw.util.GsonUtil;
import com.google.gson.reflect.TypeToken;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.InputStream;
import java.net.SocketTimeoutException;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

/**
 * author  dengyuhan
 * created 2018/3/6 16:03
 */
@Controller
@RequestMapping("")
public class MagnetWController extends BaseController {

    @Autowired
    MagnetWService magnetWService;

    private Map<String, MagnetRule> magnetRuleMap;
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
        if (sites == null) {
            sites = new ArrayList<String>();
            Set<Map.Entry<String, MagnetRule>> entries = getMagnetRule().entrySet();
            for (Map.Entry<String, MagnetRule> entry : entries) {
                sites.add(entry.getKey());
            }
        }
        return sites;
    }

    /**
     * @param model
     * @param keyword
     * @param page
     * @return
     */
    @RequestMapping(value = "api/search", method = {RequestMethod.GET, RequestMethod.POST})
    @ResponseBody
    public MagnetPageResponse getSearchMagnetJson(Model model, HttpServletRequest request, @RequestParam(required = false) String source, @RequestParam(required = false) String keyword, @RequestParam(required = false) Integer page) {
        logger(request);
        MagnetPageResponse response = new MagnetPageResponse();
        List<MagnetInfo> infos = new ArrayList<MagnetInfo>();
        try {
            int newPage = magnetWService.transformPage(page);

            if (!StringUtils.isEmpty(keyword)) {
                MagnetRule rule = getMagnetRule().get(source);
                infos = magnetWService.parser(rule, keyword, newPage);
            }
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

    /**
     * 网站的筛选规则
     *
     * @return
     */
    private Map<String, MagnetRule> getMagnetRule() {
        if (magnetRuleMap == null) {
            magnetRuleMap = new LinkedHashMap<String, MagnetRule>();

            InputStream inputStream = getClass().getResourceAsStream("/rule.json");
            List<MagnetRule> rules = GsonUtil.fromJson(inputStream, new TypeToken<List<MagnetRule>>() {
            });
            StringBuffer log = new StringBuffer();
            for (MagnetRule rule : rules) {
                magnetRuleMap.put(rule.getSite(), rule);
                log.append("已加载网站规则--->" + rule.getSite() + " : " + rule.getUrl());
                log.append("\n");
            }
            log.append(magnetRuleMap.size() + "个网站规则加载成功");
            logger(log.toString());
        }
        return magnetRuleMap;
    }
}
