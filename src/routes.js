
import scale from './views/scale.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Table from './views/systemSetting/Table.vue'

import Index from './views/index/Index.vue'
import main from './views/Main.vue'



let routes = [

    {
        path: '/scale',
        component: scale,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        hidden: true,
        redirect: { path: '/index' }
    },
    {
        path: '/index.html',
        hidden: true,
        redirect: { path: '/index' }
    },
   
    {
        path: '/enger/index.html',
        hidden: true,
        redirect: { path: '/index' }
    },
    
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '',
        isActive:false,
        iconCls: 'fa fa-home',
        iconFont:'icon-shouye1',
        leaf: true,//只有一个节点
        children: [
            { path: '/index', component: Index, name: '首页' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '学习模块',
        isActive:false,
        iconCls: 'fa fa-cogs',
        iconFont:'icon-xitongshezhi1',
        children: [
            { path: '/userSetting', pri:['R_ADMIN','R_TRA','R_LAN','R_WAT','R_ENT'],component: Table, name: '表格表单操作小插件',},
        ]
    },

    
    
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;

