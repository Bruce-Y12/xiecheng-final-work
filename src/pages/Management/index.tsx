import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { getUserInfo, updatePermission, addEmployee, deleteEmployee } from '@/services/Management';
import {Button, Form, Input, Modal, Radio, message } from 'antd';
import { useModel } from 'umi';
import { Link } from 'react-router-dom';

const ManagementList: React.FC = () => {
  const [dataSource, setDataSource] = useState<any[]>([]); // 数据源
  const [visible, setVisible] = useState(false);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]); // 可编辑行的行键
  const { initialState } = useModel('@@initialState');
  const [form] = Form.useForm(); // 获取表单实例
  const { currentUser } = initialState || {};
  const isAdmin = currentUser && currentUser.role == 1;

  const fetchData = async () => {
    try {
      const res = await getUserInfo();
      const newData = res.map(item => ({
        ...item,
        role: String(item.role) // 将 role 值转换为字符串类型
      }));
      // console.log(res);
      setDataSource(newData);
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
      message.success('更新权限成功');
      fetchData(); // 更新数据
    } catch (error: any) {
      console.error(error?.message);
      message.error('更新权限失败，请重试');
    }
  };
  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      const res = await addEmployee(values);
      message.success(`新增人员成功！`);
      form.setFieldsValue({ 
        name: '',
        password: '',  
        role: undefined,  
      });
      fetchData();
      // form.resetFields();
      setVisible(false);
    } catch (error) {
      message.error(`新增人员出错，请稍后重试！`);
    }
  };

  // 删除员工
  const handleDelete = async (record: any) => {
    // 删除员工逻辑
    console.log('删除员工', record);
    try {
      // 调用删除员工的接口函数
      const res = await deleteEmployee(record.id); 
      // 删除成功，更新人员列表
      const updatedTaskList = dataSource.filter(data => data.id !== record.id);
      setDataSource(updatedTaskList);
      message.success('删除成功！');
    } catch (error) {
      console.error('删除员工出错:', error);
      message.error('删除员工出错，请稍后重试！');
    }
  };

  const columns: ProColumns<any>[] = [
    {
      title: '员工id',
      dataIndex: 'id',
      width: 150,
      editable: false, // 不可编辑
    },
    {
      title: '员工名',
      dataIndex: 'name',
      width: 150,
      editable: false, // 不可编辑
    },
    {
      title: '角色',
      dataIndex: 'role',
      width: 150,
      valueType: 'select',
      valueEnum: {
        "2": { text: '审核人员' },
        "1": { text: '管理员' },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      valueType: 'dateTime',
      width: 200,
      editable: false, 
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      valueType: 'dateTime',
      width: 200,
      editable: false, 
    },
    {
      title: '操作',
      valueType: 'option',
      width: 150,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          权限修改
        </a>,
        <a
          key="deleteable"
          onClick={() => handleDelete(record)}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    isAdmin ?(
        <PageContainer>
          {/* ProTable组件展示任务列表 */}
          <div style={{display:"flex", justifyContent:"space-between", marginBottom:"10px"}}>
            <h2>员工管理</h2>
            <Button type="primary"  onClick={() => setVisible(true)}>新增员工</Button>
          </div>

          {/* 任务表单弹窗 */}
          <Modal
            open={visible}
            title="新增员工"
            onOk={handleAdd}
            onCancel={() => {
              setVisible(false);
            }}
          >
            <Form form={form}>
              <Form.Item
                name="name"
                label="姓名"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="password"
                label="密码"
                rules={[{ required: true, message: '请设置密码' }]}
              >
                 <Input.Password />
              </Form.Item>
              <Form.Item
                name="role"
                label="角色"
                rules={[{ required: true, message: '请选择角色' }]}
              >
                <Radio.Group>
                  <Radio value="1">管理员</Radio>
                  <Radio value="2">审核人员</Radio>
                </Radio.Group>
              </Form.Item>
            </Form>
          </Modal>
          <ProTable
              rowKey="id"
              // headerTitle="系统用户信息"
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
                actionRender: (row, config, dom) => [dom.save, dom.cancel],
              }}
              options={false}
          />
        </PageContainer>
    ):(
        <div style={{ textAlign: 'center', marginTop: '100px', height: "100%" }}>
            <h1>抱歉，您没有权限访问该页面！</h1>
            <h3>点此回到
                <Link to="/home/taskList">审核列表</Link>页面
            </h3>
            </div>
            
    )
  );
};

export default ManagementList;