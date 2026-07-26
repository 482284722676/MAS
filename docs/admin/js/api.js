// ─── MAS API — GitHub Pages 数据层 ───

var ADMIN_PASSWORD = 'MAS';
var LOCAL_KEY = 'mas_local';

// ─── 内嵌索引数据（同时尝试从异常/目录加载）───
var EMBEDDED_INDEX = [
  {"id":1,"item_number":"MAS-001","title":"遗忘之钟","class":"Safe","status":"approved","created_at":"2026-07-01T00:00:00Z"},
  {"id":2,"item_number":"MAS-002","title":"无限回廊","class":"Euclid","status":"approved","created_at":"2026-07-02T00:00:00Z"},
  {"id":3,"item_number":"MAS-003","title":"墨色之书","class":"Keter","status":"approved","created_at":"2026-07-03T00:00:00Z"},
  {"id":4,"item_number":"MAS-004","title":"安抚之石","class":"Thaumiel","status":"approved","created_at":"2026-07-04T00:00:00Z"},
  {"id":5,"item_number":"MAS-005","title":"镜中之人","class":"Euclid","status":"approved","created_at":"2026-07-05T00:00:00Z"},
  {"id":6,"item_number":"MAS-006","title":"终灭之种","class":"Apollyon","status":"approved","created_at":"2026-07-06T00:00:00Z"},
  {"id":7,"item_number":"MAS-007","title":"重生之瓮","class":"Neutralized","status":"approved","created_at":"2026-07-07T00:00:00Z"},
  {"id":8,"item_number":"MAS-008","title":"虚空之井","class":"Keter","status":"approved","created_at":"2026-07-08T00:00:00Z"},
  {"id":9,"item_number":"MAS-009","title":"影织者","class":"Euclid","status":"approved","created_at":"2026-07-09T00:00:00Z"},
  {"id":10,"item_number":"MAS-010","title":"永恒风暴","class":"Apollyon","status":"approved","created_at":"2026-07-10T00:00:00Z"},
  {"id":11,"item_number":"MAS-011","title":"记忆之泉","class":"Safe","status":"approved","created_at":"2026-07-11T00:00:00Z"},
  {"id":12,"item_number":"MAS-012","title":"量子双子","class":"Thaumiel","status":"approved","created_at":"2026-07-12T00:00:00Z"},
  {"id":13,"item_number":"MAS-013","title":"反语者","class":"Euclid","status":"approved","created_at":"2026-07-13T00:00:00Z"},
  {"id":14,"item_number":"MAS-014","title":"静滞之室","class":"Safe","status":"approved","created_at":"2026-07-14T00:00:00Z"},
  {"id":15,"item_number":"MAS-015","title":"虚空放逐者","class":"Keter","status":"approved","created_at":"2026-07-15T00:00:00Z"},
  {"id":16,"item_number":"MAS-016","title":"共感菌株","class":"Euclid","status":"approved","created_at":"2026-07-16T00:00:00Z"},
  {"id":17,"item_number":"MAS-017","title":"归零方程式","class":"Thaumiel","status":"approved","created_at":"2026-07-17T00:00:00Z"},
  {"id":18,"item_number":"MAS-018","title":"低语者","class":"Keter","status":"approved","created_at":"2026-07-18T00:00:00Z"},
  {"id":19,"item_number":"MAS-019","title":"星桥","class":"Safe","status":"approved","created_at":"2026-07-19T00:00:00Z"},
  {"id":20,"item_number":"MAS-020","title":"末路之书","class":"Apollyon","status":"approved","created_at":"2026-07-20T00:00:00Z"}
];

// ─── 详细档案数据（description + containment_procedures）───
// 优先从 JSON 文件加载，失败时使用内嵌回退
var EMBEDDED_DETAIL = {};

// ─── 本地存储 ───
function getLocal() {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY)) || {}; }
  catch(e) { return {}; }
}

function saveLocal(data) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
}

