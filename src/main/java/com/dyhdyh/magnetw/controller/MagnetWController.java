package com.dyhdyh.magnetw.controller;

import com.dyhdyh.magnetw.model.MagnetInfo;
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


    /**
     * 搜索
     *
     * @param model
     * @param site
     * @param keyword
     * @param page
     * @return
     */
    @RequestMapping(value = {"/", "search"}, method = RequestMethod.GET)
    public String submitSearchMagnet(Model model, HttpServletRequest request, @RequestParam(required = false) String site, @RequestParam(required = false) String keyword, @RequestParam(required = false) Integer page) {
        logger(request);
        try {
            List<String> siteNames = getSiteNames();
            if (StringUtils.isEmpty(site)) {
                site = siteNames.get(0);
            }
            int newPage = magnetWService.transformPage(page);
            //model.addAttribute("title", String.format("%s - %s", site, keyword));
            model.addAttribute("current_site", site);
            model.addAttribute("keyword", keyword);
            model.addAttribute("current_page", newPage);
            model.addAttribute("site_list", siteNames);
            return "search_result";
        } catch (Exception e) {
            return error(model, e);
        }
    }


    /**
     * @param model
     * @param site
     * @param keyword
     * @param page
     * @return
     */
    @RequestMapping(value = "search-json", method = {RequestMethod.GET, RequestMethod.POST})
    @ResponseBody
    public List<MagnetInfo> submitSearchMagnetJson(Model model, HttpServletRequest request, @RequestParam(required = false) String site, @RequestParam(required = false) String keyword, @RequestParam(required = false) Integer page) {
        logger(request);
        try {
            List<String> siteNames = getSiteNames();
            if (StringUtils.isEmpty(site)) {
                site = siteNames.get(0);
            }
            List<MagnetInfo> infos = null;
            int newPage = magnetWService.transformPage(page);
            if (!StringUtils.isEmpty(keyword)) {
                MagnetRule rule = getMagnetRule().get(site);
                infos = magnetWService.parser(rule, keyword, newPage);
            }
            return infos;
        } catch (Exception e) {
            error(model, e);
            return new ArrayList<MagnetInfo>();
        }


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
            for (MagnetRule rule : rules) {
                magnetRuleMap.put(rule.getSite(), rule);
            }
        }
        return magnetRuleMap;
    }


    private List<String> getSiteNames() {
        if (sites == null) {
            sites = new ArrayList<String>();
            Set<Map.Entry<String, MagnetRule>> entries = getMagnetRule().entrySet();
            for (Map.Entry<String, MagnetRule> entry : entries) {
                sites.add(entry.getKey());
            }
        }
        return sites;
    }
}
