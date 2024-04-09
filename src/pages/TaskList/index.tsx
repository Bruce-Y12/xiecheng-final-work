// src/pages/TaskList.tsx

import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { getArticles, deleteArticles, updateTaskById, addTask } from '@/services/Task'; // 导入任务相关的接口请求函数
import {  Badge, Button, DatePicker, Form, Input, Modal, Radio, Tabs, Tag, message } from 'antd';
import moment from 'moment';
import { LinkOutlined } from '@ant-design/icons';
import { ReactComponent as UncheckedIcon } from '../../../public/pending.svg';
import { ReactComponent as ApprovedIcon } from '../../../public/approved.svg';
import { ReactComponent as RejectedIcon } from '../../../public/rejected.svg';
import TabPane from 'antd/es/tabs/TabPane';

const TaskList: React.FC = () => {
  const [taskList, setTaskList] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('-1');
  const [visible, setVisible] = useState(false); // 控制新增任务表单的显示隐藏
  const [form] = Form.useForm(); // 获取表单实例
  const [editTask, setEditTask] = useState<any | null>(null);
  const [tabData, setTabData] = useState([
    { label: '全部列表', count: 0, key: '-1' },
    { label: '待审核列表', count: 0, key: '0' },
    { label: '通过列表', count: 0, key: '1' },
    { label: '未通过列表', count: 0, key: '2' },
  ]);


  const fetchData = async (status?: number) => {
    try {
      let articleList;
      if(status){
        articleList = await getArticles(status);
      }
      else{
        articleList = await getArticles();
      }
      console.log("@articleList:", articleList);
      // 对每个文章进行处理
      const processedArticleList = articleList.map(article => {
        return article.dataValues;
      });
      setTaskList(processedArticleList);
      // if(res.code == "201"){
      //   setTaskList(res?.data);
      //   console.log("返回回来的数据为:",res)
      // }
    } catch (error:any) {
      console.error(error?.message);
    }
  };

  const handleStatus = async(record)=>{

  }


  useEffect(() => {
    // 在组件挂载时获取任务列表数据
    fetchData();
  }, []); // 仅在组件挂载时执行一次

  // 定义表格列属性
  const columns: ProColumns<any>[] = [
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
        const images =  JSON.parse(record.images);
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
        )
      }
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
      render:(_, record) => {
        let icon;
        switch (record.status) {
          case 0:
            icon = <UncheckedIcon style={{width: '50px', height: '50px',}}/>;
            break;
          case 1:
            icon = <ApprovedIcon style={{width: '50px', height: '50px',}}/>;
            break;
          case 2:
            icon = <RejectedIcon style={{width: '50px', height: '50px',}}/>;
            break;
          default:
            icon = null;
        }
        return icon;
      }
    },
    {
      title: '审核人',
      dataIndex: 'employee_id',
      width: 100,
      render:(_, record) =>[] 
    },
    {
      title: '操作',
      valueType: 'option',
      width: 150,
      render: (_, record) => {
        console.log("record:", record);
        if (record.status == 0) {
          return [
            <a key="pass" onClick={() => handleStatus(record)}>
              通过
            </a>,
            <a key="reject" onClick={() => handleStatus(record)}>
              拒绝
            </a>,
            <a key="delete" onClick={() => handleDelete(record)}>
              删除
            </a>,
          ];
        } else {
          return null; // 当任务状态不是“未审核”时不显示任何链接
        }
      },
    },
  ];

    // 显示新增任务表单
    const showAddTaskModal = () => {
      setVisible(true);
    };
  
    // 关闭新增任务表单
    const handleCancel = () => {
      setVisible(false);
    };

  const handleAddOrUpdateTask = async () => {
    try {
      const values = await form.validateFields();
      const apiCall = editTask ? updateTaskById({ ...values, taskId: editTask.taskId }) : addTask(values);
      const res = await apiCall;
      if (res.code === '200') {
        fetchData();
        message.success(`${editTask ? '编辑' : '新增'}任务成功！`);
        form.setFieldsValue({ 
          taskName: '',  // 清空任务名称
          description: '',  // 清空任务描述
          state: undefined,  // 清空任务状态（单选框默认为未选中）
          deadline: undefined,  // 清空截止日期
        });
        // form.resetFields();
        setVisible(false);
        setEditTask(null);
      } else {
        message.error(res.msg || `${editTask ? '编辑' : '新增'}任务失败，请稍后重试！`);
      }
    } catch (error) {
      console.error(`${editTask ? '编辑' : '新增'}任务出错:`, error);
      message.error(`${editTask ? '编辑' : '新增'}任务出错，请稍后重试！`);
    }
  };

  const handleEdit = (record: any) => {
    setVisible(true);
    setEditTask(record);
    // 解析日期时间
    const formattedDeadline = record.deadline ? moment(record.deadline) : null;;

    // 将编辑任务的数据填充到表单中，使用格式化后的日期时间
    form.setFieldsValue({
      ...record,
      deadline: formattedDeadline,
    });

    // form.setFieldsValue(record); // 将编辑任务的数据填充到表单中
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
       <Tabs defaultActiveKey="-1" onChange={handleTabChange}>
        {tabData.map(tab => (
          <TabPane
            tab={
              <span style={{ position: 'relative' }}>
                {tab.label}
                {tab.count > 0 && ( // 只有徽标数大于0时才显示徽标
                  <Badge count={tab.count} style={{ position: 'absolute', top: -20, right: -20, width: 20, height: 20, textAlign: 'center', fontSize: tab.count > 9 ? 10 : 12,  }}/>
                )}
              </span>
            }
            key={tab.key}
          >
            <ProTable
              columns={columns}
              dataSource={taskList}
              rowKey="id" // 假设任务数据中有唯一的id作为key
              search={false} // 不显示搜索框
              dateFormatter="string" // 日期格式化为字符串展示
              pagination={{ pageSize: 10 }} // 分页设置
              options={false} // 不显示表格设置
              scroll={{ x: true }} // 启用水平滚动条
            />
          
          </TabPane>
        ))}
      </Tabs>
    </PageContainer>
  );
};

export default TaskList;
