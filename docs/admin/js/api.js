// ─── MAS API — GitHub Pages 数据层 ───
// 异常档案数据从 docs/异常/ 目录的 JSON 文件加载
// 写入操作（提交、编辑、审核）存储在 localStorage

var ADMIN_PASSWORD = 'MAS';
var LOCAL_KEY = 'mas_local';

// 根据当前页面所在层级自动适配数据目录路径
var DATA_DIR = (function() {
  var p = window.location.pathname;
  if (p.indexOf('/MAS/' + 'admin/') !== -1) return encodeURI('../异常');
  return encodeURI('异常');
})();

// ─── 缓存 ───
var _indexCache = null;

function loadIndex() {
  return _indexCache ? Promise.resolve(_indexCache) : fetch(DATA_DIR + '/index.json')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      _indexCache = data;
      return data;
    });
}

function loadAnomalyFile(itemNumber) {
  return fetch(DATA_DIR + '/' + itemNumber + '.json')
    .then(function(r) { return r.json(); });
}

// ─── 本地存储 (写入操作) ───
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

// ─── 合并数据：本地覆盖优先 ───
function mergeAnomaly(base, local) {
  if (!local) return base;
  var m = {};
  for (var k in base) { m[k] = base[k]; }
  for (var k in local) { m[k] = local[k]; }
  return m;
}

