<template>
    <div
        v-loading="globalLoading"
        element-loading-text="Adding!, Please wait..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
    >
        <div class="permissManaTool">
            <el-input size="small" placeholder="Please enter Role English name" v-model="role.name">
                <template slot="prepend">ROLE_</template>
            </el-input>
            <el-input size="small" placeholder="Please enter Role Chinese name" v-model="role.nameZh" @keydown.enter.native="doAddRole">
            </el-input>
            <el-button type="primary" size="small" icon="el-icon-plus" @click="doAddRole">Add Role</el-button>
        </div>
        <div class="permissManaMain">
            <el-collapse v-model="activeName"
                         v-loading="loading"
                         element-loading-text="Loading, Please wait..."
                         element-loading-spinner="el-icon-loading"
                         element-loading-background="rgba(0, 0, 0, 0.8)"
                         accordion
                         @change="change">
                <el-collapse-item :title="r.nameZh" :name="r.id" v-for="(r,router) in roles" :key="index">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>
                                <h1>Accessible Resources</h1>
                            </span>
                            <el-button style="float: right; padding: 3px 0;color:red" type="text"
                                       icon="el-icon-delete" @click="deleteRole(r)"></el-button>
                        </div>
                        <div>
                            <el-tree show-checkbox
                                     node-key="id"
                                     ref="tree"
                                     :key="index"
                                     :default-checked-keys="selectedMenus"
                                     :data="allMenus" :props="defaultProps"></el-tree>
                            <div style="display: flex;justify-content: flex-end">
                                <el-button @click="cancelUpdate">Cancel Edit</el-button>
                                <el-button type="primary" @click="doUpdate(r.id,index)">Confirm Edit</el-button>
                            </div>
                        </div>
                    </el-card>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PermissMana",
        data() {
            return {
                loading: false,
                globalLoading: false,
                role: {
                    name:'',
                    nameZh:''
                },
                activeName:-1,
                allMenus:[],
                selectedMenus:[],
                roles:[],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                }
            }
        },
        mounted() {
            this.initRoles();
        },
        methods:{
            deleteRole(role) {
                this.$confirm('This Operation will permanently Delete role : '+ role.name  +' , continue?', 'hit', {
                    confirmButtonText: 'Confirm',
                    cancelButtonText: 'cancel',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/basic/permiss/role/"+ role.id).then(resp=>{
                        if (resp) {
                            this.initRoles();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Cancelled Delete'
                    });
                });
            },
            doAddRole() {
                if (this.role.name && this.role.nameZh) {
                    this.globalLoading=true;
                    this.postRequest("/system/basic/permiss/role", this.role).then(resp=>{
                        this.globalLoading=false;
                        if (resp) {
                            this.role.nameZh='';
                            this.role.name = '';
                            this.initRoles();
                        }
                    })
                } else {
                    this.$message.error("Data can not be null!!!");
                }
            },
            cancelUpdate() {
                this.activeName = -1;
            },
            doUpdate(rid, router){
                let tree = this.$refs.tree[index];
                let selectedKeys = tree.getCheckedKeys(true);
                let url='/system/basic/permiss/?rid='+rid;
                selectedKeys.forEach(key=>{
                    url+="&mids="+key;
                });
                this.putRequest(url).then(resp=>{
                    if (resp) {
                        this.activeName = -1;
                    }
                })
            },
            change(rid) {
                if (rid) {
                    this.initAllMenus();
                    this.initSelectedMenus(rid);
                }
            },
            initSelectedMenus(rid) {
              this.getRequest("/system/basic/permiss/mids/"+rid).then(resp=>{
                  console.log('=============' + resp);
                  if (resp) {
                      this.selectedMenus= resp;
                  }
              })
            },
            initAllMenus() {
              this.getRequest("/system/basic/permiss/menus/").then(resp=>{
                  if (resp) {
                      this.allMenus = resp;
                  }
              })
            },
            initRoles() {
                this.loading=true;
                this.getRequest("/system/basic/permiss/").then(resp=>{
                    this.loading=false;
                    if (resp) {
                        this.roles = resp;
                    }
                })
            }
        }

    }
</script>

<style>
    .permissManaTool{
        display: flex;
        justify-content: flex-start;
    }
    .permissManaTool .el-input{
        width: 300px;
        margin-right: 6px;

    }
    .permissManaMain{
        margin-top: 10px;
        width: 700px;
    }

</style>
