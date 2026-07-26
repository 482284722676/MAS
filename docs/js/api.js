// ─── LocalStorage Data Layer (GitHub Pages 静态版本) ───

var ADMIN_PASSWORD = 'MAS';
var STORAGE_KEY = 'mas_data';

function getData() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || getDefaultData(); }
  catch(e) { return getDefaultData(); }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getDefaultData() {
  var anomalies = [
    { id: 1, item_number: 'MAS-001', title: '遗忘之钟', class: 'Safe', status: 'approved',
      description: 'MAS-001 是一台外观为19世纪英国制造的立式摆钟，高约2.1米，外壳由橡木制成。该钟的异常效应表现在：任何在钟声响起时位于其半径5米范围内的人类个体，将永久遗忘过去24小时内发生的全部事件。该效应不可逆，且对被影响者的长期记忆无损害。\n\n实验表明，使用耳塞或隔音设备可完全阻止该效应。钟声频率为440Hz，每次整点敲击持续3-5秒。\n\n当前该钟被置于Site-17的低安保收容间内，由隔音材料包裹。',
      containment_procedures: 'MAS-001 须始终存放于标准隔音收容间内。收容间墙壁、天花板和地板须覆盖厚度不低于10cm的隔音泡沫材料。\n\n任何进入收容间的人员必须佩戴工业级降噪耳罩。每月须进行一次声学密封性检查。\n\n未经2级及以上安全许可，严禁移除隔音罩。',
      created_at: '2026-07-01T00:00:00Z', updated_at: '2026-07-01T00:00:00Z' },
    { id: 2, item_number: 'MAS-002', title: '无限回廊', class: 'Euclid', status: 'approved',
      description: 'MAS-002 是位于██市██区一栋废弃办公楼三楼的一条走廊，全长12.7米。异常表现为：当有意识的人类个体从走廊一端走向另一端时，行进距离将呈指数级增长，但走廊的外观长度保持不变。\n\n测试 D-2847 在走廊中行进了约3.7公里后失去意识，在此之前报告称"走廊似乎越来越长"。GPS追踪显示该人员在物理空间中的位移不超过3米。\n\n只有当个体意识到自身正在穿越走廊时异常效应才会触发。闭眼行走、被他人推着经过不会触发异常。',
      containment_procedures: 'MAS-002 所在的建筑已由协会前台公司购买并封锁。建筑外围设有2.5米高围栏及监控摄像头。\n\n走廊两端安装有钢制安全门，由两名安保人员24小时轮班看守。\n\n禁止在走廊附近进行任何形式的方向感引导或空间感知测试。',
      created_at: '2026-07-02T00:00:00Z', updated_at: '2026-07-02T00:00:00Z' },
    { id: 3, item_number: 'MAS-003', title: '墨色之书', class: 'Keter', status: 'approved',
      description: 'MAS-003 是一本尺寸为23×15×4cm的精装书籍，封面为黑色皮革，无任何标题或文字。书页材质为未知的类羊皮纸材料。\n\n当任何人类个体打开该书并注视任一页面超过3秒，该页面将自动以阅读者的母语显示一段预言性文字。预言内容必然在72小时内以某种形式应验。\n\n截至目前，所有记录的预言均已应验。██/██/20██，该书的某一页被观测到仅显示一行文字："[数据删除]"。',
      containment_procedures: 'MAS-003 须存放于Site-01的高安保保险库内，保险库由30cm厚钛合金门保护，需要两名4级人员的生物特征同时验证方可开启。\n\n任何情况下禁止人类目光直接接触书页超过3秒。所有观测必须通过数字摄像设备进行。',
      created_at: '2026-07-03T00:00:00Z', updated_at: '2026-07-03T00:00:00Z' },
    { id: 4, item_number: 'MAS-004', title: '安抚之石', class: 'Thaumiel', status: 'approved',
      description: 'MAS-004 是一块表面光滑的椭圆形黑曜石，重约3.7kg，长约28cm。当被置于任何具有破坏性异常效应的项目附近，该异常效应的活跃度将显著下降。\n\n定量测试表明，MAS-004可将异常效应强度降低约60%-85%。已被成功应用于多个Keter级项目的收容措施中。\n\n注意：MAS-004 对两个以上项目同时使用时效果会分散。',
      containment_procedures: 'MAS-004 须存放于独立的收容柜中，仅在获得Site主管和至少一名O5议员授权后方可调出使用。\n\n每次使用后须进行为期不少于24小时的"冷却"观察期。\n\n非紧急情况下，严禁将MAS-004同时应用于超过两个目标项目。',
      created_at: '2026-07-04T00:00:00Z', updated_at: '2026-07-04T00:00:00Z' },
    { id: 5, item_number: 'MAS-005', title: '镜中之人', class: 'Euclid', status: 'approved',
      description: 'MAS-005 是一个存在于所有平面镜中的类人实体。当人类个体在夜间独处对着镜子凝视超过15秒时，该实体将逐渐显现并尝试与凝视者进行模拟对话——但仅能重复凝视者此前说过的语句。\n\n截至目前，██ 例记录显示该实体在某些情况下会说出凝视者从未说过的话，且这些话在后续3-14天内会以某种形式出现。',
      containment_procedures: '所有Site-17的居住区域和公共区域的镜面须在每日20:00至次日06:00期间用不透明布料遮盖。\n\n禁止在夜间进行任何涉及MAS-005的实验。任何人员若报告在镜中看到异常轮廓，须立即向心理健康部门报告。',
      created_at: '2026-07-05T00:00:00Z', updated_at: '2026-07-05T00:00:00Z' },
    { id: 6, item_number: 'MAS-006', title: '终灭之种', class: 'Apollyon', status: 'approved',
      description: 'MAS-006 是一粒外观为普通蒲公英种子的微观实体，直径约1.2mm。\n\n当该种子与任意有机物质接触超过0.3秒，将立即触发不可逆的分解反应：接触点周围的所有有机分子将以指数级速率分解为基本元素。\n\n计算模型显示，若MAS-006接触地球表面，理论上可在██小时内将地球生物圈的全部有机物质分解殆尽。\n\n当前无已知方法可逆转该分解效应。',
      containment_procedures: 'MAS-006 须永久存放于Site-██的地下██层的高真空无机收容舱内。收容舱由高纯度硅酸盐玻璃和钛合金构成，内部不含任何有机材料。\n\n若收容舱完整性受到威胁，须立即启动协议"虚无之日"。',
      created_at: '2026-07-06T00:00:00Z', updated_at: '2026-07-06T00:00:00Z' },
    { id: 7, item_number: 'MAS-007', title: '重生之瓮', class: 'Neutralized', status: 'approved',
      description: 'MAS-007 曾是一个高约45cm的赤陶瓮，据推断制造于公元前4世纪的古希腊地区。其异常效应为：将任何生物遗骸置入瓮中并密封24小时后，遗骸将重组为活的、完全健康的成年形态。\n\n██/██/20██，MAS-007在协会进行测试期间，瓮体突然碎裂。效果当场消失。碎片已无任何异常特性。',
      containment_procedures: 'MAS-007 已永久无效化。其碎片保存于Site-17第██仓库的标准考古储存箱中。\n\n禁止将碎片拼合或进行可能恢复其功能的任何尝试。',
      created_at: '2026-07-07T00:00:00Z', updated_at: '2026-07-07T00:00:00Z' }
  ];

  return {
    anomalies: anomalies,
    nextId: 8,
    suggestions: [],
    passwordChanged: false
  };
}

