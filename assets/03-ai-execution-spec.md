# AI 精准识别执行规范

## 一、输入要素

```txt
年龄段 / 年级
节目类型
节目级别
表演人数
男女人数
学生序号与身高
人均预算
表演场地
背景色 / 大屏主题色
灯光条件
用户确认队形
用户确认服装方向
特殊期待描述，可选
排练频率
演出日期
```

## 二、服装总控执行链

```txt
programTypeClassifier
→ gradePolicyEngine
→ sizeStrategyEngine
→ colorStrategyEngine
→ costumeStyleEngine
→ materialSafetyEngine
→ accessoryEngine
→ platformStrategyEngine
→ searchKeywordBuilder
→ riskPrecheckEngine
→ reverseScheduleEngine
```

## 三、视觉生成执行链

```txt
costume-master-plan
→ render-context
→ blueprint-plan / indoor-2d-preview / 3d-mannequin
→ render-photo-v2 / render-video-15s
```

## 四、匿名与安全规则

```txt
禁止真实姓名进入视觉层
只允许 studentId / gender / heightCm / roleLabel
3D 模特脸部必须模糊或无脸
图片/视频不得生成真实学生身份
不得显示学校 Logo 或可识别姓名
```

## 五、输出前自检

必须检查：

```txt
学段关键词是否冲突
亮片等级是否超限
尺码是否覆盖高个学生
是否存在背景撞色
是否缺少 Plan B
急单是否错误推荐普通网购
乐器类是否有反光风险
朗诵类是否有视觉干扰
高中段是否出现童码/可爱风/粉嫩色
```
