package in.xiandan.magnetw.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

import in.xiandan.magnetw.config.ApplicationConfig;
import in.xiandan.magnetw.exception.MagnetParserException;
import in.xiandan.magnetw.response.BaseResponse;
import in.xiandan.magnetw.response.MagnetItem;
import in.xiandan.magnetw.response.MagnetPageOption;
import in.xiandan.magnetw.response.MagnetPageData;
import in.xiandan.magnetw.response.MagnetRule;
import in.xiandan.magnetw.service.MagnetRuleService;
import in.xiandan.magnetw.service.MagnetService;

/**
 * created 2019/05/05 12:04
 */
@RestController
@RequestMapping("api")
public class MagnetApiController {
    @Autowired
    ApplicationConfig config;

    @Autowired
    MagnetRuleService ruleService;

    @Autowired
    MagnetService magnetService;

    /**
     * 重载配置
     *
     * @return
     * @throws Exception
     */
    @ResponseBody
    @RequestMapping(value = "reload", method = RequestMethod.GET)
    public BaseResponse reload(@RequestParam(value = "p") String password) throws Exception {
        return runHasPermission(password, "规则重载成功", new Runnable() {
            @Override
            public void run() {
                ruleService.reload();
            }
        });
    }

    /**
     * 清除缓存
     *
     * @return
     * @throws Exception
     */
    @ResponseBody
    @RequestMapping(value = "clear-cache", method = RequestMethod.GET)
    public BaseResponse clearCache(@RequestParam(value = "p") String password) throws Exception {
        return runHasPermission(password, "缓存清除成功", new Runnable() {
            @Override
            public void run() {
                magnetService.clearCache();
            }
        });
    }


    /**
     * 获取源站列表
     *
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "source", method = RequestMethod.GET)
    public BaseResponse<List<MagnetRule>> getSourceSites() throws Exception {
        List<MagnetRule> sites = ruleService.getSites();
        return BaseResponse.success(sites, String.format("%d个规则加载成功", sites.size()));
    }

    /**
     * 搜索
     *
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "search", method = RequestMethod.GET)
    public BaseResponse<MagnetPageData> getSourceSites(@RequestParam(required = false) String source, @RequestParam(required = false) String keyword,
                                                       @RequestParam(required = false) String sort, @RequestParam(required = false) Integer page) throws MagnetParserException, IOException {
        //默认参数
        MagnetPageOption pageOption = magnetService.transformCurrentOption(source, keyword, sort, page);
        MagnetRule rule = ruleService.getRuleBySite(pageOption.getSite());
        List<MagnetItem> infos = magnetService.parser(rule, keyword, pageOption.getSort(), pageOption.getPage());

        MagnetPageData data = new MagnetPageData();
        data.setCurrent(pageOption);
        data.setResults(infos);

        return BaseResponse.success(data, String.format("搜索到%d条结果", infos.size()));
    }


    private BaseResponse runHasPermission(String password, String message, Runnable runnable) {
        if (StringUtils.isEmpty(config.adminPassword)) {
            return BaseResponse.error("没有设置管理密码");
        } else {
            if (config.adminPassword.equals(password)) {
                runnable.run();
                return BaseResponse.success(null, message);
            } else {
                return BaseResponse.error("没有权限");
            }
        }
    }

}