function ensureLocal() {
  var d = getLocal();
  if (!d.suggestions) d.suggestions = [];
  if (d.passwordChanged === undefined) d.passwordChanged = false;
  if (!d.anomalies) d.anomalies = {};
  if (!d.nextId) d.nextId = 21;
  saveLocal(d);
  return d;
}

// ─── 数据合并 ───
function mergeAnomaly(base, local) {
  if (!local) return base;
  var m = {};
  for (var k in base) { m[k] = base[k]; }
  for (var k in local) { m[k] = local[k]; }
  return m;
}

function getMergedList() {
  var local = ensureLocal();
  var localAnoms = local.anomalies || {};
  var items = EMBEDDED_INDEX.map(function(item) {
    if (localAnoms[item.item_number]) {
      return mergeAnomaly(item, localAnoms[item.item_number]);
    }
    return item;
  });
  // 添加纯本地新增的项目
  Object.keys(localAnoms).forEach(function(k) {
    if (!EMBEDDED_INDEX.some(function(i) { return i.item_number === k; })) {
      items.push(localAnoms[k]);
    }
  });
  return Promise.resolve(items);
}

// ─── 详情加载（从 JSON 文件，仅限内嵌索引中存在的项目）───
function loadDetail(itemNumber) {
  // 已在 EMBEDDED_DETAIL 中缓存
  if (EMBEDDED_DETAIL[itemNumber]) {
    return Promise.resolve(EMBEDDED_DETAIL[itemNumber]);
  }
  var detailUrl = '异常/' + itemNumber + '.json';
  return fetch(detailUrl).then(function(r) {
    return r.json();
  }).then(function(d) {
    EMBEDDED_DETAIL[itemNumber] = d;
    return d;
  }).catch(function() {
    return null;
  });
}

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
    resolve({ passwordChanged: !!ensureLocal().passwordChanged });
  });
}

function changePassword(newPassword) {
  return new Promise(function(resolve, reject) {
    var d = ensureLocal();
    if (d.passwordChanged) {
      reject(new Error('密码只能修改一次，当前密码已被修改过'));
      return;
    }
    if (!newPassword || newPassword.length < 4) {
      reject(new Error('密码长度不能少于4位'));
      return;
    }
    ADMIN_PASSWORD = newPassword;
    d.passwordChanged = true;
    saveLocal(d);
    resolve({ message: '密码修改成功', passwordChanged: true });
  });
}

function getNextItemNumber() {
  return getMergedList().then(function(items) {
    var maxNum = 0;
    items.forEach(function(item) {
      var n = parseInt(item.item_number.replace('MAS-', ''));
      if (n > maxNum) maxNum = n;
    });
    return 'MAS-' + String(maxNum + 1).padStart(3, '0');
  });
}

// ─── Anomalies (Public) ───
function getAnomalies(params) {
  return getMergedList().then(function(items) {
    params = params || {};
    items = items.filter(function(a) { return a.status === 'approved' && !a._deleted; });

    if (params.class && params.class !== 'all') {
      items = items.filter(function(a) { return a.class === params.class; });
    }
    if (params.search) {
      var s = params.search.toLowerCase();
      items = items.filter(function(a) {
        return a.item_number.toLowerCase().indexOf(s) !== -1 ||
               a.title.toLowerCase().indexOf(s) !== -1;
      });
    }

    items.sort(function(a, b) { return b.id - a.id; });

    var page = Math.max(1, parseInt(params.page) || 1);
    var limit = Math.min(50, Math.max(1, parseInt(params.limit) || 12));
    var total = items.length;
    var totalPages = Math.ceil(total / limit);
    var paged = items.slice((page - 1) * limit, page * limit);

    return { items: paged, total: total, page: page, limit: limit, totalPages: totalPages };
  });
}