function seedIfEmpty() {
  var data = getData();
  if (!data.anomalies || data.anomalies.length < 7) {
    var def = getDefaultData();
    data.anomalies = def.anomalies;
    data.nextId = def.nextId;
  }
  if (!data.suggestions) data.suggestions = [];
  if (data.passwordChanged === undefined) data.passwordChanged = false;
  saveData(data);
}
seedIfEmpty();

// ─── Auth ───

function login(password) {
  return new Promise(function(resolve, reject) {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('mas_token', 'authenticated');
      resolve({ token: 'authenticated' });
    } else {
      reject(new Error('密码错误'));
    }
  });
}

function verifyToken() {
  return new Promise(function(resolve, reject) {
    if (localStorage.getItem('mas_token') === 'authenticated') {
      resolve({ valid: true });
    } else {
      reject(new Error('Unauthorized'));
    }
  });
}

function getAuthStatus() {
  return new Promise(function(resolve) {
    resolve({ passwordChanged: getData().passwordChanged });
  });
}

function changePassword(newPassword) {
  return new Promise(function(resolve, reject) {
    var data = getData();
    if (data.passwordChanged) {
      reject(new Error('密码只能修改一次，当前密码已被修改过'));
      return;
    }
    if (!newPassword || newPassword.length < 4) {
      reject(new Error('密码长度不能少于4位'));
      return;
    }
    ADMIN_PASSWORD = newPassword;
    data.passwordChanged = true;
    saveData(data);
    resolve({ message: '密码修改成功', passwordChanged: true });
  });
}

