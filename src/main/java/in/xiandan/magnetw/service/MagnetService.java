package in.xiandan.magnetw.service;

import net.sf.ehcache.Cache;
import net.sf.ehcache.CacheManager;
import net.sf.ehcache.Element;

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
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
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
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathFactory;

import in.xiandan.magnetw.config.ApplicationConfig;
import in.xiandan.magnetw.exception.MagnetParserException;
import in.xiandan.magnetw.request.DefaultSslSocketFactory;
import in.xiandan.magnetw.response.MagnetItem;
import in.xiandan.magnetw.response.MagnetPageOption;
import in.xiandan.magnetw.response.MagnetPageSiteSort;
import in.xiandan.magnetw.response.MagnetRule;

/**
 * created 2018/3/6 16:04
 */
@EnableAsync
@Service
public class MagnetService {
    private Logger logger = Logger.getLogger(getClass());

    @Autowired
    private MagnetRuleService ruleService;

    @Autowired
    private ApplicationConfig config;

    //private Map<String, Map<String, String>> mCacheCookies = new HashMap<String, Map<String, String>>();

    @CacheEvict(value = "magnetList", allEntries = true)
    public void clearCache() {
        logger.info("列表缓存清空");
    }


    /**
     * 修正参数
     *
     * @param sourceParam
     * @param keyword
     * @param sortParam
     * @param pageParam
     * @return
     */
    public MagnetPageOption transformCurrentOption(String sourceParam, String keyword,
                                                   String sortParam, Integer pageParam) {
        MagnetPageOption option = new MagnetPageOption();
        option.setKeyword(keyword);
        int page = pageParam == null || pageParam <= 0 ? 1 : pageParam;
        option.setPage(page);

        //如果有这个网站规则 就使用 没有就取第一个
        MagnetRule source = ruleService.getRuleBySite(sourceParam);
        option.setSite(source.getSite());

        //如果支持这个排序 不支持就取第一个排序
        List<MagnetPageSiteSort> supportedSorts = ruleService.getSupportedSorts(source.getPaths());
        for (MagnetPageSiteSort item : supportedSorts) {
            if (item.getSort().equals(sortParam)) {
                option.setSort(item.getSort());
                break;
            }
        }
        if (StringUtils.isEmpty(option.getSort())) {
            option.setSort(supportedSorts.get(0).getSort());
        }

        return option;
    }

    @Cacheable(value = "magnetList", key = "T(String).format('%s-%s-%s-%d',#rule.url,#keyword,#sort,#page)")
    public List<MagnetItem> parser(MagnetRule rule, String keyword, String sort, int page) throws MagnetParserException, IOException {
        if (StringUtils.isEmpty(keyword)) {
            return new ArrayList<MagnetItem>();
        }

        //用页码和关键字 拼接源站的url
        String sortPath = String.format(ruleService.getPathBySort(sort, rule.getPaths()), keyword, page);
        String url = String.format("%s%s", rule.getUrl(), sortPath);

        Connection connect = Jsoup.connect(url)
                .ignoreContentType(true)
                .sslSocketFactory(DefaultSslSocketFactory.getDefaultSslSocketFactory())
                .timeout(10000);
        /*Map<String, String> cookies = mCacheCookies.get(rule.getUrl());
        if (cookies != null) {
            connect.cookies(cookies);
        }*/
        //代理设置
        if (config.proxyEnabled && rule.isProxy()) {
            Proxy proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress(config.proxyHost, config.proxyPort));
            connect.proxy(proxy);
        }

        StringBuffer log = new StringBuffer();
        log.append("正在请求--->");
        log.append(rule.getSite());
        log.append("--->");
        log.append(Thread.currentThread().getName());
        log.append("\n");
        log.append(url);
        log.append("\n[Request Headers]\n");
        Map<String, String> headers = connect.request().headers();
        for (Map.Entry<String, String> entry : headers.entrySet()) {
            String header = entry.getKey();
            log.append(header);
            log.append(":");
            log.append(headers.get(header));
            log.append("\n");
        }
        logger.info(log.toString());

