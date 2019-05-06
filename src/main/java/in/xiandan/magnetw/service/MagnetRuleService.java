package in.xiandan.magnetw.service;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import in.xiandan.magnetw.config.ApplicationConfig;
import in.xiandan.magnetw.response.MagnetPageSiteSort;
import in.xiandan.magnetw.response.MagnetRule;
import in.xiandan.magnetw.response.MagnetRulePath;

/**
 * 规则服务
 * created 2019/4/23 23:06
 */
@Service
public class MagnetRuleService {
    private Logger logger = Logger.getLogger(getClass());

    @Autowired
    private ApplicationConfig mConfig;

    private Gson gson = new Gson();

    private Map<String, MagnetRule> magnetRuleMap;
    private List<MagnetRule> sites;

    /**
     * 重新加载规则
     *
     * @return
     */
    @PostConstruct
    public void reload() {
        magnetRuleMap = null;
        sites = null;
        getMagnetRule();
    }


    /**
     * 根据网站名称获取规则
     *
     * @param site
     * @return
     */
    public MagnetRule getRuleBySite(String site) {
        MagnetRule rule = getMagnetRule().get(site);
        if (rule == null) {
            return getSites().get(0);
        }
        return rule;
    }

    public List<MagnetRule> getSites() {
        return sites;
    }


    /**
     * 获取支持的排序方式
     *
     * @return
     */
    public List<MagnetPageSiteSort> getSupportedSorts(MagnetRulePath rulePaths) {
        List<MagnetPageSiteSort> options = new ArrayList<MagnetPageSiteSort>();
        if (!StringUtils.isEmpty(rulePaths.getPreset())) {
            options.add(new MagnetPageSiteSort(MagnetPageSiteSort.SORT_OPTION_DEFAULT));
        }
        if (!StringUtils.isEmpty(rulePaths.getTime())) {
            options.add(new MagnetPageSiteSort(MagnetPageSiteSort.SORT_OPTION_TIME));
        }
        if (!StringUtils.isEmpty(rulePaths.getSize())) {
            options.add(new MagnetPageSiteSort(MagnetPageSiteSort.SORT_OPTION_SIZE));
        }
        if (!StringUtils.isEmpty(rulePaths.getHot())) {
            options.add(new MagnetPageSiteSort(MagnetPageSiteSort.SORT_OPTION_HOT));
        }
        return options;
    }


    /**
     * 根据排序获取路径
     *
     * @param sortType
     * @return
     */
    public String getPathBySort(String sortType, MagnetRulePath rulePaths) {
        if (MagnetPageSiteSort.SORT_OPTION_SIZE.equals(sortType)) {
            return rulePaths.getSize();
        } else if (MagnetPageSiteSort.SORT_OPTION_HOT.equals(sortType)) {
            return rulePaths.getHot();
        } else if (MagnetPageSiteSort.SORT_OPTION_TIME.equals(sortType)) {
            return rulePaths.getTime();
        } else if (MagnetPageSiteSort.SORT_OPTION_DEFAULT.equals(sortType)) {
            return rulePaths.getPreset();
        }else{
            return getSupportedSorts(rulePaths).get(0).getSort();
        }
    }

    /**
     * 网站的筛选规则
     *
     * @return
     */
    private Map<String, MagnetRule> getMagnetRule() {
        if (magnetRuleMap == null || sites == null) {
            magnetRuleMap = new LinkedHashMap<String, MagnetRule>();
            sites = new ArrayList<MagnetRule>();

            List<MagnetRule> rules = loadMagnetRule();

            StringBuffer log = new StringBuffer();
            for (MagnetRule rule : rules) {
                if (mConfig.proxyIgnore && rule.isProxy()) {
                    continue;
                }
                magnetRuleMap.put(rule.getSite(), rule);
                sites.add(rule);
                log.append("已加载网站规则--->" + rule.getSite() + " : " + rule.getUrl() + "\n");
            }
            log.append(magnetRuleMap.size() + "个网站规则加载成功");
            logger.info(log.toString());
        }
        return magnetRuleMap;
    }

    private List<MagnetRule> loadMagnetRule() {
        if (mConfig.isLocalRule()) {
            return loadResourceMagnetRule();
        } else {
            return requestMagnetRule();
        }
    }

    /**
     * 从本地资源获取规则
     *
     * @return
     */
    private List<MagnetRule> loadResourceMagnetRule() {
        InputStream inputStream = getClass().getResourceAsStream(String.format("/%s", mConfig.ruleJsonUri));
        return gson.fromJson(new InputStreamReader(inputStream, Charset.forName("UTF-8")), new TypeToken<List<MagnetRule>>() {
        }.getType());
    }

    /**
     * 从网络上获取规则
     *
     * @return
     */
    private List<MagnetRule> requestMagnetRule() {
        RestTemplate rest = new RestTemplate();
        ResponseEntity<String> response = rest.exchange(mConfig.ruleJsonUri, HttpMethod.GET, null, String.class);
        return gson.fromJson(response.getBody(), new TypeToken<List<MagnetRule>>() {
        }.getType());
    }


}
