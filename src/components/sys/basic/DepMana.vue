<template>
    <div style="width: 500px">
        <el-input
            placeholder="Please enter department name you want to search"
            prefix-icon="el-icon-search"
            v-model="filterText">
        </el-input>

        <el-tree
            :data="deps"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree">
            <span style="display: flex; justify-content: space-between; width: 100%" class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{data.name}}</span>
                <span>
                  <el-button class="depBtn"
                      type="primary"
                      size="mini"
                      @click="() => showAddDepView(data)">
                    Add Department
                  </el-button>
                  <el-button class="depBtn"
                      type="danger"
                      size="mini"
                      @click="() => deleteDep(data)">
                    Delete Department
                  </el-button>
                </span>
            </span>
        </el-tree>
        <el-dialog
            title="Add Department"
            :visible.sync="dialogVisible"
            width="30%">
            <div>
                <!--<div>
                    <el-tag>Reporting to Department</el-tag>
                    <span>{{pname}}</span>
                </div>
                <div>
                    <el-tag>New Department Name</el-tag>
                    <el-input v-model="dep.name" placeholder="Please enter department name"></el-input>
                </div>-->
                <table>
                    <tr>
                        <td><el-tag>Reporting to Department</el-tag></td>
                        <td><span>{{pname}}</span></td>
                    </tr>
                    <tr>
                        <td><el-tag>New Department Name</el-tag></td>
                        <td><el-input v-model="dep.name" placeholder="Please enter dept name..."></el-input></td>
                    </tr>
                </table>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="doAddDep">Confirm</el-button>
            <el-button @click="dialogVisible = false">Cancel</el-button>
        </span>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "DepMana",
        data() {
            return {
                filterText:'',
                dialogVisible: false,
                dep:{
                    name:'',
                    parentId:-1,
                },
                pname:'',
                deps:[],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                }
            }
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        mounted() {
            this.initDeps();
        },
        methods: {
            initDep() {
                this.dep = {
                    name:'',
                    parentId:-1,
                };
                this.pname='';
            },
            addDep2Deps(deps,dep){
              for (let i = 0; i < deps.length; i++) {
                  let d = deps[i];
                  if (d.id === dep.parentId) {
                      d.children = d.children.concat(dep);
                      if (d.children.length > 0) {
                          d.parent = true;
                      }
                      return;
                  } else {
                      this.addDep2Deps(d.children, dep);
                  }
              }
            },
            doAddDep() {
               this.postRequest("/system/basic/department/", this.dep).then(resp=>{
                   if (resp) {
                       this.addDep2Deps(this.deps, resp.obj);
                       this.dialogVisible=false;
                       this.initDep();
                   }
               })
            },
            removeDepFromDeps(p, deps, id){
                for (let i = 0; i < deps.length; i++) {
                    let d = deps[i];
                    if (d.id === id) {
                        deps.splice(i, 1);
                        if (dep.length === 0) {
                            p.parent = false;
                        }
                        return;
                    } else {
                        this.removeDepFromDeps(d, d.children, id);
                    }
                }
            },
            deleteDep(data){
                if(data.parent) {
                    this.$message.error("Super Dept Failed to delete!!!");
                } else {
                    this.$confirm('This operation will permanently delete : ' + data.name + ', continue?', 'hit', {
                        confirmButtonText: 'Confirm',
                        cancelButtonText: 'Cancel',
                        type: 'warning'
                    }).then(() => {
                        this.deleteRequest("/system/basic/department/"+data.id).then(resp=>{
                            if (resp) {
                                this.removeDepFromDeps(null,this.deps, data.id);
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: 'Delete Cancelled....'
                        });
                    });
                }
            },
            showAddDepView(data) {
                this.pname=data.name;
                this.dep.parentId=data.id;
                this.dialogVisible=true;
            },
            initDeps() {
              this.getRequest("/system/basic/department/").then(resp=>{
                  if (resp) {
                      this.deps = resp;
                  }

              })
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            }
        },

    }
</script>

<style>
    .depBtn{
        padding: 2px;
    }
</style>
