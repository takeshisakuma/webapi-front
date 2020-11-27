//ホスト
const apiHostName = "http://localhost:3000/";

//エンドポイント
const endPoint = "novels/";

//追加フォーム取得
const createFormWrapper = document.querySelector(
  '[data-js="createFormWrapper"]'
);

//更新フォーム取得
const patchFormWrapper = document.querySelector('[data-js="patchFormWrapper"]');

//削除フォーム取得
const deleteFormWrapper = document.querySelector(
  '[data-js="deleteFormWrapper"]'
);

//モーダルの内容切り替え用変数
let modalState = "";

//モーダルウィンドウの内容切り替え処理(開始)
const judgeModalState = (state) => {
  if (state === "createState") {
    createFormWrapper.classList.add("active");
  }
  if (state === "patchState") {
    patchFormWrapper.classList.add("active");
  }
  if (state === "deleteState") {
    deleteFormWrapper.classList.add("active");
  }
};

//モーダルウィンドウの内容切り替え処理(終了)
const initializeModalState = () => {
  createFormWrapper.classList.remove("active");
  patchFormWrapper.classList.remove("active");
  deleteFormWrapper.classList.remove("active");
  createForm.reset();
};

//データ表示領域取得
const displaySpace = document.querySelector('[data-js="displaySpace"]');

//取得処理
const getMethod = () => {
  fetch(apiHostName + endPoint, {
    method: "GET",
  })
    .then((res) => {
      //HTTPステータスコードが200～299の間以外ならエラーを返す
      if (res.ok === false) {
        throw new Error("取得失敗");
      }
      return res;
    })
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      let dataArray = json.map((value, index) => {
        return (
          "<tr>" +
          "<td>" +
          json[index].id +
          "</td>" +
          "<td>" +
          json[index].title +
          "</td>" +
          "<td>" +
          json[index].author +
          "</td>" +
          "<td>" +
          '<button class="tableButton" data-js="preDeleteButton"' +
          " " +
          'data-id="' +
          json[index].id +
          '">削除</button>' +
          "</td>" +
          "<td>" +
          '<button class="tableButton" data-js="prePatchButton"' +
          " " +
          'data-id="' +
          json[index].id +
          '">更新</button>' +
          "</td>" +
          "</tr>"
        );
      });

      const dataStr = dataArray.join("");

      displaySpace.innerHTML =
        '<table class="dataTable">' +
        "<tr><th>ID</th><th>タイトル</th><th>著者</th><th>削除</th><th>更新</th></tr>" +
        //array +
        dataStr +
        "</table>";

      //削除フォーム表示ボタンに削除フォーム表示機能追加
      const preDeleteButtonCollection = document.querySelectorAll(
        '[data-js="preDeleteButton"]'
      );
      const preDeleteButtonArray = Array.from(preDeleteButtonCollection);
      preDeleteButtonArray.map((item) => {
        item.preventDefault;
        item.addEventListener("click", preDeleteMethod, false);
      });

      //更新フォーム表示ボタンに更新フォーム表示機能追加
      const prePatchButtonCollection = document.querySelectorAll(
        '[data-js="prePatchButton"]'
      );
      const prePatchButtonArray = Array.from(prePatchButtonCollection);
      prePatchButtonArray.map((item) => {
        item.preventDefault;
        item.addEventListener("click", prePatchMethod, false);
      });
    })
    .catch((e) => {
      console.log(e.message);
    });
};

//削除フォーム呼び出しボタン取得
const preDeleteButtons = document.querySelectorAll("preDeleteButton");

//削除用form取得
const deleteForm = document.querySelector('[data-js="deleteForm"]');
const deleteFormId = document.querySelector('[data-js="deleteFormId"]');
const deleteFormTitle = document.querySelector('[data-js="deleteFormTitle"]');
const deleteFormAuthor = document.querySelector('[data-js="deleteFormAuthor"]');

//削除フォームのinputに現在の値を入れる
const preDeleteMethod = (e) => {
  //モーダルの表示内容切り替え
  judgeModalState("deleteState");

  deleteForm.dataset.id = e.target.dataset.id;

  fetch(apiHostName + endPoint + e.target.dataset.id, {
    method: "GET",
  })
    .then((res) => {
      //HTTPステータスコードが200～299の間以外ならエラーを返す
      if (res.ok === false) {
        throw new Error("取得失敗");
      }
      return res;
    })
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      deleteFormId.value = json.id;
      deleteFormTitle.value = json.title;
      deleteFormAuthor.value = json.author;
      modalShow();
    })
    .catch((e) => {
      console.log(e.message);
    });
};

