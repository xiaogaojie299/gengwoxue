<template>
  <div class="ex-box">
    <!-- 顶部面包屑 -->
    <container>
      <div>

      <breadcrumb-nav>
        <span class="hand" slot="nav-name" @click="go_black">问答广场</span>
        <span slot="nav-child">{{ routeNme }}</span>
      </breadcrumb-nav>

      <!-- 下面内容 -->
      <div class="main">
        <!-- 内容详情 -->
        <div class="exercises-item">
          <!-- 顶部标题 -->
          <div class="top-title">{{ exercisesDetail.question }}</div>
          <!-- 中间内容 -->
          <div class="main-content">
            <!-- 题目详情 -->
            <div class="timer">{{ exercisesDetail.insertTime }}</div>
            <div class="exercises-detail">
              <!-- 如图，若∠1=∠2，∠C=∠D，问∠A与∠F有什么关系，并说明理由？ -->
              {{ exercisesDetail.describe }}
            </div>
            <!-- 题目图片 -->
            <div class="exercises-img">
              <!-- <div class="exercises-img-item" v-for="i in 2" :key="i"></div> -->
              <!-- :preview-src-list="[exercisesDetail.describe]" -->
              <div v-for="(it,i) in exercisesDetail.imgUrl" :key="i">
              <el-image
                style="width: 168px; height: 168px"
                :src="it"
                :preview-src-list="exercisesDetail.imgUrl"
              >
              </el-image>
              </div>
            </div>
          </div>
          <!-- 底部详情 -->
          <div class="footer">
            <span>{{ total }}个回答</span>
          </div>
        </div>
        <!-- 回答列表 -->

        <div class="answer" v-for="(it, i) in answer" :key="i">
          <div class="answer-info">
            <!-- 回答人头像 -->
            <div class="answer-people-img">
              <img :src="it.answerUserAvatar" alt="">
            </div>
            <!-- 回答人回复时间和姓名 -->
            <div class="answer-people">
              <div class="right-box">
                <span class="answer-people-name">{{ it.answerUserName }}</span> 
                <!-- isAdopt 为2的时候为已采纳 -->
                <span class="answer-people-tag hand" v-if="it.isAdopt == 2"
                  >已采纳</span
                >
                <!-- <span @click="toAdopt(i)" class="answer-people-tag hand" v-show="it.isCaina && exercisesDetail.questionUserId==userInfo.id"
                  >置为采纳</span
                > -->
                <span @click="toAdopt(i)" class="answer-people-tag hand" v-show="!isCaina && (it.roleType == 2 && it.userId!==userInfo.id)">置为采纳</span>
                <span class="answer-people-tag hand" v-show="it.roleType == 2 && it.userId==userInfo.id"
                  >我的回答</span
                >
                <span
                  class="answer-delete hand"
                  @click="deleteMyAswer(i)"
                  v-show="it.roleType == 2 && it.userId==userInfo.id"
                  >删除回答</span
                >
              </div>
              <div class="answer-people-time">2020/04/24 14:20</div>
            </div>
          </div>
          <!-- 回答内容 -->
          <div class="answer-content">
            {{ it.answer }}
          </div>
        </div>

        <div class="page-device">
          <page-device
            :total="total"
            @handleCurrentChange="handleCurrentChange"
          />
        </div>
      </div> 

      <!-- 底部回答 -->
      <div class="footer-input">
        <input
          type="text"
          placeholder="回答被采纳后将会获得奖励哦（100字内）"
          v-model="myAnswer"
        />
        <div class="btn hand" @click="letMeAnswer">我来回答</div>
      </div>
      </div>
    </container>
  </div>
