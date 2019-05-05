package in.xiandan.magnetw.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;

import in.xiandan.magnetw.config.ApplicationConfig;
import in.xiandan.magnetw.service.MagnetRuleService;

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


    @RequestMapping(value = "", method = RequestMethod.GET)
    public String index(Model model) {
        List<String> sites = ruleService.getSites();
        model.addAttribute("version_name", config.versionName);
        model.addAttribute("source_sites", ruleService.getSites());
        return "index";
    }
}
