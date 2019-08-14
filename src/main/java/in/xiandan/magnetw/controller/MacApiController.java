package in.xiandan.magnetw.controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import in.xiandan.magnetw.service.MacService;

/**
 * created 2019/5/24 17:13
 */
@RestController
@RequestMapping("mac")
public class MacApiController {
    @Autowired
    MacService macService;

    /**
     * 输出mac版规则
     *
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "rule", method = {RequestMethod.GET, RequestMethod.POST}, produces = "application/json; charset=utf-8")
    public String mac(@RequestParam(value = "f", required = false) Boolean format) throws Exception {
        if (format == null) {
            //默认格式化
            format = true;
        }
        if (format) {
            return new GsonBuilder().setPrettyPrinting().create().toJson(macService.java2Mac());
        } else {
            return new Gson().toJson(macService.java2Mac());
        }
    }

}
