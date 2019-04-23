package in.xiandan.magnetw.model;

/**
 * author  dengyuhan
 * created 2018/3/7 11:52
 */
public class MagnetRule{
    private String source;//默认排序的地址
    private String source_size;//文件大小排序的地址
    private String site;
    private String waiting;

    private String group;
    private String magnet;
    private String name;
    private String size;
    private String url;
    private String date;

    public String getSource_size() {
        return source_size;
    }

    public void setSource_size(String source_size) {
        this.source_size = source_size;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getGroup() {
        return group;
    }

    public void setGroup(String group) {
        this.group = group;
    }

    public String getMagnet() {
        return magnet;
    }

    public void setMagnet(String magnet) {
        this.magnet = magnet;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getSite() {
        return site;
    }

    public void setSite(String site) {
        this.site = site;
    }

    public String getWaiting() {
        return waiting;
    }

    public void setWaiting(String waiting) {
        this.waiting = waiting;
    }
}
