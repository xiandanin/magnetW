package in.xiandan.magnetw.response;

import in.xiandan.magnetw.config.ApplicationConfig;

/**
 * created 2019/5/6 19:20
 */
public class MagnetPageConfig {
    private String versionName;
    private String searchPlaceholder;
    private String versionLink;
    private boolean trackersEnabled;
    private boolean reportEnabled;
    private boolean resultToast;

    public MagnetPageConfig(ApplicationConfig config) {
        this.versionName = config.versionName;
        this.searchPlaceholder = config.searchPlaceholder;
        this.versionLink = config.versionLink;
        this.trackersEnabled = config.trackersEnabled;
        this.reportEnabled = config.reportEnabled;
        this.resultToast = config.resultToast;
    }

    public MagnetPageConfig() {
    }

    public boolean isTrackersEnabled() {
        return trackersEnabled;
    }

    public void setTrackersEnabled(boolean trackersEnabled) {
        this.trackersEnabled = trackersEnabled;
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

    public boolean isReportEnabled() {
        return reportEnabled;
    }

    public void setReportEnabled(boolean reportEnabled) {
        this.reportEnabled = reportEnabled;
    }

    public boolean isResultToast() {
        return resultToast;
    }

    public void setResultToast(boolean resultToast) {
        this.resultToast = resultToast;
    }
}
