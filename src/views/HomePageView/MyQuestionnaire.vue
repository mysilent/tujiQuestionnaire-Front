<template>
  <h1>我的问卷</h1>
  <div v-show="!isTure" class="isNull">
    <n-empty description="你好像还没创作自己的问卷" size="huge">
      <template #extra>
        <n-button @click="push()">
          去创作！
        </n-button>
      </template>
    </n-empty>
  </div>
  <div class="index">
    <div class="box-card" @mouseover="isActive=index" @mouseout="isActive=-1" v-for="(surveys,index) in survey.data"
         :key="index">
      <div class="header-div">
        <div class="image"><img src="../../../src/imager/preview-default.png"
                                style=" width: 100%;height: 100%;object-fit:cover;"></div>
        <div class="state"><span :class="getStateClass(surveys.status)">{{ getStateText(surveys.status) }}</span></div>
        <span class="tag"></span>
      </div>
      <div class="h"><span>{{ surveys.surveyName }}</span></div>
      <div>
        <div class="text-div" v-bind:class="{ 'text-div-add': isActive===index}">
          <span style="flex: auto">{{ getCreateAnswerData(surveys.id) }}份</span>
          <span>
        <span class="id">
      <span class="id-title">ID</span>
      <span class="id-num">{{ surveys.id }}</span>
        </span>
        </span>
        </div>
        <div class="bottom-div" v-bind:class="{ 'bottom-div-add':isActive===index}">
          <el-row>
            <el-tooltip content="发布" effect="light" v-if="surveys.status==='1'">
              <el-button type="warning" :icon="Promotion" circle @click="surveyGold(surveys.id)"/>
            </el-tooltip>
            <el-tooltip content="回收" effect="light" v-if="surveys.status==='0'">
              <el-button type="danger" :icon="Promotion" circle @click="surveyDelGold(surveys.id)"/>
            </el-tooltip>
            <el-tooltip content="预览" effect="light">
              <el-button type="success" :icon="Search" circle @click="preview(surveys.id)"/>
            </el-tooltip>
            <el-tooltip content="修改" effect="light" v-if="surveys.status==='1'">
              <el-button type="primary" :icon="Edit" circle @click="revise(surveys.id)"/>
            </el-tooltip>
            <el-tooltip content="数据分析" effect="light" v-if="surveys.status!=='1'">
              <el-button type="info" :icon="Histogram" circle @click="answerData(surveys.id)"/>
            </el-tooltip>
            <el-popconfirm
                confirm-button-text="是的"
                cancel-button-text="再好好想想"
                title="你真的想删除它吗？"
                @confirm="SurveyDelete(surveys.id)"
                width="220"
            >
              <template #reference>
                <el-button type="danger" :icon="Delete" circle/>
              </template>
            </el-popconfirm>
          </el-row>
        </div>
      </div>
    </div>
  </div>
  <div>
    <el-dialog
        v-model="dialogVisible"
        title="Tips"
        width="30%"
        :before-close="handleClose"
    >
      <span>请输入你要发布的数量~您的激励值:{{ userGold }}</span>
      <el-input v-model="gold.quantity" placeholder="发布份数(不填默认30份)"></el-input>
      <el-input v-model="gold.price" placeholder="每份激励值~(不填默认为0)"></el-input>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">我再想想~</el-button>
        <el-popconfirm
            confirm-button-text="确认发布"
            cancel-button-text="我再想想~"
            title="确认要发布吗?"
            @confirm="confirmEvent"
            @cancel="cancelEvent"
            width="200"
        >
          <template #reference>
        <el-button type="primary">
          发布
        </el-button>
            </template>
  </el-popconfirm>
      </span>
      </template>
    </el-dialog>
  </div>

</template>

<script lang="ts" setup>

