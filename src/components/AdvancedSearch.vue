<template>
  <div class="advanced-search">
    <div class="ads-top">
      <div class="dropdown">
        <button class="dropbtn" @click="toggleDropdown">選擇分析功能</button>
        <div class="dropdown-content" v-show="dropdownOpen">
          <a
            @click="
              hidden_btn();
              show_search(1);
            "
            >關鍵字/年份區間</a
          >
          <a
            @click="
              hidden_btn();
              show_search(3);
            "
            >關鍵字</a
          >
          <a
            @click="
              hidden_btn();
              show_search(4);
            "
            >作者</a
          >
          <a
            @click="
              hidden_btn();
              show_search(5);
            "
            >引用次數</a
          >
          <a
            @click="
              hidden_btn();
              show_search(6);
            "
            >研究領域</a
          >
          <a
            @click="
              hidden_btn();
              show_search(8);
            "
            >領域成長</a
          >
          <!-- <a
            @click="
              hidden_btn();
              show_search(9);
            "
            >作者/年份區間</a
          > -->
          <a
            @click="
              hidden_btn();
              show_search(10);
            "
            >學術機構/年份區間</a
          >
          <a
            @click="
              hidden_btn();
              show_search(11);
            "
            >國家/年份區間</a
          >
        </div>
      </div>
      <!-- <button class="btn-option" @click="hidden_btn()" v-if="!btn_show">
        返回
      </button> -->

      <div class="search-group">
        <!-- 關鍵字，年份區間 -->
        <div class="year-keyword search-item" v-if="search_block === 1">
          <p>請輸入年份區間，系統會顯示該區間之關鍵字及出現次數</p>
          <label>
            開始年:
            <input type="number" v-model="startYear" class="small-input" />
          </label>
          <label>
            結束年:
            <input type="number" v-model="endYear" class="small-input" />
          </label>
          <label>
            最少出現次數(下限):
            <input type="number" v-model="lower_limit" class="small-input" />
          </label>
          <div>
            <input
              type="button"
              value="開始分析"
              @click="startAnalysis_keywordYear()"
            />
          </div>
        </div>

        <!-- 單一關鍵字 -->
        <div class="single-keyword search-item" v-if="search_block === 3">
          <p>根據關鍵字做查詢，可觀察該關鍵字每年的成長趨勢</p>
          <label>
            輸入關鍵字
            <input
              type="text"
              v-model="single_key"
              @keyup.enter="startAnalysis_singleKeyword()"
              class="small-input"
            />
          </label>
          <div>
            <input
              type="button"
              value="開始分析"
              @click="startAnalysis_singleKeyword()"
            />
          </div>
        </div>

        <!-- 作者 年份區間 -->
        <div class="year-author search-item" v-if="search_block === 4">
          <p>根據年份區間對作者做分析（看年份區間內作者發表了幾篇）</p>
          <label>
            開始年:
            <input type="number" v-model="startYear" class="small-input" />
          </label>
          <label>
            結束年:
            <input type="number" v-model="endYear" class="small-input" />
          </label>
          <label>
            最少出現次數(下限):
            <input type="number" v-model="lower_limit" class="small-input" />
          </label>
          <div>
            <input
              type="button"
              value="開始分析"
              @click="startAnalysis_yearAuthor()"
            />
          </div>
        </div>
        <!-- 根據引用次數做分析（一併提供標題和作者資訊） -->
        <div class="author-cite search-item" v-if="search_block === 5">
          <p>根據引用次數做分析（一併提供標題和作者資訊）</p>
          <label>
            被引用最少次數(下限):
            <input type="number" v-model="lower_limit" class="small-input" />
          </label>
          <div>
            <input
              type="button"
              value="開始分析"
              @click="startAnalysis_author_cite()"
            />
          </div>
        </div>

        <!-- 領域 年份區間 -->
        <div class="field-year search-item" v-if="search_block === 6">
          <p>根據年份區間做研究領域分析</p>
          <label>
            開始年:
            <input type="number" v-model="startYear" class="small-input" />
          </label>
          <label>
            結束年:
            <input type="number" v-model="endYear" class="small-input" />
          </label>
          <label>
            最少出現次數(下限):
            <input type="number" v-model="lower_limit" class="small-input" />
          </label>
          <div>
            <input
              type="button"
              value="開始分析"
              @click="startAnalysis_fieldYear()"
            />
          </div>
        </div>
        <!-- 單一領域成長趨勢 -->
        <div class="single-field search-item" v-if="search_block === 8">
          <p>根據研究領域做查詢，可觀察該研究領域每年的成長趨勢</p>
          <label>
            輸入關鍵字
            <input
              type="text"
              v-model="single_field"
              @keyup.enter="startAnalysis_singleField()"
              class="small-input"
            />
          </label>
          <div>
            <input
              type="button"
              value="開始分析"
              @click="startAnalysis_singleField()"
            />
          </div>
        </div>
        <!-- 作者/年份區間
        <div class="single-field search-item" v-if="search_block === 9">
          <p>作者/年份區間</p>
          <label>
            開始年:
            <input type="number" v-model="startYear" class="small-input" />
          </label>
          <label>
            結束年:
            <input type="number" v-model="endYear" class="small-input" />
          </label>
          <label>
            最少出現次數(下限):
            <input type="number" v-model="lower_limit" class="small-input" />
          </label>
          <div>
            <input
              type="button"
              value="開始分析"
              @click="startAnalysis_institution()"
            />
          </div>
        </div> -->
        <!-- 學術機構/年份區間 -->
        <div class="single-field search-item" v-if="search_block === 10">
          <p>學術機構/年份區間</p>
          <label>
            開始年:
            <input type="number" v-model="startYear" class="small-input" />
          </label>
          <label>
            結束年:
            <input type="number" v-model="endYear" class="small-input" />
          </label>
          <label>
            最少出現次數(下限):
            <input type="number" v-model="lower_limit" class="small-input" />
          </label>
          <div>
            <input
              type="button"
              value="開始分析"
              @click="startAnalysis_institutionYear()"
            />
          </div>
        </div>
        <!-- 國家/年份區間 -->
        <div class="single-field search-item" v-if="search_block === 11">
          <p>國家/年份區間</p>
          <label>
            開始年:
            <input type="number" v-model="startYear" class="small-input" />
          </label>
          <label>
            結束年:
            <input type="number" v-model="endYear" class="small-input" />
          </label>
          <label>
            最少出現次數(下限):
            <input type="number" v-model="lower_limit" class="small-input" />
          </label>
          <div>
            <input
              type="button"
              value="開始分析"
              @click="startAnalysis_countryYear()"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="chart-show">
      <div id="chart" v-if="showChart"></div>
      <VueSpinnerHourglass size="40px" color="blue" v-if="waitComp" />
      <h3 v-if="waitComp">資料分析需要時間，請勿重複點擊開始分析</h3>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { VueSpinnerHourglass } from "vue3-spinners";

