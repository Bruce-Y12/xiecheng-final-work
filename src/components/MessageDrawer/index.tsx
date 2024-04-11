import React, { useEffect, useState } from 'react';
import { notification } from 'antd';
import { getCountByStatus } from '@/services/Task'; // 导入任务相关的接口请求函数
import { useModel } from 'umi';

export const MessageDrawer = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [unreviewedCount, setUnreviewedCount] = useState(initialState?.unreviewedCount || 0);

  useEffect(() => {
    const fetchUnreviewedCount = async () => {
      try {
        const response = await  getCountByStatus();
        const count = response["0"];
        if (count > unreviewedCount) {
          notification.open({
            message: '有新的游记待审批哦~',
            description: `当前未审核文章数量为 ${count}`,
          });
          console.log("initialStat", initialState);
        }
        setInitialState({ ...initialState, unreviewedCount: count });
        setUnreviewedCount(count);
      } catch (error) {
        console.error('获取未审核数量失败:', error);
      }
    };

    // 每隔一定时间向后端发起请求，获取未审核数量
    const intervalId = setInterval(fetchUnreviewedCount, 1000); // 5000 毫秒（5 秒）间隔

    // 组件卸载时清除定时器
    return () => clearInterval(intervalId);
  }, [unreviewedCount]); // 当未审核数量发生变化时重新执行 useEffect

  return (
    <div>
      {/* Chat 组件内容 */}
    </div>
  );
};