</template>
<script>
import {
  queryQuestionAnswerList,
  optAddAnswer,
  optDeleteAnswer,
  optAdoptAnswer
} from "@/network/answersPlaza";
export default {
  data() {
    return {
      exercisesDetail: {},
      routeNme: "",
      url:
        "https://xixisuxi.obs.cn-southwest-2.myhuaweicloud.com/16055437650.png",
      srcList: [
        "https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg",
        "https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg",
      ],
      answer: [],
      current: 1,
      size: 10,
      total: 0,
      myAnswer: "",
      isCaina:false // 判断当前列表是否有已采纳的
    };
  },
  created() {
    this.exercisesDetail = JSON.parse(this.$route.query.exercisesDetail);
    this.get_AnswerList();
  },
  mounted() {
    this.routeNme = this.$route.name;
  },
  computed:{
    userInfo(){
      return this.$store.state.userInfo
    }
  },
  methods: {
    go_black() {
      //返回上一页面
      this.$router.go(-1);
    },

    get_AnswerList() {
      let data = {
        current: this.current,
        size: this.size,
        questionId: this.exercisesDetail.id,
      };
      console.log("data1=====>", data);
      queryQuestionAnswerList(data).then((res) => {
        console.log("问题详情加载成功", res);
        this.answer = res.data.list;
        this.isCaina = res.data.isAdopt==2;  // 1 未采纳 2采纳
        console.log("this.isCaina==>",this.isCaina);
        this.total = res.data.total;
      console.log("this.answer==",this.answer);
      });
    },
    // 删除我的回答
    deleteMyAswer(index) {
      console.log(index, "====>", this.answer);
       this.$confirm('此操作将永久删除该问答, 是否继续?', '提示', {
          confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           let data = {
        answerId: this.answer[index].id,
        questionId: this.exercisesDetail.id,
      };
      optDeleteAnswer(data).then((res) => {
        console.log("删除问题成功", res);
        if (res.code == 200) {
          this.get_AnswerList();
          this.$myMessage("删除回答成功");
        }
      });
        }).catch(() => {
          
        });
    },
    //我来回答
    letMeAnswer() {
      if (!this.myAnswer) {
        this.$myAlert("错误", "回答问题不能为空");
        return;
      }
      let data = {
        questionId: this.exercisesDetail.id,
        answer: this.myAnswer,
      };
      optAddAnswer(data).then((res) => {
        console.log("====回答问题成功", res);
        this.myAnswer = "";
        this.get_AnswerList();
      });
    },
    // 置为采纳
    toAdopt(index){
       let params = {
        answerId: this.answer[index].id,
        questionId: this.exercisesDetail.id,
      };
      optAdoptAnswer(params).then(res=>{
        let {code,data} = res;
        if(code==200){
          this.$myMessage("置为采纳成功");
          this.get_AnswerList();
        }
        console.log(res,"设为采纳成功");
      })
    },

    handleCurrentChange(data) {
      //分页传过来的值
      this.current = data;
      this.get_AnswerList();
    },
  },
};
</script>
<style lang="scss" scoped>
.main {
  // min-height: 679px;
  background: #ffffff;
  box-shadow: 1px 2px 58px 5px rgba(200, 200, 200, 0.32);
  padding: 25px 27px;
  .exercises-item {
    display: flex;
    flex-direction: column;
    // min-height: 300px;

    .top-title {
      font-size: 24px;
      font-family: Source Han Sans CN;
      font-weight: 500;
      color: #343434;
      margin-bottom: 13px;
    }

    .main-content {
      .timer {
        font-size: 16px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #9a9a9a;
        margin-bottom: 4px;
      }
      .exercises-detail {
        font-size: 20px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #9a9a9a;
        margin-bottom: 17px;
      }
      .exercises-img {
        display: flex;
        flex-wrap: nowrap;
        margin-bottom: 15px;
        margin-right: 48px;
        .exercises-img-item {
          width: 168px;
          height: 168px;
          background: #000;
        }
      }
    }
    // 底部
    .footer {
      span {
        font-size: 20px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #9a9a9a;
      }
    }
  }

  .answer {
    margin-top: 17px;
    height: 130px;
    // border: 1px solid red;
    border-top: 1px solid #e2e2e2;
    padding-top: 20px;
    .answer-info {
      display: flex;
      .answer-people-img {
        width: 51px;
        height: 51px;
        
        margin-right: 9px;
        img{
          border-radius: 50%;
          width: 100%;
          height: 100%;
        }
      }
      .answer-people {
        .right-box {
          display: flex;
          .answer-people-name {
            font-size: 20px;
            font-family: Source Han Sans CN;
            font-weight: 500;
            color: #343434;
          }
          .answer-people-tag {
            min-width: 88px;
            height: 26px;
            background: #ffffff;
            border: 1px solid #eb002a;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            // 标签字体

            font-size: 16px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: #eb002a;

            margin-left: 10px;
          }
          .answer-delete {
            width: 84px;
            height: 26px;
            background: #eb002a;
            border-radius: 4px;
            // 字体颜色
            font-size: 16px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: #ffffff;
            margin-left: 10px;
            // 垂直居中
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }

        .answer-people-time {
          font-size: 16px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #9a9a9a;
        }
      }
    }
    .answer-content {
      font-size: 18px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #666666;
      margin-top: 19px;
    }
  }
  .page-device {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px 0;
  }
}
.ex-box{
  min-height: calc(100vh - 210px);
  // position: relative;
}
.footer-input {
  // position: absolute;
  width: 1400px;
  // bottom: 0;
  height: 94px;
  background: #ffffff;
  box-shadow: 1px 4px 51px 9px rgba(197, 197, 197, 0.27);
  border-radius: 4px;
  margin-top: 26px;
  margin-bottom: 20px;
  display: flex;
  input {
    outline: none;
    width: 100%;
    height: 100%;
    font-size: 24px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    padding-left: 21px;
    border: none;
  }
  .btn {
    width: 246px;
    height: 100%;
    background: linear-gradient(110deg, #f13232, #ef763c);
    border-radius: 4px;
    // 字体大小
    font-size: 28px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #ffffff;
    // 垂直居中
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
