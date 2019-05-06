package in.xiandan.magnetw.response;

import java.util.List;


public class MagnetPageData {

    private List<String> sites;
    private MagnetPageOption current;
    private List<MagnetItem> results;

    public List<String> getSites() {
        return sites;
    }

    public void setSites(List<String> sites) {
        this.sites = sites;
    }

    public MagnetPageOption getCurrent() {
        return current;
    }

    public void setCurrent(MagnetPageOption current) {
        this.current = current;
    }

    public List<MagnetItem> getResults() {
        return results;
    }

    public void setResults(List<MagnetItem> results) {
        this.results = results;
    }
}
