<template>
  <div>
    <div class="title hand">我的班级</div>
    <div class="box">
      <!-- 上面标签 -->
      <div style="display: flex;">
        <div class="header">
          <div class="header-tag">
            <div class="tag-left">班级:</div>
            <input
              class="tag-right"
              v-model="inputClassName"
              placeholder="请输入班级"
            />
            <!-- 下拉多选框 -->
            <!--<div>
               <el-select @change="change"  :popper-append-to-body="false" v-model="value" placeholder="请选择">
                <el-option
                  v-for="item in classList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select> 
            </div>-->
          </div>
        </div>
        <!-- 下面按钮组 -->
        <div class="btn-groups">
          <div class="btn1 hand" @click="reset">重置</div>
          <div class="btn2 hand" @click="query">查询</div>
        </div>
      </div>

      <!-- 查看课表按钮组 -->
      <div class="btn-groups1">
        <div class="btn1 hand" @click="courseTimetable">查看课表</div>
        <div class="btn1 hand" @click="watchStudent">查看学生</div>
      </div>
      <!-- 顶部表格 -->
      <div>
        <myclass-table
          ref="childMethod"
          @selectClass="selectClass"
          :tableData="tableData"
        />
      </div>
    </div>
    <!-- 底部分页 -->

    <div class="footer">
      <!-- <page-device
        :total="total"
        @handleCurrentChange="handleCurrentChange"
      /> -->
      <page-device
        @handleCurrentChange="handleCurrentChange"
        :current="current"
        :total="total"
      />
    </div>
    <!-- 遮罩层弹框 -->

    <el-dialog :visible.sync="dialogVisible" :show-close="false" center>
      <myStudent :classId="classId" @handleClose="closeMask" />
    </el-dialog>
  </div>
</template>
<script>
import myclassTable from "./compontsCmps/myclassTable";
import myStudent from "./compontsCmps/my-student";
import { queryMyAllClassList, queryClassStudent } from "@/network/officeCenter";
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      dialogVisible: false, // 遮罩层弹出开关
      current: 1, // 页码
      size: 10, //页条数
      total: 0, //用来分页的总数
      inputClassName: "", //输入班级名
      tableData: [], //获取的列表数据
      classIndex: "", //班级下标
      classId: 0, //班级Id
      selectClassObj: {},
      i: 1, //判断是否是第一次获取数据
    };
  },
  computed: {
    classList() {
      return this.$store.state.classList;
    },
  },
  created() {
    // this.getAllGrade();
    this.init();
  },
  methods: {
    async init() {
      // 页面加载时，给classId初始值
      let pamars = {
        current: 1,
        size: 10,
      };
      let { data, code } = await queryMyAllClassList(pamars);
      if (code == 200) {
        this.tableData = data.list;
        this.total = data.total;
        this.selectClassObj = data.list[0];
        this.classId = data.list[0].id;
        this.$refs.childMethod.chekcout(data.list[0].id);
      }
    },
    change(val) {},
    // 选中的班级
    selectClass(data) {
      this.selectClassObj = data;
      this.classId = data.id;
    },
    //查看班级表格栏
    watchStudent() {
      let that = this;
      that.dialogVisible = true;
    },

    // 查看班级课表
    courseTimetable() {
      let that = this;
      that.$router.push({
        path: "/page/officeCenter/OfficeCenterIndex/test2",
        query: {
          classInfo: JSON.stringify(that.selectClassObj),
        },
      });
    },
    // 查询班级列表
    query() {
      this.get_MyAllClassList();
    },
    // 清空
    reset() {
      this.inputClassName = "";
    },
    // 获取我的班级列表
    async get_MyAllClassList() {
      let pamars = {
        current: this.current,
        size: this.size,
        name: this.inputClassName,
      };
      let { data, code } = await queryMyAllClassList(pamars);
      if (code == 200) {
        this.tableData = data.list;
        this.total = data.total;
      }
    },
    // 跳转我的学生详情
    go_myStudent() {
      this.$router.push({
        path: "/page/officeCenter/OfficeCenterIndex/myStudent",
      });
    },
    // 获取所有年级
    getAllGrade() {
      this.$store.dispatch("getClassList");
    },
    // 分页
    handleCurrentChange(current) {
      // data   分页页数
      this.current = current;
      this.get_MyAllClassList();
    },
    //   关闭遮罩层
    closeMask() {
      this.dialogVisible = false;
    },
  },
  components: {
    myclassTable,
    myStudent,
  },
};
</script>
<style lang="scss" scoped>
/deep/ .el-input__inner {
  padding-left: 6px;
  margin: 0;
  outline: none;
  border: none;
  // width: 100%;
  width: 121px;
  height: 32px;
  background: #ffffff;
  border: 1px solid #efefef;
  border-radius: 3px;
  font-size: 10px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #343434;
}
/deep/ .el-input__icon {
  display: none;
}
/deep/ .el-select-dropdown {
  font-size: 16px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #262626;
}
/deep/ .el-select-dropdown__list li {
  font-size: 16px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #484949;
}
/deep/ .el-select-dropdown__item.hover {
  background: linear-gradient(110deg, #f13232, #ef753c);
  color: #fff;
}

.title {
  font-size: 24px;
  font-family: Source Han Sans CN;
  font-weight: 500;
  color: #343434;
  margin: 20px 0;
}

.box {
  background: #f9f9f9;
  width: 1054px;
  padding: 10px 20px;
  .header {
    display: flex;
    justify-content: space-between;
    .header-tag {
      width: 150px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .tag-left {
        width: 30%;
        white-space: nowrap;
        font-size: 10px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #343434;
      }
      .tag-right {
        outline: none;
        padding-left: 6px;
        width: 98px;
        height: 34px;
        background: #ffffff;
        border: 1px solid #efefef;
        border-radius: 4px;
        font-size: 9px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #4d4d4d;
      }
    }
  }
}
.btn-groups {
  margin: 20px 0;
  width: 100%;
  display: flex;
  font-size: 9px;
  font-family: Source Han Sans CN;
  font-weight: 500;
  .btn1 {
    margin-left: auto;
    width: 80px;
    height: 38px;
    background: #ffffff;
    border: 1px solid #f13a34;
    border-radius: 4px;
    color: #f13a34;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .btn2 {
    width: 80px;
    height: 38px;
    background: linear-gradient(110deg, #f13232, #ef763c);
    border-radius: 4px;
    margin-left: 16px;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.btn-groups1 {
  font-size: 9px;
  font-family: Source Han Sans CN;
  font-weight: 550;
  display: flex;
  margin: 20px 0;
  .btn1 {
    width: 108px;
    height: 38px;
    background: #ffffff;
    border: 1px solid #f13a34;
    border-radius: 3px;
    color: #f13a34;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
  }
}
.footer {
  margin: 20px 0 !important;
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
}
</style>
