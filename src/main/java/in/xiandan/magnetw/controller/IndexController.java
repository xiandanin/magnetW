package in.xiandan.magnetw.controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;

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

    //防止keyword null时导致js没有字段 使el-input不能输入
    private Gson gson = new GsonBuilder().serializeNulls().create();

    @RequestMapping(value = {"", "search"}, method = RequestMethod.GET)
    public String search(HttpServletRequest request, Model model, @RequestParam(required = false) String source, @RequestParam(value = "k", required = false) String keyword,
                         @RequestParam(value = "s", required = false) String sort, @RequestParam(value = "p", required = false) Integer page) throws Exception {
        String userAgent = request.getHeader(HttpHeaders.USER_AGENT);
        boolean isMobile = !StringUtils.isEmpty(userAgent) && userAgent.toLowerCase().contains("mobile");

        //默认参数
        MagnetPageOption pageOption = magnetService.transformCurrentOption(source, keyword, sort, page);
        if (isMobile) {
            //手机的初始化不能跨页
            pageOption.setPage(1);
        }
        MagnetPageData data = new MagnetPageData();
        data.setCurrent(pageOption);

        MagnetRule rule = ruleService.getRuleBySite(source);

        model.addAttribute("is_mobile", isMobile);
        model.addAttribute("current", gson.toJson(pageOption));
        model.addAttribute("config", gson.toJson(new MagnetPageConfig(config)));
        model.addAttribute("sort_by", gson.toJson(ruleService.getSupportedSorts(rule.getPaths())));
        model.addAttribute("source_sites", gson.toJson(ruleService.getSites()));

        return isMobile ? "mobile" : "index";
    }


}
