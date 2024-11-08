import React from 'react'
import Navbar from '../../components/navbar/Navbar';
import TabBar from '../../components/tabBar/TabBar';
import taskCenterStyle from './taskCenter.module.scss';

function TaskCenter() {
  return (
    <>
        <Navbar></Navbar>
        <main className={taskCenterStyle.main}>
            <div>
            <div className={taskCenterStyle.infoWrapper}>
                Görev merkezi çok yakında...
            </div>
            </div>
        </main>
        <TabBar></TabBar>
    </>
  )
}

export default TaskCenter