// ─── Anomalies (Public - 只返回已审核的) ───

function getAnomalies(params) {
  return new Promise(function(resolve) {
    params = params || {};
    var data = getData();
    var items = data.anomalies.filter(function(a) { return a.status === 'approved'; });

    if (params.class && params.class !== 'all') {
      items = items.filter(function(a) { return a.class === params.class; });
    }
    if (params.search) {
      var s = params.search.toLowerCase();
      items = items.filter(function(a) {
        return a.item_number.toLowerCase().indexOf(s) !== -1 || a.title.toLowerCase().indexOf(s) !== -1;
      });
    }

    items.sort(function(a, b) { return b.id - a.id; });

    var page = Math.max(1, parseInt(params.page) || 1);
    var limit = Math.min(50, Math.max(1, parseInt(params.limit) || 12));
    var total = items.length;
    var totalPages = Math.ceil(total / limit);
    var paged = items.slice((page - 1) * limit, page * limit);

    resolve({ items: paged, total: total, page: page, limit: limit, totalPages: totalPages });
  });
}

function getAnomaly(id) {
  return new Promise(function(resolve, reject) {
    var data = getData();
    var a = data.anomalies.find(function(item) { return item.id === parseInt(id) && item.status === 'approved'; });
    if (a) resolve(a);
    else reject(new Error('异常项目未找到'));
  });
}

// ─── User Submission ───

function submitAnomaly(formData) {
  return new Promise(function(resolve, reject) {
    var data = getData();
    if (data.anomalies.find(function(a) { return a.item_number === formData.item_number; })) {
      reject(new Error('项目编号已存在'));
      return;
    }
    var now = new Date().toISOString();
    var item = {
      id: data.nextId++,
      item_number: formData.item_number,
      title: formData.title,
      class: formData.cls,
      description: formData.description,
      containment_procedures: formData.containment_procedures,
      status: 'pending',
      created_at: now,
      updated_at: now
    };
    data.anomalies.push(item);
    saveData(data);
    resolve({ message: '档案已提交，等待管理员审核' });
  });
}

// ─── Admin CRUD ───

function createAnomaly(formData) {
  return new Promise(function(resolve, reject) {
    var data = getData();
    if (data.anomalies.find(function(a) { return a.item_number === formData.item_number; })) {
      reject(new Error('项目编号已存在'));
      return;
    }
    var now = new Date().toISOString();
    var item = {
      id: data.nextId++,
      item_number: formData.item_number,
      title: formData.title,
      class: formData.cls,
      description: formData.description,
      containment_procedures: formData.containment_procedures,
      status: 'approved',
      created_at: now,
      updated_at: now
    };
    data.anomalies.push(item);
    saveData(data);
    resolve(item);
  });
}

function updateAnomaly(id, formData) {
  return new Promise(function(resolve, reject) {
    var data = getData();
    var idx = data.anomalies.findIndex(function(a) { return a.id === parseInt(id); });
    if (idx === -1) { reject(new Error('异常项目未找到')); return; }
    var dup = data.anomalies.find(function(a) { return a.item_number === formData.item_number && a.id !== parseInt(id); });
    if (dup) { reject(new Error('项目编号已存在')); return; }
    data.anomalies[idx].item_number = formData.item_number;
    data.anomalies[idx].title = formData.title;
    data.anomalies[idx].class = formData.cls;
    data.anomalies[idx].description = formData.description;
    data.anomalies[idx].containment_procedures = formData.containment_procedures;
    data.anomalies[idx].updated_at = new Date().toISOString();
    saveData(data);
    resolve(data.anomalies[idx]);
  });
}

function deleteAnomaly(id) {
  return new Promise(function(resolve, reject) {
    var data = getData();
    var idx = data.anomalies.findIndex(function(a) { return a.id === parseInt(id); });
    if (idx === -1) { reject(new Error('异常项目未找到')); return; }
    data.anomalies.splice(idx, 1);
    saveData(data);
    resolve({ message: '删除成功' });
  });
}

