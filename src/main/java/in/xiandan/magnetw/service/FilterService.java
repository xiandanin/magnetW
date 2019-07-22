package in.xiandan.magnetw.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.support.PropertiesLoaderUtils;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Properties;

import javax.annotation.PostConstruct;

import in.xiandan.magnetw.config.ApplicationConfig;

/**
 * author  dengyuhan
 * created 2019/7/22 11:42
 */
@Service
public class FilterService {
    private Logger logger = Logger.getLogger(getClass());

    @Autowired
    ApplicationConfig config;

    private List<String> mFilterList;

    private Properties properties;
    private boolean completed = true;

    @PostConstruct
    public void init() {
        mFilterList = new ArrayList<String>();
        try {
            File file = getFilterProperties();
            properties = PropertiesLoaderUtils.loadProperties(new FileSystemResource(file));
            Collection<Object> values = properties.values();
            for (Object value : values) {
                mFilterList.add((String) value);
            }
            logger.info(String.format("过滤词文件 %s--->加载%d个过滤词", file.getAbsolutePath(), mFilterList.size()));
        } catch (IOException e) {
            properties = new Properties();
            logger.error("过滤词文件初始化失败", e);
        }
    }

    public boolean add(String input) throws Exception {
        if (!completed) {
            return false;
        }
        if (mFilterList.contains(input)) {
            return true;
        }
        completed = false;
        try {
            mFilterList.add(input);
            properties.setProperty(String.valueOf(System.currentTimeMillis()), input);
            properties.store(new FileOutputStream(getFilterProperties()), null);
            completed = true;
            logger.info("屏蔽词添加成功--->" + input);
            return true;
        } catch (Exception e) {
            completed = true;
            logger.error("屏蔽词添加失败", e);
            throw e;
        }
    }

    public boolean contains(String keyword) {
        return mFilterList.contains(keyword);
    }

    private File getFilterProperties() {
        return new File(config.getResultFilterPath(), "filter.properties");
    }

}
