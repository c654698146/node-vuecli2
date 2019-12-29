<template>
  <div class="fillContainer">
    <div>
      <el-form :inline="true" ref="add_data" :model="search_data">
        <el-form-item label="按时间筛选：">
          <el-date-picker v-model="search_data.start_time" type="datetime" placeholder="选择开始时间"></el-date-picker>
          <span>--</span>
          <el-date-picker v-model="search_data.end_time" type="datetime" placeholder="选择结束时间"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" icon="search" @click="handleSearch()">查询</el-button>
        </el-form-item>
        <el-form-item class="btnright">
          <el-button
            type="primary"
            size="small"
            icon="view"
            :disabled="status"
            @click="handleadd()"
          >添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table :data="tableData" max-height="900" border style="width: 100%">
        <el-table-column type="index" label="序号" align="center" width="70"></el-table-column>
        <el-table-column prop="date" label="创建时间" align="center" width="250">
          <template v-slot="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="收支类型" align="center" width="150"></el-table-column>
        <el-table-column prop="describe" label="收支描述" align="center" width="180"></el-table-column>
        <el-table-column prop="income" label="收入" align="center" width="170">
          <template v-slot="scope">
            <span style="color:#00d053">{{ scope.row.income }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="expend" label="支出" align="center" width="170">
          <template v-slot="scope">
            <span style="color:#f56767">{{ scope.row.expend }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cash" label="账户现金" align="center" width="170">
          <template v-slot="scope">
            <span style="color:#4db3ff">{{ scope.row.cash }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="160">
          <template slot-scope="scope">
            <el-button
              size="small"
              :disabled="status"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              size="small"
              :disabled="status"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :span="24">
          <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="paginations.page_index"
              :page-sizes="paginations.page_sizes"
              :page-size="paginations.page_size"
              :layout="paginations.layout"
              :total="paginations.total"
            ></el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
    <Dialog :dialog="dialog" :formdata="formdata" @update="getProfile()"></Dialog>
  </div>
</template>
<script>
import Dialog from "../components/Dialog";
export default {
  name: "fundlist",
  data() {
    return {
      status: "",
      search_data: {
        start_time: "",
        end_time: ""
      },
      filterTableData: [],
      paginations: {
        page_index: 1,
        total: 0,
        page_size: 5,
        page_sizes: [5, 10, 15],
        layout: "total,sizes,prev,pager,next,jumper"
      },
      tableData: [],
      allTableData: [],
      formdata: {
        type: "",
        describe: "",
        income: "",
        expend: "",
        cash: "",
        remark: "",
        id: ""
      },
      dialog: {
        show: false,
        title: "",
        option: "edit"
      }
    };
  },

  created() {
    this.status = this.$store.getters.user.identity == "manager" ? false : true;
    this.getProfile();
  },
  methods: {
    getProfile() {
      this.$axios
        .get("/api/profiles")
        .then(res => {
          this.allTableData = res.data;
          this.filterTableData = res.data;
          this.setPaginations();
        })
        .catch(err => console.log(err));
    },
    handleEdit(index, row) {
      this.dialog = {
        show: true,
        title: "修改资金信息",
        option: "edit"
      };
      this.formdata = {
        type: row.type,
        describe: row.describe,
        income: row.income,
        expend: row.expend,
        cash: row.cash,
        remark: row.remark,
        id: row._id
      };
      console.log(this.formdata);
    },
    handleDelete(index, row) {
      this.$axios
        .delete(`/api/profiles/delete/${row._id}`)
        .then(res => {
          this.$message({ message: "删除成功", type: "success" });
          this.getProfile();
        })
        .catch(err => console.log(err));
    },
    handleadd() {
      this.dialog = {
        show: true,
        title: "添加资金信息",
        option: "add"
      };
      this.formdata = {
        type: "",
        describe: "",
        income: "",
        expend: "",
        cash: "",
        remark: "",
        id: ""
      };
    },
    setPaginations() {
      this.paginations.total = this.allTableData.length;
      this.paginations.page_index = 1;
      this.paginations.page_size = 5;
      this.tableData = this.allTableData.filter((item, index) => {
        return index < this.paginations.page_size;
      });
    },
    handleSizeChange(page_size) {
      this.paginations.page_index = 1;
      this.paginations.page_size = page_size;
      this.tableData = this.allTableData.filter((item, index) => {
        return index < page_size;
      });
    },
    handleCurrentChange(page) {
      let index = this.paginations.page_size * (page - 1);
      let nums = this.paginations.page_size * page;
      let tables = [];
      for (let i = index; i < nums; i++) {
        if (this.allTableData[i]) {
          tables.push(this.allTableData[i]);
        }
        this.tableData = tables;
      }
    },
    handleSearch() {
      if (!this.search_data.start_time || !this.search_data.end_time) {
        this.$message({
          type: "warning",
          message: "请选择时间"
        });
        this.getProfile();
      }
      const sTime = this.search_data.start_time.getTime();
      const eTime = this.search_data.end_time.getTime();

      this.allTableData = this.filterTableData.filter(item => {
        let date = new Date(item.date);
        let time = date.getTime();
        return time >= sTime && time <= eTime;
      });
      this.setPaginations();
    }
  },

  components: { Dialog }
};
</script>
<style scoped>
.fillContainer {
  width: 100%;
  height: 100%;
  padding: 3px;
  box-sizing: border-box;
}
.btnright {
  float: right;
}
.pagination {
  text-align: right;
  margin-top: 10px;
}
</style>