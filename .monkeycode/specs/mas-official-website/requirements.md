# Requirements Document

## Introduction

MAS（异常管理与安全组织）官方网站，提供异常项目信息的公开展示与后台管理功能。前台面向公众展示异常项目档案，后台供管理员进行异常信息的录入、编辑与管理。

## Glossary

- **MAS**: 异常管理与安全组织（Malignance Administration & Security）
- **异常项目**: 被 MAS 收容、研究或监控的异常实体、物品、现象或地点
- **项目等级**: 异常项目的收容难度与危险程度分级
- **特殊收容措施**: 针对异常项目制定的收容、监控或处置方案

## Requirements

### Requirement 1: 前台首页展示

**User Story:** 作为公众访问者，我希望访问 MAS 官网首页时能看到组织介绍和特色项目，以了解 MAS 的使命与工作内容。

#### Acceptance Criteria

1. 首页 SHALL 展示 MAS 组织名称、标志与使命宣言
2. 首页 SHALL 随机展示 3-6 个特色异常项目的卡片摘要
3. 首页 SHALL 提供导航栏，包含"首页"、"异常档案"、"关于"链接
4. 首页 SHALL 展示网站整体风格为暗色调、机密档案风格

### Requirement 2: 异常档案列表

**User Story:** 作为公众访问者，我希望浏览所有异常项目列表，并能按等级和关键词筛选，以快速找到感兴趣的异常项目。

#### Acceptance Criteria

1. 异常档案列表页 SHALL 以分页形式展示所有异常项目，每页显示 12 条
2. 异常档案列表页 SHALL 提供按项目等级（Safe/Euclid/Keter/Thaumiel/Apollyon/Neutralized）的筛选功能
3. 异常档案列表页 SHALL 提供关键词搜索功能，支持按项目编号和标题搜索
4. 每个列表项 SHALL 显示项目编号、项目等级标签、标题和简要摘要

### Requirement 3: 异常项目详情

**User Story:** 作为公众访问者，我希望点击某个异常项目后查看完整档案信息，包括详细描述和收容措施。

#### Acceptance Criteria

1. 异常项目详情页 SHALL 展示完整的项目编号、等级、标题
2. 异常项目详情页 SHALL 展示「特殊收容措施」内容区块
3. 异常项目详情页 SHALL 展示「描述」内容区块
4. 异常项目详情页 SHALL 按机密档案格式渲染内容（等宽字体、结构化排版）

### Requirement 4: 管理员登录

**User Story:** 作为 MAS 管理员，我希望通过用户名和密码登录后台系统，以管理异常项目信息。

#### Acceptance Criteria

1. 登录页 SHALL 提供用户名和密码输入框及登录按钮
2. WHEN 管理员提交正确的凭据，系统 SHALL 返回 JWT token 并跳转至后台首页
3. IF 凭据错误，系统 SHALL 显示"用户名或密码错误"提示
4. JWT token SHALL 在 24 小时后过期

### Requirement 5: 后台仪表盘

**User Story:** 作为 MAS 管理员，我希望登录后看到仪表盘概览，以了解系统中异常项目的统计情况。

#### Acceptance Criteria

1. 仪表盘 SHALL 显示异常项目总数
2. 仪表盘 SHALL 显示各等级异常项目的数量统计
3. 仪表盘 SHALL 提供"管理异常档案"的快捷入口

### Requirement 6: 异常项目管理（CRUD）

**User Story:** 作为 MAS 管理员，我希望在后台创建、编辑和删除异常项目，以维护异常档案数据库。

#### Acceptance Criteria

1. 管理列表页 SHALL 以表格形式展示所有异常项目，支持分页
2. 管理列表页 SHALL 提供「新建项目」按钮，点击后进入创建表单
3. 创建/编辑表单 SHALL 包含字段：项目编号、标题、等级、描述、特殊收容措施
4. WHEN 管理员提交表单，系统 SHALL 验证必填字段并保存至数据库
5. 每个列表项 SHALL 提供「编辑」和「删除」操作按钮
6. WHEN 管理员点击删除，系统 SHALL 弹出确认对话框，确认后执行删除

### Requirement 7: 数据持久化

**User Story:** 作为系统，我需要将异常项目数据持久化存储，以保证数据在服务重启后不丢失。

#### Acceptance Criteria

1. 系统 SHALL 使用 SQLite 数据库存储所有异常项目数据
2. 系统启动时 SHALL 自动创建数据库表结构（如不存在）
3. 系统 SHALL 预置至少 5 条示例异常项目数据（首次初始化时）
