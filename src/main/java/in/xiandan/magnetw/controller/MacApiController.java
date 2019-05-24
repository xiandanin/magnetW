package in.xiandan.magnetw.controller;

import com.google.gson.JsonArray;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import in.xiandan.magnetw.service.MacService;

/**
 * author  dengyuhan
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
    @RequestMapping(value = "rule", method = {RequestMethod.GET, RequestMethod.POST})
    public JsonArray mac() throws Exception {
        return macService.java2Mac();
    }

}
