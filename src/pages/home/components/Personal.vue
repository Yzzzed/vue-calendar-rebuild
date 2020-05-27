<template>
  <div>
    <div class="card-container" style="overflow:auto; padding: 0 20px;">
      <el-table
        :data="$attrs.userList.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
        class="event-card"
        :default-sort="{prop: 'date', order: 'null'}"
        :row-class-name="tableRowClassName"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <p class="expand-title">详细内容:</p>
            <p class="expand-detail">{{props.row.detail}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="action" label="事件" min-width="25%"></el-table-column>
        <el-table-column
          prop="category"
          label="分类"
          :formatter="formatterCategory"
          sortable
          min-width="25%"
        ></el-table-column>
        <el-table-column prop="date" label="日期" sortable min-width="20%"></el-table-column>
        <el-table-column prop="operationList" label="操作" min-width="30%">
          <template slot-scope="scope">
            <el-button
              type="warning"
              icon="el-icon-edit"
              @click="editShow(scope.row,scope.$index)"
              :disabled="updateDisabled"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="deleteConfirm(scope.row,scope.$index)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 编辑弹窗 -->
      <el-dialog title="编辑" :visible.sync="dialogFormVisible" center>
        <el-form :model="editObj" :rules="rules" hide-required-asterisk @submit.native.prevent>
          <el-form-item label="事件">
            <el-input v-model="editObj.action" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="详情">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              v-model="editObj.detail"
              auto-complete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="时间">
            <el-date-picker
              v-model="editObj.date"
              style="width: 100%;"
              :default-value="Date.now()"
              value-format="yyyy-MM-dd"
              placeholder="请选择时间"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="类别">
            <el-select v-model="editObj.category" placeholder="请选择类别" style="width: 100%;">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editConfirm">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑弹窗 -->
      <!-- 分页器 -->
      <el-pagination
        layout="total, prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :total="$attrs.userList.length"
        :page-size="pageSize"
        class="pagination"
      ></el-pagination>
      <!-- 分页器 -->
    </div>
  </div>
</template>

<style lang="stylus" scoped>
  .card-container
    height 9.444444rem /* 510/54 */
    display flex
    flex-direction column
    justify-content space-between
    .pagination
      display flex
      justify-content center
    .event-card
      width 100%
      // display flex
      // justify-content space-around
      // font-size 0.296296rem /* 16/54 */
      .expand-title
        padding 0 0 0.37037rem /* 20/54 */ 0
        font-weight bolder
  >>>.el-table
    overflow hidden
    .success-row
      background #f0f9eb
</style>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  name: 'Personal',
  data () {
    return {
      dialogFormVisible: false,
      editObj: {
        action: '',
        detail: '',
        date: '',
        category: '',
        _id: ''
      },
      rules: {
        action: [{ required: true, message: '事件不能为空~', trigger: 'blur' }],
        detail: [
          { required: true, message: '详情不能为空~', trigger: 'blur' }
        ],
        date: [{ required: true, message: '时间不能为空~', trigger: 'blur' }],
        category: [{ required: true, message: '类别不能为空~', trigger: 'blur' }]
      },
      // 分页
      dataList: [],
      currentPage: 1,
      pageSize: 5,
      curEventList: [
        {
          action: '吃饭',
          detail: '吃吃吃吃吃吃',
          date: '2016-05-02',
          category: '1'
        },
        {
          action: '吃饭',
          detail: '吃吃吃吃吃吃',
          date: '2016-05-04',
          category: '2'
        },
        {
          action: '吃饭',
          detail: '吃吃吃吃吃吃',
          date: '2016-05-01',
          category: '3'
        }
      ],
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 3600 * 1000 * 24
        },
        shortcuts: [
          {
            text: '今天',
            onClick (picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '明天',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: '后天',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 2)
              picker.$emit('pick', date)
            }
          },
          {
            text: '三天后',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 3)
              picker.$emit('pick', date)
            }
          },
          {
            text: '一周后',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }
        ]
      },
      options: [
        {
          value: '1',
          label: '科研成果'
        },
        {
          value: '2',
          label: '科研项目'
        },
        {
          value: '3',
          label: '科研平台'
        },
        {
          value: '4',
          label: '学术活动'
        },
        {
          value: '5',
          label: '党务工作'
        },
        {
          value: '6',
          label: '办公室业务'
        },
        {
          value: '7',
          label: '其他工作'
        }
      ]
    }
  },
  computed: {
    updateDisabled () {
      const nowDate = moment(new Date()).format('YYYY-MM-DD')
      if (moment(this.$store.state.date).isSameOrAfter(nowDate)) {
        return false
      }
      return true
    }
  },
  methods: {
    // 渲染事件列表格式化
    formatterCategory (row, column) {
      switch (row.category) {
        case '1':
          return '科研成果'
        case '2':
          return '科研项目'
        case '3':
          return '科研平台'
        case '4':
          return '学术活动'
        case '5':
          return '党务工作'
        case '6':
          return '办公室业务'
        case '7':
          return '其他工作'
      }
    },
    editShow (row, _index) {
      // 记录索引
      this.listIndex = _index
      // 记录数据
      this.editObj = JSON.parse(JSON.stringify(row))
      // 显示弹窗
      this.dialogFormVisible = true
    },
    async editConfirm () {
      this.$confirm('确认要修改该日程吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.handleUpdate()
        this.dialogFormVisible = false
      }).catch(() => {
        console.log('failed~')
      })
    },
    async deleteConfirm (row, _index) {
      this.listIndex = _index
      this.$confirm('确认要删除该日程吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.handleDelete(row._id)
      })
    },
    // 处理更新
    async handleUpdate () {
      await axios
        .patch(`/api/events/${this.editObj._id}`, this.editObj)
        .then(() => {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '修改失败'
          })
        })
      await this.getListData()
    },
    async handleDelete (_id) {
      console.log(_id)
      await axios
        .delete(`/api/events/${_id}`)
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '删除失败~'
          })
        })
      await this.getListData()
    },
    getListData () {
      axios.all([
        axios.get(`/api/events/${this.$store.state.date}`),
        axios.get(`/api/events/${this.$store.state.date}/${localStorage.userid}`)
      ]).then(axios.spread((allRes, userRes) => {
        allRes = allRes.data
        userRes = userRes.data
        this.$emit('update', allRes, userRes)
      }))
    },
    // 分页
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
    },
    tableRowClassName ({ row, rowIndex }) {
      if (moment(row.updateTime).isAfter(row.createTime)) {
        return 'success-row'
      }
      return ''
    }
  },
  mounted () {
    console.log('grandson', this.$attrs)
  }
}
</script>
