package in.xiandan.magnetw.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

import java.io.File;

@Configuration
@PropertySource(value = "classpath:config.properties", encoding = "UTF-8")
public class ApplicationConfig {
    @Value("${rule.json.uri}")
    public String ruleJsonUri;

    @Value("${admin.password.md5}")
    public String adminPasswordMD5;

    @Value("${project.version}")
    public String versionName;

    @Value("${proxy.ignore}")
    public boolean proxyIgnore;

    @Value("${proxy.enabled}")
    public boolean proxyEnabled;

    @Value("${proxy.host}")
    public String proxyHost;

    @Value("${proxy.port}")
    public int proxyPort;

    @Value("${search.placeholder}")
    public String searchPlaceholder;

    @Value("${version.link}")
    public String versionLink;

    @Value("${search.result.filter.enabled}")
    public boolean resultFilterEnabled;

    @Value("${busuanzi.enabled}")
    public boolean busuanziEnabled;

    @Value("${busuanzi.show}")
    public boolean busuanziShow;

    @Value("${preload.enabled}")
    public boolean preloadEnabled;

    @Value("${trackers.enabled}")
    public boolean trackersEnabled;

    @Value("${trackers.update.url}")
    public String trackersUrl;

    @Value("${trackers.update.interval.hour}")
    public int trackersUpdateIntervalHour;

    /**
     * 规则json是否本地文件
     */
    public boolean isLocalRule() {
        return ruleJsonUri != null && !ruleJsonUri.startsWith("http");
    }

    public File getFilterPropertiesDir() {
        File rootParent = new File(getClass().getResource("/").getPath()).getParentFile().getParentFile().getParentFile();
        File dir = new File(rootParent, "magnetw-data");
        if (!dir.exists()) {
            dir.mkdirs();
        }
        return dir;
    }

}
