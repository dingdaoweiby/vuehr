<template>
  <div>
    <div style="margin-top: 10px; display: flex; justify-content: center">
        <el-input v-model="keywords" placeholder="Search user by name..." prefix-icon="el-icon-search" style="width: 400px" @keydown.enter.native="doSearch"></el-input>
        <el-button icon="el-icon-search" type="primary" @click="doSearch">Search</el-button>
    </div>
    <div class="hr-container">
          <el-card class="hr-card" v-for="(hr,router) in hrs" :key="index">
              <div slot="header" class="clearfix">
                  <span>{{hr.name}}</span>
                  <el-button style="float: right; padding: 3px 0; color: red" type="text" icon="el-icon-delete" @click="deleteHr(hr)"></el-button>
              </div>
              <div >
                  <div class="img-container">
                      <img :src="hr.userface" :alt="hr.name" :title="hr.name" class="userface-img">
                  </div>
                  <div class="userinfo-container">
                      <div>Username : {{hr.name}}</div>
                      <div>Cellphone : {{hr.phone}}</div>
                      <div>Telepohone: {{hr.telephone}}</div>
                      <div>Address : {{hr.address}}</div>
                      <div>User Status : <el-switch
                          v-model="hr.enabled"
                          active-text="Actived"
                          @change="enabledChange(hr)"
                          active-color="#13ce66"
                          inactive-color="#ff4949"
                          inactive-text="Inactived">
                      </el-switch></div>
                      <div>User Role: <el-tag v-for="(role,indexj) in hr.roles" style="margin-right: 4px" type="success" :key="indexj">{{role.nameZh}}</el-tag>
                          <el-popover
                              placement="right"
                              title="User Role List"
                              @show="showPop(hr)"
                              @hide="hidePop(hr)"
                              width="200"
                              trigger="click">
                              <el-select v-model="selectedRoles" multiple placeholder="请选择">
                                  <el-option
                                      v-for="(r,indexk) in allRoles"
                                      :key="indexk"
                                      :label="r.nameZh"
                                      :value="r.id">
                                  </el-option>
                              </el-select>
                              <el-button slot="reference" icon="el-icon-more" type="text"></el-button>
                          </el-popover></div>
                      <div>Remark: {{hr.remark}}</div>
                  </div>
              </div>
          </el-card>

    </div>
  </div>
</template>

<script>
    export default {
        name: "SysHr",
        data() {
            return {
                keywords:'',
                hrs:[],
                selectedRoles:[],
                allRoles:[]
            }
        },
        mounted() {
            this.initHrs();
        },
        methods: {
            deleteHr(hr) {
                this.$confirm('This operation will permanently delete'+hr.name+', continue?', 'hit', {
                    confirmButtonText: 'Confirm',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/hr/"+hr.id).then(resp=>{
                        if (resp) {
                            this.initHrs();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Cancel delete'
                    });
                });
            },
            doSearch() {
                this.initHrs();
            },
            hidePop(hr) {
                let roles = [];
                Object.assign(roles, hr.roles);
                let flag=false;
                if (roles.length!==this.selectedRoles.length) {
                    flag = true;
                } else {
                    for (let i = 0; i< roles.length; i++) {
                        let role = roles[i];
                        for (let j = 0; j < this.selectedRoles.length; j++) {
                            let sr = this.selectedRoles[j];
                            if (role.id===sr) {
                                roles.splice(i, 1);
                                i--;
                                break;
                            }
                        }
                    }
                    if (roles.length !== 0) {
                        flag=true;
                    }
                }

                if (flag) {
                    let url = '/system/hr/role?hrid=' + hr.id;
                    this.selectedRoles.forEach(sr => {
                        url += '&rids=' + sr;
                    });
                    console.log(url);
                    this.putRequest(url).then(resp => {
                        if (resp) {
                            this.initHrs();
                        }
                    })
                }
            },
            showPop(hr) {
                this.initAllRoles();
                let roles = hr.roles;
                this.selectedRoles = [];
                roles.forEach(r=>{
                    this.selectedRoles.push(r.id);
                })
            },
            enabledChange(hr) {
                delete hr.roles;
                this.putRequest("/system/hr/", hr).then(resp=>{
                    if (resp) {
                        this.initHrs();
                    }
                })
            },
            initAllRoles() {
                this.getRequest("/system/hr/roles/").then(resp=>{
                    this.allRoles=resp;
                })
            },
            initHrs() {
                this.getRequest("/system/hr/?keywords="+this.keywords).then(resp=>{
                    if (resp) {
                        this.hrs = resp;
                    }
                })
            }
        }
    }
</script>

<style>
    .userinfo-container div{
        margin-top: 20px;
        color: #409eff;
    }
    .img-container{
        width: 100%;
        display: flex;
        justify-content: center;
    }
    .userface-img{
        width: 72px;
        height: 72px;
        border-radius: 72px;
    }
    .hr-container{
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
    }
    .hr-card {
        width: 350px;
        margin-bottom: 20px;
    }
</style>
