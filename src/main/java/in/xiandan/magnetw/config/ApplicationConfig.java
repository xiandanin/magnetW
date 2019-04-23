package in.xiandan.magnetw.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.util.StringUtils;

/**
 * author  dengyuhan
 */
@Configuration
@PropertySource(value = "classpath:config.properties")
public class ApplicationConfig {
    @Value("${rule.json.uri}")
    public String ruleJsonUri;


    /**
     * 规则json文件是否网络文件
     */
    public boolean isRuleJsonUrl() {
        return StringUtils.isEmpty(ruleJsonUri) && ruleJsonUri.startsWith("http");
    }

}
