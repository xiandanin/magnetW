package in.xiandan.magnetw.config;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.support.PropertiesLoaderUtils;

import java.io.File;
import java.lang.reflect.Field;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.annotation.PostConstruct;

@Configuration
@PropertySource(value = "classpath:config.properties", encoding = "UTF-8")
public class ApplicationConfig {
    private Logger logger = Logger.getLogger(getClass());

    @Value("${rule.json.uri}")
    public String ruleJsonUri;

    @Value("${admin.password.md5}")
    public String adminPasswordMD5;

    @Value("${project.version}")
    public String versionName;

    @Value("${request.source.timeout}")
    public long sourceTimeout;

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

    @Value("${search.report.enabled}")
    public boolean reportEnabled;

    @Value("${preload.enabled}")
    public boolean preloadEnabled;

    @Value("${trackers.enabled}")
    public boolean trackersEnabled;

    @Value("${trackers.update.url}")
    public String trackersUrl;

    @Value("${trackers.update.interval.hour}")
    public int trackersUpdateIntervalHour;

    @PostConstruct
    public void onInit() {
        //如果有外部配置 就使用外部的
        try {
            File configFile = getExternalConfigFile();
            if (configFile.exists()) {
                StringBuffer sb = new StringBuffer();
                sb.append("检测到有外部配置文件，加载外部配置...\n");
                Properties properties = PropertiesLoaderUtils.loadProperties(new FileSystemResource(configFile));
                Field[] fields = ApplicationConfig.class.getFields();
                for (Field field : fields) {
                    Value valueAnnotation = field.getAnnotation(Value.class);
                    if (valueAnnotation != null) {
                        Matcher matcher = Pattern.compile("(?<=\\{).+?(?=\\})").matcher(valueAnnotation.value());
                        if (matcher.find()) {
                            //用外部配置的值覆盖
                            String key = matcher.group();
                            if (properties.containsKey(key)) {
                                String value = properties.getProperty(key);
                                if (value != null) {
                                    sb.append("覆盖变量--->");
                                    sb.append(key);
                                    sb.append("=");
                                    sb.append(value);
                                    sb.append("\n");
                                    if (field.getType() == long.class) {
                                        field.setLong(this, Long.parseLong(value));
                                    } else if (field.getType() == int.class) {
                                        field.setInt(this, Integer.parseInt(value));
                                    } else if (field.getType() == float.class) {
                                        field.setFloat(this, Float.parseFloat(value));
                                    } else if (field.getType() == double.class) {
                                        field.setDouble(this, Double.parseDouble(value));
                                    } else if (field.getType() == boolean.class) {
                                        field.setBoolean(this, Boolean.parseBoolean(value));
                                    } else {
                                        field.set(this, value);
                                    }
                                }
                            }
                        }
                    }
                }
                logger.info(sb.toString());
            }
        } catch (Exception e) {
            logger.error("外部配置文件加载失败", e);
        }
    }

    /**
     * 规则json是否本地文件
     */
    public boolean isLocalRule() {
        return ruleJsonUri != null && !ruleJsonUri.startsWith("http");
    }

    /**
     * 外部数据目录 工程目录父文件夹
     *
     * @return
     */
    public File getExternalDataDir() {
        File rootParent = new File(getClass().getResource("/").getPath()).getParentFile().getParentFile().getParentFile();
        File dir = new File(rootParent, "magnetw-data");
        //如果没有就创建文件夹
        if (!dir.exists()) {
            rootParent.setWritable(true, false);
            dir.mkdirs();
        }
        return dir;
    }

    /**
     * 外部配置文件
     *
     * @return
     */
    public File getExternalConfigFile() {
        return new File(getExternalDataDir(), "config.properties");
    }

}
