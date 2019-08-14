package in.xiandan.magnetw.response;

import java.util.List;

/**
 * created 2019/8/13 15:41
 */
public class ReportData {
    private List<ReportItem> keywords;
    private List<ReportItem> urls;

    public List<ReportItem> getKeywords() {
        return keywords;
    }

    public void setKeywords(List<ReportItem> keywords) {
        this.keywords = keywords;
    }

    public List<ReportItem> getUrls() {
        return urls;
    }

    public void setUrls(List<ReportItem> urls) {
        this.urls = urls;
    }
}
