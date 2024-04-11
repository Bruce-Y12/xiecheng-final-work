// src/pages/TaskList.tsx

import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { getArticles, deleteArticles, getCountByStatus, updateStatus } from '@/services/Task'; // 导入任务相关的接口请求函数
import { getEmployee } from '@/services/User'; // 导入任务相关的接口请求函数
import {  Badge, Button, Form, Input, Modal, Tabs, message } from 'antd';
import { ReactComponent as UncheckedIcon } from '../../../public/pending.svg';
import { ReactComponent as ApprovedIcon } from '../../../public/approved.svg';
import { ReactComponent as RejectedIcon } from '../../../public/rejected.svg';
import TabPane from 'antd/es/tabs/TabPane';
import { useModel } from 'umi';

const TaskList: React.FC = () => {
  const [taskList, setTaskList] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('-1');
  const [form] = Form.useForm(); // 获取表单实例
  const { initialState, setInitialState } = useModel('@@initialState');
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [recordInfo, setRecordInfo] = useState<any | null>(null);
  const { currentUser } = initialState || {};
  const [tabData, setTabData] = useState([
    { label: '全部列表', count: 0, key: '-1' },
    { label: '待审核列表', count: 0, key: '0' },
    { label: '通过列表', count: 0, key: '1' },
    { label: '未通过列表', count: 0, key: '2' },
  ]);

  // 定义处理函数，获取员工名字
  const processArticle = async (article) => {
    const processedArticle = article.dataValues;
    if (processedArticle.employee_id) {
        const employee = await getEmployee(processedArticle.employee_id);
        processedArticle.employee_name = employee.name;
    }
    return processedArticle;
  };


  const fetchData = async (status?: number) => {
    try {
      let articleList;
      if(status == null){
        articleList = await getArticles();
      }
      else{
        articleList = await getArticles(status);
      }
      // console.log("@articleList:", articleList);
      // 对每个文章进行处理
      const processedArticleList = await Promise.all(articleList.map(processArticle));
      console.log("@processedArticleList", processedArticleList);
      setTaskList(processedArticleList);
      countStatus();
    } catch (error:any) {
      console.error(error?.message);
    }
  };

  const countStatus = async() => {
    const counts = await getCountByStatus();
      const updatedTabData = tabData.map(tab => ({
        ...tab,
        count: counts[tab.key] || 0,
      }));
      // setInitialState({ ...initialState, unreviewedCount: counts['0'] });
      setTabData(updatedTabData);
  };

  const handleStatus = async(record, status)=>{
    record.status = status;
    record.employee_id = currentUser.id;
    try{
      const res = await updateStatus(record);
      fetchData();
      message.success("审核成功");
    }catch(err){
      message.error('审核失败，请稍后重试！');
    }
  }

  useEffect(() => {
    // 在组件挂载时获取任务列表数据
    fetchData();
  }, [initialState?.unreviewedCount]); // 仅在组件挂载时执行一次


  useEffect(() => {
    // 在组件挂载时获取任务列表数据
    fetchData();
  }, []); // 仅在组件挂载时执行一次

   // 根据不同状态选择渲染的列
   const getColumnsByActiveKey = (key: string): ProColumns<any>[] => {
    const commonColumns: ProColumns<any>[] = [
      {
        title: '游记id',
        dataIndex: 'id',
        width: 100,
      },
      {
        title: '游记标题',
        dataIndex: 'title',
        width: 100,
      },
      {
        title: '游记正文',
        dataIndex: 'text',
        width: 200,
      },
      {
        title: '图片',
        dataIndex: 'images',
        width: 200,
        render: (_, record) => {
          const images = JSON.parse(record.images);
          return (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              {Array.isArray(images) && images.length > 0 ? (
                images.map((imageUrl, index) => (
                  <div key={index} style={{ flexBasis: 'calc(50% - 10px)', maxWidth: 'calc(50% - 10px)' }}>
                    <img src={imageUrl} alt={`Image ${index}`} style={{ width: '100%', marginBottom: '20px' }} />
                  </div>
                ))
              ) : (
                <span>暂无图片</span>
              )}
            </div>
          );
        },
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        valueType: 'dateTime',
        width: 200,
      },
      {
        title: '更新时间',
        dataIndex: 'updated_at',
        valueType: 'dateTime',
        width: 200,
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 100,
        render: (_, record) => {
          let icon;
          switch (record.status) {
            case 0:
              icon = <UncheckedIcon style={{ width: '50px', height: '50px' }} />;
              break;
            case 1:
              icon = <ApprovedIcon style={{ width: '50px', height: '50px' }} />;
              break;
            case 2:
              icon = <RejectedIcon style={{ width: '50px', height: '50px' }} />;
              break;
            default:
              icon = null;
          }
          return icon;
        },
      },
    ];

    switch (key) {
      case '-1':
        return [
          ...commonColumns,
          {
            title: '审核人',
            dataIndex: 'employee_name',
            width: 100,
          },
          {
            title: '操作',
            valueType: 'option',
            width: 150,
            render: (_, record) => {
              if (record.status == 0) {
                const canDelete = currentUser.role === 1; // 检查当前用户角色是否为管理员
                return [
                  <a key="pass" onClick={() => handleStatus(record, 1)}>
                    通过
                  </a>,
                  <a key="reject" onClick={() => handleConfirmStatus(record, 2)}>
                    拒绝
                  </a>,
                  canDelete ? (
                    <a key="delete" onClick={() => handleDelete(record)}>删除</a>
                  ) : (
                    <span style={{ color: 'gray' }}>删除</span>
                  ),
                ];
              } else {
                return null; // 当任务状态不是“未审核”时不显示任何链接
              }
            },
          }
        ]
      case '0': // 待审核显示操作栏
        return [
          ...commonColumns,
          {
            title: '操作',
            valueType: 'option',
            width: 150,
            render: (_, record) => {
              console.log("record:", record);
              if (record.status == 0) {
                const canDelete = currentUser.role === 1; // 检查当前用户角色是否为管理员
                return [
                  <a key="pass" onClick={() => handleStatus(record, 1)}>
                    通过
                  </a>,
                  <a key="reject" onClick={() => handleConfirmStatus(record, 2)}>
                    拒绝
                  </a>,
                  canDelete ? (
                    <a key="delete" onClick={() => handleDelete(record)}>删除</a>
                  ) : (
                    <span style={{ color: 'gray' }}>删除</span>
                  ),
                ];
              } else {
                return null; // 当任务状态不是“未审核”时不显示任何链接
              }
            },
          }]
          ;
      case '1':
        return [
          ...commonColumns,
          {
            title: '审核人',
            dataIndex: 'employee_name',
            width: 100,
          },
          {
            title: '审核时间',
            dataIndex: 'audit_at',
            valueType: 'dateTime',
            width: 200,
          },
        ];
      case '2':
        return [
          ...commonColumns,
          {
            title: '审核人',
            dataIndex: 'employee_name',
            width: 100,
          },
          {
            title: '拒绝理由',
            dataIndex: 'rejected_reason',
            width: 100,
          },
          {
            title: '审核时间',
            dataIndex: 'audit_at',
            valueType: 'dateTime',
            width: 200,
          },
        ];
      default:
        return commonColumns; // 默认显示全部列
    }
  };


  // 删除任务
  const handleDelete = async (record: any) => {
    // 删除任务逻辑
    console.log('删除任务', record);
    try {
      // 调用删除任务的接口函数
      const res = await deleteArticles(record.id);
      message.success('删除成功！');
      const updatedTaskList = taskList.filter(task => task.id !== record.id);
      setTaskList(updatedTaskList);
    } catch (error) {
      console.error('删除任务出错:', error);
      message.error('删除任务出错，请稍后重试！');
    }
  };

  const handleConfirmStatus = (record, status) => {
    setRejectModalVisible(true);
    record.status = status;
    setRecordInfo(record);
  };

  const handleRejectConfirm = async() => {
      const values = await form.getFieldsValue();
      setRecordInfo(null);
      handleStatus({...recordInfo,rejected_reason: values.rejected_reason}, 2);
      setRejectModalVisible(false);
  }

  // 切换标签时加载不同的任务列表数据
  const handleTabChange = (key) => {
    setActiveTab(key);
    // 根据标签 key 加载对应的任务列表数据
    if(key == "-1"){
      fetchData();
    }
    else{
      fetchData(parseInt(key));
    }
  };

  return (
    <PageContainer>
      <h2>审核列表</h2>
       <Tabs defaultActiveKey="-1" onChange={handleTabChange}>
        {tabData.map(tab => (
          <TabPane
            tab={
              <span style={{ position: 'relative' }}>
                {tab.label}
                {tab.count > 0 && tab.key == '0' && ( // 只有徽标数大于0时才显示徽标
                  <Badge count={tab.count} style={{ position: 'absolute', top: -20, right: -20, width: 20, height: 20, textAlign: 'center', fontSize: tab.count > 9 ? 10 : 12,  }}/>
                )}
              </span>
            }
            key={tab.key}
          >
            <ProTable
              columns={getColumnsByActiveKey(activeTab)}
              dataSource={taskList}
              rowKey="id" // 假设任务数据中有唯一的id作为key
              search={false} // 不显示搜索框
              dateFormatter="string" // 日期格式化为字符串展示
              pagination={{ pageSize: 5 }} // 分页设置
              options={false} // 不显示表格设置
              scroll={{ x: true }} // 启用水平滚动条
            />
          
          </TabPane>
        ))}
      </Tabs>
      <Modal
        title="拒绝理由"
        open={rejectModalVisible}
        onCancel={() => setRejectModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setRejectModalVisible(false)}>取消</Button>,
          <Button key="submit" type="primary" onClick={handleRejectConfirm}>确认</Button>,
        ]}
      >
        <Form form={form} >
          <Form.Item label="拒绝理由" name="rejected_reason" rules={[{ required: true, message: '请输入拒绝理由' }]}>
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default TaskList;