import {Search, Edit, Delete, Histogram, Promotion} from "@element-plus/icons-vue";
import {reactive, ref,} from "vue";
import {
  selectUserSurveyApi,
  deleteSurveyApi,
  surveyPublish,
  createAnswerData,
  userGoldApi,
  reviseBySelectStatus,
  surveyStop
} from "@/axios/api/myquestionnaire.api";
import {useLoginStore} from '@/stores/UserLogin'
import {useRouter} from 'vue-router'
import {useAnswerDataStore, usePersonalAnswerStore, useSurveyPreviewStore} from '@/stores/userSurvey'
import {ElMessage, ElMessageBox} from "element-plus";


const PersonalAnswerStore = usePersonalAnswerStore()
const AnswerDataStore = useAnswerDataStore()
const router = useRouter();
const userLogin = useLoginStore();
const isActive = ref(-1);
const user = ref([])
const surveyStore = useSurveyPreviewStore()
const dialogVisible = ref(false)
const AnswerData = reactive({data: []})
const id = reactive({
  id: userLogin.id
})
const survey = reactive({data: []})
const isTure = ref(false)
const gold = reactive({
  id: '',
  userId: userLogin.id,
  price: null,
  quantity: null,
})
const userGold = ref(0)
const selectUserGold = () => {
  userGoldApi(id).then(map => {
    userGold.value = map.data
  })
}

selectUserSurveyApi(id).then(map => {
  survey.data.splice(0, survey.data.length)
  for (let mapKey in map.data.data) {
    isTure.value = true
  }
  survey.data = (map.data.data);
})

createAnswerData(id).then(map => {
  AnswerData.data = map.data
})
const getCreateAnswerData = (state: number) => {
  let a = AnswerData.data[state]
  if (a) {
    return a
  } else {
    return 0
  }
}

const select = () => {
  survey.data.splice(0, survey.data.length)
  selectUserSurveyApi(id).then(map => {
    for (let mapKey in map.data.data) {
      isTure.value = true
    }
    survey.data = (map.data.data);
  })
}
const surveyGold = (id: any) => {
  dialogVisible.value = true
  gold.id = id
  selectUserGold()
}

const surveyDelGold = (id: any) => {
  let surveyId = {
    survey_id: id
  }
  ElMessageBox.alert('确认收回问卷吗', 'Title', {
    confirmButtonText: '确认',
    callback: (action: any) => {
      if (action == "confirm") {
        console.log(surveyId)
        surveyStop(surveyId).then(map => {
          ElMessage.success("操作成功")
          select()
        })
      } else if (action == "cancel") {
      }
    },
  })
}

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('你确定要取消发布吗')
      .then(() => {
        done()
      })
      .catch(() => {
        // catch error
      })
}

//确认发布
const confirmEvent = () => {
  surveyPublish(gold).then(map => {
    if (map.data.code === 200) {
      ElMessage.success("发布成功成功")
    } else if (map.data.code == 1000) {
      ElMessage.error(map.data.msg)
    } else {
      ElMessage.error("好像出错了QAQ")
    }
    select()
  })
  gold.id = ''
  gold.price = null
  gold.quantity = null
  dialogVisible.value = false
}
//取消发布
const cancelEvent = () => {
  gold.id = ''
  gold.price = null
  gold.quantity = null
  dialogVisible.value = false
}


const SurveyDelete = (id: any) => {
  const Id = reactive({
    id: id
  })
  deleteSurveyApi(Id).then(map => {
    if (map.data.code === 200) {
      ElMessage.success("删除成功")
      select()
    } else {
      ElMessage.error("好像出错了QAQ")
    }
  })
}


const getStateText = (state: any) => {
  if (state === '0') {
    return '收集中'
  } else if (state === '2') {
    return '收集完'
  } else if (state === '1') {
    return '未发布'
  } else {
    return '已失效'
  }
}
const getStateClass = (state: any) => {
  if (state === '0') {
    return "state-green"
  } else if (state === '2') {
    return "state-red"
  } else if (state === '1') {
    return "state-yellow"
  } else {
    return "state-info"
  }
}

function answerData(id: any) {
  PersonalAnswerStore.surveyId = id
  AnswerDataStore.cont.id = id
  let newUrl = router.resolve({
    path: '/home/myQuestionnaire/analyse'
  })
  window.open(newUrl.href, "_blank");
}

