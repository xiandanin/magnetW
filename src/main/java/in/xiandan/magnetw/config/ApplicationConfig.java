package in.xiandan.magnetw.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource(value = "classpath:config.properties")
public class ApplicationConfig {
    @Value("${rule.json.uri}")
    public String ruleJsonUri;

    @Value("${admin.password}")
    public String adminPassword;

    @Value("${project.version}")
    public String versionName;

    @Value("${proxy.enabled}")
    public boolean proxyEnabled;

    @Value("${proxy.host}")
    public String proxyHost;

    @Value("${proxy.port}")
    public int proxyPort;


    /**
     * 规则json是否本地文件
     */
    public boolean isLocalRule() {
        return ruleJsonUri != null && !ruleJsonUri.startsWith("http");
    }

}
