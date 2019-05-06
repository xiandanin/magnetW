package in.xiandan.magnetw.service;

import org.apache.log4j.Logger;
import org.htmlcleaner.CleanerProperties;
import org.htmlcleaner.DomSerializer;
import org.htmlcleaner.HtmlCleaner;
import org.htmlcleaner.TagNode;
import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.Proxy;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathFactory;

import in.xiandan.magnetw.config.ApplicationConfig;
import in.xiandan.magnetw.exception.MagnetParserException;
import in.xiandan.magnetw.response.MagnetInfo;
import in.xiandan.magnetw.response.MagnetOption;
import in.xiandan.magnetw.response.MagnetRule;
import in.xiandan.magnetw.response.MagnetSortOption;

/**
 * created 2018/3/6 16:04
 */
@Service
public class MagnetService {
    private Logger logger = Logger.getLogger(getClass());

    @Autowired
    private MagnetRuleService ruleService;

    @Autowired
    private ApplicationConfig config;

    @CacheEvict(value = "magnetList", allEntries = true)
    public void clearCache() {
        logger.info("列表缓存清空");
    }


    public MagnetOption transformCurrentOption(String sourceParam, String keyword,
                                               String sortParam, Integer pageParam) {
        //默认参数
        String source = StringUtils.isEmpty(sourceParam) ? ruleService.getSites().get(0) : sourceParam;
        String sort = MagnetSortOption.sortValue(sortParam);
        int page = pageParam == null || pageParam <= 0 ? 1 : pageParam;

        MagnetOption option = new MagnetOption();
        option.setPage(page);
        option.setSort(new MagnetSortOption(sort));
        option.setSite(source);
        option.setKeyword(keyword);
        return option;
    }

    @Cacheable(value = "magnetList", key = "T(String).format('%s-%s-%s-%s-%d',#rule.url,#rule.path,#keyword,#sort,#page)")
    public List<MagnetInfo> parser(MagnetRule rule, String keyword, String sort, int page) throws MagnetParserException, IOException {
        //用页码和关键字 拼接源站的url
        String sortPath = String.format(MagnetSortOption.SORT_OPTION_SIZE.equals(sort) ? rule.getPath_size() : rule.getPath(), keyword, page);
        String url = String.format("%s%s", rule.getUrl(), sortPath);

        logger.info("正在请求--->" + rule.getSite() + "-->" + url);

        Connection connect = Jsoup.connect(url);
        //代理设置
        if (config.proxyEnabled && rule.isProxy()) {
            Proxy proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress(config.proxyHost, config.proxyPort));
            connect.proxy(proxy);
        }
        String html = connect.get().body().html();

