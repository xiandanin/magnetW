package in.xiandan.magnetw.response;

import in.xiandan.magnetw.config.ApplicationConfig;

/**
 * created 2019/5/6 19:20
 */
public class MagnetPageConfig {
    private String versionName;
    private String searchPlaceholder;
    private String versionLink;
    private boolean busuanziEnabled;
    private boolean busuanziShow;
    private boolean trackersEnabled;

    public MagnetPageConfig(ApplicationConfig config) {
        this.versionName = config.versionName;
        this.searchPlaceholder = config.searchPlaceholder;
        this.versionLink = config.versionLink;
        this.busuanziEnabled = config.busuanziEnabled;
        this.busuanziShow = config.busuanziShow;
        this.trackersEnabled = config.trackersEnabled;
    }

    public MagnetPageConfig() {
    }

    public boolean isBusuanziEnabled() {
        return busuanziEnabled;
    }

    public void setBusuanziEnabled(boolean busuanziEnabled) {
        this.busuanziEnabled = busuanziEnabled;
    }

    public boolean isBusuanziShow() {
        return busuanziShow;
    }

    public void setBusuanziShow(boolean busuanziShow) {
        this.busuanziShow = busuanziShow;
    }

    public String getVersionName() {
        return versionName;
    }

    public void setVersionName(String versionName) {
        this.versionName = versionName;
    }

    public String getSearchPlaceholder() {
        return searchPlaceholder;
    }

    public void setSearchPlaceholder(String searchPlaceholder) {
        this.searchPlaceholder = searchPlaceholder;
    }

    public String getVersionLink() {
        return versionLink;
    }

    public void setVersionLink(String versionLink) {
        this.versionLink = versionLink;
    }
}
