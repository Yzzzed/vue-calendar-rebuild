<template>
  <div>
    <div class="card-container" style="overflow:auto; padding: 0 20px;">
      <el-table
        :data="$attrs.eventList.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
        class="event-card"
        :default-sort="{prop: 'date', order:' null'}"
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
        <el-table-column prop="date" label="日期" sortable min-width="25%"></el-table-column>
        <el-table-column
          prop="performer"
          :formatter="formatterPerformer"
          label="发布者"
          min-width="25%"
        ></el-table-column>
      </el-table>
      <el-pagination
        layout="total, prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :total="$attrs.eventList.length"
        :page-size="pageSize"
        class="pagination"
      ></el-pagination>
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
import moment from 'moment'
export default {
  name: 'All',
  data () {
    return {
      dataList: [],
      currentPage: 1,
      pageSize: 5
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
    // 事件发布者格式化
    formatterPerformer (row, column) {
      if (row.performer.nickname) return row.performer.nickname
      return row.performer.username
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
    },
    tableRowClassName ({ row, rowIndex }) {
      if (moment(row.updateTime).isAfter(row.createTime)) {
        console.log(row.updateTime, row.createTime)
        return 'success-row'
      }
      return ''
    }
  }
}
</script>
