function isBabelRegister(caller) {
    return !!(caller && caller.name === "@babel/register");
}

module.exports = function (api) {
    const presets = ["@babel/preset-env", "@babel/preset-react"];
    const plugins = [
        "@babel/plugin-proposal-object-rest-spread",
        "@babel/plugin-transform-runtime",
        // 解决react 支持 a = e => {}  绑定事件的方式
        "@babel/plugin-proposal-class-properties"
    ];
    
    // antd按需加载  在node环境中无法解析css、less 等文件
    if(!api.caller(isBabelRegister)) {
        plugins.push(
            [
                "import",
                {
                    "libraryName": "antd",
                    "libraryDirectory": "es",
                    "style": true
                },
            ]
        );
    }

    return {
        presets,
        plugins
    }

    
}