function getAnomaly(id) {
  return getMergedList().then(function(items) {
    var a = null;
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === parseInt(id) && items[i].status === 'approved') {
        a = items[i];
        break;
      }
    }
    if (!a) throw new Error('异常项目未找到');
    return loadDetail(a.item_number).then(function(full) {
      if (full) {
        var local = getLocal().anomalies || {};
        if (local[a.item_number]) return mergeAnomaly(full, local[a.item_number]);
        return full;
      }
      // 回退：使用内嵌索引数据（无完整描述）
      return a;
    });
  });
}

// ─── User Submission ───
function submitAnomaly(formData) {
  return new Promise(function(resolve, reject) {
    var d = ensureLocal();
    var exists = EMBEDDED_INDEX.some(function(i) { return i.item_number === formData.item_number; }) || (d.anomalies || {})[formData.item_number];
    if (exists) { reject(new Error('项目编号已存在')); return; }
    var now = new Date().toISOString();
    var id = d.nextId++;
    d.anomalies[formData.item_number] = {
      id: id,
      item_number: formData.item_number,
      title: formData.title,
      class: formData.cls,
      description: formData.description,
      containment_procedures: formData.containment_procedures,
      status: 'pending',
      created_at: now,
      updated_at: now
    };
    saveLocal(d);
    resolve({ message: '档案已提交，等待管理员审核' });
  });
}

// ─── Admin CRUD ───
function createAnomaly(formData) {
  return new Promise(function(resolve, reject) {
    var d = ensureLocal();
    var exists = EMBEDDED_INDEX.some(function(i) { return i.item_number === formData.item_number; }) || (d.anomalies || {})[formData.item_number];
    if (exists) { reject(new Error('项目编号已存在')); return; }
    var now = new Date().toISOString();
    var id = d.nextId++;
    var item = {
      id: id, item_number: formData.item_number, title: formData.title, class: formData.cls,
      description: formData.description, containment_procedures: formData.containment_procedures,
      status: 'approved', created_at: now, updated_at: now
    };
    d.anomalies[formData.item_number] = item;
    saveLocal(d);
    resolve(item);
  });
}

function updateAnomaly(id, formData) {
  return getMergedList().then(function(items) {
    var target = null;
    for (var i = 0; i < items.length; i++) { if (items[i].id === parseInt(id)) { target = items[i]; break; } }
    if (!target) throw new Error('异常项目未找到');

    var d = ensureLocal();
    var dup = EMBEDDED_INDEX.some(function(i) { return i.item_number === formData.item_number && i.id !== parseInt(id); });
    if (dup) throw new Error('项目编号已存在');

    var updated = {
      id: parseInt(id), item_number: formData.item_number, title: formData.title, class: formData.cls,
      description: formData.description, containment_procedures: formData.containment_procedures,
      status: target.status, created_at: target.created_at, updated_at: new Date().toISOString()
    };
    d.anomalies[formData.item_number] = updated;
    if (formData.item_number !== target.item_number) delete d.anomalies[target.item_number];
    saveLocal(d);
    return updated;
  });
}

function deleteAnomaly(id) {
  return getMergedList().then(function(items) {
    var target = null;
    for (var i = 0; i < items.length; i++) { if (items[i].id === parseInt(id)) { target = items[i]; break; } }
    if (!target) throw new Error('异常项目未找到');
    var d = ensureLocal();
    d.anomalies[target.item_number] = { id: parseInt(id), item_number: target.item_number, _deleted: true };
    saveLocal(d);
    return { message: '删除成功' };
  });
}

// ─── Admin 管理列表 ───
function adminGetAnomalies(params) {
  return getMergedList().then(function(items) {
    params = params || {};
    items = items.filter(function(a) { return !a._deleted; });
    items.sort(function(a, b) { return b.id - a.id; });
    var page = Math.max(1, parseInt(params.page) || 1);
    var limit = Math.min(50, Math.max(1, parseInt(params.limit) || 15));
    var total = items.length;
    return { items: items.slice((page-1)*limit, page*limit), total: total, page: page, limit: limit, totalPages: Math.ceil(total/limit) };
  });
}

