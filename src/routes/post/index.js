import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Tabs } from 'antd'
import { routerRedux } from 'dva/router'
import List from './List'

const TabPane = Tabs.TabPane

const EnumPostStatus = {
  UNPUBLISH: 1,
  PUBLISHED: 2,
  BENEFICIARY: 3,
}


const Index = ({ post, dispatch, loading, location }) => {
  const { list, pagination } = post
  const { query = {}, pathname } = location

  const listProps = {
    pagination,
    dataSource: list,
    loading: loading.effects['post/query'],
    onChange (page) {
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize,
        },
      }))
    },
  }

  const listBeneficiaries = {
    fetch: {
      url: 'http://10.1.171.229:9090/api/openaccount/getOpenAccountData',
      data: {
        processInstanceId: 'c5',
        type: 'bfs',
      },
      dataKey: 'data',
    },
    columns: [
      { title: '受益人证件号', dataIndex: 'beneficiaryIdno' },
      { title: '受益人证件类型', dataIndex: 'beneficiaryIdtp' },
      { title: '受益人姓名', dataIndex: 'beneficiaryName' },
      { title: '受益人电话', dataIndex: 'beneficiaryTel' },
      { title: '状态', dataIndex: 'status' }
    ],
    rowKey: 'id',
  }

  const handleTabClick = (key) => {
    dispatch(routerRedux.push({
      pathname,
      query: {
        status: key,
      },
    }))
  }


  return (<div className="content-inner">
    <Tabs activeKey={
      String(EnumPostStatus.BENEFICIARY)
/*      if(query.status === String(EnumPostStatus.UNPUBLISH))
        String(EnumPostStatus.UNPUBLISH)
      else if(query.status === String(EnumPostStatus.PUBLISHED))
        String(EnumPostStatus.PUBLISHED)
      else if(query.status === String(EnumPostStatus.BENEFICIARY))
        String(EnumPostStatus.BENEFICIARY)*/
      //query.status === String(EnumPostStatus.UNPUBLISH) ? String(EnumPostStatus.UNPUBLISH) : String(EnumPostStatus.PUBLISHED)
    } onTabClick={handleTabClick}>
      <TabPane tab="Publised" key={String(EnumPostStatus.PUBLISHED)}>
        <List {...listProps} />
      </TabPane>
      <TabPane tab="Unpublish" key={String(EnumPostStatus.UNPUBLISH)}>
        <List {...listProps} />
      </TabPane>
      <TabPane tab="受益人" key={String(EnumPostStatus.BENEFICIARY)}>
        <List {...listBeneficiaries} />
      </TabPane>
    </Tabs>
  </div>)
}

Index.propTypes = {
  post: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ post, loading }) => ({ post, loading }))(Index)