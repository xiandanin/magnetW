package in.xiandan.magnetw.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;

import in.xiandan.magnetw.response.BaseResponse;
import in.xiandan.magnetw.service.MagnetRuleService;
import in.xiandan.magnetw.service.PermissionService;

/**
 * author  dengyuhan
 * created 2019/5/24 17:13
 */
@Controller
@RequestMapping("admin")
public class AdminController {
    @Autowired
    PermissionService permissionService;

    @Autowired
    MagnetRuleService ruleService;

    @RequestMapping(method = RequestMethod.GET)
    public String index(HttpServletResponse response, @RequestParam(value = "p") String password) throws Exception {
        BaseResponse permission = permissionService.runAsPermission(password, null, null);
        if (permission.isSuccess()) {
            return "admin";
        } else {
            response.setStatus(HttpStatus.FORBIDDEN.value());
            response.setContentType("text/html;charset=utf-8");
            response.getWriter().write(permission.getMessage());
            return null;
        }
    }

    /**
     * 输出mac版规则
     *
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "rule", method = {RequestMethod.GET, RequestMethod.POST}, produces = "application/json; charset=utf-8")
    public String mac(@RequestParam(value = "f", required = false) Boolean format) throws Exception {
        return "";
    }

}