//前置資料
const dropdownOpen = ref(false);
const btn_show = ref(true);
const search_block = ref(0);
const startYear = ref(1950);
const endYear = ref(2024);
const lower_limit = ref(1);
const single_key = ref("");
const single_field = ref("");
const showChart = ref(false);
const waitComp = ref(false);
const subtitle = ref("");

const temp_id = ref("200270e4-2982-409f-8424-e3817969ca80");

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const props = defineProps({
  selectedWorkspace: {
    type: String,
    required: true,
  },
  files: {
    type: Array,
    required: true,
  },
});

const currentWorkspace = ref(props.selectedWorkspace);
const work_file = ref(props.files.map((file) => file.name));

watch(
  () => props.selectedWorkspace,
  (newValue) => {
    currentWorkspace.value = newValue;
    btn_show.value = true;
    search_block.value = 0;
    showChart.value = false;
  }
);

watch(
  () => props.files,
  (newFiles) => {
    work_file.value = newFiles.map((file) => file.name);
  }
);

const hidden_btn = () => {
  btn_show.value = !btn_show.value;
  if (btn_show.value === true) search_block.value = 0;
  showChart.value = false;
};

const show_search = (index) => {
  search_block.value = index;
};

const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

//功能開始
//關鍵字，年份區間
async function startAnalysis_keywordYear() {
  showChart.value = false; //預處理，避免上一個圖表還在

  const currentWorkspace = temp_id; // 之後要放workspace的id
  const refresh = get_results(1);
  const requestData = {
    start: startYear.value,
    end: endYear.value,
    threshold: lower_limit.value,
  };
  try {
    // 會提交工作區 文件列表 起訖時間 最少出現次數
    // "關鍵字"：給使用者利用年份起訖進行搜尋，分析這段區間所出現的關鍵字及它們在此期間出現的總次數
    const response = await fetch(
      `https://backend-refactor-nqz1.onrender.com/workspaces/${currentWorkspace.value}/analysis/keyword/year`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }
    );

    if (!response.ok) {
      throw new Error("API request failed");
    }
    const responseData = await response.json();
    console.log(responseData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  drawChart1();
}

async function startAnalysis_singleKeyword() {
  showChart.value = false; //預處理，避免上一個圖表還在
  const refresh = get_results(1);
  const currentWorkspace = temp_id; // 之後要放workspace的id
  const requestData = {
    keyword: single_key.value,
  };
  try {
    // 會提交工作區 文件列表 user指定的關鍵字
    // "關鍵字成長"：使用者可以查詢一個關鍵字，此API的用途是統計這個關鍵字於歷年成長的趨勢
    const response = await fetch(
      `https://backend-refactor-nqz1.onrender.com/workspaces/${currentWorkspace.value}/analysis/keyword`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }
    );

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const responseData = await response.json();
    // console.log(responseData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  drawChart2();
}

async function startAnalysis_yearAuthor() {
  showChart.value = false; //預處理，避免上一個圖表還在
  const refresh = get_results(1);
  const currentWorkspace = temp_id; // 之後要放workspace的id
  const requestData = {
    start: startYear.value,
    end: endYear.value,
    threshold: lower_limit.value,
  };
  try {
    // 會提交工作區 文件列表 user指定的作者名稱
    // "作者"：使用者輸入起訖年與作者名稱後，統計作者於此期間發表的數量
    const response = await fetch(
      `https://backend-refactor-nqz1.onrender.com/workspaces/${currentWorkspace.value}/analysis/author/year`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }
    );

    if (!response.ok) {
      throw new Error("API request failed");
    }
    const responseData = await response.json();
    console.log(responseData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  drawChart3();
}

async function startAnalysis_author_cite() {
  showChart.value = false; //預處理，避免上一個圖表還在
  const refresh = get_results(1);
  const currentWorkspace = temp_id; // 之後要放workspace的id
  const requestData = {
    threshold: lower_limit.value,
  };
  try {
    // 會提交工作區 文件列表 user指定的最少引用次數
    // "引用次數"：輸入最少次數後，列出>=該引用次數的標題和作者資訊
    const response = await fetch(
      `https://backend-refactor-nqz1.onrender.com/workspaces/${currentWorkspace.value}/analysis/reference`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }
    );

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const responseData = await response.json();
    console.log(responseData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  drawChart4();
}

//根據年份區間做研究領域分析
async function startAnalysis_fieldYear() {
  showChart.value = false; //預處理，避免上一個圖表還在
  const currentWorkspace = temp_id; // 之後要放workspace的id
  const refresh = get_results(1);
  const requestData = {
    start: startYear.value,
    end: endYear.value,
    threshold: lower_limit.value,
  };
  try {
    // 會提交工作區 文件列表 起訖年 最少出現次數數值
    // "研究領域"：統計在某區間裡面，各個研究領域分析的論文數目
    const response = await fetch(
      `https://backend-refactor-nqz1.onrender.com/workspaces/${currentWorkspace.value}/analysis/field/year`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }
    );

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const responseData = await response.json();
    console.log(responseData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  drawChart_fieldYear();
  // const result = await get_results();
  // console.log(result)
}

//領域 單一
async function startAnalysis_singleField() {
  showChart.value = false; //預處理，避免上一個圖表還在
  const refresh = get_results(1);
  const currentWorkspace = temp_id; // 之後要放workspace的id
  const requestData = {
    field: single_field.value,
  };
  try {
    const response = await fetch(
      // 會提交工作區 文件列表 user指定的關鍵字
      // "領域成長"：輸入關鍵字後，分析該領域每年的成長趨勢
      `https://backend-refactor-nqz1.onrender.com/workspaces/${currentWorkspace.value}/analysis/field`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }
    );

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const responseData = await response.json();
    console.log(responseData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  drawChart_singleField();
}

// 學術機構
// async function startAnalysis_institution() {
//   //因為後端原因，暫時無法實作
//   showChart.value = false; //預處理，避免上一個圖表還在
//   const refresh = get_results(10);
//   const currentWorkspace = temp_id; // 之後要放workspace的id
//   const requestData = {
//     start: startYear.value,
//     end: endYear.value,
//     threshold: lower_limit.value,
//   };
//   try {
//     const response = await fetch(
//       `https://backend-refactor-nqz1.onrender.com/workspaces/${currentWorkspace.value}/analysis/institution`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(requestData),
//       }
//     );

//     if (!response.ok) {
//       throw new Error("API request failed");
//     }

//     const responseData = await response.json();
//     console.log(responseData);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }

//   drawChart_institution();
// }

// 學術機構/年份區間
async function startAnalysis_institutionYear() {
  showChart.value = false; //預處理，避免上一個圖表還在
  const refresh = get_results(10);
  const currentWorkspace = temp_id; // 之後要放workspace的id
  const requestData = {
    start: startYear.value,
    end: endYear.value,
    threshold: lower_limit.value,
  };
  try {
    const response = await fetch(
      `https://backend-refactor-nqz1.onrender.com/workspaces/${currentWorkspace.value}/analysis/institution/year`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }
    );

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const responseData = await response.json();
    console.log(responseData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  drawChart_institutionYear();
}

// 國家/年份區間
async function startAnalysis_countryYear() {
  showChart.value = false; //預處理，避免上一個圖表還在
  const refresh = get_results(10);
  const currentWorkspace = temp_id; // 之後要放workspace的id
  const requestData = {
    start: startYear.value,
    end: endYear.value,
    threshold: lower_limit.value,
  };
  console.log(requestData);
  try {
    const response = await fetch(
      `https://backend-refactor-nqz1.onrender.com/workspaces/${currentWorkspace.value}/analysis/country/year`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }
    );

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const responseData = await response.json();
    console.log(responseData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  drawChart_countryYear();
}

//物件比較函式
function shallowEqual(obj1, obj2) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}

//獲取資料區塊
async function get_results(max_r) {
  // console.log(api_check,d.files)
  const currentWorkspace = temp_id; // 之後要放workspace的id
  waitComp.value = true;
  let maxRetries = max_r;
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      const response = await fetch(
        `https://backend-refactor-nqz1.onrender.com/workspaces/${currentWorkspace.value}/analysis/result`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("API request failed");
      }
      const responseData = await response.json();
      waitComp.value = false;
      showChart.value = true;
      return responseData;
    } catch (error) {
      console.error("Error fetching data, retrying...", error.response);
      attempt++;
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
  //最終失敗處理
  waitComp.value = false;
  throw new Error("API request failed after maximum retries");
}

async function drawChart1() {
  const result = await get_results(10);
  const topData = result.results.slice(1, 50); //省略最大第一筆
  //子標題無法使用
  // const request = result.request;
  // const subt ="Lower limit: " + request.threshold + ", " + request.start + "~" +request.end

  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(async () => {
    const data = new google.visualization.DataTable();
    data.addColumn("string", "Keyword");
    data.addColumn("number", "Count");

    const dataArray = topData.map((item) => [item.keyword, item.count]);
    data.addRows(dataArray);

    const options = {
      title: "Keyword Analysis",
      legend: { position: "none" },
      vAxis: { title: "Count" },
      hAxis: { title: "Keywords" },
      width: "100%",
      height: "100%",
    };

    const chart = new google.visualization.ColumnChart(
      document.getElementById("chart")
    );
    chart.draw(data, options);
  });
}

async function drawChart2() {
  const result = await get_results(10);
  const topData = result.results;
  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(async () => {
    const data = new google.visualization.DataTable();
    data.addColumn("number", "Year");
    data.addColumn("number", "Count");

    const dataArray = topData.map((item) => [item.year, item.count]);
    data.addRows(dataArray);

    const options = {
      title: "Keyword Analysis",
      legend: { position: "none" },
      hAxis: {
        title: "Year",
        format: "####", // Ensures the year is displayed without decimals
        gridlines: {
          count: data.getNumberOfRows() / 2, // Ensures gridlines match the number of data points
        },
      },
      pointSize: 5,
      vAxis: {
        title: "Count",
      },
    };

    const chart = new google.visualization.LineChart(
      document.getElementById("chart")
    );
    chart.draw(data, options);
  });
}

async function drawChart3() {
  const result = await get_results(10);
  const topData = result.results.slice(0, 100);

  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(async () => {
    const data = new google.visualization.DataTable();
    data.addColumn("string", "Author");
    data.addColumn("number", "Count");

    const dataArray = topData.map((item) => [item.author, item.count]);
    data.addRows(dataArray);

    const options = {
      title: "Author Analysis",
      legend: { position: "none" },
      hAxis: {
        title: "Author",
      },
      vAxis: {
        title: "Count",
      },
    };
    const chart = new google.visualization.ColumnChart(
      document.getElementById("chart")
    );
    chart.draw(data, options);
  });
}

async function drawChart4() {
  const result = await get_results(10);
  const topData = result.results.slice(0, 50);
  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(async () => {
    const data = new google.visualization.DataTable();
    data.addColumn("string", "Title");

    const authorsSet = new Set();
    topData.forEach((item) => {
      item.author.forEach((author) => {
        authorsSet.add(author);
      });
    });

    authorsSet.forEach((author) => {
      data.addColumn("number", author);
    });

    topData.forEach((item) => {
      const row = new Array(data.getNumberOfColumns()).fill(0);
      row[0] = item.title;
      item.author.forEach((author) => {
        const authorIndex = data.getColumnIndex(author);
        row[authorIndex] = item.count / item.author.length;
      });
      data.addRow(row);
    });

    const options = {
      title: "Paper Citations by Authors",
      isStacked: true,
      hAxis: {
        title: "Title",
      },
      vAxis: {
        title: "Citations",
      },
      height: "100%",
      width: "100%",
    };

    const chart = new google.visualization.BarChart(
      document.getElementById("chart")
    );
    chart.draw(data, options);
  });
}

async function drawChart_fieldYear() {
  const result = await get_results(10);
  const topData = result.results.slice(0, 50);
  //   const topData = result.results.slice(0, 15);
  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(async () => {
    const data = new google.visualization.DataTable();
    data.addColumn("string", "Field");
    data.addColumn("number", "Count");

    const dataArray = topData.map((item) => [item.field, item.count]);
    data.addRows(dataArray);

    const options = {
      title: "Field Analysis",
      legend: { position: "none" },
      hAxis: {
        title: "Fields",
      },
      vAxis: {
        title: "Count",
      },
      height: "100%",
      width: "100%",
    };

    const chart = new google.visualization.ColumnChart(
      document.getElementById("chart")
    );
    chart.draw(data, options);
  });
}

async function drawChart_singleField() {
  const result = await get_results(10);
  const topData = result.results.slice(0, 50);

  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(async () => {
    const data = new google.visualization.DataTable();
    data.addColumn("number", "Year");
    data.addColumn("number", "Count");

    const dataArray = topData.map((item) => [item.year, item.count]);
    data.addRows(dataArray);

    const options = {
      title: "Field Analysis",
      legend: { position: "none" },
      hAxis: {
        title: "Year",
        format: "####", // Ensures the year is displayed without decimals
        gridlines: {
          count: data.getNumberOfRows() / 2, // Ensures gridlines match the number of data points
        },
      },
      pointSize: 5,
      vAxis: {
        title: "Count",
      },
      height: "100%",
      width: "100%",
    };

    const chart = new google.visualization.LineChart(
      document.getElementById("chart")
    );
    chart.draw(data, options);
  });
}

// async function drawChart_institution() {
//   const result = await get_results(10);

//   const topData = result.results_institutions.slice(0, 50);

//   google.charts.load("current", { packages: ["corechart"] });
//   google.charts.setOnLoadCallback(async () => {
//     const data = new google.visualization.DataTable();
//     data.addColumn("string", "publisher");
//     data.addColumn("number", "count");

//     const dataArray = topData.map((item) => [item.institution, item.count]);
//     console.log(topData);
//     console.log(dataArray);
//     data.addRows(dataArray);

//     const options = {
//       title: "Keyword Analysis",
//       legend: { position: "none" },
//       vAxis: { title: "count" },
//       hAxis: { title: "institution" },
//       width: "100%",
//       height: "100%",
//     };

//     const chart = new google.visualization.ColumnChart(
//       document.getElementById("chart")
//     );
//     chart.draw(data, options);
//   });
// }

async function drawChart_institutionYear() {
  const result = await get_results(10);
  const topData = result.results;
  const schoolCounts = {};

  topData.forEach((item) => {
    item.schools.forEach((school) => {
      if (schoolCounts[school.school]) {
        schoolCounts[school.school]++;
      } else {
        schoolCounts[school.school] = 1;
      }
    });
  });
  const dataArray = Object.entries(schoolCounts).map(([school, count]) => [
    school,
    count,
  ]);
  dataArray.sort((a, b) => b[1] - a[1]);

  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(async () => {
    const data = new google.visualization.DataTable();
    data.addColumn("string", "school");
    data.addColumn("number", "count");

    data.addRows(dataArray);

    const options = {
      title: "Keyword Analysis",
      legend: { position: "none" },
      vAxis: { title: "count" },
      hAxis: { title: "school" },
      width: "100%",
      height: "100%",
    };

    const chart = new google.visualization.ColumnChart(
      document.getElementById("chart")
    );
    chart.draw(data, options);
  });
}

async function drawChart_countryYear() {
  const result = await get_results(10);
  const topData = result.results.slice(2)[0].slice(1, 50); //省略最大第一筆
  //子標題無法使用
  // const request = result.request;
  // const subt ="Lower limit: " + request.threshold + ", " + request.start + "~" +request.end

  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(async () => {
    const data = new google.visualization.DataTable();
    data.addColumn("string", "country");
    data.addColumn("number", "count");

    const dataArray = topData.map((item) => [item.country, item.count]);
    console.log(topData);
    console.log(dataArray);
    data.addRows(dataArray);

    const options = {
      title: "Keyword Analysis",
      legend: { position: "none" },
      vAxis: { title: "count" },
      hAxis: { title: "country" },
      width: "100%",
      height: "100%",
    };

    const chart = new google.visualization.ColumnChart(
      document.getElementById("chart")
    );
    chart.draw(data, options);
  });
}
</script>

<style scoped src="../styles/AdvancedSearch.css"></style>
