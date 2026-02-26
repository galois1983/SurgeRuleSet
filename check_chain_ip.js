/**
 * Surge 代理链与落地 IP 检测面板
 */

// 👇 这里填入你之前建好的最终调度组名称，或者直接填落地节点名称
const policyName = "👍 AI_与_Google专属"; 

// 使用 ip-api 接口获取 IP 详情 (免费且支持中文)
const url = "http://ip-api.com/json/?lang=zh-CN";

$httpClient.get({
    url: url,
    // 核心参数：强制该检测请求走你的代理链
    policy: policyName 
}, function(error, response, data) {
    if (error) {
        $done({
            title: "⛓️ 代理链状态：断线",
            content: "请求失败！请检查底层机场节点是否宕机，或 IPRoyal 流量是否耗尽。\n报错信息：" + error,
            icon: "xmark.shield.fill",
            "icon-color": "#FF3B30" // 红色警告
        });
    } else {
        try {
            const info = JSON.parse(data);
            const ip = info.query;
            const country = info.country;
            const isp = info.isp;
            
            // 简单评估：如果运营商名字里没带 hosting/datacenter，大概率是优质 ISP
            const isClean = !isp.toLowerCase().includes("hosting") && !isp.toLowerCase().includes("datacenter");
            
            $done({
                title: "⛓️ 代理链连通：极速",
                content: `落地 IP: ${ip}\n归属地: ${country}\n运营商: ${isp}\n纯净度: ${isClean ? "✅ 优质 (住宅/ISP)" : "⚠️ 疑似机房"}`,
                icon: "checkmark.shield.fill",
                "icon-color": "#34C759" // 绿色安全标志
            });
        } catch (e) {
            $done({
                title: "⛓️ 代理链状态：解析异常",
                content: "获取到的 IP 数据格式不对，可能遭遇了网络劫持或 Portal 认证。",
                icon: "exclamationmark.triangle.fill",
                "icon-color": "#FFCC00" // 黄色警告
            });
        }
    }
});
