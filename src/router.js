import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './views/Login.vue'
import Home from './views/Home'
import FriendChat from './views/chat/FriendChat'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
        hidden: true
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        hidden: true,
        meta: {
            roles:['admin','user']
        },
        children:[
            {
                path: '/chat',
                name: 'Online Chat',
                component: FriendChat,
                hidden: true
            }
        ]
    }

]

const router = new VueRouter({
    routes
})

export default router
