package in.xiandan.magnetw.service;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
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
import in.xiandan.magnetw.response.MagnetRule;

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

    /**
     * 重新加载规则
     *
     * @return
     */
    @PostConstruct
    public void reload() {
        magnetRuleMap = null;
        getMagnetRule();
    }


    /**
     * 根据网站名称获取规则
     *
     * @param site
     * @return
     */
    public MagnetRule getRuleBySite(String site) {
        return getMagnetRule().get(site);
    }

    public List<String> getSites() {
        List<String> sites = new ArrayList<String>();
        Map<String, MagnetRule> ruleMap = getMagnetRule();
        for (Map.Entry<String, MagnetRule> entry : ruleMap.entrySet()) {
            sites.add(entry.getKey());
        }
        return sites;
    }

    /**
     * 网站的筛选规则
     *
     * @return
     */
    public Map<String, MagnetRule> getMagnetRule() {
        if (magnetRuleMap == null) {
            magnetRuleMap = new LinkedHashMap<String, MagnetRule>();

            List<MagnetRule> rules = loadMagnetRule();

            StringBuffer log = new StringBuffer();
            for (MagnetRule rule : rules) {
                magnetRuleMap.put(rule.getSite(), rule);
                log.append("已加载网站规则--->" + rule.getSite() + " : " + rule.getUrl()+"\n");
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
