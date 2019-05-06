package in.xiandan.magnetw.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import in.xiandan.magnetw.config.ApplicationConfig;
import in.xiandan.magnetw.response.MagnetPageConfig;
import in.xiandan.magnetw.response.MagnetPageData;
import in.xiandan.magnetw.response.MagnetPageOption;
import in.xiandan.magnetw.response.MagnetRule;
import in.xiandan.magnetw.service.MagnetRuleService;
import in.xiandan.magnetw.service.MagnetService;

/**
 * created 2019/5/5 17:53
 */
@Controller
@RequestMapping("")
public class IndexController {
    @Autowired
    ApplicationConfig config;

    @Autowired
    MagnetRuleService ruleService;

    @Autowired
    MagnetService magnetService;

    @RequestMapping(value = {"", "search"}, method = RequestMethod.GET)
    public String index(Model model) throws Exception {
        MagnetPageOption pageOption = magnetService.transformCurrentOption(null, null, null, null);
        return search(model, pageOption.getSite(), null, null, null);
    }

    @RequestMapping(value = {"search/{source}"}, method = RequestMethod.GET)
    public String search(Model model, @PathVariable String source, @RequestParam(value = "k", required = false) String keyword,
                         @RequestParam(value = "s", required = false) String sort, @RequestParam(value = "p", required = false) Integer page) throws Exception {
        //默认参数
        MagnetPageOption pageOption = magnetService.transformCurrentOption(source, keyword, sort, page);
        MagnetPageData data = new MagnetPageData();
        data.setCurrent(pageOption);

        MagnetRule rule = ruleService.getRuleBySite(source);

        model.addAttribute("current", pageOption);
        model.addAttribute("config", new MagnetPageConfig(config));
        model.addAttribute("sort_by", ruleService.getSupportedSorts(rule.getPaths()));
        model.addAttribute("source_sites", ruleService.getSites());
        return "index";
    }


}