function preview(id: any) {
  surveyStore.$patch((state) => {
    state.cont.id = id
  })
  router.push({
    name: "preview",
  })
}

function revise(id: any) {
  let surveyId = {
    id: id,
  }
  reviseBySelectStatus(surveyId).then(map => {
    console.log(map.data.data)
    if (map.data.data === '1') {
      surveyStore.$patch((state) => {
        state.cont.id = id
      })
      router.push({
        name: "revise",
      })
    } else {
      ElMessage.error("该问卷已无法修改！")
    }
  })
}

function push() {
  router.push({
    name: "publishQuestionnaire"
  })
}
</script>

<style scoped>
.isNull {
  top: 250px;
  height: auto;
}

el-button {
  pointer-events: none
}

.index {
  display: grid;
  grid-template-columns: repeat(auto-fill, 220px);
  grid-gap: 26px;
  padding: 10px 32px;
}

.image {
  width: 100%;
  height: 100%;
  vertical-align: top;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.state {
  position: absolute;
  left: 8px;
  top: 8px;
}

.state-green {
  color: #1ED261;
  border: 1px solid #1ED261;
  background-color: #F4FDF7;
  border-radius: 4px;
  font-size: 12px;
  padding: 0 6px;
}

.state-red {
  color: #e84118;
  border: 1px solid #e84118;
  background-color: #F4FDF7;
  border-radius: 4px;
  font-size: 12px;
  padding: 0 6px;
}

.state-info {
  color: #999999;
  border: 1px solid #999999;
  background-color: #F4FDF7;
  border-radius: 4px;
  font-size: 12px;
  padding: 0 6px;
}

.state-yellow {
  color: #fcd217;
  border: 1px solid #fcd217;
  background-color: #F4FDF7;
  border-radius: 4px;
  font-size: 12px;
  padding: 0 6px;
}

.text-div {
  display: flex;
  padding: 0 16px;
  height: 24px;
  transition: opacity 0.5s, transform 0.5s, height 1s ease;
}

.text-div-add {
  transform: scale(1, 0.1);
  display: flex;
  padding: 0 16px;
  height: 0;
  opacity: 0;
  transition: opacity 0.5s, transform 0.5s, height 0.7s ease;
}

.tag {
  position: absolute;
  right: 4px;
  bottom: 8px;
}

.id {
  background: #F6F6F6;
  border-radius: 4px;
  padding: 0 4px;
  font-size: 12px;
}

.id-title {
  border-right: 1px solid #ffffff;
  padding-right: 3px;
}

.id-num {
  padding-left: 3px;
}

.box-card {
  width: 220px;
  height: 210px;
  border-radius: 5px;
  transition: border-radius 0.3s, -webkit-box-shadow 0.3s, box-shadow 0.3s, transform 0.5s ease;
  overflow: hidden;
  -webkit-box-shadow: 2px 2px 7px #888888;
  box-shadow: 3px 2px 7px #888888;
}

.box-card:hover {
  border-radius: 5px;
  -webkit-box-shadow: 3px 3px 10px #888888;
  box-shadow: 3px 3px 10px #888888;
  transform: scale(1.05);
}

.bottom-div {
  width: 220px;
  height: 32px;
  display: grid;
  place-items: center;
  opacity: 0;
  transition: opacity 0.3s, height 0.5s ease;
}

.bottom-div-add {
  width: 220px;
  height: 32px;
  display: grid;
  place-items: center;
  /*transform: scale(1, 0.1);*/
  opacity: 1;
  transition: opacity 0.3s, height 0.5s ease;
  /*transition: opacity 0.3s, transform 0.3s ease;*/
}

.header-div {
  background-color: rgb(242, 242, 242);
  width: 220px;
  height: 122px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

.h {
  display: inline-block;
  width: 220px;
  height: 35px;
  font-size: 16px;
  line-height: 26px;
  padding: 8px 16px 8px;
}
</style>