// ─── Admin - 管理列表（全部，不分状态） ───

function adminGetAnomalies(params) {
  return new Promise(function(resolve) {
    params = params || {};
    var data = getData();
    var items = data.anomalies.slice();
    items.sort(function(a, b) { return b.id - a.id; });
    var page = Math.max(1, parseInt(params.page) || 1);
    var limit = Math.min(50, Math.max(1, parseInt(params.limit) || 15));
    var total = items.length;
    var totalPages = Math.ceil(total / limit);
    var paged = items.slice((page - 1) * limit, page * limit);
    resolve({ items: paged, total: total, page: page, limit: limit, totalPages: totalPages });
  });
}

function adminGetAnomaly(id) {
  return new Promise(function(resolve, reject) {
    var data = getData();
    var a = data.anomalies.find(function(item) { return item.id === parseInt(id); });
    if (a) resolve(a);
    else reject(new Error('异常项目未找到'));
  });
}

// ─── Admin - 审核 ───

function getPendingAnomalies(params) {
  return new Promise(function(resolve) {
    params = params || {};
    var data = getData();
    var items = data.anomalies.filter(function(a) { return a.status === 'pending'; });
    items.sort(function(a, b) { return b.id - a.id; });
    var page = Math.max(1, parseInt(params.page) || 1);
    var limit = Math.min(50, Math.max(1, parseInt(params.limit) || 15));
    var total = items.length;
    var totalPages = Math.ceil(total / limit);
    resolve({ items: items.slice((page-1)*limit, page*limit), total: total, page: page, limit: limit, totalPages: totalPages });
  });
}

function reviewAnomaly(id, action) {
  return new Promise(function(resolve, reject) {
    var data = getData();
    var a = data.anomalies.find(function(item) { return item.id === parseInt(id); });
    if (!a) { reject(new Error('档案未找到')); return; }
    if (a.status !== 'pending') { reject(new Error('该档案不需要审核')); return; }
    if (action === 'approve') {
      a.status = 'approved';
      a.updated_at = new Date().toISOString();
    } else {
      data.anomalies = data.anomalies.filter(function(item) { return item.id !== parseInt(id); });
    }
    saveData(data);
    resolve({ message: action === 'approve' ? '审核通过' : '已拒绝并删除' });
  });
}

// ─── Stats ───

function getStats() {
  return new Promise(function(resolve) {
    var data = getData();
    var all = data.anomalies;
    var total = all.length;
    var classMap = {};
    all.forEach(function(a) {
      classMap[a.class] = (classMap[a.class] || 0) + 1;
    });
    var byClass = Object.keys(classMap).map(function(k) {
      return { class: k, count: classMap[k] };
    }).sort(function(a, b) { return b.count - a.count; });
    resolve({ total: total, byClass: byClass });
  });
}

// ─── Suggestions ───

function submitSuggestion(content, contact) {
  return new Promise(function(resolve) {
    var data = getData();
    data.suggestions.push({
      id: Date.now(),
      content: content,
      contact: contact || '',
      created_at: new Date().toISOString()
    });
    saveData(data);
    resolve({ message: '感谢您的反馈，我们已收到您的意见建议' });
  });
}

function getSuggestions(params) {
  return new Promise(function(resolve) {
    params = params || {};
    var data = getData();
    var items = data.suggestions.slice().sort(function(a, b) { return b.id - a.id; });
    var page = Math.max(1, parseInt(params.page) || 1);
    var limit = Math.min(50, parseInt(params.limit) || 20);
    var total = items.length;
    resolve({
      items: items.slice((page-1)*limit, page*limit),
      total: total, page: page, limit: limit,
      totalPages: Math.ceil(total/limit)
    });
  });
}

function deleteSuggestion(id) {
  return new Promise(function(resolve, reject) {
    var data = getData();
    var idx = data.suggestions.findIndex(function(s) { return s.id === parseInt(id); });
    if (idx === -1) { reject(new Error('记录未找到')); return; }
    data.suggestions.splice(idx, 1);
    saveData(data);
    resolve({ message: '删除成功' });
  });
}

// ─── Utils ───

function showToast(message, type) {
  type = type || 'success';
  var toast = document.createElement('div');
  toast.className = 'toast ' + type;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(function() { toast.remove(); }, 3000);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });
}
