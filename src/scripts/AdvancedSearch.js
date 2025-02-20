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
// console.log(getCookie("token"))

//功能開始
//關鍵字，年份區間
async function startAnalysis_keywordYear() {
  showChart.value = false; //預處理，避免上一個圖表還在
  const refresh = get_results(1);
  const requestData = {
    token: getCookie("token"),
    workspace: currentWorkspace.value,
    files: work_file.value,
    start: startYear.value,
    end: endYear.value,
    threshold: lower_limit.value,
  };
  try {
    const response = await fetch(
      "https://wos-data-analysis-backend.onrender.com/api/keywordAnalysis/year",
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
  drawChart1();
}

async function startAnalysis_singleKeyword() {
  showChart.value = false; //預處理，避免上一個圖表還在
  const refresh = get_results(1);
  const requestData = {
    token: getCookie("token"),
    workspace: currentWorkspace.value,
    files: work_file.value,
    keyword: single_key.value,
  };
  try {
    const response = await fetch(
      "https://wos-data-analysis-backend.onrender.com/api/keywordAnalysis/keyword",
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
  const requestData = {
    token: getCookie("token"),
    workspace: currentWorkspace.value,
    files: work_file.value,
    start: startYear.value,
    end: endYear.value,
    threshold: lower_limit.value,
  };
  try {
    const response = await fetch(
      "https://wos-data-analysis-backend.onrender.com/api/authorAnalysis/year",
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
  const requestData = {
    token: getCookie("token"),
    workspace: currentWorkspace.value,
    files: work_file.value,
    threshold: lower_limit.value,
  };
  try {
    const response = await fetch(
      "https://wos-data-analysis-backend.onrender.com/api/referenceCountAnalysis/generalInfo",
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
  const refresh = get_results(1);
  const requestData = {
    token: getCookie("token"),
    workspace: currentWorkspace.value,
    files: work_file.value,
    start: startYear.value,
    end: endYear.value,
    threshold: lower_limit.value,
  };
  try {
    const response = await fetch(
      "https://wos-data-analysis-backend.onrender.com/api/fieldAnalysis/year",
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
  const requestData = {
    token: getCookie("token"),
    workspace: currentWorkspace.value,
    files: work_file.value,
    field: single_field.value,
  };
  try {
    const response = await fetch(
      "https://wos-data-analysis-backend.onrender.com/api/fieldAnalysis/field",
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
  const requestData = {
    // email: localStorage.getItem("email"),
    // password: localStorage.getItem("password"),
    token: getCookie("token"),
  };
  waitComp.value = true;
  let maxRetries = max_r;
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      const response = await fetch(
        "https://wos-data-analysis-backend.onrender.com/api/getResult",
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
