package in.xiandan.magnetw.service;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import in.xiandan.magnetw.response.MagnetPageSiteSort;
import in.xiandan.magnetw.response.MagnetRule;

/**
 * created 2019/5/24 16:55
 */
@Service
public class MacService {

    @Autowired
    MagnetRuleService ruleService;

    public JsonArray java2Mac() {
        List<MagnetRule> sites = ruleService.getSites();
        JsonArray jsonArray = new JsonArray();
        for (MagnetRule rule : sites) {
            JsonObject object = new JsonObject();
            object.addProperty("site", rule.getSite());
            object.addProperty("waiting", "0");
            object.addProperty("group", rule.getGroup());
            object.addProperty("magnet", rule.getMagnet());
            object.addProperty("name", rule.getName());
            object.addProperty("size", rule.getSize());
            object.addProperty("count", rule.getDate());

            MagnetPageSiteSort paths = ruleService.getSupportedSorts(rule.getPaths()).get(0);
            String path = ruleService.getPathBySort(paths.getSort(), rule.getPaths()).replace("%s","XXX").replace("%d","PPP");
            object.addProperty("source", String.format("%s%s", rule.getUrl(), path));
            jsonArray.add(object);
        }
        return jsonArray;
    }
}