function adminGetAnomaly(id) {
  return getMergedList().then(function(items) {
    var a = null;
    for (var i = 0; i < items.length; i++) { if (items[i].id === parseInt(id) && !items[i]._deleted) { a = items[i]; break; } }
    if (!a) throw new Error('异常项目未找到');
    return loadDetail(a.item_number).then(function(full) {
      if (full) {
        var local = getLocal().anomalies || {};
        if (local[a.item_number]) return mergeAnomaly(full, local[a.item_number]);
        return full;
      }
      return a;
    });
  });
}

// ─── Admin 审核 ───
function getPendingAnomalies(params) {
  return new Promise(function(resolve) {
    params = params || {};
    var d = ensureLocal();
    var items = Object.keys(d.anomalies).map(function(k) { return d.anomalies[k]; })
      .filter(function(a) { return a.status === 'pending' && !a._deleted; });
    items.sort(function(a, b) { return b.id - a.id; });
    var page = Math.max(1, parseInt(params.page) || 1);
    var limit = Math.min(50, parseInt(params.limit) || 15);
    var total = items.length;
    resolve({
      items: items.slice((page-1)*limit, page*limit),
      total: total, page: page, limit: limit, totalPages: Math.ceil(total/limit)
    });
  });
}

function reviewAnomaly(id, action) {
  return new Promise(function(resolve, reject) {
    var d = ensureLocal();
    var found = null, foundKey = null;
    Object.keys(d.anomalies).forEach(function(k) {
      if (d.anomalies[k].id === parseInt(id)) { found = d.anomalies[k]; foundKey = k; }
    });
    if (!found) { reject(new Error('档案未找到')); return; }
    if (found.status !== 'pending') { reject(new Error('该档案不需要审核')); return; }
    if (action === 'approve') { found.status = 'approved'; found.updated_at = new Date().toISOString(); }
    else { delete d.anomalies[foundKey]; }
    saveLocal(d);
    resolve({ message: action === 'approve' ? '审核通过' : '已拒绝并删除' });
  });
}

// ─── Stats ───
function getStats() {
  return getMergedList().then(function(items) {
    items = items.filter(function(a) { return !a._deleted; });
    var total = items.length;
    var classMap = {};
    items.forEach(function(a) { classMap[a.class] = (classMap[a.class] || 0) + 1; });
    var byClass = Object.keys(classMap).map(function(k) { return { class: k, count: classMap[k] }; })
      .sort(function(a, b) { return b.count - a.count; });
    return { total: total, byClass: byClass };
  });
}

// ─── Suggestions ───
function submitSuggestion(content, contact) {
  return new Promise(function(resolve) {
    var d = ensureLocal();
    d.suggestions.push({ id: Date.now(), content: content, contact: contact || '', created_at: new Date().toISOString() });
    saveLocal(d);
    resolve({ message: '感谢您的反馈，我们已收到您的意见建议' });
  });
}

function getSuggestions(params) {
  return new Promise(function(resolve) {
    params = params || {};
    var d = ensureLocal();
    var items = d.suggestions.slice().sort(function(a, b) { return b.id - a.id; });
    var page = Math.max(1, parseInt(params.page) || 1);
    var limit = Math.min(50, parseInt(params.limit) || 20);
    var total = items.length;
    resolve({ items: items.slice((page-1)*limit, page*limit), total: total, page: page, limit: limit, totalPages: Math.ceil(total/limit) });
  });
}

function deleteSuggestion(id) {
  return new Promise(function(resolve, reject) {
    var d = ensureLocal();
    var idx = -1;
    for (var i = 0; i < d.suggestions.length; i++) { if (d.suggestions[i].id === parseInt(id)) { idx = i; break; } }
    if (idx === -1) { reject(new Error('记录未找到')); return; }
    d.suggestions.splice(idx, 1);
    saveLocal(d);
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
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
  });
}
