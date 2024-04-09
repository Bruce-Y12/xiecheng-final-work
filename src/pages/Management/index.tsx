import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { EditableProTable, ProColumns } from '@ant-design/pro-table';
import { getUserInfo, updatePermission } from '@/services/Management';
import {Button, message } from 'antd';
import { useModel } from 'umi';
import { Link } from 'react-router-dom';

const ManagementList: React.FC = () => {
  const [dataSource, setDataSource] = useState<any[]>([]); // 数据源
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]); // 可编辑行的行键
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const isAdmin = currentUser && currentUser.authority === 'admin';

  const fetchData = async () => {
    try {
      const res = await getUserInfo();
      if (res.code === "200") {
        if(res?.data){
            setDataSource(res?.data);
        }
        else{
            message.error("无权限查看");
        }
      }
    } catch (error: any) {
      console.error(error?.message);
    }
  };

  useEffect(() => {
    if(isAdmin){
        fetchData();
    }
  }, []);

  const handleEdit = async (record: any) => {
    // 处理编辑操作，调用接口更新权限等信息
    try {
      const res = await updatePermission({...record}); // 更新权限为选择的角色
      if (res.code === "200") {
        message.success('更新权限成功');
        fetchData(); // 更新数据
      } else {
        message.error(res.msg || '更新权限失败');
      }
    } catch (error: any) {
      console.error(error?.message);
      message.error('更新权限失败，请重试');
    }
  };

  const columns: ProColumns<any>[] = [
    {
      title: '用户id',
      dataIndex: 'uid',
      width: 150,
      editable: false, // 不可编辑
    },
    {
      title: '用户名',
      dataIndex: 'username',
      width: 150,
      editable: false, // 不可编辑
    },
    {
      title: '角色',
      dataIndex: 'authority',
      width: 150,
      valueType: 'select',
      valueEnum: {
        user: { text: '普通用户' },
        admin: { text: '管理员' },
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 150,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.uid);
          }}
        >
          编辑
        </a>,
      ],
    },
  ];

  return (
    isAdmin ?(
        <PageContainer>
        <ProTable
            rowKey="uid"
            headerTitle="系统用户信息"
            columns={columns}
            dataSource={dataSource}
            search={false}
            editable={{
            type: 'single',
            editableKeys,
            onSave: async (_, row) => {
                handleEdit(row);
                fetchData();
            },
            onChange: setEditableRowKeys,
            }}
        />
        </PageContainer>
    ):(
        <div style={{ textAlign: 'center', marginTop: '100px', height: "100%" }}>
            <h1>抱歉，您没有权限访问该页面！</h1>
            <h3>点此回到
                <Link to="/home/taskList">任务列表</Link>页面
            </h3>
            </div>
            
    )
  );
};

export default ManagementList;