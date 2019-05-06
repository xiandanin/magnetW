package in.xiandan.magnetw.response;

import java.util.List;


public class MagnetPageData {

    private List<String> sites;
    private MagnetOption current;
    private List<MagnetInfo> results;

    public List<String> getSites() {
        return sites;
    }

    public void setSites(List<String> sites) {
        this.sites = sites;
    }

    public MagnetOption getCurrent() {
        return current;
    }

    public void setCurrent(MagnetOption current) {
        this.current = current;
    }

    public List<MagnetInfo> getResults() {
        return results;
    }

    public void setResults(List<MagnetInfo> results) {
        this.results = results;
    }
}