//削除処理
const deleteMethod = (id) => {
  fetch(apiHostName + endPoint + id, {
    method: "DELETE",
  })
    .then((res) => {
      //HTTPステータスコードが200～299の間以外ならエラーを返す
      if (res.ok === false) {
        throw new Error("削除失敗");
      }
    })
    .then(() => {
      getMethod();
    })
    .finally(() => {
      modalHide();
    })
    .catch((e) => {
      console.log(e.message);
    });
};

//削除フォームに削除処理を追加
deleteForm.addEventListener("submit", (e) => {
  e.preventDefault();

  deleteMethod(e.target.dataset.id);
});

//新規追加フォーム取得
const createForm = document.querySelector('[data-js="createForm"]');

//新規追加処理
const createMethod = () => {
  //formから送信データ作成
  const formData = new FormData(createForm);

  //送信データオブジェクトに変換
  const jsonData = Object.fromEntries(formData);

  fetch(apiHostName + endPoint, {
    method: "POST",
    //送信データをjson文字列に変換してbodyに指定
    body: JSON.stringify(jsonData),

    //ヘッダー指定
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => {
      //HTTPステータスコードが200～299の間以外ならエラーを返す
      if (res.ok === false) {
        throw new Error("追加失敗");
      }
      console.log(res.status);
    })
    .then(() => {
      //post後に現在のJSONを取得して表示
      getMethod();
    })
    .then(() => {
      //post後にinputをクリア
      createForm.reset();
    })
    .catch((e) => {
      console.log(e.message);
    })
    .finally(() => {
      //モーダル終了
      modalHide();
    });
};
//新規追加フォームに新規追加処理を追加
createForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //新規追加
  createMethod();
});

//更新用form取得
const patchForm = document.querySelector('[data-js="patchForm"]');
const patchFormId = document.querySelector('[data-js="patchFormId"]');
const patchFormTitle = document.querySelector('[data-js="patchFormTitle"]');
const patchFormAuthor = document.querySelector('[data-js="patchFormAuthor"]');

//更新前 フォームのinputに現在の値を入れる
const prePatchMethod = (e) => {
  //モーダルの表示内容切り替え
  judgeModalState("patchState");

  //現在値の取得
  fetch(apiHostName + endPoint + e.target.dataset.id, {
    method: "GET",
  })
    .then((res) => {
      //HTTPステータスコードが200～299の間以外ならエラーを返す
      if (res.ok === false) {
        throw new Error("取得失敗");
      }
      return res;
    })
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      patchForm.dataset.id = e.target.dataset.id;
      patchFormId.value = json.id;
      patchFormTitle.value = json.title;
      patchFormAuthor.value = json.author;
      modalShow();
    })
    .catch((e) => {
      console.log(e.message);
    });
};

//更新処理
const patchMethod = (id) => {
  //formから送信データを作成
  const formData = new FormData(patchForm);
  //送信データオブジェクトに変換
  const jsonData = Object.fromEntries(formData);

  //更新処理
  fetch(apiHostName + endPoint + id, {
    method: "PATCH",
    //送信データをjson文字列に変換してbodyに指定
    body: JSON.stringify(jsonData),

    //ヘッダー指定
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => {
      //HTTPステータスコードが200～299の間以外ならエラーを返す
      if (res.ok === false) {
        throw new Error("更新失敗");
      }
      return res.text();
    })
    .then(() => {
      //post後に現在のJSONを取得して表示
      getMethod();
    })
    .then(() => {
      //post後にinputをクリア
      patchForm.reset();
    })
    .catch((e) => {
      console.log(e.message);
    })
    .finally(() => {
      modalHide();
    });
};

//更新フォームに更新処理を追加
patchForm.addEventListener("submit", (e) => {
  e.preventDefault();

  patchMethod(e.target.dataset.id);
});

//モーダルで使う要素取得
const preCreateButton = document.querySelector('[data-js="preCreateButton"]');
const overLay = document.querySelector('[data-js="overLay"]');
const modalWindow = document.querySelector('[data-js="modalWindow"]');
const modalHideButton = document.querySelector('[data-js="modalHide"]');

//モーダル開始
const modalShow = () => {
  overLay.classList.add("active");
  modalWindow.classList.add("active");
};

//モーダル終了
const modalHide = () => {
  overLay.classList.remove("active");
  modalWindow.classList.remove("active");
  initializeModalState();
};

//新規作成ボタンを押したらstate更新、モーダル開始
preCreateButton.addEventListener("click", () => {
  //モーダルの内容切り替え
  judgeModalState("createState");

  //モーダル表示
  modalShow();
});

//オーバーレイを押したらモーダル解除
overLay.addEventListener("click", () => {
  modalHide();
});

//キャンセルボタンでモーダル解除
modalHideButton.addEventListener("click", () => {
  modalHide();
});

//初期データ表示
getMethod();
