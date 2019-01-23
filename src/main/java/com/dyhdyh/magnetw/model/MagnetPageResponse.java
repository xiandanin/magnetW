package com.dyhdyh.magnetw.model;

import java.util.List;

/**
 * author  dengyuhan
 * created 2018/5/15 23:01
 */
public class MagnetPageResponse {
    public static final String SORT_OPTION_DEFAULT = "default";
    public static final String SORT_OPTION_SIZE = "size";

    private int currentPage;
    private String currentSourceSite;
    private String currentSortOption;
    private List<MagnetInfo> results;
    private String errorMessage;

    public String getCurrentSortOption() {
        return currentSortOption;
    }

    public void setCurrentSortOption(String currentSortOption) {
        this.currentSortOption = currentSortOption;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public String getCurrentSourceSite() {
        return currentSourceSite;
    }

    public void setCurrentSourceSite(String currentSourceSite) {
        this.currentSourceSite = currentSourceSite;
    }

    public int getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(int currentPage) {
        this.currentPage = currentPage;
    }

    public List<MagnetInfo> getResults() {
        return results;
    }

    public void setResults(List<MagnetInfo> results) {
        this.results = results;
    }
}