// 从 index.json + 本地覆盖构建完整列表
function getMergedList() {
  return loadIndex().then(function(index) {
    var local = getLocal();
    var localAnoms = (local.anomalies || {});
    return index.map(function(item) {
      if (localAnoms[item.item_number]) {
        return mergeAnomaly(item, localAnoms[item.item_number]);
      }
      return item;
    }).concat(
      Object.keys(localAnoms).filter(function(k) {
        return !index.some(function(i) { return i.item_number === k; });
      }).map(function(k) { return localAnoms[k]; })
    );
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

// ─── Anomalies (Public - 只返回已审核的) ───
function getAnomalies(params) {
  return getMergedList().then(function(items) {
    params = params || {};
    items = items.filter(function(a) { return a.status === 'approved'; });

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
  // 先查本地覆盖
  return getMergedList().then(function(items) {
    var a = items.find(function(item) {
      return item.id === parseInt(id) && item.status === 'approved';
    });
    if (a) return loadAnomalyFile(a.item_number).then(function(full) {
      var local = getLocal().anomalies || {};
      if (local[a.item_number]) return mergeAnomaly(full, local[a.item_number]);
      return full;
    });
    throw new Error('异常项目未找到');
  });
}

// ─── User Submission ───
function submitAnomaly(formData) {
  return new Promise(function(resolve, reject) {
    var d = ensureLocal();
    // 检查 JSON 索引 + 本地是否已存在
    loadIndex().then(function(index) {
      var exists = index.some(function(i) { return i.item_number === formData.item_number; }) ||
                   (d.anomalies || {})[formData.item_number];
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
  });
}

// ─── Admin CRUD ───
function createAnomaly(formData) {
  return new Promise(function(resolve, reject) {
    var d = ensureLocal();
    loadIndex().then(function(index) {
      var exists = index.some(function(i) { return i.item_number === formData.item_number; }) ||
                   (d.anomalies || {})[formData.item_number];
      if (exists) { reject(new Error('项目编号已存在')); return; }

      var now = new Date().toISOString();
      var id = d.nextId++;
      var item = {
        id: id,
        item_number: formData.item_number,
        title: formData.title,
        class: formData.cls,
        description: formData.description,
        containment_procedures: formData.containment_procedures,
        status: 'approved',
        created_at: now,
        updated_at: now
      };
      d.anomalies[formData.item_number] = item;
      saveLocal(d);
      resolve(item);
    });
  });
}

function updateAnomaly(id, formData) {
  return new Promise(function(resolve, reject) {
    return getMergedList().then(function(items) {
      var target = items.find(function(a) { return a.id === parseInt(id); });
      if (!target) { reject(new Error('异常项目未找到')); return; }

      var d = ensureLocal();
      var dup = Object.keys(d.anomalies).some(function(k) {
        return d.anomalies[k].item_number === formData.item_number &&
               d.anomalies[k].id !== parseInt(id);
      });
      if (dup) { reject(new Error('项目编号已存在')); return; }

      // 同时检查 index 中有无冲突
      loadIndex().then(function(index) {
        var idxDup = index.some(function(i) {
          return i.item_number === formData.item_number && i.id !== parseInt(id);
        });
        if (idxDup) { reject(new Error('项目编号已存在')); return; }

        var updated = {
          id: parseInt(id),
          item_number: formData.item_number,
          title: formData.title,
          class: formData.cls,
          description: formData.description,
          containment_procedures: formData.containment_procedures,
          status: target.status,
          created_at: target.created_at,
          updated_at: new Date().toISOString()
        };
        d.anomalies[formData.item_number] = updated;
        if (formData.item_number !== target.item_number) {
          delete d.anomalies[target.item_number];
        }
        saveLocal(d);
        resolve(updated);
      });
    });
  });
}

function deleteAnomaly(id) {
  return new Promise(function(resolve, reject) {
    return getMergedList().then(function(items) {
      var target = items.find(function(a) { return a.id === parseInt(id); });
      if (!target) { reject(new Error('异常项目未找到')); return; }
      var d = ensureLocal();
      d.anomalies[target.item_number] = { id: parseInt(id), item_number: target.item_number, _deleted: true };
      saveLocal(d);
      resolve({ message: '删除成功' });
    });
  });
}

// ─── Admin - 管理列表 ───
function adminGetAnomalies(params) {
  return getMergedList().then(function(items) {
    params = params || {};
    items = items.filter(function(a) { return !a._deleted; });
    items.sort(function(a, b) { return b.id - a.id; });
    var page = Math.max(1, parseInt(params.page) || 1);
    var limit = Math.min(50, Math.max(1, parseInt(params.limit) || 15));
    var total = items.length;
    var totalPages = Math.ceil(total / limit);
    var paged = items.slice((page - 1) * limit, page * limit);
    return { items: paged, total: total, page: page, limit: limit, totalPages: totalPages };
  });
}

function adminGetAnomaly(id) {
  return getMergedList().then(function(items) {
    var a = items.find(function(item) { return item.id === parseInt(id) && !item._deleted; });
    if (!a) throw new Error('异常项目未找到');
    return loadAnomalyFile(a.item_number).then(function(full) {
      var local = getLocal().anomalies || {};
      if (local[a.item_number]) return mergeAnomaly(full, local[a.item_number]);
      return full;
    });
  });
}

// ─── Admin - 审核 ───
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
      items: items.slice((page - 1) * limit, page * limit),
      total: total, page: page, limit: limit,
      totalPages: Math.ceil(total / limit)
    });
  });
}

function reviewAnomaly(id, action) {
  return new Promise(function(resolve, reject) {
    var d = ensureLocal();
    var found = null;
    var foundKey = null;
    Object.keys(d.anomalies).forEach(function(k) {
      if (d.anomalies[k].id === parseInt(id)) { found = d.anomalies[k]; foundKey = k; }
    });
    if (!found) { reject(new Error('档案未找到')); return; }
    if (found.status !== 'pending') { reject(new Error('该档案不需要审核')); return; }
    if (action === 'approve') {
      found.status = 'approved';
      found.updated_at = new Date().toISOString();
    } else {
      delete d.anomalies[foundKey];
    }
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
    items.forEach(function(a) {
      classMap[a.class] = (classMap[a.class] || 0) + 1;
    });
    var byClass = Object.keys(classMap).map(function(k) {
      return { class: k, count: classMap[k] };
    }).sort(function(a, b) { return b.count - a.count; });
    return { total: total, byClass: byClass };
  });
}

// ─── Suggestions ───
function submitSuggestion(content, contact) {
  return new Promise(function(resolve) {
    var d = ensureLocal();
    d.suggestions.push({
      id: Date.now(),
      content: content,
      contact: contact || '',
      created_at: new Date().toISOString()
    });
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
    resolve({
      items: items.slice((page - 1) * limit, page * limit),
      total: total, page: page, limit: limit,
      totalPages: Math.ceil(total / limit)
    });
  });
}

function deleteSuggestion(id) {
  return new Promise(function(resolve, reject) {
    var d = ensureLocal();
    var idx = d.suggestions.findIndex(function(s) { return s.id === parseInt(id); });
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
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });
}
