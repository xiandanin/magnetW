package com.dyhdyh.magnetw.util;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.io.InputStream;
import java.io.InputStreamReader;

/**
 * author  dengyuhan
 * created 2018/3/7 14:00
 */
public class GsonUtil {
    private static Gson gson = new Gson();

    public static <T> T fromJson(InputStream inputStream, TypeToken<T> token) {
        return gson.fromJson(new InputStreamReader(inputStream), token.getType());
    }
}
