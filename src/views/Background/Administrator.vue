<template>
  <div>
    <div style="margin: 10px 0 ">
      <el-input v-model="selectForm.name" style="width: 200px" placeholder="请输入姓名" :suffix-icon="User"
                class="ml-5"></el-input>
      <el-input v-model="selectForm.username" style="width: 200px" placeholder="请输入账户" :suffix-icon="UserFilled"
                class="ml-5"></el-input>
      <el-button class="ml-5" type="primary" @click="load">搜索</el-button>
    </div>
    <div style="margin: 10px 0">
      <el-button type="primary" :icon="Plus" @click="insertButton">新增</el-button>
      <el-button type="success">导入</el-button>
      <el-button type="success">导出</el-button>
    </div>
    <el-table :data="state.tableData" border stripe
              @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="id" width="190"></el-table-column>
      <el-table-column prop="name" label="姓名" width="150"></el-table-column>
      <el-table-column prop="username" label="账户" width="150"></el-table-column>
      <el-table-column prop="password" label="密码" width="150"></el-table-column>
      <el-table-column prop="permissions" label="权限" width="150"></el-table-column>
      <el-table-column label="操作">
        <template #default="{row}">
          <el-button type="success" :icon="EditPen" @click="updateButton(row)">编辑</el-button>
          <el-popconfirm
              confirm-button-text='确定'
              cancel-button-text='我在想想'
              icon="el-icon-info"
              icon-color="red"
              title="您确定删除吗？"
              @confirm="delete_button(row)" width="160"
          >
            <template #reference>
              <el-button type="danger" :icon="Close" style="margin-left: 25px" slot="reference">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <div class="block">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="selectForm.pageNum"
            :page-sizes="[2, 5, 10, 20]"
            :page-size="selectForm.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="state.total">
        </el-pagination>
      </div>
    </div>
    <!-- 新增表单-->
    <el-dialog title="用户信息新增" v-model="state.dialogFormVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="姓名">
          <el-input v-model="date.data.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="账户名">
          <el-input v-model="date.data.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="date.data.password" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelButton">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {ElMessage} from "element-plus";
import {reactive} from 'vue';
import { Plus, EditPen, Close, User, UserFilled} from "@element-plus/icons-vue";
import {AdminDelete, AdminFindPage, AdminSave, AdminUpdate} from "@/axios/api/Background";

const state = reactive({
  tableData: [],
  dialogFormVisible: false,
  multipleSelection: [],
  total: 0,
})
const date = reactive({data: {}})
const selectForm = reactive({
  pageNum: 1,
  pageSize: 2,
  username: '',
  name: '',
})

const handleSizeChange = (pageSize: any) => {
  selectForm.pageSize = pageSize;
  load();
};

const handleCurrentChange = (pageNum: any) => {
  selectForm.pageNum = pageNum;
  load();
};

const insertButton = () => {
  state.dialogFormVisible = true;
  date.data = {};
};
const updateButton = (row: any) => {
  state.dialogFormVisible = true;
  date.data = row
}
const delete_button = (row: any) => {
  AdminDelete(row).then(map=>{
    if (map.data.code==200){
      ElMessage.success("删除成功")
      load()
    }else {
      ElMessage.error("删除失败")
    }
  })
}

const cancelButton = () => {
  state.dialogFormVisible = false;
  load();
};
const handleSelectionChange = (val: any) => {
  state.multipleSelection = val;
};
const save = () => {
  if (!date.data.id) {
    AdminSave(date.data).then(map => {
      if (map.data.code == 200) {
        ElMessage.success("添加成功")
        load()
        state.dialogFormVisible = false;
      } else {
        ElMessage.error("添加失败")
      }
    })
  }
  if (date.data.id) {
    AdminUpdate(date.data).then(map => {
      if (map.data.code == 200) {
        state.dialogFormVisible = false;
        ElMessage.success("修改成功~")
        load()
      } else {
        ElMessage.error("修改失败！")
      }
    })
  }
}

const load = () => {
  AdminFindPage(selectForm).then(map => {
    state.tableData = map.data.data;
    state.total = map.data.total;
  })
};

AdminFindPage(selectForm).then(map => {
  state.tableData = map.data.data;
  state.total = map.data.total;
})


</script>

<style scoped>

</style>