        List<MagnetInfo> infos = new ArrayList<MagnetInfo>();
        try {
            XPath xPath = XPathFactory.newInstance().newXPath();
            TagNode tagNode = new HtmlCleaner().clean(html);
            Document dom = new DomSerializer(new CleanerProperties()).createDOM(tagNode);

            //列表
            NodeList result = (NodeList) xPath.evaluate(rule.getGroup(), dom, XPathConstants.NODESET);
            for (int i = 0; i < result.getLength(); i++) {
                Node node = result.item(i);
                if (node != null) {
                    if (StringUtils.isEmpty(node.getTextContent().trim())) {
                        continue;
                    }
                    MagnetInfo info = new MagnetInfo();
                    //磁力链
                    Node magnetNote = (Node) xPath.evaluate(rule.getMagnet(), node, XPathConstants.NODE);
                    if (magnetNote != null) {
                        String magnetValue = magnetNote.getTextContent();
                        info.setMagnet(transformMagnet(magnetValue));
                    }
                    //名称
                    Node nameNote = ((Node) xPath.evaluate(rule.getName(), node, XPathConstants.NODE));
                    if (nameNote != null) {
                        String nameValue = nameNote.getTextContent();
                        info.setName(nameValue);
                        info.setNameHtml(nameValue.replace(keyword, String.format("<span style=\"color:#ff7a76\">%s</span>", keyword)));//高亮关键字
                        String nameHref = nameNote.getAttributes().getNamedItem("href").getTextContent();
                        info.setDetailUrl(transformDetailUrl(rule.getUrl(), nameHref));

                        //一些加工的额外信息
                        String resolution = transformResolution(nameValue);
                        info.setResolution(resolution);
                    }
                    //大小
                    Node sizeNote = ((Node) xPath.evaluate(rule.getSize(), node, XPathConstants.NODE));
                    if (sizeNote != null) {
                        String sizeValue = sizeNote.getTextContent();
                        info.setFormatSize(sizeValue);
                        info.setSize(transformSize(sizeValue));
                    }
                    //时间
                    Node countNode = (Node) xPath.evaluate(rule.getDate(), node, XPathConstants.NODE);
                    if (countNode != null) {
                        info.setCount(countNode.getTextContent());
                    }

                    if (!StringUtils.isEmpty(info.getName())) {
                        infos.add(info);
                    }
                }
            }
        } catch (Exception e) {
            throw new MagnetParserException(e);
        }
        return infos;
    }


    private String transformDetailUrl(String url, String magnetValue) {
        return magnetValue.startsWith("http") ? magnetValue : url + magnetValue;
    }

    /**
     * 磁力链转换 当url不是磁力链时 手动拼接磁力链
     *
     * @param url
     * @return
     */
    private String transformMagnet(String url) {
        String regex = "magnet:?[^\\\"]+";
        boolean matches = Pattern.matches(regex, url);
        if (matches) {
            return url;
        } else {
            String newMagnet;
            try {
                StringBuffer sb = new StringBuffer(url);
                int htmlIndex = url.lastIndexOf(".html");
                if (htmlIndex != -1) {
                    sb.delete(htmlIndex, sb.length());
                }
                int paramIndex = url.indexOf("&");
                if (paramIndex != -1) {
                    sb.delete(paramIndex, sb.length());
                }
                if (sb.length() >= 40) {
                    newMagnet = sb.substring(sb.length() - 40, sb.length());
                } else {
                    newMagnet = url;
                }
            } catch (Exception e) {
                e.printStackTrace();
                newMagnet = url;
            }
            return String.format("magnet:?xt=urn:btih:%s", newMagnet);
        }
    }


    /**
     * 从名称里提取清晰度
     *
     * @param name
     * @return
     */
    private String transformResolution(String name) {
        String regex4k = ".*(2160|4k).*";
        String regex720 = ".*(1280|720p|720P).*";
        String regex1080 = ".*(1920|1080p|1080P).*";
        boolean matches720 = Pattern.matches(regex720, name);
        if (matches720) {
            return "720P";
        }
        boolean matches1080 = Pattern.matches(regex1080, name);
        if (matches1080) {
            return "1080P";
        }
        boolean matches4k = Pattern.matches(regex4k, name);
        if (matches4k) {
            return "4K";
        }
        return "";
    }


    /**
     * 将文件大小解析成数字
     *
     * @param formatSize
     * @return
     */
    private long transformSize(String formatSize) {
        long baseNumber = 0;
        String newFormatSize = formatSize.toUpperCase().replace(" ", "").replace(" ", "");
        if (newFormatSize.endsWith("GB")) {
            baseNumber = 1024 * 1024 * 1024;
            newFormatSize = newFormatSize.replace("GB", "");
        } else if (newFormatSize.endsWith("MB")) {
            baseNumber = 1024 * 1024;
            newFormatSize = newFormatSize.replace("MB", "");
        } else if (newFormatSize.endsWith("KB")) {
            baseNumber = 1024;
            newFormatSize = newFormatSize.replace("KB", "");
        }
        float size = Float.parseFloat(newFormatSize);
        return (long) (size * baseNumber);
    }

}
