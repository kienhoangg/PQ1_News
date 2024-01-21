const commonFunc = {
  generateFakeData: (pageSize, total, dataFake) => {
    var reponse = {
      data: [],
      total: total,
    };

    for (let index = 0; index < pageSize; index++) {
      const newObject = {
        ...dataFake,
        Id: `${index}`,
        Key: `${index}`,
      };
      reponse.data.push(newObject);
    }
    return reponse;
  },

  /**
   * ÁP dụng cho text search
   * @param {*} func Function cần debounce
   * @param {*} timeout Thời gian delay
   */
  debounce: (func, timeout = 100) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  },

  /**
   * Convert mảng thành tree view
   * @param {*} list Danh sách cần convert thành tree view
   * @returns Tree dạng: {Parent, Children: []}
   */
  list_to_tree: (list) => {
    if (list.length === 0) {
      return [];
    }
    let _list = [...list];
    let map = {},
      node,
      roots = [],
      i;

    for (i = 0; i < _list.length; i += 1) {
      map[_list[i].Id] = i; // initialize the map
      _list[i].children = []; // initialize the children
    }

    for (i = 0; i < _list.length; i += 1) {
      node = _list[i];
      node.key = node?.Id;
      if (node.ParentId && node.ParentId !== 0) {
        // if you have dangling branches check that map[node.parentId] exists
        node.isLeaf = true;
        _list[map[node.ParentId]]?.children?.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  },

  getBase64: (file) => {
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  },

  dummyRequest: ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  },

  newGuid: () => {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  },

  getCookie: (cname) => {
    let name = cname + '=';
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  },

  deleteAllCookies: () => {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  },

  getNameFileByPath(pathFile) {
    if (!pathFile) return "";

    var name = pathFile.replace(/^.*[\\\/]/, '')
    return name;
  }
};

export default commonFunc;