        //缓存cookie
        Connection.Response response = connect.execute();
        /*if (response.cookies() != null) {
            mCacheCookies.put(rule.getUrl(), response.cookies());
        }*/
        String html = response.parse().html();
        try {
            List<MagnetItem> infos = new ArrayList<MagnetItem>();
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
                    MagnetItem info = new MagnetItem();
                    //磁力链
                    Node magnetNote = (Node) xPath.evaluate(rule.getMagnet(), node, XPathConstants.NODE);
                    if (magnetNote != null) {
                        String magnetValue = magnetNote.getTextContent();
                        info.setMagnet(transformMagnet(magnetValue));
                    }
                    //名称
                    NodeList nameNotes = ((NodeList) xPath.evaluate(rule.getName(), node, XPathConstants.NODESET));
                    if (nameNotes != null && nameNotes.getLength() > 0) {
                        //少数名称有可能会找到多个 默认取最后一个 比如Nyaa
                        Node nameNote = nameNotes.item(nameNotes.getLength() - 1);

                        String nameValue = nameNote.getTextContent();
                        info.setName(nameValue);
                        //高亮关键字 兼容大小写
                        int keywordIndex = nameValue.toLowerCase().indexOf(keyword.toLowerCase());
                        if (keywordIndex >= 0) {
                            StringBuilder buffer = new StringBuilder(nameValue);
                            buffer.insert(keywordIndex + keyword.length(),"</span>");
                            buffer.insert(keywordIndex,"<span style=\"color:#ff7a76\">");
                            info.setNameHtml(buffer.toString());
                        }else{
                            info.setNameHtml(nameValue.replace(keyword, String.format("<span style=\"color:#ff7a76\">%s</span>", keyword)));
                        }

                        Node hrefAttr = nameNote.getAttributes().getNamedItem("href");
                        if (hrefAttr != null) {
                            info.setDetailUrl(transformDetailUrl(rule.getUrl(), hrefAttr.getTextContent()));
                        }

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
                        info.setDate(countNode.getTextContent());
                    }
                    //人气/热度
                    if (!StringUtils.isEmpty(rule.getHot())) {
                        Node popularityNode = (Node) xPath.evaluate(rule.getHot(), node, XPathConstants.NODE);
                        if (popularityNode != null) {
                            info.setHot(popularityNode.getTextContent());
                        }
                    }

                    if (!StringUtils.isEmpty(info.getName())) {
                        infos.add(info);
                    }
                }
            }
            return infos;
        } catch (Exception e) {
            throw new MagnetParserException(e);
        }
    }


    /**
     * 异步加载下一页
     */
    @Async
    public void asyncPreloadNextPage(MagnetRule rule, MagnetPageOption current) {
        try {
            int page = current.getPage() + 1;
            String cacheName = "magnetList";
            if (CacheManager.getInstance().cacheExists(cacheName)) {
                String key = String.format("%s-%s-%s-%d", rule.getUrl(), current.getKeyword(), current.getSort(), page);
                Cache cache = CacheManager.getInstance().getCache(cacheName);
                Element element = cache.get(key);
                //如果没有缓存 就缓存下一页
                if (element == null) {
                    List<MagnetItem> items = this.parser(rule, current.getKeyword(), current.getSort(), page);
                    cache.put(new Element(key, items));

                    logger.info(String.format("成功预加载 %s-%s-%d，缓存%d条数据", current.getSite(), current.getKeyword(), page, items.size()));
                }
            }
        } catch (MagnetParserException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private String transformDetailUrl(String url, String magnetValue) {
        return magnetValue.startsWith("http") ? magnetValue : url + magnetValue;
    }

    /**
     * 磁力链转换
     * 检查url是否磁力链，不是的话手动拼接磁力链
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
        String lowerName = name.toLowerCase();
        String regex4k = ".*(2160|4k).*";
        String regex720 = ".*(1280|720p|720P).*";
        String regex1080 = ".*(1920|1080p|1080P).*";
        boolean matches720 = Pattern.matches(regex720, lowerName);
        if (matches720) {
            return "720P";
        }
        boolean matches1080 = Pattern.matches(regex1080, lowerName);
        if (matches1080) {
            return "1080P";
        }
        boolean matches4k = Pattern.matches(regex4k, lowerName);
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
        try {
            long baseNumber = 0;
            if (formatSize.contains("G")) {
                baseNumber = 1024 * 1024 * 1024;
            } else if (formatSize.contains("M")) {
                baseNumber = 1024 * 1024;
            } else if (formatSize.contains("K")) {
                baseNumber = 1024;
            }
            Matcher matcher = Pattern.compile("(\\d+(\\.\\d+)?)").matcher(formatSize);
            if (matcher.find()) {
                String newFormatSize = matcher.group();
                float size = Float.parseFloat(newFormatSize);
                return (long) (size * baseNumber);
            }
        } catch (NumberFormatException e) {
        }
        return 0L;
    }


}
